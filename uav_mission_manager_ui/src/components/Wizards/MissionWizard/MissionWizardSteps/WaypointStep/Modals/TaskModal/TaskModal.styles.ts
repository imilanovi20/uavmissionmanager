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
  padding: 2rem;
`;

export const Modal = styled.div`
  background: white;
  border-radius: 16px;
  width: 100%;
  max-width: 500px;  
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
`;

export const Header = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const Title = styled.h3`
  margin: 0;
  font-size: 1.25rem;
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
  padding: 1.5rem;
  flex: 1;
  overflow-y: auto;
`;

export const TaskTypeGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
`;

export const TaskTypeCard = styled.button`
  padding: 1.5rem;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  background: white;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: center;
  
  &:hover {
    border-color: #2c2c2c;
    background: #f9fafb;
  }
`;

export const TaskTypeIcon = styled.div`
  font-size: 2rem;
  margin-bottom: 0.5rem;
`;

export const TaskTypeName = styled.div`
  font-weight: 600;
  color: #2e2e2e;
  margin-bottom: 0.25rem;
`;

export const TaskTypeDesc = styled.div`
  font-size: 0.75rem;
  color: #6b7280;
`;