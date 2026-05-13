"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Inbox,
  CalendarDays,
  CalendarRange,
  FolderKanban,
  Archive,
  Trash2,
  Plus,
  Hexagon,
  X,
} from "lucide-react";
import { useAuthStore } from "@/store";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/dashboard", label: "Inbox", icon: Inbox },
  { href: "/todos", label: "Today", icon: CalendarDays },
  { href: "/upcoming", label: "Upcoming", icon: CalendarRange },
  { href: "/projects", label: "Projects", icon: FolderKanban },
];

const BOTTOM_NAV = [
  { href: "/archive", label: "Archive", icon: Archive },
  { href: "/trash", label: "Trash", icon: Trash2 },
];

export function Sidebar({
  open,
  onClose,
}: {
  open?: boolean;
  onClose?: () => void;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const user = useAuthStore((s) => s.user);

  const isActive = (href: string) =>
    pathname === href || (href !== "/" && pathname?.startsWith(href));

  const content = (
    <div className="flex h-full flex-col gap-2 px-5 py-8">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-on-primary">
          <Hexagon className="h-5 w-5" />
        </div>
        <div>
          <h2 className="font-display text-[20px] font-bold leading-tight text-primary">
            My Workspace
          </h2>
          <p className="font-mono text-[11px] uppercase tracking-wider text-on-surface-variant">
            {user?.displayName ? user.displayName : "Personal Tasks"}
          </p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="ml-auto rounded-md p-1 text-on-surface-variant hover:bg-surface-container-low md:hidden"
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      <button
        onClick={() => {
          onClose?.();
          router.push("/todos/new");
        }}
        className="mb-6 flex w-full items-center justify-center gap-2 rounded-xl bg-secondary px-4 py-2.5 font-semibold text-on-secondary transition hover:bg-secondary-hover"
      >
        <Plus className="h-5 w-5" />
        New Task
      </button>

      <nav className="flex flex-1 flex-col gap-1">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = isActive(href);
          return (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              className={cn(
                "flex items-center gap-3 rounded-xl px-4 py-2 text-sm transition",
                active
                  ? "bg-secondary-container font-bold text-on-secondary-container"
                  : "text-on-surface-variant hover:bg-surface-container-low"
              )}
            >
              <Icon className="h-5 w-5" />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto flex flex-col gap-1">
        {BOTTOM_NAV.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            onClick={onClose}
            className="flex items-center gap-3 rounded-xl px-4 py-2 text-sm text-on-surface-variant transition hover:bg-surface-container-low"
          >
            <Icon className="h-5 w-5" />
            <span>{label}</span>
          </Link>
        ))}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop */}
      <aside className="hidden h-screen w-64 shrink-0 border-r border-outline-variant bg-white md:flex md:flex-col">
        {content}
      </aside>
      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-40 md:hidden" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-[rgba(11,28,48,0.45)]" onClick={onClose} />
          <aside className="absolute left-0 top-0 h-full w-72 bg-white shadow-card">{content}</aside>
        </div>
      )}
    </>
  );
}
