import type { Metadata } from "next";

import "./globals.css";
import Header from "@/core/components/Header";
import { Inter } from "next/font/google";
import SidebarMenu from "@/core/components/layout/SidebarMenu";
import Statement from "@/core/components/Statement";

const inter = Inter({
	subsets: ["latin"],
	variable: "--font-inter",
	weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
	title: "Bytebank",
	description: "Projeto FIAP",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="pt-br">
			<body className={`${inter.variable} antialiased`}>
				<Header />
				<main className="flex justify-center @container min-h-screen">
					<div className="flex flex-col  @min-[1024px]:flex-row w-full max-w-[1200px] gap-[24px] pt-[24px] items-start p-[24px]">
						<aside
							className="w-full  @min-[1024px]:w-[180px] @min-[1024px]:bg-white @min-[426px]:p-4 @min-[426px]:mb-[32px] rounded-default 
					lg:h-full "
						>
							<SidebarMenu />
						</aside>

						<section className="flex-1 rounded-default w-full">
							{children}
						</section>

						<aside className="w-full bg-white p-[24px] rounded-default lg:w-[282px] flex justify-center">
							{/* <Extrato /> */}
							<Statement showLatest={6} />
						</aside>
					</div>
				</main>
			</body>
		</html>
	);
}
