import { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Tone = "primary" | "secondary" | "neutral";

const toneClass: Record<Tone, string> = {
  primary: "text-primary",
  secondary: "text-secondary",
  neutral: "text-on-surface",
};

export function Stat({
  label,
  value,
  tone = "primary",
  className,
}: {
  label: ReactNode;
  value: ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-lg border border-outline-variant/40 bg-background p-3",
        className
      )}
    >
      <p className="font-mono text-[11px] font-medium uppercase tracking-[0.05em] text-on-surface-variant">
        {label}
      </p>
      <p
        className={cn(
          "mt-1 font-display text-[28px] font-bold leading-9 tracking-[-0.02em]",
          toneClass[tone]
        )}
      >
        {value}
      </p>
    </div>
  );
}
