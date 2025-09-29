"use client";

import BalanceCard from "@/core/components/BalanceCard";
import HomePageChart from "@/core/components/HomePageChart";
// import Statement from "@/core/components/Statement";
import TransactionForm from "@/core/components/TransactionForm";
import { useStatementStore } from "@/store/StatementStore";
import { useEffect } from "react";

export default function Home() {
	const { fetchData } = useStatementStore();

	useEffect(() => {
		fetchData();
	}, [fetchData]);

	return (
		// <div className="grid grid-cols-1 md:grid-cols-10 gap-6">
		//   <main className="col-span-full md:col-span-7">
		//     <div className="flex flex-col gap-6">
		//       <BalanceCard />
		//       <TransactionForm />
		//     </div>
		//   </main>
		//   {/* <div className="col-span-full md:col-span-3">
		//     <Statement showLatest={6} />
		//   </div> */}
		// </div>
		<main>
			<BalanceCard />
			<TransactionForm />
			<HomePageChart />
		</main>
		// <div className="grid grid-cols-1 md:grid-cols-10 gap-6">
		//   <main className="col-span-full md:col-span-7">
		//     asjdmpioajidfpapjifpajipadjspijas
		//     <div className="flex flex-col gap-6">
		//       <BalanceCard />
		//       <TransactionForm />
		//       <HomePageChart />
		//     </div>
		//   </main>
		//   <div className="col-span-full md:col-span-3">
		//     <Statement showLatest={6} />
		//   </div>
		// </div>
	);
}
