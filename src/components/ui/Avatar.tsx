import { cn } from "@/lib/utils";

type Size = "xs" | "sm" | "md" | "lg";

const sizeClass: Record<Size, string> = {
  xs: "h-5 w-5 text-[8px]",
  sm: "h-6 w-6 text-[9px]",
  md: "h-8 w-8 text-[10px]",
  lg: "h-10 w-10 text-xs",
};

export function initialsFrom(value: string | null | undefined): string {
  if (!value) return "?";
  return value
    .split(/[\s@._-]+/)
    .filter(Boolean)
    .map((w) => w[0]?.toUpperCase())
    .slice(0, 2)
    .join("") || "?";
}

export function Avatar({
  initials,
  from,
  size = "md",
  bgClass = "bg-secondary-container",
  textClass = "text-on-secondary-container",
  ring,
  className,
}: {
  initials?: string;
  from?: string | null;
  size?: Size;
  bgClass?: string;
  textClass?: string;
  ring?: boolean;
  className?: string;
}) {
  const text = initials ?? initialsFrom(from);
  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full font-semibold",
        sizeClass[size],
        bgClass,
        textClass,
        ring && "border-2 border-background",
        className
      )}
    >
      {text}
    </div>
  );
}

export function AvatarGroup({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn("flex -space-x-2", className)}>{children}</div>;
}
