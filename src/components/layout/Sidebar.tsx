"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  CheckSquare, 
  Briefcase, 
  FileText, 
  BarChart2, 
  Target,
  Sparkles
} from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Tasks", href: "/tasks", icon: CheckSquare },
  { name: "Placements", href: "/placements", icon: Briefcase },
  { name: "Resumes", href: "/resumes", icon: FileText },
  { name: "Analytics", href: "/analytics", icon: BarChart2 },
  { name: "Goals", href: "/goals", icon: Target },
  { name: "AI Tools", href: "/ai-tools", icon: Sparkles },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <GlassCard className="h-full w-64 flex-col p-4 rounded-none border-t-0 border-l-0 border-b-0 md:rounded-r-2xl md:border-t md:border-b md:my-4 hidden md:flex z-10">
      <div className="flex items-center gap-3 px-2 py-4 mb-8">
        <Sparkles className="w-8 h-8 text-primary" />
        <span className="text-xl font-bold text-white tracking-wide">CareerOS</span>
      </div>

      <nav className="flex-1 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          const Icon = item.icon;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl border-l-2 transition-all duration-300 ${
                isActive 
                  ? "bg-white/10 text-white border-primary drop-shadow-[0_0_8px_rgba(99,102,241,0.5)]" 
                  : "border-transparent text-text-muted hover:text-white hover:bg-white/5"
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? "text-primary" : ""}`} />
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </GlassCard>
  );
}

export function BottomNav() {
  const pathname = usePathname();

  return (
    <GlassCard className="fixed bottom-0 left-0 right-0 h-16 md:hidden flex items-center justify-around px-2 z-50 rounded-none border-b-0 border-x-0 border-white/10 bg-[#0B0F19]/90">
      {navItems.map((item) => {
        const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
        const Icon = item.icon;
        
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center justify-center p-2 rounded-lg transition-colors ${
              isActive ? "text-primary" : "text-text-muted hover:text-white"
            }`}
          >
            <Icon className="w-5 h-5 mb-1" />
            <span className="text-[10px] font-medium">{item.name}</span>
          </Link>
        );
      })}
    </GlassCard>
  );
}
