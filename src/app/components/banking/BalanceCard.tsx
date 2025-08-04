"use client";

import { useState, useEffect } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import { useStatement } from "@/context/StatementContext";

export default function BalanceCard() {
  const { userInfo, currentBalance } = useStatement();
  const [showBalance, setShowBalance] = useState(true);
  const [currentDate, setCurrentDate] = useState<string>("");

  const toggleVisibility = () => {
    setShowBalance(!showBalance);
  };

  const BalanceIcon = showBalance ? EyeSlashIcon : EyeIcon;

  useEffect(() => {
    const now = new Date();
    const formattedDate = now.toLocaleDateString("pt-BR", {
      weekday: "long",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
    setCurrentDate(formattedDate);
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(amount);
  };

  return (
    <div className="bg-gradient-bb text-white p-6 w-full text-2xl rounded-lg">
      <div className="flex flex-col items-start mb-6">
        <p className="font-bold mb-2">Olá, {userInfo.name}! :)</p>
        <p className="text-base capitalize">{currentDate || "Carregando..."}</p>
      </div>

      <div className="flex flex-col items-end">
        <div className="flex items-center gap-2 mb-1">
          <p className="text-lg">Saldo</p>
          <BalanceIcon
            className="size-6 text-bb-red cursor-pointer hover:opacity-80 transition-opacity"
            onClick={toggleVisibility}
          />
        </div>

        <p className="text-base mb-2">{userInfo.accountType}</p>

        <div className="text-right">
          {showBalance ? (
            <p className="text-2xl font-bold">
              {formatCurrency(currentBalance)}
            </p>
          ) : (
            <p className="text-2xl font-bold">••••••••••</p>
          )}
        </div>
      </div>
    </div>
  );
}
