import { cn } from "@/utils/helpers";
import React from "react";

const ProgressBarContainer = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col gap-1", className)}
    {...props}
  ></div>
));
ProgressBarContainer.displayName = "ProgressBarContainer";

const ProgressContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "h-1 w-full bg-gray-ec overflow-hidden rounded-4xl",
      className
    )}
    {...props}
  ></div>
));
ProgressContent.displayName = "ProgressContent";

interface ProgressBarProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
}

const ProgressBar = React.forwardRef<HTMLDivElement, ProgressBarProps>(
  ({ className, value, ...props }, ref) => {
    const color =
      value < 30
        ? "bg-red-main"
        : value < 60 && value >= 30
        ? "bg-orange-main"
        : value >= 60 && value < 95
        ? "bg-blue-main"
        : "bg-green-main";
    return (
      <div
        ref={ref}
        className={cn("h-full rounded-4xl", color)}
        {...props}
        style={{
          width: `${value}%`,
        }}
      ></div>
    );
  }
);
ProgressBar.displayName = "ProgressBar";

const ProgreesBarText = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p ref={ref} className={cn("text-12-500-black", className)} {...props} />
));
ProgreesBarText.displayName = "ProgreesBarText";

export { ProgressBarContainer, ProgressBar, ProgressContent, ProgreesBarText };
