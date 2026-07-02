"use client";

import { useEffect, useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Loader2, Trash2, Search, Edit2 } from "lucide-react";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

export default function AdminPlacementsPage() {
  const [placements, setPlacements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchPlacements = async () => {
    try {
      const res = await fetch("/api/placements");
      const json = await res.json();
      if (json.success) {
        setPlacements(json.data);
      } else {
        toast.error(json.error);
      }
    } catch (err) {
      toast.error("Failed to load placements");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlacements();
  }, []);

  const deletePlacement = async (id: string) => {
    if (!confirm("Are you sure you want to delete this placement record?")) return;
    try {
      const res = await fetch(`/api/placements/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (json.success) {
        toast.success("Placement deleted successfully");
        fetchPlacements();
      } else {
        toast.error(json.error);
      }
    } catch (err) {
      toast.error("Failed to delete placement");
    }
  };

  if (loading) {
    return <div className="flex h-full items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  }

  const filteredPlacements = placements.filter(p => 
    (p.company_name || "").toLowerCase().includes(search.toLowerCase()) || 
    (p.role || "").toLowerCase().includes(search.toLowerCase()) ||
    (p.user_id || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Placement Management</h1>
        <p className="text-text-muted">View and manage all user job application pipelines.</p>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="relative w-full sm:w-1/3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
          <input 
            type="text" 
            placeholder="Search company, role or user ID..." 
            className="bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-white outline-none focus:border-purple-500 w-full"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <GlassCard className="overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/10 bg-white/5">
              <th className="p-4 text-sm font-medium text-white/70">Company & Role</th>
              <th className="p-4 text-sm font-medium text-white/70">User ID</th>
              <th className="p-4 text-sm font-medium text-white/70">Status</th>
              <th className="p-4 text-sm font-medium text-white/70">Added</th>
              <th className="p-4 text-sm font-medium text-white/70 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPlacements.map((p) => (
              <tr key={p.id} className="border-b border-white/10 last:border-0 hover:bg-white/5">
                <td className="p-4">
                  <p className="text-sm text-white font-medium">{p.company_name}</p>
                  <p className="text-xs text-white/50">{p.role}</p>
                </td>
                <td className="p-4 text-xs text-white/50 font-mono">{p.user_id.substring(0, 8)}...</td>
                <td className="p-4">
                  <span className="px-2 py-1 text-xs rounded-md bg-white/10 text-white/80 capitalize">
                    {p.status.replace("_", " ")}
                  </span>
                </td>
                <td className="p-4 text-sm text-white/60">
                  {formatDistanceToNow(new Date(p.created_at), { addSuffix: true })}
                </td>
                <td className="p-4 text-sm text-right space-x-2 flex justify-end items-center">
                  <button 
                    onClick={() => deletePlacement(p.id)}
                    className="text-xs text-red-400 hover:text-red-300 px-2 py-1 bg-red-400/10 rounded hover:bg-red-400/20 transition-colors inline-flex items-center"
                    title="Delete"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </td>
              </tr>
            ))}
            {filteredPlacements.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-white/50">No placement records found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </GlassCard>
    </div>
  );
}
