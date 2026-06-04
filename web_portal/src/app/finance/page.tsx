import ProfitChart from '@/components/finance/ProfitChart';
import FinancialExport from '@/components/finance/FinancialExport';

export default function FinanceDashboard() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-8 font-sans">
      <h1 className="text-3xl font-light text-slate-100 mb-8 border-b border-slate-800 pb-4">Finance Intelligence</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <ProfitChart />
        </div>
        <div className="lg:col-span-1">
          <FinancialExport />
        </div>
      </div>
    </div>
  );
}
