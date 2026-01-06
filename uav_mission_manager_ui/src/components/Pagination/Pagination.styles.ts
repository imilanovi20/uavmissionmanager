import styled from "styled-components";

export const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  margin-top: 2rem;
`;

export const PageButton = styled.button<{ active?: boolean }>`
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 6px;
  border: 1px solid #d1d5db;
  background: ${props => props.active ? '#2e2e2e' : 'white'};
  color: ${props => props.active ? 'white' : '#6b7280'};
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background: ${props => props.active ? '#6b7280' : '#f3f4f6'};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &:focus {
    outline: 2px solid #667eea;
    outline-offset: 2px;
  }
`;

export const PageInfo = styled.span`
  color: #6b7280;
  font-size: 0.875rem;
  margin: 0 1rem;
`;