
import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { Todo, Priority } from '../types';

interface StatsProps {
  todos: Todo[];
}

const Stats: React.FC<StatsProps> = ({ todos }) => {
  const stats = useMemo(() => {
    const total = todos.length;
    const completed = todos.filter(t => t.completed).length;
    const pending = total - completed;
    
    const byPriority = [
      { name: 'High', value: todos.filter(t => t.priority === Priority.HIGH).length },
      { name: 'Med', value: todos.filter(t => t.priority === Priority.MEDIUM).length },
      { name: 'Low', value: todos.filter(t => t.priority === Priority.LOW).length },
    ];

    const pieData = [
      { name: 'Completed', value: completed },
      { name: 'Pending', value: pending },
    ];

    return { total, completed, pending, byPriority, pieData };
  }, [todos]);

  const COLORS = ['#3b82f6', '#1e293b']; // Blue and Slate 800
  const PRIORITY_COLORS = ['#f43f5e', '#fbbf24', '#10b981'];

  if (todos.length === 0) return null;

  return (
    <div className="p-6 bg-slate-800 rounded-2xl shadow-sm border border-slate-700 space-y-6">
      <h3 className="font-semibold text-slate-200">Insights</h3>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl text-center">
          <div className="text-2xl font-bold text-blue-400">{stats.completed}</div>
          <div className="text-[10px] text-blue-500 uppercase font-bold tracking-widest">Done</div>
        </div>
        <div className="p-4 bg-slate-900 border border-slate-700 rounded-xl text-center">
          <div className="text-2xl font-bold text-slate-400">{stats.pending}</div>
          <div className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Pending</div>
        </div>
      </div>

      <div className="h-48 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={stats.pieData}
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
              stroke="none"
            >
              {stats.pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '12px', color: '#f1f5f9' }}
              itemStyle={{ color: '#f1f5f9' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="h-40 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={stats.byPriority}>
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              fontSize={10} 
              tick={{ fill: '#64748b' }} 
            />
            <Tooltip 
              cursor={{fill: 'rgba(255,255,255,0.05)'}} 
              contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '12px', color: '#f1f5f9' }}
            />
            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
              {stats.byPriority.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={PRIORITY_COLORS[index % PRIORITY_COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Stats;
