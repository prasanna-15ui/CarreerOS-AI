"use client";

import { GlassCard } from "@/components/ui/GlassCard";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend } from "recharts";

const COLORS = ['#6366F1', '#10B981', '#F59E0B', '#F43F5E', '#8B5CF6'];

export function WeeklyProductivityChart({ data }: { data: any[] }) {
  return (
    <GlassCard className="p-6 h-[350px]">
      <h3 className="text-lg font-bold text-white mb-6">Weekly Productivity</h3>
      <div className="h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
            <XAxis dataKey="date" stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip 
              cursor={{ fill: 'rgba(255,255,255,0.05)' }}
              contentStyle={{ backgroundColor: '#0B0F19', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }} 
            />
            <Bar dataKey="tasks" radius={[4, 4, 0, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill="url(#colorTasks)" />
              ))}
            </Bar>
            <defs>
              <linearGradient id="colorTasks" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366F1" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#6366F1" stopOpacity={0.2}/>
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </GlassCard>
  );
}

export function PipelineChart({ data }: { data: any[] }) {
  const order = ["Applied", "Shortlisted", "Interview", "Offer", "Rejected"];
  const sortedData = [...data].sort((a, b) => order.indexOf(a.name) - order.indexOf(b.name));

  return (
    <GlassCard className="p-6 h-[350px]">
      <h3 className="text-lg font-bold text-white mb-6">Application Pipeline</h3>
      <div className="h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={sortedData} layout="vertical" margin={{ top: 0, right: 0, left: 10, bottom: 0 }}>
            <XAxis type="number" stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis dataKey="name" type="category" stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip 
              cursor={{ fill: 'rgba(255,255,255,0.05)' }}
              contentStyle={{ backgroundColor: '#0B0F19', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }} 
            />
            <Bar dataKey="value" radius={[0, 4, 4, 0]}>
              {sortedData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </GlassCard>
  );
}

export function TaskBreakdownChart({ data }: { data: any[] }) {
  return (
    <GlassCard className="p-6 h-[350px]">
      <h3 className="text-lg font-bold text-white mb-6">Task Breakdown</h3>
      <div className="h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="45%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={5}
              dataKey="value"
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ backgroundColor: '#0B0F19', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }} 
            />
            <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px', color: '#94A3B8' }}/>
          </PieChart>
        </ResponsiveContainer>
      </div>
    </GlassCard>
  );
}
