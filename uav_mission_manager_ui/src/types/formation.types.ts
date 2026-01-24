export interface Formation {
  id: number;
  formationType: string;
  order: number;
  waypointId?: number;
  uavPositions: UAVPosition[];
}

export interface UAVPosition {
  id: number;
  uavId: number;
  positionX: number;
  positionY: number;
  positionZ: number;
}

export interface CreateFormationDto {
  formationType: string;
  order: number;
  waypointId?: number;
  missionId?: number;
  uavPositions: CreateUAVPositionDto[];
}

export interface CreateUAVPositionDto {
  uavId: number;
  positionX: number;
  positionY: number;
  positionZ: number;
}
