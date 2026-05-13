"use client";

import { ButtonHTMLAttributes, forwardRef } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  fullWidth?: boolean;
};

const variantClasses: Record<Variant, string> = {
  primary: "bg-primary text-on-primary hover:bg-primary-hover disabled:bg-primary-disabled",
  secondary: "bg-secondary text-on-secondary hover:bg-secondary-hover disabled:bg-secondary-disabled",
  ghost: "bg-transparent text-on-surface border border-outline-variant hover:bg-surface-container-low",
  danger: "bg-danger text-white hover:bg-danger-hover disabled:bg-danger-disabled",
};

const sizeClasses: Record<Size, string> = {
  sm: "h-8 px-3 text-[13px]",
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-5 text-base",
};

export const Button = forwardRef<HTMLButtonElement, Props>(function Button(
  { variant = "primary", size = "md", loading, fullWidth, className, children, disabled, ...rest },
  ref
) {
  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-colors disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary/40",
        variantClasses[variant],
        sizeClasses[size],
        fullWidth && "w-full",
        className
      )}
      {...rest}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
});
