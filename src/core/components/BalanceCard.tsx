"use client";

import { useState, useEffect } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import { useStatement } from "@/context/StatementContext";
import Paragraph from "@/shared/components/paragraph/Paragraph";

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
    const isNegative = amount < 0;
    const absoluteAmount = Math.abs(amount);

    const formatted = new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(absoluteAmount);

    return isNegative ? `-${formatted}` : formatted;
  };

  return (
    <div className="bg-gradient-bb text-white p-6 w-full text-2xl rounded-lg">
      <div className="flex flex-col md:grid md:grid-cols-7 gap-6 p-4">
        <div className="col-span-full md:col-span-4">
          <Paragraph
            label={`Olá, ${userInfo.name}! :)`}
            className="font-semibold mb-2"
          />
          <Paragraph
            label={`${currentDate || "Carregando..."}`}
            className="text-sm capitalize"
          />
        </div>

        <div className="col-start-6 row-start-2">
          <div className="flex items-baseline gap-3 mb-1">
            <Paragraph label="Saldo" className="text-lg font-semibold" />
            <BalanceIcon
              className="size-4 text-bb-red cursor-pointer hover:opacity-80 transition-opacity text-center"
              onClick={toggleVisibility}
            />
          </div>
          <div className="w-33 h-px bg-bb-red mb-2"></div>
          <Paragraph
            label={`${userInfo.accountType}`}
            className="text-sm mb-2 whitespace-nowrap"
          />

          <div className="text-right">
            {showBalance ? (
              <Paragraph
                label={`${formatCurrency(currentBalance)}`}
                className="text-2xl font-semibold whitespace-nowrap"
              />
            ) : (
              <Paragraph
                label="••••••••••"
                className="text-2xl font-semibold"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
