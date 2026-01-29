import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Plane } from "lucide-react";
import FilterBar from "../../components/Bars/FilterBar/FilterBar";
import BlackButton from "../../components/Buttons/BlackButton/BlackButton";
import { Header, HeaderTop, PageContainer, Subtitle, Title } from "../../components/Containers/CardContainer.styles";
import WideCard from "../../components/Cards/WideCard/WideCard";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import { missionService } from "../../services/mission.service";
import type { Mission } from "../../types/mission.types";
import type { MissionStatus } from "../../components/Cards/WideCard/WideCard.types";
import styled from "styled-components";
import SearchBar from "../../components/Search/SearchBar/SearchBar";
import StatusFilter from "../../components/Search/Filter/StatusFilter";

const FiltersSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1.5rem;
`;

const SearchSection = styled.div`
  width: 100%;
`;

const FilterRow = styled.div`
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
`;

const MissionsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1.5rem;
`;

const EmptyState = styled.div`
  width: 100%;
  padding: 4rem 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: 1rem;
  color: #9ca3af;

  svg {
    opacity: 0.3;
  }

  h3 {
    margin: 0;
    font-size: 1.25rem;
    color: #6b7280;
  }

  p {
    margin: 0;
    font-size: 0.9375rem;
    color: #9ca3af;
  }
`;

const MissionPage = () => {
  const navigate = useNavigate();
  const { user, isAdmin } = useCurrentUser();
  const [showAllMissions, setShowAllMissions] = useState(false);
  const [missions, setMissions] = useState<Mission[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<MissionStatus | 'all'>('all');

  useEffect(() => {
    fetchMissions();
  }, [showAllMissions, user]);

  const fetchMissions = async () => {
    try {
      setLoading(true);
      const data = await missionService.getAllMissions();
      
      let filteredMissions = data;
      if (!isAdmin || !showAllMissions) {
        filteredMissions = data.filter(m => m.createdByUsername === user?.username);
      }
      
      setMissions(filteredMissions);
    } catch (error) {
      console.error('Failed to fetch missions:', error);
    } finally {
      setLoading(false);
    }
  };

  const getMissionStatus = (date: string): MissionStatus => {
    const missionDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const missionDay = new Date(missionDate);
    missionDay.setHours(0, 0, 0, 0);
    
    if (missionDay > today) return 'upcoming';
    if (missionDay < today) return 'completed';
    return 'active';
  };

  // Filtered and sorted missions
  const filteredMissions = useMemo(() => {
    let result = missions;

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(mission =>
        mission.name.toLowerCase().includes(query) ||
        mission.description.toLowerCase().includes(query) ||
        mission.createdByUsername.toLowerCase().includes(query)
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter(mission => getMissionStatus(mission.date) === statusFilter);
    }

    // Sort by date (newest execution date first)
    result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return result;
  }, [missions, searchQuery, statusFilter]);

  const handleMissionClick = (missionId: number) => {
    navigate(`/missions/${missionId}`);
  };

  const handleNewMission = () => {
    navigate('/missions/new');
  };

  return (
    <PageContainer>
      <Header>
        <HeaderTop>
          <div>
            <Title>Missions</Title>
            <Subtitle>Plan and manage UAV missions</Subtitle>
          </div>
          <BlackButton
            title="+ New Mission"
            onClick={handleNewMission}
            disabled={false}
            width="180px"
          />
        </HeaderTop>
      </Header>

      <FilterBar
        showAllMissions={showAllMissions}
        onFilterChange={setShowAllMissions}
        isAdmin={isAdmin}
      />

    <FiltersSection>
      <SearchSection>
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search missions by name, description, or creator..."
        />
      </SearchSection>
      
      <FilterRow>
        <StatusFilter
          activeFilter={statusFilter}
          onFilterChange={setStatusFilter}
        />
      </FilterRow>
    </FiltersSection>

      <MissionsList>
        {loading ? (
          <EmptyState>
            <Plane size={48} />
            <h3>Loading missions...</h3>
          </EmptyState>
        ) : filteredMissions.length === 0 ? (
          <EmptyState>
            <Plane size={48} />
            <h3>
              {searchQuery || statusFilter !== 'all' 
                ? 'No missions match your filters'
                : 'No missions found'
              }
            </h3>
            <p>
              {searchQuery || statusFilter !== 'all'
                ? 'Try adjusting your search or filters'
                : showAllMissions 
                  ? "No missions have been created yet. Click 'New Mission' to create one."
                  : "You haven't created any missions yet. Click 'New Mission' to get started."
              }
            </p>
          </EmptyState>
        ) : (
          filteredMissions.map(mission => (
            <WideCard
              key={mission.id}
              id={mission.id}
              title={mission.name}
              date={mission.date}
              description={mission.description}
              status={getMissionStatus(mission.date)}
              uavCount={mission.uavs?.length || 0}
              teamCount={mission.responsibleUsers?.length || 0}
              waypointCount={mission.waypoints?.length || 0}
              createdBy={mission.createdByUsername}
              onClick={() => handleMissionClick(mission.id)}
            />
          ))
        )}
      </MissionsList>
    </PageContainer>
  );
};

export default MissionPage;