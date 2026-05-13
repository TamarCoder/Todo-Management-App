"use client";

import { ConfirmDialog } from "@/components/ui/ConfirmDialog";

export function DeleteTodoDialog({
  open,
  title,
  onCancel,
  onConfirm,
}: {
  open: boolean;
  title: string;
  onCancel: () => void;
  onConfirm: () => Promise<void>;
}) {
  return (
    <ConfirmDialog
      open={open}
      title="Delete task?"
      description={`"${title}" will be permanently removed. This action cannot be undone.`}
      confirmLabel="Delete"
      destructive
      onCancel={onCancel}
      onConfirm={onConfirm}
    />
  );
}
