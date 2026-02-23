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
 * Ingests a document (PDF or TXT), chunks it, and saves it to the knowledge base.
 */
export async function ingestDocumentAction(formData: FormData) {
    if (!await isAdmin()) throw new Error('Unauthorized');

    const file = formData.get('file') as File;
    if (!file) throw new Error('No se ha proporcionado ningún archivo');

    const isGeneral = formData.get('is_general') === 'true';
    const serviceType = formData.get('service_type') as string || null;
    const locationId = formData.get('location_id') as string || null;
    const courtId = formData.get('court_id') as string || null;
    const region = formData.get('region') as string || null;

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    let text = '';

    try {
        if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
            const pdf = require('pdf-parse');
            const data = await pdf(buffer);
            text = data.text;
        } else {
            // Assume text for everything else (like .txt)
            text = new TextDecoder().decode(bytes);
        }
    } catch (error: any) {
        console.error('Error extracting text from file:', error);
        throw new Error('Error al extraer texto del archivo: ' + error.message);
    }

    if (!text || text.trim().length === 0) {
        throw new Error('El archivo parece estar vacío o no se pudo extraer texto.');
    }

    // 1. Chunking
    const chunks = chunkText(text, 1200, 200);
    console.log(`Ingesting document: ${file.name}. Total chunks: ${chunks.length}`);

    // 2. Process chunks (in sequence or batch)
    // To avoid rate limits and better tracking, we'll do them sequentially or in small batches
    const results = [];
    for (const chunk of chunks) {
        try {
            await upsertKnowledgeEntry({
                content: chunk,
                is_general: isGeneral,
                service_type: serviceType,
                location_id: isGeneral ? null : locationId,
                court_id: isGeneral ? null : courtId,
                region: region,
                metadata: {
                    source_file: file.name,
                    ingested_at: new Date().toISOString()
                }
            });
            results.push({ success: true });
        } catch (error) {
            console.error('Error processing chunk:', error);
            results.push({ success: false, error });
        }
    }

    revalidatePath('/admin/knowledge');

    const successCount = results.filter(r => r.success).length;
    return {
        success: true,
        message: `Ingesta completada: ${successCount} de ${chunks.length} fragmentos procesados.`
    };
}
