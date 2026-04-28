const { VertexAI } = require('@google-cloud/vertexai');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

async function test() {
    const project = process.env.GOOGLE_NUMERO_PROYECTO || '842430822950';
    const location = process.env.GOOGLE_VERTEX_LOCATION || 'europe-southwest1';
    const vertex_ai = new VertexAI({project, location});
    const model = vertex_ai.getGenerativeModel({model: 'text-embedding-004'});
    
    console.log('GenerativeModel keys:', Object.keys(model));
    console.log('GenerativeModel proto:', Object.getPrototypeOf(model));
}

test();
