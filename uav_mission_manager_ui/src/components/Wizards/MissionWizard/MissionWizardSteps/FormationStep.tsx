import { SelectableCard, Grid } from '../MissionWizard.styles';
import type { StepProps, FormationData } from '../MissionWizard.types';

const FORMATION_TYPES = [
  { type: 'Line', description: 'Standard line formation' },
  { type: 'Grid', description: 'Standard grid formation' },
  { type: 'V-Formation', description: 'Standard v-formation' },
  { type: 'Circle', description: 'Standard circle formation' }
];

const FormationStep = ({ data, onUpdate }: StepProps<FormationData>) => {
  return (
    <div>
      <h3 style={{ marginTop: 0, marginBottom: '1rem', fontSize: '1.125rem' }}>
        Select Initial Formation
      </h3>
      <Grid>
        {FORMATION_TYPES.map(({ type, description }) => (
          <SelectableCard
            key={type}
            selected={data.formationType === type}
            onClick={() => onUpdate({ formationType: type })}
          >
            <h4 style={{ margin: 0 }}>{type}</h4>
            <p style={{ margin: '0.5rem 0 0 0', color: '#6b7280', fontSize: '0.875rem' }}>
              {description}
            </p>
          </SelectableCard>
        ))}
      </Grid>
    </div>
  );
};

export default FormationStep;
