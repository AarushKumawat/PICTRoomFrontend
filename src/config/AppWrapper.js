import React, { useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';
import { AuthProvider } from './components/auth/AuthContext';
import axios from './config/axios';

// This component ensures token is properly set up before the app loads
const AppWrapper = () => {
  // Initialize the token from localStorage when the app first loads
  useEffect(() => {
    const initializeToken = () => {
      const token = localStorage.getItem('token');
      if (token) {
        // Set the token in axios headers
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      }
    };

    initializeToken();
    
    // Handle page visibility changes (when user tabs back to the app)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        initializeToken();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return (
    <Router>
      <AuthProvider>
        <App />
      </AuthProvider>
    </Router>
  );
};

export default AppWrapper;