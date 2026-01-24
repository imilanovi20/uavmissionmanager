import type { CreateWaypointDto } from '../../../../../types/waypoint.types';
import { SecondaryButton } from '../../MissionWizard.styles';
import type { StepProps, WaypointsData } from '../../MissionWizard.types';

const WaypointsStep = ({ data, onUpdate }: StepProps<WaypointsData>) => {
  const addWaypoint = () => {
    const newWaypoint: CreateWaypointDto = {
      latitude: data.locationLat + (Math.random() - 0.5) * 0.01,
      longitude: data.locationLon + (Math.random() - 0.5) * 0.01,
      orderIndex: data.waypoints.length,
      tasks: []
    };
    
    onUpdate({ waypoints: [...data.waypoints, newWaypoint] });
  };

  const removeWaypoint = (index: number) => {
    onUpdate({ 
      waypoints: data.waypoints.filter((_, i) => i !== index)
    });
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h3 style={{ margin: 0, fontSize: '1.125rem' }}>Define Waypoints</h3>
        <SecondaryButton onClick={addWaypoint}>
          + Add Waypoint
        </SecondaryButton>
      </div>

      {data.waypoints.length === 0 ? (
        <div style={{ 
          padding: '3rem', 
          textAlign: 'center', 
          background: '#f9fafb', 
          borderRadius: '8px',
          color: '#6b7280'
        }}>
          <p>No waypoints added yet. Click "Add Waypoint" to start.</p>
          <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>
            Minimum 2 waypoints required.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {data.waypoints.map((wp, index) => (
            <div
              key={index}
              style={{
                padding: '1rem',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <div>
                <div style={{ fontWeight: 500, marginBottom: '0.25rem' }}>
                  Waypoint #{index + 1}
                </div>
                <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                  Lat: {wp.latitude.toFixed(4)}, Lon: {wp.longitude.toFixed(4)}
                </div>
              </div>
              <SecondaryButton onClick={() => removeWaypoint(index)}>
                Remove
              </SecondaryButton>
            </div>
          ))}
        </div>
      )}

      <p style={{ marginTop: '1rem', color: '#6b7280', fontSize: '0.875rem' }}>
        Total waypoints: {data.waypoints.length}
      </p>
    </div>
  );
};

export default WaypointsStep;
