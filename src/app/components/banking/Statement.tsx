"use client";

import React from "react";
import { mockTransactions } from "../../../../utils/mockData";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/solid";

export default function Statement() {
  const formatDate = (dateString: string) => {
    const options = {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    } as const;
    return new Date(dateString).toLocaleDateString("pt-BR", options);
  };

  const formatMonth = (dateString: string) => {
    const options = { month: "long" } as const;
    return new Date(dateString).toLocaleDateString("pt-BR", options);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <div className="bg-white rounded-lg shadow-md w-full max-w-sm">
      {" "}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-bb-black">Extrato</h2>
        <div className="flex space-x-2">
          <div className="w-8 h-8 bg-bb-green rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-300 transition-colors">
            <PencilIcon className="size-5 text-bb-white" />
          </div>
          <div className="w-8 h-8 bg-bb-green rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-300 transition-colors">
            <TrashIcon className="size-5 text-bb-white" />
          </div>
        </div>
      </div>
      {mockTransactions.length === 0 ? (
        <p className="text-gray-600 text-center py-4">
          Nenhuma transação encontrada.
        </p>
      ) : (
        <div className="space-y-4">
          {mockTransactions.map((transaction) => (
            <div
              key={transaction.id}
              className="flex justify-between items-start text-sm border-b border-bb-light-green pb-3 last:border-b-0 last:pb-0"
            >
              <div className="flex-1 pr-2">
                {/* Mês */}
                <p className="text-xs text-bb-light-green capitalize mb-0.8 font-semibold">
                  {formatMonth(transaction.date)}
                </p>
                <div className="flex justify-between items-center">
                  {/* Descrição */}
                  <p className="text-bb-black">{transaction.description}</p>
                  <div className="text-right flex-shrink-0">
                    {/* Data */}
                    <p className="text-bb-light-grey mt-0.5">
                      {formatDate(transaction.date)}
                    </p>
                  </div>
                </div>
                {/* Valor */}
                <p className="font-semibold text-bb-black">
                  {formatCurrency(transaction.amount)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
