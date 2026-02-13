import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'

// Load env
dotenv.config({ path: path.resolve(__dirname, '../.env.local') })

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function checkDatabase() {
    console.log('--- Database Diagnostic ---')

    const { data: users, error: usersError } = await supabase.from('users').select('*')
    if (usersError) console.error('Error fetching users:', usersError.message)
    else {
        console.log('Admins in "users" table:')
        console.table(users.map(u => ({ id: u.id, email: u.email, role: u.role })))
    }

    const { data: members, error: membersError } = await supabase.from('lawyer_members').select('*')
    if (membersError) console.error('Error fetching members:', membersError.message)
    else {
        console.log('Members in "lawyer_members" table:')
        console.table(members.map(m => ({ id: m.id, email: m.email })))
    }
}

checkDatabase()
