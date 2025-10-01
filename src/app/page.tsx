"use client";

import BalanceCard from "@/core/components/BalanceCard";
import HomePageChart from "@/core/components/HomePageChart";
import Statement from "@/core/components/Statement";
import TransactionForm from "@/core/components/TransactionForm";
import { useStatementStore } from "@/store/StatementStore";
import { useEffect } from "react";

export default function Home() {
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
