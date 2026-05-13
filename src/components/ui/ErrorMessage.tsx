import { AlertCircle } from "lucide-react";

export function ErrorMessage({ message }: { message: string | null | undefined }) {
  if (!message) return null;
  return (
    <div className="flex items-start gap-2 rounded-lg border border-error-subtle-border bg-error-subtle px-3 py-2 text-sm text-on-danger-container">
      <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
      <span>{message}</span>
    </div>
  );
}
