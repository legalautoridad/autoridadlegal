'use server';

import { createClient, createAdminClient } from '@/lib/supabase/server';
import { isAdmin } from './admin-helpers';
import { revalidatePath } from 'next/cache';
import { embed } from 'ai';
import { getEmbeddingModel } from '@/lib/ai/providers';

export async function getKnowledgeRecords() {
    const supabase = await createClient();
    if (!(await isAdmin())) throw new Error('Unauthorized');

    const adminClient = await createAdminClient();
    const { data, error } = await adminClient
        .from('juristic_knowledge')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching knowledge records:', error);
        throw error;
    }
    return data;
}

export async function upsertKnowledgeRecord(record: any) {
    const supabase = await createClient();
    if (!(await isAdmin())) throw new Error('Unauthorized');

    const adminClient = await createAdminClient();
    const embedModel = getEmbeddingModel();

    // 1. Generate embedding if content is provided
    let embedding = record.embedding;
    if (record.content) {
        try {
            console.log('[KNOWLEDGE_ACTION] Generating embedding for content...');
            const { embedding: newEmbedding } = await embed({
                model: embedModel as any,
                value: record.content,
            });
            // Slice to 768 to match database constraint if needed
            // (Previous migrations suggest it was changed to 768)
            embedding = newEmbedding.length > 768 ? newEmbedding.slice(0, 768) : newEmbedding;
            console.log('[KNOWLEDGE_ACTION] Embedding generated successfully. Dim:', embedding.length);
        } catch (error) {
            console.error('[KNOWLEDGE_ACTION] Error generating embedding:', error);
            // We continue without updating embedding if it fails, or throw
            throw new Error('Error al generar el vector de conocimiento (Embedding).');
        }
    }

    const { data, error } = await adminClient
        .from('juristic_knowledge')
        .upsert({
            ...record,
            embedding,
            updated_at: new Date().toISOString(),
        })
        .select()
        .single();

    if (error) {
        console.error('Error upserting knowledge record:', error);
        throw error;
    }
    
    revalidatePath('/admin/knowledge');
    return data;
}

export async function deleteKnowledgeRecord(id: string) {
    const supabase = await createClient();
    if (!(await isAdmin())) throw new Error('Unauthorized');

    const adminClient = await createAdminClient();
    const { error } = await adminClient
        .from('juristic_knowledge')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Error deleting knowledge record:', error);
        throw error;
    }
    
    revalidatePath('/admin/knowledge');
    return { success: true };
}
