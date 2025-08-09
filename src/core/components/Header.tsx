"use client";

import Image from "next/image";
import { useStatement } from "@/context/StatementContext";

export default function Header() {
  const { userInfo } = useStatement();

  return (
    <div className="bg-gradient-bb text-white p-4 flex justify-end items-center gap-3">
      <span>{userInfo.name}</span>
      <Image
        className="pr-3"
        src="/user-icon.svg"
        alt="User Icon"
        width={40}
        height={40}
        priority
      />
    </div>
  );
}
