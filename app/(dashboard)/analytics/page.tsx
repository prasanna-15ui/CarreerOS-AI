"use client";

import { useEffect, useState } from "react";
import { PageWrapper } from "@/components/ui/PageWrapper";
import { WeeklyProductivityChart, PipelineChart, TaskBreakdownChart } from "@/components/analytics/Charts";
import { Loader2 } from "lucide-react";

export default function AnalyticsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/analytics")
      .then(res => res.json())
      .then(json => {
        if (json.success) {
          setData(json.data);
        } else {
          console.error(json.error);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <PageWrapper className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Analytics Dashboard</h1>
        <p className="text-text-muted">Visualize your productivity and placement pipeline.</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-6">
          <div className="lg:col-span-2">
            <WeeklyProductivityChart data={data.weeklyProductivity} />
          </div>
          <PipelineChart data={data.pipelineData} />
          <TaskBreakdownChart data={data.taskBreakdown} />
        </div>
      )}
    </PageWrapper>
  );
}
