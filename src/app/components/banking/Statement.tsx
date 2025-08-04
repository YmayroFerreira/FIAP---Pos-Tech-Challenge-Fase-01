"use client";

import React, { useState, useEffect } from "react";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import { useStatement } from "@/context/StatementContext";
import TransactionForm from "./TransactionForm";
import type { Transaction } from "@/context/StatementContext";

interface Props {
  isPaginated?: boolean;
  itemsPerPage?: number;
  showLatest?: number;
}

export default function Statement({
  isPaginated = false,
  itemsPerPage = 10,
  showLatest,
}: Props) {
  const { transactions, deleteTransaction } = useStatement();
  const [page, setPage] = useState(1);
  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatMonth = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      month: "long",
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(amount);
  };

  const handleDelete = (id: string) => {
    const isConfirmed = confirm("Tem certeza que deseja excluir este item?");
    if (isConfirmed) {
      deleteTransaction(id);
    }
  };

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
  };

  const handleCancelEdit = () => {
    setEditingTransaction(null);
  };

  const sortedTransactions = [...transactions].sort((a, b) => {
    return parseInt(b.id) - parseInt(a.id);
  });

  const filteredTransactions = showLatest
    ? sortedTransactions.slice(0, showLatest)
    : sortedTransactions;

  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);

  useEffect(() => {
    if (isPaginated && totalPages > 0 && page > totalPages) {
      setPage(totalPages);
    }
  }, [totalPages, page, isPaginated]);

  const displayTransactions = isPaginated
    ? filteredTransactions.slice((page - 1) * itemsPerPage, page * itemsPerPage)
    : filteredTransactions;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-bb-black">Extrato</h2>
        {!isPaginated && (
          <Link
            href="/transactions"
            className="text-sm text-bb-green underline"
          >
            Ver todos
          </Link>
        )}
      </div>

      {displayTransactions.length === 0 ? (
        <p className="text-gray-600 text-center py-4">
          Nenhuma transação encontrada.
        </p>
      ) : (
        <div className="space-y-4">
          {displayTransactions.map((transaction) => (
            <div
              key={transaction.id}
              className="flex justify-between items-start text-sm border-b border-bb-light-green pb-3 last:border-b-0 last:pb-0"
            >
              <div className="flex-1 pr-2">
                <p className="text-xs text-bb-light-green capitalize mb-0.8 font-semibold">
                  {formatMonth(transaction.date)}
                </p>
                <div className="flex justify-between items-center">
                  <p className="text-bb-black">{transaction.description}</p>
                  <div className="text-right flex-shrink-0">
                    <p className="text-bb-light-grey mt-0.5">
                      {formatDate(transaction.date)}
                    </p>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <p
                    className={`justify-start font-semibold ${
                      transaction.type === "Entry"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {transaction.type === "Entry" ? "+" : "-"}{" "}
                    {formatCurrency(transaction.amount)}
                  </p>
                  <div className="flex justify-end space-x-2">
                    <div
                      className="w-8 h-8 bg-bb-green rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-300 transition-colors"
                      onClick={() => handleEdit(transaction)}
                    >
                      <PencilIcon className="size-5 text-bb-white" />
                    </div>
                    <div
                      className="w-8 h-8 bg-bb-green rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-300 transition-colors"
                      onClick={() => handleDelete(transaction.id)}
                    >
                      <TrashIcon className="size-5 text-bb-white" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {isPaginated && totalPages > 1 && (
            <div className="flex justify-center items-center pt-4 space-x-4">
              <button
                disabled={page === 1}
                onClick={() => setPage((prev) => prev - 1)}
                className="text-bb-green disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Anterior
              </button>
              <span className="text-sm text-gray-700">
                Página {page} de {totalPages}
              </span>
              <button
                disabled={page === totalPages}
                onClick={() => setPage((prev) => prev + 1)}
                className="text-bb-green disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Próxima
              </button>
            </div>
          )}
        </div>
      )}

      {/* Edit Modal */}
      {editingTransaction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="max-w-2xl w-full mx-4">
            <TransactionForm
              editingTransaction={editingTransaction}
              onCancel={handleCancelEdit}
              isModal={true}
            />
          </div>
        </div>
      )}
    </div>
  );
}
