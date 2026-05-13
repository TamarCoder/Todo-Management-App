"use client";

import { SelectHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

type Props = SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
  error?: string | null;
  hint?: string;
};

export const Select = forwardRef<HTMLSelectElement, Props>(function Select(
  { label, error, hint, className, id, children, ...rest },
  ref
) {
  const inputId = id ?? rest.name;
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-[13px] font-semibold text-on-surface">
          {label}
        </label>
      )}
      <select
        ref={ref}
        id={inputId}
        className={cn(
          "h-10 rounded-lg border bg-white px-3 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary/30",
          error ? "border-danger" : "border-outline-variant focus:border-secondary",
          className
        )}
        {...rest}
      >
        {children}
      </select>
      {error ? (
        <p className="text-[12px] text-danger">{error}</p>
      ) : hint ? (
        <p className="text-[12px] text-on-surface-variant">{hint}</p>
      ) : null}
    </div>
  );
});
