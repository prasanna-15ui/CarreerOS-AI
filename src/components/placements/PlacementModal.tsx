"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, X } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { motion, AnimatePresence } from "framer-motion";

const formSchema = z.object({
  company_name: z.string().min(1, { message: "Company name is required" }),
  role: z.string().min(1, { message: "Role is required" }),
  status: z.enum(["Applied", "Shortlisted", "Interview", "Offer", "Rejected"]),
  applied_date: z.string().optional(),
  notes: z.string().optional(),
});

export type PlacementFormValues = z.infer<typeof formSchema>;

export function PlacementModal({ isOpen, onClose, onSubmit }: { isOpen: boolean, onClose: () => void, onSubmit: (data: PlacementFormValues) => Promise<void> }) {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<PlacementFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { status: "Applied" },
  });

  const handleFormSubmit = async (data: PlacementFormValues) => {
    await onSubmit(data);
    reset();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="w-full max-w-lg">
          <GlassCard className="p-6 relative bg-[#0B0F19]/80">
            <button onClick={onClose} className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-2xl font-bold text-white mb-6">Add Application</h2>
            
            <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
              <div>
                <label className="block text-white/90 text-sm font-medium mb-2">Company Name</label>
                <input type="text" className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary/50" {...register("company_name")} />
                {errors.company_name && <p className="text-red-400 text-sm mt-1">{errors.company_name.message}</p>}
              </div>

              <div>
                <label className="block text-white/90 text-sm font-medium mb-2">Role</label>
                <input type="text" className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary/50" {...register("role")} />
                {errors.role && <p className="text-red-400 text-sm mt-1">{errors.role.message}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/90 text-sm font-medium mb-2">Status</label>
                  <select className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary/50 [&>option]:bg-gray-800" {...register("status")}>
                    <option value="Applied">Applied</option>
                    <option value="Shortlisted">Shortlisted</option>
                    <option value="Interview">Interview</option>
                    <option value="Offer">Offer</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>
                <div>
                  <label className="block text-white/90 text-sm font-medium mb-2">Applied Date</label>
                  <input type="date" className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary/50" {...register("applied_date")} />
                </div>
              </div>

              <div>
                <label className="block text-white/90 text-sm font-medium mb-2">Notes</label>
                <textarea className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary/50" rows={3} {...register("notes")} />
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={onClose} className="px-4 py-2 text-white/70 hover:text-white transition-colors">Cancel</button>
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
