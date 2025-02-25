import { useState, useEffect } from 'react';
import { AuthStorage } from './auth-storage';

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    setIsLoading(true);
    const authenticated = await AuthStorage.isAuthenticated();
    setIsAuthenticated(authenticated);
    setIsLoading(false);
  };

  const login = async (token: string, phone: string) => {
    const success = await AuthStorage.storeAuthData(token, phone);
    if (success) {
      setIsAuthenticated(true);
    }
    return success;
  };

  const logout = async () => {
    const success = await AuthStorage.clearAuthData();
    if (success) {
      setIsAuthenticated(false);
    }
    return success;
  };

  return {
    isLoading,
    isAuthenticated,
    login,
    logout,
    checkAuthStatus,
  };
};