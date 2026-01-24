import { SelectableCard, Grid } from '../MissionWizard.styles';
import type { StepProps, UAVSelectionData } from '../MissionWizard.types';

const UAVSelectionStep = ({ data, onUpdate }: StepProps<UAVSelectionData>) => {
  const toggleUAV = (uavId: number) => {
    const newSelection = data.selectedUAVIds.includes(uavId)
      ? data.selectedUAVIds.filter(id => id !== uavId)
      : [...data.selectedUAVIds, uavId];
    
    onUpdate({ selectedUAVIds: newSelection });
  };

  return (
    <div>
      <h3 style={{ marginTop: 0, marginBottom: '1rem', fontSize: '1.125rem' }}>
        Select UAVs for this mission
      </h3>
      <Grid>
        {data.availableUAVs.map((uav) => (
          <SelectableCard
            key={uav.id}
            selected={data.selectedUAVIds.includes(uav.id)}
            onClick={() => toggleUAV(uav.id)}
          >
            <h4 style={{ margin: '0 0 0.5rem 0' }}>{uav.name}</h4>
            <p style={{ margin: 0, color: '#6b7280', fontSize: '0.875rem' }}>
              {uav.type}
            </p>
            <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.875rem' }}>
              Max Speed: {uav.maxSpeed} km/h
            </p>
          </SelectableCard>
        ))}
      </Grid>
      <p style={{ marginTop: '1rem', color: '#6b7280', fontSize: '0.875rem' }}>
        Selected: {data.selectedUAVIds.length} UAV(s)
      </p>
    </div>
  );
};

export default UAVSelectionStep;
