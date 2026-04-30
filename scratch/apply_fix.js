const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase environment variables');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const sql = `
-- Change date columns to TEXT to allow natural language input from the chatbot
ALTER TABLE public.leads 
ALTER COLUMN incident_date_time TYPE TEXT,
ALTER COLUMN citation_date_time TYPE TEXT,
ALTER COLUMN contact_date_time TYPE TEXT,
ALTER COLUMN "lastUpdate" TYPE TEXT;
`;

async function run() {
    console.log('Applying migration to fix date types...');
    const { error } = await supabase.rpc('exec_sql', { sql_query: sql });
    
    if (error) {
        // If exec_sql RPC doesn't exist, we might need another way or just report it
        console.error('Error applying migration:', error);
        console.log('Note: This script requires an "exec_sql" RPC function in your database.');
    } else {
        console.log('Migration applied successfully!');
    }
}

run();
