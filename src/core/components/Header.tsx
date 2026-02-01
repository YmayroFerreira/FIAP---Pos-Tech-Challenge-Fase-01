"use client";

import ButtonIcon from "@/shared/components/ui/button-icon/ButtonIcon";
import { useStatementStore } from "@/store/StatementStore";
import { FaSignOutAlt } from "react-icons/fa";
import { FaRegUser } from "react-icons/fa6";
import { useState } from "react";

export default function Header() {
  const { accountInfo } = useStatementStore();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  /**
   * Logout seguro via API
   * - Invalida o cookie HttpOnly no servidor
   * - NÃO usa localStorage
   */
  const handleDisconnect = async () => {
    if (isLoggingOut) return;
    
    setIsLoggingOut(true);
    
    try {
      // Chama API de logout para remover o cookie HttpOnly
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.error("Erro no logout:", error);
      }
    } finally {
      // Redireciona para a homepage independente do resultado
      const homepageUrl = process.env.NEXT_PUBLIC_HOMEPAGE_URL || "http://localhost:3001";
      window.location.href = `${homepageUrl}/homepage`;
    }
  };

  return (
    <header className="w-full h-[96px] bg-primary flex justify-center">
      <div className="w-full max-w-[1200px] flex justify-end items-center gap-[40px] p-[21px]">
        <span className="text-sm font-semibold text-white">
          {accountInfo?.name ?? "Usuario"}
        </span>
        <div className="flex gap-[8px]">
          <ButtonIcon
            className="border-accent"
            icon={<FaRegUser className="text-[20px] text-accent" />}
          />
          <ButtonIcon
            className="border-white"
            onClick={handleDisconnect}
            disabled={isLoggingOut}
            icon={<FaSignOutAlt className={`text-[20px] text-white ${isLoggingOut ? "opacity-50" : ""}`} />}
          />
        </div>
      </div>
    </header>
  );
}
