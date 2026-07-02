"use client";

import { useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Loader2, Send } from "lucide-react";
import { toast } from "sonner";

export default function AdminNotificationsPage() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    message: "",
    type: "announcement",
    targetUserId: "ALL"
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.message) {
      toast.error("Please fill out all fields");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/admin/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      const json = await res.json();
      
      if (json.success) {
        toast.success(json.message);
        setFormData({ ...formData, title: "", message: "" }); // Reset form
      } else {
        toast.error(json.error);
      }
    } catch (err) {
      toast.error("Failed to send notification");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Send Notifications</h1>
        <p className="text-text-muted">Broadcast announcements or send targeted messages to specific users.</p>
      </div>

      <GlassCard className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-white/80">Target Audience</label>
            <select
              className="w-full bg-[#1a1f2e] border border-white/10 rounded-lg px-4 py-3 text-white outline-none focus:border-purple-500"
              value={formData.targetUserId}
              onChange={(e) => setFormData({ ...formData, targetUserId: e.target.value })}
            >
              <option value="ALL">All Active Users (Broadcast)</option>
              <option value="SPECIFIC">Specific User (Enter ID)</option>
            </select>
          </div>

          {formData.targetUserId === "SPECIFIC" && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/80">User ID</label>
              <input
                type="text"
                placeholder="Enter exact User ID..."
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white outline-none focus:border-purple-500"
                onChange={(e) => setFormData({ ...formData, targetUserId: e.target.value })}
              />
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium text-white/80">Notification Title</label>
            <input
              type="text"
              placeholder="e.g., Platform Maintenance Update"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white outline-none focus:border-purple-500"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-white/80">Message</label>
            <textarea
              placeholder="Type your message here..."
              rows={4}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white outline-none focus:border-purple-500 resize-none"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto px-6 py-3 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
            <span>{loading ? "Sending..." : "Dispatch Notification"}</span>
          </button>
        </form>
      </GlassCard>
    </div>
  );
}
