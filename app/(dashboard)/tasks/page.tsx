"use client";

import { useEffect, useState } from "react";
import { PageWrapper } from "@/components/ui/PageWrapper";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { KanbanBoard, Task } from "@/components/tasks/KanbanBoard";
import { TaskModal, TaskFormValues } from "@/components/tasks/TaskModal";
import { ListView } from "@/components/tasks/ListView";
import { LayoutList, LayoutGrid, Search, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"kanban" | "list">("kanban");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState<string>("All");
  const [search, setSearch] = useState("");

  const fetchTasks = async () => {
    try {
      const res = await fetch("/api/tasks");
      const json = await res.json();
      if (json.success) {
        setTasks(json.data as Task[]);
      } else {
        toast.error(json.error || "Failed to load tasks");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleCreate = async (data: TaskFormValues) => {
    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      const json = await res.json();
      if (json.success) {
        toast.success("Task created!");
        fetchTasks();
      } else {
        toast.error(json.error || "Failed to create task");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to create task");
    }
  };

  const handleMove = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/tasks/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      });
      const json = await res.json();
      if (json.success) {
        toast.success("Task moved!");
        fetchTasks();
      } else {
        toast.error(json.error || "Failed to move task");
        throw new Error(json.error);
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to move task");
      throw err; // throw to let KanbanBoard revert
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this task?")) return;
    try {
      const res = await fetch(`/api/tasks/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (json.success) {
        toast.success("Task deleted!");
        fetchTasks();
      } else {
        toast.error(json.error || "Failed to delete task");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to delete task");
    }
  };

  const filteredTasks = tasks.filter(t => {
    if (filter !== "All" && t.status !== filter) return false;
    if (search && !t.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <PageWrapper className="flex flex-col h-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Task Manager</h1>
          <p className="text-text-muted">Organize and track your action items.</p>
        </div>
        <PrimaryButton onClick={() => setIsModalOpen(true)}>
          New Task
        </PrimaryButton>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex items-center bg-black/20 p-1 rounded-xl border border-white/10 w-fit">
          {(["All", "Pending", "In Progress", "Completed"] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${filter === f ? 'bg-primary/20 text-primary border border-primary/30' : 'text-text-muted hover:text-white'}`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input 
              type="text"
              placeholder="Search tasks..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 bg-black/20 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-primary/50"
            />
          </div>
          <div className="flex items-center bg-black/20 p-1 rounded-xl border border-white/10">
            <button
              onClick={() => setView("kanban")}
              className={`p-2 rounded-lg transition-colors ${view === "kanban" ? 'bg-white/10 text-white' : 'text-text-muted hover:text-white'}`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setView("list")}
              className={`p-2 rounded-lg transition-colors ${view === "list" ? 'bg-white/10 text-white' : 'text-text-muted hover:text-white'}`}
            >
              <LayoutList className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : view === "kanban" ? (
          <KanbanBoard initialTasks={filteredTasks} onTaskMove={handleMove} />
        ) : (
          <ListView tasks={filteredTasks} onDelete={handleDelete} />
        )}
      </div>

      <TaskModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSubmit={handleCreate} 
      />
    </PageWrapper>
  );
}
