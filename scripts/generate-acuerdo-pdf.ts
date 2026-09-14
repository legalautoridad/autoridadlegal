import fs from 'fs';
import path from 'path';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ACUERDO_HONORARIOS_CONFIG } from '../src/lib/config/acuerdo-honorarios-source';

async function generateAcuerdoPdf() {
    const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
    });

    let currentY = 15;

    const checkPageBreak = (neededHeight: number) => {
        if (currentY + neededHeight > 280) {
            doc.addPage();
            currentY = 15;
        }
    };

    // Header Title Block
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.setTextColor(20, 30, 55); // Navy
    doc.text(ACUERDO_HONORARIOS_CONFIG.title.toUpperCase(), 14, currentY);
    currentY += 7;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(80, 90, 110);
    doc.text(ACUERDO_HONORARIOS_CONFIG.subtitle, 14, currentY);
    currentY += 6;

    doc.setFontSize(8);
    doc.text(`Versión: ${ACUERDO_HONORARIOS_CONFIG.version} | Vigencia: ${ACUERDO_HONORARIOS_CONFIG.effectiveDate}`, 14, currentY);
    currentY += 8;

    // Divider Line
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.5);
    doc.line(14, currentY, 196, currentY);
    currentY += 8;

    // Iterate through sections
    for (const sec of ACUERDO_HONORARIOS_CONFIG.sections) {
        checkPageBreak(15);

        // Section Title
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(11);
        doc.setTextColor(20, 30, 55);
        doc.text(`${sec.number}. ${sec.title}`, 14, currentY);
        currentY += 6;

        // Section Content
        if (sec.content) {
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(9);
            doc.setTextColor(40, 40, 40);
            const lines = doc.splitTextToSize(sec.content, 182);
            checkPageBreak(lines.length * 4.5);
            doc.text(lines, 14, currentY);
            currentY += lines.length * 4.5 + 3;
        }

        // List Items
        if (sec.items && sec.items.length > 0) {
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(8.5);
            doc.setTextColor(50, 50, 50);
            for (const item of sec.items) {
                const itemLines = doc.splitTextToSize(`• ${item}`, 178);
                checkPageBreak(itemLines.length * 4);
                doc.text(itemLines, 18, currentY);
                currentY += itemLines.length * 4 + 1.5;
            }
            currentY += 2;
        }

        // Base Prices Table
        if (sec.basePricesTable && sec.basePricesTable.length > 0) {
            checkPageBreak(25);
            autoTable(doc, {
                startY: currentY,
                head: [['Servicio', 'Base Imponible', 'IVA (21 %)', 'Total (Procurador inc.)']],
                body: sec.basePricesTable.map(r => [r.servicio, r.base, r.iva, r.total]),
                styles: { fontSize: 8, font: 'helvetica', cellPadding: 2.5 },
                headStyles: { fillColor: [20, 30, 55], textColor: [255, 255, 255], fontStyle: 'bold' },
                alternateRowStyles: { fillColor: [245, 247, 250] },
                margin: { left: 14, right: 14 },
            });
            currentY = (doc as any).lastAutoTable.finalY + 6;
        }

        // Supplements Table
        if (sec.supplementsTable && sec.supplementsTable.length > 0) {
            checkPageBreak(35);
            autoTable(doc, {
                startY: currentY,
                head: [['Circunstancia', 'Suplemento', 'Aplica a', 'Descripción']],
                body: sec.supplementsTable.map(r => [r.circunstancia, r.suplemento, r.aplica, r.descripcion]),
                styles: { fontSize: 7.5, font: 'helvetica', cellPadding: 2 },
                headStyles: { fillColor: [20, 30, 55], textColor: [255, 255, 255], fontStyle: 'bold' },
                alternateRowStyles: { fillColor: [245, 247, 250] },
                columnStyles: {
                    0: { cellWidth: 45 },
                    1: { cellWidth: 25, fontStyle: 'bold' },
                    2: { cellWidth: 35 },
                    3: { cellWidth: 77 },
                },
                margin: { left: 14, right: 14 },
            });
            currentY = (doc as any).lastAutoTable.finalY + 6;
        }

        // Accumulation Note
        if (sec.accumulationNote) {
            doc.setFont('helvetica', 'italic');
            doc.setFontSize(8);
            doc.setTextColor(90, 90, 90);
            const noteLines = doc.splitTextToSize(sec.accumulationNote, 182);
            checkPageBreak(noteLines.length * 4);
            doc.text(noteLines, 14, currentY);
            currentY += noteLines.length * 4 + 4;
        }

        // 60/40 Payment Table
        if (sec.payment6040Table && sec.payment6040Table.length > 0) {
            checkPageBreak(25);
            autoTable(doc, {
                startY: currentY,
                head: [['Servicio', 'Precio Total', 'Primer Pago (60 %)', 'Segundo Pago (40 % a 30 días)']],
                body: sec.payment6040Table.map(r => [r.servicio, r.precioTotal, r.pago60, r.pago40]),
                styles: { fontSize: 8, font: 'helvetica', cellPadding: 2.5 },
                headStyles: { fillColor: [20, 30, 55], textColor: [255, 255, 255], fontStyle: 'bold' },
                alternateRowStyles: { fillColor: [245, 247, 250] },
                margin: { left: 14, right: 14 },
            });
            currentY = (doc as any).lastAutoTable.finalY + 6;
        }

        // Signature Block
        if (sec.signatureBlock) {
            checkPageBreak(45);

            currentY += 4;
            const leftColX = 14;
            const rightColX = 110;

            // El profesional
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(10);
            doc.setTextColor(20, 30, 55);
            doc.text('El profesional', leftColX, currentY);

            doc.setFont('helvetica', 'normal');
            doc.setFontSize(9);
            doc.setTextColor(40, 40, 40);
            doc.text(`Nombre: ${sec.signatureBlock.professional.name}`, leftColX, currentY + 6);
            doc.text(`ICAB: ${sec.signatureBlock.professional.icab}`, leftColX, currentY + 12);
            doc.text('Firma: ___________________________', leftColX, currentY + 24);

            // El cliente
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(10);
            doc.setTextColor(20, 30, 55);
            doc.text('El cliente', rightColX, currentY);

            doc.setFont('helvetica', 'normal');
            doc.setFontSize(9);
            doc.setTextColor(40, 40, 40);
            doc.text(`Nombre: ${sec.signatureBlock.client.name}`, rightColX, currentY + 6);
            doc.text(`Documento: ${sec.signatureBlock.client.document}`, rightColX, currentY + 12);
            doc.text('Firma: ___________________________', rightColX, currentY + 24);

            currentY += 32;
        }

        currentY += 2;
    }

    // Output PDF to public/acuerdo-honorarios.pdf
    const publicDir = path.join(process.cwd(), 'public');
    if (!fs.existsSync(publicDir)) {
        fs.mkdirSync(publicDir, { recursive: true });
    }

    const pdfPath = path.join(publicDir, 'acuerdo-honorarios.pdf');
    const pdfBuffer = Buffer.from(doc.output('arraybuffer'));
    fs.writeFileSync(pdfPath, pdfBuffer);
    console.log(`[PDF Generator] Successfully compiled ${pdfPath} (${pdfBuffer.length} bytes)`);
}

generateAcuerdoPdf().catch(err => {
    console.error('[PDF Generator] Error:', err);
    process.exit(1);
});
