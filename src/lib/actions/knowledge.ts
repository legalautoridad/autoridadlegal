'use server';

import { createClient } from '../supabase/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { revalidatePath } from 'next/cache';
import { isAdmin } from './admin-helpers';
import { chunkText } from '../ai/chunking';


const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENAI_API_KEY!);

export type KnowledgeEntry = {
    id?: string;
    content: string;
    is_general: boolean;
    service_type?: string | null;
    location_id?: string | null;
    court_id?: string | null;
    region?: string | null;
    metadata?: any;
};

/**
 * Fetches knowledge entries with optional filters.
 */
export async function getKnowledgeEntries(filters?: {
    location_id?: string | null;
    is_general?: boolean;
    service_type?: string | null;
    region?: string | null;
}) {
    if (!await isAdmin()) throw new Error('Unauthorized');

    const supabase = await createClient();
    let query = supabase.from('juristic_knowledge').select('*').order('created_at', { ascending: false });

    if (filters?.location_id !== undefined) {
        query = query.eq('location_id', filters.location_id);
    }
    if (filters?.is_general !== undefined) {
        query = query.eq('is_general', filters.is_general);
    }
    if (filters?.service_type !== undefined) {
        query = query.eq('service_type', filters.service_type);
    }
    if (filters?.region !== undefined) {
        query = query.eq('region', filters.region);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
}

/**
 * Creates or updates a knowledge entry and generates its embedding.
 */
export async function upsertKnowledgeEntry(entry: KnowledgeEntry) {
    if (!await isAdmin()) throw new Error('Unauthorized');

    const supabase = await createClient();
    const model = genAI.getGenerativeModel({ model: "gemini-embedding-001" });

    // 1. Generate Embedding (3072 dims for gemini-embedding-001)
    console.log('Generating embedding for content length:', entry.content.length);
    const result = await model.embedContent(entry.content);
    const embedding = result.embedding.values;

    // 2. Prepare Data
    const data = {
        content: entry.content,
        embedding: embedding,
        is_general: entry.is_general,
        service_type: entry.service_type || null,
        location_id: entry.is_general ? null : entry.location_id,
        court_id: entry.is_general ? null : entry.court_id,
        region: entry.region || null,
        metadata: entry.metadata || {},
        updated_at: new Date().toISOString()
    };

    if (entry.id) {
        // Update
        const { error } = await supabase
            .from('juristic_knowledge')
            .update(data)
            .eq('id', entry.id);
        if (error) throw error;
    } else {
        // Insert
        const { error } = await supabase
            .from('juristic_knowledge')
            .insert(data);
        if (error) throw error;
    }

    revalidatePath('/admin/knowledge');
    return { success: true };
}

/**
 * Deletes a knowledge entry.
 */
export async function deleteKnowledgeEntry(id: string) {
    if (!await isAdmin()) throw new Error('Unauthorized');

    const supabase = await createClient();
    const { error } = await supabase
        .from('juristic_knowledge')
        .delete()
        .eq('id', id);

    if (error) throw error;

    revalidatePath('/admin/knowledge');
    return { success: true };
}

/**
 * Uploads a document to the al-context-cache bucket.
 */
export async function uploadToBucketAction(formData: FormData) {
    if (!await isAdmin()) throw new Error('Unauthorized');

    const file = formData.get('file') as File;
    if (!file) throw new Error('No se ha proporcionado ningún archivo');

    if (!file.name.endsWith('.pdf') && !file.name.endsWith('.txt') && !file.name.endsWith('.md')) {
        throw new Error('Solo se permiten archivos PDF, TXT o MD');
    }

    const { createAdminClient } = await import('../supabase/server');
    const supabase = await createAdminClient();

    const { error } = await supabase.storage.from('al-context-cache').upload(file.name, file, {
        upsert: true
    });

    if (error) {
        console.error('Upload Error:', error);
        throw new Error(`Error subiendo al bucket: ${error.message}`);
    }

    return { success: true, message: `Archivo ${file.name} subido correctamente al Bucket.` };
}

/**
 * Syncs the entire bucket to the RAG database.
 */
export async function syncBucketToRAGAction() {
    if (!await isAdmin()) throw new Error('Unauthorized');
    
    const { createAdminClient } = await import('../supabase/server');
    const supabase = await createAdminClient();

    // 1. Delete all knowledge
    console.log('[SYNC] Deleting all from juristic_knowledge');
    const { error: deleteError } = await supabase.from('juristic_knowledge').delete().not('id', 'is', null);
    if (deleteError) throw new Error(`Error vaciando RAG: ${deleteError.message}`);

    // 2. Fetch from bucket
    console.log('[SYNC] Listing bucket files');
    const { data: files, error: listError } = await supabase.storage.from('al-context-cache').list();
    if (listError) throw new Error(`Error listando bucket: ${listError.message}`);

    if (!files || files.length === 0) {
        revalidatePath('/admin/knowledge');
        return { success: true, message: 'Bucket vacío. RAG limpiado exitosamente.' };
    }

    let successCount = 0;
    
    for (const file of files) {
        if (file.name.startsWith('.') || file.id === null) continue;
        console.log(`[SYNC] Downloading ${file.name}`);
        const { data: fileBlob, error: downloadError } = await supabase.storage.from('al-context-cache').download(file.name);
        if (downloadError || !fileBlob) continue;

        const buffer = Buffer.from(await fileBlob.arrayBuffer());
        let text = '';
        
        try {
            if (file.name.endsWith('.pdf')) {
                const pdf = require('pdf-parse');
                const data = await pdf(buffer);
                text = data.text;
            } else {
                text = new TextDecoder('utf-8').decode(buffer);
            }
        } catch (err: any) {
            console.error(`Error parseando ${file.name}:`, err);
            continue;
        }

        if (!text || text.trim().length === 0) continue;

        const chunks = chunkText(text, 1200, 200);
        console.log(`[SYNC] Generando ${chunks.length} chunks para ${file.name}`);

        const model = genAI.getGenerativeModel({ model: "gemini-embedding-001" });

        for (const chunk of chunks) {
            try {
                // Generar embedding
                const result = await model.embedContent(chunk);
                const embedding = result.embedding.values;

                const knData = {
                    content: chunk,
                    embedding: embedding,
                    is_general: true, // Para el volcado general lo asumimos
                    service_type: 'alcoholemia', // By default general logic
                    location_id: null,
                    court_id: null,
                    region: null,
                    metadata: { source_file: file.name, ingested_at: new Date().toISOString() },
                    updated_at: new Date().toISOString()
                };

                const { error: insertError } = await supabase.from('juristic_knowledge').insert(knData);
                if (insertError) {
                    console.error('Insert error:', insertError);
                } else {
                    successCount++;
                }
            } catch (err) {
                console.error(`Error procesando chunk de ${file.name}:`, err);
            }
        }
    }

    revalidatePath('/admin/knowledge');
    return { success: true, message: `Sincronización completada: ${successCount} fragmentos generados e insertados.` };
}
