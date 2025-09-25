"use client";

import { useStatement } from "@/context/StatementContext";
import { useCurrencyMask } from "@/hooks/useCurrencyMask";
import { useRef, useState, useEffect } from "react";
import { TransactionModel } from "../models";
import Input from "@/shared/components/input/Input";
import Button from "@/shared/components/button/Button";

import type { transactionType } from "@/context/StatementContext";
import { ChevronDownIcon } from '@heroicons/react/16/solid';

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

  const containerClasses = "bg-neutral-grey2 rounded-default flex flex-col bg-custom-pixel2";

  return (
    <section className={containerClasses}>
      <div className="p-[24px]">
				<form
					onSubmit={handleSubmit}
					className="flex items-center flex-col sm:items-start"
				>
          <div className="w-full flex justify-between items-center relative">

            <h2 className="font-semibold text-xl text-primary mb-[32px]">
              {isEditMode ? "Editar transação" : "Nova transação"}
            </h2>
            {isModal && onCancel && (
            <button
              onClick={onCancel}
              className="text-gray-500 hover:text-gray-700 text-xl absolute top-0 right-0 hover:cursor-pointer"
            >
              ✕
            </button>
          )}
          </div>

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

          <div className="flex w-full flex-col sm:flex-row sm:gap-8 space-y-4 sm:space-y-0">
          <div className="sm:max-w-[355px] md:w-[250px] lg:w-[250px] mt-[32px]">
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
          <div className="w-full sm:max-w-[355px] md:w-[250px] lg:w-[250px] mt-[32px] ">
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

        <div className="w-full mt-[32px]">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 sm:max-w-[355px]">
            <div>
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
              <div>
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

        <div className="h-[264px] sm:h-[169px]"></div>
					
				</form>
			</div>
    </section>
  );
}
