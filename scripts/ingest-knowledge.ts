import { createClient } from '@supabase/supabase-js';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENAI_API_KEY!);

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function ingestKnowledge() {
    console.log('--- Starting Knowledge Ingestion (3072 dims) ---');

    // 1. Read source
    const filePath = path.join(process.cwd(), 'src', 'content', 'reference', 'FAQ_SOURCE.md');
    if (!fs.existsSync(filePath)) return console.error('FAQ file not found');
    const content = fs.readFileSync(filePath, 'utf8');

    // 2. Split by numbered questions
    const sections = content.split(/\n(?=\d+\\?\.\s+¿)/).filter(s => s.trim().length > 10);
    console.log(`Found ${sections.length} quality sections to process.`);

    const genModel = genAI.getGenerativeModel({ model: "gemini-embedding-001" });

    for (let section of sections) {
        const text = section.trim();
        console.log(`Ingesting: ${text.substring(0, 60)}...`);

        try {
            const result = await genModel.embedContent(text);
            const embedding = result.embedding.values;

            const { error } = await supabase
                .from('juristic_knowledge')
                .insert({
                    content: text,
                    embedding: embedding,
                    is_general: true,
                    metadata: { source: 'FAQ_SOURCE.md', chars: text.length }
                });

            if (error) {
                console.error(`Supabase Error: ${error.message}`);
                if (error.message.includes('dimensions')) {
                    console.error(`Dimension mismatch! Expected ${embedding.length} but table might be different.`);
                }
            } else {
                console.log('✓ Success');
            }
        } catch (e: any) {
            console.error(`IA Error: ${e.message}`);
        }
    }
    console.log('--- Ingestion Complete ---');
}

ingestKnowledge();
