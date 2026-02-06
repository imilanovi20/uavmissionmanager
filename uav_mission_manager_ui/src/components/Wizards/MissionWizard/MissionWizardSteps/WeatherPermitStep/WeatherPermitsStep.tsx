import { useEffect, useState } from 'react';
import { CheckCircle, RefreshCw, Wind, Thermometer, Compass, Shield, Camera, Plane, Battery, Clock } from 'lucide-react';
import type { WeatherPermitsData } from '../../MissionWizard.types';
import type { PointDto } from '../../../../../types/pathPlanning.types';
import type { Task } from '../../../../../types/task.types';
import { weatherService } from '../../../../../services/weather.service';
import { permitService } from '../../../../../services/permit.service';
import {
    StepContainer,
    StepDescription,
    LoadingOverlay,
    LoadingSpinner,
    LoadingText,
    RefreshAllButton,
    CardsGrid,
    TopRow,
    BottomRow,
    Card,
    CardHeader,
    CardTitle,
    SuccessIcon,
    CategoryBadge,
    CategoryLetter,
    CategoryLabel,
    InfoSection,
    InfoLabel,
    InfoValue,
    StatusBadge,
    StatusIcon,
    StatusText,
    MessageBox,
    NoDataText,
    WeatherIcon,
    WeatherDetails,
    WeatherDetail,
    WeatherLabel,
    WeatherValue,
    BatteryList,
    BatteryItem,
    BatteryBar,
    BatteryFill,
    BatteryPercentage,
} from './WeatherPermitsStep.styles';

interface WeatherPermitsStepProps {
    data: WeatherPermitsData;
    onUpdate: (data: Partial<WeatherPermitsData>) => void;
    missionDate: string;
    routePoints: PointDto[];
    uavIds: number[];
    allTasks: Task[];
}

const WeatherPermitsStep: React.FC<WeatherPermitsStepProps> = ({
    data,
    onUpdate,
    missionDate,
    routePoints,
    uavIds,
    allTasks,
}) => {
    const [isInitialLoad, setIsInitialLoad] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);

    useEffect(() => {
        if (routePoints.length > 0 && isInitialLoad) {
            fetchAllData();
        }
    }, []);

    const fetchAllData = async () => {
        setIsRefreshing(true);

        try {
            // Fetch everything in parallel (5 calls now)
            const [
                weatherResult,
                operationCategoryResult,
                recordingPermissionResult,
                airspaceCheckResult,
                flightTimeResult
            ] = await Promise.allSettled([
                weatherService.getWeatherData({
                    date: missionDate,
                    points: routePoints,
                }),
                permitService.calculateOperationCategory({
                    waypoints: routePoints,
                    uavIds: uavIds,
                }),
                permitService.checkRecordingPermission(allTasks),
                permitService.checkAirspace(routePoints),
                permitService.getProjectedFlightTime({
                    uavIds: uavIds,
                    points: routePoints,
                }),
            ]);

            // Process results
            const newData: Partial<WeatherPermitsData> = {
                isWeatherLoading: false,
                isPermitsLoading: false,
            };

            // Weather
            if (weatherResult.status === 'fulfilled') {
                newData.weather = weatherResult.value;
                newData.weatherError = null;
            } else {
                newData.weather = null;
                newData.weatherError = weatherResult.reason?.message || 'Failed to fetch weather';
            }

            // Operation Category
            if (operationCategoryResult.status === 'fulfilled') {
                newData.operationCategory = operationCategoryResult.value;
            } else {
                newData.operationCategory = null;
            }

            // Recording Permission
            if (recordingPermissionResult.status === 'fulfilled') {
                console.log('Recording Permission Response:', recordingPermissionResult.value);
                newData.recordingPermission = recordingPermissionResult.value;
            } else {
                console.error('Recording Permission Error:', recordingPermissionResult.reason);
                newData.recordingPermission = null;
            }

            // Airspace Check
            if (airspaceCheckResult.status === 'fulfilled') {
                newData.airspaceCheck = airspaceCheckResult.value;
            } else {
                newData.airspaceCheck = null;
            }

            // Flight Time
            if (flightTimeResult.status === 'fulfilled') {
                newData.projectedFlightTime = flightTimeResult.value;
            } else {
                newData.projectedFlightTime = null;
            }

            // Check if any permit calls failed
            const permitsFailed =
                operationCategoryResult.status === 'rejected' ||
                recordingPermissionResult.status === 'rejected' ||
                airspaceCheckResult.status === 'rejected' ||
                flightTimeResult.status === 'rejected';

            if (permitsFailed) {
                newData.permitsError = 'Some permit checks failed. Please try again.';
            } else {
                newData.permitsError = null;
            }

            // Update all data at once
            onUpdate(newData);

        } catch (error) {
            console.error('Unexpected error:', error);
            onUpdate({
                weatherError: 'Unexpected error occurred',
                permitsError: 'Unexpected error occurred',
                isWeatherLoading: false,
                isPermitsLoading: false,
            });
        } finally {
            setIsRefreshing(false);
            setIsInitialLoad(false);
        }
    };

    const getWeatherIcon = (code: number): string => {
        const iconMap: Record<number, string> = {
            0: '01d', 1: '02d', 2: '03d', 3: '04d',
            45: '50d', 48: '50d',
            51: '09d', 53: '09d', 55: '09d',
            61: '10d', 63: '10d', 65: '10d',
            71: '13d', 73: '13d', 75: '13d', 77: '13d',
            80: '09d', 81: '09d', 82: '09d',
            85: '13d', 86: '13d',
            95: '11d', 96: '11d', 99: '11d',
        };
        return iconMap[code] || '01d';
    };

    const getBatteryColor = (percentage: number): string => {
        if (percentage >= 80) return '#ef4444';  // Red - Very High Usage (80%+)
        if (percentage >= 60) return '#f59e0b';  // Orange - High Usage (60-80%)
        if (percentage >= 40) return '#eab308';  // Yellow - Medium Usage (40-60%)
        return '#10b981';                        // Green - Low Usage (0-40%)
    };

    const hasAnyData =
        data.weather ||
        data.operationCategory ||
        data.recordingPermission ||
        data.airspaceCheck ||
        data.projectedFlightTime;

    const hasErrors = data.weatherError || data.permitsError;

    // Show loading overlay during initial load
    if (isRefreshing && !hasAnyData) {
        return (
            <StepContainer>
                <StepDescription>
                    Reviewing weather conditions, permit requirements, and battery usage for your mission
                </StepDescription>
                <LoadingOverlay>
                    <LoadingSpinner className="spin" />
                    <LoadingText>Loading weather and permits data...</LoadingText>
                </LoadingOverlay>
            </StepContainer>
        );
    }

    return (
        <StepContainer>
            <StepDescription>
                Reviewing weather conditions, permit requirements, and battery usage for your mission
            </StepDescription>

            {/* Refresh All Button */}
            {(hasErrors || hasAnyData) && (
                <RefreshAllButton onClick={fetchAllData} disabled={isRefreshing}>
                    <RefreshCw size={20} className={isRefreshing ? 'spin' : ''} />
                    {isRefreshing ? 'Refreshing...' : 'Refresh All'}
                </RefreshAllButton>
            )}

            <CardsGrid>
                {/* Top Row - 3 cards */}
                <TopRow>
                    {/* Weather Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Weather Conditions</CardTitle>
                        </CardHeader>

                        {data.weather ? (
                            <>
                                <WeatherIcon
                                    src={`https://openweathermap.org/img/wn/${getWeatherIcon(data.weather.weatherCode)}@2x.png`}
                                    alt="Weather icon"
                                />
                                <WeatherDetails>
                                    <WeatherDetail>
                                        <Thermometer size={16} />
                                        <div>
                                            <WeatherLabel>Temperature</WeatherLabel>
                                            <WeatherValue>{data.weather.temperature}°C</WeatherValue>
                                        </div>
                                    </WeatherDetail>
                                    <WeatherDetail>
                                        <Wind size={16} />
                                        <div>
                                            <WeatherLabel>Wind Speed</WeatherLabel>
                                            <WeatherValue>{data.weather.windSpeed} km/h</WeatherValue>
                                        </div>
                                    </WeatherDetail>
                                    <WeatherDetail>
                                        <Compass size={16} />
                                        <div>
                                            <WeatherLabel>Direction</WeatherLabel>
                                            <WeatherValue>{data.weather.windDirection}</WeatherValue>
                                        </div>
                                    </WeatherDetail>
                                </WeatherDetails>
                            </>
                        ) : data.weatherError ? (
                            <NoDataText style={{ color: '#dc2626' }}>{data.weatherError}</NoDataText>
                        ) : (
                            <NoDataText>No data available</NoDataText>
                        )}
                    </Card>

                    {/* Operation Category Card */}
                    <Card $hasSuccess={!!data.operationCategory}>
                        <CardHeader>
                            <CardTitle>Operation Category</CardTitle>
                            {data.operationCategory && <SuccessIcon><CheckCircle size={20} /></SuccessIcon>}
                        </CardHeader>

                        {data.operationCategory ? (
                            <>
                                <CategoryBadge>
                                    <Shield size={24} color="#64748b" />
                                    <div>
                                        <CategoryLabel>CATEGORY</CategoryLabel>
                                        <CategoryLetter>{data.operationCategory.operationCategory}</CategoryLetter>
                                    </div>
                                </CategoryBadge>

                                <InfoSection>
                                    <InfoLabel>HEAVIEST UAV</InfoLabel>
                                    <InfoValue>{data.operationCategory.heviestUAV.name} ({data.operationCategory.heviestUAV.weight} kg)</InfoValue>
                                </InfoSection>

                                <InfoSection>
                                    <InfoLabel>UAV CLASS</InfoLabel>
                                    <InfoValue>{data.operationCategory.uavClass}</InfoValue>
                                </InfoSection>

                                <InfoSection>
                                    <InfoLabel>ZONE CLASS</InfoLabel>
                                    <InfoValue>{data.operationCategory.zoneClass}</InfoValue>
                                </InfoSection>
                            </>
                        ) : data.permitsError ? (
                            <NoDataText style={{ color: '#dc2626' }}>Failed to load</NoDataText>
                        ) : (
                            <NoDataText>No data available</NoDataText>
                        )}
                    </Card>

                    {/* Recording Permission Card */}
                    <Card $hasSuccess={data.recordingPermission && !data.recordingPermission.isRecordingPermissionRequired}>
                        <CardHeader>
                            <CardTitle>Recording Permission</CardTitle>
                            {data.recordingPermission && !data.recordingPermission.isRecordingPermissionRequired && (
                                <SuccessIcon><CheckCircle size={20} /></SuccessIcon>
                            )}
                        </CardHeader>

                        {data.recordingPermission ? (
                            <>
                                <StatusBadge $isGreen={!data.recordingPermission.isRecordingPermissionRequired}>
                                    <StatusIcon>
                                        <Camera size={20} color={data.recordingPermission.isRecordingPermissionRequired ? '#f59e0b' : '#10b981'} />
                                    </StatusIcon>
                                    <div>
                                        <CategoryLabel>STATUS</CategoryLabel>
                                        <StatusText style={{
                                            color: data.recordingPermission.isRecordingPermissionRequired ? '#f59e0b' : '#10b981'
                                        }}>
                                            {data.recordingPermission.isRecordingPermissionRequired
                                                ? 'Permission Required'
                                                : 'No Permission Needed'}
                                        </StatusText>
                                    </div>
                                </StatusBadge>

                                {data.recordingPermission.message && (
                                    <MessageBox style={{
                                        background: data.recordingPermission.isRecordingPermissionRequired ? '#fef3c7' : '#f0fdf4',
                                        border: `1px solid ${data.recordingPermission.isRecordingPermissionRequired ? '#f59e0b' : '#10b981'}`,
                                        color: data.recordingPermission.isRecordingPermissionRequired ? '#92400e' : '#065f46'
                                    }}>
                                        {data.recordingPermission.message}
                                    </MessageBox>
                                )}
                            </>
                        ) : data.permitsError ? (
                            <NoDataText style={{ color: '#dc2626' }}>Failed to load</NoDataText>
                        ) : (
                            <NoDataText>No data available</NoDataText>
                        )}
                    </Card>
                </TopRow>

                {/* Bottom Row - 2 cards */}
                <BottomRow>
                    {/* Airspace Check Card */}
                    <Card $hasSuccess={data.airspaceCheck && !data.airspaceCheck.crossesAirspace}>
                        <CardHeader>
                            <CardTitle>Airspace Check</CardTitle>
                            {data.airspaceCheck && !data.airspaceCheck.crossesAirspace && (
                                <SuccessIcon><CheckCircle size={20} /></SuccessIcon>
                            )}
                        </CardHeader>

                        {data.airspaceCheck ? (
                            <>
                                <StatusBadge $isGreen={!data.airspaceCheck.crossesAirspace}>
                                    <StatusIcon>
                                        <Plane size={20} />
                                    </StatusIcon>
                                    <div>
                                        <CategoryLabel>STATUS</CategoryLabel>
                                        <StatusText>
                                            {data.airspaceCheck.crossesAirspace ? 'Airspace Violation' : 'Clear Airspace'}
                                        </StatusText>
                                    </div>
                                </StatusBadge>

                                {data.airspaceCheck.message && (
                                    <MessageBox>{data.airspaceCheck.message}</MessageBox>
                                )}
                            </>
                        ) : data.permitsError ? (
                            <NoDataText style={{ color: '#dc2626' }}>Failed to load</NoDataText>
                        ) : (
                            <NoDataText>No data available</NoDataText>
                        )}
                    </Card>

                    {/* Projected Flight Time / Battery Card */}
                    <Card $hasSuccess={data.projectedFlightTime?.flightTimeUAV.every(uav => uav.isFeasible)}>
                        <CardHeader>
                            <CardTitle>Battery Usage</CardTitle>
                            {data.projectedFlightTime && data.projectedFlightTime.flightTimeUAV.every(uav => uav.isFeasible) && (
                                <SuccessIcon><CheckCircle size={20} /></SuccessIcon>
                            )}
                        </CardHeader>

                        {data.projectedFlightTime ? (
                            <>
                                <InfoSection style={{ marginBottom: '16px' }}>
                                    <InfoLabel style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <Clock size={16} />
                                        PROJECTED FLIGHT TIME
                                    </InfoLabel>
                                    <InfoValue>{data.projectedFlightTime.projectedFlightTime}</InfoValue>
                                </InfoSection>

                                <BatteryList>
                                    {data.projectedFlightTime.flightTimeUAV.map((uav) => (
                                        <BatteryItem key={uav.uavId} $isFeasible={uav.isFeasible}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                                <span style={{ fontSize: '14px', fontWeight: 500 }}>UAV {uav.uavId}</span>
                                                <span style={{ fontSize: '12px', color: '#64748b' }}>{uav.flightTime}</span>
                                            </div>
                                            <BatteryBar>
                                                <BatteryFill
                                                    $percentage={uav.batteryUsage}
                                                    $color={getBatteryColor(uav.batteryUsage)}
                                                />
                                            </BatteryBar>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
                                                <BatteryPercentage $color={getBatteryColor(uav.batteryUsage)}>
                                                    <Battery size={14} />
                                                    {uav.batteryUsage.toFixed(1)}%
                                                </BatteryPercentage>
                                                {!uav.isFeasible && (
                                                    <span style={{ fontSize: '11px', color: '#ef4444', fontWeight: 500 }}>
                                                        ⚠️ Insufficient
                                                    </span>
                                                )}
                                            </div>
                                        </BatteryItem>
                                    ))}
                                </BatteryList>
                            </>
                        ) : data.permitsError ? (
                            <NoDataText style={{ color: '#dc2626' }}>Failed to load</NoDataText>
                        ) : (
                            <NoDataText>No data available</NoDataText>
                        )}
                    </Card>
                </BottomRow>
            </CardsGrid>
        </StepContainer>
    );
};

export default WeatherPermitsStep;