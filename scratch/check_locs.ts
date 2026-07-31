import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { createStaticClient } from '../src/lib/supabase/server';

async function main() {
  const supabase = createStaticClient();
  const { data: locs, error } = await supabase.from('locations').select('id, name, slug, court_id, courts(official_name, name)');
  if (error) {
    console.error('Error:', error);
    return;
  }
  console.log('Total locations in DB:', locs?.length);
  const targetSlugs = [
    'arenys-de-mar', 'badalona', 'barcelona', 'berga', 'cerdanyola-del-valles',
    'cornella-de-llobregat', 'el-prat-de-llobregat', 'esplugues-de-llobregat', 'gava',
    'granollers', 'hospitalet-de-llobregat', 'igualada', 'manresa', 'martorell', 'mataro',
    'mollet-del-valles', 'rubi', 'sabadell', 'sant-boi-de-llobregat', 'sant-feliu-de-llobregat',
    'santa-coloma-de-gramenet', 'terrassa', 'vic', 'vilafranca-del-penedes', 'vilanova-i-la-geltru'
  ];
  
  const targetLocs = locs?.filter(l => targetSlugs.includes(l.slug));
  console.log('Target locations found:', targetLocs?.length, 'out of 26');
  targetLocs?.forEach(l => {
    const courtName = l.courts ? ((l.courts as any).official_name || (l.courts as any).name) : 'NONE';
    console.log(`- ${l.slug}: court=${courtName}`);
  });

  const { data: lsRows } = await supabase.from('location_services').select('location_id, service, web_published, locations(slug)');
  console.log('\nlocation_services rows total:', lsRows?.length);
  const publishedRows = lsRows?.filter(r => r.web_published);
  console.log('location_services web_published=true count:', publishedRows?.length);
}

main();
