import React, { useState } from 'react';

// Define constants at the top of the file
const VENUE_TYPES = {
  CONFERENCE: 'conference',
  MEETING: 'meeting',
  WORKSHOP: 'workshop'
};

const ROLES = {
  ADMIN: 'admin',
  USER: 'user'
};

const BookingForm = () => {
  const [bookingData, setBookingData] = useState({
    venueType: VENUE_TYPES.CONFERENCE,
    date: '',
    time: '',
    duration: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Your booking submission logic here
      console.log('Booking submitted:', bookingData);
    } catch (error) {
      console.error('Booking failed:', error);
    }
  };

  const handleChange = (e) => {
    setBookingData({
      ...bookingData,
      [e.target.name]: e.target.value
    });
  };

  const isValidVenueType = (type) => {
    return Object.values(VENUE_TYPES).includes(type);
  };

  const canBookVenue = (userRole, venueType) => {
    return userRole === ROLES.ADMIN || 
           (userRole === ROLES.USER && venueType === VENUE_TYPES.MEETING);
  };

  return (
    <form onSubmit={handleSubmit}>
      <select
        name="venueType"
        value={bookingData.venueType}
        onChange={handleChange}
      >
        {Object.values(VENUE_TYPES).map(type => (
          <option key={type} value={type}>
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </option>
        ))}
      </select>

      <input
        type="date"
        name="date"
        value={bookingData.date}
        onChange={handleChange}
      />

      <input
        type="time"
        name="time"
        value={bookingData.time}
        onChange={handleChange}
      />

      <input
        type="number"
        name="duration"
        value={bookingData.duration}
        onChange={handleChange}
        placeholder="Duration in hours"
      />

      <button type="submit">Book Venue</button>
    </form>
  );
};

export default BookingForm;