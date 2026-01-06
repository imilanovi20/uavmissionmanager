// BlackButton.tsx
import { StyledBlackButton } from "./BlackButton.styles";
import type { BlackButtonProps } from "./BlackButton.types";

const BlackButton = (props: BlackButtonProps) => {
    return (
        <StyledBlackButton 
            onClick={props.onClick} 
            disabled={props.disabled}
            width={props.width}
            height={props.height}
        >
            {props.title}
        </StyledBlackButton>
    )
}

export default BlackButton;