const { createVertex } = require('@ai-sdk/google-vertex');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

async function test() {
    const vertex = createVertex({ 
        project: 'autoridadlegal', 
        location: 'europe-southwest1' 
    });
    console.log('Vertex methods:', Object.keys(vertex));
}

test();
