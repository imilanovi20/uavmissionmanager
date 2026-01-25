import { api } from './api';
import type {
  GetObstacleDto,
  ObstacleDetectionResultDto,
  CreateRouteDto,
  RouteOptimizationResultDto,
  PointDto,
  ObstacleDto
} from '../types/pathPlanning.types';
import { ENDPOINTS } from '../utils/constants';

class PathPlanningService {

  async detectObstacles(
    waypoints: PointDto[],
    avoidTags: string[]
  ): Promise<ObstacleDetectionResultDto> {
    try {
      const payload: GetObstacleDto = {
        points: waypoints,
        avoidTags: avoidTags
      };

      const response = await api.post<ObstacleDetectionResultDto>(
        ENDPOINTS.PATH + '/obstacles',
        payload
      );

      return response.data;
    } catch (error: any) {
      console.error('Error detecting obstacles:', error);
      throw new Error(
        error.response?.data?.message || 
        'Failed to detect obstacles. Please try again.'
      );
    }
  }

  async generateOptimalRoute(
    waypoints: PointDto[],
    obstacles: ObstacleDto[]
  ): Promise<RouteOptimizationResultDto> {
    try {
      const payload: CreateRouteDto = {
        waypoints: waypoints,
        obstacles: obstacles
      };

      const response = await api.post<RouteOptimizationResultDto>(
        ENDPOINTS.PATH + '/optimalroute',
        payload
      );

      if (!response.data.success) {
        throw new Error(response.data.error || 'Route optimization failed');
      }

      return response.data;
    } catch (error: any) {
      console.error('Error generating route:', error);
      throw new Error(
        error.response?.data?.message || 
        error.message ||
        'Failed to generate optimal route. Please try again.'
      );
    }
  }

  waypointsToPoints(waypoints: any[]): PointDto[] {
    return waypoints.map((wp, index) => ({
      order: index,
      lat: wp.latitude,
      lng: wp.longitude
    }));
  }

  validateWaypoints(waypoints: any[]): boolean {
    if (!waypoints || waypoints.length < 2) {
      throw new Error('At least 2 waypoints are required');
    }

    for (const wp of waypoints) {
      if (typeof wp.latitude !== 'number' || typeof wp.longitude !== 'number') {
        throw new Error('Invalid waypoint coordinates');
      }

      if (wp.latitude < -90 || wp.latitude > 90) {
        throw new Error('Latitude must be between -90 and 90');
      }

      if (wp.longitude < -180 || wp.longitude > 180) {
        throw new Error('Longitude must be between -180 and 180');
      }
    }

    return true;
  }
}

export const pathPlanningService = new PathPlanningService();
export default pathPlanningService;
