import { createStaticClient } from '@/lib/supabase/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENAI_API_KEY!);

export async function getVectorContext(query: string, locationId?: string, serviceType?: string) {
  try {
    if (!query || query.trim() === '') {
      return '';
    }

    console.log('[RAG] Fetching context for:', query);

    // Using static client with ANON key for read-only knowledge retrieval
    const supabase = createStaticClient();

    // Using gemini-embedding-001 as it supports up to 3072 dimensions which matches the DB
    const model = genAI.getGenerativeModel({ model: "gemini-embedding-001" });

    // 1. Generate embedding for the user query
    const result = await model.embedContent(query);
    const embedding = result.embedding.values;

    if (!embedding || embedding.length === 0) {
      console.error('[RAG] Failed to generate embedding');
      return '';
    }

    // 2. Query Supabase for relevant context
    // Added p_region: null to resolve ambiguity between overloaded match_knowledge functions
    const { data: matches, error } = await supabase.rpc('match_knowledge', {
      query_embedding: embedding,
      match_threshold: 0.5, // 50% similarity
      match_count: 5,        // Top 5 results
      p_location_id: locationId || null,
      p_service_type: serviceType || null,
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
