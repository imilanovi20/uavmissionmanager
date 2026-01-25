import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

export const TopSection = styled.div`
  display: flex;
  gap: 1.5rem;
  
  @media (max-width: 1024px) {
    flex-direction: column;
  }
`;

export const MapSection = styled.div`
  flex: 1;
  min-height: 500px;
`;

export const AddPanelSection = styled.div`
  flex: 0 0 320px;
  
  @media (max-width: 1024px) {
    flex: 1;
  }
`;

export const WaypointsListSection = styled.div`
  display: flex;
  flex-direction: column;
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

export const Title = styled.h3`
  margin: 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: #2e2e2e;
`;

/* Add Waypoint Panel - IMPROVED */
export const AddWaypointPanel = styled.div`
  padding: 1.25rem;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  margin-bottom: 1rem;
`;

export const AddWaypointTitle = styled.div`
  font-size: 0.875rem;
  font-weight: 600;
  color: #2e2e2e;
  margin-bottom: 1rem;
`;

export const InputGroup = styled.div`
  margin-bottom: 0.875rem;
  
  &:last-of-type {
    margin-bottom: 1rem;
  }
`;

export const InputLabel = styled.label`
  display: block;
  font-size: 0.75rem;
  font-weight: 500;
  color: #6b7280;
  margin-bottom: 0.375rem;
`;

export const AddWaypointInput = styled.input`
  width: 100%;
  padding: 0.625rem 0.875rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 0.875rem;
  background: white;
  transition: all 0.2s ease;
  box-sizing: border-box;
  
  &:focus {
    outline: none;
    border-color: #2c2c2c;
    box-shadow: 0 0 0 3px rgba(44, 44, 44, 0.1);
  }
  
  &::placeholder {
    color: #9ca3af;
  }
`;

export const AddWaypointButton = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem;
  background: #2c2c2c;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  
  &:hover {
    background: #404040;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  &:active {
    transform: translateY(1px);
  }
`;

export const WaypointsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
  flex: 1;
  overflow-y: auto;
  padding-right: 0.5rem;
  
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

export const WaypointCard = styled.div<{ $active?: boolean }>`
  padding: 0.75rem;
  border: 1px solid ${({ $active }) => ($active ? '#2c2c2c' : '#e5e7eb')};
  border-radius: 8px;
  background: ${({ $active }) => ($active ? '#f9fafb' : 'white')};
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: #2c2c2c;
    background: #f9fafb;
  }
`;

export const WaypointHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
`;

export const WaypointTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-weight: 600;
  font-size: 0.9375rem;
  color: #2e2e2e;
`;

export const WaypointActions = styled.div`
  display: flex;
  gap: 0.25rem;
`;

export const IconButton = styled.button`
  padding: 0.25rem;
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background: #f3f4f6;
    color: #2c2c2c;
  }
`;

export const WaypointInfo = styled.div`
  font-size: 0.8125rem;
  color: #6b7280;
  margin-bottom: 0.5rem;
`;

export const TasksList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  margin-bottom: 0.5rem;
`;

export const TaskItem = styled.div<{ $auto?: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.375rem 0.5rem;
  background: ${({ $auto }) => ($auto ? '#f3f4f6' : '#fef3c7')};
  border-radius: 4px;
  font-size: 0.8125rem;
`;

export const TaskName = styled.span`
  font-weight: 500;
  color: #2e2e2e;
`;

export const TaskBadge = styled.span<{ $auto?: boolean }>`
  padding: 0.125rem 0.375rem;
  background: ${({ $auto }) => ($auto ? '#e5e7eb' : '#fbbf24')};
  color: ${({ $auto }) => ($auto ? '#6b7280' : '#92400e')};
  border-radius: 3px;
  font-size: 0.6875rem;
  font-weight: 600;
`;

export const AddTaskButton = styled.button`
  width: 100%;
  padding: 0.375rem;
  background: white;
  color: #6b7280;
  border: 1px dashed #d1d5db;
  border-radius: 6px;
  font-size: 0.8125rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: #2c2c2c;
    color: #2c2c2c;
    background: #f9fafb;
  }
`;

export const EmptyState = styled.div`
  padding: 2rem 1rem;
  text-align: center;
  background: #f9fafb;
  border-radius: 8px;
  color: #6b7280;
`;

export const Summary = styled.div`
  margin-top: 0.75rem;
  padding: 0.75rem;
  background: #f9fafb;
  border-radius: 6px;
  font-size: 0.75rem;
  color: #6b7280;
`;