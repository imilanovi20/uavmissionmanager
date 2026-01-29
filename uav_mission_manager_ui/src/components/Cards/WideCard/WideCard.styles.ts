import styled from 'styled-components';
import type { MissionStatus } from './WideCard.types';

export const WideCardContainer = styled.div<{ $status: MissionStatus }>`
  width: 100%;
  padding: 1.5rem;
  border-radius: 12px;
  border: 2px solid ${({ $status }) => {
    if ($status === 'completed') return '#22c55e';
    if ($status === 'active') return '#2c2c2c';
    return '#e5e7eb';
  }};
  background: white;
  transition: all 0.2s ease;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 1rem;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
    border-color: #2c2c2c;
  }
`;

export const WideCardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;

  @media (max-width: 640px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

export const WideCardTitleSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

export const WideCardTitle = styled.h3`
  margin: 0;
  font-size: 1.25rem;
  font-weight: 700;
  color: #2c2c2c;
`;

export const WideCardDate = styled.div`
  font-size: 0.875rem;
  color: #6b7280;
`;

export const StatusBadge = styled.div<{ $status: MissionStatus }>`
  padding: 0.375rem 0.75rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.025em;
  background: ${({ $status }) => {
    if ($status === 'completed') return '#22c55e';
    if ($status === 'active') return '#ef4444';
    return '#e5e7eb';
  }};
  color: ${({ $status }) => {
    if ($status === 'completed') return 'white';
    if ($status === 'active') return 'white';
    return '#1b5ee2';
  }};
  white-space: nowrap;
  flex-shrink: 0;
`;

export const WideCardDescription = styled.p`
  margin: 0;
  font-size: 0.9375rem;
  color: #6b7280;
  line-height: 1.6;
`;

export const WideCardMeta = styled.div`
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;

  @media (max-width: 640px) {
    gap: 1rem;
  }
`;

export const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #374151;

  svg {
    color: #9ca3af;
    flex-shrink: 0;
  }
`;

export const MetaLabel = styled.span`
  color: #6b7280;
`;

export const MetaValue = styled.span`
  font-weight: 600;
  color: #2c2c2c;
`;