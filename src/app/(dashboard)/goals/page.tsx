"use client";

import { useEffect, useState } from "react";
import { PageWrapper } from "@/components/ui/PageWrapper";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { GoalCard, Goal } from "@/components/goals/GoalCard";
import { GoalModal } from "@/components/goals/GoalModal";
import { Loader2, Target } from "lucide-react";
import { toast } from "sonner";

export default function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);

  const fetchGoals = async () => {
    try {
      const res = await fetch("/api/goals");
      const json = await res.json();
      if (json.success) {
        setGoals(json.data as Goal[]);
      } else {
        toast.error(json.error || "Failed to load goals");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to load goals");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchGoals(); }, []);

  const handleSave = async (data: any) => {
    try {
      if (editingGoal) {
        const res = await fetch(`/api/goals/${editingGoal.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data)
        });
        const json = await res.json();
        if (json.success) {
          toast.success("Goal updated!");
        } else throw new Error(json.error);
      } else {
        const res = await fetch("/api/goals", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data)
        });
        const json = await res.json();
        if (json.success) {
          toast.success("Goal created!");
        } else throw new Error(json.error);
      }
      fetchGoals();
    } catch (err: any) {
      toast.error(err.message || "Failed to save goal");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/goals/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (json.success) {
        toast.success("Goal deleted!");
        fetchGoals();
      } else {
        toast.error(json.error || "Failed to delete goal");
      }
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const openModal = (goal?: Goal) => {
    setEditingGoal(goal || null);
    setIsModalOpen(true);
  };

  return (
    <PageWrapper className="flex flex-col h-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Goals Tracking</h1>
          <p className="text-text-muted">Set targets and monitor your progress over time.</p>
        </div>
        <PrimaryButton onClick={() => openModal()}>Add Goal</PrimaryButton>
      </div>

      <div className="flex-1 overflow-y-auto pb-6">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : goals.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
              <Target className="w-10 h-10 text-primary" />
            </div>
            <h3 className="text-2xl font-semibold text-white mb-2">No goals set yet</h3>
            <p className="text-text-muted max-w-sm mb-6">Create a goal to start tracking your career milestones and achievements.</p>
            <PrimaryButton onClick={() => openModal()}>Create Your First Goal</PrimaryButton>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {goals.map(g => (
              <GoalCard key={g.id} goal={g} onEdit={() => openModal(g)} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </div>

      <GoalModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={handleSave} initialData={editingGoal} />
    </PageWrapper>
  );
}
