import styled from 'styled-components';
import type { MissionStatus } from '../../Cards/WideCard/WideCard.types';

const FilterContainer = styled.div`
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
`;

const FilterButton = styled.button<{ $active: boolean; $color?: string }>`
  padding: 0.625rem 1.25rem;
  border: 2px solid ${({ $active, $color }) => 
    $active ? ($color || '#2c2c2c') : '#e5e7eb'
  };
  border-radius: 8px;
  background: ${({ $active, $color }) => 
    $active ? ($color || '#2c2c2c') : 'white'
  };
  color: ${({ $active }) => 
    $active ? 'white' : '#6b7280'
  };
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;

  &:hover {
    border-color: ${({ $color }) => $color || '#2c2c2c'};
    ${({ $active }) => !$active && `
      background: #f9fafb;
    `}
  }
`;

interface StatusFilterProps {
  activeFilter: MissionStatus | 'all';
  onFilterChange: (filter: MissionStatus | 'all') => void;
}

const StatusFilter = ({ activeFilter, onFilterChange }: StatusFilterProps) => {
  return (
    <FilterContainer>
      <FilterButton
        $active={activeFilter === 'all'}
        onClick={() => onFilterChange('all')}
      >
        All Missions
      </FilterButton>
      <FilterButton
        $active={activeFilter === 'upcoming'}
        $color="#1b5ee2"
        onClick={() => onFilterChange('upcoming')}
      >
        Upcoming
      </FilterButton>
      <FilterButton
        $active={activeFilter === 'active'}
        $color="#ef4444"
        onClick={() => onFilterChange('active')}
      >
        Active
      </FilterButton>
      <FilterButton
        $active={activeFilter === 'completed'}
        $color="#22c55e"
        onClick={() => onFilterChange('completed')}
      >
        Completed
      </FilterButton>
    </FilterContainer>
  );
};

export default StatusFilter;