import type { CreateWaypointDto } from '../../../types/mission.types';
import type { UAV } from '../../../types/uav.types';
import type { User } from '../../../types/user.types';

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

export interface FormationData {
  formationType: string;
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

export interface SummaryData extends GeneralInfoData, UAVSelectionData, FormationData, ResponsiblePersonsData, WaypointsData {}

export interface StepProps<T = any> {
  data: T;
  onUpdate: (data: Partial<T>) => void;
  onNext?: () => void;
}
