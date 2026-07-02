"use client";

import { useEffect, useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Edit2, Trash2 } from "lucide-react";

export type Goal = {
  id: string;
  title: string;
  description: string | null;
  progress: number;
  deadline: string | null;
};

export function GoalCard({ goal, onEdit, onDelete }: { goal: Goal, onEdit: (g: Goal) => void, onDelete: (id: string) => Promise<void> }) {
  const [progressOffset, setProgressOffset] = useState(100);
  
  useEffect(() => {
    const offset = 100 - (goal.progress || 0);
    setProgressOffset(offset);
  }, [goal.progress]);

  return (
    <GlassCard className="p-6 relative group bg-[#0B0F19]/40 hover:bg-[#0B0F19]/60 transition-colors">
      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
        <button onClick={() => onEdit(goal)} className="p-2 text-text-muted hover:text-white hover:bg-white/10 rounded-lg"><Edit2 className="w-4 h-4" /></button>
        <button onClick={() => { if(confirm('Delete goal?')) onDelete(goal.id); }} className="p-2 text-red-400/70 hover:text-red-400 hover:bg-red-400/10 rounded-lg"><Trash2 className="w-4 h-4" /></button>
      </div>

      <div className="flex flex-col items-center mb-6 pt-4">
        <div className="relative w-32 h-32">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
            <path className="text-white/10" strokeWidth="3" stroke="currentColor" fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
            <path className="text-primary transition-all duration-1000 ease-out" strokeWidth="3" strokeDasharray="100, 100" strokeDashoffset={progressOffset} strokeLinecap="round" stroke="currentColor" fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center flex-col">
            <span className="text-3xl font-bold text-white">{goal.progress}%</span>
          </div>
        </div>
      </div>
      
      <h3 className="text-xl font-bold text-white mb-2 text-center">{goal.title}</h3>
      {goal.description && <p className="text-sm text-text-muted text-center mb-4">{goal.description}</p>}
      
      {goal.deadline && (
        <div className="text-center text-xs text-white/50 mt-auto bg-white/5 py-2 rounded-lg w-full">
          Target: {new Date(goal.deadline).toLocaleDateString()}
        </div>
      )}
    </GlassCard>
  );
}
