"use client";

import { useEffect, useState } from "react";
import { Search, LogOut, User, Bell } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { GlassCard } from "@/components/ui/GlassCard";

export function TopBar() {
  const router = useRouter();
  const supabase = createClient();
  const [email, setEmail] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);

  const fetchNotifications = async () => {
    try {
      const res = await fetch("/api/notifications");
      const json = await res.json();
      if (json.success) setNotifications(json.data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setEmail(user.email ?? "User");
        fetchNotifications();
      }
    };
    getUser();
  }, [supabase.auth]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  return (
    <header className="w-full px-4 pt-4 pb-2 md:py-4 z-10 relative">
      <GlassCard className="flex items-center justify-between px-6 py-3 rounded-full">
        <div className="relative w-full max-w-md hidden md:block">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-text-muted" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 bg-black/20 border border-white/10 rounded-full text-white placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm"
            placeholder="Search..."
          />
        </div>
        
        <div className="flex items-center gap-4 ml-auto">
          
          <div className="relative">
            <button 
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              className="p-2 rounded-full hover:bg-white/10 transition-colors relative"
            >
              <Bell className="w-5 h-5 text-text-muted hover:text-white transition-colors" />
              {notifications.filter(n => !n.read).length > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              )}
            </button>
            
            {isNotifOpen && (
              <GlassCard className="absolute right-0 mt-2 w-72 max-h-96 overflow-y-auto py-2 z-50">
                <h3 className="px-4 py-2 text-sm font-semibold text-white border-b border-white/10">Notifications</h3>
                {notifications.length === 0 ? (
                  <div className="px-4 py-6 text-center text-sm text-text-muted">No new notifications.</div>
                ) : (
                  notifications.map(n => (
                    <div key={n.id} className={`px-4 py-3 text-sm border-b border-white/10 last:border-0 hover:bg-white/5 transition-colors ${!n.read ? 'bg-primary/5' : ''}`}>
                      <p className="text-white/90">{n.message}</p>
                    </div>
                  ))
                )}
              </GlassCard>
            )}
          </div>

          <div className="relative">
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 hover:bg-white/10 p-1 pr-3 rounded-full transition-colors border border-transparent hover:border-white/10"
            >
              <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/50 flex items-center justify-center">
                <User className="w-4 h-4 text-primary" />
              </div>
              <span className="text-sm font-medium text-white/90 hidden sm:block">
                {email || "Loading..."}
              </span>
            </button>
            
            {isDropdownOpen && (
              <GlassCard className="absolute right-0 mt-2 w-48 py-2 px-1 z-50">
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-white/10 hover:text-red-300 rounded-lg transition-colors flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </GlassCard>
            )}
          </div>
        </div>
      </GlassCard>
    </header>
  );
}
