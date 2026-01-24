import { useState } from "react";
import FilterBar from "../../components/Bars/FilterBar/FilterBar";
import BlackButton from "../../components/Buttons/BlackButton/BlackButton";
import {  Header, HeaderTop,  PageContainer, Subtitle, Title } from "../../components/Containers/CardContainer.styles";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import { useNavigate } from "react-router-dom";

const MissionPage = () => {
  const navigate = useNavigate();
  const { isAdmin } = useCurrentUser();
  const [ setShowWizard] = useState(false);
  const [showAllMissions, setShowAllMissions] = useState(false);

//  const { missions, loading, error, refetchMissions } = useMissions(showAllMissions);
/*
  const handleMissionClick = (missionId: number) => {
    navigate(`/missions/${missionId}`);
  };

  const handleWizardClose = () => {
    setShowWizard(false);
  };

  const handleWizardSuccess = () => {
    refetchMissions();
  };

  if (loading) {
    return (
      <PageContainer>
        <LoadingSpinner>Loading missions...</LoadingSpinner>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer>
        <ErrorMessage>{error}</ErrorMessage>
      </PageContainer>
    );
  }
    */

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
                onClick={() => {}}
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

      

        </PageContainer>
  );
};

export default MissionPage;