export interface FilterBarProps {
  showAllMissions: boolean;
  onFilterChange: (showAll: boolean) => void;
  isAdmin: boolean;
}
