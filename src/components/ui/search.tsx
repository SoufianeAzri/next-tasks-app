"use client";

import { cn } from "@/utils/helpers";
import React, { createContext, useContext, useState, FormEvent } from "react";

interface SearchBarContextType {
  query: string;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
}

const SearchBarContext = createContext<SearchBarContextType | undefined>(
  undefined
);

interface SearchBarProps {
  onSubmit?: (value: string) => void;
  children: React.ReactNode;
  className?: string;
}

const SearchBar = React.forwardRef<HTMLFormElement, SearchBarProps>(
  ({ onSubmit, children, className, ...props }, ref) => {
    const [query, setQuery] = useState("");

    const handleSubmit = (e: FormEvent) => {
      e.preventDefault();
      onSubmit?.(query);
    };

    return (
      <SearchBarContext.Provider value={{ query, setQuery }}>
        <form
          ref={ref}
          onSubmit={handleSubmit}
          className={cn(
            `h-[46px] flex gap-2 items-center search relative`,
            className
          )}
          {...props}
        >
          {children}
        </form>
      </SearchBarContext.Provider>
    );
  }
);

SearchBar.displayName = "SearchBar";

const useSearchBar = () => {
  const context = useContext(SearchBarContext);
  if (!context)
    throw new Error("SearchBar.* component must be used within <SearchBar>");
  return context;
};

interface SearchFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onSearch?: (value: string) => void;
}

// 🔍 Input Subcomponent
const SearchField = React.forwardRef<HTMLInputElement, SearchFieldProps>(
  ({ className, onSearch, placeholder, ...props }, ref) => {
    const { query, setQuery } = useSearchBar();
    return (
      <input
        ref={ref}
        type="text"
        value={query}
        onChange={(e) => {
          if(onSearch) onSearch(e.target.value);
          setQuery(e.target.value);
        }}
        placeholder={placeholder}
        className={cn(
          `w-full pr-5 pl-12 h-full focus:outline-none border border-solid border-gray-d9 rounded-[23px] text-[14px] bg-[#F0F0F0]`,
          className
        )}
        {...props}
      />
    );
  }
);

SearchField.displayName = "SearchField";

const SearchIcon = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("absolute  pl-12", className)} {...props} />
));
SearchIcon.displayName = "SearchIcon";

export { SearchBar, SearchField, SearchIcon };
