import { CloudRain, CheckCircle, AlertTriangle, Clock, Battery } from 'lucide-react';
import {
  PermitsGrid,
  PermitCard,
  PermitHeader,
  PermitTitle,
  PermitIcon,
  PermitContent,
  InfoRow,
  InfoLabel,
  InfoValue,
  StatusBadge,
  BatteryList,
  BatteryItem,
  BatteryInfo,
  BatteryBar,
  BatteryFill
} from './WeatherPermitsDisplay.styles';
import type { WeatherPermitsData } from '../../Wizards/MissionWizard/MissionWizard.types';

interface WeatherPermitsDisplayProps {
  data: WeatherPermitsData;
}

const WeatherPermitsDisplay = ({ data }: WeatherPermitsDisplayProps) => {
  if (!data.weather && !data.operationCategory && !data.projectedFlightTime) {
    return (
      <div style={{ 
        padding: '2rem', 
        textAlign: 'center', 
        color: '#9ca3af', 
        background: '#f9fafb', 
        borderRadius: '12px' 
      }}>
        No weather or permits data available
      </div>
    );
  }

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

  return (
    <PermitsGrid>
      {/* Weather */}
      {data.weather && (
        <PermitCard>
          <PermitHeader>
            <PermitIcon>
              <CloudRain size={24} color="#3b82f6" />
            </PermitIcon>
            <PermitTitle>Weather Conditions</PermitTitle>
          </PermitHeader>
          <PermitContent>
            {data.weather.iconCode && (
              <img 
                src={`https://openweathermap.org/img/wn/${getWeatherIcon(data.weather.iconCode)}@2x.png`}
                alt="Weather" 
                style={{ width: '80px', height: '80px', margin: '0 auto' }}
              />
            )}
            <InfoRow>
              <InfoLabel>Temperature</InfoLabel>
              <InfoValue>{data.weather.temperature}°C</InfoValue>
            </InfoRow>
            <InfoRow>
              <InfoLabel>Wind Speed</InfoLabel>
              <InfoValue>{data.weather.windSpeed} m/s</InfoValue>
            </InfoRow>
          </PermitContent>
        </PermitCard>
      )}

      {/* Operation Category */}
      {data.operationCategory && (
        <PermitCard>
          <PermitHeader>
            <PermitIcon>
              <CheckCircle size={24} color="#10b981" />
            </PermitIcon>
            <PermitTitle>Operation Category</PermitTitle>
          </PermitHeader>
          <PermitContent>
            <div style={{ 
              fontSize: '3rem', 
              fontWeight: 'bold', 
              textAlign: 'center', 
              color: '#2c2c2c',
              margin: '1rem 0'
            }}>
              {data.operationCategory.operationCategory}
            </div>
            <InfoRow>
              <InfoLabel>Heaviest UAV</InfoLabel>
              <InfoValue>{data.operationCategory.heviestUAV.name} ({data.operationCategory.heviestUAV.weight} kg)</InfoValue>
            </InfoRow>
            <InfoRow>
              <InfoLabel>UAV Class</InfoLabel>
              <InfoValue>{data.operationCategory.uavClass}</InfoValue>
            </InfoRow>
            <InfoRow>
              <InfoLabel>Zone Class</InfoLabel>
              <InfoValue>{data.operationCategory.zoneClass}</InfoValue>
            </InfoRow>
          </PermitContent>
        </PermitCard>
      )}

      {/* Recording Permission */}
      {data.recordingPermission && (
        <PermitCard>
          <PermitHeader>
            <PermitIcon>
              {data.recordingPermission.isRecordingPermissionRequired ? (
                <AlertTriangle size={24} color="#f59e0b" />
              ) : (
                <CheckCircle size={24} color="#10b981" />
              )}
            </PermitIcon>
            <PermitTitle>Recording Permission</PermitTitle>
          </PermitHeader>
          <PermitContent>
            <StatusBadge $isRequired={data.recordingPermission.isRecordingPermissionRequired}>
              {data.recordingPermission.isRecordingPermissionRequired ? 'Permission Required' : 'No Permission Needed'}
            </StatusBadge>
            {data.recordingPermission.message && (
              <div style={{ 
                marginTop: '1rem', 
                fontSize: '0.875rem', 
                color: '#6b7280', 
                lineHeight: 1.5 
              }}>
                {data.recordingPermission.message}
              </div>
            )}
          </PermitContent>
        </PermitCard>
      )}

      {/* Airspace Check */}
      {data.airspaceCheck && (
        <PermitCard>
          <PermitHeader>
            <PermitIcon>
              {data.airspaceCheck.crossesAirspace ? (
                <AlertTriangle size={24} color="#dc2626" />
              ) : (
                <CheckCircle size={24} color="#10b981" />
              )}
            </PermitIcon>
            <PermitTitle>Airspace Check</PermitTitle>
          </PermitHeader>
          <PermitContent>
            <StatusBadge $isRequired={data.airspaceCheck.crossesAirspace}>
              {data.airspaceCheck.crossesAirspace ? 'Airspace Violation' : 'Clear'}
            </StatusBadge>
            {data.airspaceCheck.message && (
              <div style={{ 
                marginTop: '1rem', 
                fontSize: '0.875rem', 
                color: '#6b7280', 
                lineHeight: 1.5 
              }}>
                {data.airspaceCheck.message}
              </div>
            )}
            {data.airspaceCheck.violations && data.airspaceCheck.violations.length > 0 && (
              <div style={{ marginTop: '1rem' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                  Violations:
                </div>
                {data.airspaceCheck.violations.map((v, idx) => (
                  <div key={idx} style={{ 
                    fontSize: '0.8125rem', 
                    color: '#dc2626', 
                    marginBottom: '0.25rem' 
                  }}>
                    • {v.airportName}  - {v.distance.toFixed(1)} km - {v.violationType}
                  </div>
                ))}
              </div>
            )}
          </PermitContent>
        </PermitCard>
      )}

      {/* Flight Time */}
      {data.projectedFlightTime && (
        <PermitCard style={{ gridColumn: 'span 2' }}>
          <PermitHeader>
            <PermitIcon>
              <Clock size={24} color="#6b7280" />
            </PermitIcon>
            <PermitTitle>Projected Flight Time</PermitTitle>
          </PermitHeader>
          <PermitContent>
            <div style={{ 
              fontSize: '2rem', 
              fontWeight: 'bold', 
              textAlign: 'center', 
              color: '#2c2c2c',
              marginBottom: '1.5rem'
            }}>
              {data.projectedFlightTime.projectedFlightTime}
            </div>

            {data.projectedFlightTime.flightTimeUAV && data.projectedFlightTime.flightTimeUAV.length > 0 && (
              <BatteryList>
                {data.projectedFlightTime.flightTimeUAV.map((uavTime, idx) => {
                  const batteryColor = uavTime.isFeasible 
                    ? (uavTime.batteryUsage > 80 ? '#f59e0b' : '#10b981')
                    : '#dc2626';

                  return (
                    <BatteryItem key={idx} $isFeasible={uavTime.isFeasible}>
                      <BatteryInfo>
                        <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>
                          UAV #{uavTime.uavId}
                        </div>
                        <div style={{ fontSize: '0.8125rem', color: '#6b7280' }}>
                          Flight Time: {uavTime.flightTime}
                        </div>
                      </BatteryInfo>
                      <BatteryBar>
                        <BatteryFill 
                          $percentage={uavTime.batteryUsage} 
                          $color={batteryColor}
                        />
                      </BatteryBar>
                      <div style={{ 
                        fontSize: '0.75rem', 
                        fontWeight: 600, 
                        color: batteryColor 
                      }}>
                        <Battery size={14} style={{ marginRight: '0.25rem' }} />
                        {uavTime.batteryUsage}%
                      </div>
                    </BatteryItem>
                  );
                })}
              </BatteryList>
            )}
          </PermitContent>
        </PermitCard>
      )}
    </PermitsGrid>
  );
};

export default WeatherPermitsDisplay;
