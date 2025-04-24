import React, { useEffect } from 'react';
import axios from '../config/axios';

const TokenGuard = () => {
  useEffect(() => {
    // Function to retrieve token from all possible sources and synchronize
    const retrieveAndSyncToken = () => {
      try {
        // Get token from all possible sources
        const localToken = localStorage.getItem('token');
        const sessionToken = sessionStorage.getItem('token');
        const globalToken = window.__authToken;
        const input = document.getElementById('__token_backup');
        const inputToken = input ? input.value : null;
        
        // Try to get token from history state
        let historyToken = null;
        try {
          historyToken = window.history.state?.__token;
        } catch (e) {
          console.error('TokenGuard: Unable to access history state', e);
        }
        
        // Use first available token
        const token = localToken || sessionToken || globalToken || inputToken || historyToken;
        
        // If token exists, ensure it's stored everywhere
        if (token) {
          console.log('TokenGuard: Synchronizing token across all storage mechanisms');
          
          // Update all storage mechanisms
          localStorage.setItem('token', token);
          sessionStorage.setItem('token', token);
          window.__authToken = token;
          
          // Set in axios headers directly
          if (axios.defaults) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          }
          
          // Update or create backup input element
          if (!input) {
            const newInput = document.createElement('input');
            newInput.type = 'hidden';
            newInput.id = '__token_backup';
            newInput.value = token;
            document.body.appendChild(newInput);
          } else {
            input.value = token;
          }
          
          // Store in history state
          try {
            const currentState = window.history.state || {};
            currentState.__token = token;
            window.history.replaceState(currentState, document.title);
          } catch (e) {
            console.error('TokenGuard: Unable to store token in history state', e);
          }
          
          // Create a persistent cookie as another backup (expires in 1 day)
          document.cookie = `__token_backup=${token}; path=/; max-age=86400; SameSite=Strict`;
          
          return token;
        }
        
        return null;
      } catch (error) {
        console.error('TokenGuard: Error in token synchronization', error);
        return null;
      }
    };
    
    // Function to handle page reload or visibility changes
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        console.log('TokenGuard: Page visible again, checking token');
        retrieveAndSyncToken();
      }
    };
    
    // Function to handle before unload 
    const handleBeforeUnload = () => {
      console.log('TokenGuard: Page about to unload, saving token state');
      const token = retrieveAndSyncToken();
      
      // Extra safety measure - update localStorage with a timestamp
      if (token) {
        try {
          localStorage.setItem('token_last_saved', Date.now().toString());
        } catch (e) {
          console.error('TokenGuard: Error setting token timestamp', e);
        }
      }
    };
    
    // Function to retrieve token from cookies (as additional backup)
    const getTokenFromCookie = () => {
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.startsWith('__token_backup=')) {
          return cookie.substring('__token_backup='.length);
        }
      }
      return null;
    };
    
    // Run the token sync immediately
    retrieveAndSyncToken();
    
    // Set up event listeners
    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('storage', event => {
      if (event.key === 'token') {
        retrieveAndSyncToken();
      }
    });
    
    // Set up a recurring check for token
    const intervalId = setInterval(() => {
      retrieveAndSyncToken();
    }, 2000); // Check every 2 seconds
    
    // Clean up on unmount
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      clearInterval(intervalId);
    };
  }, []);
  
  return null; // Render nothing
};

export default TokenGuard;