"use client";

import { useState, useEffect } from "react";
import { DndContext, DragOverlay, closestCorners, KeyboardSensor, PointerSensor, useSensor, useSensors, DragStartEvent, DragEndEvent, useDroppable } from "@dnd-kit/core";
import { SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GlassCard } from "@/components/ui/GlassCard";
import confetti from "canvas-confetti";
import { Calendar } from "lucide-react";

export type Task = {
  id: string;
  title: string;
  description?: string;
  status: string;
  priority: string;
  due_date?: string | null;
};

interface KanbanBoardProps {
  initialTasks: Task[];
  onTaskMove: (taskId: string, newStatus: string) => Promise<void>;
}

const COLUMNS = ["Pending", "In Progress", "Completed"];

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

function SortableTaskItem({ task }: { task: Task }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task.id });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="touch-none mb-3">
      <GlassCard className="p-4 bg-white/5 hover:bg-white/10 cursor-grab active:cursor-grabbing border-white/10 shadow-sm">
        <h4 className="font-semibold text-white mb-2">{task.title}</h4>
        <div className="flex items-center justify-between">
          <PriorityBadge priority={task.priority} />
          {task.due_date && (
            <div className="flex items-center text-xs text-text-muted">
              <Calendar className="w-3 h-3 mr-1" />
              {new Date(task.due_date).toLocaleDateString()}
            </div>
          )}
        </div>
      </GlassCard>
    </div>
  );
}

function DroppableColumn({ column, tasks }: { column: string, tasks: Task[] }) {
  const { setNodeRef } = useDroppable({ id: column });

  return (
    <GlassCard className="flex flex-col min-h-[600px] bg-[#0B0F19]/40 p-4">
      <h3 className="font-bold text-white mb-4 px-2 flex items-center justify-between">
        {column}
        <span className="text-xs font-normal text-text-muted bg-white/10 px-2 py-1 rounded-full">
          {tasks.length}
        </span>
      </h3>
      
      <div ref={setNodeRef} className="flex-1 overflow-y-auto pr-1">
        <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
          {tasks.map(task => (
            <SortableTaskItem key={task.id} task={task} />
          ))}
        </SortableContext>
      </div>
    </GlassCard>
  );
}

export function KanbanBoard({ initialTasks, onTaskMove }: KanbanBoardProps) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [activeId, setActiveId] = useState<string | null>(null);

  // Sync state if initialTasks changes from parent
  useEffect(() => {
    setTasks(initialTasks);
  }, [initialTasks]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null);
    const { active, over } = event;
    
    if (!over) return;

    const activeIdVal = active.id;
    const overId = over.id;

    const activeTask = tasks.find(t => t.id === activeIdVal);
    if (!activeTask) return;

    let newStatus = activeTask.status;
    if (COLUMNS.includes(overId as string)) {
      newStatus = overId as string;
    } else {
      const overTask = tasks.find(t => t.id === overId);
      if (overTask) newStatus = overTask.status;
    }

    if (activeTask.status !== newStatus) {
      if (newStatus === "Completed") {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
      
      // Optimistic update
      setTasks(tasks.map(t => t.id === activeIdVal ? { ...t, status: newStatus } : t));
      
      // Call API
      onTaskMove(activeIdVal as string, newStatus).catch(() => {
        // Revert on error
        setTasks(initialTasks);
      });
    }
  };

  const activeTask = activeId ? tasks.find(t => t.id === activeId) : null;

  return (
    <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {COLUMNS.map(column => (
          <DroppableColumn key={column} column={column} tasks={tasks.filter(t => t.status === column)} />
        ))}
      </div>

      <DragOverlay>
        {activeTask ? (
          <GlassCard className="p-4 bg-white/10 border-primary cursor-grabbing shadow-2xl scale-105 rotate-2">
            <h4 className="font-semibold text-white mb-2">{activeTask.title}</h4>
            <div className="flex items-center justify-between">
              <PriorityBadge priority={activeTask.priority} />
              {activeTask.due_date && (
                <div className="flex items-center text-xs text-text-muted">
                  <Calendar className="w-3 h-3 mr-1" />
                  {new Date(activeTask.due_date).toLocaleDateString()}
                </div>
              )}
            </div>
          </GlassCard>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
