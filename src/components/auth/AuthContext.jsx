import React, { createContext, useState, useEffect, useCallback } from 'react';
import axios from '../../config/axios';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [tokenChecked, setTokenChecked] = useState(false);

    // Enhanced token retrieval function - checks multiple storage locations
    const getStoredToken = useCallback(() => {
        try {
            // Try localStorage first (primary storage)
            const token = localStorage.getItem('token');
            
            if (token) {
                // Ensure token is in axios headers
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                return token;
            }
            
            return null;
        } catch (error) {
            console.error('Error accessing token storage:', error);
            return null;
        }
    }, []);

    // Initialize auth state when component mounts
    useEffect(() => {
        const initAuth = async () => {
            console.log('Auth initialization started');
            setLoading(true);
            
            try {
                const token = getStoredToken();
                
                if (!token) {
                    console.log('No token found - skipping auth check');
                    setLoading(false);
                    setTokenChecked(true);
                    return;
                }
                
                // Set the token in axios headers
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                
                console.log('Fetching user data to validate token');
                const userData = await axios.get('/auth/user');
                console.log('User data retrieved successfully');
                setUser(userData.data);
                
                // Keep token in localStorage
                localStorage.setItem('token', token);
            } catch (error) {
                console.error('Failed to get user data:', error.response?.status || error.message);
                
                // Only clear token if it's an auth error (401 or 403)
                if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                    console.log('Auth error on init - clearing token');
                    localStorage.removeItem('token');
                    delete axios.defaults.headers.common['Authorization'];
                }
            } finally {
                setLoading(false);
                setTokenChecked(true);
            }
        };
        
        initAuth();
    }, [getStoredToken]);

    const login = async (credentials) => {
        try {
            console.log('Login attempt for:', credentials.username);
            
            // Clear any existing auth header before login
            delete axios.defaults.headers.common['Authorization'];
            
            const response = await axios.post('/auth/login', {
                username: credentials.username,
                password: credentials.password,
                role: credentials.role
            });

            if (!response.data || !response.data.token) {
                throw new Error('Token not found in response');
            }

            // Store token and set up axios defaults
            const token = response.data.token;
            console.log('Login successful, storing token');
            
            // Save token to localStorage
            localStorage.setItem('token', token);
            
            // Set the authorization header
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

            // Set user data
            setUser(response.data.user);
            return response.data.user;
        } catch (error) {
            console.error('Login Error:', error);
            throw error;
        }
    };

    const logout = () => {
        console.log('Logout called - clearing token');
        // Remove token from localStorage
        localStorage.removeItem('token');
        
        // Clear the Authorization header
        delete axios.defaults.headers.common['Authorization'];
        
        // Reset user state
        setUser(null);
        
        // Redirect to login page
        window.location.href = '/login';
    };

    return (
        <AuthContext.Provider value={{
            user,
            login,
            logout,
            isAuthenticated: !!user,
            loading,
            tokenChecked
        }}>
            {children}
        </AuthContext.Provider>
    );
};