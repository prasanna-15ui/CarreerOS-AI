"use client";

import { useEffect, useState } from "react";
import { PageWrapper } from "@/components/ui/PageWrapper";
import { GlassCard } from "@/components/ui/GlassCard";
import { CheckCircle, Briefcase, Calendar, TrendingUp, Loader2, Sparkles, ArrowRight } from "lucide-react";
import { LineChart, Line, ResponsiveContainer, Tooltip as RechartsTooltip } from "recharts";

export default function DashboardPage() {
  const [userName, setUserName] = useState<string>("User");
  const [greeting, setGreeting] = useState<string>("");
  const [analytics, setAnalytics] = useState<any>(null);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    // Determine time of day greeting
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good Morning");
    else if (hour < 18) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");

    const fetchData = async () => {
      try {
        const [profileRes, summaryRes, aiRes] = await Promise.all([
          fetch("/api/profile"),
          fetch("/api/dashboard/summary"),
          fetch("/api/ai/recommendations")
        ]);

        if (profileRes.ok) {
          const pData = await profileRes.json();
          if (pData.data?.name) {
            setUserName(pData.data.name);
          } else if (pData.data?.email) {
            const namePart = pData.data.email.split("@")[0];
            setUserName(namePart.charAt(0).toUpperCase() + namePart.slice(1));
          }
        }

        if (summaryRes.ok) {
          const sData = await summaryRes.json();
          setAnalytics(sData.data);
        }

        if (aiRes.ok) {
          const aiData = await aiRes.json();
          if (aiData.success) {
            setRecommendations(aiData.data);
          }
        }
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  let completionRate = 0;
  let prodScore = 0;

  if (analytics) {
    completionRate = analytics.totalTasks > 0 ? Math.round((analytics.completedTasks / analytics.totalTasks) * 100) : 0;
    // Simple mock productivity score formula (0-100)
    prodScore = Math.min(100, Math.round((analytics.completedTasks * 10) + (analytics.activeApplications * 5)));
  }

  const stats = [
    { title: "Task Completion", value: `${completionRate}%`, icon: CheckCircle, color: "text-emerald-400" },
    { title: "Active Applications", value: analytics?.activeApplications || "0", icon: Briefcase, color: "text-blue-400" },
    { title: "Upcoming Deadlines", value: analytics?.upcomingDeadlines || "0", icon: Calendar, color: "text-amber-400" },
    { title: "Productivity Score", value: prodScore.toString(), icon: TrendingUp, color: "text-purple-400" },
  ];

  return (
    <PageWrapper className="space-y-8">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
          {greeting}, {userName}
        </h1>
        <p className="text-text-muted">
          Here is what's happening with your career today.
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-40">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {stats.map((stat, i) => (
              <GlassCard key={i} className="p-6 flex items-center gap-4 hover:bg-white/10 transition-colors">
                <div className={`p-4 rounded-2xl bg-white/5 border border-white/10 ${stat.color}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-text-muted font-medium mb-1">{stat.title}</p>
                  <h3 className="text-2xl font-bold text-white">{stat.value}</h3>
                </div>
              </GlassCard>
            ))}
          </div>

          <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <GlassCard className="p-6 h-full">
                <h3 className="text-lg font-bold text-white mb-4">7-Day Activity Sparkline</h3>
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={analytics.weeklyProductivity}>
                      <Line type="monotone" dataKey="tasks" stroke="#6366F1" strokeWidth={3} dot={{ r: 4, fill: '#6366F1' }} />
                      <RechartsTooltip 
                        cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                        contentStyle={{ backgroundColor: '#0B0F19', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }} 
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </GlassCard>
            </div>
            
            <div>
              <GlassCard className="p-6 h-full bg-gradient-to-br from-primary/10 to-transparent border-primary/20">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-5 h-5 text-primary" />
                  <h3 className="text-lg font-bold text-white">AI Recommendations</h3>
                </div>
                <div className="space-y-4">
                  {recommendations.length > 0 ? (
                    recommendations.map((rec, i) => (
                      <div key={i} className="p-4 rounded-xl bg-black/20 border border-white/5">
                        <p className="text-sm text-white/90 mb-2">{rec.message}</p>
                        {rec.action && (
                          <a href={rec.action} className="text-xs text-primary flex items-center gap-1 hover:underline w-fit">
                            Take action <ArrowRight className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="p-4 rounded-xl bg-black/20 text-sm text-text-muted text-center">
                      Collecting data to generate insights...
                    </div>
                  )}
                </div>
              </GlassCard>
            </div>
          </div>
        </>
      )}
    </PageWrapper>
  );
}
