import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { getCoberturaData } from '../src/lib/db/cobertura';

async function test() {
    console.log('Testing getCoberturaData("alcoholemia", "canet-de-mar")...');
    const result = await getCoberturaData('alcoholemia', 'canet-de-mar');
    console.log('Result:', result ? {
        id: result.id,
        h1Title: result.h1Title,
        courtName: result.courtName,
        web_published: result.web_published,
        faqsCount: result.faqs.length,
        interestPointsCount: result.interestPoints.length
    } : null);
}

test();
