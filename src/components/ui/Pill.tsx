import { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Shape = "rounded" | "pill";

/**
 * Generic colored tag/chip. Unlike Badge (which has fixed semantic tones),
 * Pill accepts arbitrary Tailwind bg/text classes — useful for design-system
 * tokens that map to data (priority, status, project tag, etc).
 *
 * Example:
 *   <Pill bg="bg-error-container" text="text-on-error-container">URGENT</Pill>
 */
export function Pill({
  bg,
  text,
  shape = "pill",
  className,
  children,
}: {
  bg: string;
  text: string;
  shape?: Shape;
  className?: string;
  children: ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-block px-2 py-0.5 font-mono text-[11px] font-medium uppercase tracking-[0.05em]",
        shape === "pill" ? "rounded-full" : "rounded",
        bg,
        text,
        className
      )}
    >
      {children}
    </span>
  );
}
