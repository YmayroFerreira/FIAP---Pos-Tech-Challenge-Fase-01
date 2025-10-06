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
import { message } from "@/shared/components/ui/message/message";

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
  const [attachments, setAttachments] = useState<string[]>([]);

  const isEditMode = !!editingTransaction;

  useEffect(() => {
    if (editingTransaction) {
      setTransactionType(editingTransaction.type);
      setDescription(editingTransaction.description);
      setCategory(editingTransaction.category);
      setAttachments(
        Array.isArray(editingTransaction.anexo)
          ? editingTransaction.anexo
          : [editingTransaction.anexo]
      );

      setTimeout(() => {
        setValue(editingTransaction.value);
      }, 100);
    }
  }, [editingTransaction, setValue]);

  function handleSubmit() {
    const valueInput = inputRef.current;
    if (!valueInput) return;

    if (!transactionType || !numericValue || numericValue <= 0 || valueError) {
      message.warning("Preencha todos os campos corretamente.");
      return;
    }

    if (!description.trim()) {
      message.warning("Por favor, adicione uma descrição para a transação.");
      return;
    }

    const transactionData = {
      id: editingTransaction?.id ?? "",
      type: transactionType as transactionType,
      value: numericValue,
      description,
      category,
      date: editingTransaction?.date || new Date().toISOString().split("T")[0],
      anexo: attachments,
    };

    try {
      if (isEditMode && editingTransaction) {
        updateTransaction(editingTransaction.id, transactionData);
        message.success("Transação atualizada com sucesso!");
        onCancel?.();
      } else {
        addTransaction(transactionData);
        message.success(
          "Transação adicionada com sucesso!",
          "Você pode ver os detalhes na sua lista de extrato."
        );
      }

      if (!isEditMode) {
        resetForm();
      }
    } catch (error) {
      console.error("Error processing transaction:", error);
      message.error("Erro ao processar transação. Tente novamente.");
    }
  }

  function resetForm() {
    setTransactionType("");
    setDescription("");
    setCategory("");
    setValue(0);
  }

  const containerClasses =
    "bg-neutral-grey2 rounded-default flex flex-col bg-custom-pixel2 mb-[24px]";
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

          <div className="w-full flex flex-col md:flex-row md:gap-[32px]">
            <div className="w-full mt-[32px]">
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
                <ul className="flex md:hidden flex-row flex-wrap mt-3 gap-3">
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

            <div className="w-full mt-[32px]">
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
          </div>

          {filteredCategories.length > 0 && (
            <ul className="hidden md:flex flex-row flex-wrap mt-3 gap-3">
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

          <div className="w-full md:w-1/2 mt-[32px]">
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
          <div className="w-full mt-[32px]">
            <Paragraph
              label="Quer incluir um comprovante?"
              className="font-medium text-gray-700 text-sm"
            />
            <FileUpload onFilesBase64={setAttachments} />
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
