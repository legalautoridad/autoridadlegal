import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { ARTICLES } from '../src/data/articles';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function migrateArticles() {
    console.log('Starting migration...');

    for (const article of ARTICLES) {
        console.log(`Migrating: ${article.slug}`);

        const { error } = await supabase
            .from('articles')
            .upsert({
                slug: article.slug,
                title: article.title,
                subtitle: article.excerpt,
                content: article.content,
                image_url: article.image,
                author_name: article.authorId === 'marc-valls' ? 'Dr. Marc Valls' : 'Dra. Sofía Herrera',
                service_category: article.category,
                is_published: true,
                created_at: new Date(article.publishedAt).toISOString(),
                updated_at: new Date().toISOString()
            }, {
                onConflict: 'slug'
            });

        if (error) {
            console.error(`Error migrating ${article.slug}:`, error.message);
        } else {
            console.log(`Successfully migrated: ${article.slug}`);
        }
    }

    console.log('Migration finished.');
}

migrateArticles();
