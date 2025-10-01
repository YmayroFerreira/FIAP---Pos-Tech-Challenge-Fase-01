"use client";

import ButtonIcon from "@/shared/components/ui/button-icon/ButtonIcon";
import { useStatementStore } from "@/store/StatementStore";
import { FaRegUser } from "react-icons/fa6";

export default function Header() {
	const { userInfo } = useStatementStore();

	return (
		<header className="w-full h-[96px] bg-primary flex justify-center">
			<div className="w-full max-w-[1200px] flex justify-end items-center gap-[40px] p-[21px]">
				<span className="text-sm font-semibold text-white">
					{userInfo?.username}
					John Doe
					{/* !remover essa texto @walteann */}
				</span>
				<ButtonIcon
					className="border-accent"
					icon={<FaRegUser className="text-[20px] text-accent" />}
				/>
			</div>
		</header>
	);
}
