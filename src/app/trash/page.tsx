"use client";

import { AppShell } from "@/components/layout/AppShell";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import { Trash2 } from "lucide-react";
import Link from "next/link";

export default function TrashPage() {
  return (
    <AppShell title="Trash">
      <EmptyState
        icon={<Trash2 className="h-6 w-6" />}
        title="Coming soon"
        description="Deleted tasks are removed immediately in this demo. A soft-delete trash bin is on the roadmap."
        action={
          <Link href="/dashboard">
            <Button variant="ghost">Back to dashboard</Button>
          </Link>
        }
      />
    </AppShell>
  );
}
