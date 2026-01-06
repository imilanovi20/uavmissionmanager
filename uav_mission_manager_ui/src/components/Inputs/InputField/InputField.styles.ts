import styled from 'styled-components';

export const StyledInputContainer = styled.div`
  position: relative;
  width: 100%;
`;

export const StyledInput = styled.input`
  width: 100%;
  padding: 20px 16px 8px 16px;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 16px;
  transition: all 0.3s ease;
  background: #f8f9fa;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #667eea;
    background: white;
  }

  &:focus + label,
  &:not(:placeholder-shown) + label {
    top: 8px;
    font-size: 12px;
    color: #667eea;
  }

  &:disabled {
    background: #e9ecef;
    cursor: not-allowed;
  }
`;

export const StyledLabel = styled.label`
  position: absolute;
  top: 16px;
  left: 16px;
  font-size: 16px;
  color: #adb5bd;
  transition: all 0.3s ease;
  pointer-events: none;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: transparent;
`;