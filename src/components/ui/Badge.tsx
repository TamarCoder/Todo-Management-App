"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { TodoPriority, TodoStatus } from "@/lib/types";

export function Badge({
  children,
  className,
  tone = "neutral",
}: {
  children: ReactNode;
  className?: string;
  tone?: "neutral" | "success" | "warning" | "danger" | "info";
}) {
  const tones: Record<string, string> = {
    neutral: "bg-surface-container text-on-surface-variant",
    success: "bg-success-container text-on-success-container",
    warning: "bg-warning-container text-on-warning-container",
    danger: "bg-danger-container text-on-danger-container",
    info: "bg-secondary-container text-on-secondary-container",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-sm px-2 py-0.5 font-mono text-[11px] font-medium uppercase tracking-wide",
        tones[tone],
        className
      )}
    >
      {children}
    </span>
  );
}

export function PriorityBadge({ priority }: { priority: TodoPriority }) {
  if (priority === "high") return <Badge tone="danger">High Priority</Badge>;
  if (priority === "medium") return <Badge tone="warning">Medium</Badge>;
  return <Badge tone="neutral">Low</Badge>;
}

export function StatusBadge({ status }: { status: TodoStatus }) {
  if (status === "done") return <Badge tone="success">Completed</Badge>;
  if (status === "in_progress") return <Badge tone="info">In Progress</Badge>;
  return <Badge tone="neutral">To Do</Badge>;
}
