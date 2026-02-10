"use client";

import dynamic from "next/dynamic";
import BalanceCard from "@/core/components/BalanceCard";
import { useStatementStore } from "@/store/StatementStore";
import { useEffect } from "react";
import AuthGuard from "@/core/components/AuthGuard";

const HomePageChart = dynamic(() => import("@/core/components/HomePageChart"), {
  loading: () => (
    <div className="animate-pulse bg-gray-200 h-64 rounded-default"></div>
  ),
  ssr: false,
});

const Statement = dynamic(() => import("@/core/components/Statement"), {
  loading: () => (
    <div className="animate-pulse bg-gray-200 h-96 rounded-default"></div>
  ),
});

const TransactionForm = dynamic(
  () => import("@/core/components/TransactionForm"),
  {
    loading: () => (
      <div className="animate-pulse bg-gray-200 h-48 rounded-default"></div>
    ),
  },
);

function HomePage() {
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

export default function Home() {
  return (
    <AuthGuard>
      <HomePage />
    </AuthGuard>
  );
}
