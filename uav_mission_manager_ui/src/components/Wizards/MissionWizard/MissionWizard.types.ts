import type { UAV } from '../../../types/uav.types';
import type { User } from '../../../types/user.types';
import type { CreateWaypointDto } from '../../../types/waypoint.types';
import type { RouteOptimizationData } from '../../../types/pathPlanning.types';
import type { WeatherData } from '../../../types/weather.types';
import type { 
  OperationCategoryResponse, 
  RecordingPermissionDto, 
  AirspaceCheckResult,
  ProjectedFlightTimeResponseDto
} from '../../../types/permit.types';

export interface GeneralInfoData {
  name: string;
  date: string;
  description: string;
  locationLat: number;
  locationLon: number;
}

export interface UAVSelectionData {
  selectedUAVIds: number[];
  availableUAVs: UAV[];
}

export interface UAVPosition {
  uavId: number;
  positionX: number;
  positionY: number;
  positionZ: number;
}

export interface FormationData {
  formationType: string;
  positions: UAVPosition[];
}

export interface ResponsiblePersonsData {
  selectedUsernames: string[];
  availableUsers: User[];
}

export interface WaypointsData {
  waypoints: CreateWaypointDto[];
  locationLat: number;
  locationLon: number;
}

export interface WeatherPermitsData {
  weather: WeatherData | null;
  operationCategory: OperationCategoryResponse | null;
  recordingPermission: RecordingPermissionDto | null;
  airspaceCheck: AirspaceCheckResult | null;
  projectedFlightTime: ProjectedFlightTimeResponseDto | null;
  isWeatherLoading: boolean;
  isPermitsLoading: boolean;
  weatherError: string | null;
  permitsError: string | null;
}

export interface SummaryData extends 
  GeneralInfoData, 
  UAVSelectionData, 
  FormationData, 
  ResponsiblePersonsData, 
  WaypointsData {}

export interface StepProps<T = any> {
  data: T;
  onUpdate: (data: Partial<T>) => void;
  onNext?: () => void;
}

export interface MissionWizardProps {
  onClose: () => void;
  onSuccess: () => void;
}

export const STEPS = [
  'General Info',
  'Select UAVs',
  'Formation',
  'Responsible Persons',
  'Waypoints',
  'Route Optimization',
  'Weather & Permits',
  'Summary'
];

// Re-export RouteOptimizationData for convenience
export type { RouteOptimizationData };