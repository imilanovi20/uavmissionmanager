import { useState } from 'react';
import { UserService } from '../services/user.service';
import type { LoginCredentials } from '../types/user.types';
import { useAuthStore } from '../stores/authStore';

export const useLogin = () => {
  const { login } = useAuthStore();
  const userService = new UserService();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (credentials: LoginCredentials) => {
    if (!credentials.username.trim() || !credentials.password.trim()) {
      setError('Please enter your username and password.');
      return false;
    }

    setLoading(true);
    setError('');

    try {
      const response = await userService.login(credentials);
      if (response.success && response.token) {
        login(response.token);
        return true;
      } else {
        setError(response.message || 'Incorrect username or password.');
        return false;
      }
    } catch (err: any) {
      setError(err.message || 'Login error. Try again.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => setError('');

  return {
    handleLogin,
    loading,
    error,
    clearError
  };
};