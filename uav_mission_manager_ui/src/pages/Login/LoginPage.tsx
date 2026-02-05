import React, { useState } from 'react';
import { LoginContainer, LoginForm, Title, ErrorMessage } from './LoginPage.styles';

import type { LoginPageProps } from './LoginPage.types';
import InputField from '../../components/Inputs/InputField/InputField';
import BlackButton from '../../components/Buttons/BlackButton/BlackButton';
import { useLogin } from '../../hooks/useLogin';
import type { LoginCredentials } from '../../types/user.types';
import { useNavigate } from 'react-router-dom';

const LoginPage = (props: LoginPageProps) => {
  const navigate = useNavigate();
  const { handleLogin, loading, error, clearError } = useLogin();
  
  const [formData, setFormData] = useState<LoginCredentials>({
    username: '',
    password: ''
  });

  const handleInputChange = (field: keyof LoginCredentials) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
    if (error) clearError();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await handleLogin(formData);
    
    if (success) {
        if (props.onLogin) {
        props.onLogin(formData);
        }
    navigate('/missions');
  }
  };

  const handleLoginClick = () => {
    const form = document.querySelector('form');
    if (form) {
      form.requestSubmit();
    }
  };

  return (
    <LoginContainer>
      <LoginForm onSubmit={handleSubmit}>
        <Title>UAV Mission Manager</Title>
        {error && <ErrorMessage role="alert">{error}</ErrorMessage>}
        <InputField
          label="Username"
          type="text"
          value={formData.username}
          onChange={handleInputChange('username')}
          disabled={loading}
        />
        <InputField
          label="Password"
          type="password"
          value={formData.password}
          onChange={handleInputChange('password')}
          disabled={loading}


        />
        <BlackButton
          title={loading ? 'Login.' : 'Login'}
          onClick={handleLoginClick}
          disabled={loading}
        />
      </LoginForm>
    </LoginContainer>
  );
};

export default LoginPage;