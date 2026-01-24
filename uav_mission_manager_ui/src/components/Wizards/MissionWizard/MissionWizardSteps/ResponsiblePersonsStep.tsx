import { CheckboxLabel } from '../MissionWizard.styles';
import type { StepProps, ResponsiblePersonsData } from '../MissionWizard.types';

const ResponsiblePersonsStep = ({ data, onUpdate }: StepProps<ResponsiblePersonsData>) => {
  const toggleUser = (username: string) => {
    const newSelection = data.selectedUsernames.includes(username)
      ? data.selectedUsernames.filter(u => u !== username)
      : [...data.selectedUsernames, username];
    
    onUpdate({ selectedUsernames: newSelection });
  };

  return (
    <div>
      <h3 style={{ marginTop: 0, marginBottom: '1rem', fontSize: '1.125rem' }}>
        Select Responsible Persons
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {data.availableUsers.map((user) => (
          <CheckboxLabel key={user.id}>
            <input
              type="checkbox"
              checked={data.selectedUsernames.includes(user.username)}
              onChange={() => toggleUser(user.username)}
            />
            <div>
              <div style={{ fontWeight: 500 }}>{user.username}</div>
              <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                {user.email}
              </div>
            </div>
          </CheckboxLabel>
        ))}
      </div>
      <p style={{ marginTop: '1rem', color: '#6b7280', fontSize: '0.875rem' }}>
        Selected: {data.selectedUsernames.length} person(s)
      </p>
    </div>
  );
};

export default ResponsiblePersonsStep;
