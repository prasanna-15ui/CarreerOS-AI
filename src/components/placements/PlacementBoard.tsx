"use client";

import { useState, useEffect } from "react";
import { DndContext, DragOverlay, closestCorners, KeyboardSensor, PointerSensor, useSensor, useSensors, DragStartEvent, DragEndEvent, useDroppable } from "@dnd-kit/core";
import { SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GlassCard } from "@/components/ui/GlassCard";
import { Calendar, Building2 } from "lucide-react";

export type Placement = {
  id: string;
  company_name: string;
  role: string;
  status: string;
  applied_date?: string | null;
  notes?: string;
};

const COLUMNS = ["Applied", "Shortlisted", "Interview", "Offer", "Rejected"];

const StatusColor = (status: string) => {
  const colors: Record<string, string> = {
    Applied: "border-blue-500/50",
    Shortlisted: "border-yellow-500/50",
    Interview: "border-purple-500/50",
    Offer: "border-emerald-500/50",
    Rejected: "border-rose-500/50",
  };
  return colors[status] || "border-white/10";
};

function SortableItem({ item, onClick }: { item: Placement, onClick: (p: Placement) => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="touch-none mb-3">
      <div onClick={() => onClick(item)}>
        <GlassCard className={`p-4 cursor-pointer hover:bg-white/10 border-l-4 ${StatusColor(item.status)}`}>
          <div className="flex items-center gap-2 text-white font-semibold mb-1">
            <Building2 className="w-4 h-4 text-text-muted" />
            {item.company_name}
          </div>
          <div className="text-sm text-text-muted mb-2">{item.role}</div>
          {item.applied_date && (
            <div className="flex items-center text-xs text-text-muted">
              <Calendar className="w-3 h-3 mr-1" />
              {new Date(item.applied_date).toLocaleDateString()}
            </div>
          )}
        </GlassCard>
      </div>
    </div>
  );
}

function Column({ column, items, onClick }: { column: string, items: Placement[], onClick: (p: Placement) => void }) {
  const { setNodeRef } = useDroppable({ id: column });
  return (
    <div className="flex flex-col min-w-[280px] bg-[#0B0F19]/40 p-4 rounded-2xl border border-white/5">
      <h3 className="font-bold text-white mb-4 flex justify-between items-center">
        {column}
        <span className="text-xs bg-white/10 px-2 py-1 rounded-full">{items.length}</span>
      </h3>
      <div ref={setNodeRef} className="flex-1 overflow-y-auto">
        <SortableContext items={items.map(i => i.id)} strategy={verticalListSortingStrategy}>
          {items.map(item => (
            <SortableItem key={item.id} item={item} onClick={onClick} />
          ))}
        </SortableContext>
        <div className="min-h-[100px]" />
      </div>
    </div>
  );
}

export function PlacementBoard({ initialItems, onMove, onSelect }: { initialItems: Placement[], onMove: (id: string, status: string) => Promise<void>, onSelect: (p: Placement) => void }) {
  const [items, setItems] = useState<Placement[]>(initialItems);
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => setItems(initialItems), [initialItems]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragStart = (e: DragStartEvent) => setActiveId(e.active.id as string);

  const handleDragEnd = (e: DragEndEvent) => {
    setActiveId(null);
    const { active, over } = e;
    if (!over) return;

    const activeItem = items.find(i => i.id === active.id);
    if (!activeItem) return;

    let newStatus = activeItem.status;
    if (COLUMNS.includes(over.id as string)) {
      newStatus = over.id as string;
    } else {
      const overItem = items.find(i => i.id === over.id);
      if (overItem) newStatus = overItem.status;
    }

    if (activeItem.status !== newStatus) {
      setItems(items.map(i => i.id === active.id ? { ...i, status: newStatus } : i));
      onMove(active.id as string, newStatus).catch(() => setItems(initialItems));
    }
  };

  const activeItem = activeId ? items.find(i => i.id === activeId) : null;

  return (
    <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="flex gap-4 overflow-x-auto pb-4 h-[calc(100vh-220px)] w-full">
        {COLUMNS.map(col => (
          <Column key={col} column={col} items={items.filter(i => i.status === col)} onClick={onSelect} />
        ))}
      </div>
      <DragOverlay>
        {activeItem ? (
          <GlassCard className={`p-4 border-l-4 ${StatusColor(activeItem.status)} scale-105 rotate-2 shadow-2xl`}>
            <div className="flex items-center gap-2 text-white font-semibold mb-1">
              <Building2 className="w-4 h-4" />
              {activeItem.company_name}
            </div>
            <div className="text-sm text-text-muted mb-2">{activeItem.role}</div>
          </GlassCard>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
