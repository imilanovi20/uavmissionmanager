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
  max-width: 900px;
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
  
  &:hover {
    background: ${({ $primary }) => ($primary ? '#404040' : '#f9fafb')};
  }
`;

export const Info = styled.div`
  padding: 0.75rem;
  background: #f0f9ff;
  border: 1px solid #bae6fd;
  border-radius: 6px;
  font-size: 0.75rem;
  color: #075985;
  margin-bottom: 1rem;
`;