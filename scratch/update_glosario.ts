import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.join(process.cwd(), '.env.local') });
import { createStaticClient } from '../src/lib/supabase/server';

async function updateDb() {
  const supabase = createStaticClient();
  
  // 1. Deprecate 8 duplicate entities
  const deprecatedIds = [
    '7f07efe7-4020-4cf3-bdaa-9789d7d30802', // test-salival-indiciario-drogotest
    '3d7d0680-d7d7-4fb8-b4e5-21a9c7e0c713', // test-indiciario-salivar
    '13edc343-7c57-49bf-8843-9a5d2271994e', // cinemometro-radar
    'cb2f2140-78fa-485d-9b46-ae3e7c90d935', // trabajos-en-beneficio-de-la-comunidad-tbc
    '2cb9a20c-c5ac-4435-bf37-a4dfeffafb93', // perdida-de-vigencia-del-permiso
    '9b661920-4bd0-4880-b0b2-09b1f3781ebb', // concurso-formal-de-delitos-art-382-cp
    'b81a293c-1111-4444-9999-f4c3b2a1a001', // suspension-de-la-ejecucion-de-la-pena-art-80-cp
    '4083062b-ffe8-451d-9ab3-ce6ce01d1973'  // falso-positivo-por-farmacos-prescritos
  ];

  console.log('Setting status = INACTIVE for 8 deprecated entities...');
  const { error: depErr } = await supabase
    .from('semantic_entities')
    .update({ status: 'INACTIVE' })
    .in('id', deprecatedIds);

  if (depErr) {
    console.error('Error deprecating entities:', depErr);
    return;
  }
  console.log('✅ Successfully set 8 entities to INACTIVE in Supabase');

  // 2. Consolidate descriptions of canonical entities
  const canonicalUpdates = [
    {
      id: 'f59a5a0e-4036-4a5e-9419-3363b9f59d0e', // test-salival-indiciario
      description: 'Prueba inicial obligatoria de cribado inmunocromatográfico de saliva en vía pública (como DrugWipe o drogotest) practicada por agentes de tráfico que detecta la presencia indiciaria de sustancias estupefacientes en el organismo del conductor, requiriendo confirmación analítica de laboratorio.'
    },
    {
      id: '9ab5dc86-f3d0-4e8f-a757-74f9d2151474', // trabajos-en-beneficio-de-la-comunidad
      description: 'Pena alternativa de carácter penal que exige la prestación no retribuida de servicios en actividades de utilidad pública o talleres de seguridad vial (TASEVAL), utilizada como nodo estratégico de defensa ante la insolvencia del investigado.'
    },
    {
      id: 'a08e55de-e9c3-4d6a-a840-4031234b45cf', // suspension-de-la-pena-de-prision
      description: 'Beneficio penal regulado en el Art. 80 del Código Penal que faculta al juzgador a suspender la ejecución de la pena de prisión a condenados cuya pena no supere los dos años, condicionado a la ausencia de antecedentes penales computables y cumplimiento de los requisitos legales.'
    },
    {
      id: '01962cc3-6441-4896-bc98-030680217fda', // falso-positivo-por-medicacion
      description: 'Resultado analítico o reactividad cruzada errónea en el drogotest de saliva provocado por fármacos o tratamientos médicos pautados (tales como benzodiacepinas, ansiolíticos, antidepresivos o ibuprofeno).'
    },
    {
      id: 'e50c8072-3f61-4216-9144-25bacc55b2d2', // cinemometro
      description: 'Instrumento de control metrológico homologado (radar fijo, móvil o de tramo) empleado por las Fuerzas de Seguridad para medir e indexar los excesos de velocidad de los vehículos.'
    },
    {
      id: '2fad27b2-9b71-48ab-9303-b3fab40a6455', // concurso-de-delitos-viales-art-382-cp
      description: 'Regla penológica y concurso formal de delitos regulado en el Art. 382 del Código Penal, aplicable cuando un delito de riesgo vial (ej. alcoholemia o velocidad) ocasiona además un resultado lesivo o castigado en la infracción más grave en su mitad superior.'
    }
  ];

  for (const upd of canonicalUpdates) {
    const { error: updErr } = await supabase
      .from('semantic_entities')
      .update({ description: upd.description })
      .eq('id', upd.id);

    if (updErr) {
      console.error(`Error updating canonical entity ${upd.id}:`, updErr);
    } else {
      console.log(`✅ Updated canonical description for entity ID ${upd.id}`);
    }
  }
}

updateDb();
