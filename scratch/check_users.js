const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = 'https://xiqfcritzjabiunfwksn.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhpcWZjcml0emphYml1bmZ3a3NuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2Njk0NzY4NSwiZXhwIjoyMDgyNTIzNjg1fQ.YS-9MTys30-zduxRIz4wNlgIxkVYWuaO0tiDl6fxSRo';
const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  const { data: users, error: uError } = await supabase.from('users').select('*').limit(1);
  if (uError) console.error('Error users:', uError);
  else console.log('users columns:', Object.keys(users[0] || {}));
}

check();
