import { useState } from 'react';
import { Plus, MapPin, Trash2, Edit } from 'lucide-react';
import type { StepProps, WaypointsData } from '../../MissionWizard.types';
import type { CreateWaypointDto } from '../../../../../types/waypoint.types';
import { useUAV } from '../../../../../hooks/useUAVs';
import WaypointMap from '../../../../Maps/WaypointMap/WaypointMap';
import TaskModal from './Modals/TaskModal/TaskModal';
import { 
  AddTaskButton, 
  Container,
  TopSection,
  MapSection,
  AddPanelSection,
  EmptyState, 
  Header, 
  IconButton, 
  Summary, 
  TaskBadge, 
  TaskItem, 
  TaskName, 
  TasksList, 
  Title, 
  WaypointActions, 
  WaypointCard, 
  WaypointHeader, 
  WaypointInfo, 
  WaypointsList, 
  WaypointsListSection, 
  WaypointTitle,
  AddWaypointPanel,
  AddWaypointInput,
  AddWaypointButton,
  AddWaypointTitle,
  InputGroup,
  InputLabel
} from './WaypointStep.styles';

interface WaypointsStepProps extends StepProps<WaypointsData> {
  missionUAVIds: number[];
}

const WaypointsStep = ({ data, missionUAVIds, onUpdate }: WaypointsStepProps) => {
  const { uavs } = useUAV({ itemsPerPage: 100 });
  
  const [selectedWaypointIndex, setSelectedWaypointIndex] = useState<number | null>(null);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [editingTaskIndex, setEditingTaskIndex] = useState<number | null>(null);
  const [latitude, setLatitude] = useState(data.locationLat.toString());
  const [longitude, setLongitude] = useState(data.locationLon.toString());
  const [poiMarker, setPoiMarker] = useState<{ lat: number; lon: number } | null>(null);

  const addWaypoint = () => {
    const lat = parseFloat(latitude);
    const lon = parseFloat(longitude);
    
    if (isNaN(lat) || isNaN(lon)) return;
    
    const newWaypoint: CreateWaypointDto = {
      latitude: lat,
      longitude: lon,
      orderIndex: data.waypoints.length,
      tasks: []
    };
    
    onUpdate({ waypoints: [...data.waypoints, newWaypoint] });
    setSelectedWaypointIndex(data.waypoints.length);
    setPoiMarker(null);
  };

  const handleMapClick = (lat: number, lon: number) => {
    setLatitude(lat.toFixed(6));
    setLongitude(lon.toFixed(6));
    setPoiMarker({ lat, lon });
  };

  const removeWaypoint = (index: number) => {
    const newWaypoints = data.waypoints
      .filter((_, i) => i !== index)
      .map((wp, i) => ({ ...wp, orderIndex: i }));
    
    onUpdate({ waypoints: newWaypoints });
    
    if (selectedWaypointIndex === index) {
      setSelectedWaypointIndex(null);
    } else if (selectedWaypointIndex !== null && selectedWaypointIndex > index) {
      setSelectedWaypointIndex(selectedWaypointIndex - 1);
    }
  };

  const updateWaypointPosition = (index: number, lat: number, lon: number) => {
    const newWaypoints = [...data.waypoints];
    newWaypoints[index] = {
      ...newWaypoints[index],
      latitude: lat,
      longitude: lon
    };
    onUpdate({ waypoints: newWaypoints });
  };

  const addTaskToWaypoint = (waypointIndex: number, task: any) => {
    const newWaypoints = [...data.waypoints];
    const currentTasks = newWaypoints[waypointIndex].tasks || [];
    
    if (editingTaskIndex !== null) {
      currentTasks[editingTaskIndex] = task;
    } else {
      currentTasks.push(task);
    }
    
    newWaypoints[waypointIndex] = {
      ...newWaypoints[waypointIndex],
      tasks: currentTasks
    };
    
    onUpdate({ waypoints: newWaypoints });
    setShowTaskModal(false);
    setEditingTaskIndex(null);
  };

  const removeTask = (waypointIndex: number, taskIndex: number) => {
    const newWaypoints = [...data.waypoints];
    const tasks = newWaypoints[waypointIndex].tasks || [];
    newWaypoints[waypointIndex] = {
      ...newWaypoints[waypointIndex],
      tasks: tasks.filter((_: any, i: number) => i !== taskIndex)
    };
    onUpdate({ waypoints: newWaypoints });
  };

  const getAutomaticTasks = (index: number) => {
    const tasks = [];
    const isFirst = index === 0;
    const isLast = index === data.waypoints.length - 1;
    
    if (isFirst) {
      tasks.push({ name: 'TakeOff', order: 0 });
    }
    
    if (!isLast) {
      const nextWaypoint = data.waypoints[index + 1];
      tasks.push({
        name: 'MoveToPosition',
        order: 999,
        parameters: {
          latitude: nextWaypoint.latitude,
          longitude: nextWaypoint.longitude
        }
      });
    }
    
    if (isLast) {
      tasks.push({ name: 'Land', order: 1000 });
    }
    
    return tasks;
  };

  const getOrderedTasks = (waypointIndex: number) => {
    const autoTasks = getAutomaticTasks(waypointIndex);
    const customTasks = (data.waypoints[waypointIndex].tasks || []).map((task: any, idx: number) => ({
      ...task,
      customIndex: idx,
      isCustom: true
    }));

    const allTasks = [
      ...autoTasks.filter(t => t.name === 'TakeOff'),
      ...customTasks,
      ...autoTasks.filter(t => t.name === 'MoveToPosition'),
      ...autoTasks.filter(t => t.name === 'Land')
    ];

    return allTasks;
  };

  return (
    <div>
      <h3 style={{ marginTop: 0, marginBottom: '1.5rem', fontSize: '1.125rem' }}>
        Define Mission Waypoints
      </h3>

      <Container>
        <TopSection>
          <MapSection>
            <WaypointMap
              waypoints={data.waypoints}
              poiMarker={poiMarker}
              selectedIndex={selectedWaypointIndex}
              onWaypointClick={setSelectedWaypointIndex}
              onMapClick={handleMapClick}
              onWaypointDrag={updateWaypointPosition}
              centerLat={data.locationLat}
              centerLon={data.locationLon}
            />
          </MapSection>

          <AddPanelSection>
            <AddWaypointPanel>
              <AddWaypointTitle>Add Waypoint</AddWaypointTitle>
              
              <InputGroup>
                <InputLabel>Latitude</InputLabel>
                <AddWaypointInput
                  type="number"
                  step="any"
                  value={latitude}
                  onChange={(e) => setLatitude(e.target.value)}
                  placeholder="Enter latitude..."
                />
              </InputGroup>

              <InputGroup>
                <InputLabel>Longitude</InputLabel>
                <AddWaypointInput
                  type="number"
                  step="any"
                  value={longitude}
                  onChange={(e) => setLongitude(e.target.value)}
                  placeholder="Enter longitude..."
                />
              </InputGroup>

              <AddWaypointButton onClick={addWaypoint}>
                <Plus size={16} />
                Add Waypoint
              </AddWaypointButton>
            </AddWaypointPanel>
          </AddPanelSection>
        </TopSection>

        <WaypointsListSection>
          <Header>
            <Title>Waypoints ({data.waypoints.length})</Title>
          </Header>

          {data.waypoints.length === 0 ? (
            <EmptyState>
              <MapPin size={40} style={{ margin: '0 auto 0.75rem', opacity: 0.3 }} />
              <p style={{ margin: 0, fontSize: '0.875rem' }}>No waypoints yet</p>
              <p style={{ fontSize: '0.75rem', margin: '0.375rem 0 0 0' }}>
                Click on the map or add manually
              </p>
            </EmptyState>
          ) : (
            <>
              <WaypointsList>
                {data.waypoints.map((wp, index) => {
                  const orderedTasks = getOrderedTasks(index);
                  
                  return (
                    <WaypointCard
                      key={index}
                      $active={selectedWaypointIndex === index}
                      onClick={() => setSelectedWaypointIndex(index)}
                    >
                      <WaypointHeader>
                        <WaypointTitle>
                          <MapPin size={14} />
                          Waypoint #{index + 1}
                        </WaypointTitle>
                        <WaypointActions>
                          <IconButton
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedWaypointIndex(index);
                              setShowTaskModal(true);
                              setEditingTaskIndex(null);
                            }}
                            title="Add task"
                          >
                            <Plus size={14} />
                          </IconButton>
                          <IconButton
                            onClick={(e) => {
                              e.stopPropagation();
                              removeWaypoint(index);
                            }}
                            title="Delete waypoint"
                          >
                            <Trash2 size={14} />
                          </IconButton>
                        </WaypointActions>
                      </WaypointHeader>

                      <WaypointInfo>
                        {wp.latitude.toFixed(6)}, {wp.longitude.toFixed(6)}
                      </WaypointInfo>

                      <TasksList>
                        {orderedTasks.map((task: any, taskIdx) => (
                          <TaskItem key={`task-${taskIdx}`} $auto={!task.isCustom}>
                            <TaskName>{task.name || task.type}</TaskName>
                            <div style={{ display: 'flex', gap: '0.25rem', alignItems: 'center' }}>
                              {!task.isCustom ? (
                                <TaskBadge $auto>AUTO</TaskBadge>
                              ) : (
                                <>
                                  <IconButton
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setSelectedWaypointIndex(index);
                                      setEditingTaskIndex(task.customIndex);
                                      setShowTaskModal(true);
                                    }}
                                  >
                                    <Edit size={11} />
                                  </IconButton>
                                  <IconButton
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      removeTask(index, task.customIndex);
                                    }}
                                  >
                                    <Trash2 size={11} />
                                  </IconButton>
                                </>
                              )}
                            </div>
                          </TaskItem>
                        ))}
                      </TasksList>

                      <AddTaskButton
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedWaypointIndex(index);
                          setShowTaskModal(true);
                          setEditingTaskIndex(null);
                        }}
                      >
                        + Add Custom Task
                      </AddTaskButton>
                    </WaypointCard>
                  );
                })}
              </WaypointsList>

              <Summary>
                <strong>Total:</strong> {data.waypoints.length} waypoint(s)
                <br />
                <strong>Tasks:</strong> {data.waypoints.reduce((sum, wp, idx) => 
                  sum + getAutomaticTasks(idx).length + (wp.tasks?.length || 0), 0
                )}
              </Summary>
            </>
          )}
        </WaypointsListSection>
      </Container>

      {showTaskModal && selectedWaypointIndex !== null && (
        <TaskModal
          waypointIndex={selectedWaypointIndex}
          missionUAVIds={missionUAVIds}
          allUAVs={uavs}
          existingTask={editingTaskIndex !== null 
            ? data.waypoints[selectedWaypointIndex].tasks?.[editingTaskIndex]
            : undefined
          }
          onSave={(task) => addTaskToWaypoint(selectedWaypointIndex, task)}
          onClose={() => {
            setShowTaskModal(false);
            setEditingTaskIndex(null);
          }}
        />
      )}
    </div>
  );
};

export default WaypointsStep;