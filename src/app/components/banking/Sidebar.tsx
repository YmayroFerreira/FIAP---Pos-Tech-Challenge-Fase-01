"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

// Dados mockados para os links da sidebar
const navItems = [
  { name: "Início", href: "/" },
  { name: "Transferências", href: "/transactions" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <nav className="bg-white text-text-bb-black h-screen p-6 rounded-lg shadow-md">
      <ul className="space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <li
              key={item.name}
              className={`border-b last:border-b-0 last:pb-0 ${
                isActive ? "border-bb-light-green" : "border-bb-back"
              }`}
            >
              <Link
                href={item.href}
                className={`block py-3 px-4 rounded-md transition-colors duration-150 ease-in-out
                ${
                  isActive
                    ? "text-bb-light-green font-semibold text-center"
                    : "hover:text-bb-light-green/80 text-center"
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
