import styled from 'styled-components';

export const StepContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
`;

export const StepDescription = styled.p`
  font-size: 14px;
  color: #64748b;
  margin: 0 0 20px 0;
`;

export const RefreshAllButton = styled.button`
  padding: 12px 24px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: background 0.2s;
  margin-bottom: 20px;
  align-self: flex-start;

  &:hover:not(:disabled) {
    background: #2563eb;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const LoadingOverlay = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  gap: 16px;
`;

export const LoadingSpinner = styled(RefreshCw)`
  width: 48px;
  height: 48px;
  color: #3b82f6;
`;

export const LoadingText = styled.p`
  font-size: 16px;
  color: #64748b;
  margin: 0;
`;

export const CardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 24px;
`;

export const Card = styled.div<{ $hasSuccess?: boolean }>`
  background: white;
  border: 2px solid ${props => props.$hasSuccess ? '#10b981' : '#e2e8f0'};
  border-radius: 12px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-height: 300px;
`;

export const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const CardTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #0f172a;
  margin: 0;
`;

export const SuccessIcon = styled.div`
  color: #10b981;
  display: flex;
  align-items: center;
`;

export const CategoryBadge = styled.div`
  background: #f1f5f9;
  border-radius: 8px;
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const CategoryLetter = styled.div`
  font-size: 32px;
  font-weight: bold;
  color: #0f172a;
`;

export const CategoryLabel = styled.div`
  font-size: 11px;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: 500;
`;

export const InfoSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const InfoLabel = styled.div`
  font-size: 11px;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: 500;
`;

export const InfoValue = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: #0f172a;
`;

export const RecalculateButton = styled.button`
  width: 100%;
  padding: 12px;
  background: #f1f5f9;
  color: #475569;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: background 0.2s;

  &:hover {
    background: #e2e8f0;
  }
`;

export const StatusBadge = styled.div<{ $isGreen?: boolean }>`
  background: ${props => props.$isGreen ? '#f0fdf4' : '#fef3c7'};
  border: 2px solid ${props => props.$isGreen ? '#10b981' : '#f59e0b'};
  border-radius: 8px;
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const StatusIcon = styled.div`
  color: #10b981;
`;

export const StatusText = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: #10b981;
`;

export const MessageBox = styled.div`
  background: #f9fafb;
  border-radius: 8px;
  padding: 12px;
  font-size: 14px;
  color: #475569;
  line-height: 1.5;
`;

export const RecheckButton = styled.button`
  width: 100%;
  padding: 12px;
  background: #f1f5f9;
  color: #475569;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: background 0.2s;
  margin-top: auto;

  &:hover {
    background: #e2e8f0;
  }
`;

export const NoDataText = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: #94a3b8;
  font-size: 14px;
`;

export const WeatherIcon = styled.img`
  width: 120px;
  height: 120px;
  margin: 0 auto;
  display: block;
`;

export const WeatherDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const WeatherDetail = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  color: #64748b;
`;

export const WeatherLabel = styled.div`
  font-size: 11px;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: 500;
`;

export const WeatherValue = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: #0f172a;
`;

// Import RefreshCw for LoadingSpinner
import { RefreshCw } from 'lucide-react';