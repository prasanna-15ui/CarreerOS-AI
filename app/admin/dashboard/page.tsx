"use client";

import { useEffect, useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Users, CheckCircle, Briefcase, FileText, Target, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/admin/dashboard");
        const json = await res.json();
        if (json.success) {
          setStats(json.data);
        } else {
          toast.error(json.error);
        }
      } catch (err: any) {
        toast.error("Failed to load admin stats");
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
    { title: "Total Tasks", value: stats?.totalTasks || 0, icon: CheckCircle, color: "text-emerald-400" },
    { title: "Total Placements", value: stats?.totalPlacements || 0, icon: Briefcase, color: "text-purple-400" },
    { title: "Total Resumes", value: stats?.totalResumes || 0, icon: FileText, color: "text-pink-400" },
    { title: "Total Goals", value: stats?.totalGoals || 0, icon: Target, color: "text-amber-400" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Platform Overview</h1>
        <p className="text-text-muted">Global statistics across all CareerOS AI users.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6">
        {statCards.map((stat, i) => (
          <GlassCard key={i} className="p-6 flex flex-col gap-4">
            <div className={`p-3 rounded-xl bg-white/5 border border-white/10 w-fit ${stat.color}`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-text-muted font-medium mb-1">{stat.title}</p>
              <h3 className="text-3xl font-bold text-white">{stat.value}</h3>
            </div>
          </GlassCard>
        ))}
      </div>

      <div>
        <h2 className="text-xl font-bold text-white mb-4">Recent Activities (Tasks)</h2>
        <GlassCard className="overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-white/5">
                <th className="p-4 text-sm font-medium text-white/70">User</th>
                <th className="p-4 text-sm font-medium text-white/70">Task Title</th>
                <th className="p-4 text-sm font-medium text-white/70">Created At</th>
              </tr>
            </thead>
            <tbody>
              {stats?.recentActivities?.map((act: any, i: number) => (
                <tr key={i} className="border-b border-white/10 last:border-0 hover:bg-white/5">
                  <td className="p-4 text-sm text-white">{act.profiles?.name || act.profiles?.email || 'Unknown User'}</td>
                  <td className="p-4 text-sm text-white/80">{act.title}</td>
                  <td className="p-4 text-sm text-white/60">{new Date(act.created_at).toLocaleString()}</td>
                </tr>
              ))}
              {stats?.recentActivities?.length === 0 && (
                <tr>
                  <td colSpan={3} className="p-8 text-center text-white/50">No recent activities found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </GlassCard>
      </div>
    </div>
  );
}
