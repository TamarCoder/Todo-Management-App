"use client";

import Link from "next/link";
import { CalendarDays, Clock, GripVertical } from "lucide-react";
import { Todo } from "@/lib/types";
import { PriorityBadge } from "@/components/ui/Badge";
import { formatRelative, isOverdue, localDateISO } from "@/lib/utils";

export function TodoListItem({
  todo,
  onToggleDone,
}: {
  todo: Todo;
  onToggleDone?: (todo: Todo) => void;
}) {
  const overdue = isOverdue(todo.dueDate, todo.status);
  const done = todo.status === "done";
  const isToday = todo.dueDate === localDateISO();

  const timeFromCreated = new Date(todo.createdAt).toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });

  return (
    <div className="group flex items-center gap-4 rounded-xl border border-outline-variant bg-white p-4 transition hover:border-secondary hover:shadow-card">
      <input
        type="checkbox"
        checked={done}
        onChange={() => onToggleDone?.(todo)}
        className="h-5 w-5 cursor-pointer rounded border-outline accent-secondary focus:ring-2 focus:ring-secondary/30"
        aria-label={done ? "Mark as not done" : "Mark as done"}
      />
      <div className="min-w-0 flex-1">
        <Link
          href={`/todos/${todo.id}`}
          className={`block truncate text-base font-semibold leading-6 text-primary hover:text-secondary ${
            done ? "line-through opacity-60" : ""
          }`}
        >
          {todo.title}
        </Link>
        <div className="mt-1 flex flex-wrap items-center gap-3">
          <PriorityBadge priority={todo.priority} />
          {isToday ? (
            <div className="flex items-center gap-1 font-mono text-[11px] font-medium text-on-surface-variant">
              <Clock className="h-3.5 w-3.5" />
              <span>{timeFromCreated}</span>
            </div>
          ) : todo.dueDate ? (
            <div
              className={`flex items-center gap-1 font-mono text-[11px] font-medium ${
                overdue ? "text-danger" : "text-on-surface-variant"
              }`}
            >
              <CalendarDays className="h-3.5 w-3.5" />
              <span>{formatRelative(todo.dueDate)}</span>
            </div>
          ) : null}
        </div>
      </div>
      <GripVertical className="hidden h-4 w-4 text-outline opacity-0 transition-opacity group-hover:opacity-100 md:block" />
    </div>
  );
}
