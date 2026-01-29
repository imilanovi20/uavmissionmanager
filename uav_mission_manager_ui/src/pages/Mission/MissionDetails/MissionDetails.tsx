import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader } from 'lucide-react';
import styled from 'styled-components';
import { Header, HeaderTop, PageContainer, Subtitle } from '../../../components/Containers/CardContainer.styles';
import MissionSummary from '../../../components/Layouts/MissionSummary/MissionSummary';
import { missionService } from '../../../services/mission.service';
import type { Mission } from '../../../types/mission.types';
import { Title } from '../../Login/LoginPage.styles';

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  padding: 0.5rem 0;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  transition: color 0.2s ease;

  &:hover {
    color: #2c2c2c;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  flex-direction: column;
  gap: 1rem;
`;

const LoadingSpinner = styled(Loader)`
  color: #9ca3af;
  animation: spin 1s linear infinite;

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;

const LoadingText = styled.p`
  color: #6b7280;
  margin: 0;
`;

const ErrorContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  flex-direction: column;
  gap: 1rem;
`;

const ErrorText = styled.p`
  color: #ef4444;
  font-size: 1.125rem;
  font-weight: 600;
  margin: 0;
`;

const ErrorButton = styled.button`
  padding: 0.75rem 1.5rem;
  background: #2c2c2c;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9375rem;
  font-weight: 600;
  transition: all 0.2s ease;

  &:hover {
    background: #404040;
    transform: translateY(-1px);
  }
`;

const MissionDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [mission, setMission] = useState<Mission | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchMission(parseInt(id));
    }
  }, [id]);

  const fetchMission = async (missionId: number) => {
    try {
      setLoading(true);
      setError(null);
      const data = await missionService.getMissionById(missionId);
      setMission(data);
    } catch (err: any) {
      console.error('Failed to fetch mission:', err);
      setError(err.response?.data?.message || 'Failed to load mission details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <PageContainer>
        <LoadingContainer>
          <LoadingSpinner size={48} />
          <LoadingText>Loading mission...</LoadingText>
        </LoadingContainer>
      </PageContainer>
    );
  }

  if (error || !mission) {
    return (
      <PageContainer>
        <ErrorContainer>
          <ErrorText>{error || 'Mission not found'}</ErrorText>
          <ErrorButton onClick={() => navigate('/missions')}>
            Back to Missions
          </ErrorButton>
        </ErrorContainer>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Header>
        <HeaderTop>
          <div>
            <BackButton onClick={() => navigate('/missions')}>
              <ArrowLeft size={16} />
              Back to Missions
            </BackButton>
            <Title>{mission.name}</Title>
            <Subtitle>Mission Details</Subtitle>
          </div>
        </HeaderTop>
      </Header>

      <MissionSummary
        name={mission.name}
        date={mission.date}
        description={mission.description}
        selectedUAVs={mission.uavs || []}
        responsibleUsers={mission.responsibleUsers || []}
        waypoints={mission.waypoints || []}
        initialFormationType={mission.initialFormation?.formationType || 'Line'}
        initialFormationPositions={mission.initialFormation?.uavPositions || []}
        routeOptimization={{
          avoidTags: [],
          detectedObstacles: mission.obstacles || [],
          removedObstacleIndexes: [],
          optimalRoute: mission.optimalRoute ? {
            algorithm: mission.optimalRoute.algorithm,
            totalDistance: mission.optimalRoute.totalDistance,
            totalPoints: mission.optimalRoute.totalPoints,
            optimizationPointsAdded: mission.optimalRoute.optimizationPointsAdded,
            optimizedRoute: mission.optimalRoute.points?.map(p => ({
              order: p.order,
              lat: p.lat,
              lng: p.lng
            })) || []
          } : null
        }}
        weatherPermits={mission.weatherData || mission.permitData || mission.flightTimeData ? {
          weather: mission.weatherData || null,
          operationCategory: mission.permitData ? {
            operationCategory: mission.permitData.operationCategory,
            heviestUAV: {
              name: 'UAV',
              weight: mission.permitData.heaviestUAV
            },
            uavClass: mission.permitData.uavOperationClass,
            zoneClass: mission.permitData.zoneOperationClass
          } : null,
          recordingPermission: mission.permitData ? {
            isRecordingPermissionRequired: mission.permitData.isRecordingPermissionRequired
          } : null,
          airspaceCheck: mission.permitData ? {
            crossesAirspace: mission.permitData.crossesAirspace,
            message: mission.permitData.crossesAirspaceMessage,
            violations: mission.permitData.violations || []
          } : null,
          projectedFlightTime: mission.flightTimeData || null,
          isWeatherLoading: false,
          isPermitsLoading: false,
          weatherError: null,
          permitsError: null
        } : undefined}
      />
    </PageContainer>
  );
};

export default MissionDetailPage;