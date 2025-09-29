import { toast } from "sonner";

export const message = {
	success: messageSuccess,
	error: messageError,
	warning: messageWarning,
};

function messageSuccess(title: string, description?: string) {
	toast.custom(() => (
		<div
			className={`bg-success text-white px-4 py-3 rounded shadow w-full max-w-sm`}
		>
			<strong className="block text-md font-bold">{title}</strong>
			<span className="text-sm opacity-80">{description}</span>
		</div>
	));
}

function messageError(title: string, description?: string) {
	toast.custom(() => (
		<div
			className={`bg-red-500 text-white px-4 py-3 rounded-lg shadow-md border-l-4 border-red-600`}
		>
			<strong className="block text-md font-bold">{title}</strong>
			<span className="text-sm opacity-80 text-white">{description}</span>
		</div>
	));
}

function messageWarning(title: string, description?: string) {
	toast.custom(() => (
		<div
			className={`bg-yellow-400 text-black px-4 py-3 rounded-lg shadow-md `}
		>
			<strong className="block text-md font-bold">{title}</strong>
			<span className="text-sm opacity-80">{description}</span>
		</div>
	));
}
