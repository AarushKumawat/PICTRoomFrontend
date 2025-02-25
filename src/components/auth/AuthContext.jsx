// src/components/auth/AuthContext.jsx
import React, { createContext, useState } from 'react';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = async (credentials) => {
    try {
      // This is where you would normally make an API call
      // For now, we'll just simulate a successful login
      const mockUser = {
        id: '1',
        email: credentials.email,
        name: 'Test User'
      };
      setUser(mockUser);
      return mockUser;
    } catch (error) {
      throw new Error('Login failed');
    }
  };

  const logout = () => {
    setUser(null);
  };

  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};