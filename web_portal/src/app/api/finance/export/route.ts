import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Parser } from 'json2csv';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const startParam = searchParams.get('startDate');
    const endParam = searchParams.get('endDate');

    if (!startParam || !endParam) {
      return NextResponse.json({ error: 'Missing date range' }, { status: 400 });
    }

    const startDate = new Date(startParam);
    const endDate = new Date(endParam);

    // Fetch Income (Orders)
    const orders = await prisma.order.findMany({
      where: {
        status: 'Completed',
        createdAt: { gte: startDate, lte: endDate }
      },
      include: { user: true }
    });

    // Fetch Expenses (LedgerEntries)
    const ledger = await prisma.ledgerEntry.findMany({
      where: {
        createdAt: { gte: startDate, lte: endDate }
      },
      include: { user: true }
    });

    // Map into standard flat format
    const flatData: any[] = [];

    orders.forEach(o => {
      flatData.push({
        Date: o.createdAt.toISOString(),
        Type: 'Income',
        Category: 'Order',
        Description: `Order ${o.id}`,
        Amount: o.totalAmount,
        UserEmail: o.user?.email || ''
      });
    });

    ledger.forEach(l => {
      flatData.push({
        Date: l.createdAt.toISOString(),
        Type: 'Expense',
        Category: l.type,
        Description: l.description,
        Amount: -Math.abs(l.amount), // Express expenses as negative
        UserEmail: l.user?.email || ''
      });
    });

    // Sort by Date
    flatData.sort((a, b) => new Date(a.Date).getTime() - new Date(b.Date).getTime());

    const json2csvParser = new Parser();
    const csv = json2csvParser.parse(flatData);

    // Return as downloadable file stream
    return new NextResponse(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="financial_export_${startParam}_to_${endParam}.csv"`
      }
    });

  } catch (error) {
    console.error('Failed to export CSV', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
