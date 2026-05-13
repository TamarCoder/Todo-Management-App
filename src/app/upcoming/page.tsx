"use client";

import { useMemo, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Clock,
  Users,
  ChevronDown,
} from "lucide-react";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { Card } from "@/components/ui/Card";
import { Pill } from "@/components/ui/Pill";
import { useAuthStore, useTodoStore, useSearchStore, matchesQuery } from "@/store";
import { localDateISO } from "@/lib/utils";
import { Todo, TodoPriority } from "@/lib/types";

type CalendarView = "month" | "week" | "list";

export default function UpcomingPage() {
  const user = useAuthStore((s) => s.user);
  const allTodos = useTodoStore((s) => s.todos);
  const loading = useTodoStore((s) => s.loading);
  const update = useTodoStore((s) => s.update);
  const query = useSearchStore((s) => s.query);
  const todos = useMemo(
    () => allTodos.filter((t) => matchesQuery(t.title, query)),
    [allTodos, query]
  );
  const today = useMemo(() => localDateISO(), []);
  const [cursor, setCursor] = useState(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });
  const [selectedISO, setSelectedISO] = useState<string>(today);
  const [view, setView] = useState<CalendarView>("month");
  const [showCompleted, setShowCompleted] = useState(false);

  const monthLabel = cursor.toLocaleDateString(undefined, {
    month: "long",
    year: "numeric",
  });

  const days = useMemo(() => {
    const first = new Date(cursor.getFullYear(), cursor.getMonth(), 1);
    const startDay = first.getDay();
    const numDays = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0).getDate();
    const cells: { date: Date | null; iso: string }[] = [];
    for (let i = 0; i < startDay; i++) cells.push({ date: null, iso: "" });
    for (let d = 1; d <= numDays; d++) {
      const date = new Date(cursor.getFullYear(), cursor.getMonth(), d);
      cells.push({ date, iso: localDateISO(date) });
    }
    while (cells.length % 7 !== 0) cells.push({ date: null, iso: "" });
    return cells;
  }, [cursor]);

  const byDate = useMemo(() => {
    const map = new Map<string, Todo[]>();
    for (const t of todos) {
      if (!t.dueDate) continue;
      const key = t.dueDate.slice(0, 10);
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(t);
    }
    return map;
  }, [todos]);

  const dayTasks = (byDate.get(selectedISO) ?? []).filter(
    (t) => showCompleted || t.status !== "done"
  );
  const hasHighPriority = dayTasks.some((t) => t.priority === "high");

  const tomorrowISO = useMemo(() => {
    const d = new Date(selectedISO);
    d.setDate(d.getDate() + 1);
    return localDateISO(d);
  }, [selectedISO]);
  const tomorrowCount = (byDate.get(tomorrowISO) ?? []).filter(
    (t) => t.status !== "done"
  ).length;

  const selectedDate = useMemo(() => new Date(selectedISO), [selectedISO]);

  const toggleDone = async (t: Todo) => {
    if (!user) return;
    await update(user.id, t.id, { status: t.status === "done" ? "todo" : "done" });
  };

  return (
    <AppShell title="Upcoming">
      <div className="mb-6">
        <h1 className="font-display text-[24px] font-semibold leading-8 tracking-[-0.01em] text-primary">
          Upcoming
        </h1>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
        {/* Calendar */}
        <section>
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <h2 className="font-display text-[24px] font-semibold leading-8 tracking-[-0.01em] text-primary">
                {monthLabel}
              </h2>
              <div className="flex gap-1">
                <button
                  onClick={() =>
                    setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))
                  }
                  className="rounded-md border border-outline-variant p-1.5 text-on-surface-variant transition hover:bg-surface-container"
                  aria-label="Previous month"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={() =>
                    setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))
                  }
                  className="rounded-md border border-outline-variant p-1.5 text-on-surface-variant transition hover:bg-surface-container"
                  aria-label="Next month"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="flex gap-1">
              {(["month", "week", "list"] as CalendarView[]).map((v) => (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  className={`px-4 py-1.5 text-sm font-medium capitalize transition-colors ${
                    view === v
                      ? "border-b-2 border-secondary text-secondary"
                      : "text-on-surface-variant hover:text-primary"
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>

          {view === "list" ? (
            <ListView
              todos={todos}
              today={today}
              showCompleted={showCompleted}
            />
          ) : (
            <CalendarGrid
              days={view === "month" ? days : days.slice(0, 7)}
              byDate={byDate}
              selectedISO={selectedISO}
              today={today}
              onSelect={setSelectedISO}
              loading={loading}
            />
          )}
        </section>

        {/* Agenda Panel */}
        <Card padding="none" className="flex flex-col">
          <div className="border-b border-outline-variant p-5">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-base font-semibold text-primary">Agenda</h3>
              <span className="font-mono text-[11px] font-medium uppercase tracking-[0.05em] text-on-surface-variant">
                {selectedDate.toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>
            <div className="flex gap-2">
              {hasHighPriority && (
                <Pill bg="bg-error-container" text="text-on-error-container" shape="rounded">
                  High Priority
                </Pill>
              )}
              <Pill bg="bg-surface-container-high" text="text-on-surface-variant" shape="rounded">
                {dayTasks.length} {dayTasks.length === 1 ? "Task" : "Tasks"}
              </Pill>
            </div>
          </div>

          <div className="flex-1 space-y-4 p-5">
            {dayTasks.length === 0 ? (
              <div className="rounded-xl border border-dashed border-outline-variant bg-surface-container-low/50 p-6 text-center">
                <p className="text-sm text-on-surface-variant">Nothing scheduled.</p>
              </div>
            ) : (
              dayTasks.map((t) => <AgendaCard key={t.id} todo={t} onToggle={toggleDone} />)
            )}

            <div className="pt-2">
              <p className="mb-3 font-mono text-[11px] font-medium uppercase tracking-[0.1em] text-outline">
                Tomorrow
              </p>
              <div className="rounded-xl border border-dashed border-outline-variant bg-surface-container-low/50 p-4">
                <p className="text-center text-sm italic text-on-surface-variant">
                  {tomorrowCount === 0
                    ? "Nothing scheduled for tomorrow"
                    : `${tomorrowCount} ${
                        tomorrowCount === 1 ? "task" : "tasks"
                      } scheduled for ${new Date(tomorrowISO).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                      })}`}
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-outline-variant p-5">
            <button
              onClick={() => setShowCompleted((v) => !v)}
              className="flex w-full items-center justify-between text-sm font-semibold text-primary"
            >
              <span>Show completed</span>
              <ChevronDown
                className={`h-4 w-4 text-outline transition-transform ${
                  showCompleted ? "rotate-180" : ""
                }`}
              />
            </button>
          </div>
        </Card>
      </div>
    </AppShell>
  );
}

function CalendarGrid({
  days,
  byDate,
  selectedISO,
  today,
  onSelect,
  loading,
}: {
  days: { date: Date | null; iso: string }[];
  byDate: Map<string, Todo[]>;
  selectedISO: string;
  today: string;
  onSelect: (iso: string) => void;
  loading: boolean;
}) {
  return (
    <div className="grid grid-cols-7 gap-px overflow-hidden rounded-xl border border-outline-variant bg-outline-variant shadow-sm">
      {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map((d) => (
        <div
          key={d}
          className="bg-white p-3 text-center font-mono text-[11px] font-medium tracking-[0.05em] text-on-surface-variant"
        >
          {d}
        </div>
      ))}
      {days.map((cell, idx) => {
        if (!cell.date) {
          return <div key={idx} className="h-32 bg-background/50 p-3" />;
        }
        const tasks = (byDate.get(cell.iso) ?? []).filter((t) => t.status !== "done");
        const selected = cell.iso === selectedISO;
        const isToday = cell.iso === today;
        return (
          <button
            key={idx}
            onClick={() => onSelect(cell.iso)}
            className={`group relative h-32 cursor-pointer bg-white p-2 text-left transition-colors hover:bg-surface-container ${
              selected ? "ring-2 ring-inset ring-secondary" : ""
            }`}
          >
            <span
              className={`inline-block rounded px-1.5 text-sm font-medium ${
                selected
                  ? "bg-secondary text-on-secondary"
                  : isToday
                  ? "bg-secondary-container text-on-secondary-container"
                  : "text-on-surface-variant"
              }`}
            >
              {cell.date.getDate()}
            </span>
            {!loading && tasks.length > 0 && (
              <div className="mt-1.5 flex flex-col gap-1">
                {tasks.slice(0, 2).map((t) => (
                  <span
                    key={t.id}
                    className={`truncate rounded px-1.5 py-0.5 text-[10px] font-medium ${pillClass(
                      t.priority
                    )}`}
                  >
                    {t.title}
                  </span>
                ))}
                {tasks.length > 2 && (
                  <span className="px-1 text-[10px] text-on-surface-variant">
                    +{tasks.length - 2} more
                  </span>
                )}
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}

function pillClass(priority: TodoPriority): string {
  if (priority === "high") return "bg-error-container text-on-error-container";
  if (priority === "medium")
    return "bg-tertiary-fixed text-on-tertiary-fixed-variant";
  return "bg-secondary-container text-on-secondary-container";
}

function AgendaCard({ todo, onToggle }: { todo: Todo; onToggle: (t: Todo) => void }) {
  const isHigh = todo.priority === "high";
  const isDone = todo.status === "done";
  const time = new Date(todo.createdAt).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  const category =
    todo.status === "in_progress" ? "In Progress" : todo.status === "done" ? "Done" : "Todo";

  return (
    <div
      className={`group relative rounded-xl border bg-white p-4 transition-all hover:shadow-card ${
        isHigh ? "border-error" : "border-outline-variant hover:border-secondary"
      }`}
    >
      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          checked={isDone}
          onChange={() => onToggle(todo)}
          className="mt-1 h-5 w-5 cursor-pointer rounded border-outline accent-secondary focus:ring-2 focus:ring-secondary/30"
        />
        <div className="min-w-0 flex-1">
          <Link
            href={`/todos/${todo.id}`}
            className={`block text-sm font-semibold leading-5 text-primary hover:text-secondary ${
              isDone ? "line-through opacity-60" : ""
            }`}
          >
            {todo.title}
          </Link>
          <div className="mt-1 flex items-center gap-1">
            {isHigh ? (
              <AlertCircle className="h-4 w-4 text-error" />
            ) : category === "In Progress" ? (
              <Users className="h-4 w-4 text-on-surface-variant" />
            ) : (
              <Clock className="h-4 w-4 text-on-surface-variant" />
            )}
            <p className="font-mono text-[11px] font-medium uppercase tracking-[0.05em] text-on-surface-variant">
              {time} · {category}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ListView({
  todos,
  today,
  showCompleted,
}: {
  todos: Todo[];
  today: string;
  showCompleted: boolean;
}) {
  const upcoming = todos
    .filter((t) => t.dueDate && t.dueDate >= today && (showCompleted || t.status !== "done"))
    .sort((a, b) => (a.dueDate! < b.dueDate! ? -1 : 1));

  if (upcoming.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-outline-variant bg-white p-10 text-center">
        <p className="text-sm text-on-surface-variant">Nothing upcoming.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {upcoming.map((t) => (
        <Link
          key={t.id}
          href={`/todos/${t.id}`}
          className="flex items-center justify-between rounded-xl border border-outline-variant bg-white p-4 transition hover:border-secondary hover:shadow-card"
        >
          <div className="min-w-0 flex-1">
            <p
              className={`text-base font-semibold leading-6 text-primary ${
                t.status === "done" ? "line-through opacity-60" : ""
              }`}
            >
              {t.title}
            </p>
            <p className="font-mono text-[11px] text-on-surface-variant">
              {new Date(t.dueDate!).toLocaleDateString(undefined, {
                weekday: "short",
                month: "short",
                day: "numeric",
              })}
            </p>
          </div>
          <span
            className={`rounded-full px-2 py-0.5 font-mono text-[11px] font-medium uppercase ${pillClass(
              t.priority
            )}`}
          >
            {t.priority}
          </span>
        </Link>
      ))}
    </div>
  );
}
