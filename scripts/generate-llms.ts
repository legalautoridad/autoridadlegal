import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// Load .env.local
dotenv.config({ path: path.join(__dirname, '../.env.local') });

import { generateLlmsIndex, generateLlmsFull } from '../src/lib/llms';

async function generateLlmsFiles() {
    console.log('🚀 Generating llms.txt and llms-full.txt documents...');

    const [indexContent, fullContent] = await Promise.all([
        generateLlmsIndex(),
        generateLlmsFull(),
    ]);

    const rootLlmsPath = path.join(__dirname, '../llms.txt');
    const rootLlmsFullPath = path.join(__dirname, '../llms-full.txt');

    fs.writeFileSync(rootLlmsPath, indexContent, 'utf-8');
    fs.writeFileSync(rootLlmsFullPath, fullContent, 'utf-8');

    console.log(`✅ llms.txt generated:`);
    console.log(`   - ${rootLlmsPath} (${Buffer.byteLength(indexContent, 'utf-8')} bytes)`);
    console.log(`✅ llms-full.txt generated:`);
    console.log(`   - ${rootLlmsFullPath} (${Buffer.byteLength(fullContent, 'utf-8')} bytes)`);
}

generateLlmsFiles().catch(err => {
    console.error('❌ Error generating LLMs files:', err);
    process.exit(1);
});
