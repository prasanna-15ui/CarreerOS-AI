import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    // 1. Tasks by Status
    const { data: tasksData, error: tErr } = await supabase
      .from("tasks")
      .select("status, created_at, due_date")
      .eq("user_id", user.id);

    if (tErr) throw new Error(tErr.message);

    const tasksByStatus = {
      Pending: 0,
      "In Progress": 0,
      Completed: 0
    };

    tasksData.forEach(t => {
      if (t.status in tasksByStatus) {
        tasksByStatus[t.status as keyof typeof tasksByStatus]++;
      }
    });

    const taskBreakdown = Object.entries(tasksByStatus).map(([name, value]) => ({ name, value }));

    // 2. Companies by Status
    const { data: companiesData, error: cErr } = await supabase
      .from("companies")
      .select("status")
      .eq("user_id", user.id);

    if (cErr) throw new Error(cErr.message);

    const companyStatusCounts: Record<string, number> = {
      Applied: 0, Shortlisted: 0, Interview: 0, Offer: 0, Rejected: 0
    };

    companiesData.forEach(c => {
      if (c.status in companyStatusCounts) {
        companyStatusCounts[c.status]++;
      }
    });

    const pipelineData = Object.entries(companyStatusCounts).map(([name, value]) => ({ name, value }));

    // 3. Weekly Productivity (Tasks created per day in last 7 days)
    const weeklyProductivity = [];
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];

      const count = tasksData.filter(t => t.created_at.startsWith(dateStr)).length;

      weeklyProductivity.push({
        date: d.toLocaleDateString('en-US', { weekday: 'short' }),
        tasks: count
      });
    }

    // 4. Upcoming Deadlines (within 7 days)
    let upcomingDeadlines = 0;
    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(today.getDate() + 7);

    tasksData.forEach(t => {
      if (t.due_date && t.status !== "Completed") {
        const dueDate = new Date(t.due_date);
        if (dueDate >= today && dueDate <= sevenDaysFromNow) {
          upcomingDeadlines++;
        }
      }
    });

    return NextResponse.json({
      success: true,
      data: {
        taskBreakdown,
        pipelineData,
        weeklyProductivity,
        totalTasks: tasksData.length,
        completedTasks: tasksByStatus.Completed,
        totalCompanies: companiesData.length,
        activeApplications: companiesData.length - companyStatusCounts.Offer - companyStatusCounts.Rejected,
        upcomingDeadlines
      }
    }, { status: 200 });

  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || "Internal server error" }, { status: 500 });
  }
}
