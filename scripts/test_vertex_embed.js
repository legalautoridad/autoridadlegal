const { VertexAI } = require('@google-cloud/vertexai');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

async function test() {
    try {
        const project = '842430822950';
        const location = 'europe-southwest1';
        const vertex_ai = new VertexAI({project, location});
        const model = vertex_ai.getGenerativeModel({model: 'text-embedding-004'});
        
        const result = await model.embedContent({
            content: { parts: [{ text: "Hello world" }] }
        });
        
        console.log('Success!');
        console.log('Dimension:', result.embedding.values.length);
    } catch (e) {
        console.error('Error:', e.message);
    }
}

test();
