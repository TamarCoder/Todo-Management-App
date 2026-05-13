import { ReactNode } from "react";
import { LucideIcon } from "lucide-react";

export function MetaField({
  label,
  value,
  icon: Icon,
}: {
  label: ReactNode;
  value: ReactNode;
  icon?: LucideIcon;
}) {
  return (
    <div>
      <p className="flex items-center gap-1 font-mono text-[11px] font-medium uppercase tracking-[0.05em] text-on-surface-variant">
        {Icon && <Icon className="h-3 w-3" />}
        {label}
      </p>
      <p className="mt-1 text-sm font-semibold text-on-surface">{value}</p>
    </div>
  );
}
