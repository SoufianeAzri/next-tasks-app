import { cn } from "@/utils/helpers";
import React from "react";

const FieldContainer = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col gap-2", className)}
    {...props}
  ></div>
));
FieldContainer.displayName = "FieldContainer";

const FieldTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h4
    ref={ref}
    className={cn("text-12-500-s-gray px-2", className)}
    {...props}
  />
));
FieldTitle.displayName = "FieldTitle";

export interface InputFieldProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

const InputField = React.forwardRef<HTMLInputElement, InputFieldProps>(
  ({ className, error, disabled, ...props }, ref) => (
    <div className="relative w-full">
      <input
        ref={ref}
        disabled={disabled}
        className={cn(
          "w-full focus:outline-none border border-solid border-gray-d9 px-4 py-2 r-10",
          "placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100",
          "disabled:cursor-not-allowed disabled:opacity-50",
          error && "border-red-main focus:border-red-main focus:ring-red-main/10",
          className
        )}
        {...props}
      />
      {error && (
        <p className="mt-1 text-xs text-red-main px-2">{error}</p>
      )}
    </div>
  )
);
InputField.displayName = "InputField";

export interface TextareaFieldProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
}

const TextareaField = React.forwardRef<HTMLTextAreaElement, TextareaFieldProps>(
  ({ className, error, disabled, ...props }, ref) => (
    <div className="relative w-full">
      <textarea
        ref={ref}
        disabled={disabled}
        className={cn(
          "w-full min-h-20 focus:outline-none border border-solid border-gray-d9 px-4 py-2 r-10 resize-y",
          "placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100",
          "disabled:cursor-not-allowed disabled:opacity-50",
          error && "border-red-main focus:border-red-main focus:ring-red-main/10",
          className
        )}
        {...props}
      />
      {error && (
        <p className="mt-1 text-xs text-red-main px-2">{error}</p>
      )}
    </div>
  )
);
TextareaField.displayName = "TextareaField"

export {
    FieldContainer,
    FieldTitle,
    InputField,
    TextareaField
}