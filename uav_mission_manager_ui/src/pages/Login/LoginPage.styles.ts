import styled from 'styled-components';

export const LoginContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  padding: 20px;
`;

export const LoginForm = styled.form`
  background: white;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export const Title = styled.h1`
  text-align: center;
  color: #333;
  font-size: 28px;
  font-weight: 600;
  margin: 0;
`;

export const DroneIcon = styled.div`
  text-align: center;
  font-size: 48px;
  margin-bottom: 10px;
  color: #667eea;
`;

export const ErrorMessage = styled.div`
  background: #fee;
  color: #c53030;
  padding: 12px;
  border-radius: 6px;
  font-size: 14px;
  border-left: 4px solid #c53030;
`;