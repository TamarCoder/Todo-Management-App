"use client";

import { useEffect, useRef, ReactNode } from "react";
import { useAuthStore, wireStores } from "@/store";

/**
 * Client-side bootstrapper. Runs once at app start: wires cross-store
 * subscriptions and kicks off auth initialization (seed + restore session).
 * Replaces the prior <AuthProvider> / <SearchProvider> tree.
 */
export function StoreInitializer({ children }: { children: ReactNode }) {
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    wireStores();
    useAuthStore.getState().initialize();
  }, []);

  return <>{children}</>;
}
