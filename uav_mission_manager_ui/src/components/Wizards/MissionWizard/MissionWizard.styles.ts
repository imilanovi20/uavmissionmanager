import styled from 'styled-components';

// Full page container instead of overlay
export const WizardPageContainer = styled.div`
  min-height: 100vh;
  background: #f9fafb;
  padding: 2rem;
  display: flex;
  align-items: flex-start;
  justify-content: center;
`;

export const WizardContainer = styled.div`
  background: white;
  border-radius: 16px;
  width: 100%;
  max-width: 1400px;
  min-height: 600px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
`;

export const WizardHeader = styled.div`
  padding: 2rem;
  border-bottom: 1px solid #e5e7eb;
`;

export const WizardTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: #2e2e2e;
  margin: 0 0 1rem 0;
`;

export const QuitButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: white;
  color: #6b7280;
  border: 1px solid #e5e7eb;
  padding: 0.625rem 1rem;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #f9fafb;
    border-color: #d1d5db;
    color: #374151;
  }
`;

export const StepIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1rem;
`;

export const Step = styled.div<{ active: boolean; completed: boolean }>`
  flex: 1;
  height: 4px;
  background: ${({ active, completed }) =>
    completed ? '#2c2c2c' : active ? '#6b7280' : '#e5e7eb'};
  border-radius: 2px;
  transition: background 0.3s ease;
`;

export const StepLabel = styled.p`
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0.5rem 0 0 0;
`;

export const WizardBody = styled.div`
  padding: 2rem;
  flex: 1;
  overflow-y: auto;
`;

export const WizardFooter = styled.div`
  padding: 1.5rem 2rem;
  border-top: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
`;

export const SecondaryButton = styled.button`
  background: white;
  color: #2c2c2c;
  border: 1px solid #e5e7eb;
  padding: 12px 24px;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #f9fafb;
    border-color: #d1d5db;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const PrimaryButton = styled.button`
  background: #2c2c2c;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #404040;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(44, 44, 44, 0.3);
  }

  &:disabled {
    background: #666;
    cursor: not-allowed;
    transform: none;
    opacity: 0.6;
  }
`;

export const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

export const Label = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.5rem;
  margin: 0 auto 0.5rem auto;  
  max-width: 900px;     
  margin-left: auto;   
  margin-right: auto; 
  
`;

export const Input = styled.input`
  width: 100%;
  max-width: 900px;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 1rem;
  transition: all 0.2s ease;
  margin: 0 auto;  
  display: block; 

  &:focus {
    outline: none;
    border-color: #2c2c2c;
    box-shadow: 0 0 0 3px rgba(44, 44, 44, 0.1);
  }
`;

export const TextArea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  max-width: 900px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 1rem;
  min-height: 100px;
  resize: vertical;
  font-family: inherit;
  transition: all 0.2s ease;
  margin: 0 auto;  
  display: block; 

  &:focus {
    outline: none;
    border-color: #2c2c2c;
    box-shadow: 0 0 0 3px rgba(44, 44, 44, 0.1);
  }
`;

export const SelectableCard = styled.div<{ selected: boolean }>`
  padding: 1rem;
  border: 2px solid ${({ selected }) => (selected ? '#2c2c2c' : '#e5e7eb')};
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  background: ${({ selected }) => (selected ? '#f9fafb' : 'white')};

  &:hover {
    border-color: #2c2c2c;
    background: #f9fafb;
  }
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
`;

export const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  padding: 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  transition: all 0.2s ease;

  &:hover {
    background: #f9fafb;
    border-color: #d1d5db;
  }

  input[type='checkbox'] {
    width: 18px;
    height: 18px;
    cursor: pointer;
  }
`;
