"use client";

import React, { useCallback } from "react";
import ButtonIcon from "@/shared/components/ui/button-icon/ButtonIcon";
import { useStatementStore } from "@/modules/statement/presentation/store/StatementUIStore";
import { FaSignOutAlt } from "react-icons/fa";
import { FaRegUser } from "react-icons/fa6";
import { useAuth } from "@/shared/hooks/useAuth";

const Header = React.memo(function Header() {
  const { accountInfo } = useStatementStore();
  const { logout } = useAuth();

  const handleDisconect = useCallback(() => {
    logout();
  }, [logout]);

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
            onClick={handleDisconect}
            icon={<FaSignOutAlt className="text-[20px] text-white" />}
          />
        </div>
      </div>
    </header>
  );
});

export default Header;
