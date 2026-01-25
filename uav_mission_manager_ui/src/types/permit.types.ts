import type { PointDto } from "./pathPlanning.types";
import type { UAV } from "./uav.types";

export interface GetOperationCategoryDto {
  waypoints: PointDto[];
  uavIds: number[];
}

export interface ZoneAnalysisDto {
  hasBuildings: boolean;
  hasForests: boolean;
  hasWater: boolean;
  hasUrbanArea: boolean;
  populationDensity: string;
  nearestAirportDistance: number;
}

export interface OperationCategoryResponse {
  success: boolean;
  heviestUAV: UAV;
  uavClass: string;
  zoneClass: string;
  operationCategory: string;
  analysis: ZoneAnalysisDto;
}

export interface RecordingPermissionDto {
  isRecordingPermissionRequired: boolean;
  message: string;
}

export interface AirspaceViolationDto {
  airportName: string;
  airportCode: string;
  distance: number;
  latitude: number;
  longitude: number;
  violationType: string;
}

export interface AirspaceCheckResult {
  success: boolean;
  crossesAirspace: boolean;
  message: string;
  airportsViolated: number;
  violations: AirspaceViolationDto[];
}

export interface PermitCheckData {
  operationCategory: OperationCategoryResponse | null;
  recordingPermission: RecordingPermissionDto | null;
  airspaceCheck: AirspaceCheckResult | null;
  isLoading: boolean;
  error: string | null;
}