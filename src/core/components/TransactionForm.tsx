"use client";

import { useCurrencyMask } from "@/hooks/useCurrencyMask";
import { useRef, useState, useEffect } from "react";
import { TransactionModel } from "../models";
import Input from "@/shared/components/input/Input";
import Button from "@/shared/components/button/Button";
import Select from "@/shared/components/select/Select";
import type { transactionType } from "@/store/StatementStore";
import FileUpload from "@/shared/components/fileUpload/FileUpload";
import Paragraph from "@/shared/components/paragraph/Paragraph";
import { useStatementStore } from "@/store/StatementStore";

const transactionOptions = [
  {
    option: "Entrada",
    value: "Credit",
  },
  {
    option: "Saída",
    value: "Debit",
  },
];

const categories = [
  "Alimentação",
  "Transporte",
  "Educação",
  "Saúde",
  "Lazer",
  "Moradia",
  "Serviços",
  "Salário",
  "Investimentos",
  "Outros",
];

export default function TransactionForm({
  editingTransaction,
  onCancel,
  isModal = false,
}: TransactionModel) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { numericValue, setValue } = useCurrencyMask(inputRef);
  const { addTransaction, updateTransaction } = useStatementStore();
  const [valueError, setValueError] = useState("");
  const [transactionType, setTransactionType] = useState("");
  const [category, setCategory] = useState("");
  const [filteredCategories, setFilteredCategories] = useState<string[]>([]);
  const [description, setDescription] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);

  const isEditMode = !!editingTransaction;

  useEffect(() => {
    if (editingTransaction) {
      setTransactionType(editingTransaction.type);
      setDescription(editingTransaction.description);
      setCategory(editingTransaction.category);

      setTimeout(() => {
        setValue(editingTransaction.value);
      }, 100);
    }
  }, [editingTransaction, setValue]);

  function handleSubmit() {
    const valueInput = inputRef.current;
    if (!valueInput) return;

    if (!transactionType || !numericValue || numericValue <= 0 || valueError) {
      alert("Preencha todos os campos corretamente.");
      return;
    }

    if (!description.trim()) {
      alert("Por favor, adicione uma descrição para a transação.");
      return;
    }

    const attachmentUrls = attachments.map((file) => URL.createObjectURL(file));

    const transactionData = {
      id: crypto.randomUUID(),
      type: transactionType as transactionType,
      value: numericValue,
      description,
      category,
      date: editingTransaction?.date || new Date().toISOString().split("T")[0],
      attachments: attachmentUrls,
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
    setCategory("");
    setValue(0);
  }

  function handleCategoryChange(value: string) {
    setCategory(value);

    if (value.length > 0) {
      const matches = categories.filter((cat) =>
        cat.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredCategories(matches);
    } else {
      setFilteredCategories([]);
    }
  }

  function handleSelectCategory(cat: string) {
    setCategory(cat);
    setFilteredCategories([]);
  }

  const handleValidate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/[^\d,.-]/g, "").replace(",", ".");
    const numeric = parseFloat(rawValue);

    if (isNaN(numeric) || numeric <= 0) {
      setValueError("Digite um valor válido maior que zero.");
      setValue(0);
      return;
    }

    setValueError("");
  };

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
        </div>

        <div className="flex flex-col sm:flex-row sm:gap-8 space-y-4 sm:space-y-0">
          <div className="flex-1 w-[355px] sm:w-[155px]">
            <Input
              type="text"
              className="w-full h-12 px-4 text-gray-900 bg-gray-100 border border-bb-green rounded-md focus:outline-none focus:ring-2 focus:border-bb-green"
              name="CategoryOfTransaction"
              id="CategoryOfTransactionId"
              placeholder="Ex: Transporte"
              value={category ?? ""}
              onChange={(e) => handleCategoryChange(e.target.value)}
              required
              label="Categoria"
            />
            {filteredCategories.length > 0 && (
              <ul className="flex flex-row left-0 right-0 mt-1 gap-3">
                {filteredCategories.map((cat) => (
                  <li
                    key={cat}
                    onClick={() => handleSelectCategory(cat)}
                    className="px-3 py-0.5 cursor-pointer text-bb-green bg-white border border-gray-200 rounded-md shadow-md z-10 hover:bg-gray-100"
                  >
                    {cat}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="flex-1 w-[355px] sm:w-[155px]">
            <Input
              type="text"
              className="w-full h-12 px-4 text-gray-900 bg-gray-100 border border-bb-green rounded-md focus:outline-none focus:ring-2 focus:border-bb-green"
              name="DescriptionOfTransaction"
              id="DescriptionOfTransactionId"
              placeholder="Ex: Jantar em família"
              value={description ?? ""}
              onChange={(e) => setDescription(e.target.value)}
              label="Descrição"
            />
          </div>
          <div className="flex-1 w-[355px] sm:w-[155px]">
            <Input
              ref={inputRef}
              inputMode="decimal"
              type="text"
              className={`w-full h-12 px-4 text-gray-900 bg-gray-100 border ${
                valueError ? "border-red-500" : "border-bb-green"
              } rounded-md focus:outline-none focus:ring-2 focus:border-bb-green`}
              name="valueOfTransaction"
              id="valueOfTransactionId"
              required
              label="Valor"
              placeholder="R$ 0,00"
              min="0,01"
              step="0,01"
              onBlur={handleValidate}
            />
            {valueError && (
              <p className="text-red-500 text-sm mt-1">{valueError}</p>
            )}
          </div>
        </div>

        <div>
          <Paragraph
            label="Quer incluir um comprovante?"
            className="font-medium text-gray-700 text-sm"
          />
          <FileUpload onFiles={setAttachments} />
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
