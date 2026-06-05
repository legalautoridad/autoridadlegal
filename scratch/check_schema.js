const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = 'https://xiqfcritzjabiunfwksn.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhpcWZjcml0emphYml1bmZ3a3NuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2Njk0NzY4NSwiZXhwIjoyMDgyNTIzNjg1fQ.YS-9MTys30-zduxRIz4wNlgIxkVYWuaO0tiDl6fxSRo';
const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  const { data: members, error: mError } = await supabase.from('lawyer_members').select('*').limit(1);
  if (mError) console.error('Error lawyer_members:', mError);
  else console.log('lawyer_members columns:', Object.keys(members[0] || {}));

  const { data: profiles, error: pError } = await supabase.from('lawyer_profiles').select('*').limit(1);
  if (pError) console.error('Error lawyer_profiles:', pError);
  else console.log('lawyer_profiles columns:', Object.keys(profiles[0] || {}));
}

check();
