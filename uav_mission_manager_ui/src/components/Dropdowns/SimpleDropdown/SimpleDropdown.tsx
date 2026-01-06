import { useState, useRef, useEffect } from 'react';
import {
  StyledSimpleDropdownContainer,
  StyledDropdownButton,
  StyledSelectedText,
  StyledDropdownList,
  StyledDropdownOption,
  StyledDropdownLabel
} from "./SimpleDropdown.styles";
import type { SimpleDropdownProps } from "./SimpleDropdown.types";

const SimpleDropdown = ({ 
  label, 
  options, 
  value, 
  onChange, 
  disabled = false,
  placeholder = "" 
}: SimpleDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const selectedOption = options.find(option => option.value === value);
  const hasValue = !!value;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleOptionClick = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  const handleButtonClick = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  return (
    <StyledSimpleDropdownContainer ref={containerRef}>
      <StyledDropdownButton
        type="button"
        isOpen={isOpen}
        hasValue={hasValue}
        onClick={handleButtonClick}
        disabled={disabled}
      >
        <StyledSelectedText hasValue={hasValue}>
          {selectedOption?.label || placeholder}
        </StyledSelectedText>
      </StyledDropdownButton>
      
      <StyledDropdownLabel 
        style={{ 
          top: hasValue || isOpen ? '8px' : '16px',
          fontSize: hasValue || isOpen ? '12px' : '16px',
          color: hasValue || isOpen ? '#667eea' : '#adb5bd'
        }}
      >
        {label}
      </StyledDropdownLabel>

      <StyledDropdownList isOpen={isOpen}>
        {options.map((option) => (
          <StyledDropdownOption
            key={option.value}
            isSelected={option.value === value}
            onClick={() => handleOptionClick(option.value)}
          >
            {option.label}
          </StyledDropdownOption>
        ))}
      </StyledDropdownList>
    </StyledSimpleDropdownContainer>
  );
};

export default SimpleDropdown;