import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { createStaticClient } from '../src/lib/supabase/server';

async function main() {
  const supabase = createStaticClient();
  const targetSlugs = [
    'arenys-de-mar', 'badalona', 'barcelona', 'berga', 'cerdanyola-del-valles',
    'cornella-de-llobregat', 'el-prat-de-llobregat', 'esplugues-de-llobregat', 'gava',
    'granollers', 'hospitalet-de-llobregat', 'igualada', 'manresa', 'martorell', 'mataro',
    'mollet-del-valles', 'rubi', 'sabadell', 'sant-boi-de-llobregat', 'sant-feliu-de-llobregat',
    'santa-coloma-de-gramenet', 'terrassa', 'vic', 'vilafranca-del-penedes', 'vilanova-i-la-geltru'
  ];

  const { data: rows } = await supabase
    .from('location_services')
    .select('service, web_published, locations!inner(slug, court_id)')
    .in('locations.slug', targetSlugs);

  console.log('Location services rows for 25 target slugs:', rows?.length);
  const falseRows = rows?.filter(r => r.web_published === false);
  console.log('Rows with web_published=false in target 25:', falseRows?.length);

  // Check one target location, e.g. barcelona, across services
  const bcnRows = rows?.filter(r => (r.locations as any).slug === 'barcelona');
  console.log('Barcelona location_services rows:', bcnRows);
}

main();
