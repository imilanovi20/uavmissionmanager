import { useState, useEffect } from 'react';
import { UserService } from '../services/user.service';
import type { User } from '../types/user.types';

interface UseCurrentUserReturn {
  user: User | null;
  loading: boolean;
  error: string | null;
  isAdmin: boolean;
  isAuthenticated: boolean;
  refetch: () => Promise<void>;
}

export const useCurrentUser = (): UseCurrentUserReturn => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const userService = new UserService();

  const fetchCurrentUser = async () => {
    try {
      setLoading(true);
      setError(null);

      if (userService.isAuthenticated()) {
        const userData = await userService.getCurrentUser();
        setUser(userData);
      } else {
        setUser(null);
      }
    } catch (err: any) {
      setError('Failed to load user data. Please try again.');
      console.error('Error fetching current user:', err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const isAdmin = user?.role === 'Admin';
  const isAuthenticated = userService.isAuthenticated();

  return {
    user,
    loading,
    error,
    isAdmin,
    isAuthenticated,
    refetch: fetchCurrentUser
  };
};