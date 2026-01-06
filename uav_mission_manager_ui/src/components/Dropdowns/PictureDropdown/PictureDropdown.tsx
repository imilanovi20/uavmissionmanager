import { useState, useRef, useEffect } from 'react';
import {
  StyledPictureDropdownContainer,
  StyledDropdownButton,
  StyledSelectedItems,
  StyledSelectedTag,
  StyledTagImage,
  StyledTagText,
  StyledRemoveButton,
  StyledDropdownList,
  StyledDropdownOption,
  StyledOptionImage,
  StyledOptionText,
  StyledCheckbox,
  StyledDropdownLabel,
  StyledPlaceholder
} from "./PictureDropdown.styles";
import type { PictureDropdownProps } from "./PictureDropdown.types";

const PictureDropdown = ({ 
  label, 
  options, 
  value, 
  onChange, 
  disabled = false,
  placeholder = "" 
}: PictureDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const hasValue = value.length > 0;
  const selectedOptions = options.filter(option => value.includes(option.value));

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
    if (value.includes(optionValue)) {
      // Ukloni iz selekcije
      onChange(value.filter(v => v !== optionValue));
    } else {
      // Dodaj u selekciju
      onChange([...value, optionValue]);
    }
  };

  const handleRemoveTag = (optionValue: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(value.filter(v => v !== optionValue));
  };

  const handleButtonClick = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  return (
    <StyledPictureDropdownContainer ref={containerRef}>
      <StyledDropdownButton
        type="button"
        isOpen={isOpen}
        hasValue={hasValue}
        onClick={handleButtonClick}
        disabled={disabled}
      >
        <div style={{ flex: 1 }}>
          {hasValue ? (
            <StyledSelectedItems>
              {selectedOptions.map((option) => (
                <StyledSelectedTag key={option.value}>
                  {option.imagePath && (
                    <StyledTagImage 
                      src={option.imagePath} 
                      alt={option.label} 
                    />
                  )}
                  <StyledTagText>{option.label}</StyledTagText>
                  <StyledRemoveButton 
                    onClick={(e) => handleRemoveTag(option.value, e)}
                    type="button"
                  >
                    ×
                  </StyledRemoveButton>
                </StyledSelectedTag>
              ))}
            </StyledSelectedItems>
          ) : (
            <StyledPlaceholder>{placeholder}</StyledPlaceholder>
          )}
        </div>
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
            isSelected={value.includes(option.value)}
            onClick={() => handleOptionClick(option.value)}
          >
            {option.imagePath && (
              <StyledOptionImage 
                src={option.imagePath} 
                alt={option.label} 
              />
            )}
            <StyledOptionText>{option.label}</StyledOptionText>
            <StyledCheckbox isSelected={value.includes(option.value)} />
          </StyledDropdownOption>
        ))}
      </StyledDropdownList>
    </StyledPictureDropdownContainer>
  );
};

export default PictureDropdown;