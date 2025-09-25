import { ButtonModel } from "../../models/Button.model";

const Button = ({ size, variant, label, ...props }: ButtonModel) => {
  const baseClasses =
    "font-semibold rounded-md hover:opacity-90 cursor-pointer duration-200 transition-opacity py-3 box-border border-2";

  const variantClasses =
    variant === "secondary"
      ? "bg-white text-bb-green border-bb-green border-2 hover:bg-bb-green hover:text-white"
      : variant === "tertiary"
      ? "bg-transparent text-bb-green"
      : variant === "disabled"
      ? "bg-gray-300 text-white cursor-none"
      : "bg-bb-green text-white border-bb-green";

  const sizeClasses =
    size === "sm"
      ? "px-2 text-sm"
      : size === "lg"
      ? "px-6 text-lg"
      : "px-4 text-base";

  return (
    <button
      {...props}
      className={`${baseClasses} ${variantClasses} ${sizeClasses} ${
        props.className ?? ""
      }`}
    >
      {label}
    </button>
  );
};

export default Button;
