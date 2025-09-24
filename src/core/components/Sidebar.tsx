"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { name: "Início", href: "/" },
  { name: "Transações", href: "/transactions" },
  { name: "homepage", href: "/homepage" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <nav
      className="bg-white text-text-bb-black rounded-lg shadow-md
                    /* Mobile: horizontal bar */
                    p-4 md:p-6
                    /* Desktop: vertical sidebar */
                    md:h-screen"
    >
      <ul
        className="
                    /* Mobile: horizontal layout */
                    flex justify-center space-x-4 md:space-x-0
                    /* Desktop: vertical layout */
                    md:flex-col md:space-y-2"
      >
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <li
              key={item.name}
              className={`
                        /* Mobile: no borders, compact */
                        md:border-b md:last:border-b-0 md:last:pb-0 
                        ${
                          isActive
                            ? "md:border-bb-light-green"
                            : "md:border-bb-black md:text-black"
                        }`}
            >
              <Link
                href={item.href}
                className={`block transition-colors duration-150 ease-in-out
                          /* Mobile: compact horizontal buttons */
                          py-2 px-3 rounded-md text-sm text-center
                          /* Desktop: full width vertical items */
                          md:py-3 md:px-4 md:text-base
                          ${
                            isActive
                              ? "text-bb-light-green font-semibold bg-bb-light-green/10"
                              : "hover:text-bb-light-green/80 hover:bg-bb-light-green/5"
                          }`}
              >
                {item.name}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
