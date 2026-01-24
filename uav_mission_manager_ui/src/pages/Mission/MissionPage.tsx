import FilterBar from "../../components/Bars/FilterBar/FilterBar";
import BlackButton from "../../components/Buttons/BlackButton/BlackButton";
import {  Header, HeaderTop,  PageContainer, Subtitle, Title } from "../../components/Containers/CardContainer.styles";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const MissionPage = () => {
  const navigate = useNavigate();
  const { isAdmin } = useCurrentUser();
  const [showAllMissions, setShowAllMissions] = useState(false);


  /*
  const handleMissionClick = (missionId: number) => {
    navigate(`/missions/${missionId}`);
  };
  */

  const handleNewMission = () => {
    navigate('/missions/new');
  };
  
  /*
  const handleWizardSuccess = () => {
    missionService.getAllMissions();
  };
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
                onClick={() => handleNewMission()}
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