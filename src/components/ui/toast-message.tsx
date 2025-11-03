"use client";
import { cn } from "@/utils/helpers";
import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useImperativeHandle,
} from "react";

interface ToastProps extends React.HTMLAttributes<HTMLDivElement> {
  message: string;
  title: string;
  type?: "1" | "2" | "3";
}

const Toast = React.forwardRef<HTMLDivElement, ToastProps>(
  ({ message, type = "1", title, className, ...props }, ref) => {
    return (
      <div
        className={cn(
          "bg-white px-4 py-2 rounded-2xl flex justify-between items-center gap-x-3 border border-solid",
          type === "1" && "border-green-main",
          type === "2" && "border-red-main"
        )}
        {...props}
      >
        <div
          className={cn(type === "1" && "like", type === "2" && "not_allowed")}
        ></div>
        <div className="flex flex-col gap-0.5 py-1" style={{ width: "90%" }}>
          <h5>{title}</h5>
          <p className="text-12-500-s-black">{message}</p>
        </div>
      </div>
    );
  }
);

Toast.displayName = "Toast";

interface ToastType {
  message: string;
  title: string;
  type?: "1" | "2" | "3";
}

interface ToastContextProps {
  showToast: (message: string, title: string, type?: "1" | "2" | "3") => void;
}

const ToastContext = createContext<ToastContextProps | undefined>(undefined);

const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
};

const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [toast, setToast] = useState<ToastType | null>(null);

  const showToast = useCallback(
    (message: string, title: string, type: "1" | "2" | "3" = "3") => {
      setToast({ message, title, type });
      setTimeout(() => setToast(null), 5000);
    },
    []
  );

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {toast && (
        <div className="lg:w-[400px] w-[350px] fixed bottom-4 left-4 lg:bottom-8 lg:left-8 z-[9999] opacity-0 animate-[var(--animate-toast-message)]">
          <Toast
            title={toast.title}
            message={toast.message}
            type={toast.type}
          />
        </div>
      )}
    </ToastContext.Provider>
  );
};

export { ToastProvider, Toast, useToast };
