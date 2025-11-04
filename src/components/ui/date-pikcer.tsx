"use client";

import React from "react";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { cn, localeFormatFr } from "@/utils/helpers";

export interface DatePickerProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  date: Date | null;
  onChangeAction: (value: Date | null) => void;
  placeholder?: string;
  error?: string;
}

const DatePicker = React.forwardRef<HTMLDivElement, DatePickerProps>(
  (
    { className, date, error, onChangeAction, placeholder = "Select date", ...props },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn("flex flex-col gap-1", className)}
        {...props}
      >
        <div className="relative w-full">
          <ReactDatePicker
            selected={date ? new Date(date) : null}
            onChange={(value) => {
              if (value) onChangeAction(value);
            }}
            dateFormat="dd/MM/yyyy"
            calendarStartDay={1}
            placeholderText={placeholder}
            className={cn(
              "w-full focus:outline-none border border-solid border-gray-d9 px-4 py-2 r-10",
              "placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100",
              "disabled:cursor-not-allowed disabled:opacity-50"
            )}
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
            📅
          </div>
        </div>
        {error && <p className="mt-1 text-xs text-red-main px-2">{error}</p>}
      </div>
    );
  }
);

DatePicker.displayName = "DatePicker";
export { DatePicker };
