const HOST = 'www.autoridad.legal';
const KEY = 'b10bd383f4d246de8640bb5d2080e465';
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;
const INDEXNOW_ENDPOINT = 'https://api.indexnow.org/indexnow';
const MAX_BATCH_SIZE = 10000;

export interface IndexNowPayload {
    host: string;
    key: string;
    keyLocation: string;
    urlList: string[];
}

export async function submitToIndexNow(urls: string[]): Promise<{ status: number; statusText: string; body: string }> {
    if (urls.length === 0) {
        console.log('⚠️ No URLs provided for IndexNow submission.');
        return { status: 0, statusText: 'No URLs', body: '' };
    }

    // Normalize and validate URLs
    const normalizedUrls = urls.map(url => {
        let fullUrl = url.trim();
        if (!fullUrl.startsWith('http://') && !fullUrl.startsWith('https://')) {
            fullUrl = `https://${HOST}${fullUrl.startsWith('/') ? '' : '/'}${fullUrl}`;
        }
        const parsed = new URL(fullUrl);
        if (parsed.host !== HOST) {
            throw new Error(`Host mismatch: Expected ${HOST}, got ${parsed.host} in URL ${fullUrl}`);
        }
        return fullUrl;
    });

    console.log(`\n🚀 Preparing IndexNow submission for ${normalizedUrls.length} URL(s)...`);

    // Batch URLs into chunks of MAX_BATCH_SIZE (10,000)
    let lastResponse = { status: 0, statusText: '', body: '' };

    for (let i = 0; i < normalizedUrls.length; i += MAX_BATCH_SIZE) {
        const chunk = normalizedUrls.slice(i, i + MAX_BATCH_SIZE);
        const payload: IndexNowPayload = {
            host: HOST,
            key: KEY,
            keyLocation: KEY_LOCATION,
            urlList: chunk,
        };

        console.log(`Sending batch ${Math.floor(i / MAX_BATCH_SIZE) + 1} (${chunk.length} URLs)...`);

        try {
            const res = await fetch(INDEXNOW_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                },
                body: JSON.stringify(payload),
            });

            const bodyText = await res.text();
            lastResponse = {
                status: res.status,
                statusText: res.statusText,
                body: bodyText,
            };

            switch (res.status) {
                case 200:
                    console.log(`✅ 200 OK: Batch of ${chunk.length} URLs submitted successfully.`);
                    break;
                case 202:
                    console.log(`✅ 202 Accepted: Batch of ${chunk.length} URLs received (key pending validation).`);
                    break;
                case 400:
                    console.error(`❌ 400 Bad Request: Invalid request format.\nResponse: ${bodyText}`);
                    break;
                case 403:
                    console.error(`❌ 403 Invalid Key: Key not valid or keyLocation does not match.\nResponse: ${bodyText}`);
                    break;
                case 422:
                    console.error(`❌ 422 Host Mismatch: URL host does not match payload host '${HOST}'.\nResponse: ${bodyText}`);
                    break;
                case 429:
                    console.error(`❌ 429 Rate Limited: Too many requests sent to IndexNow.\nResponse: ${bodyText}`);
                    break;
                default:
                    console.error(`⚠️ ${res.status} ${res.statusText}: Unexpected response.\nResponse: ${bodyText}`);
                    break;
            }
        } catch (error) {
            console.error('❌ Network or execution error during IndexNow submission:', error);
            throw error;
        }
    }

    return lastResponse;
}

// CLI Execution entrypoint
if (require.main === module) {
    const rawArgs = process.argv.slice(2);
    if (rawArgs.length === 0) {
        console.log('Usage: npx tsx scripts/indexnow.ts <url1> <url2> ...');
        process.exit(1);
    }

    submitToIndexNow(rawArgs)
        .then(() => process.exit(0))
        .catch(err => {
            console.error('Failed to submit URLs:', err);
            process.exit(1);
        });
}
