"use client"

import { HoverPrefetchLink } from "@/components/ui";
import { cn } from "@/utils/helpers";
import { SidebarLink as SBL } from "@/utils/types";
import { usePathname } from "next/navigation";
import React from "react";

interface SidebarLinksProps {
  link: SBL;
}

export const SidebarLink = ({ link }: SidebarLinksProps) => {
  const location = usePathname();

  const isActive = location.split("/").pop() === link.name;


  return (
    <li className={cn("group/link w-full flex justify-start py-3 px-4 duration-300 ease-in-out hover:bg-primary-light r-10 overflow-hidden", isActive && "bg-primary-light")}>
      <HoverPrefetchLink
        styles="w-full flex flex-start items-center gap-2"
        href={link.path}
      >
        <div className={`${link.icon}`} />
        <p className={cn("text-main-gray text-sm font-semibold pt-0.5 group-hover/link:text-white group-hover/link:font-semibold", isActive && "text-white font-semibold")}>
          {link.title}
        </p>
      </HoverPrefetchLink>
    </li>
  );
};
