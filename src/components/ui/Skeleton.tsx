import { cn } from "@/lib/utils";

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-md bg-surface-container", className)} />;
}

export function TodoSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      {[0, 1, 2, 3].map((i) => (
        <div
          key={i}
          className="flex items-center gap-4 rounded-xl border border-outline-variant bg-white p-4"
        >
          <Skeleton className="h-5 w-5 rounded" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-3 w-1/3" />
          </div>
        </div>
      ))}
    </div>
  );
}
