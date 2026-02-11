import { useStatementStore } from "@/modules/statement/presentation/store/StatementUIStore";

export function useLatestTransactions(count: number) {
  const transactions = useStatementStore((s) => s.transactions);
  return [...transactions]
    .sort((a, b) => Date.parse(b.date) - Date.parse(a.date))
    .slice(0, count);
}
