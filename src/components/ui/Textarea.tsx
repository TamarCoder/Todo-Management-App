"use client";

import { TextareaHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

type Props = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
  error?: string | null;
  hint?: string;
};

export const Textarea = forwardRef<HTMLTextAreaElement, Props>(function Textarea(
  { label, error, hint, className, id, ...rest },
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
      <textarea
        ref={ref}
        id={inputId}
        rows={4}
        className={cn(
          "rounded-lg border bg-white p-3 text-sm text-on-surface placeholder:text-placeholder focus:outline-none focus:ring-2 focus:ring-secondary/30",
          error ? "border-danger" : "border-outline-variant focus:border-secondary",
          className
        )}
        {...rest}
      />
      {error ? (
        <p className="text-[12px] text-danger">{error}</p>
      ) : hint ? (
        <p className="text-[12px] text-on-surface-variant">{hint}</p>
      ) : null}
    </div>
  );
});
