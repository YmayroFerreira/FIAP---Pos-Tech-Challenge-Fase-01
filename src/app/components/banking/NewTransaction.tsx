"use client";

import { useStatement } from "@/context/statementContext";
import { useCurrencyMask } from "@/hooks/useCurrencyMask";
import { useRef, useState } from "react";

export default function NewTransaction() {
  const inputRef = useRef<HTMLInputElement>(null);
  const { numericValue } = useCurrencyMask(inputRef);
  const { addTransaction } = useStatement();

  // Add state for form fields to properly control them
  const [transactionType, setTransactionType] = useState("");
  const [description, setDescription] = useState("");

  function addTransactionHandler() {
    const valueInput = inputRef.current;

    if (!valueInput) return;

    // Validation
    if (!transactionType || !numericValue || numericValue <= 0) {
      alert("Preencha todos os campos corretamente.");
      return;
    }

    if (!description.trim()) {
      alert("Por favor, adicione uma descrição para a transação.");
      return;
    }

    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(
      now.getMonth() + 1
    ).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

    const newTransaction = {
      type: transactionType as "Entry" | "Exit",
      amount: numericValue,
      description: description.trim(),
      date: formattedDate,
    };

    console.log("Adding transaction:", newTransaction);

    try {
      addTransaction(newTransaction);

      // Clear form properly
      setTransactionType("");
      setDescription("");

      // Reset the currency input by clearing and triggering the mask
      if (valueInput) {
        valueInput.value = "";
        // Trigger input event to make IMask reset properly
        const event = new Event("input", { bubbles: true });
        valueInput.dispatchEvent(event);
      }

      // Show success message
      alert("Transação adicionada com sucesso!");
    } catch (error) {
      console.error("Error adding transaction:", error);
      alert("Erro ao adicionar transação. Tente novamente.");
    }
  }

  return (
    <section className="bg-white shadow-md flex flex-col gap-8 p-8 rounded-xl">
      <h2 className="font-bold text-gray-800 text-2xl">Nova Transação</h2>

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

      <button
        className="max-w-[355px] h-12 bg-bb-green text-white font-semibold rounded-md hover:opacity-90 cursor-pointer duration-200"
        type="button"
        onClick={addTransactionHandler}
      >
        Concluir transação
      </button>
    </section>
  );
}
