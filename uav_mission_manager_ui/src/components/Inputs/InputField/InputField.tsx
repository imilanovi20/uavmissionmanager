import { StyledInputContainer, StyledLabel, StyledInput } from "./InputField.styles";
import type { InputFieldProps } from "./InputField.types";

const InputField = (props: InputFieldProps) => {
    return (
        <StyledInputContainer>
            <StyledInput 
                type={props.type}
                placeholder=" "
                value={props.value}
                onChange={props.onChange}
                disabled={props.disabled}
                id={props.label}
            />
            <StyledLabel htmlFor={props.label}>{props.label}</StyledLabel>
        </StyledInputContainer>
    )
}

export default InputField;