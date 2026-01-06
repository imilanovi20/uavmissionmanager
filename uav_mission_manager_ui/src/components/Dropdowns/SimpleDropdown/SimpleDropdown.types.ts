export interface SimpleDropdownOption {
  value: string;
  label: string;
}

export interface SimpleDropdownProps {
  label: string;
  options: SimpleDropdownOption[];
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
}