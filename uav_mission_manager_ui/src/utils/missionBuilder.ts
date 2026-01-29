import type { Mission, PermitDataDto, FlightTimeDataDto, OptimalRouteDto } from '../types/mission.types';
import type { Formation, UAVPosition as FormationUAVPosition } from '../types/formation.types';
import type { Waypoint } from '../types/waypoint.types';
import type { UAV } from '../types/uav.types';
import type { User } from '../types/user.types';
import type { WeatherData } from '../types/weather.types';
import type { ObstacleDto } from '../types/pathPlanning.types';

interface MissionBuilderProps {
  name: string;
  date: string;
  description: string;
  
  selectedUAVs: UAV[];
  
  selectedUsers: User[];
  
  waypoints: Waypoint[];
  
  initialFormationType: string;
  formations?: Formation[];
  
  weatherData?: WeatherData | null;
  operationCategory?: any;
  recordingPermission?: any;
  airspaceCheck?: any;
  projectedFlightTime?: any;
  
  optimalRoute?: any;
  obstacles?: ObstacleDto[];
}

export const buildMissionFromWizardState = ({
  name,
  date,
  description,
  selectedUAVs,
  selectedUsers,
  waypoints,
  initialFormationType,
  formations,
  weatherData,
  operationCategory,
  recordingPermission,
  airspaceCheck,
  projectedFlightTime,
  optimalRoute,
  obstacles
}: MissionBuilderProps): Mission => {
  
  const permitData: PermitDataDto | undefined = (operationCategory || recordingPermission || airspaceCheck) ? {
    operationCategory: operationCategory?.operationCategory || '',
    heaviestUAV: operationCategory?.heviestUAV?.weight || 0,
    uavOperationClass: operationCategory?.uavClass || '',
    zoneOperationClass: operationCategory?.zoneClass || '',
    isRecordingPermissionRequired: recordingPermission?.isRecordingPermissionRequired || false,
    crossesAirspace: airspaceCheck?.crossesAirspace || false,
    crossesAirspaceMessage: airspaceCheck?.message,
    violations: airspaceCheck?.violations || []
  } : undefined;
  
  // Build FlightTimeDataDto
  const flightTimeData: FlightTimeDataDto | undefined = projectedFlightTime ? {
    projectedFlightTime: projectedFlightTime.projectedFlightTime,
    uavFlightTimes: projectedFlightTime.flightTimeUAV?.map((ft: any) => ({
      uavId: ft.uavId,
      flightTime: ft.flightTime,
      batteryUsage: ft.batteryUsage,
      isFeasible: ft.isFeasible
    }))
  } : undefined;
  
  // Build OptimalRouteDto
  const optimalRouteDto: OptimalRouteDto | undefined = optimalRoute ? {
    algorithm: optimalRoute.algorithm,
    totalDistance: optimalRoute.totalDistance,
    totalPoints: optimalRoute.totalPoints,
    optimizationPointsAdded: optimalRoute.optimizationPointsAdded,
    points: optimalRoute.optimizedRoute?.map((p: any) => ({
      order: p.order,
      lat: p.lat,
      lng: p.lng
    })) || []
  } : undefined;
  
  // Build initial formation
  const initialFormation: Formation = {
    id: 0,
    formationType: initialFormationType,
    order: 0,
    waypointId: waypoints[0]?.id,
    uavPositions: selectedUAVs.map((uav, index) => ({
      id: index,
      uavId: uav.id,
      positionX: index * 10,
      positionY: 0,
      positionZ: 0
    }))
  };
  
  const mission: Mission = {
    id: 0,
    name,
    date,
    description,
    createdAt: new Date().toISOString(),
    createdByUsername: localStorage.getItem('username') || 'unknown',
    
    weatherData: weatherData || undefined,
    permitData,
    flightTimeData,
    optimalRoute: optimalRouteDto,
    obstacles: obstacles || [],
    
    uavs: selectedUAVs,
    responsibleUsers: selectedUsers,
    waypoints,
    formations: formations || [initialFormation]
  };
  
  return mission;
};
