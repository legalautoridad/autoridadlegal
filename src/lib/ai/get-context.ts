import fs from 'fs';
import path from 'path';

export function getContextForService(service: string = 'alcoholemia') {
  try {
    // Read from the definitive FAQ_SOURCE.md
    const filePath = path.join(process.cwd(), 'src', 'content', 'reference', 'FAQ_SOURCE.md');

    if (fs.existsSync(filePath)) {
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      return `
=== BASE DE CONOCIMIENTO JURÍDICO VINCULANTE (RAG) ===
Instrucción Crítica: Usa EXCLUSIVAMENTE estos datos para responder cuestiones técnicas sobre alcoholemia, tasas y penas.
            
${fileContent}
=== FIN BASE DE CONOCIMIENTO ===
            `;
    } else {
      console.warn(`RAG Source file not found at: ${filePath}`);
      return '';
    }
  } catch (error) {
    console.error('Error reading RAG context:', error);
    return '';
  }
}
