const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = 'https://xiqfcritzjabiunfwksn.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhpcWZjcml0emphYml1bmZ3a3NuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2Njk0NzY4NSwiZXhwIjoyMDgyNTIzNjg1fQ.YS-9MTys30-zduxRIz4wNlgIxkVYWuaO0tiDl6fxSRo';
const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  const { data, error } = await supabase
    .from('lawyer_members')
    .select('id, full_name, is_verified, lawyer_profiles(is_verified)')
    .limit(5);
    
  if (error) console.error(error);
  else console.log(JSON.stringify(data, null, 2));
}

check();
