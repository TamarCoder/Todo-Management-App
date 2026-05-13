"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { CalendarDays, Pencil, Trash2 } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/Button";
import { PriorityBadge, StatusBadge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { DeleteTodoDialog } from "@/components/todos/DeleteTodoDialog";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { Card } from "@/components/ui/Card";
import { MetaField } from "@/components/ui/MetaField";
import { useAuthStore, useTodoStore } from "@/store";
import { todosApi } from "@/api";
import { Todo } from "@/lib/types";
import { formatRelative, isOverdue } from "@/lib/utils";

export default function TodoDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const updateAction = useTodoStore((s) => s.update);
  const removeAction = useTodoStore((s) => s.remove);
  const [todo, setTodo] = useState<Todo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const t = await todosApi.get(user.id, params.id);
        if (!cancelled) setTodo(t);
      } catch (e: any) {
        if (!cancelled) setError(e?.message ?? "Failed to load task");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [user, params.id]);

  const handleToggleDone = async () => {
    if (!user || !todo) return;
    const updated = await updateAction(user.id, todo.id, {
      status: todo.status === "done" ? "todo" : "done",
    });
    setTodo(updated);
  };

  const handleDelete = async () => {
    if (!user || !todo) return;
    await removeAction(user.id, todo.id);
    router.push("/todos");
  };

  return (
    <AppShell title="Task">
      {loading ? (
        <div className="flex flex-col gap-3">
          <Skeleton className="h-7 w-1/2" />
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-32 w-full" />
        </div>
      ) : error ? (
        <ErrorMessage message={error} />
      ) : !todo ? (
        <EmptyState
          title="Task not found"
          description="It may have been deleted, or you don't have access."
          action={
            <Link href="/todos">
              <Button variant="ghost">Back to tasks</Button>
            </Link>
          }
        />
      ) : (
        <div className="mx-auto flex max-w-3xl flex-col gap-6">
          <Card padding="lg">
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <StatusBadge status={todo.status} />
              <PriorityBadge priority={todo.priority} />
              {isOverdue(todo.dueDate, todo.status) && (
                <span className="rounded-sm bg-danger-container px-2 py-0.5 font-mono text-[11px] uppercase text-on-danger-container">
                  Overdue
                </span>
              )}
            </div>

            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                checked={todo.status === "done"}
                onChange={handleToggleDone}
                className="mt-1.5 h-5 w-5 cursor-pointer rounded border-outline accent-secondary focus:ring-2 focus:ring-secondary/30"
              />
              <h1
                className={`font-display text-[28px] font-bold leading-tight text-on-surface md:text-[32px] ${
                  todo.status === "done" ? "line-through opacity-60" : ""
                }`}
              >
                {todo.title}
              </h1>
            </div>

            {todo.description && (
              <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-on-surface-variant">
                {todo.description}
              </p>
            )}

            <div className="mt-6 grid grid-cols-1 gap-3 border-t border-outline-variant pt-4 sm:grid-cols-3">
              <MetaField
                icon={CalendarDays}
                label="Due date"
                value={todo.dueDate ? formatRelative(todo.dueDate) : "No date"}
              />
              <MetaField
                icon={CalendarDays}
                label="Created"
                value={new Date(todo.createdAt).toLocaleDateString()}
              />
              <MetaField
                icon={CalendarDays}
                label="Updated"
                value={new Date(todo.updatedAt).toLocaleDateString()}
              />
            </div>
          </Card>

          <div className="flex items-center justify-between">
            <Link href="/todos" className="text-sm font-semibold text-secondary hover:underline">
              ← Back to tasks
            </Link>
            <div className="flex gap-2">
              <Link href={`/todos/${todo.id}/edit`}>
                <Button variant="ghost">
                  <Pencil className="h-4 w-4" />
                  Edit
                </Button>
              </Link>
              <Button variant="danger" onClick={() => setConfirmOpen(true)}>
                <Trash2 className="h-4 w-4" />
                Delete
              </Button>
            </div>
          </div>

          <DeleteTodoDialog
            open={confirmOpen}
            title={todo.title}
            onCancel={() => setConfirmOpen(false)}
            onConfirm={handleDelete}
          />
        </div>
      )}
    </AppShell>
  );
}

