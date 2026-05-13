"use client";

import { useRouter } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { TodoForm } from "@/components/todos/TodoForm";
import { Card } from "@/components/ui/Card";
import { useAuthStore, useTodoStore } from "@/store";

export default function NewTodoPage() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const create = useTodoStore((s) => s.create);

  return (
    <AppShell title="New Task">
      <div className="mx-auto max-w-2xl">
        <Card padding="lg" shadow>
          <TodoForm
            submitLabel="Create task"
            onSubmit={async (input) => {
              if (!user) return;
              await create(user.id, input);
              router.push("/todos");
            }}
            onCancel={() => router.back()}
          />
        </Card>
      </div>
    </AppShell>
  );
}
