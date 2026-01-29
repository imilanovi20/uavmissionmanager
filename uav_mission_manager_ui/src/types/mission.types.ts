import type { CreateFormationDto, Formation } from "./formation.types";
import type { ObstacleDto } from "./pathPlanning.types";
import type { UAV } from "./uav.types";
import type { User } from "./user.types";
import type { CreateWaypointDto, Waypoint } from "./waypoint.types";
import type { CreateWeatherDataDto, WeatherData } from "./weather.types";

export interface Mission {
    id: number;
    name: string;
    date: string; 
    description: string;
    createdAt: string;
    createdByUsername: string;

    weatherData?: WeatherData;
    permitData?: PermitDataDto;
    flightTimeData?: FlightTimeDataDto;
    optimalRoute?: OptimalRouteDto;
    obstacles?: ObstacleDto[];

    uavs: UAV[];
    responsibleUsers: User[];
    waypoints: Waypoint[];
    formations: Formation[];
}

export interface AirspaceViolationDto {
    airportName: string;
    code: string;
    distance: number;
    lat: number;
    lng: number;
    violationType: string;
}

export interface PermitDataDto {
    operationCategory: string;
    heaviestUAV: number;
    uavOperationClass: string;
    zoneOperationClass: string;
    isRecordingPermissionRequired: boolean;
    crossesAirspace: boolean;
    crossesAirspaceMessage?: string;
    violations?: AirspaceViolationDto[];
}

export interface FlightTimeUAVDto {
    uavId: number;
    flightTime: string;
    batteryUsage: number;
    isFeasible: boolean;
}

export interface FlightTimeDataDto {
    projectedFlightTime: string;
    uavFlightTimes?: FlightTimeUAVDto[];
}

export interface RoutePointDto {
    order: number;
    lat: number;
    lng: number;
}

export interface OptimalRouteDto {
    algorithm: string;
    totalDistance: number;
    totalPoints: number;
    optimizationPointsAdded: number;
    points: RoutePointDto[];
}


export interface CreateMissionDto {
    name: string;
    date: string;
    description: string;
    createdByUsername: string;

    weatherData?: CreateWeatherDataDto;
    permitData?: PermitDataDto;
    flightTimeData?: FlightTimeDataDto;

    optimalRoute?: OptimalRouteDto;
    obstacles?: ObstacleDto[];

    uavIds: number[];
    responsibleUsers: string[];
    initialFormation: CreateFormationDto;
    waypoints: CreateWaypointDto[];
}


export interface CreateMissionResponseDto {
  mission: Mission;
  response: string;
}