const { createGoogleGenerativeAI } = require('@ai-sdk/google');
const { createVertex } = require('@ai-sdk/google-vertex');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

async function test() {
    const google = createGoogleGenerativeAI({
        apiKey: process.env.GOOGLE_GENAI_API_KEY,
    });
    
    try {
        const model = google.embedding('text-embedding-004');
        console.log('Google: text-embedding-004 created');
    } catch (e) {
        console.log('Google Error:', e.message);
    }

    const vertex = createVertex({ 
        project: 'autoridadlegal', 
        location: 'europe-southwest1' 
    });

    // Check what textEmbeddingModel expects
    try {
        const model = vertex('text-embedding-004');
        console.log('Vertex via main function: text-embedding-004 created');
    } catch (e) {
        // ...
    }
}

test();
