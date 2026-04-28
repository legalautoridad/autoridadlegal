const { createVertex } = require('@ai-sdk/google-vertex');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

async function test() {
    try {
        const vertex = createVertex({ 
            project: '842430822950', 
            location: 'europe-southwest1' 
        });
        const model = vertex.textEmbeddingModel('text-embedding-004');
        console.log('SUCCESS: text-embedding-004 is now recognized!');
    } catch (e) {
        console.log('Error:', e.message);
    }
}

test();
