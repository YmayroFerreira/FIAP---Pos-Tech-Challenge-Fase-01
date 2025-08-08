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
      <div className="flex flex-col md:grid md:grid-cols-7 gap-6 p-4">
        <div className="col-span-full md:col-span-4">
          <p className="font-semibold mb-2">Olá, {userInfo.name}! :)</p>
          <p className="text-sm text-base capitalize">
            {currentDate || "Carregando..."}
          </p>
        </div>

        <div className="col-start-5 row-start-2">
          <div className="flex items-baseline gap-3 mb-1">
            <p className="text-lg font-semibold">Saldo</p>
            <BalanceIcon
              className="size-4 text-bb-red cursor-pointer hover:opacity-80 transition-opacity text-center"
              onClick={toggleVisibility}
            />
          </div>
          <div className="w-33 h-px bg-bb-red mb-2"></div>
          <p className="text-sm text-base mb-2 whitespace-nowrap">
            {userInfo.accountType}
          </p>

          <div className="text-right">
            {showBalance ? (
              <p className="text-2xl font-semibold">
                {formatCurrency(currentBalance)}
              </p>
            ) : (
              <p className="text-2xl font-semibold">••••••••••</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
