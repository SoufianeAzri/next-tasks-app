"use client";

import Link from "next/link";
import { useState } from "react";

export function HoverPrefetchLink({
  href,
  children,
  styles,
}: {
  href: string;
  children: React.ReactNode;
  styles: string | "";
}) {
  const [active, setActive] = useState(false);

  return (
    <Link
      href={href}
      prefetch={active ? null : false}
      onMouseEnter={() => setActive(true)}
      className={styles}
      target="_blank"
    >
      {children}
    </Link>
  );
}
