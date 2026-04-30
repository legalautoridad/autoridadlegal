const { createVertex } = require('@ai-sdk/google-vertex');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

async function test() {
    const vertex = createVertex({ 
        project: '842430822950', 
        location: 'europe-southwest1' 
    });

    const model = vertex('text-embedding-004');
    console.log('Model type:', model.modelId);
    console.log('Model specification:', model.specification);
}

test();
