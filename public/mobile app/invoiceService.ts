import PDFDocument from 'pdfkit';
import { Storage } from '@google-cloud/storage';

const storage = new Storage();
const bucketName = process.env.GCS_BUCKET_NAME || 'my-invoice-bucket';

export interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number; // in AED
}

export interface InvoiceData {
  invoiceNumber: string;
  date: string;
  clientName: string;
  clientAddress: string;
  items: InvoiceItem[];
}

export async function generateAndUploadInvoice(data: InvoiceData): Promise<string> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50 });
    const buffers: Buffer[] = [];

    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', async () => {
      const pdfBuffer = Buffer.concat(buffers);
      
      try {
         // Simulated mode if no bucket configured
         if (!process.env.GCS_BUCKET_NAME) {
            console.warn('GCS_BUCKET_NAME not provided, returning simulated URL');
            return resolve(`https://storage.googleapis.com/simulated-bucket/invoices/${data.invoiceNumber}.pdf`);
         }
         
         const bucket = storage.bucket(bucketName);
         const file = bucket.file(`invoices/${data.invoiceNumber}.pdf`);
         
         await file.save(pdfBuffer, {
           metadata: { contentType: 'application/pdf' },
           resumable: false
         });
         
         resolve(`https://storage.googleapis.com/${bucketName}/invoices/${data.invoiceNumber}.pdf`);
      } catch (err) {
         console.error("GCS Upload failed:", err);
         reject(err);
      }
    });

    generateHeader(doc);
    generateCustomerInformation(doc, data);
    generateInvoiceTable(doc, data);

    doc.end();
  });
}

function generateHeader(doc: PDFKit.PDFDocument) {
  doc
    .fillColor('#444444')
    .fontSize(20)
    .text('ACME Packaging Corp.', 50, 50)
    .fontSize(10)
    .text('ACME Packaging Corp.', 200, 50, { align: 'right' })
    .text('Industrial Area 1, Jebel Ali', 200, 65, { align: 'right' })
    .text('Dubai, UAE', 200, 80, { align: 'right' })
    .text('TRN: 100234567890123', 200, 95, { align: 'right' })
    .moveDown();
}

function generateCustomerInformation(doc: PDFKit.PDFDocument, data: InvoiceData) {
  doc
    .fillColor('#444444')
    .fontSize(20)
    .text('Tax Invoice', 50, 160);

  generateHr(doc, 185);

  const customerInformationTop = 200;

  doc
    .fontSize(10)
    .text('Invoice Number:', 50, customerInformationTop)
    .font('Helvetica-Bold')
    .text(data.invoiceNumber, 150, customerInformationTop)
    .font('Helvetica')
    .text('Invoice Date:', 50, customerInformationTop + 15)
    .text(data.date, 150, customerInformationTop + 15)
    
    .text(data.clientName, 300, customerInformationTop)
    .font('Helvetica')
    .text(data.clientAddress, 300, customerInformationTop + 15)
    .moveDown();

  generateHr(doc, 252);
}

function generateInvoiceTable(doc: PDFKit.PDFDocument, data: InvoiceData) {
  let i;
  const invoiceTableTop = 330;

  doc.font('Helvetica-Bold');
  generateTableRow(
    doc,
    invoiceTableTop,
    'Item Description',
    'Unit Cost (AED)',
    'Quantity',
    'Line Total (AED)'
  );
  generateHr(doc, invoiceTableTop + 20);
  doc.font('Helvetica');

  let subtotal = 0;

  for (i = 0; i < data.items.length; i++) {
    const item = data.items[i];
    const position = invoiceTableTop + (i + 1) * 30;
    const lineTotal = item.quantity * item.unitPrice;
    subtotal += lineTotal;
    
    generateTableRow(
      doc,
      position,
      item.description,
      formatCurrency(item.unitPrice),
      item.quantity.toString(),
      formatCurrency(lineTotal)
    );

    generateHr(doc, position + 20);
  }

  const vat = subtotal * 0.05;
  const total = subtotal + vat;

  const subtotalPosition = invoiceTableTop + (i + 1) * 30;
  generateTableRow(
    doc,
    subtotalPosition,
    '',
    '',
    'Subtotal',
    formatCurrency(subtotal)
  );

  const vatPosition = subtotalPosition + 20;
  generateTableRow(
    doc,
    vatPosition,
    '',
    '',
    'VAT (5%)',
    formatCurrency(vat)
  );

  const totalPosition = vatPosition + 25;
  doc.font('Helvetica-Bold');
  generateTableRow(
    doc,
    totalPosition,
    '',
    '',
    'Total Due (AED)',
    formatCurrency(total)
  );
  doc.font('Helvetica');
}

function generateTableRow(
  doc: PDFKit.PDFDocument,
  y: number,
  description: string,
  unitCost: string,
  quantity: string,
  lineTotal: string
) {
  doc
    .fontSize(10)
    .text(description, 50, y)
    .text(unitCost, 280, y, { width: 90, align: 'right' })
    .text(quantity, 370, y, { width: 90, align: 'right' })
    .text(lineTotal, 400, y, { width: 100, align: 'right' });
}

function generateHr(doc: PDFKit.PDFDocument, y: number) {
  doc
    .strokeColor('#aaaaaa')
    .lineWidth(1)
    .moveTo(50, y)
    .lineTo(550, y)
    .stroke();
}

function formatCurrency(custom: number) {
  return custom.toFixed(2);
}
