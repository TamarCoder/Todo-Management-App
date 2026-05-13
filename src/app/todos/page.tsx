"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { TodoListItem } from "@/components/todos/TodoListItem";
import { TodoFilters, type PriorityFilter, type SortBy, type StatusFilter } from "@/components/todos/TodoFilters";
import { TodoSkeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { useAuthStore, useTodoStore, useSearchStore } from "@/store";

export default function TodosPage() {
  const user = useAuthStore((s) => s.user);
  const todos = useTodoStore((s) => s.todos);
  const loading = useTodoStore((s) => s.loading);
  const error = useTodoStore((s) => s.error);
  const update = useTodoStore((s) => s.update);
  const search = useSearchStore((s) => s.query);
  const setSearch = useSearchStore((s) => s.setQuery);
  const [status, setStatus] = useState<StatusFilter>("all");
  const [priority, setPriority] = useState<PriorityFilter>("all");
  const [sort, setSort] = useState<SortBy>("createdDesc");

  const filtered = useMemo(() => {
    let out = [...todos];
    if (status !== "all") out = out.filter((t) => t.status === status);
    if (priority !== "all") out = out.filter((t) => t.priority === priority);
    if (search.trim()) {
      const q = search.toLowerCase();
      out = out.filter((t) => t.title.toLowerCase().includes(q));
    }
    out.sort((a, b) => {
      if (sort === "createdDesc") return a.createdAt < b.createdAt ? 1 : -1;
      if (sort === "createdAsc") return a.createdAt < b.createdAt ? -1 : 1;
      const ad = a.dueDate ?? "9999-12-31";
      const bd = b.dueDate ?? "9999-12-31";
      if (sort === "dueAsc") return ad < bd ? -1 : ad > bd ? 1 : 0;
      return ad < bd ? 1 : ad > bd ? -1 : 0;
    });
    return out;
  }, [todos, search, status, priority, sort]);

  return (
    <AppShell title="All Tasks">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between gap-3">
          <p className="font-mono text-[11px] uppercase tracking-wider text-on-surface-variant">
            {filtered.length} of {todos.length} tasks
          </p>
          <Link href="/todos/new">
            <Button>
              <Plus className="h-4 w-4" />
              New task
            </Button>
          </Link>
        </div>

        <TodoFilters
          search={search}
          onSearch={setSearch}
          status={status}
          onStatus={setStatus}
          priority={priority}
          onPriority={setPriority}
          sort={sort}
          onSort={setSort}
        />

        {error && <ErrorMessage message={error} />}

        {loading ? (
          <TodoSkeleton />
        ) : filtered.length === 0 ? (
          <EmptyState
            title={todos.length === 0 ? "No tasks yet" : "No matches"}
            description={
              todos.length === 0
                ? "Create your first task to get started."
                : "Try adjusting your filters or search query."
            }
            action={
              todos.length === 0 ? (
                <Link href="/todos/new">
                  <Button>New task</Button>
                </Link>
              ) : undefined
            }
          />
        ) : (
          <div className="flex flex-col gap-3">
            {filtered.map((t) => (
              <TodoListItem
                key={t.id}
                todo={t}
                onToggleDone={async (todo) => {
                  if (!user) return;
                  await update(user.id, todo.id, {
                    status: todo.status === "done" ? "todo" : "done",
                  });
                }}
              />
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
