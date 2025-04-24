// import React from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import { AuthProvider } from './components/auth/AuthContext';
// import LoginPage from './components/auth/LoginPage';
// import BookingForm from './components/booking/BookingForm';
// import Navbar from './components/navigation/Navbar';
// import MyCalendar from './MyCalendar';
// import TokenPersistenceLayer from './config/TokenPersistenceLayer';

// import './App.css';

// function App() {
//   return (
//     <Router>
//       <AuthProvider>
//         <TokenPersistenceLayer>
//           <div className="App">
//             <Navbar />
//             <Routes>
//               <Route path="/login" element={<LoginPage />} />
//               <Route path="/booking" element={<BookingForm />} />
//               <Route path="/calendar" element={<MyCalendar />} />
//               {/* Add more routes as needed */}
//             </Routes>
//           </div>
//         </TokenPersistenceLayer>
//       </AuthProvider>
//     </Router>
//   );
// }

// export default App;

import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './components/auth/AuthContext';
import LoginPage from './components/auth/LoginPage';
import BookingForm from './components/booking/BookingForm';
import Navbar from './components/navigation/Navbar';
import MyCalendar from './MyCalendar';
import './App.css';
import TokenGuard from './config/TokenGuard';
import axios from './config/axios';

function App() {
  // One-time setup on app load
  useEffect(() => {
    // Initialize token immediately
    const initToken = () => {
      // Try to get token from all possible sources
      const localToken = localStorage.getItem('token');
      const sessionToken = sessionStorage.getItem('token');
      const globalToken = window.__authToken;
      const backupInput = document.getElementById('__token_backup');
      const backupToken = backupInput ? backupInput.value : null;
      
      // Try to get from cookie
      let cookieToken = null;
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.startsWith('__token_backup=')) {
          cookieToken = cookie.substring('__token_backup='.length);
          break;
        }
      }
      
      // Use first available token
      const token = localToken || sessionToken || globalToken || backupToken || cookieToken;
      
      // If we have a token, ensure it's stored in all locations
      if (token) {
        console.log('App: Initializing with existing token');
        localStorage.setItem('token', token);
        sessionStorage.setItem('token', token);
        window.__authToken = token;
        
        // Set in axios headers
        if (axios.defaults) {
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }

        // Add a hidden input backup
        if (!backupInput) {
          const input = document.createElement('input');
          input.type = 'hidden';
          input.id = '__token_backup';
          input.value = token;
          document.body.appendChild(input);
        } else if (backupInput.value !== token) {
          backupInput.value = token;
        }
        
        // Set cookie
        document.cookie = `__token_backup=${token}; path=/; max-age=86400; SameSite=Strict`;
      }
    };
    
    // Run immediately
    initToken();
    
    // Handle beforeunload
    const handleBeforeUnload = () => {
      const token = localStorage.getItem('token') || 
                   sessionStorage.getItem('token') || 
                   window.__authToken;
      
      if (token) {
        localStorage.setItem('token', token);
        sessionStorage.setItem('token', token);
        window.__authToken = token;
        document.cookie = `__token_backup=${token}; path=/; max-age=86400; SameSite=Strict`;
      }
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  return (
    <Router>
      <TokenGuard />
      <AuthProvider>
        <div className="App">
          <Navbar />
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/booking" element={<BookingForm />} />
            <Route path="/calendar" element={<MyCalendar />} />
            {/* Add more routes as needed */}
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;