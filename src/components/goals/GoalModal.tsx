"use client";

import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { Loader2, X } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { motion, AnimatePresence } from "framer-motion";
import { Goal } from "./GoalCard";

export function GoalModal({ isOpen, onClose, onSubmit, initialData }: { 
  isOpen: boolean, 
  onClose: () => void, 
  onSubmit: (data: any) => Promise<void>,
  initialData?: Goal | null 
}) {
  const { register, handleSubmit, reset, watch, formState: { isSubmitting } } = useForm({
    defaultValues: { title: "", description: "", progress: 0, deadline: "" }
  });

  useEffect(() => {
    if (initialData) {
      reset({
        title: initialData.title,
        description: initialData.description || "",
        progress: initialData.progress,
        deadline: initialData.deadline || ""
      });
    } else {
      reset({ title: "", description: "", progress: 0, deadline: "" });
    }
  }, [initialData, reset, isOpen]);

  const progress = watch("progress");

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="w-full max-w-lg">
          <GlassCard className="p-6 relative bg-[#0B0F19]/80">
            <button onClick={onClose} className="absolute top-4 right-4 text-white/50 hover:text-white"><X className="w-5 h-5" /></button>
            <h2 className="text-2xl font-bold text-white mb-6">{initialData ? 'Update Goal' : 'New Goal'}</h2>
            
            <form onSubmit={handleSubmit(async d => { await onSubmit(d); onClose(); })} className="space-y-4">
              <div>
                <label className="block text-white/90 text-sm font-medium mb-2">Goal Title</label>
                <input type="text" required className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary/50" {...register("title")} />
              </div>
              <div>
                <label className="block text-white/90 text-sm font-medium mb-2">Description</label>
                <textarea className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary/50" rows={2} {...register("description")} />
              </div>
              <div>
                <label className="block text-white/90 text-sm font-medium mb-2">Progress: {progress}%</label>
                <input type="range" min="0" max="100" className="w-full accent-primary" {...register("progress", { valueAsNumber: true })} />
              </div>
              <div>
                <label className="block text-white/90 text-sm font-medium mb-2">Target Date</label>
                <input type="date" className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary/50" {...register("deadline")} />
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={onClose} className="px-4 py-2 text-white/70">Cancel</button>
                <PrimaryButton type="submit" disabled={isSubmitting}>
                  {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : "Save"}
                </PrimaryButton>
              </div>
            </form>
          </GlassCard>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
