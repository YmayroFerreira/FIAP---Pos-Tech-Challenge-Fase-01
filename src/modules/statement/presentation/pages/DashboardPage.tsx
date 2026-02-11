"use client";

import { useEffect } from "react";
import dynamic from "next/dynamic";
import { useStatementStore } from "@/modules/statement/presentation/store/StatementUIStore";
import BalanceCard from "@/modules/statement/presentation/components/BalanceCard";

const HomePageChart = dynamic(
  () => import("@/modules/statement/presentation/components/HomePageChart"),
  {
    loading: () => (
      <div className="animate-pulse bg-gray-200 h-64 rounded-default"></div>
    ),
    ssr: false,
  },
);

const Statement = dynamic(
  () => import("@/modules/statement/presentation/components/Statement"),
  {
    loading: () => (
      <div className="animate-pulse bg-gray-200 h-96 rounded-default"></div>
    ),
  },
);

const TransactionForm = dynamic(
  () => import("@/modules/statement/presentation/components/TransactionForm"),
  {
    loading: () => (
      <div className="animate-pulse bg-gray-200 h-48 rounded-default"></div>
    ),
  },
);

export default function DashboardPage() {
  const { fetchData } = useStatementStore();

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <>
      <main className="flex-1 rounded-default w-full">
        <BalanceCard />
        <TransactionForm />
        <HomePageChart />
      </main>

      <aside className="w-full bg-white rounded-default lg:w-[282px] flex justify-center">
        <Statement showLatest={6} />
      </aside>
    </>
  );
}
