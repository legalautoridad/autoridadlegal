import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function performBackup() {
    const tables = [
        'users',
        'lawyer_members',
        'lawyer_profiles',
        'locations',
        'courts',
        'articles'
    ];

    const backupDir = path.join(process.cwd(), 'backups');
    if (!fs.existsSync(backupDir)) {
        fs.mkdirSync(backupDir);
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupPath = path.join(backupDir, `backup-${timestamp}.json`);

    const backupData: Record<string, any> = {};

    console.log('Starting backup...');

    for (const table of tables) {
        console.log(`Backing up table: ${table}...`);
        const { data, error } = await supabase.from(table).select('*');

        if (error) {
            console.error(`Error backing up ${table}:`, error.message);
            backupData[table] = { error: error.message };
        } else {
            console.log(`Successfully fetched ${data.length} rows from ${table}.`);
            backupData[table] = data;
        }
    }

    fs.writeFileSync(backupPath, JSON.stringify(backupData, null, 2));
    console.log(`\nBackup saved to: ${backupPath}`);
}

performBackup();
