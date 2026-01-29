/* eslint-disable @typescript-eslint/no-explicit-any */
import { Plane } from 'lucide-react';
import {
    FormationContainer,
    CoordinateSystem,
    CoordinateGrid,
    PlacedUAV,
    UAVIcon,
    UAVImage,
    UAVLabel
} from './FormationVisualization.styles';
import type { UAV } from '../../../types/uav.types';

interface FormationVisualizationProps {
    formationType: string;
    uavPositions: any[];
    selectedUAVs: UAV[];
}

const FormationVisualization = ({
    formationType,
    uavPositions,
    selectedUAVs
}: FormationVisualizationProps) => {

    // Convert backend positions (-100 to 100) to display (0-100%)
    const displayPositions = uavPositions.map(pos => ({
        uavId: pos.uavId || pos.UAVId,
        x: (pos.positionX / 2) + 50,
        y: (pos.positionY / 2) + 50
    }));

    const getUAVById = (id: number) => selectedUAVs.find(u => u.id === id);

    return (
        <FormationContainer>
            <h4 style={{ margin: '0 0 0.75rem 0', fontSize: '0.875rem', fontWeight: 600, color: '#6b7280' }}>
                Formation: {formationType}
            </h4>

            <CoordinateSystem>
                {/* Grid lines */}
                <CoordinateGrid>
                    {/* Vertical lines */}
                    {[0, 25, 50, 75, 100].map(x => (
                        <line
                            key={`v${x}`}
                            x1={`${x}%`}
                            y1="0%"
                            x2={`${x}%`}
                            y2="100%"
                            stroke="#e5e7eb"
                            strokeWidth={x === 50 ? "2" : "1"}
                            strokeDasharray={x === 50 ? "none" : "5,5"}
                        />
                    ))}

                    {/* Horizontal lines */}
                    {[0, 25, 50, 75, 100].map(y => (
                        <line
                            key={`h${y}`}
                            x1="0%"
                            y1={`${y}%`}
                            x2="100%"
                            y2={`${y}%`}
                            stroke="#e5e7eb"
                            strokeWidth={y === 50 ? "2" : "1"}
                            strokeDasharray={y === 50 ? "none" : "5,5"}
                        />
                    ))}
                </CoordinateGrid>

                {/* UAVs */}
                {displayPositions.map((pos, index) => {
                    const uav = getUAVById(pos.uavId);
                    if (!uav) return null;

                    return (
                        <PlacedUAV key={index} $x={pos.x} $y={pos.y}>
                            {uav.imagePath && uav.imagePath !== '' && uav.imagePath !== '/' ? (
                                <UAVImage src={uav.imagePath} alt={uav.name} />
                            ) : (
                                <UAVIcon>
                                    <Plane size={20} />
                                </UAVIcon>
                            )}
                            <UAVLabel>{uav.name}</UAVLabel>
                        </PlacedUAV>
                    );
                })}

                {/* Center marker */}
                <div style={{
                    position: 'absolute',
                    left: '50%',
                    top: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '8px',
                    height: '8px',
                    background: '#2c2c2c',
                    borderRadius: '50%',
                    border: '2px solid white',
                    boxShadow: '0 0 0 1px #2c2c2c'
                }} />
            </CoordinateSystem>

            <div style={{
                marginTop: '0.75rem',
                fontSize: '0.75rem',
                color: '#9ca3af',
                textAlign: 'center'
            }}>
                {displayPositions.length} UAV(s) positioned
            </div>
        </FormationContainer>
    );
};

export default FormationVisualization;