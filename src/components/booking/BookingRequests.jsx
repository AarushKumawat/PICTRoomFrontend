import React, { useState, useEffect } from 'react';
import { Table, Button, Badge, Tabs, Tab } from 'react-bootstrap';
import { bookingService } from '../../services/bookingService';
import { calendarService } from '../../services/calendarService';
import { useAuth } from '../../hooks/useAuth';

const BookingRequests = () => {
    const { user } = useAuth();
    const [pendingRequests, setPendingRequests] = useState([]);
    const [approvedRequests, setApprovedRequests] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('pending');

    // Determine if the user is an admin (HOD, TNP, Principal)
    const isAdmin = user?.role === 'HOD' || user?.role === 'Principal' || user?.role === 'TNP';

    useEffect(() => {
        console.log('Fetching booking requests...');
        const fetchRequestsAndRooms = async () => {
            try {
                console.log('Fetching rooms...');
                const roomsData = await calendarService.getRooms();
                console.log(roomsData)
                setRooms(roomsData);

                if (isAdmin) {
                    console.log('Fetching pending requests...');
                    const pending = await bookingService.getPendingRequests();
                    console.log('Pending requests fetched:', pending);
                    setPendingRequests(pending);
                    
                    console.log('Fetching approved requests...');
                    const approved = await bookingService.getApprovedRequests();
                    console.log('Approved requests fetched:', approved);
                    setApprovedRequests(approved);
                } else {
                    console.log('Fetching user requests...');
                    const userRequests = await bookingService.getUserRequests();
                    console.log('User requests fetched:', userRequests);
                    setPendingRequests(userRequests.filter(req => req.status === 'PENDING'));
                    setApprovedRequests(userRequests.filter(req => req.status === 'APPROVED'));
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchRequestsAndRooms();
    }, [isAdmin]);

    const handleApprove = async (requestId) => {
        try {
            await bookingService.approveBooking(requestId);
            // Move request from pending to approved
            const approvedRequest = pendingRequests.find(req => req.id === requestId);
            setPendingRequests(prev => prev.filter(req => req.id !== requestId));
            setApprovedRequests(prev => [...prev, { ...approvedRequest, status: 'APPROVED' }]);
        } catch (error) {
            console.error('Error approving request:', error);
        }
    };

    const handleReject = async (requestId) => {
        try {
            await bookingService.rejectBooking(requestId);
            setPendingRequests(prev => prev.filter(req => req.id !== requestId));
        } catch (error) {
            console.error('Error rejecting request:', error);
        }
    };

    if (loading) return <div>Loading...</div>;

    const RequestTable = ({ requests, showActions }) => (
        <Table striped bordered hover>
            <thead>
                <tr>
                    <th>Room</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Requested By</th>
                    <th>Purpose</th>
                    <th>Status</th>
                    {showActions && <th>Actions</th>}
                </tr>
            </thead>
            <tbody>
                {requests.map(request => (
                    <tr key={request.id}>
                        <td>{request.roomName}</td>
                        <td>{request.date}</td>
                        <td>{`${request.startTime} - ${request.endTime}`}</td>
                        <td>{request.requestedBy}</td>
                        <td>{request.reason}</td>
                        <td>
                            <Badge bg={
                                request.status === 'APPROVED' ? 'success' :
                                request.status === 'PENDING' ? 'warning' : 'danger'
                            }>
                                {request.status}
                            </Badge>
                        </td>
                        {showActions && (
                            <td>
                                <Button
                                    variant="success"
                                    size="sm"
                                    className="me-2"
                                    onClick={() => handleApprove(request.id)}
                                >
                                    Approve
                                </Button>
                                <Button
                                    variant="danger"
                                    size="sm"
                                    onClick={() => handleReject(request.id)}
                                >
                                    Reject
                                </Button>
                            </td>
                        )}
                    </tr>
                ))}
            </tbody>
        </Table>
    );

    return (
        <div className="p-3">
            <h2 className="mb-4">Booking Requests</h2>
            <Tabs
                activeKey={activeTab}
                onSelect={(k) => setActiveTab(k)}
                className="mb-3"
            >
                <Tab eventKey="pending" title={`Pending Requests (${pendingRequests.length})`}>
                    <RequestTable 
                        requests={pendingRequests} 
                        showActions={isAdmin}
                    />
                </Tab>
                <Tab eventKey="approved" title={`Approved Requests (${approvedRequests.length})`}>
                    <RequestTable 
                        requests={approvedRequests} 
                        showActions={false}
                    />
                </Tab>
            </Tabs>
        </div>
    );
};

export default BookingRequests;