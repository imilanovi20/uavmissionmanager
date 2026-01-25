import { useState } from 'react';
import { X } from 'lucide-react';
import ChangeFormationModal from '../ChangeFormationModal/ChangeFormationModal';
import ExecuteCommandModal from '../ExecuteCommandModal/ExecuteCommandModal';
import type { UAV } from '../../../../../../../types/uav.types';
import { 
  Body, 
  CloseButton, 
  Header, 
  Modal, 
  Overlay, 
  TaskTypeCard, 
  TaskTypeDesc, 
  TaskTypeGrid, 
  TaskTypeIcon, 
  TaskTypeName, 
  Title 
} from './TaskModal.styles';

interface TaskModalProps {
  waypointIndex: number;
  missionUAVIds: number[];
  allUAVs: UAV[];
  existingTask?: any;
  onSave: (task: any) => void;
  onClose: () => void;
}

const TaskModal = ({ 
  waypointIndex, 
  missionUAVIds,
  allUAVs,
  existingTask, 
  onSave, 
  onClose 
}: TaskModalProps) => {
  const [selectedType, setSelectedType] = useState<string | null>(
    existingTask?.type || null
  );

  // Filter to only mission UAVs
  const selectedUAVs = allUAVs.filter(uav => missionUAVIds.includes(uav.id));

  const handleTaskTypeSelect = (type: string) => {
    setSelectedType(type);
  };

  const handleTaskSave = (taskData: any) => {
    onSave({
      type: selectedType,
      ...taskData
    });
  };

  if (selectedType === 'ChangeFormation') {
    return (
      <ChangeFormationModal
        selectedUAVs={selectedUAVs}
        existingData={existingTask}
        onSave={handleTaskSave}
        onBack={() => setSelectedType(null)}
        onClose={onClose}
      />
    );
  }

  if (selectedType === 'ExecuteCommand') {
    return (
      <ExecuteCommandModal
        missionUAVIds={missionUAVIds}
        allUAVs={allUAVs}
        existingData={existingTask}
        onSave={handleTaskSave}
        onBack={() => setSelectedType(null)}
        onClose={onClose}
      />
    );
  }

  return (
    <Overlay onClick={onClose}>
      <Modal onClick={(e) => e.stopPropagation()}>
        <Header>
          <Title>
            {existingTask ? 'Edit Task' : `Add Task to Waypoint #${waypointIndex + 1}`}
          </Title>
          <CloseButton onClick={onClose}>
            <X size={24} />
          </CloseButton>
        </Header>

        <Body>
          <p style={{ margin: '0 0 1.5rem 0', color: '#6b7280', fontSize: '0.875rem' }}>
            Select a task type to add to this waypoint:
          </p>

          <TaskTypeGrid>
            <TaskTypeCard onClick={() => handleTaskTypeSelect('ChangeFormation')}>
              <TaskTypeIcon>🔄</TaskTypeIcon>
              <TaskTypeName>Change Formation</TaskTypeName>
              <TaskTypeDesc>
                Modify UAV formation at this waypoint
              </TaskTypeDesc>
            </TaskTypeCard>

            <TaskTypeCard onClick={() => handleTaskTypeSelect('ExecuteCommand')}>
              <TaskTypeIcon>⚡</TaskTypeIcon>
              <TaskTypeName>Execute Command</TaskTypeName>
              <TaskTypeDesc>
                Send command to UAV equipment
              </TaskTypeDesc>
            </TaskTypeCard>
          </TaskTypeGrid>
        </Body>
      </Modal>
    </Overlay>
  );
};

export default TaskModal;