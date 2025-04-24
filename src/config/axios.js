import axios from 'axios';

// Create axios instance with baseURL
const instance = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8081',
    headers: {
        'Content-Type': 'application/json'
    }
});

// Simple token handling - less complex but reliable
const getToken = () => {
    return localStorage.getItem('token');
};

// Request interceptor - add token to requests
instance.interceptors.request.use(
    config => {
        // Skip token for login/register routes
        if (config.url && (config.url.includes('/auth/login') || config.url.includes('/auth/register'))) {
            return config;
        }
        
        const token = getToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

// Response interceptor - handle auth errors WITHOUT automatic logout
instance.interceptors.response.use(
    // For successful responses
    response => {
        // If this is a login response with a token, save it
        if (response.data && response.data.token) {
            localStorage.setItem('token', response.data.token);
        }
        return response;
    },
    
    // For error responses
    async error => {
        // Log the error for debugging
        console.error('API error:', error.response?.status, error.response?.data);
        
        // IMPORTANT: Do not automatically redirect to login on auth errors
        // Instead, let the components handle auth errors appropriately
        return Promise.reject(error);
    }
);

export default instance;