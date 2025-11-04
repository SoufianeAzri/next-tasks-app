"use client";
import React, {
  useState,
  useRef,
  useEffect,
  createContext,
  useContext,
} from "react";
import { cn } from "@/utils/helpers";


interface DropdownContextProps {
  open: boolean;
  toggle: () => void;
  close: () => void;
  onSelect?: (item: any) => void;
}

const DropdownContext = createContext<DropdownContextProps | null>(null);

const useDropdown = () => {
  const context = useContext(DropdownContext);
  if (!context)
    throw new Error("Dropdown components must be used within <Dropdown>");
  return context;
};


export interface DropdownProps
  extends React.HTMLAttributes<HTMLDivElement> {
  onSelect?: (item: any) => void;
  /** Optional external control */
  open?: boolean;
  /** Called whenever open state changes */
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}

const Dropdown = React.memo(React.forwardRef<HTMLDivElement, DropdownProps>(
  (
    { onSelect, children, className, open: controlledOpen, onOpenChange, ...props },
    ref
  ) => {
    const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const isControlled = controlledOpen !== undefined;
    const open = isControlled ? controlledOpen : uncontrolledOpen;

    const setOpen = (value: boolean) => {
      if (!isControlled) setUncontrolledOpen(value);
      onOpenChange?.(value);
    };

    const toggle = () => setOpen(!open);
    const close = () => setOpen(false);

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          containerRef.current &&
          !containerRef.current.contains(event.target as Node)
        ) {
          close();
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
      <DropdownContext.Provider value={{ open, toggle, close, onSelect }}>
        <div
          ref={(node) => {
            containerRef.current = node;
            if (typeof ref === "function") ref(node);
            else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
          }}
          className={cn("relative inline-block", className)}
          {...props}
        >
          {children}
        </div>
      </DropdownContext.Provider>
    );
  }
));
Dropdown.displayName = "Dropdown";


const Trigger = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ children, className, ...props }, ref) => {
  const { toggle } = useDropdown();

  return (
    <div
      ref={ref}
      onClick={toggle}
      className={cn("cursor-pointer flex items-center justify-between", className)}
      {...props}
    >
      {children}
    </div>
  );
});
Trigger.displayName = "Trigger";


const List = React.forwardRef<
  HTMLUListElement,
  React.HTMLAttributes<HTMLUListElement>
>(({ children, className, ...props }, ref) => {
  const { open } = useDropdown();
  if (!open) return null;

  return (
    <ul
      ref={ref}
      className={cn(
        "absolute z-10 w-full mt-2 r-10 bg-gray-f7 shadow-xs max-h-48 overflow-auto",
        className
      )}
      {...props}
    >
      {children}
    </ul>
  );
});
List.displayName = "List";

// ---------------------- Item ----------------------
interface ItemProps extends React.LiHTMLAttributes<HTMLLIElement> {
  value?: any;
}

const Item = React.forwardRef<HTMLLIElement, ItemProps>(
  ({ children, value, className, ...props }, ref) => {
    const { onSelect, close } = useDropdown();

    const handleClick = () => {
      onSelect?.(value);
      close();
    };

    return (
      <li
        ref={ref}
        onClick={handleClick}
        className={cn(
          "px-4 py-2 hover:bg-gray-f1 cursor-pointer text-14-500-s-gray",
          className
        )}
        {...props}
      >
        {children}
      </li>
    );
  }
);
Item.displayName = "Item";


const Icon = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(className)}
    {...props}
  />
));
Icon.displayName = "Icon";

export { Dropdown, Icon, Trigger, Item, List };
