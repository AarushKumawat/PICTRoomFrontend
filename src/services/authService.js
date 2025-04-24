import axios from '../config/axios';

export const authService = {
    login: async (credentials) => {
        const response = await axios.post('/auth/login', credentials);
        return response.data;
    },

    logout: () => {
        localStorage.removeItem('token');
    },

    getCurrentUser: async () => {
        const response = await axios.get('/auth/user');
        return response.data;
    }
};