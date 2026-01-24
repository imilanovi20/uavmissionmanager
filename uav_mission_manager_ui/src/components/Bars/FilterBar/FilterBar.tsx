import { FilterBarContainer, FilterButton } from './FilterBar.styles';
import type { FilterBarProps } from './FilterBar.types';

const FilterBar = ({ showAllMissions, onFilterChange, isAdmin }: FilterBarProps) => {
  if (!isAdmin) {
    return null;
  }

  return (
    <FilterBarContainer>
      <FilterButton
        active={!showAllMissions}
        onClick={() => onFilterChange(false)}
      >
        My Missions
      </FilterButton>
      <FilterButton
        active={showAllMissions}
        onClick={() => onFilterChange(true)}
      >
        All Missions
      </FilterButton>
    </FilterBarContainer>
  );
};

export default FilterBar;
