// Types matching backend C# DTOs

export interface PointDto {
  order: number;
  lat: number;
  lng: number;
}

export interface ObstacleDto {
  coordinates: PointDto[];
  type: string;
  name: string;
  bufferCoordinates?: PointDto[];
}

export interface GetObstacleDto {
  points: PointDto[];
  avoidTags: string[];
}

export interface ObstacleDetectionResultDto {
  obstacles: ObstacleDto[];
  totalObstaclesDetected: number;
  searchAreaKm2: number;
  detectionSource: string;
}

export interface CreateRouteDto {
  obstacles: ObstacleDto[];
  waypoints: PointDto[];
}

export interface RouteOptimizationResultDto {
  success: boolean;
  error?: string;
  optimizedRoute: PointDto[];
  totalDistance: number;
  totalPoints: number;
  optimizationPointsAdded: number;
  algorithm: string;
}

// Frontend state management types
export interface RouteOptimizationData {
  avoidTags: string[];
  detectedObstacles: ObstacleDto[];
  removedObstacleIndexes: number[];
  optimalRoute: RouteOptimizationResultDto | null;
}

export interface ObstacleTypeOption {
  id: string;
  label: string;
  icon: string;
  tags: string[];
}