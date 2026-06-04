import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

    // Sum completed orders
    const incomeAgg = await prisma.order.aggregate({
      where: {
        status: 'Completed',
        createdAt: {
          gte: startOfMonth,
          lte: endOfMonth
        }
      },
      _sum: {
        totalAmount: true
      }
    });

    const income = incomeAgg._sum.totalAmount || 0;

    // Sum expenses from LedgerEntries (Materials, Electricity, Salary, Transport)
    const expenseAgg = await prisma.ledgerEntry.aggregate({
      where: {
        type: {
          in: ['Materials', 'Electricity', 'Salary', 'Transport']
        },
        createdAt: {
          gte: startOfMonth,
          lte: endOfMonth
        }
      },
      _sum: {
        amount: true
      }
    });

    const expenses = expenseAgg._sum.amount || 0;

    return NextResponse.json({
      success: true,
      data: {
        income,
        expenses,
        netProfit: income - expenses,
        month: startOfMonth.toISOString(),
      }
    });
  } catch (error) {
    console.error('Failed to calculate monthly summary', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
