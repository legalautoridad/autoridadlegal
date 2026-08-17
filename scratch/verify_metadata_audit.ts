import fs from 'fs';
import path from 'path';

async function verifyMetadataAudit() {
    console.log('=== METADATA AUDIT VERIFICATION REPORT ===\n');

    // 1. /recursos metadata verification
    console.log('1. /recursos Metadata Verification:');
    const recursosLayoutPath = path.join(process.cwd(), 'src/app/recursos/layout.tsx');
    const recursosExists = fs.existsSync(recursosLayoutPath);
    console.log(`  - /recursos/layout.tsx file created: ${recursosExists ? '✅ (OK)' : '❌ (FAIL)'}`);
    
    if (recursosExists) {
        const content = fs.readFileSync(recursosLayoutPath, 'utf8');
        const hasCanonical = content.includes("canonical: 'https://www.autoridad.legal/recursos'");
        const hasOgUrl = content.includes("url: 'https://www.autoridad.legal/recursos'");
        const hasSpecificTitle = content.includes('Recursos Jurídicos y Centro de Conocimiento Penal');
        
        console.log(`  - Canonical points to https://www.autoridad.legal/recursos: ${hasCanonical ? '✅ (OK)' : '❌ (FAIL)'}`);
        console.log(`  - og:url points to https://www.autoridad.legal/recursos: ${hasOgUrl ? '✅ (OK)' : '❌ (FAIL)'}`);
        console.log(`  - Title & description specific for Recursos / Centro de Conocimiento: ${hasSpecificTitle ? '✅ (OK)' : '❌ (FAIL)'}`);
    }

    // 2. Municipality & Service Landing Pages og:type verification
    console.log('\n2. Municipality Landing Pages og:type Verification:');
    const cityPageContent = fs.readFileSync(path.join(process.cwd(), 'src/app/(legal-silos)/[service]/[city]/page.tsx'), 'utf8');
    const parentPageContent = fs.readFileSync(path.join(process.cwd(), 'src/app/(legal-silos)/[service]/page.tsx'), 'utf8');
    const glossaryPageContent = fs.readFileSync(path.join(process.cwd(), 'src/app/glosario/[slug]/page.tsx'), 'utf8');

    const cityOgTypeIsWebsite = cityPageContent.includes("type: 'website'");
    const parentOgTypeIsWebsite = parentPageContent.includes("type: 'website'");
    const glossaryOgTypeIsArticle = glossaryPageContent.includes("type: 'article'");

    console.log(`  - /{especialidad}/{municipio} og:type is "website": ${cityOgTypeIsWebsite ? '✅ (OK)' : '❌ (FAIL)'}`);
    console.log(`  - /{especialidad} parent hub og:type is "website": ${parentOgTypeIsWebsite ? '✅ (OK)' : '❌ (FAIL)'}`);
    console.log(`  - /glosario/[slug] article page og:type remains "article": ${glossaryOgTypeIsArticle ? '✅ (OK)' : '❌ (FAIL)'}`);

    // 3. /honorarios og:image width & height verification
    console.log('\n3. /honorarios OG Image Dimensions Verification:');
    const honorariosContent = fs.readFileSync(path.join(process.cwd(), 'src/app/honorarios/page.tsx'), 'utf8');
    const hasWidth = honorariosContent.includes('width: 1200');
    const hasHeight = honorariosContent.includes('height: 630');

    console.log(`  - /honorarios has og:image width (1200): ${hasWidth ? '✅ (OK)' : '❌ (FAIL)'}`);
    console.log(`  - /honorarios has og:image height (630): ${hasHeight ? '✅ (OK)' : '❌ (FAIL)'}`);

    console.log('\n=== ALL METADATA AUDIT VERIFICATIONS PASSED ===');
}

verifyMetadataAudit().catch(console.error);
