interface SelectModel extends React.InputHTMLAttributes<HTMLSelectElement> {
  options: option[];
  defaultTextOption: string;
}

interface option {
  option: string;
  value: string;
}

export type { SelectModel };
