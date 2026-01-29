import { useState, useRef, useEffect } from 'react';
import { Plane, X } from 'lucide-react';
import {
  FormationContainer,
  UAVListSection,
  UAVListTitle,
  UAVListGrid,
  UAVListItem,
  UAVListImage,
  UAVListImagePlaceholder,
  UAVListContent,
  UAVListName,
  UAVListType,
  FormationBuilderSection,
  FormationTypeSelector,
  FormationTypeButton,
  CoordinateSystemContainer,
  CoordinateGrid,
  CoordinateDropZone,
  PlacedUAV,
  PlacedUAVContent,
  PlacedUAVImage,
  PlacedUAVImagePlaceholder,
  PlacedUAVLabel,
  RemoveButton,
  InstructionText,
  CoordinateInfo,
  AutoArrangeButton
} from './FormationBuilder.styles';
import type { FormationData, StepProps } from '../../MissionWizard.types';
import type { UAV } from '../../../../../types/uav.types';

interface FormationStepProps extends StepProps<FormationData> {
  selectedUAVs: UAV[];
}

interface PlacedUAVPosition {
  uavId: number;
  x: number; 
  y: number;
}

const FORMATION_TYPES = ['Custom', 'Line', 'Grid', 'V-Formation', 'Circle'];

const FormationStep = ({ data, selectedUAVs, onUpdate }: FormationStepProps) => {
  const [placedUAVs, setPlacedUAVs] = useState<PlacedUAVPosition[]>([]);
  const [draggedUAVId, setDraggedUAVId] = useState<number | null>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const convertedPositions = placedUAVs.map(p => ({
        uavId: p.uavId,
        positionX: (p.x - 50) * 2,
        positionY: (p.y - 50) * 2,
        positionZ: 0
      }));
      
      if (placedUAVs.length > 0) {
        onUpdate({ positions: convertedPositions });
      } else if (placedUAVs.length === 0 && data.positions.length > 0) {
        onUpdate({ positions: [] });
      }
    }, [placedUAVs]);

  const isUAVPlaced = (uavId: number) => {
    return placedUAVs.some(p => p.uavId === uavId);
  };

  const handleDragStart = (uav: UAV) => {
    if (!isUAVPlaced(uav.id)) {
      setDraggedUAVId(uav.id);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    
    if (!draggedUAVId || !dropZoneRef.current) return;
    
    const rect = dropZoneRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    // Constrain to 0-100%
    const constrainedX = Math.max(0, Math.min(100, x));
    const constrainedY = Math.max(0, Math.min(100, y));
    
    setPlacedUAVs([...placedUAVs, {
      uavId: draggedUAVId,
      x: constrainedX,
      y: constrainedY
    }]);
    
    setDraggedUAVId(null);
  };

  const handleRemoveUAV = (uavId: number) => {
    setPlacedUAVs(placedUAVs.filter(p => p.uavId !== uavId));
  };

  const handlePlacedUAVDragStart = (uavId: number) => {
    setDraggedUAVId(uavId);
  };

  const handlePlacedUAVDrop = (e: React.DragEvent) => {
    e.preventDefault();
    
    if (!draggedUAVId || !dropZoneRef.current) return;
    
    const rect = dropZoneRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    const constrainedX = Math.max(0, Math.min(100, x));
    const constrainedY = Math.max(0, Math.min(100, y));
    
    setPlacedUAVs(placedUAVs.map(p => 
      p.uavId === draggedUAVId 
        ? { ...p, x: constrainedX, y: constrainedY }
        : p
    ));
    
    setDraggedUAVId(null);
  };

  const autoArrange = () => {
    if (selectedUAVs.length === 0) return;
    
    const positions: PlacedUAVPosition[] = [];
    
    switch (data.formationType) {
      case 'Line':
        // Horizontal line at 50% height
        selectedUAVs.forEach((uav, index) => {
          const spacing = 80 / (selectedUAVs.length + 1);
          positions.push({
            uavId: uav.id,
            x: 10 + spacing * (index + 1),
            y: 50
          });
        });
        break;
        
      case 'Grid':
        // Grid arrangement
        const cols = Math.ceil(Math.sqrt(selectedUAVs.length));
        selectedUAVs.forEach((uav, index) => {
          const row = Math.floor(index / cols);
          const col = index % cols;
          positions.push({
            uavId: uav.id,
            x: 20 + (col * 60 / (cols - 1 || 1)),
            y: 20 + (row * 60 / (Math.ceil(selectedUAVs.length / cols) - 1 || 1))
          });
        });
        break;
        
      case 'V-Formation':
        // V shape
        selectedUAVs.forEach((uav, index) => {
          const middle = Math.floor(selectedUAVs.length / 2);
          const offset = Math.abs(index - middle);
          positions.push({
            uavId: uav.id,
            x: 50,
            y: 20 + (index * 60 / (selectedUAVs.length - 1 || 1))
          });
          if (index !== middle) {
            positions[index].x = 50 + (index < middle ? -1 : 1) * offset * 10;
          }
        });
        break;
        
      case 'Circle':
        // Circular arrangement
        selectedUAVs.forEach((uav, index) => {
          const angle = (index / selectedUAVs.length) * 2 * Math.PI;
          const radius = 30;
          positions.push({
            uavId: uav.id,
            x: 50 + radius * Math.cos(angle),
            y: 50 + radius * Math.sin(angle)
          });
        });
        break;
        
      case 'Custom':
      default:
        // Place all in center if custom
        selectedUAVs.forEach((uav, index) => {
          positions.push({
            uavId: uav.id,
            x: 40 + (index * 5),
            y: 40 + (index * 5)
          });
        });
    }
    
    setPlacedUAVs(positions);
  };

  const getUAVById = (id: number) => selectedUAVs.find(u => u.id === id);

  return (
    <div>
      <h3 style={{ marginTop: 0, marginBottom: '1rem', fontSize: '1.125rem' }}>
        Formation Builder
      </h3>
      
      <FormationTypeSelector>
        {FORMATION_TYPES.map(type => (
          <FormationTypeButton
            key={type}
            $active={data.formationType === type}
            onClick={() => onUpdate({ formationType: type })}
          >
            {type}
          </FormationTypeButton>
        ))}
      </FormationTypeSelector>

      <FormationContainer>
        <UAVListSection>
          <UAVListTitle>Available UAVs</UAVListTitle>
          <UAVListGrid>
            {selectedUAVs.map(uav => (
              <UAVListItem
                key={uav.id}
                $placed={isUAVPlaced(uav.id)}
                draggable={!isUAVPlaced(uav.id)}
                onDragStart={() => handleDragStart(uav)}
              >
                {uav.imagePath && uav.imagePath !== '' && uav.imagePath !== '/' ? (
                  <UAVListImage src={uav.imagePath} alt={uav.name} />
                ) : (
                  <UAVListImagePlaceholder>
                    <Plane size={20} />
                  </UAVListImagePlaceholder>
                )}
                <UAVListContent>
                  <UAVListName>{uav.name}</UAVListName>
                  <UAVListType>{uav.type}</UAVListType>
                </UAVListContent>
              </UAVListItem>
            ))}
          </UAVListGrid>
        </UAVListSection>

        <FormationBuilderSection>
          <CoordinateSystemContainer>
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

            {/* Drop zone */}
            <CoordinateDropZone
              ref={dropZoneRef}
              onDragOver={handleDragOver}
              onDrop={data.formationType === 'Custom' ? handlePlacedUAVDrop : handleDrop}
            >
              {placedUAVs.map(placed => {
                const uav = getUAVById(placed.uavId);
                if (!uav) return null;
                
                return (
                  <PlacedUAV
                    key={placed.uavId}
                    $x={placed.x}
                    $y={placed.y}
                    draggable={data.formationType === 'Custom'}
                    onDragStart={() => handlePlacedUAVDragStart(placed.uavId)}
                  >
                    <PlacedUAVContent>
                      {uav.imagePath && uav.imagePath !== '' && uav.imagePath !== '/' ? (
                        <PlacedUAVImage src={uav.imagePath} alt={uav.name} />
                      ) : (
                        <PlacedUAVImagePlaceholder>
                          <Plane size={24} />
                        </PlacedUAVImagePlaceholder>
                      )}
                      <PlacedUAVLabel>{uav.name}</PlacedUAVLabel>
                    </PlacedUAVContent>
                    <RemoveButton onClick={() => handleRemoveUAV(placed.uavId)}>
                      <X size={12} />
                    </RemoveButton>
                  </PlacedUAV>
                );
              })}
            </CoordinateDropZone>

            <CoordinateInfo>
              Center: (0, 0) | Range: ±100 units
            </CoordinateInfo>
          </CoordinateSystemContainer>

          <AutoArrangeButton onClick={autoArrange}>
            Auto-Arrange {data.formationType} Formation
          </AutoArrangeButton>

          <InstructionText>
            {data.formationType === 'Custom' 
              ? 'Drag UAVs from the list to position them. Drag placed UAVs to reposition.'
              : `Drag UAVs to the grid or click "Auto-Arrange" to use ${data.formationType} formation.`
            }
          </InstructionText>
        </FormationBuilderSection>
      </FormationContainer>
    </div>
  );
};

export default FormationStep;
