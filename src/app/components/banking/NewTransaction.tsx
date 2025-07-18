"use client";

import { useStatement } from "@/context/statementContext";
import { useCurrencyMask } from "@/hooks/useCurrencyMask";
import { useRef } from "react";

export default function NewTransaction() {
  const inputRef = useRef<HTMLInputElement>(null);
  const { maskedValue } = useCurrencyMask(inputRef);
  const { setTransactions } = useStatement();

  function addTransaction() {
    const typeSelect = document.getElementById(
      "typeOfTransactionId"
    ) as HTMLSelectElement;
    const valueInput = inputRef.current;
    const descriptionInput = document.getElementById(
      "DescriptionOfTransactionId"
    ) as HTMLInputElement;

    if (!typeSelect || !valueInput || !descriptionInput) return;

    const typeValue = typeSelect.value;
    const value = valueInput.value;
    const description = descriptionInput.value;
    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(
      now.getMonth() + 1
    ).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

    if (!typeValue || !value) {
      alert("Preencha todos os campos.");
      return;
    }

    const newTransaction = {
      type: typeValue as "Entry" | "Exit",
      amount: maskedValue ?? "",
      description: description,
      date: formattedDate,
    };
    console.log(newTransaction);

    setTransactions((prev) =>
      prev ? [...prev, newTransaction] : [newTransaction]
    );

    typeSelect.value = "";
    valueInput.value = "";
    descriptionInput.value = "";
  }

  return (
    <section className="bg-white shadow-md flex flex-col gap-8 p-8 rounded-xl">
      <h2 className="font-bold text-gray-800 text-2xl">Nova Transação</h2>

      <select
        className="max-w-[355px] h-12 px-4 text-gray-800 bg-gray-100 border border-bb-green rounded-md focus:outline-none focus:ring-2 focus:border-bb-green"
        name="typeOfTransaction"
        id="typeOfTransactionId"
        defaultValue=""
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
          />
        </div>
      </div>

      <button
        className="max-w-[355px] h-12 bg-bb-green text-white font-semibold rounded-md hover:opacity-90 cursor-pointer duration-200"
        type="submit"
        onClick={addTransaction}
      >
        Concluir transação
      </button>
    </section>
  );
}
