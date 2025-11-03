import { cn } from "@/utils/helpers";
import React from "react";

const LoadingContainer = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center justify-center w-full h-full", className)}
    {...props}
  ></div>
));
LoadingContainer.displayName = "LoadingContainer";

const LoadingSpinner = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "w-10 h-10 border-4 border-gray-300 border-t-green-main rounded-full animate-spin",
      className
    )}
    {...props}
  ></div>
));
LoadingSpinner.displayName = "LoadingSpinner";

export { LoadingContainer, LoadingSpinner };
