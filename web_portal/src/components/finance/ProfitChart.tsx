'use client';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { month: 'Jan', profit: 12000 },
  { month: 'Feb', profit: 15000 },
  { month: 'Mar', profit: 11000 },
  { month: 'Apr', profit: 22000 },
  { month: 'May', profit: 28000 },
  { month: 'Jun', profit: 25000 },
];

export default function ProfitChart() {
  // Simple heuristic for current trend color based on last two data points
  const isPositiveTrend = data[data.length - 1].profit >= data[data.length - 2].profit;
  const strokeColor = isPositiveTrend ? '#10b981' : '#f59e0b'; // Emerald or Amber

  return (
    <div className="w-full h-96 bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-2xl">
      <h2 className="text-xl font-light text-slate-200 mb-6 uppercase tracking-widest">MoM Net Profit Growth</h2>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
          <XAxis 
            dataKey="month" 
            stroke="#64748b" 
            tick={{fill: '#64748b'}} 
            axisLine={false}
            tickLine={false}
            dy={10}
          />
          <YAxis 
            stroke="#64748b" 
            tick={{fill: '#64748b'}}
            axisLine={false}
            tickLine={false}
            tickFormatter={(value) => '$' + (value/1000) + 'k'}
            dx={-10}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#f8fafc' }}
            itemStyle={{ color: strokeColor, fontWeight: 'bold' }}
            formatter={(value: any) => ['$' + Number(value).toLocaleString(), 'Net Profit']}
          />
          <Line 
            type="monotone" 
            dataKey="profit" 
            stroke={strokeColor} 
            strokeWidth={4}
            dot={{ r: 6, fill: '#0f172a', stroke: strokeColor, strokeWidth: 3 }}
            activeDot={{ r: 8, fill: strokeColor, stroke: '#0f172a', strokeWidth: 2 }}
            style={{
              filter: 'drop-shadow(0px 0px 8px ' + strokeColor + ')'
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
