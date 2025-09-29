"use client";

import { Dialog, Transition } from "@headlessui/react";
import { Fragment, ReactNode, useState } from "react";
import Button from "../../button/Button";

type ModalConfirmationProps = {
	titulo: string;
	descricao?: string;
	onConfirmar: () => void;
	confirmLabel?: string;
	cancelLabel?: string;
	children: (abrirModal: () => void) => ReactNode;
};

export default function ModalConfirmation({
	titulo,
	descricao,
	onConfirmar,
	confirmLabel = "Confirmar",
	cancelLabel = "Cancelar",
	children,
}: ModalConfirmationProps) {
	const [isOpen, setIsOpen] = useState(false);

	function abrirModal() {
		setIsOpen(true);
	}

	function fecharModal() {
		setIsOpen(false);
	}

	function confirmar() {
		onConfirmar();
		fecharModal();
	}

	return (
		<>
			{children(abrirModal)}

			<Transition appear show={isOpen} as={Fragment}>
				<Dialog
					as="div"
					className="relative z-50"
					onClose={fecharModal}
				>
					<Transition.Child
						as={Fragment}
						enter="ease-out duration-200"
						enterFrom="opacity-0"
						enterTo="opacity-100"
						leave="ease-in duration-100"
						leaveFrom="opacity-100"
						leaveTo="opacity-0"
					>
						<div className="fixed inset-0 bg-black/30" />
					</Transition.Child>

					<div className="fixed inset-0 overflow-y-auto">
						<div className="flex min-h-full items-center justify-center p-4">
							<Transition.Child
								as={Fragment}
								enter="ease-out duration-200"
								enterFrom="opacity-0 scale-95"
								enterTo="opacity-100 scale-100"
								leave="ease-in duration-100"
								leaveFrom="opacity-100 scale-100"
								leaveTo="opacity-0 scale-95"
							>
								<Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded bg-white p-6 text-left shadow-xl transition-all">
									<Dialog.Title className="text-lg font-bold text-gray-800">
										{titulo}
									</Dialog.Title>
									{descricao && (
										<Dialog.Description className="mt-2 text-sm text-gray-600">
											{descricao}
										</Dialog.Description>
									)}

									<div className="mt-4 flex justify-end gap-2">
										<Button
											className="bg-transparent hover:bg-transparent !text-primary !hover:text-accent "
											label={cancelLabel}
											onClick={fecharModal}
										/>
										<Button
											label={confirmLabel}
											onClick={confirmar}
										/>
									</div>
								</Dialog.Panel>
							</Transition.Child>
						</div>
					</div>
				</Dialog>
			</Transition>
		</>
	);
}
