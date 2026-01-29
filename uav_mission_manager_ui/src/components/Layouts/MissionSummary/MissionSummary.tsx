/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { ChevronLeft, ChevronRight, MapPin, Users, Plane } from 'lucide-react';
import {
    SummaryContainer,
    Section,
    SectionTitle,
    MapContainer,
    CardsGrid,
    Card,
    CardImage,
    CardImagePlaceholder,
    CardContent,
    CardTitle,
    CardSubtitle,
    WaypointsSection,
    WaypointsColumn,
    FormationsColumn,
    WaypointCard,
    WaypointHeader,
    WaypointNumber,
    WaypointCoords,
    TasksList,
    TaskItem,
    TaskIcon,
    TaskDetails,
    TaskName,
    TaskParams,
    FormationNavigation,
    FormationInfo,
    NavigationButton
} from './MissionSummary.styles';
import type { RouteOptimizationData } from '../../../types/pathPlanning.types';
import type { UAV } from '../../../types/uav.types';
import type { User } from '../../../types/user.types';
import type { CreateWaypointDto } from '../../../types/waypoint.types';
import FormationVisualization from '../../Maps/FormationVisualization/FormationVisualization';
import RouteOptimizationMap from '../../Maps/RouteOptimizationMap/RouteOptimizationMap';
import type { WeatherPermitsData } from '../../Wizards/MissionWizard/MissionWizard.types';
import WeatherPermitsDisplay from '../WeatherPermit/WeatherPermitsDisplay';

interface MissionSummaryProps {
    name: string;
    date: string;
    description: string;
    selectedUAVs: UAV[];
    responsibleUsers: User[];
    waypoints: CreateWaypointDto[];
    initialFormationType: string;
    initialFormationPositions: any[];
    routeOptimization: RouteOptimizationData;
    weatherPermits?: WeatherPermitsData;
}

const MissionSummary = ({
    name,
    date,
    description,
    selectedUAVs,
    responsibleUsers,
    waypoints,
    initialFormationType,
    initialFormationPositions,
    routeOptimization,
    weatherPermits
}: MissionSummaryProps) => {
    const [currentFormationIndex, setCurrentFormationIndex] = useState(0);

    // Parse JSON parameters from Task
    const parseTaskParameters = (params: any) => {
        if (typeof params === 'string') {
            try {
                return JSON.parse(params);
            } catch (e) {
                console.error('Failed to parse task parameters:', e);
                return {};
            }
        }
        return params || {};
    };

    // Generate automatic tasks for each waypoint
    const getAutomaticTasks = (index: number) => {
        const tasks = [];
        const isFirst = index === 0;
        const isLast = index === waypoints.length - 1;
        const currentWaypoint = waypoints[index];

        if (isFirst) {
            tasks.push({
                type: 'Takeoff',
                parameters: {
                    Latitude: currentWaypoint.latitude,
                    Longitude: currentWaypoint.longitude
                },
                isAuto: true
            });
        }

        if (!isLast) {
            const nextWaypoint = waypoints[index + 1];
            tasks.push({
                type: 'MoveToPosition',
                parameters: {
                    Latitude: nextWaypoint.latitude,
                    Longitude: nextWaypoint.longitude,
                },
                isAuto: true
            });
        }

        if (isLast) {
            tasks.push({
                type: 'Land',
                parameters: {
                    Latitude: currentWaypoint.latitude,
                    Longitude: currentWaypoint.longitude
                },
                isAuto: true
            });
        }

        return tasks;
    };

    // Get all formations from waypoints
    const formations = waypoints.reduce((acc, wp, wpIndex) => {
        if (wpIndex === 0) {
            acc.push({
                waypointIndex: 0,
                formationType: initialFormationType,
                isInitial: true,
                uavPositions: initialFormationPositions
            });
        }

        const changeFormationTasks = wp.tasks?.filter(t => t.type === 'ChangeFormation') || [];
        changeFormationTasks.forEach(task => {
            const parameters = parseTaskParameters(task.parameters);

            acc.push({
                waypointIndex: wpIndex,
                formationType: parameters.FormationType || 'Unknown',
                uavPositions: parameters.UAVPositions || [],
                isInitial: false,
            });
        });

        return acc;
    }, [] as any[]);

    const activeObstacles = (routeOptimization.detectedObstacles || [])
        .filter((_, idx) => !(routeOptimization.removedObstacleIndexes || []).includes(idx))
        .map((obs, idx) => ({ ...obs, originalIndex: idx }));

    const getUAVById = (uavId: number) => selectedUAVs.find(u => u.id === uavId);

    return (
        <SummaryContainer>
            {/* Mission Info */}
            <Section>
                <SectionTitle>Mission Overview</SectionTitle>
                <Card style={{ padding: '1.5rem' }}>
                    <h2 style={{ margin: '0 0 0.5rem 0', fontSize: '1.5rem', fontWeight: 700 }}>
                        {name}
                    </h2>
                    <p style={{ margin: '0 0 0.75rem 0', color: '#6b7280', fontSize: '0.875rem' }}>
                        {new Date(date).toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}
                    </p>
                    <p style={{ margin: 0, color: '#374151', lineHeight: 1.6 }}>
                        {description}
                    </p>
                </Card>
            </Section>

            {/* Route Map */}
            {routeOptimization.optimalRoute && (
                <Section>
                    <SectionTitle>
                        <MapPin size={20} />
                        Optimal Route
                    </SectionTitle>
                    <MapContainer>
                        <RouteOptimizationMap
                            waypoints={waypoints}
                            obstacles={activeObstacles}
                            optimalRoute={routeOptimization.optimalRoute}
                        />
                    </MapContainer>
                    <div style={{
                        marginTop: '0.75rem',
                        padding: '1rem',
                        background: '#f0f9ff',
                        borderRadius: '8px',
                        fontSize: '0.875rem'
                    }}>
                        <strong>Distance:</strong> {routeOptimization.optimalRoute.totalDistance.toFixed(2)} km •{' '}
                        <strong>Points:</strong> {routeOptimization.optimalRoute.totalPoints} •{' '}
                        <strong>Algorithm:</strong> {routeOptimization.optimalRoute.algorithm}
                    </div>
                </Section>
            )}

            {/* UAVs */}
            <Section>
                <SectionTitle>
                    <Plane size={20} />
                    UAVs ({selectedUAVs.length})
                </SectionTitle>
                <CardsGrid>
                    {selectedUAVs.map(uav => (
                        <Card key={uav.id}>
                            {uav.imagePath && uav.imagePath !== '' && uav.imagePath !== '/' ? (
                                <CardImage src={uav.imagePath} alt={uav.name} />
                            ) : (
                                <CardImagePlaceholder>
                                    <Plane size={32} />
                                </CardImagePlaceholder>
                            )}
                            <CardContent>
                                <CardTitle>{uav.name}</CardTitle>
                                <CardSubtitle>{uav.type}</CardSubtitle>
                                <CardSubtitle>Max Speed: {uav.maxSpeed} km/h</CardSubtitle>
                            </CardContent>
                        </Card>
                    ))}
                </CardsGrid>
            </Section>

            {/* Responsible Users */}
            <Section>
                <SectionTitle>
                    <Users size={20} />
                    Responsible Persons ({responsibleUsers.length})
                </SectionTitle>
                <CardsGrid>
                    {responsibleUsers.map(user => (
                        <Card key={user.username}>
                            {user.imagePath && user.imagePath !== '' && user.imagePath !== '/' ? (
                                <CardImage
                                    src={user.imagePath}
                                    alt={user.username}
                                    style={{ borderRadius: '50%' }}
                                />
                            ) : (
                                <CardImagePlaceholder style={{ borderRadius: '50%' }}>
                                    <Users size={32} />
                                </CardImagePlaceholder>
                            )}
                            <CardContent>
                                <CardTitle>{user.username}</CardTitle>
                                <CardSubtitle>{user.email}</CardSubtitle>
                                {user.role && <CardSubtitle>Role: {user.role}</CardSubtitle>}
                            </CardContent>
                        </Card>
                    ))}
                </CardsGrid>
            </Section>

            {/* Weather & Permits */}
            {weatherPermits && (
                <Section>
                    <SectionTitle>Weather & Permits</SectionTitle>
                    <WeatherPermitsDisplay data={weatherPermits} />
                </Section>
            )}

            {/* Waypoints & Formations */}
            <Section>
                <SectionTitle>Flight Plan</SectionTitle>
                <WaypointsSection>
                    {/* Waypoints Column */}
                    <WaypointsColumn>
                        <h4 style={{ margin: '0 0 1rem 0', fontSize: '0.95rem', fontWeight: 600 }}>
                            Waypoints ({waypoints.length})
                        </h4>
                        {waypoints.map((wp, index) => {
                            // Generate automatic tasks
                            const autoTasks = getAutomaticTasks(index);
                            const customTasks = wp.tasks || [];

                            // Combine: TakeOff → Custom → MoveToPosition → Land
                            const takeoffTasks = autoTasks.filter(t => t.type === 'Takeoff');
                            const moveTasks = autoTasks.filter(t => t.type === 'MoveToPosition');
                            const landTasks = autoTasks.filter(t => t.type === 'Land');

                            const allTasks = [
                                ...takeoffTasks,
                                ...customTasks,
                                ...moveTasks,
                                ...landTasks
                            ];

                            return (
                                <WaypointCard key={index}>
                                    <WaypointHeader>
                                        <WaypointNumber>#{index + 1}</WaypointNumber>
                                        <WaypointCoords>
                                            {wp.latitude.toFixed(6)}, {wp.longitude.toFixed(6)}
                                        </WaypointCoords>
                                    </WaypointHeader>

                                    {/* Tasks */}
                                    {allTasks.length > 0 && (
                                        <TasksList>
                                            {allTasks.map((task, taskIdx) => {
                                                const parameters = parseTaskParameters(task.parameters);
                                                const isExecuteCommand = task.type === 'ExecuteCommand';
                                                const isChangeFormation = task.type === 'ChangeFormation';
                                                const isMoveToPosition = task.type === 'MoveToPosition';
                                                const isTakeoff = task.type === 'Takeoff';
                                                const isLand = task.type === 'Land';

                                                return (
                                                    <TaskItem key={taskIdx}>
                                                        <TaskIcon>
                                                            {isExecuteCommand && '⚡'}
                                                            {isChangeFormation && '🔄'}
                                                            {isMoveToPosition && '➡️'}
                                                            {isTakeoff && '🛫'}
                                                            {isLand && '🛬'}
                                                            {!isExecuteCommand && !isChangeFormation && !isMoveToPosition && !isTakeoff && !isLand && '📍'}
                                                        </TaskIcon>
                                                        <TaskDetails>
                                                            <TaskName>
                                                                {task.type}
                                                                {task.isAuto && (
                                                                    <span style={{
                                                                        marginLeft: '0.5rem',
                                                                        fontSize: '0.7rem',
                                                                        padding: '0.125rem 0.375rem',
                                                                        background: '#e0e7ff',
                                                                        color: '#4338ca',
                                                                        borderRadius: '4px',
                                                                        fontWeight: 600
                                                                    }}>
                                                                        AUTO
                                                                    </span>
                                                                )}
                                                            </TaskName>

                                                            {/* Execute Command Details */}
                                                            {isExecuteCommand && (
                                                                <TaskParams>
                                                                    {parameters.UAVId && (
                                                                        <div>UAV: {getUAVById(parameters.UAVId)?.name || `ID ${parameters.UAVId}`}</div>
                                                                    )}
                                                                    {parameters.EquipmentId && (
                                                                        <div>Equipment ID: {parameters.EquipmentId}</div>
                                                                    )}
                                                                    {parameters.Command && (
                                                                        <div>Command: <strong>{parameters.Command}</strong></div>
                                                                    )}
                                                                    {parameters.Settings && Object.keys(parameters.Settings).length > 0 && (
                                                                        <div style={{ fontSize: '0.7rem', color: '#9ca3af', marginTop: '0.25rem' }}>
                                                                            {Object.entries(parameters.Settings).map(([key, value]) => (
                                                                                <div key={key}>{key}: {String(value)}</div>
                                                                            ))}
                                                                        </div>
                                                                    )}
                                                                </TaskParams>
                                                            )}

                                                            {/* Change Formation Details */}
                                                            {isChangeFormation && (
                                                                <TaskParams>
                                                                    <div>Type: <strong>{parameters.FormationType}</strong></div>
                                                                    <div>{parameters.UAVPositions?.length || 0} UAVs</div>
                                                                </TaskParams>
                                                            )}

                                                            {/* Move To Position Details */}
                                                            {isMoveToPosition && (
                                                                <TaskParams>
                                                                    {parameters.Latitude !== undefined && parameters.Longitude !== undefined ? (
                                                                        <div>
                                                                            Target: {parameters.Latitude.toFixed(6)}, {parameters.Longitude.toFixed(6)}
                                                                        </div>
                                                                    ) : (
                                                                        <div>Move to specified position</div>
                                                                    )}
                                                                    {parameters.Altitude !== undefined && (
                                                                        <div>Altitude: {parameters.Altitude}m</div>
                                                                    )}
                                                                </TaskParams>
                                                            )}

                                                            {/* Takeoff Details */}
                                                            {isTakeoff && (
                                                                <TaskParams>
                                                                    {parameters.Altitude !== undefined ? (
                                                                        <div>Target Altitude: <strong>{parameters.Altitude}m</strong></div>
                                                                    ) : (
                                                                        <div>Takeoff to default altitude</div>
                                                                    )}
                                                                    {parameters.Speed !== undefined && (
                                                                        <div>Speed: {parameters.Speed} m/s</div>
                                                                    )}
                                                                </TaskParams>
                                                            )}

                                                            {/* Land Details */}
                                                            {isLand && (
                                                                <TaskParams>
                                                                    {parameters.Latitude !== undefined && parameters.Longitude !== undefined ? (
                                                                        <div>
                                                                            Landing Point: {parameters.Latitude.toFixed(6)}, {parameters.Longitude.toFixed(6)}
                                                                        </div>
                                                                    ) : (
                                                                        <div>Land at current position</div>
                                                                    )}
                                                                    {parameters.Speed !== undefined && (
                                                                        <div>Descent Speed: {parameters.Speed} m/s</div>
                                                                    )}
                                                                </TaskParams>
                                                            )}
                                                        </TaskDetails>
                                                    </TaskItem>
                                                );
                                            })}
                                        </TasksList>
                                    )}
                                </WaypointCard>
                            );
                        })}
                    </WaypointsColumn>

                    {/* Formations Column */}
                    <FormationsColumn>
                        <FormationNavigation>
                            <NavigationButton
                                onClick={() => setCurrentFormationIndex(Math.max(0, currentFormationIndex - 1))}
                                disabled={currentFormationIndex === 0}
                            >
                                <ChevronLeft size={20} />
                            </NavigationButton>

                            <FormationInfo>
                                <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                                    Formation {currentFormationIndex + 1} of {formations.length}
                                </div>
                                <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>
                                    {formations[currentFormationIndex]?.isInitial ? 'Initial Formation' : `At Waypoint #${formations[currentFormationIndex]?.waypointIndex + 1}`}
                                </div>
                                <div style={{ fontSize: '0.875rem', color: '#2c2c2c' }}>
                                    {formations[currentFormationIndex]?.formationType}
                                </div>
                            </FormationInfo>

                            <NavigationButton
                                onClick={() => setCurrentFormationIndex(Math.min(formations.length - 1, currentFormationIndex + 1))}
                                disabled={currentFormationIndex === formations.length - 1}
                            >
                                <ChevronRight size={20} />
                            </NavigationButton>
                        </FormationNavigation>

                        {formations[currentFormationIndex] && (
                            <FormationVisualization
                                formationType={formations[currentFormationIndex].formationType}
                                uavPositions={formations[currentFormationIndex].uavPositions || []}
                                selectedUAVs={selectedUAVs}
                            />
                        )}
                    </FormationsColumn>
                </WaypointsSection>
            </Section>
        </SummaryContainer>
    );
};

export default MissionSummary;