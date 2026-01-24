import type { CreateFormationDto, Formation } from "./formation.types";
import type { UAV } from "./uav.types";
import type { User } from "./user.types";
import type { CreateWaypointDto, Waypoint } from "./waypoint.types";
import type { CreateWeatherDataDto, WeatherData } from "./weather.types";

export interface Mission {
  id: number;
  name: string;
  date: string;
  description: string;
  locationLat: number;
  locationLon: number;
  createdAt: string;
  uavs: UAV[];
  responsibleUsers: User[];
  waypoints: Waypoint[];
  formations: Formation[];
  weatherData?: WeatherData;
}

export interface CreateMissionDto {
  name: string;
  locationLat: number;
  locationLon: number;
  date: string;
  description: string;
  weatherData?: CreateWeatherDataDto;
  uavIds: number[];
  responsibleUsers: string[];
  initialFormation: CreateFormationDto;
  waypoints: CreateWaypointDto[];
}