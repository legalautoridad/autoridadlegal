
import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

// Manually load .env.local
try {
    const envPath = path.resolve('.env.local');
    if (fs.existsSync(envPath)) {
        const envConfig = fs.readFileSync(envPath, 'utf-8');
        envConfig.split('\n').forEach(line => {
            const [key, value] = line.split('=');
            if (key && value) {
                process.env[key.trim()] = value.trim().replace(/^["']|["']$/g, '');
            }
        });
    }
} catch (e) {
    console.warn('Could not load .env.local manually');
}

const RED = '\x1b[31m';
const GREEN = '\x1b[32m';
const YELLOW = '\x1b[33m';
const RESET = '\x1b[0m';

function log(status: 'pass' | 'fail' | 'warn', message: string) {
    const icon = status === 'pass' ? '✅' : status === 'fail' ? '❌' : '⚠️';
    const color = status === 'pass' ? GREEN : status === 'fail' ? RED : YELLOW;
    console.log(`${icon} ${color}${message}${RESET}`);
}

async function main() {
    console.log(`\n🛡️  DBA SAFETY CHECK: LEADS DEPENDENCIES\n`);

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
        log('fail', 'Missing credentials.');
        process.exit(1);
    }

    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

    // 1. CHECK FOREIGN KEYS POINTING TO LEAD S
    // We query information_schema.referential_constraints
    // but easier via rpc if we had access, or just logical checks on known tables.
    // Let's assume standard client access restrictions, so we might check 'transactions' directly if user mentioned it.

    // Check if 'transactions' has 'lead_id'
    // NOTE: In our file analysis, we saw 'transactions' table in schema.sql but 'wallet_transactions' in migration.
    // 'wallet_transactions' references 'cases'.
    // 'transactions' in schema.sql didn't seem to have lead_id, but let's verify if columns exist.

    const { data: cols, error: colError } = await supabase
        .from('transactions')
        .select('*')
        .limit(1);

    if (colError && colError.code === '42P01') {
        log('pass', "Table 'transactions' does not exist (Safe).");
    } else if (colError) {
        log('warn', `Error checking 'transactions': ${colError.message}`);
    } else {
        // Table exists, check for lead_id or references
        if (cols && cols.length > 0) {
            const keys = Object.keys(cols[0]);
            if (keys.includes('lead_id')) {
                log('fail', "Table 'transactions' Has 'lead_id' column.");
                // Count rows with non-null lead_id
                const { count } = await supabase
                    .from('transactions')
                    .select('*', { count: 'exact', head: true })
                    .not('lead_id', 'is', null);

                if (count && count > 0) {
                    log('fail', `CRITICAL: Found ${count} transactions linked to leads.`);
                } else {
                    log('pass', "Table 'transactions' has 'lead_id' but 0 rows linked.");
                }
            } else {
                log('pass', "Table 'transactions' exists but NO 'lead_id' column found.");
            }
        } else {
            log('pass', "Table 'transactions' exists but is empty.");
        }
    }

    // Check specific user concern about 'lead_id' in 'transactions'
    // Also check logical FKs in 'wallet_transactions' just in case
    const { data: wTx } = await supabase.from('wallet_transactions').select('*').limit(1);
    // Likely uses case_id as per migration, but let's be sure no lead_id was added manually
    if (wTx && wTx.length > 0 && 'lead_id' in wTx[0]) {
        log('fail', "'wallet_transactions' has 'lead_id'. Checking data...");
        const { count } = await supabase.from('wallet_transactions').select('*', { count: 'exact', head: true }).not('lead_id', 'is', null);
        if (count && count > 0) log('fail', `Found ${count} wallet_transactions linked to leads.`);
    }

    // 2. CHECK LEADS DATA COUNT
    const { count: leadCount } = await supabase.from('leads').select('*', { count: 'exact', head: true });
    console.log(`\n--- LEADS TABLE STATUS ---`);
    if (leadCount === 0) {
        log('pass', "Table 'leads' is EMPTY. Safe to drop.");
    } else {
        log('warn', `Table 'leads' contains ${leadCount} rows.`);

        // Sample data to see if it's test data
        const { data: leads } = await supabase.from('leads').select('customer_email, is_test_data').limit(3);
        console.log("Sample Leads:", leads);
    }

    console.log(`\n-------------------------------------`);
}

main().catch(console.error);
