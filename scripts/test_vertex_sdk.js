const { VertexAI } = require('@google-cloud/vertexai');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

async function test() {
    try {
        const vertexAI = new VertexAI({ 
            project: '842430822950', 
            location: 'europe-southwest1' 
        });
        const generativeModel = vertexAI.getGenerativeModel({ model: 'text-embedding-004' });
        
        // This is how you traditionally do it in the Google SDK
        const request = {
            instances: [{ content: 'Hello world' }],
        };
        // wait, the vertexai sdk has an embedContent or similar?
        // Actually, it uses a predictor in some versions.
        
        console.log('VertexAI SDK model created for text-embedding-004');
    } catch (e) {
        console.error('VertexAI SDK Error:', e.message);
    }
}

test();
