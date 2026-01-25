import { useState } from 'react';
import { RefreshCw, Trash2, RotateCcw, AlertCircle, CheckCircle } from 'lucide-react';
import type { StepProps } from '../../MissionWizard.types';
import type { RouteOptimizationData, ObstacleDto } from '../../../../../types/pathPlanning.types';
import { pathPlanningService } from '../../../../../services/pathPlanning.service';
import RouteOptimizationMap from '../../../../Maps/RouteOptimizationMap/RouteOptimizationMap';
import {
  Container,
  ControlsSection,
  MapSection,
  ObstaclesSection,
  Header,
  Title,
  DetectionControls,
  CheckboxGroup,
  CheckboxLabel,
  Checkbox,
  DetectButton,
  ObstaclesList,
  ObstacleCard,
  ObstacleIcon,
  ObstacleInfo,
  ObstacleName,
  ObstacleType,
  ObstacleActions,
  IconButton,
  EmptyState,
  GenerateRouteButton,
  StatusMessage,
  RouteInfo,
  InfoBox,
  SecondaryButton
} from './RouteOptimizationStep.styles';

interface RouteOptimizationStepProps extends StepProps<RouteOptimizationData> {
  waypoints: any[];
}

const RouteOptimizationStep = ({ data, waypoints, onUpdate }: RouteOptimizationStepProps) => {
  const [isDetecting, setIsDetecting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const availableTypes = [
    { 
      id: 'building', 
      label: 'Buildings', 
      icon: '🏢',
      tags: ['building']
    },
    { 
      id: 'aerodrome', 
      label: 'Aerodromes & Airports', 
      icon: '✈️',
      tags: ['aeroway=aerodrome', 'aeroway=airport']
    },
    { 
      id: 'natural', 
      label: 'Natural Obstacles', 
      icon: '🌲',
      tags: ['natural=tree', 'natural=wood', 'landuse=forest']
    }
  ];

  const toggleObstacleType = (typeId: string) => {
    const currentTypes = data.avoidTags || [];
    const newTypes = currentTypes.includes(typeId)
      ? currentTypes.filter(t => t !== typeId)
      : [...currentTypes, typeId];
    
    onUpdate({ avoidTags: newTypes });
  };

  const detectObstacles = async () => {
    if (!data.avoidTags || data.avoidTags.length === 0) {
      setError('Please select at least one obstacle type');
      return;
    }

    setIsDetecting(true);
    setError(null);

    try {
      pathPlanningService.validateWaypoints(waypoints);
      
      const waypointPoints = pathPlanningService.waypointsToPoints(waypoints);
      
      // Collect all tags for selected types
      const selectedTags = availableTypes
        .filter(type => data.avoidTags.includes(type.id))
        .flatMap(type => type.tags);
      
      const result = await pathPlanningService.detectObstacles(
        waypointPoints,
        selectedTags
      );

      onUpdate({ 
        detectedObstacles: result.obstacles,
        removedObstacleIndexes: []
      });
    } catch (err: any) {
      setError(err.message || 'Error detecting obstacles. Please try again.');
    } finally {
      setIsDetecting(false);
    }
  };

  const removeObstacle = (obstacleIndex: number) => {
    const removed = data.removedObstacleIndexes || [];
    onUpdate({ 
      removedObstacleIndexes: [...removed, obstacleIndex]
    });
  };

  const restoreObstacle = (obstacleIndex: number) => {
    const removed = data.removedObstacleIndexes || [];
    onUpdate({ 
      removedObstacleIndexes: removed.filter(idx => idx !== obstacleIndex)
    });
  };

  const resetOptimization = () => {
    onUpdate({
      avoidTags: [],
      detectedObstacles: [],
      removedObstacleIndexes: [],
      optimalRoute: null
    });
    setError(null);
  };

  const generateOptimalRoute = async () => {
    setIsGenerating(true);
    setError(null);

    try {
      const activeObstacles = (data.detectedObstacles || [])
        .filter((_, idx) => !(data.removedObstacleIndexes || []).includes(idx));

      pathPlanningService.validateWaypoints(waypoints);

      const waypointPoints = pathPlanningService.waypointsToPoints(waypoints);

      const result = await pathPlanningService.generateOptimalRoute(
        waypointPoints,
        activeObstacles
      );

      onUpdate({ optimalRoute: result });
    } catch (err: any) {
      setError(err.message || 'Error generating route. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const activeObstacles = (data.detectedObstacles || [])
    .map((obs, idx) => ({ ...obs, originalIndex: idx }))
    .filter(obs => !(data.removedObstacleIndexes || []).includes(obs.originalIndex));

  const removedObstacles = (data.detectedObstacles || [])
    .map((obs, idx) => ({ ...obs, originalIndex: idx }))
    .filter(obs => (data.removedObstacleIndexes || []).includes(obs.originalIndex));

  return (
    <div>
      <Header>
        <Title>Route Optimization</Title>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {(data.detectedObstacles.length > 0 || data.optimalRoute) && (
            <SecondaryButton onClick={resetOptimization}>
              <RefreshCw size={16} />
              Reset
            </SecondaryButton>
          )}
          {data.optimalRoute && (
            <RouteInfo>
              <CheckCircle size={16} style={{ color: '#10b981' }} />
              Optimal route generated • {data.optimalRoute.totalDistance.toFixed(2)} km
            </RouteInfo>
          )}
        </div>
      </Header>

      <Container>
        <MapSection>
          <RouteOptimizationMap
            waypoints={waypoints}
            obstacles={activeObstacles}
            optimalRoute={data.optimalRoute}
          />
        </MapSection>

        <ControlsSection>
          <ObstaclesSection>
            <h4 style={{ margin: '0 0 1rem 0', fontSize: '0.9375rem' }}>
              Obstacle Detection
            </h4>

            <DetectionControls>
              {availableTypes.map(type => (
                <CheckboxGroup key={type.id}>
                  <Checkbox
                    type="checkbox"
                    id={type.id}
                    checked={(data.avoidTags || []).includes(type.id)}
                    onChange={() => toggleObstacleType(type.id)}
                  />
                  <CheckboxLabel htmlFor={type.id}>
                    <span style={{ fontSize: '1.125rem', marginRight: '0.5rem' }}>
                      {type.icon}
                    </span>
                    {type.label}
                  </CheckboxLabel>
                </CheckboxGroup>
              ))}

              <DetectButton 
                onClick={detectObstacles}
                disabled={isDetecting || !data.avoidTags || data.avoidTags.length === 0}
              >
                <RefreshCw size={16} className={isDetecting ? 'spinning' : ''} />
                {isDetecting ? 'Detecting...' : 'Detect Obstacles'}
              </DetectButton>
            </DetectionControls>

            {error && (
              <StatusMessage $error>
                <AlertCircle size={16} />
                {error}
              </StatusMessage>
            )}

            {/* Active Obstacles */}
            {activeObstacles.length > 0 && (
              <>
                <h4 style={{ margin: '1.5rem 0 0.75rem 0', fontSize: '0.875rem' }}>
                  Detected Obstacles ({activeObstacles.length})
                </h4>
                <ObstaclesList>
                  {activeObstacles.map((obstacle) => (
                    <ObstacleCard key={obstacle.originalIndex}>
                      <ObstacleIcon>
                        {availableTypes.find(t => t.id === obstacle.type)?.icon || '📍'}
                      </ObstacleIcon>
                      <ObstacleInfo>
                        <ObstacleName>{obstacle.name}</ObstacleName>
                        <ObstacleType>
                          {obstacle.type} • {obstacle.coordinates.length} points
                        </ObstacleType>
                      </ObstacleInfo>
                      <ObstacleActions>
                        <IconButton
                          onClick={() => removeObstacle(obstacle.originalIndex)}
                          title="Remove obstacle"
                        >
                          <Trash2 size={14} />
                        </IconButton>
                      </ObstacleActions>
                    </ObstacleCard>
                  ))}
                </ObstaclesList>
              </>
            )}

            {/* Removed Obstacles */}
            {removedObstacles.length > 0 && (
              <>
                <h4 style={{ margin: '1.5rem 0 0.75rem 0', fontSize: '0.875rem', color: '#9ca3af' }}>
                  Removed Obstacles ({removedObstacles.length})
                </h4>
                <ObstaclesList>
                  {removedObstacles.map((obstacle) => (
                    <ObstacleCard key={obstacle.originalIndex} style={{ opacity: 0.6 }}>
                      <ObstacleIcon>
                        {availableTypes.find(t => t.id === obstacle.type)?.icon || '📍'}
                      </ObstacleIcon>
                      <ObstacleInfo>
                        <ObstacleName>{obstacle.name}</ObstacleName>
                        <ObstacleType>{obstacle.type}</ObstacleType>
                      </ObstacleInfo>
                      <ObstacleActions>
                        <IconButton
                          onClick={() => restoreObstacle(obstacle.originalIndex)}
                          title="Restore obstacle"
                        >
                          <RotateCcw size={14} />
                        </IconButton>
                      </ObstacleActions>
                    </ObstacleCard>
                  ))}
                </ObstaclesList>
              </>
            )}

            {!data.detectedObstacles || data.detectedObstacles.length === 0 ? (
              <EmptyState>
                Select obstacle types and click "Detect Obstacles" to begin
              </EmptyState>
            ) : null}

            {/* Generate Route */}
            {activeObstacles.length > 0 && (
              <GenerateRouteButton
                onClick={generateOptimalRoute}
                disabled={isGenerating}
              >
                {isGenerating ? 'Generating...' : 'Generate Optimal Route'}
              </GenerateRouteButton>
            )}

            {data.optimalRoute && (
              <InfoBox>
                <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.25rem' }}>
                  Route Statistics:
                </div>
                <div style={{ fontSize: '0.8125rem' }}>
                  <strong>Distance:</strong> {data.optimalRoute.totalDistance.toFixed(2)} km
                </div>
                <div style={{ fontSize: '0.8125rem' }}>
                  <strong>Points:</strong> {data.optimalRoute.totalPoints} ({data.optimalRoute.optimizationPointsAdded} added)
                </div>
                <div style={{ fontSize: '0.8125rem' }}>
                  <strong>Algorithm:</strong> {data.optimalRoute.algorithm}
                </div>
              </InfoBox>
            )}
          </ObstaclesSection>
        </ControlsSection>
      </Container>
    </div>
  );
};

export default RouteOptimizationStep;