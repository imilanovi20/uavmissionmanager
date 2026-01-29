import { useState } from 'react';
import { Plus, User } from 'lucide-react';
import type { StepProps, ResponsiblePersonsData } from '../../MissionWizard.types';
import type { User as UserType } from '../../../../../types/user.types';
import styled from 'styled-components';
import SelectionModal from '../../../../Selection/SelectionModal/SelectionModal';

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
  border-radius: 50%; /* Circular for user photos */
  background: #f3f4f6;
  flex-shrink: 0;
`;

const PreviewImagePlaceholder = styled.div`
  width: 60px;
  height: 60px;
  background: #f3f4f6;
  border-radius: 50%; /* Circular for user avatars */
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

interface UserWithUsernameId extends UserType {
  id: string; 
}

const ResponsiblePersonsStep = ({ data, onUpdate }: StepProps<ResponsiblePersonsData>) => {
  const [showModal, setShowModal] = useState(false);

  const handleConfirmSelection = (selectedIds: (number | string)[]) => {
    const selectedUsernames = selectedIds as string[];
    onUpdate({ selectedUsernames });
  };

  const selectedUsers = data.availableUsers.filter(user =>
    data.selectedUsernames.includes(user.username)
  );

  const renderUserCard = (user: UserWithUsernameId, isSelected: boolean) => (
    <>
      <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 600, color: '#2e2e2e' }}>
        {user.username}
      </h4>
      <p style={{ margin: 0, color: '#6b7280', fontSize: '0.875rem' }}>
        {user.email}
      </p>
      {user.role && (
        <p style={{ margin: 0, fontSize: '0.875rem', color: '#374151' }}>
          Role: {user.role}
        </p>
      )}
    </>
  );

  const renderPlaceholder = () => <User size={32} />;

  const usersWithUsernameId: UserWithUsernameId[] = data.availableUsers.map(user => ({
    ...user,
    id: user.username 
  }));

  return (
    <div>
      <h3 style={{ marginTop: 0, marginBottom: '1rem', fontSize: '1.125rem' }}>
        Select Responsible Persons
      </h3>

      {selectedUsers.length > 0 && (
        <>
          <h4 style={{ fontSize: '0.95rem', color: '#6b7280', marginBottom: '0.75rem' }}>
            Selected Persons ({selectedUsers.length})
          </h4>
          <SelectedItemsGrid>
            {selectedUsers.map((user) => (
              <SelectedItemCard key={user.username}>
                {user.imagePath && user.imagePath !== '' && user.imagePath !== '/' ? (
                  <PreviewImage src={user.imagePath} alt={user.username} />
                ) : (
                  <PreviewImagePlaceholder>
                    <User size={24} />
                  </PreviewImagePlaceholder>
                )}

                <PreviewContent>
                  <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 600 }}>
                    {user.username}
                  </h4>
                  <p style={{ margin: 0, color: '#6b7280', fontSize: '0.8rem', 
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {user.email}
                  </p>
                </PreviewContent>
              </SelectedItemCard>
            ))}
          </SelectedItemsGrid>
        </>
      )}

      <AddButton onClick={() => setShowModal(true)}>
        <Plus size={24} />
        {selectedUsers.length > 0 ? 'Change Person Selection' : 'Add Responsible Persons'}
      </AddButton>

      <p style={{ marginTop: '1rem', color: '#6b7280', fontSize: '0.875rem', textAlign: 'center' }}>
        {selectedUsers.length === 0
          ? 'Click the button above to select responsible persons'
          : `${selectedUsers.length} person(s) selected`}
      </p>

      {showModal && (
        <SelectionModal<UserWithUsernameId>
          title="Select Responsible Persons"
          items={usersWithUsernameId}
          selectedIds={data.selectedUsernames} // Direktno usernames
          onConfirm={handleConfirmSelection}
          onClose={() => setShowModal(false)}
          renderCard={renderUserCard}
          renderPlaceholder={renderPlaceholder}
          itemsPerPage={6}
          itemLabel="person"
        />
      )}
    </div>
  );
};

export default ResponsiblePersonsStep;
