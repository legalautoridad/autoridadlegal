import fs from 'fs';
import path from 'path';

async function main() {
    const filePath = path.join(process.cwd(), 'src/content/okf/coberturas.json');
    if (!fs.existsSync(filePath)) {
        console.error('File not found:', filePath);
        return;
    }

    let content = fs.readFileSync(filePath, 'utf-8');

    // 1. Check occurrences of Garantizamos tu defensa
    const garantizaMatches = content.match(/Garantizamos tu defensa/gi) || [];
    console.log('Occurrences of "Garantizamos tu defensa":', garantizaMatches.length);

    // 2. Check occurrences of decimal rates with dot like 0.60 mg/l, 0.65 mg/l, etc.
    const dotRateMatches = content.match(/\b\d+\.\d{2}\s*mg\/l\b/gi) || [];
    console.log('Occurrences of "N.NN mg/l":', dotRateMatches.length);

    // Replace "Garantizamos tu defensa auditando" with "Auditamos"
    content = content.replace(/Garantizamos tu defensa auditando/gi, 'Auditamos');
    content = content.replace(/Garantizamos tu defensa/gi, 'Auditamos las pruebas de');

    // Replace "N.NN mg/l" with "N,NN mg/l"
    content = content.replace(/(\b\d+)\.(\d{2})\s*mg\/l\b/gi, '$1,$2 mg/l');

    fs.writeFileSync(filePath, content, 'utf-8');
    console.log('✅ Updated src/content/okf/coberturas.json');
}

main();
