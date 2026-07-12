"use client";

import { useEffect, useState } from "react";
import { PageWrapper } from "@/components/ui/PageWrapper";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { PlacementBoard, Placement } from "@/components/placements/PlacementBoard";
import { PlacementModal, PlacementFormValues } from "@/components/placements/PlacementModal";
import { PlacementDrawer } from "@/components/placements/PlacementDrawer";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function PlacementsPage() {
  const [placements, setPlacements] = useState<Placement[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlacement, setSelectedPlacement] = useState<Placement | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const fetchPlacements = async () => {
    try {
      const res = await fetch("/api/placements");
      const json = await res.json();
      if (json.success) {
        setPlacements(json.data as Placement[]);
      } else {
        toast.error(json.error || "Failed to load applications");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to load applications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlacements();
  }, []);

  const handleCreate = async (data: PlacementFormValues) => {
    try {
      const res = await fetch("/api/placements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      const json = await res.json();
      if (json.success) {
        toast.success("Application added! Notification email sent.");
        fetchPlacements();
      } else {
        toast.error(json.error || "Failed to add application");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to add application");
    }
  };

  const handleMove = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/placements/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      });
      const json = await res.json();
      if (json.success) {
        toast.success("Status updated! Notification email sent.");
        fetchPlacements();
      } else {
        toast.error(json.error || "Failed to update status");
        throw new Error(json.error);
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to update status");
      throw err;
    }
  };

  const handleUpdateNotes = async (id: string, notes: string) => {
    try {
      const res = await fetch(`/api/placements/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes })
      });
      const json = await res.json();
      if (json.success) {
        toast.success("Notes saved!");
        fetchPlacements();
        setSelectedPlacement(prev => prev ? { ...prev, notes } : prev);
      } else {
        toast.error(json.error || "Failed to save notes");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to save notes");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/placements/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (json.success) {
        toast.success("Application deleted!");
        fetchPlacements();
        setIsDrawerOpen(false);
      } else {
        toast.error(json.error || "Failed to delete application");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to delete application");
    }
  };

  const handleSelect = (item: Placement) => {
    setSelectedPlacement(item);
    setIsDrawerOpen(true);
  };

  return (
    <PageWrapper className="flex flex-col h-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Placement Tracker</h1>
          <p className="text-text-muted">Track your job applications and interview pipeline.</p>
        </div>
        <PrimaryButton onClick={() => setIsModalOpen(true)}>
          Add Application
        </PrimaryButton>
      </div>

      <div className="flex-1 min-h-0">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <PlacementBoard initialItems={placements} onMove={handleMove} onSelect={handleSelect} />
        )}
      </div>

      <PlacementModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSubmit={handleCreate} 
      />

      <PlacementDrawer
        item={selectedPlacement}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onUpdate={handleUpdateNotes}
        onDelete={handleDelete}
      />
    </PageWrapper>
  );
}
