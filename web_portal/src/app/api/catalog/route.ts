import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import PDFDocument from 'pdfkit';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // 1. Fetch top selling items from PostgreSQL
    // In a real scenario, this would aggregate from Order/Inventory records.
    // For now, we fetch the inventory items directly as a mock for top 10.
    const topProducts = await prisma.inventoryItem.findMany({
      take: 10,
      orderBy: { quantity: 'desc' }, // Mocking "best selling" using quantity
    });

    // 2. Dynamically assemble the PDF
    return new Promise<NextResponse>((resolve) => {
      const doc = new PDFDocument({ margin: 50 });
      const chunks: Buffer[] = [];

      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => {
        const pdfBuffer = Buffer.concat(chunks);
        resolve(
          new NextResponse(pdfBuffer, {
            status: 200,
            headers: {
              'Content-Type': 'application/pdf',
              'Content-Disposition': 'attachment; filename="DelightPack-Catalog.pdf"',
            },
          })
        );
      });

      // Cover Page
      doc.fontSize(30).fillColor('#DC2626').text('Delight Pack', { align: 'center' });
      doc.fontSize(20).fillColor('#1F2937').text('Premium Packaging Catalog', { align: 'center' });
      doc.moveDown(2);
      doc.fontSize(14).fillColor('#4B5563').text(`Generated on: ${new Date().toLocaleDateString()}`, { align: 'center' });
      
      doc.addPage();

      // Products List
      doc.fontSize(24).fillColor('#000000').text('Top Selling Products', { underline: true });
      doc.moveDown(1);

      topProducts.forEach((product, idx) => {
        doc.fontSize(16).fillColor('#DC2626').text(`${idx + 1}. ${product.name}`);
        doc.fontSize(12).fillColor('#4B5563').text(`Category: ${product.category}`);
        doc.fontSize(12).fillColor('#111827').text(`Stock Available: ${product.quantity} units`);
        doc.moveDown(1.5);
      });

      doc.end();
    });
  } catch (error) {
    console.error('PDF Catalog Error:', error);
    return NextResponse.json({ error: 'Failed to generate catalog' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
