import { useState } from 'react';
import { Plus, Plane } from 'lucide-react';
import type { StepProps, UAVSelectionData } from '../../MissionWizard.types';
import SelectionModal from '../../../../Selection/SelectionModal/SelectionModal';
import type { UAV } from '../../../../../types/uav.types';
import styled from 'styled-components';

const AddButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  padding: 3rem 1rem;
  border: 2px dashed #d1d5db;
  border-radius: 8px;
  background: white;
  color: #6b7280;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: #2c2c2c;
    background: #f9fafb;
    color: #2c2c2c;
  }
`;

const SelectedItemsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1rem;
`;

const SelectedItemCard = styled.div`
  padding: 1rem;
  border: 2px solid #2c2c2c;
  border-radius: 8px;
  background: #f9fafb;
  display: flex;
  gap: 0.75rem;
  align-items: center;
`;

const PreviewImage = styled.img`
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 6px;
  background: #f3f4f6;
  flex-shrink: 0;
`;

const PreviewImagePlaceholder = styled.div`
  width: 60px;
  height: 60px;
  background: #f3f4f6;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #9ca3af;
  flex-shrink: 0;
`;

const PreviewContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  flex: 1;
  min-width: 0;
`;

const UAVSelectionStep = ({ data, onUpdate }: StepProps<UAVSelectionData>) => {
  const [showModal, setShowModal] = useState(false);

  const handleConfirmSelection = (selectedIds: (number | string)[]) => {
    onUpdate({ selectedUAVIds: selectedIds as number[] });
  };

  const selectedUAVs = data.availableUAVs.filter(uav =>
    data.selectedUAVIds.includes(uav.id)
  );

  // Render function za UAV karticu u modalu
  const renderUAVCard = (uav: UAV, isSelected: boolean) => (
    <>
      <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 600, color: '#2e2e2e' }}>
        {uav.name}
      </h4>
      <p style={{ margin: 0, color: '#6b7280', fontSize: '0.875rem' }}>
        {uav.type}
      </p>
      <p style={{ margin: 0, fontSize: '0.875rem', color: '#374151' }}>
        Max Speed: {uav.maxSpeed} km/h
      </p>
    </>
  );

  // Placeholder ikona za UAV-ove bez slike
  const renderPlaceholder = () => <Plane size={32} />;

  return (
    <div>
      <h3 style={{ marginTop: 0, marginBottom: '1rem', fontSize: '1.125rem' }}>
        Select UAVs for this mission
      </h3>

      {selectedUAVs.length > 0 && (
        <>
          <h4 style={{ fontSize: '0.95rem', color: '#6b7280', marginBottom: '0.75rem' }}>
            Selected UAVs ({selectedUAVs.length})
          </h4>
          <SelectedItemsGrid>
            {selectedUAVs.map((uav) => (
              <SelectedItemCard key={uav.id}>
                {/* Image ili placeholder */}
                {uav.imagePath && uav.imagePath !== '' && uav.imagePath !== '/' ? (
                  <PreviewImage src={uav.imagePath} alt={uav.name} />
                ) : (
                  <PreviewImagePlaceholder>
                    <Plane size={24} />
                  </PreviewImagePlaceholder>
                )}

                {/* Content */}
                <PreviewContent>
                  <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 600 }}>
                    {uav.name}
                  </h4>
                  <p style={{ margin: 0, color: '#6b7280', fontSize: '0.8rem' }}>
                    {uav.type}
                  </p>
                  <p style={{ margin: 0, fontSize: '0.8rem' }}>
                    {uav.maxSpeed} km/h
                  </p>
                </PreviewContent>
              </SelectedItemCard>
            ))}
          </SelectedItemsGrid>
        </>
      )}

      <AddButton onClick={() => setShowModal(true)}>
        <Plus size={24} />
        {selectedUAVs.length > 0 ? 'Change UAV Selection' : 'Add UAVs'}
      </AddButton>

      <p style={{ marginTop: '1rem', color: '#6b7280', fontSize: '0.875rem', textAlign: 'center' }}>
        {selectedUAVs.length === 0
          ? 'Click the button above to select UAVs'
          : `${selectedUAVs.length} UAV(s) selected`}
      </p>

      {showModal && (
        <SelectionModal<UAV>
          title="Select UAVs"
          items={data.availableUAVs}
          selectedIds={data.selectedUAVIds}
          onConfirm={handleConfirmSelection}
          onClose={() => setShowModal(false)}
          renderCard={renderUAVCard}
          renderPlaceholder={renderPlaceholder}
          itemsPerPage={6}
          itemLabel="UAV"
        />
      )}
    </div>
  );
};

export default UAVSelectionStep;
