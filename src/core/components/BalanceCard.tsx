"use client";

import { useState } from "react";
import { IoEye, IoEyeOff } from "react-icons/io5";
// import { useStatement } from "@/context/StatementContext";
// import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import { useStatementStore } from "@/store/StatementStore";

export default function BalanceCard() {
	const { userInfo, currentBalance, loading, error } = useStatementStore();
	const [showBalance, setShowBalance] = useState(true);

	const toggleVisibility = () => {
		setShowBalance(!showBalance);
	};

	const formatCurrency = (amount: number) => {
		const isNegative = amount < 0;
		const absoluteAmount = Math.abs(amount);

		const formatted = new Intl.NumberFormat("pt-BR", {
			style: "currency",
			currency: "BRL",
		}).format(absoluteAmount);

		return isNegative ? `-${formatted}` : formatted;
	};

	const getFormattedDate = new Date().toLocaleDateString("pt-BR", {
		weekday: "long",
		day: "2-digit",
		month: "2-digit",
		year: "numeric",
	});

	if (loading) {
		return (
			<div className="bg-primary text-white rounded-default h-[387px] flex justify-center items-center flex-col pt-[40px]  bg-custom-pixel mb-[24px] animate-pulse">
				<div className="flex flex-col md:flex-row md:justify-between gap-6 p-4">
					<div>
						<div className="h-8 bg-white/30 rounded w-48 mb-2"></div>
						<div className="h-5 bg-white/30 rounded w-64"></div>
					</div>
					<div className="md:text-right">
						<div className="h-7 bg-white/30 rounded w-24 mb-1 ml-auto"></div>
						<div className="w-32 h-px bg-bb-red mb-2 ml-auto"></div>
						<div className="h-5 bg-white/30 rounded w-40 mb-2 ml-auto"></div>
						<div className="h-8 bg-white/30 rounded w-32 ml-auto"></div>
					</div>
				</div>
			</div>
		);
	}

	if (error || !userInfo) {
		return (
			<div className="bg-red-200 text-red-800 p-6 w-full text-lg rounded-lg">
				<p>
					Não foi possível carregar as informações do saldo. Tente
					novamente mais tarde.
				</p>
			</div>
		);
	}

	return (
		<section className="bg-primary text-white rounded-default flex justify-center items-center flex-col pt-[40px]  bg-custom-pixel mb-[24px]">
			<div className="sm:w-full sm:w-[500px] sm:pl-[32px] sm:pr-[32px]">
				<h2 className="font-semibold text-xl">
					Olá, {userInfo.username || "John Doe"} :)
				</h2>{" "}
				{/* !remover esse texto @walteann */}
				<div className="flex flex-col sm:flex-row sm:justify-between">
					<span className="font-regular text-sm capitalize">
						{getFormattedDate}
					</span>
					<div className="min-w-[200px] max-w-max">
						<div className="flex items-center gap-[25px] p-[16px] pl-0">
							<span className="font-semibold text-lg">Saldo</span>
							<button
								className="w-[20px] h-[20px] hover:cursor-pointer"
								onClick={toggleVisibility}
							>
								{showBalance ? (
									<IoEye className="text-[20px] text-accent" />
								) : (
									<IoEyeOff className="text-[20px] text-accent" />
								)}
							</button>
						</div>
						<hr className="border-t-2 border-accent" />
						<p className="font-regular text-md pt-[16px] pb-[8px]">
							Conta Corrente
						</p>
						<p className="font-regular text-[31px]">
							{showBalance
								? formatCurrency(currentBalance)
								: "••••••••"}
						</p>
					</div>
				</div>
				<div className="h-[384px] sm:h-[152px]"></div>
			</div>
		</section>
	);
}
