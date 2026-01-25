import { useState, useMemo } from 'react';
import { X, ArrowLeft, ChevronRight, Plane, Settings } from 'lucide-react';
import type { UAV } from '../../../../../../../types/uav.types';
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
  Title,
  StepIndicator,
  StepDot,
  StepLine,
  SelectionList,
  SelectionCard,
  SelectionIcon,
  SelectionImage,
  SelectionContent,
  SelectionName,
  SelectionType,
  Input,
  Label,
  SettingsContainer,
  SettingRow,
  RemoveSettingButton,
  AddSettingButton,
  EmptyState
} from './ExecuteCommand.styles';

interface ExecuteCommandModalProps {
  missionUAVIds: number[];
  allUAVs: UAV[];
  existingData?: any;
  onSave: (data: any) => void;
  onBack: () => void;
  onClose: () => void;
}

const ExecuteCommandModal = ({
  missionUAVIds,
  allUAVs,
  existingData,
  onSave,
  onBack,
  onClose
}: ExecuteCommandModalProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedUAVId, setSelectedUAVId] = useState<number | null>(
    existingData?.parameters?.UAVId || null
  );
  const [selectedEquipmentId, setSelectedEquipmentId] = useState<number | null>(
    existingData?.parameters?.EquipmentId || null
  );
  const [command, setCommand] = useState(
    existingData?.parameters?.Command || ''
  );
  const [settings, setSettings] = useState<{ key: string; value: string }[]>(
    existingData?.parameters?.Settings 
      ? Object.entries(existingData.parameters.Settings).map(([key, value]) => ({ 
          key, 
          value: String(value) 
        }))
      : [{ key: '', value: '' }]
  );

  // Filter to only mission UAVs
  const missionUAVs = useMemo(
    () => allUAVs.filter(uav => missionUAVIds.includes(uav.id)),
    [allUAVs, missionUAVIds]
  );

  // Get selected UAV's equipment
  const selectedUAV = useMemo(
    () => missionUAVs.find(uav => uav.id === selectedUAVId),
    [missionUAVs, selectedUAVId]
  );

  const equipment = selectedUAV?.additionalEquipments || [];

  const handleUAVSelect = (uavId: number) => {
    setSelectedUAVId(uavId);
    setSelectedEquipmentId(null);
    setCurrentStep(2);
  };

  const handleEquipmentSelect = (equipmentId: number) => {
    setSelectedEquipmentId(equipmentId);
    setCurrentStep(3);
  };

  const handleAddSetting = () => {
    setSettings([...settings, { key: '', value: '' }]);
  };

  const handleRemoveSetting = (index: number) => {
    setSettings(settings.filter((_, i) => i !== index));
  };

  const handleSettingChange = (index: number, field: 'key' | 'value', value: string) => {
    const newSettings = [...settings];
    newSettings[index][field] = value;
    setSettings(newSettings);
  };

  const handleSave = () => {
    const settingsObject = settings
      .filter(s => s.key.trim() !== '')
      .reduce((acc, s) => ({ ...acc, [s.key]: s.value }), {});

    const taskData = {
      parameters: {
        UAVId: selectedUAVId,
        EquipmentId: selectedEquipmentId,
        Command: command,
        Settings: settingsObject,
        Order: 0
      }
    };
    
    onSave(taskData);
  };

  const canProceed = () => {
    if (currentStep === 1) return selectedUAVId !== null;
    if (currentStep === 2) return selectedEquipmentId !== null;
    if (currentStep === 3) return command.trim() !== '';
    return false;
  };

  const selectedEquipment = equipment.find(eq => eq.id === selectedEquipmentId);

  return (
    <Overlay onClick={onClose}>
      <Modal onClick={(e) => e.stopPropagation()}>
        <Header>
          <HeaderLeft>
            <BackButton onClick={currentStep === 1 ? onBack : () => setCurrentStep(currentStep - 1)}>
              <ArrowLeft size={20} />
            </BackButton>
            <Title>Execute Command Task</Title>
          </HeaderLeft>
          <CloseButton onClick={onClose}>
            <X size={24} />
          </CloseButton>
        </Header>

        <Body>
          <StepIndicator>
            <StepDot $active={currentStep >= 1}>1</StepDot>
            <StepLine $active={currentStep >= 2} />
            <StepDot $active={currentStep >= 2}>2</StepDot>
            <StepLine $active={currentStep >= 3} />
            <StepDot $active={currentStep >= 3}>3</StepDot>
          </StepIndicator>

          {/* STEP 1: Select UAV */}
          {currentStep === 1 && (
            <>
              <Info>
                📡 Step 1: Select which UAV will execute the command
              </Info>

              <SelectionList>
                {missionUAVs.map(uav => (
                  <SelectionCard
                    key={uav.id}
                    $selected={selectedUAVId === uav.id}
                    onClick={() => handleUAVSelect(uav.id)}
                  >
                    <SelectionIcon>
                      {uav.imagePath ? (
                        <SelectionImage src={uav.imagePath} alt={uav.name} />
                      ) : (
                        <Plane size={24} />
                      )}
                    </SelectionIcon>
                    <SelectionContent>
                      <SelectionName>{uav.name}</SelectionName>
                      <SelectionType>{uav.type}</SelectionType>
                    </SelectionContent>
                  </SelectionCard>
                ))}
              </SelectionList>
            </>
          )}

          {/* STEP 2: Select Equipment */}
          {currentStep === 2 && (
            <>
              <Info>
                🔧 Step 2: Select which equipment on <strong>{selectedUAV?.name}</strong> to control
              </Info>

              {equipment.length === 0 ? (
                <EmptyState>
                  No equipment available for this UAV
                </EmptyState>
              ) : (
                <SelectionList>
                  {equipment.map(eq => (
                    <SelectionCard
                      key={eq.id}
                      $selected={selectedEquipmentId === eq.id}
                      onClick={() => handleEquipmentSelect(eq.id)}
                    >
                      <SelectionIcon>
                        <Settings size={24} />
                      </SelectionIcon>
                      <SelectionContent>
                        <SelectionName>{eq.name}</SelectionName>
                        <SelectionType>{eq.type || 'Equipment'}</SelectionType>
                      </SelectionContent>
                    </SelectionCard>
                  ))}
                </SelectionList>
              )}
            </>
          )}

          {/* STEP 3: Command + Settings */}
          {currentStep === 3 && (
            <>
              <Info>
                ⚡ Step 3: Configure command for <strong>{selectedEquipment?.name}</strong>
              </Info>

              <div style={{ marginBottom: '1.5rem' }}>
                <Label>Command</Label>
                <Input
                  type="text"
                  value={command}
                  onChange={(e) => setCommand(e.target.value)}
                  placeholder="e.g., START_RECORDING, CAPTURE_IMAGE, etc."
                />
              </div>

              <Label>Settings (Optional)</Label>
              <SettingsContainer>
                {settings.map((setting, index) => (
                  <SettingRow key={index}>
                    <Input
                      type="text"
                      value={setting.key}
                      onChange={(e) => handleSettingChange(index, 'key', e.target.value)}
                      placeholder="Key (e.g., resolution)"
                      style={{ flex: 1 }}
                    />
                    <Input
                      type="text"
                      value={setting.value}
                      onChange={(e) => handleSettingChange(index, 'value', e.target.value)}
                      placeholder="Value (e.g., 1080p)"
                      style={{ flex: 1 }}
                    />
                    {settings.length > 1 && (
                      <RemoveSettingButton onClick={() => handleRemoveSetting(index)}>
                        ×
                      </RemoveSettingButton>
                    )}
                  </SettingRow>
                ))}
                <AddSettingButton onClick={handleAddSetting}>
                  + Add Setting
                </AddSettingButton>
              </SettingsContainer>
            </>
          )}
        </Body>

        <Footer>
          <Button onClick={currentStep === 1 ? onBack : () => setCurrentStep(currentStep - 1)}>
            {currentStep === 1 ? 'Cancel' : 'Back'}
          </Button>
          
          {currentStep < 3 ? (
            <Button 
              $primary 
              onClick={() => setCurrentStep(currentStep + 1)}
              disabled={!canProceed()}
            >
              Next <ChevronRight size={16} />
            </Button>
          ) : (
            <Button $primary onClick={handleSave} disabled={!canProceed()}>
              Save Task
            </Button>
          )}
        </Footer>
      </Modal>
    </Overlay>
  );
};

export default ExecuteCommandModal;