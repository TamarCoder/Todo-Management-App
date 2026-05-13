"use client";

import { AppShell } from "@/components/layout/AppShell";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import { Archive } from "lucide-react";
import Link from "next/link";

export default function ArchivePage() {
  return (
    <AppShell title="Archive">
      <EmptyState
        icon={<Archive className="h-6 w-6" />}
        title="Coming soon"
        description="Archived tasks will live here so your active workspace stays clean."
        action={
          <Link href="/dashboard">
            <Button variant="ghost">Back to dashboard</Button>
          </Link>
        }
      />
    </AppShell>
  );
}
