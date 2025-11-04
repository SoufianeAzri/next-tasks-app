import { cn } from "@/utils/helpers";
import React from "react";


const ItemsList = React.forwardRef<
  HTMLUListElement,
  React.HTMLAttributes<HTMLUListElement>
>(({ children, className, ...props }, ref) => {
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
ItemsList.displayName = "ItemsList";


interface ItemProps extends React.LiHTMLAttributes<HTMLLIElement> {
  value: any;
  handleClick?: (value: any) => void;
}

const CustomItem = React.forwardRef<HTMLLIElement, ItemProps>(
  ({ children, value, className, handleClick, ...props }, ref) => {
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
CustomItem.displayName = "CustomItem";

export { CustomItem, ItemsList };
