export interface FileInputFieldProps {
  label: string;
  accept?: string;
  disabled?: boolean;
  onChange: (file: File | null) => void;
  selectedFile?: File | null;
}