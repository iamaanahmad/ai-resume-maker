import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

/**
 * Captures an HTML element as a canvas with optimized settings
 */
export const captureElementAsCanvas = async (element: HTMLElement): Promise<HTMLCanvasElement> => {
    return await html2canvas(element, {
        useCORS: true,
        allowTaint: false,
        logging: false,
        backgroundColor: '#ffffff',
        scale: 2,
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight,
        onclone: (clonedDoc) => {
            const clonedElement = clonedDoc.getElementById(element.id);
            if (clonedElement) {
                // Ensure all styles are properly applied
                clonedElement.style.display = 'block';
                clonedElement.style.position = 'relative';
            }
        }
    } as any);
};

/**
 * Exports canvas to PDF with proper pagination
 */
export const exportCanvasToPDF = (canvas: HTMLCanvasElement, fileName: string): void => {
    const imgData = canvas.toDataURL('image/png', 1.0);
    const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true,
    });
    
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    const ratio = canvasWidth / canvasHeight;
    const imgWidth = pdfWidth;
    const imgHeight = imgWidth / ratio;

    let heightLeft = imgHeight;
    let position = 0;

    // Add first page
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
    heightLeft -= pdfHeight;

    // Add additional pages if content is longer than one page
    while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
        heightLeft -= pdfHeight;
    }

    pdf.save(fileName);
};

/**
 * Exports canvas to PNG image
 */
export const exportCanvasToImage = (canvas: HTMLCanvasElement, fileName: string): void => {
    canvas.toBlob((blob) => {
        if (!blob) {
            throw new Error('Failed to create image blob');
        }
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = fileName;
        link.href = url;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }, 'image/png', 1.0);
};
