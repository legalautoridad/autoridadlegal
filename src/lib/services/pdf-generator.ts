import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Fix for TypeScript type definition issues with autotable
// @ts-ignore
const applyAutoTable = (doc: any, options: any) => {
    // Check if autoTable is attached to doc (common in some versions)
    if (typeof doc.autoTable === 'function') {
        doc.autoTable(options);
    } else {
        // Fallback for functional usage if supported or if the previous import failed
        autoTable(doc, options);
    }
};

export interface CertificateData {
    referenceId: string;
    clientName?: string;
    city: string;
    court: string;
    vertical: string;
    totalPrice: number;
    reservationAmount: number;
    date: string;
}

export function generateGuaranteeCertificate(data: CertificateData): Blob {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    // 1. Header (Institutional)
    doc.setFont("times", "bold");
    doc.setFontSize(22);
    doc.text("AUTORIDAD LEGAL", pageWidth / 2, 25, { align: "center" });

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("Plataforma de Asistencia Jurídica Inmediata", pageWidth / 2, 32, { align: "center" });

    // 2. Title
    doc.setLineWidth(0.5);
    doc.line(20, 40, pageWidth - 20, 40);

    doc.setFont("times", "bold");
    doc.setFontSize(16);
    doc.text("CERTIFICADO DE DEFENSA JURÍDICA GARANTIZADA", pageWidth / 2, 55, { align: "center" });

    // 3. Metadata
    // 3. Metadata
    // Ensure data.date is treated as a string or Date object correctly.
    // Assuming data.date represents a date string (ISO or locale).
    const dateObj = new Date(data.date);
    const dateStr = !isNaN(dateObj.getTime())
        ? dateObj.toISOString().split('T')[0].replace(/-/g, '').slice(2)
        : new Date().toISOString().split('T')[0].replace(/-/g, '').slice(2); // Fallback to today if invalid

    const cityCode = (data.city || 'GEN').substring(0, 3).toUpperCase();
    const ref = `#EXP-${dateStr}-${cityCode}-${Math.floor(Math.random() * 1000)}`;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);

    // Left Column
    doc.text(`Referencia: ${ref}`, 20, 70);
    doc.text(`Fecha: ${data.date}`, 20, 76);

    // Right Column
    doc.text(`Jurisdicción: ${data.city}`, 140, 70);
    doc.text(`Juzgado/Destino: ${data.court}`, 140, 76);

    // Body Text
    doc.setFont("times", "normal");
    doc.setFontSize(11);
    doc.text(`Por la presente, AUTORIDAD LEGAL certifica la asignación de letrado para el cliente con ID ${data.referenceId.slice(0, 8)}...`, 20, 90);


    // 4. Financial Table
    const remainingAmount = data.totalPrice - data.reservationAmount;

    applyAutoTable(doc, {
        startY: 100,
        head: [['CONCEPTO', 'IMPORTE']],
        body: [
            ['PRECIO MÁXIMO GARANTIZADO (IVA INC.)', `${data.totalPrice.toFixed(2)} €`],
            ['RESERVA ABONADA (PLATAFORMA)', `-${data.reservationAmount.toFixed(2)} €`],
            ['', ''], // Spacer
            [{ content: 'RESTANTE A PAGAR AL ABOGADO', styles: { fontStyle: 'bold', fillColor: [240, 240, 240] } }, { content: `${remainingAmount.toFixed(2)} €`, styles: { fontStyle: 'bold', fillColor: [240, 240, 240] } }]
        ],
        theme: 'grid',
        headStyles: { fillColor: [20, 20, 20], textColor: 255, fontStyle: 'bold' },
        styles: { fontSize: 11, cellPadding: 5, font: 'times' },
        columnStyles: {
            0: { cellWidth: 130 },
            1: { cellWidth: 40, halign: 'right' }
        }
    });

    // 5. Legal Clause (Zona Gris)
    const finalY = (doc as any).lastAutoTable.finalY + 20;

    doc.setFont("times", "italic");
    doc.setFontSize(10);
    doc.setTextColor(60, 60, 60);
    const text = `La liquidación de los ${remainingAmount.toFixed(2)} € restantes se realizará directamente en el despacho del Letrado asignado. La forma de pago y facturación final podrá ser acordada entre las partes, siempre que no se supere el importe máximo aquí garantizado. Este documento actúa como aval del precio cerrado ante cualquier desviación.`;

    const splitText = doc.splitTextToSize(text, pageWidth - 40);
    doc.text(splitText, 20, finalY);

    // 6. Signature / Stamp
    const stampY = finalY + 40;

    doc.setDrawColor(200, 200, 200);
    doc.rect(pageWidth - 80, stampY, 60, 30); // Stamp box

    doc.setFont("courier", "bold");
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text("SELLADO DIGITALMENTE", pageWidth - 75, stampY + 15);
    doc.text("AUTORIDAD LEGAL ID", pageWidth - 75, stampY + 20);
    doc.text(new Date().toISOString().split('T')[0], pageWidth - 75, stampY + 25);

    // Footer
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text("Documento generado electrónicamente por Autoridad Legal Platform v1.1", pageWidth / 2, 280, { align: "center" });

    // Return Blob
    return doc.output('blob');
}
