import { Sidebar, BottomNav } from "@/components/layout/Sidebar";
import { TopBar } from "@/components/layout/TopBar";
import React from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen w-screen bg-mesh-gradient flex flex-col md:flex-row overflow-hidden fixed inset-0">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden relative z-0">
        <TopBar />
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-6 pb-24 md:pb-6 relative z-0">
          {children}
        </main>
      </div>
      <BottomNav />
    </div>
  );
}
