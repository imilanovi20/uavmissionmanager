import styled from 'styled-components';

export const FormationContainer = styled.div`
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 1.25rem;
`;

export const CoordinateSystem = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 1;
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
`;

export const CoordinateGrid = styled.svg`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
`;

export const PlacedUAV = styled.div<{ $x: number; $y: number }>`
  position: absolute;
  left: ${({ $x }) => $x}%;
  top: ${({ $y }) => $y}%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  z-index: 10;
`;

export const UAVIcon = styled.div`
  width: 36px;
  height: 36px;
  background: #2c2c2c;
  color: white;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
`;

export const UAVImage = styled.img`
  width: 36px;
  height: 36px;
  object-fit: cover;
  border-radius: 6px;
  border: 2px solid #2c2c2c;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
`;

export const UAVLabel = styled.div`
  font-size: 0.625rem;
  font-weight: 600;
  color: #2e2e2e;
  background: white;
  padding: 0.25rem 0.375rem;
  border-radius: 3px;
  white-space: nowrap;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;
