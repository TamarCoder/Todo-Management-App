"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { useAuthStore } from "@/store";
import { Spinner } from "@/components/ui/Spinner";

export function AppShell({
  title,
  children,
}: {
  title?: string;
  children: ReactNode;
}) {
  const user = useAuthStore((s) => s.user);
  const loading = useAuthStore((s) => s.loading);
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [loading, user, router]);

  if (loading || !user) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar title={title} onOpenSidebar={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto scrollbar-thin">
          <div className="mx-auto w-full max-w-container-max px-4 py-6 md:px-8 md:py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
