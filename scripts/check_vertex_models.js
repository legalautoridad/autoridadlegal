const { createVertex } = require('@ai-sdk/google-vertex');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

async function test() {
    const vertex = createVertex({ 
        project: 'autoridadlegal', 
        location: 'europe-southwest1' 
    });
    // Try to call it to see what happens
    try {
        const model = vertex.textEmbeddingModel('text-embedding-004');
        console.log('Model text-embedding-004 created successfully');
    } catch (e) {
        console.log('Error creating text-embedding-004:', e.message);
    }
    
    try {
        const model = vertex.textEmbeddingModel('textembedding-gecko@003');
        console.log('Model textembedding-gecko@003 created successfully');
    } catch (e) {
        console.log('Error creating textembedding-gecko@003:', e.message);
    }
}

test();
