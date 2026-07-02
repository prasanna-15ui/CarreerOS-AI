"use client";

import { useEffect, useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Loader2, Trash2, Download, Search } from "lucide-react";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

export default function AdminResumesPage() {
  const [resumes, setResumes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchResumes = async () => {
    try {
      const res = await fetch("/api/resumes");
      const json = await res.json();
      if (json.success) {
        setResumes(json.data);
      } else {
        toast.error(json.error);
      }
    } catch (err) {
      toast.error("Failed to load resumes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResumes();
  }, []);

  const deleteResume = async (id: string, fileUrl: string) => {
    if (!confirm("Are you sure you want to delete this resume?")) return;
    try {
      const res = await fetch(`/api/resumes/${id}?fileUrl=${encodeURIComponent(fileUrl)}`, { method: "DELETE" });
      const json = await res.json();
      if (json.success) {
        toast.success("Resume deleted successfully");
        fetchResumes();
      } else {
        toast.error(json.error);
      }
    } catch (err) {
      toast.error("Failed to delete resume");
    }
  };

  if (loading) {
    return <div className="flex h-full items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  }

  const filteredResumes = resumes.filter(r => 
    (r.file_name || "").toLowerCase().includes(search.toLowerCase()) || 
    (r.user_id || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Resume Management</h1>
        <p className="text-text-muted">View and manage all uploaded resumes.</p>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="relative w-full sm:w-1/3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
          <input 
            type="text" 
            placeholder="Search by file name or user ID..." 
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
              <th className="p-4 text-sm font-medium text-white/70">File Name</th>
              <th className="p-4 text-sm font-medium text-white/70">User ID</th>
              <th className="p-4 text-sm font-medium text-white/70">Tags</th>
              <th className="p-4 text-sm font-medium text-white/70">Uploaded</th>
              <th className="p-4 text-sm font-medium text-white/70 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredResumes.map((r) => (
              <tr key={r.id} className="border-b border-white/10 last:border-0 hover:bg-white/5">
                <td className="p-4 text-sm text-white">{r.file_name}</td>
                <td className="p-4 text-xs text-white/50 font-mono">{r.user_id.substring(0, 8)}...</td>
                <td className="p-4 text-sm text-white/80">
                  <div className="flex flex-wrap gap-1">
                    {r.tags && r.tags.length > 0 ? r.tags.map((tag: string, i: number) => (
                      <span key={i} className="px-2 py-0.5 bg-white/10 rounded text-xs">{tag}</span>
                    )) : <span className="text-white/30 text-xs">No tags</span>}
                  </div>
                </td>
                <td className="p-4 text-sm text-white/60">
                  {formatDistanceToNow(new Date(r.created_at), { addSuffix: true })}
                </td>
                <td className="p-4 text-sm text-right space-x-2 flex justify-end items-center">
                  <a 
                    href={r.file_url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-blue-400 hover:text-blue-300 px-2 py-1 bg-blue-400/10 rounded hover:bg-blue-400/20 transition-colors inline-flex items-center"
                    title="Download/View"
                  >
                    <Download className="w-3 h-3" />
                  </a>
                  <button 
                    onClick={() => deleteResume(r.id, r.file_url)}
                    className="text-xs text-red-400 hover:text-red-300 px-2 py-1 bg-red-400/10 rounded hover:bg-red-400/20 transition-colors inline-flex items-center"
                    title="Delete"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </td>
              </tr>
            ))}
            {filteredResumes.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-white/50">No resumes found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </GlassCard>
    </div>
  );
}
