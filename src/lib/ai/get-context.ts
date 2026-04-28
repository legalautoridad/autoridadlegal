import { createClient } from '../supabase/server';
import { getEmbeddingModel } from './providers';
import { embed } from 'ai';

/**
 * Retrieves relevant context from the vector database based on a query.
 */
export async function getVectorContext(
  query: string,
  location_id?: string,
  profile: 'alcoholemia' | 'general' = 'alcoholemia'
): Promise<string> {
  console.log(`[RAG] Generating context for: "${query.substring(0, 30)}..."`);
  try {
    const supabase = await createClient();
    const embedModel = getEmbeddingModel();
    console.log('[RAG] Using embedding model:', embedModel.modelId);

    // 1. Generate embedding for the user query
    const { embedding } = await embed({
      model: embedModel as any,
      value: query,
    });

    // Manual slice to 768 as a safety measure for Supabase
    const finalEmbedding = embedding.length > 768 ? embedding.slice(0, 768) : embedding;

    // 2. Search relevant knowledge in Supabase
    // Using the match_knowledge RPC function
    const { data: matches, error } = await supabase.rpc('match_knowledge', {
      query_embedding: finalEmbedding,
      match_threshold: 0.5,
      match_count: 5,
      p_location_id: location_id || null,
      p_service_type: profile,
      p_region: null
    });

    if (error) {
      console.error('[RAG] Supabase RPC Error:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
      return '';
    }

    if (!matches || matches.length === 0) {
      console.log('[RAG] No matches found.');
      return '';
    }

    // 3. Format context
    const contextLines = matches.map((m: any) => m.content);

    return `
=== CONOCIMIENTO JURÍDICO ESPECÍFICO (RAG VECTORIAL) ===
Instrucción: Usa la siguiente información técnica para proporcionar una respuesta experta. 
Diferencia si la información es GENERAL o Específica de una ubicación.

${contextLines.join('\n\n')}
=== FIN CONOCIMIENTO ESPECÍFICO ===
    `;
  } catch (error: any) {
    console.error('[RAG] Unexpected Error:', error?.message || error);
    return '';
  }
}

/**
 * @deprecated Use getVectorContext for dynamic RAG
 */
export function getContextForService(service: string = 'alcoholemia') {
  return '';
}
