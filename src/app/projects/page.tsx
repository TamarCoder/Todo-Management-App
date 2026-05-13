"use client";

import { DragEvent, ReactNode, useMemo, useState } from "react";
import Link from "next/link";
import {
  Megaphone,
  Filter,
  MoreHorizontal,
  MessageCircle,
  Paperclip,
  RefreshCw,
  CheckCircle2,
  Plus,
  Edit3,
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { TodoSkeleton } from "@/components/ui/Skeleton";
import { Pill } from "@/components/ui/Pill";
import { Avatar, AvatarGroup } from "@/components/ui/Avatar";
import { useAuthStore, useTodoStore, useSearchStore, matchesQuery } from "@/store";
import { Todo, TodoStatus, TodoPriority } from "@/lib/types";

type ColumnDef = {
  status: TodoStatus;
  title: string;
  dotClass: string;
};

const COLUMNS: ColumnDef[] = [
  { status: "todo", title: "To Do", dotClass: "bg-outline" },
  { status: "in_progress", title: "In Progress", dotClass: "bg-secondary" },
  { status: "done", title: "Done", dotClass: "bg-secondary-fixed-dim" },
];

export default function ProjectsPage() {
  const user = useAuthStore((s) => s.user);
  const allTodos = useTodoStore((s) => s.todos);
  const loading = useTodoStore((s) => s.loading);
  const update = useTodoStore((s) => s.update);
  const query = useSearchStore((s) => s.query);
  const [dragId, setDragId] = useState<string | null>(null);
  const [overStatus, setOverStatus] = useState<TodoStatus | null>(null);

  const todos = useMemo(
    () => allTodos.filter((t) => matchesQuery(t.title, query)),
    [allTodos, query]
  );

  const grouped = useMemo(() => {
    const map: Record<TodoStatus, Todo[]> = { todo: [], in_progress: [], done: [] };
    for (const t of todos) map[t.status].push(t);
    return map;
  }, [todos]);

  const progressPct = useMemo(() => {
    if (todos.length === 0) return 0;
    const done = todos.filter((t) => t.status === "done").length;
    return Math.round((done / todos.length) * 100);
  }, [todos]);

  const handleDragStart = (e: DragEvent<HTMLDivElement>, id: string) => {
    setDragId(id);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", id);
  };

  const handleDragEnd = () => {
    setDragId(null);
    setOverStatus(null);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>, status: TodoStatus) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (overStatus !== status) setOverStatus(status);
  };

  const handleDragLeave = (status: TodoStatus) => {
    if (overStatus === status) setOverStatus(null);
  };

  const handleDrop = async (e: DragEvent<HTMLDivElement>, status: TodoStatus) => {
    e.preventDefault();
    const id = e.dataTransfer.getData("text/plain") || dragId;
    setOverStatus(null);
    setDragId(null);
    if (!id) return;
    const dragged = todos.find((t) => t.id === id);
    if (!dragged || dragged.status === status || !user) return;
    try {
      await update(user.id, id, { status });
    } catch {
      // Optimistic update inside useTodos already rolls back on error.
    }
  };

  return (
    <AppShell title="Projects">
      {/* Project header */}
      <div className="mb-6 flex flex-col">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Megaphone className="h-7 w-7 text-secondary" strokeWidth={2} />
            <h2 className="font-display text-[24px] font-semibold leading-8 tracking-[-0.01em] text-primary">
              Marketing Campaign
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <AvatarGroup>
              <Avatar initials="EM" bgClass="bg-tertiary-fixed" textClass="text-on-tertiary-fixed-variant" size="md" ring />
              <Avatar initials="JD" size="md" ring />
              <Avatar
                initials="+4"
                size="md"
                ring
                bgClass="bg-surface-container"
                textClass="text-on-surface-variant"
              />
            </AvatarGroup>
            <div className="mx-2 h-6 w-px bg-outline-variant" />
            <button className="flex items-center gap-2 rounded-lg border border-outline-variant px-3 py-1.5 text-sm text-on-surface-variant transition hover:bg-surface-container">
              <Filter className="h-4 w-4" />
              Filter
            </button>
          </div>
        </div>
        <div className="mt-3 h-[2px] w-full overflow-hidden rounded-full bg-outline-variant/30">
          <div
            className="h-full bg-secondary transition-all"
            style={{ width: `${progressPct}%` }}
            title={`Project Progress: ${progressPct}%`}
          />
        </div>
      </div>

      {/* Kanban board */}
      {loading ? (
        <TodoSkeleton />
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {COLUMNS.map((col) => (
            <Column
              key={col.status}
              column={col}
              todos={grouped[col.status]}
              isDragTarget={overStatus === col.status}
              onDragOver={(e) => handleDragOver(e, col.status)}
              onDragLeave={() => handleDragLeave(col.status)}
              onDrop={(e) => handleDrop(e, col.status)}
              onCardDragStart={handleDragStart}
              onCardDragEnd={handleDragEnd}
              dragId={dragId}
            />
          ))}
        </div>
      )}
    </AppShell>
  );
}

function Column({
  column,
  todos,
  isDragTarget,
  onDragOver,
  onDragLeave,
  onDrop,
  onCardDragStart,
  onCardDragEnd,
  dragId,
}: {
  column: ColumnDef;
  todos: Todo[];
  isDragTarget: boolean;
  onDragOver: (e: DragEvent<HTMLDivElement>) => void;
  onDragLeave: () => void;
  onDrop: (e: DragEvent<HTMLDivElement>) => void;
  onCardDragStart: (e: DragEvent<HTMLDivElement>, id: string) => void;
  onCardDragEnd: () => void;
  dragId: string | null;
}) {
  return (
    <div
      className={`flex flex-col gap-4 rounded-xl p-1 transition-colors ${
        isDragTarget ? "bg-secondary/5 ring-2 ring-dashed ring-secondary/40" : ""
      }`}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <span className={`h-2 w-2 rounded-full ${column.dotClass}`} />
          <h3 className="text-base font-semibold text-primary">{column.title}</h3>
          <span className="rounded-full bg-surface-container px-2 py-0.5 font-mono text-[11px] font-medium tracking-[0.05em] text-on-surface-variant">
            {todos.length}
          </span>
        </div>
        <button className="text-on-surface-variant transition-colors hover:text-primary">
          <MoreHorizontal className="h-5 w-5" />
        </button>
      </div>

      <div className="flex min-h-[80px] flex-col gap-3">
        {todos.length === 0 ? (
          <div className="rounded-xl border-2 border-dashed border-outline-variant/60 bg-surface-container-low/40 p-6 text-center text-[12px] text-on-surface-variant">
            Drop a task here
          </div>
        ) : (
          todos.map((t) => (
            <KanbanCard
              key={t.id}
              todo={t}
              dragging={dragId === t.id}
              onDragStart={(e) => onCardDragStart(e, t.id)}
              onDragEnd={onCardDragEnd}
            />
          ))
        )}

        {column.status === "todo" && (
          <Link
            href="/todos/new"
            className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-outline-variant py-3 text-sm font-semibold text-on-surface-variant transition hover:border-secondary/40 hover:bg-surface-container-low"
          >
            <Plus className="h-4 w-4" />
            Add Task
          </Link>
        )}
      </div>
    </div>
  );
}

function KanbanCard({
  todo,
  dragging,
  onDragStart,
  onDragEnd,
}: {
  todo: Todo;
  dragging: boolean;
  onDragStart: (e: DragEvent<HTMLDivElement>) => void;
  onDragEnd: () => void;
}) {
  const tag = priorityTag(todo.priority, todo.status);
  const isDone = todo.status === "done";

  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      className={`group cursor-grab rounded-xl border bg-surface-container-lowest p-4 transition-all active:cursor-grabbing ${
        todo.status === "in_progress"
          ? "border-secondary shadow-card"
          : "border-outline-variant hover:border-secondary hover:shadow-card"
      } ${isDone ? "opacity-60 hover:opacity-100" : ""} ${
        dragging ? "rotate-1 opacity-50" : ""
      }`}
    >
      <div className="flex flex-col gap-2">
        <div className="flex items-start justify-between">
          <Pill bg={tag.bg} text={tag.text}>
            {tag.label}
          </Pill>
          {isDone ? (
            <CheckCircle2 className="h-5 w-5 text-secondary transition-transform group-hover:scale-110" />
          ) : (
            <Link
              href={`/todos/${todo.id}`}
              className="text-on-surface-variant opacity-0 transition group-hover:opacity-100"
              draggable={false}
              onMouseDown={(e) => e.stopPropagation()}
            >
              <Edit3 className="h-4 w-4" />
            </Link>
          )}
        </div>
        <Link
          href={`/todos/${todo.id}`}
          draggable={false}
          onMouseDown={(e) => e.stopPropagation()}
          className={`text-base font-semibold leading-6 text-primary hover:text-secondary ${
            isDone ? "line-through decoration-secondary/30" : ""
          }`}
        >
          {todo.title}
        </Link>
        {todo.description && !isDone && (
          <p className="line-clamp-2 text-sm leading-5 text-on-surface-variant">
            {todo.description}
          </p>
        )}
        <div className="mt-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {todo.status === "in_progress" && (
              <div className="flex items-center gap-1 font-bold text-secondary">
                <RefreshCw className="h-4 w-4" />
                <span className="text-xs">In Sync</span>
              </div>
            )}
            {todo.dueDate && (
              <div className="flex items-center gap-1 text-on-surface-variant">
                <Paperclip className="h-4 w-4" />
                <span className="text-xs font-medium">
                  {new Date(todo.dueDate).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>
            )}
            <div className="flex items-center gap-1 text-on-surface-variant">
              <MessageCircle className="h-4 w-4" />
              <span className="text-xs font-medium">{0}</span>
            </div>
          </div>
          <Avatar from={todo.title} bgClass={tag.bg} textClass={tag.text} size="sm" />
        </div>
      </div>
    </div>
  );
}

function priorityTag(
  priority: TodoPriority,
  status: TodoStatus
): { label: string; bg: string; text: string } {
  if (status === "done") {
    return {
      label: "Archived",
      bg: "bg-surface-container-high",
      text: "text-on-surface-variant",
    };
  }
  if (priority === "high") {
    return { label: "Urgent", bg: "bg-error-container", text: "text-on-error-container" };
  }
  if (priority === "medium") {
    return {
      label: "Planning",
      bg: "bg-tertiary-fixed",
      text: "text-on-tertiary-fixed-variant",
    };
  }
  return {
    label: "Design",
    bg: "bg-secondary-container",
    text: "text-on-secondary-container",
  };
}
