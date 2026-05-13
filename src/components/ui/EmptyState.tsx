import { ReactNode } from "react";
import { Inbox } from "lucide-react";

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-outline-variant bg-white py-12 px-6 text-center">
      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-surface-container-low text-on-surface-variant">
        {icon ?? <Inbox className="h-6 w-6" />}
      </div>
      <h3 className="font-display text-lg font-semibold text-on-surface">{title}</h3>
      {description && (
        <p className="mt-1 max-w-sm text-sm text-on-surface-variant">{description}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
