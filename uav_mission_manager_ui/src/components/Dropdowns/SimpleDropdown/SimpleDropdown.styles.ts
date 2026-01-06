import styled from 'styled-components';

export const StyledSimpleDropdownContainer = styled.div`
  position: relative;
  width: 100%;
`;

export const StyledDropdownButton = styled.button<{ isOpen: boolean; hasValue: boolean }>`
  width: 100%;
  padding: 20px 16px 8px 16px;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 16px;
  transition: all 0.3s ease;
  background: #f8f9fa;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  box-sizing: border-box;
  cursor: pointer;
  text-align: left;
  display: flex;
  align-items: center;
  justify-content: space-between;

  &:focus {
    outline: none;
    border-color: #667eea;
    background: white;
  }

  &:disabled {
    background: #e9ecef;
    cursor: not-allowed;
  }

  &::after {
    content: '▼';
    transform: ${({ isOpen }) => isOpen ? 'rotate(180deg)' : 'rotate(0deg)'};
    transition: transform 0.2s ease;
    color: #666;
    flex-shrink: 0;
  }
`;

export const StyledSelectedText = styled.div<{ hasValue: boolean }>`
  color: ${({ hasValue }) => hasValue ? '#495057' : '#adb5bd'};
  font-size: 16px;
`;

export const StyledDropdownList = styled.div<{ isOpen: boolean }>`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 2px solid #e1e5e9;
  border-top: none;
  border-radius: 0 0 8px 8px;
  max-height: 200px;
  overflow-y: auto;
  z-index: 1000;
  display: ${({ isOpen }) => isOpen ? 'block' : 'none'};
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

export const StyledDropdownOption = styled.div<{ isSelected: boolean }>`
  padding: 12px 16px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  background: ${({ isSelected }) => isSelected ? '#e8f5e8' : 'white'};
  font-size: 16px;
  color: #2c2c2c;

  &:hover {
    background: #f8f9fa;
  }
`;

export const StyledDropdownLabel = styled.label`
  position: absolute;
  top: 16px;
  left: 16px;
  font-size: 16px;
  color: #adb5bd;
  transition: all 0.3s ease;
  pointer-events: none;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: transparent;
`;