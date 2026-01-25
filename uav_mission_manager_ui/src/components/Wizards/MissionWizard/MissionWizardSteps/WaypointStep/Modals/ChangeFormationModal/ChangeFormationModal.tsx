import { useState } from 'react';
import { X, ArrowLeft } from 'lucide-react';
import FormationBuilder from '../../../FormationStep/FormationBuilder';
import type { UAV } from '../../../../../../../types/uav.types';
import type { FormationData } from '../../../../MissionWizard.types';
import { 
  BackButton, 
  Body, 
  Button, 
  CloseButton, 
  Footer, 
  Header, 
  HeaderLeft, 
  Info, 
  Modal, 
  Overlay, 
  Title 
} from './ChangeFormation.styles';

interface ChangeFormationModalProps {
  selectedUAVs: UAV[];
  existingData?: any;
  onSave: (data: any) => void;
  onBack: () => void;
  onClose: () => void;
}

const ChangeFormationModal = ({
  selectedUAVs,
  existingData,
  onSave,
  onBack,
  onClose
}: ChangeFormationModalProps) => {
  const [formationData, setFormationData] = useState<FormationData>({
    formationType: existingData?.parameters?.FormationType || 'Line',
    positions: existingData?.parameters?.UAVPositions || []
  });

  const handleSave = () => {
    const taskData = {
      parameters: {
        FormationType: formationData.formationType,
        UAVPositions: formationData.positions,
        Order: 0
      }
    };
    
    onSave(taskData);
  };

  const handleUpdate = (updatedData: Partial<FormationData>) => {
    setFormationData(prev => ({ ...prev, ...updatedData }));
  };

  return (
    <Overlay onClick={onClose}>
      <Modal onClick={(e) => e.stopPropagation()}>
        <Header>
          <HeaderLeft>
            <BackButton onClick={onBack}>
              <ArrowLeft size={20} />
            </BackButton>
            <Title>Change Formation Task</Title>
          </HeaderLeft>
          <CloseButton onClick={onClose}>
            <X size={24} />
          </CloseButton>
        </Header>

        <Body>
          <Info>
            ℹ️ This task will change the UAV formation when reaching this waypoint.
          </Info>

          <FormationBuilder
            selectedUAVs={selectedUAVs}
            data={formationData}
            onUpdate={handleUpdate}
          />
        </Body>

        <Footer>
          <Button onClick={onBack}>Cancel</Button>
          <Button $primary onClick={handleSave}>
            Save Task
          </Button>
        </Footer>
      </Modal>
    </Overlay>
  );
};

export default ChangeFormationModal;