import styled from 'styled-components';

export const FormationContainer = styled.div`
  display: flex;
  gap: 1rem;
  
  @media (max-width: 900px) {
    flex-direction: column;
  }
`;

export const UAVListSection = styled.div`
  flex: 0 0 200px;
  
  @media (max-width: 900px) {
    flex: 1;
  }
`;

export const UAVListTitle = styled.h4`
  font-size: 0.8125rem;
  font-weight: 600;
  color: #2e2e2e;
  margin: 0 0 0.75rem 0;
`;

export const UAVListGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  max-height: 300px;
  overflow-y: auto;
  padding-right: 0.5rem;
  
  &::-webkit-scrollbar {
    width: 4px;
  }
  
  &::-webkit-scrollbar-track {
    background: #f3f4f6;
    border-radius: 2px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #d1d5db;
    border-radius: 2px;
    
    &:hover {
      background: #9ca3af;
    }
  }
`;

export const UAVListItem = styled.div<{ $placed?: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  background: ${({ $placed }) => ($placed ? '#f3f4f6' : 'white')};
  border: 1px solid ${({ $placed }) => ($placed ? '#d1d5db' : '#e5e7eb')};
  border-radius: 6px;
  cursor: ${({ $placed }) => ($placed ? 'default' : 'grab')};
  opacity: ${({ $placed }) => ($placed ? 0.5 : 1)};
  transition: all 0.2s ease;
  
  &:hover {
    border-color: ${({ $placed }) => ($placed ? '#d1d5db' : '#2c2c2c')};
    background: ${({ $placed }) => ($placed ? '#f3f4f6' : '#f9fafb')};
  }
  
  &:active {
    cursor: ${({ $placed }) => ($placed ? 'default' : 'grabbing')};
  }
`;

export const UAVListImage = styled.img`
  width: 32px;
  height: 32px;
  object-fit: cover;
  border-radius: 4px;
  background: #f3f4f6;
  flex-shrink: 0;
`;

export const UAVListImagePlaceholder = styled.div`
  width: 32px;
  height: 32px;
  background: #f3f4f6;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #9ca3af;
  flex-shrink: 0;
`;

export const UAVListContent = styled.div`
  flex: 1;
  min-width: 0;
`;

export const UAVListName = styled.div`
  font-size: 0.75rem;
  font-weight: 600;
  color: #2e2e2e;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const UAVListType = styled.div`
  font-size: 0.6875rem;
  color: #6b7280;
`;

export const FormationBuilderSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

export const FormationTypeSelector = styled.div`
  display: flex;
  gap: 0.375rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
`;

export const FormationTypeButton = styled.button<{ $active?: boolean }>`
  padding: 0.375rem 0.75rem;
  background: ${({ $active }) => ($active ? '#2c2c2c' : 'white')};
  color: ${({ $active }) => ($active ? 'white' : '#6b7280')};
  border: 1px solid ${({ $active }) => ($active ? '#2c2c2c' : '#e5e7eb')};
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${({ $active }) => ($active ? '#404040' : '#f9fafb')};
    border-color: #2c2c2c;
  }
`;

export const CoordinateSystemContainer = styled.div`
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

export const CoordinateDropZone = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

export const PlacedUAV = styled.div<{ $x: number; $y: number }>`
  position: absolute;
  left: ${({ $x }) => $x}%;
  top: ${({ $y }) => $y}%;
  transform: translate(-50%, -50%);
  cursor: move;
  z-index: 10;
  transition: all 0.1s ease;
  
  &:hover {
    z-index: 20;
  }
`;

export const PlacedUAVContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
`;

export const PlacedUAVImage = styled.img`
  width: 36px;
  height: 36px;
  object-fit: cover;
  border-radius: 6px;
  background: #f3f4f6;
  border: 2px solid #2c2c2c;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
`;

export const PlacedUAVImagePlaceholder = styled.div`
  width: 36px;
  height: 36px;
  background: #2c2c2c;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  border: 2px solid #2c2c2c;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
`;

export const PlacedUAVLabel = styled.div`
  font-size: 0.625rem;
  font-weight: 600;
  color: #2e2e2e;
  background: white;
  padding: 0.25rem 0.375rem;
  border-radius: 3px;
  white-space: nowrap;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
`;

export const RemoveButton = styled.button`
  position: absolute;
  top: -6px;
  right: -6px;
  width: 16px;
  height: 16px;
  background: #dc2626;
  color: white;
  border: 2px solid white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 0.625rem;
  line-height: 1;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  opacity: 0;
  transition: opacity 0.2s ease;
  
  ${PlacedUAV}:hover & {
    opacity: 1;
  }
  
  &:hover {
    background: #b91c1c;
  }
`;

export const InstructionText = styled.p`
  font-size: 0.75rem;
  color: #6b7280;
  text-align: center;
  margin: 0.75rem 0 0 0;
`;

export const CoordinateInfo = styled.div`
  position: absolute;
  bottom: 0.375rem;
  left: 0.375rem;
  background: rgba(255, 255, 255, 0.9);
  padding: 0.375rem;
  border-radius: 3px;
  font-size: 0.625rem;
  color: #6b7280;
  font-family: monospace;
  pointer-events: none;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
`;

export const AutoArrangeButton = styled.button`
  padding: 0.5rem 1rem;
  background: white;
  color: #2c2c2c;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: 0.75rem;
  
  &:hover {
    background: #f9fafb;
    border-color: #2c2c2c;
  }
`;