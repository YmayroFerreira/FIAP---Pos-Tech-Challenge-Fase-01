"use client";

import React, { useState, useEffect } from "react";
import {
  PencilIcon,
  TrashIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/solid";
import Link from "next/link";
import TransactionForm from "./TransactionForm";
import type { Transaction } from "@/store/StatementStore";
import { StatementModel } from "../models";
import Button from "@/shared/components/button/Button";
import Paragraph from "@/shared/components/paragraph/Paragraph";
import { useStatementStore } from "@/store/StatementStore";

export default function Statement({
  isPaginated = false,
  itemsPerPage = 10,
  showLatest,
}: StatementModel) {
  const { transactions, loading, error } = useStatementStore();
  const [page, setPage] = useState(1);
  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [advancedFilters, setAdvancedFilters] = useState({
    type: "",
    startDate: "",
    endDate: "",
  });

  const handleRemoveFilter = (filterKey: keyof typeof advancedFilters) => {
    setAdvancedFilters((prev) => ({ ...prev, [filterKey]: "" }));
  };

  const handleClearAllFilters = () => {
    setSearchQuery("");
    setAdvancedFilters({
      type: "",
      startDate: "",
      endDate: "",
    });
  };

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

  const formatTransactionStyle = (type: "Credit" | "Debit") => {
    return type === "Credit" ? "text-green-600" : "text-red-600";
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
      // deleteTransaction(id);
      console.log(`Deletando transação com o ID: ${id}`);
    }
  };

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
  };

  const handleCancelEdit = () => {
    setEditingTransaction(null);
  };

  const sortedTransactions = [...transactions].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  const filteredTransactions = sortedTransactions.filter((transaction) => {
    // Aplica filtros apenas na visualização paginada
    if (isPaginated) {
      // Filtro de pesquisa rápida por descrição
      if (
        searchQuery &&
        !transaction.id.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }

      // Filtros avançados
      if (advancedFilters.type && transaction.type !== advancedFilters.type) {
        return false;
      }
      const transactionDate = transaction.date.split("T")[0];
      if (
        advancedFilters.startDate &&
        transactionDate < advancedFilters.startDate
      ) {
        return false;
      }
      if (
        advancedFilters.endDate &&
        transactionDate > advancedFilters.endDate
      ) {
        return false;
      }
    }
    return true;
  });

  const finalTransactions = showLatest
    ? filteredTransactions.slice(0, showLatest)
    : filteredTransactions;

  const totalPages = Math.ceil(finalTransactions.length / itemsPerPage);

  useEffect(() => {
    if (isPaginated && totalPages > 0 && page > totalPages) {
      setPage(totalPages);
    }
  }, [totalPages, page, isPaginated]);

  const displayTransactions = isPaginated
    ? finalTransactions.slice((page - 1) * itemsPerPage, page * itemsPerPage)
    : finalTransactions;
  if (loading) {
    return (
      <p className="text-gray-600 text-center py-4">Carregando transações...</p>
    );
  }

  if (error) {
    return (
      <p className="text-red-600 text-center py-4">
        Erro ao carregar transações: {error}
      </p>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-bb-black">
          {isPaginated ? "Transações" : "Extrato"}
        </h2>
        {!isPaginated && (
          <Link
            href="/transactions"
            className="text-sm text-bb-green underline"
          >
            Ver todos
          </Link>
        )}
      </div>

      {isPaginated && (
        <>
          <div className="flex items-center mb-4 gap-4">
            <input
              type="text"
              placeholder="Pesquisar por descrição..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-grow h-10 px-4 text-gray-900 bg-gray-100 border border-bb-green rounded-md focus:outline-none focus:ring-2 focus:border-bb-green"
            />
            <button
              onClick={() => setShowAdvancedSearch(true)}
              className="h-10 px-4 bg-bb-green text-white font-semibold rounded-md hover:opacity-90 transition-opacity flex items-center gap-2"
            >
              <MagnifyingGlassIcon className="size-5" /> Pesquisa Avançada
            </button>
          </div>

          {/* Disclaimers for active filters */}
          <div className="flex items-center flex-wrap gap-2 mb-4 min-h-[26px]">
            {searchQuery && (
              <span className="flex items-center bg-gray-200 text-gray-800 text-xs font-semibold px-2.5 py-1 rounded-full">
                Busca: &quot;{searchQuery}&quot;
                <button
                  onClick={() => setSearchQuery("")}
                  className="ml-2 text-gray-500 hover:text-gray-900 font-bold"
                >
                  &times;
                </button>
              </span>
            )}
            {advancedFilters.type && (
              <span className="flex items-center bg-gray-200 text-gray-800 text-xs font-semibold px-2.5 py-1 rounded-full">
                Tipo: {advancedFilters.type === "Credit" ? "Entrada" : "Saída"}
                <button
                  onClick={() => handleRemoveFilter("type")}
                  className="ml-2 text-gray-500 hover:text-gray-900 font-bold"
                >
                  &times;
                </button>
              </span>
            )}
            {advancedFilters.startDate && (
              <span className="flex items-center bg-gray-200 text-gray-800 text-xs font-semibold px-2.5 py-1 rounded-full">
                De: {formatDate(advancedFilters.startDate)}
                <button
                  onClick={() => handleRemoveFilter("startDate")}
                  className="ml-2 text-gray-500 hover:text-gray-900 font-bold"
                >
                  &times;
                </button>
              </span>
            )}
            {advancedFilters.endDate && (
              <span className="flex items-center bg-gray-200 text-gray-800 text-xs font-semibold px-2.5 py-1 rounded-full">
                Até: {formatDate(advancedFilters.endDate)}
                <button
                  onClick={() => handleRemoveFilter("endDate")}
                  className="ml-2 text-gray-500 hover:text-gray-900 font-bold"
                >
                  &times;
                </button>
              </span>
            )}
            {(searchQuery || Object.values(advancedFilters).some((v) => v)) && (
              <button
                onClick={handleClearAllFilters}
                className="text-xs text-bb-red underline hover:no-underline ml-2 font-semibold"
              >
                Limpar Filtros
              </button>
            )}
          </div>
        </>
      )}
      {displayTransactions.length === 0 ? (
        <Paragraph
          label="Nenhuma transação encontrada."
          className="text-gray-600 text-center py-4"
        />
      ) : (
        <div className="space-y-4">
          {displayTransactions.map((transaction) => (
            <div
              key={transaction.id}
              className="flex justify-between items-start text-sm border-b border-bb-light-green pb-3 last:border-b-0 last:pb-0"
            >
              <div className="flex-1 pr-2">
                <Paragraph
                  label={`${formatMonth(transaction.date)}`}
                  className="text-xs text-bb-light-green capitalize mb-0.8 font-semibold"
                />
                <div className="flex justify-between items-center">
                  <p className="text-bb-black">{transaction.category}</p>
                  <div className="text-right flex-shrink-0">
                    <Paragraph
                      label={`${formatDate(transaction.date)}`}
                      className="text-bb-light-grey mt-0.5"
                    />
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <Paragraph
                    label={`${transaction.type === "Credit" ? "+" : "-"}${" "}
                    ${formatCurrency(transaction.value)}`}
                    className={`justify-start font-semibold ${
                      isPaginated
                        ? formatTransactionStyle(transaction.type)
                        : ""
                    }`}
                  ></Paragraph>
                  {isPaginated && (
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
                  )}
                </div>
              </div>
            </div>
          ))}

          {isPaginated && totalPages > 1 && (
            <div className="flex justify-center items-center pt-4 space-x-4">
              <Button
                disabled={page === 1}
                onClick={() => setPage((prev) => prev - 1)}
                className="text-bb-green disabled:opacity-50 disabled:cursor-not-allowed"
                label="Anterior"
                variant="tertiary"
              />
              <Paragraph
                className="text-sm text-gray-700"
                label={`Página ${page} de ${totalPages}`}
              />
              <Button
                disabled={page === totalPages}
                onClick={() => setPage((prev) => prev + 1)}
                className="text-bb-green disabled:opacity-50 disabled:cursor-not-allowed"
                label="Próxima"
                variant="tertiary"
              />
            </div>
          )}
        </div>
      )}

      {/* Edit Modal */}
      {editingTransaction && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="max-w-2xl w-full mx-4">
            <TransactionForm
              editingTransaction={editingTransaction}
              onCancel={handleCancelEdit}
              isModal={true}
            />
          </div>
        </div>
      )}

      {/* Advanced Search Modal */}
      {showAdvancedSearch && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md mx-4">
            <h3 className="text-lg font-bold mb-4">Pesquisa Avançada</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Tipo de Transação
                </label>
                <select
                  value={advancedFilters.type}
                  onChange={(e) =>
                    setAdvancedFilters({
                      ...advancedFilters,
                      type: e.target.value,
                    })
                  }
                  className="mt-1 block w-full h-10 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-bb-green focus:border-bb-green"
                >
                  <option value="">Todos</option>
                  <option value="Credit">Entrada</option>
                  <option value="Debit">Saída</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Data de Início
                </label>
                <input
                  type="date"
                  value={advancedFilters.startDate}
                  onChange={(e) =>
                    setAdvancedFilters({
                      ...advancedFilters,
                      startDate: e.target.value,
                    })
                  }
                  className="mt-1 block w-full h-10 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-bb-green focus:border-bb-green"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Data de Fim
                </label>
                <input
                  type="date"
                  value={advancedFilters.endDate}
                  onChange={(e) =>
                    setAdvancedFilters({
                      ...advancedFilters,
                      endDate: e.target.value,
                    })
                  }
                  className="mt-1 block w-full h-10 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-bb-green focus:border-bb-green"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowAdvancedSearch(false)}
                className="px-4 py-2 bg-bb-green text-white rounded-md hover:opacity-90"
              >
                Aplicar Filtros
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
