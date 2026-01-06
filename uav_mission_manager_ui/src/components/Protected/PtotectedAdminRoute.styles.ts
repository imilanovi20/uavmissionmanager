import styled from "styled-components";

export const AccessDeniedContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f8f9fa;
`;

export const AccessDeniedMessage = styled.div`
  background: #f8d7da;
  border: 1px solid #f5c6cb;
  color: #721c24;
  padding: 2rem;
  border-radius: 8px;
  text-align: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  width: 90%;
`;

export const ErrorTitle = styled.h2`
  color: #dc3545;
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0 0 1rem 0;
`;

export const ErrorText = styled.p`
  color: #721c24;
  margin: 0;
  font-size: 1rem;
`;