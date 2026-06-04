import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// This route should ideally be protected by a cron secret in production
export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');
  if (process.env.CRON_SECRET && authHeader !== 'Bearer ' + process.env.CRON_SECRET) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const now = new Date();
    // Only run if it's the last day of the month (optional strict check)
    // const tomorrow = new Date(now);
    // tomorrow.setDate(now.getDate() + 1);
    // if (tomorrow.getDate() !== 1) {
    //   return NextResponse.json({ skipped: true, reason: 'Not last day of month' });
    // }

    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

    const employees = await prisma.employee.findMany({
      include: {
        attendanceRecords: {
          where: {
            date: {
              gte: startOfMonth,
              lte: endOfMonth
            }
          }
        }
      }
    });

    let totalPayroll = 0;
    const workingDaysInMonth = 22; // simplified

    for (const emp of employees) {
      const records = emp.attendanceRecords;
      const daysPresent = records.filter(r => r.status === 'PRESENT').length;
      
      if (daysPresent < workingDaysInMonth * 0.8) {
        // Log anomaly
        await prisma.adminAlert.create({
          data: {
            severity: 'WARNING',
            message: `Employee ${emp.name} had unusually low attendance (${daysPresent} days).`,
          }
        });
      }

      // Simplified calc: just pay base salary (or pro-rated)
      const pay = emp.baseSalary;
      totalPayroll += pay;
    }

    // Insert master LedgerEntry
    if (totalPayroll > 0) {
      // Find a system admin or generic user to attach the ledger entry to, 
      // or make userId optional in schema. For now, assume a system user exists
      const systemUser = await prisma.user.findFirst({
        where: { role_level: 999 }
      });

      if (systemUser) {
        await prisma.ledgerEntry.create({
          data: {
            userId: systemUser.id,
            amount: totalPayroll,
            type: 'Salary',
            description: 'Master Salary Transfer for ' + now.toLocaleString('default', { month: 'long', year: 'numeric' }),
          }
        });
      } else {
        await prisma.adminAlert.create({
          data: {
            severity: 'ERROR',
            message: 'Failed to insert LedgerEntry for Payroll: No system user found.',
          }
        });
      }
    }

    return NextResponse.json({ success: true, totalPayroll, employeesProcessed: employees.length });
  } catch (error) {
    console.error('Payroll cron failed', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
