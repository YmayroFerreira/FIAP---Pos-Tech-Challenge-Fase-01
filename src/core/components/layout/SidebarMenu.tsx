"use client";

import { Bars3Icon, XMarkIcon } from "@heroicons/react/16/solid";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const menuItems = [
  { label: "Início", href: "/" },
  { label: "Transações", href: "/transactions" },
  { label: "HomePage", href: "/homepage" },
];

export default function SidebarMenu() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <nav className="w-full @container">
      <button
        onClick={() => setOpen(!open)}
        className="block @min-[426px]:hidden lg:hidden  p-2 mb-4 rounded absolute top-[26px] left-[10px]"
      >
        <Bars3Icon className="w-[32px] h-[32px] text-accent" />
      </button>

      <ul
        className={`
					${open ? "flex" : "hidden"}
					flex-col items-center
					bg-white
					absolute
					p-[30px]
					top-[0]
					left-[0]
					@min-[426px]:relative
					@min-[426px]:p-0
					@min-[426px]:bg-transparent
					@min-[426px]:flex
					@min-[426px]:flex-row
					@min-[426px]:items-start
					@min-[426px]:mb-[16px]
					lg:flex
					lg:relative
					lg:flex-column
					lg:p-0
				`}
      >
        <button onClick={() => setOpen(!open)}>
          <XMarkIcon className="w-[24px] h-[24px] text-primary @min-[426px]:hidden lg:hidden absolute top-[8px] right-[8px]" />
        </button>
        {menuItems.map((item, index) => {
          const isActive = pathname === item.href;
          const isLast = index === menuItems.length - 1;

          let classes =
            "text-md block transition-colors sm:absolute lg:relative @min-[426px]:w-[138px] lg:text-center py-[16px]";

          if (isActive) {
            classes +=
              " text-primary font-bold border-b-2 border-primary lg:border-b-2 ";
          } else {
            classes +=
              " text-primary font-regular hover:border-primary hover:text-primary lg:border-b lg:border-b-1";
            if (isLast) {
              classes += " @min-[1024px]:border-b lg:border-none";
            }
          }

          return (
            <li
              key={item.href}
              className="w-full text-center lg:text-left  @min-[426px]:m-0 "
            >
              <Link href={item.href} className={classes}>
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
