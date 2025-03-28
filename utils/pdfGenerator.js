const { PDFDocument, rgb } = require('pdf-lib');
const fontkit = require('@pdf-lib/fontkit');
const fs = require('fs');
const path = require('path');

async function generatePDF(contract) {
    try {
        // Create a new PDF document
        const pdfDoc = await PDFDocument.create();
        pdfDoc.registerFontkit(fontkit);

        // Add a blank page
        const page = pdfDoc.addPage([595, 842]); // A4 size

        // Draw contract content
        const { width, height } = page.getSize();
        const fontSize = 12;
        const margin = 50;
        
        // Add title
        page.drawText(contract.title, {
            x: margin,
            y: height - margin,
            size: 18,
            color: rgb(0, 0, 0),
        });

        // Add content
        const contentLines = contract.content.split('\n');
        let yPosition = height - margin - 30;
        
        for (const line of contentLines) {
            page.drawText(line, {
                x: margin,
                y: yPosition,
                size: fontSize,
                color: rgb(0, 0, 0),
            });
            yPosition -= 20;
        }

        // Add signatures section
        if (contract.signedBy.length > 0) {
            yPosition -= 40;
            page.drawText('Signatures:', {
                x: margin,
                y: yPosition,
                size: 14,
                color: rgb(0, 0, 0),
            });
            yPosition -= 30;

            for (const signature of contract.signedBy) {
                page.drawText(`Signed by: ${signature.user}`, {
                    x: margin,
                    y: yPosition,
                    size: fontSize,
                    color: rgb(0, 0, 0),
                });
                yPosition -= 20;
                
                page.drawText(`Date: ${new Date(signature.signedAt).toLocaleDateString()}`, {
                    x: margin,
                    y: yPosition,
                    size: fontSize,
                    color: rgb(0, 0, 0),
                });
                yPosition -= 30;
            }
        }

        // Save the PDF
        const pdfBytes = await pdfDoc.save();
        return pdfBytes;
    } catch (error) {
        console.error('PDF generation error:', error);
        throw error;
    }
}

module.exports = { generatePDF };