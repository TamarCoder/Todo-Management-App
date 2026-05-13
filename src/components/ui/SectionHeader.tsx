import { ReactNode } from "react";

/**
 * Page-section title with optional count badge and trailing slot
 * (filters, progress bar, etc). Used for "Today 4 [progress]" and
 * similar dashboard / list headers.
 */
export function SectionHeader({
  title,
  count,
  trailing,
}: {
  title: ReactNode;
  count?: number;
  trailing?: ReactNode;
}) {
  return (
    <div className="mb-3 flex items-center gap-4">
      <h2 className="flex items-center gap-2 font-display text-[24px] font-semibold leading-8 tracking-[-0.01em] text-primary">
        {title}
        {typeof count === "number" && (
          <span className="rounded-full bg-surface-container px-2 py-0.5 font-mono text-[11px] font-medium tracking-[0.05em] text-on-surface-variant">
            {count}
          </span>
        )}
      </h2>
      {trailing && <div className="flex-1">{trailing}</div>}
    </div>
  );
}
