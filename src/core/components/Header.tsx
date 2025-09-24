"use client";

import Image from "next/image";
import { useStatementStore } from "@/store/StatementStore";
// import { useEffect } from "react";

export default function Header() {
  const { userInfo } = useStatementStore();

  return (
    <div className="bg-gradient-bb text-white p-4 flex justify-end items-center gap-3">
      <span>{userInfo?.username}</span>
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
