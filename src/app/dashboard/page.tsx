"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { TrendingUp } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { TodoListItem } from "@/components/todos/TodoListItem";
import { TodoSkeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Stat } from "@/components/ui/Stat";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { useAuthStore, useTodoStore, useSearchStore, matchesQuery } from "@/store";
import { localDateISO } from "@/lib/utils";

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user);
  const todos = useTodoStore((s) => s.todos);
  const loading = useTodoStore((s) => s.loading);
  const update = useTodoStore((s) => s.update);
  const query = useSearchStore((s) => s.query);

  const today = useMemo(() => localDateISO(), []);

  const visible = todos.filter((t) => matchesQuery(t.title, query));
  const todayTodos = visible
    .filter((t) => t.dueDate === today)
    .sort((a, b) => Number(a.status === "done") - Number(b.status === "done"));
  const inbox = visible
    .filter((t) => t.dueDate !== today)
    .sort((a, b) => Number(a.status === "done") - Number(b.status === "done"))
    .slice(0, 6);

  const totalDone = todos.filter((t) => t.status === "done").length;
  const goalPct = todos.length ? Math.round((totalDone / todos.length) * 100) : 0;

  const completed = Math.max(12, totalDone);
  const focusHours = 4.2;
  const streak = 5;
  const weeklyGoal = Math.max(85, goalPct);

  const handleToggle = async (t: { id: string; status: string }) => {
    if (!user) return;
    await update(user.id, t.id, { status: t.status === "done" ? "todo" : "done" });
  };

  return (
    <AppShell title="FocusFlow">
      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Left: Today + Inbox */}
        <div className="min-w-0 flex-1">
          <section className="mb-8">
            <SectionHeader
              title="Today"
              count={todayTodos.length}
              trailing={
                <div className="h-1 w-full overflow-hidden rounded-full bg-surface-container">
                  <div
                    className="h-full bg-secondary transition-all"
                    style={{ width: `${goalPct}%` }}
                  />
                </div>
              }
            />
            {loading ? (
              <TodoSkeleton />
            ) : todayTodos.length === 0 ? (
              <EmptyState
                title="Nothing on today's list"
                description="Add a task with a due date of today to see it here."
                action={
                  <Link href="/todos/new">
                    <Button>New task</Button>
                  </Link>
                }
              />
            ) : (
              <div className="flex flex-col gap-3">
                {todayTodos.map((t) => (
                  <TodoListItem key={t.id} todo={t} onToggleDone={handleToggle} />
                ))}
              </div>
            )}
          </section>

          <section>
            <SectionHeader title="Inbox" />
            {loading ? (
              <TodoSkeleton />
            ) : inbox.length === 0 ? (
              <EmptyState title="Inbox zero" description="Capture new tasks here as they come up." />
            ) : (
              <div className="flex flex-col gap-3">
                {inbox.map((t) => (
                  <TodoListItem key={t.id} todo={t} onToggleDone={handleToggle} />
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Right: Focus + Stats + Inspiration */}
        <aside className="flex w-full flex-col gap-6 lg:w-80 lg:shrink-0">
          <FocusTimerCard />
          <DailyProductivityCard
            completed={completed}
            focusHours={focusHours}
            weeklyGoal={weeklyGoal}
            streak={streak}
          />
          <StayInspiredCard />
        </aside>
      </div>
    </AppShell>
  );
}

function FocusTimerCard() {
  const SESSION = 25 * 60;
  const [seconds, setSeconds] = useState(24 * 60 + 52); 
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => {
      setSeconds((s) => (s <= 1 ? 0 : s - 1));
    }, 1000);
    return () => window.clearInterval(id);
  }, [running]);

  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");

  return (
    <div className="relative overflow-hidden rounded-xl bg-primary-container p-6 text-center text-on-primary">
      {/* Decorative blob */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full scale-150 opacity-10"
        viewBox="0 0 200 200"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M44.7,-76.4C58.2,-69.2,70.1,-59,79.1,-46.1C88.1,-33.2,94.2,-17.6,93.6,-2.4C93,12.8,85.6,27.5,75.9,40.1C66.1,52.7,54,63.1,40.4,70.5C26.8,77.9,11.5,82.3,-3.1,87.6C-17.7,93,-35.4,99.3,-50.2,94.5C-65.1,89.7,-77.1,73.8,-84.3,57.1C-91.5,40.5,-93.8,23.1,-92.4,6.4C-91.1,-10.4,-86.1,-26.5,-77.3,-40.4C-68.5,-54.3,-55.9,-66,-41.8,-73.1C-27.6,-80.2,-13.8,-82.7,0.3,-83.1C14.4,-83.6,28.8,-82,44.7,-76.4Z"
          fill="currentColor"
          transform="translate(100 100)"
        />
      </svg>
      <div className="relative z-10">
        <p className="mb-3 font-mono text-[11px] font-medium uppercase tracking-[0.05em] text-primary-fixed">
          Focus Mode {running ? "Active" : "Ready"}
        </p>
        <h3 className="mb-5 text-[48px] font-bold leading-none tracking-[-0.02em]">
          {mm}:{ss}
        </h3>
        <div className="flex justify-center gap-3">
          <button
            onClick={() => setRunning((r) => !r)}
            className="rounded-lg bg-secondary px-5 py-2 text-sm font-semibold text-on-secondary transition hover:bg-secondary-hover"
          >
            {running ? "Pause" : seconds === 0 ? "Restart" : "Pause"}
          </button>
          <button
            onClick={() => {
              setRunning(false);
              setSeconds(SESSION);
            }}
            className="rounded-lg bg-on-primary-container px-5 py-2 text-sm font-semibold text-on-primary transition hover:opacity-90"
          >
            Stop
          </button>
        </div>
      </div>
    </div>
  );
}

function DailyProductivityCard({
  completed,
  focusHours,
  weeklyGoal,
  streak,
}: {
  completed: number;
  focusHours: number;
  weeklyGoal: number;
  streak: number;
}) {
  return (
    <Card padding="md">
      <h4 className="mb-4 text-base font-semibold text-primary">Daily Productivity</h4>
      <div className="grid grid-cols-2 gap-3">
        <Stat label="Completed" value={completed} tone="secondary" />
        <Stat label="Focus Hours" value={focusHours} tone="primary" />
      </div>
      <div className="mt-5">
        <div className="mb-1 flex items-end justify-between">
          <p className="text-sm font-semibold text-primary">Weekly Goal</p>
          <p className="font-mono text-[11px] font-medium text-on-surface-variant">{weeklyGoal}%</p>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-surface-container">
          <div className="h-full bg-secondary" style={{ width: `${weeklyGoal}%` }} />
        </div>
      </div>
      <div className="mt-5 flex items-center gap-3 border-t border-outline-variant pt-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary-container text-on-secondary-container">
          <TrendingUp className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm font-semibold leading-tight text-primary">
            Streak: {streak} Days
          </p>
          <p className="text-[12px] text-on-surface-variant">Keep it up, you&apos;re on fire!</p>
        </div>
      </div>
    </Card>
  );
}

function StayInspiredCard() {
  return (
    <div className="group relative h-48 overflow-hidden rounded-xl">
      <div className="absolute inset-0 bg-gradient-to-br from-inspire-from via-inspire-via to-inspire-to" />
      {/* Subtle dot pattern */}
      <svg
        className="absolute inset-0 h-full w-full opacity-20"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          <pattern id="dots" x="0" y="0" width="14" height="14" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="0.8" fill="white" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#dots)" />
      </svg>
      {/* Plant illustration */}
      <svg
        className="absolute bottom-4 left-6 h-24 w-24"
        viewBox="0 0 64 64"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M32 50 C 32 50, 18 36, 22 22 C 26 28, 30 32, 32 34 C 34 32, 38 28, 42 22 C 46 36, 32 50, 32 50 Z"
          fill="rgb(var(--color-secondary-fixed-dim))"
          opacity="0.85"
        />
        <path
          d="M32 50 C 32 50, 20 44, 16 36 C 22 38, 28 40, 32 42"
          fill="rgb(var(--color-secondary-container))"
          opacity="0.7"
        />
        <rect x="24" y="48" width="16" height="10" rx="2" fill="rgb(var(--color-on-secondary-fixed))" />
        <rect x="22" y="46" width="20" height="3" rx="1" fill="rgb(var(--color-on-secondary-fixed))" opacity="0.7" />
      </svg>
      {/* Laptop illustration */}
      <svg
        className="absolute bottom-6 right-4 h-20 w-32"
        viewBox="0 0 96 60"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path d="M16 8 L80 8 L84 44 L12 44 Z" fill="rgb(var(--color-border))" opacity="0.9" />
        <rect x="20" y="12" width="56" height="28" fill="rgb(var(--color-primary))" />
        <rect x="24" y="16" width="20" height="2" rx="1" fill="rgb(var(--color-secondary-fixed-dim))" opacity="0.8" />
        <rect x="24" y="20" width="32" height="2" rx="1" fill="rgb(var(--color-surface))" opacity="0.4" />
        <rect x="24" y="24" width="28" height="2" rx="1" fill="rgb(var(--color-surface))" opacity="0.3" />
        <path d="M8 48 L88 48 L92 52 L4 52 Z" fill="rgb(var(--color-outline-variant))" />
      </svg>
      {/* Caption */}
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4">
        <p className="text-base font-semibold text-white">Stay inspired.</p>
      </div>
    </div>
  );
}
