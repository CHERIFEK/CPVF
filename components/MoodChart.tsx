import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Feedback, ChartDataPoint, MoodType } from '../types';

interface MoodChartProps {
  feedbacks: Feedback[];
}

const MoodChart: React.FC<MoodChartProps> = ({ feedbacks }) => {
  const processData = (): ChartDataPoint[] => {
    const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    feedbacks.forEach((f) => {
      if (counts[f.mood as keyof typeof counts] !== undefined) {
        counts[f.mood as keyof typeof counts]++;
      }
    });

    return [
      { mood: 'Angry', count: counts[1], color: '#f87171' },
      { mood: 'Sad', count: counts[2], color: '#fb923c' },
      { mood: 'Okay', count: counts[3], color: '#facc15' },
      { mood: 'Good', count: counts[4], color: '#2dd4bf' },
      { mood: 'Great', count: counts[5], color: '#34d399' },
    ];
  };

  const data = processData();
  const total = feedbacks.length;
  const averageMood = total > 0 
    ? (feedbacks.reduce((acc, curr) => acc + curr.mood, 0) / total).toFixed(1) 
    : '0.0';

  if (total === 0) {
    return (
      <div className="h-64 flex flex-col items-center justify-center text-slate-400 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
        <p>No mood data yet.</p>
        <p className="text-sm">Be the first to share feedback!</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 h-full flex flex-col">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h3 className="text-lg font-semibold text-slate-800">Team Mood</h3>
          <p className="text-sm text-slate-500">Based on {total} anonymous entries</p>
        </div>
        <div className="text-right">
          <span className="text-3xl font-bold text-slate-800">{averageMood}</span>
          <span className="text-slate-400 text-sm">/5.0</span>
        </div>
      </div>
      
      <div className="flex-grow w-full h-48 sm:h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <XAxis 
              dataKey="mood" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 12, fill: '#94a3b8' }} 
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 12, fill: '#94a3b8' }} 
              allowDecimals={false}
            />
            <Tooltip 
              cursor={{ fill: '#f1f5f9', radius: 8 }}
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            />
            <Bar dataKey="count" radius={[6, 6, 6, 6]} barSize={40}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default MoodChart;
