import { useEffect, useContext } from 'react';
import { AuthContext } from '../components/auth/AuthContext';

// This component ensures token is persisted properly across page reloads
const TokenPersistenceLayer = ({ children }) => {
  // Get auth context - always call the hook unconditionally
  const authContext = useContext(AuthContext);

  useEffect(() => {
    // On initial page load, check and restore token
    const restoreToken = () => {
      try {
        console.log('Token persistence check initializing...');
        
        // Check localStorage
        const localToken = localStorage.getItem('token');
        
        // Check sessionStorage
        const sessionToken = sessionStorage.getItem('token');
        
        console.log('Found tokens - Local:', !!localToken, 'Session:', !!sessionToken);
        
        // Synchronize across storage mechanisms
        if (localToken && !sessionToken) {
          sessionStorage.setItem('token', localToken);
          console.log('Restored token to sessionStorage');
        } else if (!localToken && sessionToken) {
          localStorage.setItem('token', sessionToken);
          console.log('Restored token to localStorage');
        }
        
        // Set token to a global variable as another backup
        if (localToken || sessionToken) {
          window.__authToken = localToken || sessionToken; 
        }
      } catch (error) {
        console.error('Error in token persistence layer:', error);
      }
    };
    
    // Execute immediately
    restoreToken();
    
    // Create a hidden input to store token as another backup
    if (!document.getElementById('__token_backup')) {
      const tokenBackupInput = document.createElement('input');
      tokenBackupInput.type = 'hidden';
      tokenBackupInput.id = '__token_backup';
      tokenBackupInput.value = localStorage.getItem('token') || '';
      document.body.appendChild(tokenBackupInput);
    } else {
      const tokenBackupInput = document.getElementById('__token_backup');
      tokenBackupInput.value = localStorage.getItem('token') || '';
    }
    
    // Set up event listener for before unload to ensure token is saved
    const handleBeforeUnload = () => {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      if (token) {
        try {
          localStorage.setItem('token', token);
          sessionStorage.setItem('token', token);
          const tokenBackupInput = document.getElementById('__token_backup');
          if (tokenBackupInput) tokenBackupInput.value = token;
          window.__authToken = token;
        } catch (e) {
          console.error('Error saving token before unload:', e);
        }
      }
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    // Set up periodic token check (every 5 seconds)
    const tokenCheckInterval = setInterval(() => {
      const localToken = localStorage.getItem('token');
      const sessionToken = sessionStorage.getItem('token');
      const backupInput = document.getElementById('__token_backup');
      const backupToken = backupInput ? backupInput.value : null;
      const globalToken = window.__authToken;
      
      // If token exists in any storage but not in localStorage, restore it
      if (!localToken && (sessionToken || backupToken || globalToken)) {
        const token = sessionToken || backupToken || globalToken;
        localStorage.setItem('token', token);
        console.log('Restored missing localStorage token');
        
        // Also update in Auth context if available
        if (authContext && authContext.storeToken) {
          authContext.storeToken(token);
        }
      }
    }, 5000);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      clearInterval(tokenCheckInterval);
      const tokenBackupInput = document.getElementById('__token_backup');
      if (tokenBackupInput && tokenBackupInput.parentNode) {
        tokenBackupInput.parentNode.removeChild(tokenBackupInput);
      }
    };
  }, [authContext]);
  
  return children;
};

export default TokenPersistenceLayer;