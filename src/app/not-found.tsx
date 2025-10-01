import Button from "@/shared/components/button/Button";
import Link from "next/link";

export default function Custom404() {
	return (
		<main className=" bg-custom-gradient rounded-default">
			<section className="custom-404 flex flex-col items-center py-[32px] px-[24px] h-[600px] md:h-[550px]">
				<h2 className="font-bold text-xl">
					Ops! Não encontramos a página...
				</h2>
				<p>
					E olha que exploramos o universo procurando por ela! Que tal
					voltar e tentar novamente?
				</p>
				<Link href="/">
					<Button label="Voltar ao início" />
				</Link>
			</section>
		</main>
	);
}
