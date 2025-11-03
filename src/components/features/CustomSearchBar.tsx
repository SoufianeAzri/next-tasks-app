"use client";

import React from "react";
import { SearchBar, SearchField, SearchIcon } from "../ui/search";

export const CustomSearchBar = ({
  handleSearch,
  placeholder,
}: {
  handleSearch?: (value: string) => void;
  placeholder?: string;
}) => {
  return (
    <SearchBar className="lg:w-[300px] w-[calc(100%-190px)]">
      <SearchIcon className="search" />
      <SearchField onSearch={handleSearch} placeholder={placeholder} />
    </SearchBar>
  );
};
