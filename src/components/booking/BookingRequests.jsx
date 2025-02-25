// src/components/booking/BookingRequests.jsx
import React, { useState, useEffect } from 'react';
import { Table, Button, Badge } from 'react-bootstrap';
import { useAuth } from '../auth/AuthContext';

const BookingRequests = () => {
  const { currentUser } = useAuth();
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    // Here you would fetch booking requests based on user role
    // For HOD: Fetch requests for their department
    // For Principal: Fetch main auditorium requests
    // This is a mock implementation
    const mockRequests = [
      {
        id: 1,
        venueType: 'department_room',
        department: 'Computer Science',
        requestedBy: 'user123',
        requestedByRole: 'clubs',
        date: '2024-02-15',
        status: 'PENDING'
      }
      // Add more mock requests as needed
    ];
    setRequests(mockRequests);
  }, [currentUser]);

  const handleApproval = async (requestId, approved) => {
    try {
      // Here you would make an API call to update the request status
      console.log(`Request ${requestId} ${approved ? 'approved' : 'rejected'}`);
      
      // Update local state
      setRequests(prev =>
        prev.map(req =>
          req.id === requestId
            ? { ...req, status: approved ? 'APPROVED' : 'REJECTED' }
            : req
        )
      );
    } catch (error) {
      console.error('Error updating request:', error);
    }
  };

  return (
    <div className="p-4">
      <h3 className="mb-4">Pending Booking Requests</h3>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Date</th>
            <th>Venue</th>
            <th>Department</th>
            <th>Requested By</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {requests.map(request => (
            <tr key={request.id}>
              <td>{request.date}</td>
              <td>{request.venueType}</td>
              <td>{request.department}</td>
              <td>{request.requestedByRole}</td>
              <td>
                <Badge bg={
                  request.status === 'APPROVED' ? 'success' :
                  request.status === 'REJECTED' ? 'danger' :
                  'warning'
                }>
                  {request.status}
                </Badge>
              </td>
              <td>
                {request.status === 'PENDING' && (
                  <>
                    <Button
                      variant="success"
                      size="sm"
                      className="me-2"
                      onClick={() => handleApproval(request.id, true)}
                    >
                      Approve
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleApproval(request.id, false)}
                    >
                      Reject
                    </Button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default BookingRequests;