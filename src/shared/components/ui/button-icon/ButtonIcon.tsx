import { ReactNode } from "react";

interface ButtonIconProps {
	icon: ReactNode;
	size?: number;
	className?: string;
	disabled?: boolean;
	onClick?: () => void;
}

export default function ButtonIcon({
	icon,
	size = 40,
	className = '',
	disabled,
	onClick,
}: ButtonIconProps) {
	if (disabled) {
		className += ' !cursor-not-allowed !bg-disabled border-disabled'
	}
	const baseClasses = `
    flex items-center justify-center
    rounded-full border border-solid hover:cursor-pointer
     ${className}
  `;



	return (
		<button onClick={onClick} disabled={disabled} className={baseClasses} style={{ width: size, height: size }}>
			{icon}
		</button>
	);
}
