import type { StepProps, SummaryData } from '../MissionWizard.types';

const SummaryStep = ({ data }: StepProps<SummaryData>) => {
  return (
    <div>
      <h3 style={{ marginTop: 0, marginBottom: '1.5rem', fontSize: '1.125rem' }}>
        Mission Summary
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div>
          <h4 style={{ margin: '0 0 0.5rem 0', color: '#6b7280', fontSize: '0.875rem', fontWeight: 500 }}>
            GENERAL INFO
          </h4>
          <div style={{ padding: '1rem', background: '#f9fafb', borderRadius: '8px' }}>
            <p style={{ margin: '0 0 0.5rem 0' }}><strong>Name:</strong> {data.name}</p>
            <p style={{ margin: '0 0 0.5rem 0' }}><strong>Date:</strong> {data.date}</p>
            <p style={{ margin: 0 }}><strong>Description:</strong> {data.description}</p>
          </div>
        </div>

        <div>
          <h4 style={{ margin: '0 0 0.5rem 0', color: '#6b7280', fontSize: '0.875rem', fontWeight: 500 }}>
            UAVs ({data.selectedUAVIds.length})
          </h4>
          <div style={{ padding: '1rem', background: '#f9fafb', borderRadius: '8px' }}>
            {data.selectedUAVIds.map(id => {
              const uav = data.availableUAVs.find(u => u.id === id);
              return uav ? <div key={id}>• {uav.name}</div> : null;
            })}
          </div>
        </div>

        <div>
          <h4 style={{ margin: '0 0 0.5rem 0', color: '#6b7280', fontSize: '0.875rem', fontWeight: 500 }}>
            FORMATION
          </h4>
          <div style={{ padding: '1rem', background: '#f9fafb', borderRadius: '8px' }}>
            <p style={{ margin: 0 }}>{data.formationType}</p>
          </div>
        </div>

        <div>
          <h4 style={{ margin: '0 0 0.5rem 0', color: '#6b7280', fontSize: '0.875rem', fontWeight: 500 }}>
            RESPONSIBLE PERSONS ({data.selectedUsernames.length})
          </h4>
          <div style={{ padding: '1rem', background: '#f9fafb', borderRadius: '8px' }}>
            {data.selectedUsernames.map(username => (
              <div key={username}>• {username}</div>
            ))}
          </div>
        </div>

        <div>
          <h4 style={{ margin: '0 0 0.5rem 0', color: '#6b7280', fontSize: '0.875rem', fontWeight: 500 }}>
            WAYPOINTS ({data.waypoints.length})
          </h4>
          <div style={{ padding: '1rem', background: '#f9fafb', borderRadius: '8px' }}>
            {data.waypoints.map((wp, index) => (
              <div key={index} style={{ marginBottom: index < data.waypoints.length - 1 ? '0.5rem' : 0 }}>
                Waypoint #{index + 1}: {wp.latitude.toFixed(4)}, {wp.longitude.toFixed(4)}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummaryStep;
