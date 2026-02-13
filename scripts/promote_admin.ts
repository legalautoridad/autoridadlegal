import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function promoteToAdmin(email: string) {
    console.log(`Promoting ${email} to admin...`);

    // 1. Get user by email
    const { data: { users }, error: authError } = await supabase.auth.admin.listUsers();
    if (authError) throw authError;

    const user = users.find(u => u.email === email);
    if (!user) throw new Error(`User with email ${email} not found`);

    // 2. Insert into users table
    const { error: dbError } = await supabase
        .from('users')
        .upsert({
            id: user.id,
            email: user.email,
            full_name: user.user_metadata?.full_name || 'Admin User',
            role: 'ADMIN'
        }, { onConflict: 'id' });

    if (dbError) throw dbError;

    console.log(`Successfully promoted ${email} to admin (ID: ${user.id})`);
}

promoteToAdmin('d.imperatori.bou@gmail.com').catch(console.error);
