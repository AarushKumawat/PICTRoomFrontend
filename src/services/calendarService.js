import axios from '../config/axios';

export const calendarService = {
    getAvailableSlots: async (roomId, date) => {
        const token = localStorage.getItem('token');
        const response = await axios.get('/calendar/availability', {
            params: { roomId, date },
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    },

    getRooms: async () => {
        const token = localStorage.getItem('token');
        const response = await axios.get('/rooms', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    },


    
    getEvents: async () => {
        try {
            const token = localStorage.getItem('token');
            console.log(token);
            // if (!token) {
            //     throw new Error('No authentication token found');
            // }


            const response = await axios.get('/api/bookings', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching events:', error);
            throw error;
        }
    },

    checkRoomAvailability: async (date, startTime, endTime) => {
        try {
          const response = await axios.get('/rooms/available', {
            params: { date, startTime, endTime }
          });
          return response.data;
        } catch (error) {
          console.error('Error checking room availability:', error);
          throw error;
        }
      }

    
};
