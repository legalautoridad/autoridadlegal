import { createClient } from '@supabase/supabase-js';
import { GoogleGenerativeAI } from '@google/generative-ai';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENAI_API_KEY!);

export async function getVectorContext(query: string, locationId?: string, serviceType?: string) {
  try {
    console.log('[RAG] Fetching context for:', query);
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const model = genAI.getGenerativeModel({ model: "gemini-embedding-001" });

    // 1. Generate embedding for the user query
    const result = await model.embedContent(query);
    const embedding = result.embedding.values;

    if (!embedding || embedding.length === 0) {
      console.error('[RAG] Failed to generate embedding');
      return '';
    }

    // 2. Query Supabase for relevant context
    const { data: matches, error } = await supabase.rpc('match_knowledge', {
      query_embedding: embedding,
      match_threshold: 0.5, // 50% similarity
      match_count: 5,        // Top 5 results
      p_location_id: locationId || null,
      p_service_type: serviceType || null
    });

    if (error) {
      console.error('[RAG] Supabase RPC Error:', JSON.stringify(error, null, 2));
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
