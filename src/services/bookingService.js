import axios from '../config/axios';

export const bookingService = {
    createBooking: async (bookingData) => {
        try {
            const token = localStorage.getItem('token');
            
        
            
            // Make sure we have a properly formatted request that matches the backend DTO
            const formattedData = {
                // These fields must match what the backend BookingRequestDto expects
                date: bookingData.date,
                startTime: bookingData.startTime,
                endTime: bookingData.endTime,
                reason: bookingData.reason,
                audience: bookingData.audience,
                // If your backend also needs these fields:
                roomId: bookingData.roomName,
                title: bookingData.title,
                // Set requires approval flag if applicable
                requiresApproval: true
            };
            console.log(formattedData)
            const response = await axios.post('/api/bookings/request', formattedData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error creating booking:', error);
            
            // Enhanced error logging
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.error('Response data:', error.response.data);
                console.error('Response status:', error.response.status);
                console.error('Response headers:', error.response.headers);
            } else if (error.request) {
                // The request was made but no response was received
                console.error('No response received:', error.request);
            } else {
                // Something happened in setting up the request that triggered an Error
                console.error('Error message:', error.message);
            }
            
            throw error;
        }
    },
    
    // Rest of your service methods remain the same
    getBookings: async () => {
        const response = await axios.get('/calendar/requests');
        return response.data;
    },

    getBookings: async () => {
        const response = await axios.get('/calendar/requests');
        return response.data;
    },

    getAdminBookings: async () => {
        const response = await axios.get('/calendar/admin/requests');
        return response.data;
    },

    approveBooking: async (bookingId) => {
        const response = await axios.post(`/approvals/approve/${bookingId}`, null);
        return response.data;
    },

    rejectBooking: async (bookingId) => {
        const response = await axios.post(`/approvals/reject/${bookingId}`, null);
        return response.data;
    },

    getPendingRequests: async () => {
        try {
            console.log('Making request to /calendar/admin/requests/pending');
            const response = await axios.get('/api/bookings/calendar/admin/requests/pending');
            console.log('Pending requests response:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error fetching pending requests:', error);
            throw error;
        }
    },

    getApprovedRequests: async () => {
        const response = await axios.get('/api/bookings/calendar/admin/requests/approved');
        return response.data;
    },

    // In bookingService.js, update the getUserRequests method
    getUserRequests: async () => {
        const response = await axios.get('/api/bookings/calendar/requests'); // Updated path
        return response.data;
    }
};