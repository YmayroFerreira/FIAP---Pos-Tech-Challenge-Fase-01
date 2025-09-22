"use client";

import { useState } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import { useStatement } from "@/context/StatementContext";

export default function BalanceCard() {
  const { userInfo, currentBalance, loading, error } = useStatement();
  const [showBalance, setShowBalance] = useState(true);

  const toggleVisibility = () => {
    setShowBalance(!showBalance);
  };

  const BalanceIcon = showBalance ? EyeSlashIcon : EyeIcon;

  const formatCurrency = (amount: number) => {
    const isNegative = amount < 0;
    const absoluteAmount = Math.abs(amount);

    const formatted = new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(absoluteAmount);

    return isNegative ? `-${formatted}` : formatted;
  };

  const getFormattedDate = () => {
    return new Date().toLocaleDateString("pt-BR", {
      weekday: "long",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="bg-gradient-bb text-white p-6 w-full text-2xl rounded-lg animate-pulse">
        <div className="flex flex-col md:flex-row md:justify-between gap-6 p-4">
          <div>
            <div className="h-8 bg-white/30 rounded w-48 mb-2"></div>
            <div className="h-5 bg-white/30 rounded w-64"></div>
          </div>
          <div className="md:text-right">
            <div className="h-7 bg-white/30 rounded w-24 mb-1 ml-auto"></div>
            <div className="w-32 h-px bg-bb-red mb-2 ml-auto"></div>
            <div className="h-5 bg-white/30 rounded w-40 mb-2 ml-auto"></div>
            <div className="h-8 bg-white/30 rounded w-32 ml-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !userInfo) {
    return (
      <div className="bg-red-200 text-red-800 p-6 w-full text-lg rounded-lg">
        <p>Não foi possível carregar as informações do saldo. Tente novamente mais tarde.</p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-bb text-white p-6 w-full text-2xl rounded-lg">
      <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-6 p-4">
        <div>
          <p className="font-semibold mb-2">Olá, {userInfo.username}! :)</p>
          <a href="/store" className="text-white underline hover:opacity-80">Visitar Loja</a>
          <a href="/homepage" className="text-white underline hover:opacity-80">HomePage</a>
          <p className="text-sm text-base capitalize">{getFormattedDate()}</p>
        </div>

        <div className="md:text-right">
          <div className="flex items-baseline md:justify-end gap-3 mb-1">
            <p className="text-lg font-semibold">Saldo</p>
            <BalanceIcon
              className="size-4 text-bb-red cursor-pointer hover:opacity-80 transition-opacity"
              onClick={toggleVisibility}
            />
          </div>
          <div className="w-32 h-px bg-bb-red mb-2 md:ml-auto"></div>
          <p className="text-sm text-base mb-2 whitespace-nowrap">{userInfo.email}</p>

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
  );
}
