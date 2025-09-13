"use client";

import BalanceCard from "@/core/components/BalanceCard";
import HomePageChart from "@/core/components/HomePageChart";
import Statement from "@/core/components/Statement";
import TransactionForm from "@/core/components/TransactionForm";
import { useState } from "react";

export default function Home() {
  const [chartType, setChartType] = useState<"line" | "bar" | "area">("line");

  return (
    <div className="grid grid-cols-1 md:grid-cols-10 gap-6">
      <main className="col-span-full md:col-span-7">
        <div className="flex flex-col gap-6">
          <BalanceCard />
          <TransactionForm />
          <HomePageChart
            type={chartType}
            onTypeChange={setChartType}
            height={400}
            title="Desempenho Financeiro 2025"
          />
        </div>
      </main>
      <div className="col-span-full md:col-span-3">
        <Statement showLatest={6} />
      </div>
    </div>
  );
}
