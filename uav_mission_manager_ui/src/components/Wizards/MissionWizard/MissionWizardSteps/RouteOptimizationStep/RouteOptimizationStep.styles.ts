import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

export const Title = styled.h3`
  margin: 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: #2e2e2e;
`;

export const RouteInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #10b981;
  font-weight: 500;
`;

export const Container = styled.div`
  display: flex;
  gap: 1.5rem;
  
  @media (max-width: 1024px) {
    flex-direction: column;
  }
`;

export const MapSection = styled.div`
  flex: 1;
  min-height: 600px;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #e5e7eb;
`;

export const ControlsSection = styled.div`
  flex: 0 0 350px;
  
  @media (max-width: 1024px) {
    flex: 1;
  }
`;

export const ObstaclesSection = styled.div`
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 1.25rem;
`;

export const DetectionControls = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

export const CheckboxGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const Checkbox = styled.input`
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: #2c2c2c;
`;

export const CheckboxLabel = styled.label`
  font-size: 0.875rem;
  color: #2e2e2e;
  cursor: pointer;
  display: flex;
  align-items: center;
  user-select: none;
`;

export const DetectButton = styled.button`
  margin-top: 0.5rem;
  padding: 0.75rem;
  background: #2c2c2c;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.2s ease;
  
  &:hover:not(:disabled) {
    background: #404040;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  .spinning {
    animation: ${spin} 1s linear infinite;
  }
`;

export const ObstaclesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  max-height: 300px;
  overflow-y: auto;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: #f3f4f6;
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #d1d5db;
    border-radius: 3px;
  }
`;

export const ObstacleCard = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  transition: all 0.2s ease;
  
  &:hover {
    background: #f3f4f6;
  }
`;

export const ObstacleIcon = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 6px;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.125rem;
  flex-shrink: 0;
`;

export const ObstacleInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

export const ObstacleName = styled.div`
  font-size: 0.8125rem;
  font-weight: 600;
  color: #2e2e2e;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const ObstacleType = styled.div`
  font-size: 0.6875rem;
  color: #6b7280;
`;

export const ObstacleActions = styled.div`
  display: flex;
  gap: 0.25rem;
`;

export const IconButton = styled.button`
  padding: 0.375rem;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  color: #6b7280;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  
  &:hover {
    background: #fee2e2;
    border-color: #fecaca;
    color: #dc2626;
  }
`;

export const EmptyState = styled.div`
  padding: 3rem 1rem;
  text-align: center;
  color: #9ca3af;
  font-size: 0.875rem;
  background: #f9fafb;
  border-radius: 8px;
  margin-top: 1rem;
`;

export const GenerateRouteButton = styled.button`
  width: 100%;
  margin-top: 1.5rem;
  padding: 0.875rem;
  background: #10b981;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover:not(:disabled) {
    background: #059669;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const StatusMessage = styled.div<{ $error?: boolean }>`
  margin-top: 1rem;
  padding: 0.75rem;
  background: ${({ $error }) => ($error ? '#fee2e2' : '#d1fae5')};
  border: 1px solid ${({ $error }) => ($error ? '#fecaca' : '#a7f3d0')};
  border-radius: 8px;
  color: ${({ $error }) => ($error ? '#dc2626' : '#059669')};
  font-size: 0.8125rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const InfoBox = styled.div`
  margin-top: 1.5rem;
  padding: 1rem;
  background: #f0f9ff;
  border: 1px solid #bae6fd;
  border-radius: 8px;
  font-size: 0.8125rem;
  
  > div {
    margin-bottom: 0.25rem;
    
    &:last-child {
      margin-bottom: 0;
    }
  }
`;

export const SecondaryButton = styled.button`
  padding: 0.625rem 1rem;
  background: white;
  color: #2c2c2c;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.375rem;
  transition: all 0.2s ease;
  
  &:hover:not(:disabled) {
    background: #f9fafb;
    border-color: #d1d5db;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;