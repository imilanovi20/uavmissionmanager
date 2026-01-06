import styled from 'styled-components';

export const StyledPictureDropdownContainer = styled.div`
  position: relative;
  width: 100%;
`;

export const StyledDropdownButton = styled.button<{ isOpen: boolean; hasValue: boolean }>`
  width: 100%;
  min-height: 60px;
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
  align-items: flex-start;
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
    margin-top: 2px;
    flex-shrink: 0;
  }
`;

export const StyledSelectedItems = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  flex: 1;
  margin-right: 8px;
`;

export const StyledSelectedTag = styled.div`
  display: flex;
  align-items: center;
  background: #e3f2fd;
  border: 1px solid #2196f3;
  border-radius: 16px;
  padding: 4px 8px;
  font-size: 14px;
  color: #1976d2;
`;

export const StyledTagImage = styled.img`
  width: 16px;
  height: 16px;
  object-fit: cover;
  border-radius: 2px;
  margin-right: 6px;
`;

export const StyledTagText = styled.span`
  font-size: 12px;
  margin-right: 6px;
`;

export const StyledRemoveButton = styled.button`
  background: none;
  border: none;
  color: #1976d2;
  cursor: pointer;
  font-size: 14px;
  padding: 0;
  margin-left: 4px;

  &:hover {
    color: #d32f2f;
  }
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
  display: flex;
  align-items: center;
  padding: 12px 16px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  background: ${({ isSelected }) => isSelected ? '#e8f5e8' : 'white'};

  &:hover {
    background: #f8f9fa;
  }
`;

export const StyledOptionImage = styled.img`
  width: 32px;
  height: 32px;
  object-fit: cover;
  border-radius: 4px;
  margin-right: 12px;
  flex-shrink: 0;
`;

export const StyledOptionText = styled.div`
  font-size: 16px;
  color: #2c2c2c;
  flex: 1;
`;

export const StyledCheckbox = styled.div<{ isSelected: boolean }>`
  width: 16px;
  height: 16px;
  border: 2px solid ${({ isSelected }) => isSelected ? '#2196f3' : '#ccc'};
  border-radius: 3px;
  background: ${({ isSelected }) => isSelected ? '#2196f3' : 'white'};
  margin-left: auto;
  display: flex;
  align-items: center;
  justify-content: center;

  &::after {
    content: ${({ isSelected }) => isSelected ? '"✓"' : '""'};
    color: white;
    font-size: 12px;
    font-weight: bold;
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

export const StyledPlaceholder = styled.div`
  color: #adb5bd;
  font-size: 16px;
  margin-top: 4px;
`;