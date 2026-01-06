export interface PictureDropdownOption {
  value: string;
  label: string;
  imagePath?: string;
}

export interface PictureDropdownProps {
  label: string;
  options: PictureDropdownOption[];
  value: string[];
  onChange: (values: string[]) => void;
  disabled?: boolean;
  placeholder?: string;
}