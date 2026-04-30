const { createVertex } = require('@ai-sdk/google-vertex');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

async function test() {
    const vertex = createVertex({ 
        project: '842430822950', 
        location: 'europe-southwest1' 
    });

    const ids = [
        'text-embedding-004',
        'textembedding-gecko@003',
        'textembedding-gecko',
        'text-multilingual-embedding-002'
    ];

    for (const id of ids) {
        try {
            const model = vertex.textEmbeddingModel(id);
            console.log(`Success with: ${id}`);
        } catch (e) {
            console.log(`Failed with ${id}: ${e.message}`);
        }
    }
}

test();
