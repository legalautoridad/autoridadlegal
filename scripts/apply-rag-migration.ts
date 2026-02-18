import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function applyMigration() {
    const migrationPath = path.join(process.cwd(), 'supabase', 'migrations', '20260218_setup_vector_rag.sql');
    const sql = fs.readFileSync(migrationPath, 'utf8');

    console.log('Applying migration to enable pgvector and setup RAG table...');

    // We split by ';' but carefully to handle the function body (which contains ;)
    // Actually, it's safer to use an RPC that can execute SQL or similar, 
    // but in Supabase client there isn't a direct .sql() method.
    // However, we can use the 'postgres' extension or similar if enabled.
    // For now, let's try to execute it as one block via a specific internal RPC if it exists,
    // or just inform the user that this specific DDL might need manual application if the client fails.

    // Attempting to execute via a common pattern:
    const { error } = await supabase.rpc('exec_sql', { sql_query: sql }).catch(() => {
        return { error: { message: 'RPC exec_sql not found. This is normal. I will attempt another way.' } };
    });

    if (error) {
        console.log('Note: RPC execution failed. This usually requires manual application in the Supabase Dashboard SQL Editor.');
        console.log('Migration SQL is ready at:', migrationPath);
        process.exit(1);
    } else {
        console.log('Migration applied successfully!');
    }
}

applyMigration();
