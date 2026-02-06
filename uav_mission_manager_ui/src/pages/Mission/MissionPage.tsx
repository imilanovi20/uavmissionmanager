/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plane } from "lucide-react";
import FilterBar from "../../components/Bars/FilterBar/FilterBar";
import BlackButton from "../../components/Buttons/BlackButton/BlackButton";
import { Header, HeaderTop, PageContainer, Subtitle, Title } from "../../components/Containers/CardContainer.styles";
import WideCard from "../../components/Cards/WideCard/WideCard";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import { useMissions } from "../../hooks/useMissions";
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

    const {
        loading,
        searchQuery,
        setSearchQuery,
        statusFilter,
        setStatusFilter,
        filteredMissions,
        deleteMission,
        getMissionStatus
    } = useMissions({
        showAllMissions,
        currentUsername: user?.username,
        isAdmin
    });

    const handleMissionClick = (missionId: number) => {
        navigate(`/missions/${missionId}`);
    };

    const handleNewMission = () => {
        navigate('/missions/new');
    };

    const handleDeleteMission = async (id: number, name: string) => {
        if (window.confirm(`Are you sure you want to delete mission "${name}"?`)) {
            try {
                await deleteMission(id);
            } catch (error) {
                alert('Failed to delete mission. Please try again.');
            }
        }
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
                            showDelete={isAdmin}
                            onDelete={() => handleDeleteMission(mission.id, mission.name)}
                        />
                    ))
                )}
            </MissionsList>
        </PageContainer>
    );
};

export default MissionPage;