"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Building2, Briefcase, Calendar, Loader2, Save, Trash2 } from "lucide-react";
import { Placement } from "./PlacementBoard";
import { GlassCard } from "@/components/ui/GlassCard";
import { PrimaryButton } from "@/components/ui/PrimaryButton";

export function PlacementDrawer({ item, isOpen, onClose, onUpdate, onDelete }: { 
  item: Placement | null, 
  isOpen: boolean, 
  onClose: () => void, 
  onUpdate: (id: string, notes: string) => Promise<void>,
  onDelete: (id: string) => Promise<void>
}) {
  const [notes, setNotes] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (item) setNotes(item.notes || "");
  }, [item]);

  const handleSave = async () => {
    if (!item) return;
    setIsSaving(true);
    await onUpdate(item.id, notes);
    setIsSaving(false);
  };

  const handleDelete = async () => {
    if (!item) return;
    if (confirm("Delete this application?")) {
      await onDelete(item.id);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && item && (
        <>
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md z-50 p-4"
          >
            <GlassCard className="h-full flex flex-col bg-[#0B0F19]/95 rounded-2xl md:rounded-l-2xl md:rounded-r-none border-r-0">
              <div className="flex items-center justify-between p-6 border-b border-white/10">
                <h2 className="text-xl font-bold text-white">Application Details</h2>
                <button onClick={onClose} className="text-white/50 hover:text-white"><X className="w-5 h-5" /></button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3 text-white">
                    <Building2 className="w-5 h-5 mt-1 text-primary" />
                    <div>
                      <p className="text-sm text-text-muted">Company</p>
                      <p className="font-semibold text-lg">{item.company_name}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 text-white">
                    <Briefcase className="w-5 h-5 mt-1 text-primary" />
                    <div>
                      <p className="text-sm text-text-muted">Role</p>
                      <p className="font-semibold text-lg">{item.role}</p>
                    </div>
                  </div>
                  {item.applied_date && (
                    <div className="flex items-start gap-3 text-white">
                      <Calendar className="w-5 h-5 mt-1 text-primary" />
                      <div>
                        <p className="text-sm text-text-muted">Applied On</p>
                        <p className="font-semibold">{new Date(item.applied_date).toLocaleDateString()}</p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-start gap-3 text-white">
                    <div className="w-5 h-5 mt-1 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-bold">St</div>
                    <div>
                      <p className="text-sm text-text-muted">Current Status</p>
                      <p className="font-semibold px-2 py-1 bg-white/10 rounded-md inline-block mt-1">{item.status}</p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10">
                  <label className="block text-white/90 text-sm font-medium mb-2">Notes</label>
                  <textarea 
                    value={notes} 
                    onChange={e => setNotes(e.target.value)}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary/50 min-h-[150px]"
                    placeholder="Add interview notes, contacts, etc."
                  />
                  <div className="flex gap-2 mt-3">
                    <PrimaryButton onClick={handleSave} disabled={isSaving} className="w-full flex justify-center items-center">
                      {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Save className="w-4 h-4 mr-2" /> Save Notes</>}
                    </PrimaryButton>
                    <button onClick={handleDelete} className="px-4 py-2 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded-xl transition-colors">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
