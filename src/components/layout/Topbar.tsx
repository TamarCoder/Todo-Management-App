"use client";

import { Bell, Search, Settings, Menu, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { useAuthStore, useSearchStore } from "@/store";
import { Avatar, initialsFrom } from "@/components/ui/Avatar";

export function Topbar({
  title,
  onOpenSidebar,
}: {
  title?: string;
  onOpenSidebar?: () => void;
}) {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const query = useSearchStore((s) => s.query);
  const setQuery = useSearchStore((s) => s.setQuery);
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  const initials = initialsFrom(user?.displayName || user?.email);

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-outline-variant bg-background px-4 md:px-8">
      <div className="flex items-center gap-4">
        <button
          onClick={onOpenSidebar}
          className="rounded-md p-2 text-on-surface hover:bg-surface-container-low md:hidden"
          aria-label="Open sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>
        <Link
          href="/dashboard"
          className="font-display text-[28px] font-bold tracking-[-0.02em] text-primary"
          aria-label="FocusFlow home"
        >
          FocusFlow
        </Link>
        {title && (
          <span className="sr-only" aria-live="polite">
            {title}
          </span>
        )}
      </div>

      <div className="hidden max-w-xl flex-1 px-6 sm:block">
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-on-surface-variant" />
          <input
            placeholder="Search tasks..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="h-11 w-full rounded-full border border-transparent bg-surface-container-low pl-12 pr-4 text-sm font-medium placeholder:text-on-surface-variant focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/20"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          className="rounded-full p-2 text-on-surface hover:bg-surface-container-low"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
        </button>
        <Link
          href="/profile"
          className="rounded-full p-2 text-on-surface hover:bg-surface-container-low"
          aria-label="Settings"
        >
          <Settings className="h-5 w-5" />
        </Link>
        <div className="relative">
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="ml-1 rounded-full"
            aria-label="Profile menu"
          >
            <Avatar initials={initials} size="lg" />
          </button>
          {menuOpen && (
            <div
              className="absolute right-0 top-12 z-30 w-48 overflow-hidden rounded-lg border border-outline-variant bg-white shadow-card"
              onMouseLeave={() => setMenuOpen(false)}
            >
              <div className="border-b border-outline-variant px-4 py-3">
                <p className="text-sm font-semibold text-on-surface">
                  {user?.displayName}
                </p>
                <p className="truncate font-mono text-[11px] text-on-surface-variant">
                  {user?.email}
                </p>
              </div>
              <Link
                href="/profile"
                className="block px-4 py-2 text-sm text-on-surface hover:bg-surface-container-low"
                onClick={() => setMenuOpen(false)}
              >
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-on-surface hover:bg-surface-container-low"
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
