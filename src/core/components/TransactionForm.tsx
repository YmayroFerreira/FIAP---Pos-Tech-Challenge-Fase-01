"use client";

import { useStatement } from "@/context/StatementContext";
import { useCurrencyMask } from "@/hooks/useCurrencyMask";
import { useRef, useState, useEffect } from "react";
import { TransactionModel } from "../models";
import Input from "@/shared/components/input/Input";
import Button from "@/shared/components/button/Button";
import Select from "@/shared/components/select/Select";

<<<<<<< Updated upstream:src/core/components/TransactionForm.tsx
const transactionOptions = [
  {
    option: "Entrada",
    value: "Entry",
  },
  {
    option: "Saída",
    value: "Exit",
  },
];
=======
import type { Transaction, transactionType } from "@/context/StatementContext";

interface Props {
  editingTransaction?: Transaction;
  onCancel?: () => void;
  isModal?: boolean;
}
>>>>>>> Stashed changes:src/app/components/banking/TransactionForm.tsx

export default function TransactionForm({
  editingTransaction,
  onCancel,
  isModal = false,
}: TransactionModel) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { numericValue, setValue } = useCurrencyMask(inputRef);
  const { addTransaction, updateTransaction } = useStatement();

  const [transactionType, setTransactionType] = useState("");
  const [description, setDescription] = useState("");

  const isEditMode = !!editingTransaction;

  useEffect(() => {
    if (editingTransaction) {
      setTransactionType(editingTransaction.type);
      setDescription(editingTransaction.accountId);

      setTimeout(() => {
        setValue(editingTransaction.value);
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
      accountId: description,
      type: transactionType as transactionType,
      value: numericValue,
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
    ? "bg-white p-4 sm:p-6 rounded-lg shadow-lg"
    : "bg-white shadow-md p-4 sm:p-8 rounded-xl";

  return (
    <section className={containerClasses}>
      <div className="flex justify-between items-center mb-4 sm:mb-6">
        <h2 className="font-bold text-gray-800 text-xl sm:text-2xl">
          {isEditMode ? "Editar transação" : "Nova transação"}
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

<<<<<<< Updated upstream:src/core/components/TransactionForm.tsx
      <div className="space-y-4 sm:space-y-6">
        <div className="w-full">
          <Select
            className="w-full h-12 px-4 pr-10 text-gray-800 bg-gray-100 border border-bb-green rounded-md focus:outline-none focus:ring-2 focus:border-bb-green appearance-none cursor-pointer"
            name="typeOfTransaction"
            value={transactionType}
            onChange={(e) => setTransactionType(e.target.value)}
            required
            defaultTextOption="Selecione o tipo de transação"
            options={transactionOptions}
          />
=======
      <div className="space-y-6">
        <div className="flex gap-8">
          <div className="relative max-w-[355px] w-full">
            <select
              className="max-w-[355px] w-full h-12 px-4 pr-10 text-gray-800 bg-gray-100 border border-bb-green rounded-md focus:outline-none focus:ring-2 focus:border-bb-green appearance-none cursor-pointer"
              name="typeOfTransaction"
              value={transactionType}
              onChange={(e) => setTransactionType(e.target.value)}
              required
            >
              <option value="" disabled>
                Selecione o tipo de transação
              </option>
              <option value="Credit">Entrada</option>
              <option value="Debit">Saída</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <ChevronDownIcon className="h-5 w-5" />
            </div>
          </div>
>>>>>>> Stashed changes:src/app/components/banking/TransactionForm.tsx
        </div>

        <div className="flex flex-col sm:flex-row sm:gap-8 space-y-4 sm:space-y-0">
          <div className="flex-1 sm:max-w-[355px]">
            <Input
              type="text"
              className="w-full h-12 px-4 text-gray-900 bg-gray-100 border border-bb-green rounded-md focus:outline-none focus:ring-2 focus:border-bb-green"
              name="DescriptionOfTransaction"
              id="DescriptionOfTransactionId"
              placeholder="Conta de luz"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              label="Descrição"
            />
          </div>
          <div className="flex-1 sm:max-w-[355px]">
            <Input
              ref={inputRef}
              inputMode="decimal"
              type="text"
              className="w-full h-12 px-4 text-gray-900 bg-gray-100 border border-bb-green rounded-md focus:outline-none focus:ring-2 focus:border-bb-green"
              name="valueOfTransaction"
              id="valueOfTransactionId"
              placeholder="R$ 0,00"
              required
              label="Valor"
            />
          </div>
        </div>

        <div className="w-full">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 sm:max-w-[355px]">
            <div className="flex-1">
              <Button
                type="button"
                label={
                  isEditMode ? "Atualizar transação" : "Concluir transação"
                }
                onClick={handleSubmit}
                variant="primary"
              />
            </div>
            {isEditMode && onCancel && (
              <div className="flex-1">
                <Button
                  variant="secondary"
                  type="button"
                  onClick={onCancel}
                  label="Cancelar"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
