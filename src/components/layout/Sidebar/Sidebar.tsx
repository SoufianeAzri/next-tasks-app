"use client";

import React, { useState } from "react";
import { SidebarLink } from "./SidebarLink";
import { sidebarLinks } from "@/utils/content/links";

export const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div
      className="lg:block w-[22%] min-w-[275px] max-w-[285px] h-screen min-h-[100vh] p-1 absolute lg:sticky z-10 top-0 left-0 transition-all"
      style={{
        left: isOpen ? "0px" : "-275px",
      }}
    >
      <div className="bg-primary h-full w-full rounded-[18px] px-2">
        <div className="h-full pt-8 pb-4 flex justify-between flex-col">
          <div className="h-[5%] flex justify-start px-6">
            <h2 className="text-white text-2xl font-semibold">Test</h2>
          </div>
          <div className="px-4 h-[65%] overflow-auto links-container">
            <ul className="flex flex-col">
              {sidebarLinks.map((link) => (
                <SidebarLink key={link.id} link={link} />
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div
        className="lg:hidden cursor-pointer bg-gray-f1 flex justify-center r-10 items-center -z-10 w-8 h-8 border border-main-gray absolute -right-4 top-9 transition"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div
          className={`arrow ${
            !isOpen ? "-rotate-90" : "-rotate-260"
          } translate-x-1`}
        />
      </div>
    </div>
  );
};
