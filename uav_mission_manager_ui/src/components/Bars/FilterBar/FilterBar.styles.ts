import styled from 'styled-components';

export const FilterBarContainer = styled.div`
  display: inline-flex;
  gap: 0;
  padding: 4px;
  background: #f3f4f6;
  border-radius: 10px;
  margin-bottom: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
`;

export const FilterButton = styled.button<{ active: boolean }>`
  padding: 0.625rem 1.5rem;
  background: ${({ active }) => (active ? '#2c2c2c' : 'transparent')};
  color: ${({ active }) => (active ? 'white' : '#6b7280')};
  border: none;
  border-radius: 7px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  letter-spacing: -0.01em;
  white-space: nowrap;

  &:hover {
    background: ${({ active }) => (active ? '#404040' : '#e5e7eb')};
    color: ${({ active }) => (active ? 'white' : '#374151')};
  }

  &:active {
    transform: scale(0.98);
  }

  &:focus {
    outline: none;
  }

  ${({ active }) =>
    active &&
    `
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1),
                0 1px 2px rgba(0, 0, 0, 0.06);
  `}
`;