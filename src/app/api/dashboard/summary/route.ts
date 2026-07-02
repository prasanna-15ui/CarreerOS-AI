import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    // 1. Fetch tasks
    const { data: tasksData, error: tErr } = await supabase
      .from("tasks")
      .select("status, created_at, due_date")
      .eq("user_id", user.id);
    
    if (tErr) throw tErr;

    // 2. Fetch companies
    const { data: companiesData, error: cErr } = await supabase
      .from("companies")
      .select("status")
      .eq("user_id", user.id);
    
    if (cErr) throw cErr;

    // Aggregations
    const totalTasks = tasksData.length;
    const completedTasks = tasksData.filter(t => t.status === "Completed").length;

    const activeApplications = companiesData.filter(c => 
      c.status !== "Offer" && c.status !== "Rejected"
    ).length;

    // Upcoming deadlines in the next 7 days
    let upcomingDeadlines = 0;
    const today = new Date();
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

    // 7-day Weekly Productivity
    const weeklyProductivity = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      
      const count = tasksData.filter(t => t.created_at && t.created_at.startsWith(dateStr)).length;
      
      weeklyProductivity.push({
        date: d.toLocaleDateString('en-US', { weekday: 'short' }),
        tasks: count
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        totalTasks,
        completedTasks,
        activeApplications,
        upcomingDeadlines,
        weeklyProductivity
      }
    }, { status: 200 });

  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || "Internal server error" }, { status: 500 });
  }
}
