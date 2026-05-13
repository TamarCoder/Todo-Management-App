"use client";

import { useEffect, useRef, ReactNode } from "react";
import { useAuthStore, wireStores } from "@/store";

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
