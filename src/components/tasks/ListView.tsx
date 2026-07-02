"use client";

import { GlassCard } from "@/components/ui/GlassCard";
import { Task } from "./KanbanBoard";
import { Calendar, Trash2 } from "lucide-react";

export function ListView({ tasks, onDelete }: { tasks: Task[], onDelete: (id: string) => Promise<void> }) {
  const PriorityBadge = ({ priority }: { priority: string }) => {
    const colors = {
      Low: "bg-blue-500/20 text-blue-300 border-blue-500/30",
      Medium: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
      High: "bg-red-500/20 text-red-300 border-red-500/30",
    };
    const colorClass = colors[priority as keyof typeof colors] || colors.Medium;
    return (
      <span className={`text-xs px-2 py-1 rounded-full border ${colorClass}`}>
        {priority}
      </span>
    );
  };

  const StatusBadge = ({ status }: { status: string }) => {
    return (
      <span className="text-xs px-2 py-1 rounded-full bg-white/10 text-white/90">
        {status}
      </span>
    );
  };

  return (
    <div className="space-y-4">
      {tasks.length === 0 ? (
        <div className="text-center py-12 text-white/50">
          No tasks found matching the criteria.
        </div>
      ) : (
        tasks.map(task => (
          <GlassCard key={task.id} className="p-4 flex items-center justify-between hover:bg-white/10 transition-colors">
            <div className="flex-1">
              <h4 className="font-semibold text-white mb-1">{task.title}</h4>
              {task.description && (
                <p className="text-sm text-text-muted truncate max-w-lg mb-2">{task.description}</p>
              )}
              <div className="flex items-center gap-3">
                <StatusBadge status={task.status} />
                <PriorityBadge priority={task.priority} />
                {task.due_date && (
                  <div className="flex items-center text-xs text-text-muted">
                    <Calendar className="w-3 h-3 mr-1" />
                    {new Date(task.due_date).toLocaleDateString()}
                  </div>
                )}
              </div>
            </div>
            <button 
              onClick={() => onDelete(task.id)}
              className="p-2 text-red-400/70 hover:text-red-400 hover:bg-red-400/10 rounded-full transition-colors"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </GlassCard>
        ))
      )}
    </div>
  );
}
