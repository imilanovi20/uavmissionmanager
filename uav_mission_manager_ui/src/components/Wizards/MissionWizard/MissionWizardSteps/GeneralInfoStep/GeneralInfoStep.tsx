import { FormGroup, Label, Input, TextArea } from '../../MissionWizard.styles';
import type { StepProps, GeneralInfoData } from '../../MissionWizard.types';

const GeneralInfoStep = ({ data, onUpdate }: StepProps<GeneralInfoData>) => {
  return (
    <div>
      <FormGroup>
        <Label>Mission Name *</Label>
        <Input
          type="text"
          value={data.name}
          onChange={(e) => onUpdate({ name: e.target.value })}
          placeholder="Enter mission name"
        />
      </FormGroup>

      <FormGroup>
        <Label>Date *</Label>
        <Input
          type="date"
          value={data.date}
          onChange={(e) => onUpdate({ date: e.target.value })}
        />
      </FormGroup>

      <FormGroup>
        <Label>Description *</Label>
        <TextArea
          value={data.description}
          onChange={(e) => onUpdate({ description: e.target.value })}
          placeholder="Describe the mission objectives..."
        />
      </FormGroup>

      <FormGroup>
        <Label>Location (Latitude)</Label>
        <Input
          type="number"
          step="0.0001"
          value={data.locationLat}
          onChange={(e) => onUpdate({ locationLat: parseFloat(e.target.value) })}
        />
      </FormGroup>

      <FormGroup>
        <Label>Location (Longitude)</Label>
        <Input
          type="number"
          step="0.0001"
          value={data.locationLon}
          onChange={(e) => onUpdate({ locationLon: parseFloat(e.target.value) })}
        />
      </FormGroup>
    </div>
  );
};

export default GeneralInfoStep;
