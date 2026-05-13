"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { TodoForm } from "@/components/todos/TodoForm";
import { Skeleton } from "@/components/ui/Skeleton";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useAuthStore, useTodoStore } from "@/store";
import { todosApi } from "@/api";
import { Todo } from "@/lib/types";

export default function EditTodoPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const updateAction = useTodoStore((s) => s.update);
  const [todo, setTodo] = useState<Todo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    (async () => {
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

  return (
    <AppShell title="Edit Task">
      <div className="mx-auto max-w-2xl">
        {loading ? (
          <Card padding="lg">
            <Skeleton className="mb-4 h-6 w-1/3" />
            <Skeleton className="mb-2 h-10 w-full" />
            <Skeleton className="h-32 w-full" />
          </Card>
        ) : error ? (
          <ErrorMessage message={error} />
        ) : !todo ? (
          <EmptyState
            title="Task not found"
            description="You can't edit a task that doesn't exist."
            action={
              <Link href="/todos">
                <Button variant="ghost">Back to tasks</Button>
              </Link>
            }
          />
        ) : (
          <Card padding="lg" shadow>
            <TodoForm
              initial={todo}
              submitLabel="Save changes"
              onSubmit={async (input) => {
                if (!user) return;
                await updateAction(user.id, todo.id, input);
                router.push(`/todos/${todo.id}`);
              }}
              onCancel={() => router.back()}
            />
          </Card>
        )}
      </div>
    </AppShell>
  );
}
