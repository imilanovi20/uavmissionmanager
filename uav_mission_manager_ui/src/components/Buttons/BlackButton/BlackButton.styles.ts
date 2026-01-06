import styled from 'styled-components';
import type { BlackButtonProps } from './BlackButton.types';



export const StyledBlackButton = styled.button<BlackButtonProps>`
  background: #2c2c2c;
  color: white;
  border: none;
  padding: 16px 24px;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  width: ${({ width }) => width || '100%'};
  height: ${({ height }) => height || 'auto'};
  transition: all 0.2s ease;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  
  &:hover {
    background: #404040;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(44, 44, 44, 0.3);
  }
  
  &:active {
    background: #1a1a1a;
    transform: translateY(0);
  }
  
  &:disabled {
    background: #666;
    cursor: not-allowed;
    transform: none;
    opacity: 0.6;
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(44, 44, 44, 0.2);
  }
`;