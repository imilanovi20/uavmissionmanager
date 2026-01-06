import styled from "styled-components";
import type { IconButtonProps } from "./IconButton.types";

export const StyledIconButton = styled.button<IconButtonProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  
  /* Dinamičke vrijednosti s defaultima */
  width: ${({ size }) => size || '40px'};
  height: ${({ size }) => size || '40px'};
  background: ${({ backgroundColor }) => backgroundColor || '#2c2c2c'};
  color: ${({ color }) => color || 'white'};
  
  /* Hover efekti */
  &:hover {
    background: ${({ hoverColor, backgroundColor }) => 
      hoverColor || (backgroundColor === '#2c2c2c' ? '#404040' : '#e5e5e5')};
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
  
  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  }
  
  &:disabled {
    background: #666;
    cursor: not-allowed;
    transform: none;
    opacity: 0.6;
    
    &:hover {
      background: #666;
      transform: none;
      box-shadow: none;
    }
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(44, 44, 44, 0.2);
  }
  
  /* Ikona styling */
  svg {
    width: ${({ size }) => {
      const sizeNum = parseInt(size || '40');
      return `${sizeNum * 0.5}px`;
    }};
    height: ${({ size }) => {
      const sizeNum = parseInt(size || '40');
      return `${sizeNum * 0.5}px`;
    }};
  }
`;