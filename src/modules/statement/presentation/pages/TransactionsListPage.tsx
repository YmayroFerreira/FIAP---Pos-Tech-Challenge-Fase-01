"use client";

import { useEffect } from "react";
import Statement from "@/modules/statement/presentation/components/Statement";
import { useStatementStore } from "@/modules/statement/presentation/store/StatementUIStore";

export default function TransactionsListPage() {
  const { fetchData, transactions } = useStatementStore();

  // Carrega os dados ao montar a página
  useEffect(() => {
    // Só recarrega se não houver dados
    if (transactions.length === 0) {
      fetchData();
    }
  }, [fetchData, transactions.length]);

  return <Statement isPaginated={true} itemsPerPage={5} />;
}
