import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function renameBucket() {
    console.log('Renaming bucket from "blog-images" to "images"...');

    // 1. Delete old bucket
    console.log('Deleting bucket: blog-images...');
    const { error: deleteError } = await supabase.storage.deleteBucket('blog-images');
    if (deleteError) {
        console.error('Error deleting blog-images:', deleteError.message);
    } else {
        console.log('Successfully deleted blog-images.');
    }

    // 2. Create new bucket
    console.log('Creating bucket: images...');
    const { data, error: createError } = await supabase.storage.createBucket('images', {
        public: true,
        allowedMimeTypes: ['image/png', 'image/jpeg', 'image/gif', 'image/svg+xml', 'image/webp'],
        fileSizeLimit: 5242880 // 5MB
    });

    if (createError) {
        if (createError.message.includes('already exists')) {
            console.log('Bucket "images" already exists.');
        } else {
            console.error('Error creating bucket:', createError.message);
        }
    } else {
        console.log('Successfully created bucket: images');
    }
}

renameBucket();
