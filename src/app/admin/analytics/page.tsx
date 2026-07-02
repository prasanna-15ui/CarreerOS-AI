"use client";

import { useEffect, useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Loader2, Users, Activity, FileText, Briefcase, CheckSquare, BarChart } from "lucide-react";
import { toast } from "sonner";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

export default function AdminAnalyticsPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState<"weekly" | "monthly">("weekly");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/admin/analytics");
        const json = await res.json();
        if (json.success) {
          setStats(json.data);
        } else {
          toast.error(json.error);
        }
      } catch (err) {
        toast.error("Failed to load analytics");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return <div className="flex h-full items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  }

  const statCards = [
    { title: "Total Users", value: stats?.totalUsers || 0, icon: Users, color: "text-blue-400" },
    { title: "Active Users", value: stats?.activeUsers || 0, icon: Activity, color: "text-emerald-400" },
    { title: "Total Resumes", value: stats?.totalResumes || 0, icon: FileText, color: "text-purple-400" },
    { title: "Total Placements", value: stats?.totalPlacements || 0, icon: Briefcase, color: "text-pink-400" },
    { title: "Total Tasks", value: stats?.totalTasks || 0, icon: CheckSquare, color: "text-amber-400" },
    { title: "Avg Resume Score", value: `${stats?.avgResumeScore || 0}%`, icon: BarChart, color: "text-cyan-400" },
  ];

  const chartData = timeframe === "weekly" ? stats?.weeklyData : stats?.monthlyData;

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Platform Analytics</h1>
          <p className="text-text-muted">Deep dive into CareerOS AI usage metrics.</p>
        </div>
        <div className="flex bg-white/5 rounded-lg p-1 border border-white/10">
          <button 
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${timeframe === 'weekly' ? 'bg-purple-600 text-white' : 'text-white/60 hover:text-white'}`}
            onClick={() => setTimeframe("weekly")}
          >
            Weekly
          </button>
          <button 
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${timeframe === 'monthly' ? 'bg-purple-600 text-white' : 'text-white/60 hover:text-white'}`}
            onClick={() => setTimeframe("monthly")}
          >
            Monthly
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {statCards.map((stat, i) => (
          <GlassCard key={i} className="p-5 flex flex-col gap-3">
            <div className={`p-2 rounded-lg bg-white/5 border border-white/10 w-fit ${stat.color}`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-text-muted font-medium mb-1">{stat.title}</p>
              <h3 className="text-2xl font-bold text-white">{stat.value}</h3>
            </div>
          </GlassCard>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassCard className="p-6">
          <h3 className="text-lg font-bold text-white mb-6">User Growth & Engagement</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                <XAxis dataKey="date" stroke="rgba(255,255,255,0.5)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="rgba(255,255,255,0.5)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e2330', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="users" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorUsers)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <h3 className="text-lg font-bold text-white mb-6">Tasks & Placements Activity</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                <XAxis dataKey="date" stroke="rgba(255,255,255,0.5)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="rgba(255,255,255,0.5)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e2330', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                />
                <Line type="monotone" dataKey="tasks" stroke="#34d399" strokeWidth={3} dot={false} />
                <Line type="monotone" dataKey="placements" stroke="#f472b6" strokeWidth={3} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
