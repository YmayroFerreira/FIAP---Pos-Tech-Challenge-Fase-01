"use client";

import { useStatement } from "@/context/StatementContext";
import { useCurrencyMask } from "@/hooks/useCurrencyMask";
import { useRef, useState, useEffect } from "react";
import type { Transaction } from "@/context/StatementContext";

interface Props {
  editingTransaction?: Transaction;
  onCancel?: () => void;
  isModal?: boolean;
}

export default function TransactionForm({
  editingTransaction,
  onCancel,
  isModal = false,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { numericValue, setValue } = useCurrencyMask(inputRef);
  const { addTransaction, updateTransaction } = useStatement();

  const [transactionType, setTransactionType] = useState("");
  const [description, setDescription] = useState("");

  const isEditMode = !!editingTransaction;

  useEffect(() => {
    if (editingTransaction) {
      setTransactionType(editingTransaction.type);
      setDescription(editingTransaction.description);

      setTimeout(() => {
        setValue(editingTransaction.amount);
      }, 100);
    }
  }, [editingTransaction, setValue]);

  function handleSubmit() {
    const valueInput = inputRef.current;
    if (!valueInput) return;

    if (!transactionType || !numericValue || numericValue <= 0) {
      alert("Preencha todos os campos corretamente.");
      return;
    }

    if (!description.trim()) {
      alert("Por favor, adicione uma descrição para a transação.");
      return;
    }

    const transactionData = {
      type: transactionType as "Entry" | "Exit",
      amount: numericValue,
      description: description.trim(),
      date: editingTransaction?.date || new Date().toISOString().split("T")[0],
    };

    try {
      if (isEditMode && editingTransaction) {
        updateTransaction(editingTransaction.id, transactionData);
        alert("Transação atualizada com sucesso!");
        onCancel?.();
      } else {
        addTransaction(transactionData);
        alert("Transação adicionada com sucesso!");
      }

      if (!isEditMode) {
        resetForm();
      }
    } catch (error) {
      console.error("Error processing transaction:", error);
      alert("Erro ao processar transação. Tente novamente.");
    }
  }

  function resetForm() {
    setTransactionType("");
    setDescription("");
    setValue(0);
  }

  const containerClasses = isModal
    ? "bg-white p-6 rounded-lg shadow-lg"
    : "bg-white shadow-md p-8 rounded-xl";

  return (
    <section className={containerClasses}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-bold text-gray-800 text-2xl">
          {isEditMode ? "Editar Transação" : "Nova Transação"}
        </h2>
        {isModal && onCancel && (
          <button
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700 text-xl"
          >
            ✕
          </button>
        )}
      </div>

      <div className="space-y-6">
        <select
          className="max-w-[355px] h-12 px-4 text-gray-800 bg-gray-100 border border-bb-green rounded-md focus:outline-none focus:ring-2 focus:border-bb-green"
          name="typeOfTransaction"
          value={transactionType}
          onChange={(e) => setTransactionType(e.target.value)}
          required
        >
          <option value="" disabled>
            Selecione o tipo de transação
          </option>
          <option value="Entry">Entrada</option>
          <option value="Exit">Saída</option>
        </select>

        <div className="flex gap-8">
          <div className="flex flex-col gap-2">
            <label
              className="font-medium text-gray-700 text-sm"
              htmlFor="DescriptionOfTransactionId"
            >
              Descrição
            </label>
            <input
              type="text"
              className="max-w-[355px] h-12 px-4 text-gray-900 bg-gray-100 border border-bb-green rounded-md focus:outline-none focus:ring-2 focus:border-bb-green"
              name="DescriptionOfTransaction"
              id="DescriptionOfTransactionId"
              placeholder="Conta de luz"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label
              className="font-medium text-gray-700 text-sm"
              htmlFor="valueOfTransactionId"
            >
              Valor
            </label>
            <input
              ref={inputRef}
              inputMode="decimal"
              type="text"
              className="max-w-[355px] h-12 px-4 text-gray-900 bg-gray-100 border border-bb-green rounded-md focus:outline-none focus:ring-2 focus:border-bb-green"
              name="valueOfTransaction"
              id="valueOfTransactionId"
              placeholder="R$ 0,00"
              required
            />
          </div>
        </div>

        <div className="pt-4">
          <div className="flex gap-4 w-full">
            <button
              className="flex-1 max-w-sm h-12 bg-bb-green text-white font-semibold rounded-md hover:opacity-90 cursor-pointer duration-200 transition-opacity"
              type="button"
              onClick={handleSubmit}
            >
              {isEditMode ? "Atualizar transação" : "Concluir transação"}
            </button>

            {isEditMode && onCancel && (
              <button
                className="flex-1 max-w-sm h-12 bg-gray-500 text-white font-semibold rounded-md hover:opacity-90 cursor-pointer duration-200 transition-opacity"
                type="button"
                onClick={onCancel}
              >
                Cancelar
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
