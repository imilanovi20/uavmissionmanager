import styled from 'styled-components';

export const SummaryContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: 100%;
  padding: 0;  /* ← Bez paddinga! */
`;

export const Section = styled.section`
  background: white;
  border-radius: 0;  /* ← Bez border radius za full width */
  border: none;
  border-top: 1px solid #e5e7eb;
  border-bottom: 1px solid #e5e7eb;
  overflow: hidden;
`;

export const SectionTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: #2c2c2c;
  margin: 0;
  padding: 1.25rem 2rem;  /* Padding samo unutar sekcije */
  border-bottom: 1px solid #e5e7eb;
  background: #fafafa;
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

export const MapContainer = styled.div`
  width: 100%;
  height: 500px;
  position: relative;
  background: #f3f4f6;
`;

export const CardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);  /* 4 kartice! */
  gap: 1.5rem;
  padding: 2rem;

  @media (max-width: 1200px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

export const Card = styled.div`
  padding: 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  transition: all 0.2s ease;
  background: white;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;

  &:hover {
    border-color: #2c2c2c;
    background: #f9fafb;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;

export const CardImage = styled.img`
  width: 100%;
  height: 120px;
  object-fit: cover;
  border-radius: 6px;
  background: #f3f4f6;
`;

export const CardImagePlaceholder = styled.div`
  width: 100%;
  height: 120px;
  background: #f3f4f6;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #9ca3af;
`;

export const CardContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

export const CardTitle = styled.h4`
  font-size: 0.95rem;
  font-weight: 600;
  color: #2c2c2c;
  margin: 0;
`;

export const CardSubtitle = styled.p`
  font-size: 0.8125rem;
  color: #6b7280;
  margin: 0;
`;

export const WaypointsSection = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  padding: 2rem;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

export const WaypointsColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const FormationsColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  position: sticky;
  top: 1rem;
  align-self: start;
`;

export const WaypointCard = styled.div`
  padding: 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: white;
  transition: all 0.2s ease;

  &:hover {
    border-color: #d1d5db;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  }
`;

export const WaypointHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
`;

export const WaypointNumber = styled.div`
  width: 32px;
  height: 32px;
  background: #2c2c2c;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
  font-weight: 600;
  flex-shrink: 0;
`;

export const WaypointCoords = styled.div`
  font-size: 0.8125rem;
  color: #6b7280;
  font-family: 'Courier New', monospace;
`;

export const TasksList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding-top: 0.5rem;
  border-top: 1px solid #f3f4f6;
`;

export const TaskItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.75rem;
  background: #f9fafb;
  border-radius: 6px;
  border: 1px solid #f3f4f6;
`;

export const TaskIcon = styled.div`
  font-size: 1.25rem;
  flex-shrink: 0;
`;

export const TaskDetails = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

export const TaskName = styled.div`
  font-size: 0.875rem;
  font-weight: 600;
  color: #2c2c2c;
`;

export const TaskParams = styled.div`
  font-size: 0.8125rem;
  color: #6b7280;
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
`;

export const FormationNavigation = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
`;

export const FormationInfo = styled.div`
  flex: 1;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

export const NavigationButton = styled.button`
  padding: 0.5rem;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  color: #374151;

  &:hover:not(:disabled) {
    background: #f9fafb;
    border-color: #d1d5db;
  }

  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
`;