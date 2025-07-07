"use client";

import { useState } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";

export default function BalanceCard() {
  const [showBalance, setShowBalance] = useState(false);
  const currentBalance = "2.500,00";
  const toogleVisibility = () => {
    setShowBalance(!showBalance);
  };
  return (
    <div className="bg-gradient-bb text-white p-4 w-full md:w-3/4 lg:w-1/2 min-h-100 text-2xl rounded-lg">
      <div className="flex flex-col items-start">
        <p className="font-bold mb-4">Olá, Username ! :)</p>
        <p className="text-base">Quinta-feira, 08/07/2025</p>
      </div>
      <div className="flex flex-col items-end">
        <p>
          Saldo
          {showBalance ? (
            <EyeIcon
              className="size-6 text-bb-red"
              onClick={toogleVisibility}
            />
          ) : (
            <EyeSlashIcon
              className="size-6 text-bb-red"
              onClick={toogleVisibility}
            />
          )}
        </p>
        <p>Conta Corrente</p>
        {showBalance ? <p>**********</p> : <p>{currentBalance}</p>}
      </div>
    </div>
  );
}
