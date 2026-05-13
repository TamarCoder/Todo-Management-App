import { HTMLAttributes, ReactNode, forwardRef } from "react";
import { cn } from "@/lib/utils";

type Padding = "none" | "sm" | "md" | "lg";

type Props = HTMLAttributes<HTMLDivElement> & {
  padding?: Padding;
  bordered?: boolean;
  shadow?: boolean;
  children: ReactNode;
};

const paddingClass: Record<Padding, string> = {
  none: "",
  sm: "p-3",
  md: "p-5",
  lg: "p-6",
};

export const Card = forwardRef<HTMLDivElement, Props>(function Card(
  { padding = "md", bordered = true, shadow = false, className, children, ...rest },
  ref
) {
  return (
    <div
      ref={ref}
      className={cn(
        "rounded-xl bg-white",
        bordered && "border border-outline-variant",
        shadow && "shadow-sm",
        paddingClass[padding],
        className
      )}
      {...rest}
    >
      {children}
    </div>
  );
});
