export interface IconButtonProps {
  icon: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  size?: string;
  color?: string;
  backgroundColor?: string;
  hoverColor?: string;
}