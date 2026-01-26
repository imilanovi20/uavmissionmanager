import { useState, useEffect, type SetStateAction } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useUAV } from "../../../hooks/useUAVs";
import { useUsers } from "../../../hooks/useUsers";
import { 
  STEPS, 
  type FormationData, 
  type GeneralInfoData, 
  type ResponsiblePersonsData, 
  type SummaryData, 
  type UAVSelectionData, 
  type WaypointsData,
  type WeatherPermitsData
} from "./MissionWizard.types";
import type { RouteOptimizationData } from "../../../types/pathPlanning.types";
import type { CreateMissionDto } from "../../../types/mission.types";
import { missionService } from "../../../services/mission.service";
import type { CreateFormationDto } from "../../../types/formation.types";
import { 
  FormationStep, 
  GeneralInfoStep, 
  ResponsiblePersonsStep, 
  SummaryStep, 
  UAVSelectionStep, 
  WaypointsStep,
  RouteOptimizationStep,
  WeatherPermitsStep
} from "./MissionWizardSteps";
import { 
  Step, 
  StepIndicator, 
  StepLabel, 
  WizardBody,  
  WizardHeader, 
  WizardTitle, 
  SecondaryButton, 
  WizardFooter, 
  ButtonGroup, 
  PrimaryButton, 
  WizardContainer,
  WizardPageContainer,
  QuitButton
} from "./MissionWizard.styles";

const MissionWizard = () => {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(0);
    const [loading, setLoading] = useState(false);

    const { uavs } = useUAV({ itemsPerPage: 100 });
    const { users } = useUsers();

    const [generalInfo, setGeneralInfo] = useState<GeneralInfoData>({
        name: '',
        date: '',
        description: '',
        locationLat: 45.8,
        locationLon: 16.0
    });

    const [uavSelection, setUAVSelection] = useState<UAVSelectionData>({
        selectedUAVIds: [],
        availableUAVs: []
    });

    const [formation, setFormation] = useState<FormationData>({
        formationType: 'Line',
        positions: []
    });

    const [responsiblePersons, setResponsiblePersons] = useState<ResponsiblePersonsData>({
        selectedUsernames: [],
        availableUsers: []
    });

    const [waypointsData, setWaypointsData] = useState<WaypointsData>({
        waypoints: [],
        locationLat: 45.8,
        locationLon: 16.0
    });

    const [routeOptimization, setRouteOptimization] = useState<RouteOptimizationData>({
        avoidTags: [],
        detectedObstacles: [],
        removedObstacleIndexes: [],
        optimalRoute: null
    });

    const [weatherPermits, setWeatherPermits] = useState<WeatherPermitsData>({
        weather: null,
        operationCategory: null,
        recordingPermission: null,
        airspaceCheck: null,
        isWeatherLoading: false,
        isPermitsLoading: false,
        weatherError: null,
        permitsError: null
    });

    // Sync UAVs when loaded
    useEffect(() => {
        if (uavs && uavs.length > 0) {
            setUAVSelection(prev => ({ ...prev, availableUAVs: uavs }));
        }
    }, [uavs]);

    // Sync Users when loaded
    useEffect(() => {
        if (users && users.length > 0) {
            setResponsiblePersons(prev => ({ ...prev, availableUsers: users }));
        }
    }, [users]);

    const handleNext = () => {
        if (currentStep < STEPS.length - 1) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleQuit = () => {
        navigate('/missions');
    };

    const handleSubmit = async () => {
        try {
            setLoading(true);

            // Use positions from formation state if available
            const formationPositions = formation.positions.length > 0 
                ? formation.positions
                : uavSelection.selectedUAVIds.map((uavId, index) => ({
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

            const finalWaypoints = routeOptimization.optimalRoute 
                ? routeOptimization.optimalRoute.optimizedRoute.map(point => ({
                    latitude: point.lat,
                    longitude: point.lng,
                    orderIndex: point.order
                }))
                : waypointsData.waypoints;

            const missionData: CreateMissionDto = {
                name: generalInfo.name,
                locationLat: generalInfo.locationLat,
                locationLon: generalInfo.locationLon,
                date: generalInfo.date,
                description: generalInfo.description,
                uavIds: uavSelection.selectedUAVIds,
                responsibleUsers: responsiblePersons.selectedUsernames,
                initialFormation: formationDto,
                waypoints: finalWaypoints
            };

            await missionService.createMission(missionData);
            navigate('/missions');
        } catch (error) {
            console.error('Failed to create mission:', error);
            alert('Failed to create mission. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const canProceed = () => {
        switch (currentStep) {
            case 0: // General Info
                return generalInfo.name && generalInfo.date && generalInfo.description;
            case 1: // UAV Selection
                return uavSelection.selectedUAVIds.length > 0;
            case 2: // Formation
                return formation.formationType;
            case 3: // Responsible Persons
                return responsiblePersons.selectedUsernames.length > 0;
            case 4: // Waypoints
                return waypointsData.waypoints.length >= 2;
            case 5: // Route Optimization
                return true;
            case 6: // Weather & Permits
                return true;
            case 7: // Summary
                return true;
            default:
                return false;
        }
    };

    const renderStep = () => {
        switch (currentStep) {
            case 0:
                return (
                    <GeneralInfoStep
                        data={generalInfo}
                        onUpdate={(update: SetStateAction<GeneralInfoData>) => 
                            setGeneralInfo({ ...generalInfo, ...update })
                        }
                    />
                );
            case 1:
                return (
                    <UAVSelectionStep
                        data={uavSelection}
                        onUpdate={(update: SetStateAction<UAVSelectionData>) => 
                            setUAVSelection({ ...uavSelection, ...update })
                        }
                    />
                );
            case 2:
                const selectedUAVs = uavSelection.availableUAVs.filter(uav =>
                    uavSelection.selectedUAVIds.includes(uav.id)
                );

                return (
                    <FormationStep
                        data={formation}
                        selectedUAVs={selectedUAVs}  
                        onUpdate={(update) => setFormation({ ...formation, ...update })}
                    />
                );
            case 3:
                return (
                    <ResponsiblePersonsStep
                        data={responsiblePersons}
                        onUpdate={(update) => 
                            setResponsiblePersons({ ...responsiblePersons, ...update })
                        }
                    />
                );
            case 4:
                return (
                    <WaypointsStep
                        data={{
                            ...waypointsData,
                            locationLat: generalInfo.locationLat,
                            locationLon: generalInfo.locationLon
                        }}
                        missionUAVIds={uavSelection.selectedUAVIds}
                        onUpdate={(update) => setWaypointsData({ ...waypointsData, ...update })}
                    />
                );
            case 5:
                return (
                    <RouteOptimizationStep
                        data={routeOptimization}
                        waypoints={waypointsData.waypoints}
                        onUpdate={(update) => 
                            setRouteOptimization({ ...routeOptimization, ...update })
                        }
                    />
                );
            case 6:
                // Get route points (optimized or original waypoints)
                const routePoints = routeOptimization.optimalRoute
                    ? routeOptimization.optimalRoute.optimizedRoute
                    : waypointsData.waypoints.map((wp, index) => ({
                        order: index,
                        lat: wp.latitude,
                        lng: wp.longitude
                    }));

                // Collect all tasks from all waypoints
                const allTasks = waypointsData.waypoints.flatMap(wp => wp.tasks);

                return (
                    <WeatherPermitsStep
                        data={weatherPermits}
                        onUpdate={(update) => 
                            setWeatherPermits({ ...weatherPermits, ...update })
                        }
                        missionDate={generalInfo.date}
                        routePoints={routePoints}
                        uavIds={uavSelection.selectedUAVIds}
                        allTasks={allTasks}
                    />
                );
            case 7:
                const summaryData: SummaryData = {
                    ...generalInfo,
                    ...uavSelection,
                    ...formation,
                    ...responsiblePersons,
                    ...waypointsData
                };
                return <SummaryStep data={summaryData} onUpdate={() => {}} />;
            default:
                return null;
        }
    };

    return (
        <WizardPageContainer>
            <WizardContainer>
                <WizardHeader>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <WizardTitle>New Mission</WizardTitle>
                        <QuitButton onClick={handleQuit}>
                            <ArrowLeft size={20} />
                            Quit
                        </QuitButton>
                    </div>

                    <StepIndicator>
                        {STEPS.map((_, index) => (
                            <Step
                                key={index}
                                active={index === currentStep}
                                completed={index < currentStep}
                            />
                        ))}
                    </StepIndicator>
                    <StepLabel>
                        Step {currentStep + 1} of {STEPS.length}: {STEPS[currentStep]}
                    </StepLabel>
                </WizardHeader>

                <WizardBody>{renderStep()}</WizardBody>

                <WizardFooter>
                    <SecondaryButton onClick={handleBack} disabled={currentStep === 0}>
                        Back
                    </SecondaryButton>

                    <ButtonGroup>
                        {currentStep < STEPS.length - 1 ? (
                            <PrimaryButton onClick={handleNext} disabled={!canProceed()}>
                                Next
                            </PrimaryButton>
                        ) : (
                            <PrimaryButton onClick={handleSubmit} disabled={loading || !canProceed()}>
                                {loading ? 'Creating...' : 'Create Mission'}
                            </PrimaryButton>
                        )}
                    </ButtonGroup>
                </WizardFooter>
            </WizardContainer>
        </WizardPageContainer>
    );
};

export default MissionWizard;
