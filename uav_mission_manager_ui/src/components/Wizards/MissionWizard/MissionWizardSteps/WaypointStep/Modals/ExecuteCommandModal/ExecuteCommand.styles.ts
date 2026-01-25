import styled from "styled-components";

export const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 3000;
  padding: 1.5rem;
`;

export const Modal = styled.div`
  background: white;
  border-radius: 12px;
  width: 100%;
  max-width: 700px;
  max-height: 85vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
`;

export const Header = styled.div`
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

export const BackButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  color: #6b7280;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  
  &:hover {
    background: #f3f4f6;
    color: #374151;
  }
`;

export const Title = styled.h3`
  margin: 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: #2e2e2e;
`;

export const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  color: #6b7280;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  
  &:hover {
    background: #f3f4f6;
    color: #374151;
  }
`;

export const Body = styled.div`
  padding: 1.25rem;
  flex: 1;
  overflow-y: auto;
`;

export const Footer = styled.div`
  padding: 1rem 1.5rem;
  border-top: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const Button = styled.button<{ $primary?: boolean }>`
  padding: 0.625rem 1.25rem;
  background: ${({ $primary }) => ($primary ? '#2c2c2c' : 'white')};
  color: ${({ $primary }) => ($primary ? 'white' : '#2c2c2c')};
  border: 1px solid ${({ $primary }) => ($primary ? '#2c2c2c' : '#e5e7eb')};
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.375rem;
  
  &:hover:not(:disabled) {
    background: ${({ $primary }) => ($primary ? '#404040' : '#f9fafb')};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const Info = styled.div`
  padding: 0.75rem;
  background: #f0f9ff;
  border: 1px solid #bae6fd;
  border-radius: 6px;
  font-size: 0.8125rem;
  color: #075985;
  margin-bottom: 1.25rem;
`;

/* Step Indicator */
export const StepIndicator = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 2rem;
  gap: 0.5rem;
`;

export const StepDot = styled.div<{ $active?: boolean }>`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: ${({ $active }) => ($active ? '#2c2c2c' : '#e5e7eb')};
  color: ${({ $active }) => ($active ? 'white' : '#9ca3af')};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
  font-weight: 600;
  transition: all 0.3s ease;
`;

export const StepLine = styled.div<{ $active?: boolean }>`
  width: 60px;
  height: 2px;
  background: ${({ $active }) => ($active ? '#2c2c2c' : '#e5e7eb')};
  transition: all 0.3s ease;
`;

/* Selection Cards (UAV & Equipment) */
export const SelectionList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

export const SelectionCard = styled.div<{ $selected?: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: ${({ $selected }) => ($selected ? '#f9fafb' : 'white')};
  border: 2px solid ${({ $selected }) => ($selected ? '#2c2c2c' : '#e5e7eb')};
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: #2c2c2c;
    background: #f9fafb;
  }
`;

export const SelectionIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 6px;
  background: #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  flex-shrink: 0;
  color: #9ca3af;
`;

export const SelectionImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const SelectionContent = styled.div`
  flex: 1;
  min-width: 0;
`;

export const SelectionName = styled.div`
  font-size: 0.875rem;
  font-weight: 600;
  color: #2e2e2e;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const SelectionType = styled.div`
  font-size: 0.75rem;
  color: #6b7280;
`;

/* Form Inputs */
export const Label = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.5rem;
`;

export const Input = styled.input`
  width: 100%;
  padding: 0.625rem 0.875rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.875rem;
  box-sizing: border-box;
  
  &:focus {
    outline: none;
    border-color: #2c2c2c;
    box-shadow: 0 0 0 3px rgba(44, 44, 44, 0.1);
  }
`;

/* Settings (Key-Value) */
export const SettingsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

export const SettingRow = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
`;

export const RemoveSettingButton = styled.button`
  width: 32px;
  height: 32px;
  flex-shrink: 0;
  background: #fee2e2;
  color: #dc2626;
  border: none;
  border-radius: 6px;
  font-size: 1.25rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  
  &:hover {
    background: #fecaca;
  }
`;

export const AddSettingButton = styled.button`
  padding: 0.625rem;
  background: white;
  color: #6b7280;
  border: 1px dashed #d1d5db;
  border-radius: 6px;
  font-size: 0.8125rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: #2c2c2c;
    color: #2c2c2c;
    background: #f9fafb;
  }
`;

export const EmptyState = styled.div`
  text-align: center;
  padding: 2rem;
  color: #6b7280;
  font-size: 0.875rem;
`;