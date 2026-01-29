import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

export const SummaryStepContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

export const CreateMissionSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  margin-top: 1rem;
`;

export const CreateMissionButton = styled.button`
  padding: 1rem 3rem;
  background: #2c2c2c;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.125rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  transition: all 0.2s ease;
  min-width: 250px;
  
  &:hover:not(:disabled) {
    background: #404040;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(44, 44, 44, 0.3);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
  
  .spinning {
    animation: ${spin} 1s linear infinite;
  }
`;

export const SuccessMessage = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1.25rem 2rem;
  background: #d1fae5;
  border: 2px solid #10b981;
  border-radius: 8px;
  color: #065f46;
  font-size: 1.125rem;
  font-weight: 600;
`;
