import { GlassCard } from "@/components/ui/GlassCard";
import { Users, LayoutDashboard, LogOut, BarChart3, FileText, Briefcase, CheckSquare, Bell } from "lucide-react";
import Link from "next/link";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-[#0B0F19] text-white">
      {/* Sidebar */}
      <aside className="w-64 hidden md:flex flex-col border-r border-white/10 bg-white/5">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <span className="font-bold text-white text-lg">A</span>
            </div>
            <span className="font-bold text-xl tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70">
              Admin Portal
            </span>
          </div>

          <nav className="space-y-2 flex-1">
            <Link href="/admin/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/10 transition-colors text-white/80 hover:text-white">
              <LayoutDashboard className="w-5 h-5" />
              <span>Dashboard</span>
            </Link>
            <Link href="/admin/analytics" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/10 transition-colors text-white/80 hover:text-white">
              <BarChart3 className="w-5 h-5" />
              <span>Analytics</span>
            </Link>
            <Link href="/admin/users" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/10 transition-colors text-white/80 hover:text-white">
              <Users className="w-5 h-5" />
              <span>User Management</span>
            </Link>
            <Link href="/admin/resumes" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/10 transition-colors text-white/80 hover:text-white">
              <FileText className="w-5 h-5" />
              <span>Resumes</span>
            </Link>
            <Link href="/admin/placements" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/10 transition-colors text-white/80 hover:text-white">
              <Briefcase className="w-5 h-5" />
              <span>Placements</span>
            </Link>
            <Link href="/admin/tasks" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/10 transition-colors text-white/80 hover:text-white">
              <CheckSquare className="w-5 h-5" />
              <span>Tasks</span>
            </Link>
            <Link href="/admin/notifications" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/10 transition-colors text-white/80 hover:text-white">
              <Bell className="w-5 h-5" />
              <span>Notifications</span>
            </Link>
          </nav>
        </div>
        
        <div className="mt-auto p-6">
          <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/10 transition-colors text-white/80 hover:text-white w-full">
            <LogOut className="w-5 h-5" />
            <span>Exit Admin</span>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
