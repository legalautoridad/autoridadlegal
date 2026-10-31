import fs from 'fs';
import path from 'path';

async function testLlms() {
    console.log('🧪 Starting comprehensive LLMs test suite...\n');
    let failed = false;

    function assert(condition: boolean, msg: string) {
        if (!condition) {
            console.error(`❌ FAIL: ${msg}`);
            failed = true;
        } else {
            console.log(`✅ PASS: ${msg}`);
        }
    }

    // 1. Test local files content
    const llmsTxtPath = path.join(__dirname, '../llms.txt');
    const llmsFullTxtPath = path.join(__dirname, '../llms-full.txt');

    assert(fs.existsSync(llmsTxtPath), 'llms.txt exists');
    assert(fs.existsSync(llmsFullTxtPath), 'llms-full.txt exists');

    const llmsTxt = fs.readFileSync(llmsTxtPath, 'utf-8');
    const llmsFullTxt = fs.readFileSync(llmsFullTxtPath, 'utf-8');

    // Check size of llms.txt (< 2 KB = 2048 bytes)
    const llmsBytes = Buffer.byteLength(llmsTxt, 'utf-8');
    assert(llmsBytes < 2048, `/llms.txt size is under 2 KB (actual: ${llmsBytes} bytes)`);

    // Check exactly one H1 in llms.txt
    const h1Matches = llmsTxt.match(/^# .+/gm);
    assert(h1Matches?.length === 1 && h1Matches[0] === '# Autoridad Legal', `/llms.txt has exactly one H1: "${h1Matches?.[0]}"`);

    // Check blockquote summary in llms.txt
    const hasBlockquote = /^> .+/m.test(llmsTxt);
    assert(hasBlockquote, `/llms.txt contains a blockquote summary`);

    // Check that every URL is inside Markdown link syntax [text](url)
    const strippedLlmsTxt = llmsTxt.replace(/\[[^\]]+\]\([^)]+\)/g, '');
    const bareUrlsMatch = strippedLlmsTxt.match(/https?:\/\/[^\s)]+/g);
    assert(!bareUrlsMatch, `/llms.txt has ZERO bare URLs outside Markdown links (found: ${bareUrlsMatch?.join(', ') || 'none'})`);

    // Check prohibited words in both files
    const forbiddenWords = [
        'Ground Truth',
        'RAG',
        'Supabase',
        'minPrice',
        'Ver en mapa local',
        'psychoactivas',
        'representation',
        'Trámitación',
    ];

    for (const word of forbiddenWords) {
        const inLlms = llmsTxt.includes(word);
        const inLlmsFull = llmsFullTxt.includes(word);
        assert(!inLlms && !inLlmsFull, `No occurrence of forbidden string "${word}" (llms: ${inLlms}, llms-full: ${inLlmsFull})`);
    }

    // Check spot-check municipalities in llms-full.txt
    const spotChecks = [
        "Artés",
        "Cabrera d'Anoia",
        "Avinyonet del Penedès",
        "Castellar de n'Hug",
    ];

    for (const name of spotChecks) {
        const exists = llmsFullTxt.includes(`- [${name}]`);
        assert(exists, `Spot-check municipality found with real accents/apostrophes: "- [${name}]"`);
    }

    // Check that rebuilt names do NOT exist
    const rebuiltNames = [
        "Cabrera D Anoia",
        "Avinyonet Del Penedes",
        "Castellar De N Hug",
    ];
    for (const rName of rebuiltNames) {
        const exists = llmsFullTxt.includes(rName);
        assert(!exists, `No slug-rebuilt name found: "${rName}"`);
    }

    // Check that /login is NOT present in llms.txt
    assert(!llmsTxt.includes('/login'), `/llms.txt does NOT contain /login`);

    // Check glossary terms count in llms-full.txt (115 terms)
    const glossaryTermLinks = llmsFullTxt.match(/- \[[^\]]+\]\(https:\/\/www\.autoridad\.legal\/glosario\/[^)]+\)/g);
    assert((glossaryTermLinks?.length || 0) >= 115, `llms-full.txt contains all glossary terms (found: ${glossaryTermLinks?.length})`);

    // 2. Test live HTTP endpoint responses
    console.log('\n🌐 Testing live HTTP endpoints on http://localhost:3000 ...');
    try {
        const [resIndex, resFull] = await Promise.all([
            fetch('http://localhost:3000/llms.txt'),
            fetch('http://localhost:3000/llms-full.txt'),
        ]);

        assert(resIndex.status === 200, `/llms.txt returns HTTP 200 (actual: ${resIndex.status})`);
        assert(resFull.status === 200, `/llms-full.txt returns HTTP 200 (actual: ${resFull.status})`);

        const indexType = resIndex.headers.get('content-type') || '';
        const fullType = resFull.headers.get('content-type') || '';
        assert(indexType.includes('text/plain') && indexType.includes('utf-8'), `/llms.txt Content-Type is text/plain; charset=utf-8 (actual: ${indexType})`);
        assert(fullType.includes('text/plain') && fullType.includes('utf-8'), `/llms-full.txt Content-Type is text/plain; charset=utf-8 (actual: ${fullType})`);

        const indexCache = resIndex.headers.get('cache-control') || '';
        const fullCache = resFull.headers.get('cache-control') || '';
        console.log(`ℹ️ Cache headers: /llms.txt -> "${indexCache}", /llms-full.txt -> "${fullCache}"`);
        assert(indexCache.includes('s-maxage=3600'), `/llms.txt has s-maxage=3600 cache header`);
        assert(fullCache.includes('s-maxage=3600'), `/llms-full.txt has s-maxage=3600 cache header`);
    } catch (e: any) {
        console.error('❌ Failed to fetch from dev server:', e.message);
        failed = true;
    }

    if (failed) {
        console.error('\n❌ Test suite completed with failures.');
        process.exit(1);
    } else {
        console.log('\n🎉 ALL ACCEPTANCE CRITERIA PASSED SUCCESSFULLY!');
    }
}

testLlms();
