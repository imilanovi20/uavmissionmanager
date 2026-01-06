import { StyledIconButton } from "./IconButton.styles";
import type { IconButtonProps } from "./IconButton.types";

const IconButton = ({
  icon,
  onClick,
  disabled = false,
  size = "40px",
  color = "white",
  backgroundColor = "#2c2c2c",
  hoverColor
}: IconButtonProps) => {
  return (
    <StyledIconButton
      onClick={onClick}
      disabled={disabled}
      size={size}
      color={color}
      backgroundColor={backgroundColor}
      hoverColor={hoverColor}
    >
      {icon}
    </StyledIconButton>
  );
};

export default IconButton;