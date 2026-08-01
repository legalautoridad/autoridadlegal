import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://xiqfcritzjabiunfwksn.supabase.co';
const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const supabase = createClient(url, key);

async function check() {
    console.log('Testing Supabase URL:', url);
    const candidateFiles = [
        'og/og-image.jpg',
        'og/og-image.png',
        'og/og-default.jpg',
        'og/og-default.png',
        'og/og-autoridad-legal.jpg',
        'og/og-autoridad-legal.png',
        'og/default.jpg',
        'og/default.png',
        'og/alcoholemia.jpg',
        'og/alcoholemia.png',
        'og/drogas.jpg',
        'og/drogas.png',
        'og/sin-carnet.jpg',
        'og/sin-carnet.png',
        'og/velocidad.jpg',
        'og/velocidad.png',
        'og/profesionales.jpg',
        'og/profesionales.png',
    ];

    console.log('\n--- Checking HTTP HEAD status for potential files ---');
    for (const f of candidateFiles) {
        const publicUrl = `${url}/storage/v1/object/public/images/${f}`;
        try {
            const res = await fetch(publicUrl, { method: 'HEAD' });
            if (res.status === 200) {
                console.log(`✅ FOUND: ${f} (${res.headers.get('content-type')}, ${res.headers.get('content-length')} bytes)`);
                console.log(`   URL: ${publicUrl}`);
            } else {
                console.log(`❌ ${f} => HTTP ${res.status}`);
            }
        } catch (e: any) {
            console.log(`❌ ${f} => ${e.message}`);
        }
    }

    console.log('\n--- Listing bucket contents with Supabase client ---');
    const { data: ogFiles, error } = await supabase.storage.from('images').list('og');
    if (error) {
        console.error('List error:', error);
    } else {
        console.log('Files returned from storage.from("images").list("og"):');
        console.log(ogFiles);
    }
}

check();
