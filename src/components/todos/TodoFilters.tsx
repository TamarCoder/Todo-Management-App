"use client";

import { Search } from "lucide-react";

export type StatusFilter = "all" | "todo" | "in_progress" | "done";
export type PriorityFilter = "all" | "low" | "medium" | "high";
export type SortBy = "createdDesc" | "createdAsc" | "dueAsc" | "dueDesc";

export function TodoFilters({
  search,
  onSearch,
  status,
  onStatus,
  priority,
  onPriority,
  sort,
  onSort,
}: {
  search: string;
  onSearch: (v: string) => void;
  status: StatusFilter;
  onStatus: (v: StatusFilter) => void;
  priority: PriorityFilter;
  onPriority: (v: PriorityFilter) => void;
  sort: SortBy;
  onSort: (v: SortBy) => void;
}) {
  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div className="relative flex-1 md:max-w-sm">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-on-surface-variant" />
        <input
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          placeholder="Search tasks..."
          className="h-10 w-full rounded-xl border border-outline-variant bg-white pl-10 pr-4 text-sm placeholder:text-on-surface-variant focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/20"
        />
      </div>
      <div className="grid grid-cols-3 gap-2 md:flex md:gap-2">
        <select
          value={status}
          onChange={(e) => onStatus(e.target.value as StatusFilter)}
          className="h-10 rounded-lg border border-outline-variant bg-white px-3 text-sm"
          aria-label="Filter by status"
        >
          <option value="all">All status</option>
          <option value="todo">To Do</option>
          <option value="in_progress">In Progress</option>
          <option value="done">Done</option>
        </select>
        <select
          value={priority}
          onChange={(e) => onPriority(e.target.value as PriorityFilter)}
          className="h-10 rounded-lg border border-outline-variant bg-white px-3 text-sm"
          aria-label="Filter by priority"
        >
          <option value="all">All priority</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
        <select
          value={sort}
          onChange={(e) => onSort(e.target.value as SortBy)}
          className="h-10 rounded-lg border border-outline-variant bg-white px-3 text-sm"
          aria-label="Sort"
        >
          <option value="createdDesc">Newest</option>
          <option value="createdAsc">Oldest</option>
          <option value="dueAsc">Due soon</option>
          <option value="dueDesc">Due latest</option>
        </select>
      </div>
    </div>
  );
}
