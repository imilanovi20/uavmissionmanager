/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  CreateMissionButton,
  CreateMissionSection,
  SuccessMessage,
  SummaryStepContainer,
} from './SummaryStep.styles';
import type { StepProps } from '../../MissionWizard.types';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import type { CreateMissionDto } from '../../../../../types/mission.types';
import type { CreateFormationDto } from '../../../../../types/formation.types';
import { missionService } from '../../../../../services/mission.service';
import { CheckCircle, Loader } from 'lucide-react';
import MissionSummary from '../../../../Layouts/MissionSummary/MissionSummary';
import { useCurrentUser } from '../../../../../hooks/useCurrentUser';

interface SummaryStepProps extends StepProps {
  // All mission data from MissionWizard
  generalInfo: any;
  uavSelection: any;
  formation: any;
  responsiblePersons: any;
  waypointsData: any;
  routeOptimization: any;
  weatherPermits?: any;
}

const SummaryStep = ({
  generalInfo,
  uavSelection,
  formation,
  responsiblePersons,
  waypointsData,
  routeOptimization,
  weatherPermits
}: SummaryStepProps) => {
  const navigate = useNavigate();
  const { user } = useCurrentUser();
  const [isCreating, setIsCreating] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('🎯 MISSION SUMMARY DATA:');
    console.log('generalInfo:', generalInfo);
    console.log('uavSelection:', uavSelection);
    console.log('formation:', formation);
    console.log('responsiblePersons:', responsiblePersons);
    console.log('waypointsData:', waypointsData);
    console.log('routeOptimization:', routeOptimization);
    console.log('weatherPermits:', weatherPermits);
  }, [generalInfo, uavSelection, formation, responsiblePersons, waypointsData, routeOptimization, weatherPermits]);

const handleCreateMission = async () => {
  try {
    setIsCreating(true);
    setError(null);

    const formationPositions = formation.positions.length > 0 
      ? formation.positions
      : uavSelection.selectedUAVIds.map((uavId: number, index: number) => ({
          uavId,
          positionX: index * 10,
          positionY: 0,
          positionZ: 0
        }));

    const formationDto: CreateFormationDto = {
      formationType: formation.formationType,
      order: 0,
      uavPositions: formationPositions
    };

    const getAutomaticTasks = (waypoints: any[], index: number) => {
      const tasks = [];
      const isFirst = index === 0;
      const isLast = index === waypoints.length - 1;
      const currentWaypoint = waypoints[index];

      if (isFirst) {
        tasks.push({
          type: 'Takeoff',
          parameters: JSON.stringify({
            Latitude: currentWaypoint.latitude,
            Longitude: currentWaypoint.longitude
          })
        });
      }

      if (!isLast) {
        const nextWaypoint = waypoints[index + 1];
        tasks.push({
          type: 'MoveToPosition',
          parameters: JSON.stringify({
            Latitude: nextWaypoint.latitude,
            Longitude: nextWaypoint.longitude,
          })
        });
      }

      if (isLast) {
        tasks.push({
          type: 'Land',
          parameters: JSON.stringify({
            Latitude: currentWaypoint.latitude,
            Longitude: currentWaypoint.longitude
          })
        });
      }

      return tasks;
    };

    // === WAYPOINTS WITH AUTO TASKS ===
    const finalWaypoints = routeOptimization?.optimalRoute 
      ? routeOptimization.optimalRoute.optimizedRoute.map((point: any, index: number) => {
          const autoTasks = getAutomaticTasks(
            routeOptimization.optimalRoute.optimizedRoute, 
            index
          );
          
          return {
            latitude: point.lat,
            longitude: point.lng,
            orderIndex: point.order,
            tasks: [...autoTasks] // Only auto tasks for optimized route
          };
        })
      : waypointsData.waypoints.map((wp: any, index: number) => {
          const autoTasks = getAutomaticTasks(waypointsData.waypoints, index);
          const customTasks = wp.tasks || [];
          
          // Combine: TakeOff → Custom Tasks → MoveToPosition → Land
          const takeoffTasks = autoTasks.filter((t: any) => t.type === 'Takeoff');
          const moveTasks = autoTasks.filter((t: any) => t.type === 'MoveToPosition');
          const landTasks = autoTasks.filter((t: any) => t.type === 'Land');
          
          return {
            latitude: wp.latitude,
            longitude: wp.longitude,
            orderIndex: wp.orderIndex,
            tasks: [
              ...takeoffTasks,
              ...customTasks,
              ...moveTasks,
              ...landTasks
            ]
          };
        });

    const activeObstacles = routeOptimization?.detectedObstacles
      ? routeOptimization.detectedObstacles.filter((_: any, idx: number) => 
          !(routeOptimization.removedObstacleIndexes || []).includes(idx)
        )
      : undefined;

    const optimalRouteDto = routeOptimization?.optimalRoute ? {
      algorithm: routeOptimization.optimalRoute.algorithm,
      totalDistance: routeOptimization.optimalRoute.totalDistance,
      totalPoints: routeOptimization.optimalRoute.totalPoints,
      optimizationPointsAdded: routeOptimization.optimalRoute.optimizationPointsAdded,
      points: routeOptimization.optimalRoute.optimizedRoute.map((p: any) => ({
        order: p.order,
        lat: p.lat,
        lng: p.lng
      }))
    } : undefined;

    const weatherData = weatherPermits?.weather ? {
      temperature: weatherPermits.weather.temperature,
      windSpeed: weatherPermits.weather.windSpeed,
      humidity: weatherPermits.weather.humidity,
      description: weatherPermits.weather.description,
      iconCode: weatherPermits.weather.iconCode
    } : undefined;

    const permitDataDto = (weatherPermits?.operationCategory || 
                          weatherPermits?.recordingPermission || 
                          weatherPermits?.airspaceCheck) ? {
      operationCategory: weatherPermits.operationCategory?.operationCategory || '',
      heaviestUAV: weatherPermits.operationCategory?.heviestUAV?.weight || 0,
      uavOperationClass: weatherPermits.operationCategory?.uavClass || '',
      zoneOperationClass: weatherPermits.operationCategory?.zoneClass || '',
      isRecordingPermissionRequired: weatherPermits.recordingPermission?.isRecordingPermissionRequired || false,
      crossesAirspace: weatherPermits.airspaceCheck?.crossesAirspace || false,
      crossesAirspaceMessage: weatherPermits.airspaceCheck?.message,
      violations: weatherPermits.airspaceCheck?.violations || []
    } : undefined;

    const flightTimeDataDto = weatherPermits?.projectedFlightTime ? {
      projectedFlightTime: weatherPermits.projectedFlightTime.projectedFlightTime,
      uavFlightTimes: weatherPermits.projectedFlightTime.flightTimeUAV?.map((ft: any) => ({
        uavId: ft.uavId,
        flightTime: ft.flightTime,
        batteryUsage: ft.batteryUsage,
        isFeasible: ft.isFeasible
      })) || []
    } : undefined;

    const missionData: CreateMissionDto = {
      name: generalInfo.name,
      date: generalInfo.date,
      description: generalInfo.description,
      createdByUsername: user?.username || 'unknown',
      
      weatherData: weatherData,
      permitData: permitDataDto,
      flightTimeData: flightTimeDataDto,
      optimalRoute: optimalRouteDto,
      obstacles: activeObstacles,
      
      uavIds: uavSelection.selectedUAVIds,
      responsibleUsers: responsiblePersons.selectedUsernames,
      initialFormation: formationDto,
      waypoints: finalWaypoints
    };

    console.log('📤 CREATE MISSION DTO:', missionData);

    await missionService.createMission(missionData);
    
    setIsSuccess(true);
    setTimeout(() => navigate('/missions'), 2000);

  } catch (err: any) {
      console.error('❌ Failed to create mission:', err);
      console.error('❌ Failed to create mission:', err.message);
    setError(err.response?.data?.message || err.message || 'Failed to create mission');
  } finally {
    setIsCreating(false);
  }
};

  // === PREPARE DATA FOR MissionSummary ===
  const selectedUAVs = uavSelection.availableUAVs.filter((uav: any) =>
    uavSelection.selectedUAVIds.includes(uav.id)
  );

  const selectedUsers = responsiblePersons.availableUsers.filter((user: any) =>
    responsiblePersons.selectedUsernames.includes(user.username)
  );

  return (
    <SummaryStepContainer>
      {/* MISSION SUMMARY COMPONENT */}
      <MissionSummary
        name={generalInfo.name}
        date={generalInfo.date}
        description={generalInfo.description}
        selectedUAVs={selectedUAVs}
        responsibleUsers={selectedUsers}
        waypoints={waypointsData.waypoints}
        initialFormationType={formation.formationType}
        initialFormationPositions={formation.positions} 
        routeOptimization={routeOptimization}
        weatherPermits={weatherPermits}
      />


    </SummaryStepContainer>
  );
};

export default SummaryStep;
