import { useEffect, useState } from 'react';
import { CheckCircle, RefreshCw, Wind, Thermometer, Compass, Shield, Camera, Plane } from 'lucide-react';
import type { WeatherPermitsData } from '../../MissionWizard.types';
import type { PointDto } from '../../../../../types/pathPlanning.types';
import type { Task } from '../../../../../types/task.types';
import { weatherService } from '../../../../../services/weather.service';
import { permitService } from '../../../../../services/permit.service';
import {
  StepContainer,
  StepDescription,
  LoadingOverlay,
  LoadingSpinner,
  LoadingText,
  RefreshAllButton,
  CardsGrid,
  Card,
  CardHeader,
  CardTitle,
  SuccessIcon,
  CategoryBadge,
  CategoryLetter,
  CategoryLabel,
  InfoSection,
  InfoLabel,
  InfoValue,
  StatusBadge,
  StatusIcon,
  StatusText,
  MessageBox,
  NoDataText,
  WeatherIcon,
  WeatherDetails,
  WeatherDetail,
  WeatherLabel,
  WeatherValue,
} from './WeatherPermitsStep.styles';

interface WeatherPermitsStepProps {
  data: WeatherPermitsData;
  onUpdate: (data: Partial<WeatherPermitsData>) => void;
  missionDate: string;
  routePoints: PointDto[];
  uavIds: number[];
  allTasks: Task[];
}

const WeatherPermitsStep: React.FC<WeatherPermitsStepProps> = ({
  data,
  onUpdate,
  missionDate,
  routePoints,
  uavIds,
  allTasks,
}) => {
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    if (routePoints.length > 0 && isInitialLoad) {
      fetchAllData();
    }
  }, []);

  const fetchAllData = async () => {
    setIsRefreshing(true);
    
    try {
      // Fetch everything in parallel
      const [weatherResult, operationCategoryResult, recordingPermissionResult, airspaceCheckResult] = await Promise.allSettled([
        weatherService.getWeatherData({
          date: missionDate,
          points: routePoints,
        }),
        permitService.calculateOperationCategory({
          waypoints: routePoints,
          uavIds: uavIds,
        }),
        permitService.checkRecordingPermission(allTasks),
        permitService.checkAirspace(routePoints),
      ]);

      // Process results
      const newData: Partial<WeatherPermitsData> = {
        isWeatherLoading: false,
        isPermitsLoading: false,
      };

      // Weather
      if (weatherResult.status === 'fulfilled') {
        newData.weather = weatherResult.value;
        newData.weatherError = null;
        console.log('Weather loaded:', weatherResult.value);
      } else {
        newData.weather = null;
        newData.weatherError = weatherResult.reason?.message || 'Failed to fetch weather';
        console.error('Weather error:', weatherResult.reason);
      }

      // Operation Category
      if (operationCategoryResult.status === 'fulfilled') {
        newData.operationCategory = operationCategoryResult.value;
        console.log('Operation category loaded:', operationCategoryResult.value);
      } else {
        newData.operationCategory = null;
        console.error('Operation category error:', operationCategoryResult.reason);
      }

      // Recording Permission
      if (recordingPermissionResult.status === 'fulfilled') {
        newData.recordingPermission = recordingPermissionResult.value;
        console.log('Recording permission loaded:', recordingPermissionResult.value);
      } else {
        newData.recordingPermission = null;
        console.error('Recording permission error:', recordingPermissionResult.reason);
      }

      // Airspace Check
      if (airspaceCheckResult.status === 'fulfilled') {
        newData.airspaceCheck = airspaceCheckResult.value;
        console.log('Airspace check loaded:', airspaceCheckResult.value);
      } else {
        newData.airspaceCheck = null;
        console.error('Airspace check error:', airspaceCheckResult.reason);
      }

      // Check if any permit calls failed
      const permitsFailed = 
        operationCategoryResult.status === 'rejected' ||
        recordingPermissionResult.status === 'rejected' ||
        airspaceCheckResult.status === 'rejected';

      if (permitsFailed) {
        newData.permitsError = 'Some permit checks failed. Please try again.';
      } else {
        newData.permitsError = null;
      }

      // Update all data at once
      onUpdate(newData);

    } catch (error) {
      console.error('Unexpected error:', error);
      onUpdate({
        weatherError: 'Unexpected error occurred',
        permitsError: 'Unexpected error occurred',
        isWeatherLoading: false,
        isPermitsLoading: false,
      });
    } finally {
      setIsRefreshing(false);
      setIsInitialLoad(false);
    }
  };

  const getWeatherIcon = (code: number): string => {
    const iconMap: Record<number, string> = {
      0: '01d', 1: '02d', 2: '03d', 3: '04d',
      45: '50d', 48: '50d',
      51: '09d', 53: '09d', 55: '09d',
      61: '10d', 63: '10d', 65: '10d',
      71: '13d', 73: '13d', 75: '13d', 77: '13d',
      80: '09d', 81: '09d', 82: '09d',
      85: '13d', 86: '13d',
      95: '11d', 96: '11d', 99: '11d',
    };
    return iconMap[code] || '01d';
  };

  const hasAnyData = data.weather || data.operationCategory || data.recordingPermission || data.airspaceCheck;
  const hasErrors = data.weatherError || data.permitsError;

  // Show loading overlay during initial load or refresh
  if (isRefreshing && !hasAnyData) {
    return (
      <StepContainer>
        <StepDescription>
          Reviewing weather conditions and permit requirements for your mission
        </StepDescription>
        <LoadingOverlay>
          <LoadingSpinner className="spin" />
          <LoadingText>Loading weather and permits data...</LoadingText>
        </LoadingOverlay>
      </StepContainer>
    );
  }

  return (
    <StepContainer>
      <StepDescription>
        Reviewing weather conditions and permit requirements for your mission
      </StepDescription>

      {/* Refresh All Button */}
      {(hasErrors || hasAnyData) && (
        <RefreshAllButton onClick={fetchAllData} disabled={isRefreshing}>
          <RefreshCw size={20} className={isRefreshing ? 'spin' : ''} />
          {isRefreshing ? 'Refreshing...' : 'Refresh All'}
        </RefreshAllButton>
      )}

      <CardsGrid>
        {/* Weather Card */}
        <Card>
          <CardHeader>
            <CardTitle>Weather Conditions</CardTitle>
          </CardHeader>
          
          {data.weather ? (
            <>
              <WeatherIcon
                src={`https://openweathermap.org/img/wn/${getWeatherIcon(data.weather.weatherCode)}@2x.png`}
                alt="Weather icon"
              />
              <WeatherDetails>
                <WeatherDetail>
                  <Thermometer size={16} />
                  <div>
                    <WeatherLabel>Temperature</WeatherLabel>
                    <WeatherValue>{data.weather.temperature}°C</WeatherValue>
                  </div>
                </WeatherDetail>
                <WeatherDetail>
                  <Wind size={16} />
                  <div>
                    <WeatherLabel>Wind Speed</WeatherLabel>
                    <WeatherValue>{data.weather.windSpeed} km/h</WeatherValue>
                  </div>
                </WeatherDetail>
                <WeatherDetail>
                  <Compass size={16} />
                  <div>
                    <WeatherLabel>Direction</WeatherLabel>
                    <WeatherValue>{data.weather.windDirection}</WeatherValue>
                  </div>
                </WeatherDetail>
              </WeatherDetails>
            </>
          ) : data.weatherError ? (
            <NoDataText style={{ color: '#dc2626' }}>{data.weatherError}</NoDataText>
          ) : (
            <NoDataText>No data available</NoDataText>
          )}
        </Card>

        {/* Operation Category Card */}
        <Card $hasSuccess={!!data.operationCategory}>
          <CardHeader>
            <CardTitle>Operation Category</CardTitle>
            {data.operationCategory && <SuccessIcon><CheckCircle size={20} /></SuccessIcon>}
          </CardHeader>

          {data.operationCategory ? (
            <>
              <CategoryBadge>
                <Shield size={24} color="#64748b" />
                <div>
                  <CategoryLabel>CATEGORY</CategoryLabel>
                  <CategoryLetter>{data.operationCategory.operationCategory}</CategoryLetter>
                </div>
              </CategoryBadge>

              <InfoSection>
                <InfoLabel>HEAVIEST UAV</InfoLabel>
                <InfoValue>{data.operationCategory.heviestUAV.name} ({data.operationCategory.heviestUAV.weight} kg)</InfoValue>
              </InfoSection>

              <InfoSection>
                <InfoLabel>UAV CLASS</InfoLabel>
                <InfoValue>{data.operationCategory.uavClass}</InfoValue>
              </InfoSection>

              <InfoSection>
                <InfoLabel>ZONE CLASS</InfoLabel>
                <InfoValue>{data.operationCategory.zoneClass}</InfoValue>
              </InfoSection>
            </>
          ) : data.permitsError ? (
            <NoDataText style={{ color: '#dc2626' }}>Failed to load</NoDataText>
          ) : (
            <NoDataText>No data available</NoDataText>
          )}
        </Card>

        {/* Recording Permission Card */}
        <Card $hasSuccess={data.recordingPermission && !data.recordingPermission.isRecordingPermissionRequired}>
          <CardHeader>
            <CardTitle>Recording Permission</CardTitle>
            {data.recordingPermission && !data.recordingPermission.isRecordingPermissionRequired && (
              <SuccessIcon><CheckCircle size={20} /></SuccessIcon>
            )}
          </CardHeader>

          {data.recordingPermission ? (
            <>
              <StatusBadge $isGreen={!data.recordingPermission.isRecordingPermissionRequired}>
                <StatusIcon>
                  <Camera size={20} />
                </StatusIcon>
                <div>
                  <CategoryLabel>STATUS</CategoryLabel>
                  <StatusText>
                    {data.recordingPermission.isRecordingPermissionRequired 
                      ? 'Permission Required' 
                      : 'No Permission Needed'}
                  </StatusText>
                </div>
              </StatusBadge>

              {data.recordingPermission.message && (
                <MessageBox>{data.recordingPermission.message}</MessageBox>
              )}
            </>
          ) : data.permitsError ? (
            <NoDataText style={{ color: '#dc2626' }}>Failed to load</NoDataText>
          ) : (
            <NoDataText>No data available</NoDataText>
          )}
        </Card>

        {/* Airspace Check Card */}
        <Card $hasSuccess={data.airspaceCheck && !data.airspaceCheck.crossesAirspace}>
          <CardHeader>
            <CardTitle>Airspace Check</CardTitle>
            {data.airspaceCheck && !data.airspaceCheck.crossesAirspace && (
              <SuccessIcon><CheckCircle size={20} /></SuccessIcon>
            )}
          </CardHeader>

          {data.airspaceCheck ? (
            <>
              <StatusBadge $isGreen={!data.airspaceCheck.crossesAirspace}>
                <StatusIcon>
                  <Plane size={20} />
                </StatusIcon>
                <div>
                  <CategoryLabel>STATUS</CategoryLabel>
                  <StatusText>
                    {data.airspaceCheck.crossesAirspace ? 'Airspace Violation' : 'Clear Airspace'}
                  </StatusText>
                </div>
              </StatusBadge>

              {data.airspaceCheck.message && (
                <MessageBox>{data.airspaceCheck.message}</MessageBox>
              )}
            </>
          ) : data.permitsError ? (
            <NoDataText style={{ color: '#dc2626' }}>Failed to load</NoDataText>
          ) : (
            <NoDataText>No data available</NoDataText>
          )}
        </Card>
      </CardsGrid>
    </StepContainer>
  );
};

export default WeatherPermitsStep;