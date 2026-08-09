import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { getHomepageFaqs } from '../src/lib/db/homepage-faqs';
import fs from 'fs';

async function test() {
    console.log('=== TEST DB HOMEPAGE FAQS ===');
    const faqs = await getHomepageFaqs();
    console.log('Fetched FAQs count from DB:', faqs.length);
    faqs.forEach((f, i) => {
        console.log(`\nFAQ #${i + 1} (pos: ${f.position}):`);
        console.log('Q:', f.question);
        console.log('A:', f.answer.substring(0, 80) + '...');
    });
}

test();
