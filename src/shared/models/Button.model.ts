interface ButtonModel extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  variant?: "primary" | "secondary" | "tertiary" | "disabled";
  size?: "sm" | "md" | "lg";
}

export type { ButtonModel };
