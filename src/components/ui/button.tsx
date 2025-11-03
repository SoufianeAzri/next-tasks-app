import { cn } from "@/utils/helpers";
import React from "react";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "success" | "warning" | "danger" | "dashed" | "rounded";
}

const Button = React.memo(React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", ...props }, ref) => {
    const variants = {
      primary: "bg-primary hover:bg-primary/80 text-white",
      success: "bg-green-600 hover:bg-green-700 text-white",
      warning: "bg-yellow-500 hover:bg-yellow-600 text-black",
      danger: "bg-red-600 hover:bg-red-700 text-white",
      dashed: "bg-none border-gray-d9 border-dashed border hover:opacity-75",
      rounded:
        "w-10 h-10 rounded-full border-gray-d9 border-dashed border flex justify-center items-center cursor-pointer",
    };
    return (
      <button
        className={cn(
          "px-4 py-2.5 flex justify-center items-center rounded-[10px] cursor-pointer transition",
          variants[variant],
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
));
Button.displayName = "Button";

const ButtonText = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <p ref={ref} className={cn("text-14-500-s-black", className)} {...props} />
));
ButtonText.displayName = "ButtonText";

const ButtonIcon = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("w-auto flex justify-center items-center", className)}
    {...props}
  />
));
ButtonIcon.displayName = "ButtonIcon";

const LoadingDots = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex justify-center items-center gap-x-1 loading-dots my-2",
      className
    )}
    {...props}
  >
    <div className="w-[5px] h-[5px] rounded-full bg-dim-gray animate-flash" />
    <div
      className="w-[5px] h-[5px] rounded-full bg-dim-gray animate-flash"
      style={{
        animationDelay: ".1s",
      }}
    />
    <div
      className="w-[5px] h-[5px] rounded-full bg-dim-gray animate-flash"
      style={{
        animationDelay: ".2s",
      }}
    />
  </div>
));
ButtonIcon.displayName = "ButtonIcon";

export { Button, ButtonText, ButtonIcon, LoadingDots };
