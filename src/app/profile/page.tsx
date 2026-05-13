"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { Card } from "@/components/ui/Card";
import { Stat } from "@/components/ui/Stat";
import { useAuthStore, useTodoStore } from "@/store";
import { validateDisplayName } from "@/lib/validation";

export default function ProfilePage() {
  const user = useAuthStore((s) => s.user);
  const updateProfile = useAuthStore((s) => s.updateProfile);
  const logout = useAuthStore((s) => s.logout);
  const todos = useTodoStore((s) => s.todos);
  const router = useRouter();
  const [displayName, setDisplayName] = useState(user?.displayName ?? "");
  const [error, setError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<number | null>(null);

  const totals = {
    total: todos.length,
    done: todos.filter((t) => t.status === "done").length,
    inProgress: todos.filter((t) => t.status === "in_progress").length,
  };

  const onSave = async () => {
    setError(null);
    setFormError(null);
    const v = validateDisplayName(displayName);
    if (!v.valid) {
      setError(v.error ?? "Invalid name");
      return;
    }
    setSaving(true);
    try {
      await updateProfile({ displayName: displayName.trim() });
      setSavedAt(Date.now());
    } catch (e: any) {
      setFormError(e?.message ?? "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AppShell title="Profile">
      <div className="mx-auto flex max-w-2xl flex-col gap-6">
        <Card padding="lg" shadow>
          <h2 className="mb-4 font-display text-[20px] font-semibold text-on-surface">
            Account
          </h2>
          {formError && <div className="mb-3"><ErrorMessage message={formError} /></div>}
          <div className="flex flex-col gap-4">
            <Input
              label="Display name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              error={error}
            />
            <div>
              <label className="text-[13px] font-semibold text-on-surface">Email</label>
              <p className="mt-1 rounded-lg border border-outline-variant bg-surface-container-low px-3 py-2 font-mono text-sm text-on-surface-variant">
                {user?.email}
              </p>
              <p className="mt-1 text-[12px] text-on-surface-variant">
                Email cannot be changed in this demo.
              </p>
            </div>
            <div className="flex items-center justify-between">
              {savedAt && (
                <p className="text-[12px] text-secondary">
                  Saved {new Date(savedAt).toLocaleTimeString()}
                </p>
              )}
              <Button onClick={onSave} loading={saving} className="ml-auto">
                Save changes
              </Button>
            </div>
          </div>
        </Card>

        <Card padding="lg" shadow>
          <h2 className="mb-4 font-display text-[20px] font-semibold text-on-surface">
            Stats
          </h2>
          <div className="grid grid-cols-3 gap-3">
            <Stat label="Total tasks" value={totals.total} />
            <Stat label="Completed" value={totals.done} tone="secondary" />
            <Stat label="In progress" value={totals.inProgress} />
          </div>
        </Card>

        <Card padding="lg" shadow>
          <h2 className="mb-2 font-display text-[20px] font-semibold text-on-surface">
            Session
          </h2>
          <p className="mb-4 text-sm text-on-surface-variant">
            Sign out to switch accounts. Your tasks are saved locally.
          </p>
          <Button
            variant="ghost"
            onClick={async () => {
              await logout();
              router.push("/login");
            }}
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </Button>
        </Card>
      </div>
    </AppShell>
  );
}
