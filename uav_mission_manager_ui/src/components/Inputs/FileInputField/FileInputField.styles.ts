import styled from 'styled-components';

export const StyledFileInputContainer = styled.div`
  position: relative;
  width: 100%;
`;

export const StyledFileInput = styled.input`
  position: absolute;
  opacity: 0;
  width: 100%;
  height: 100%;
  cursor: pointer;
  
  &:disabled {
    cursor: not-allowed;
  }
`;

export const StyledDropZone = styled.div<{ isDragOver: boolean; hasFile: boolean; disabled?: boolean }>`
  border: 2px dashed ${({ isDragOver, hasFile }) => 
    isDragOver ? '#667eea' : hasFile ? '#28a745' : '#e1e5e9'};
  border-radius: 8px;
  padding: 24px;
  text-align: center;
  transition: all 0.3s ease;
  background: ${({ isDragOver, disabled }) => 
    disabled ? '#e9ecef' : isDragOver ? '#f8f9ff' : '#f8f9fa'};
  cursor: ${({ disabled }) => disabled ? 'not-allowed' : 'pointer'};
  position: relative;

  &:hover {
    border-color: ${({ disabled }) => disabled ? '#e1e5e9' : '#667eea'};
    background: ${({ disabled }) => disabled ? '#e9ecef' : '#f8f9ff'};
  }

  ${({ disabled }) => disabled && `
    opacity: 0.6;
  `}
`;

export const StyledIcon = styled.div<{ hasFile: boolean }>`
  font-size: 32px;
  margin-bottom: 12px;
  color: ${({ hasFile }) => hasFile ? '#28a745' : '#6c757d'};
`;

export const StyledMainText = styled.div`
  font-size: 16px;
  font-weight: 500;
  color: #495057;
  margin-bottom: 4px;
`;

export const StyledSubText = styled.div`
  font-size: 14px;
  color: #6c757d;
`;

export const StyledFileName = styled.div`
  font-size: 14px;
  color: #28a745;
  font-weight: 500;
  margin-top: 8px;
  word-break: break-word;
`;

export const StyledLabel = styled.label`
  position: absolute;
  top: -8px;
  left: 12px;
  background: white;
  padding: 0 8px;
  font-size: 12px;
  color: #667eea;
  font-weight: 500;
`;