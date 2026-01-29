import styled from 'styled-components';

export const PermitsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
`;

export const PermitCard = styled.div`
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const PermitHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #f3f4f6;
`;

export const PermitIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const PermitTitle = styled.h4`
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: #2e2e2e;
`;

export const PermitContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

export const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid #f9fafb;
  
  &:last-child {
    border-bottom: none;
  }
`;

export const InfoLabel = styled.div`
  font-size: 0.8125rem;
  color: #6b7280;
  font-weight: 500;
`;

export const InfoValue = styled.div`
  font-size: 0.875rem;
  color: #2e2e2e;
  font-weight: 600;
`;

export const StatusBadge = styled.div<{ $isRequired?: boolean }>`
  padding: 0.75rem 1rem;
  background: ${props => props.$isRequired ? '#fef3c7' : '#d1fae5'};
  border: 2px solid ${props => props.$isRequired ? '#f59e0b' : '#10b981'};
  color: ${props => props.$isRequired ? '#92400e' : '#065f46'};
  border-radius: 8px;
  font-weight: 600;
  text-align: center;
  font-size: 0.875rem;
`;

export const BatteryList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const BatteryItem = styled.div<{ $isFeasible: boolean }>`
  background: ${props => props.$isFeasible ? '#f9fafb' : '#fef2f2'};
  border: 1px solid ${props => props.$isFeasible ? '#e5e7eb' : '#fca5a5'};
  border-radius: 8px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const BatteryInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const BatteryBar = styled.div`
  width: 100%;
  height: 8px;
  background: #e5e7eb;
  border-radius: 4px;
  overflow: hidden;
`;

export const BatteryFill = styled.div<{ $percentage: number; $color: string }>`
  width: ${props => props.$percentage}%;
  height: 100%;
  background: ${props => props.$color};
  transition: width 0.3s ease;
`;
