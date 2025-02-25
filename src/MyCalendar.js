import React, { useState } from "react";
import { Calendar as BigCalendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Modal, Button, Form, Navbar, Container, Row, Col } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import { LogOut } from "lucide-react"; // Import the LogOut icon
import logo from './assets/images/logo.png';

const localizer = momentLocalizer(moment);

// Predefined rooms for the dropdown
const AVAILABLE_ROOMS = [
  "Room 101 - Conference Hall",
  "Room 202 - Seminar Hall",
  "Room 303 - Computer Lab",
  "Room 404 - Auditorium",
  "Room 505 - Project Room"
];

// Updated Header Component with PICT logo
const Header = ({ onSignOut }) => {
  return (
    <Navbar bg="light" expand="lg" className="mb-3">
      <Container fluid>
        <Navbar.Brand className="d-flex align-items-center">
         {/* PICT Logo added to the left side of the header */}
<img 
  src={logo}
  alt="PICT Logo" 
  height="50px" 
  className="me-2"
/>
          <strong>PICT Calendar</strong>
        </Navbar.Brand>
        <Button 
          variant="danger" 
          size="sm" 
          onClick={onSignOut}
          style={{ 
            borderRadius: "0%",
            width: "100px",
            height: "35px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "14px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
            transition: "all 0.2s ease-in-out",
            padding: "0 10px"
          }}
          title="Logout"
        >
          <LogOut size={16} className="me-1" /> {/* Added logout icon */}
          Logout
        </Button>
      </Container>
    </Navbar>
  );
};

// YearlyCalendar Component
const YearlyCalendar = ({ events, onSelectDay }) => {
  const months = moment.months();

  return (
    <div style={{ 
      display: "grid", 
      gridTemplateColumns: "repeat(3, 1fr)", 
      gap: "20px", 
      padding: "20px" 
    }}>
      {months.map((month, monthIndex) => {
        const startOfMonth = moment().month(monthIndex).startOf("month");
        const daysInMonth = startOfMonth.daysInMonth();
        const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);
        const monthEvents = events.filter(event => moment(event.start).month() === monthIndex);

        return (
          <div 
            key={month} 
            style={{ 
              border: "1px solid #ccc", 
              padding: "10px", 
              borderRadius: "8px", 
              textAlign: "center" 
            }}
          >
            <h3>{month}</h3>
            <div style={{ 
              display: "grid", 
              gridTemplateColumns: "repeat(7, 1fr)", 
              gap: "5px" 
            }}>
              {daysArray.map(day => {
                const eventsForDay = monthEvents.filter(event => moment(event.start).date() === day);
                const hasEvents = eventsForDay.length > 0;
                
                // Determine background color based on event status
                // If multiple events with different statuses, prioritize Pending
                const hasPending = eventsForDay.some(event => event.status === "Pending");
                const eventStatus = hasEvents 
                  ? (hasPending ? "#ffcccb" : "#90EE90") 
                  : "#f0f0f0";

                const tooltipContent = hasEvents 
                  ? eventsForDay.map(event => 
                      `${event.title} (${event.club}) - ${event.status}`
                    ).join('\n')
                  : "Click to view day";

                return (
                  <div 
                    key={day} 
                    style={{ 
                      padding: "5px", 
                      backgroundColor: eventStatus, 
                      borderRadius: "5px", 
                      cursor: "pointer", 
                      position: "relative",
                      transition: "all 0.2s ease-in-out",
                      ':hover': {
                        transform: "scale(1.1)",
                        boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
                      }
                    }}
                    onClick={() => {
                      const selectedDate = moment().month(monthIndex).date(day).toDate();
                      onSelectDay(selectedDate);
                    }}
                    title={tooltipContent}
                  >
                    <span style={{ 
                      position: "relative",
                      fontWeight: hasEvents ? "bold" : "normal"
                    }}>
                      {day}
                    </span>
                    {hasEvents && (
                      <div style={{
                        fontSize: "8px",
                        marginTop: "2px"
                      }}>
                        {eventsForDay.length} event{eventsForDay.length > 1 ? 's' : ''}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

// Sidebar Component
const Sidebar = ({ events, approveEvent, modifyEvent, cancelEvent }) => {
  const formatEventTime = (start, end) => {
    return `${moment(start).format('HH:mm')} - ${moment(end).format('HH:mm')}`;
  };

  return (
    <div style={{ 
      width: "300px", 
      padding: "20px", 
      borderRight: "1px solid #ccc", 
      backgroundColor: "#f8f9fa", 
      height: "calc(100vh - 56px)", 
      overflowY: "auto" 
    }}>
      {/* Pending Requests Section */}
      <div style={{ marginBottom: "30px" }}>
        <h4 style={{ 
          fontSize: "18px", 
          fontWeight: "600", 
          color: "#333", 
          marginBottom: "15px", 
          borderBottom: "2px solid #ffc107", 
          paddingBottom: "5px" 
        }}>
          Pending Requests
        </h4>
        {events.filter(event => event.status === "Pending").length === 0 && (
          <div style={{ color: "#666", fontSize: "14px", fontStyle: "italic" }}>
            No pending requests
          </div>
        )}
        {events.filter(event => event.status === "Pending").map((event, index) => (
          <div 
            key={index} 
            style={{ 
              padding: "10px", 
              marginBottom: "10px", 
              backgroundColor: "#fff", 
              borderRadius: "8px", 
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)", 
              borderLeft: "4px solid #ffc107" 
            }}
          >
            <div style={{ fontWeight: "500", color: "#333" }}>
              {event.title} ({event.club})
            </div>
            <div style={{ fontSize: "14px", color: "#666", marginTop: "5px" }}>
              Time: {formatEventTime(event.start, event.end)}<br />
              Date: {moment(event.start).format('MMM DD, YYYY')}<br />
              Room: {event.room}<br />
              Reason: {event.reason}
            </div>
            <div style={{ marginTop: "8px" }}>
              <Button 
                size="sm" 
                variant="success" 
                onClick={() => approveEvent(event)}
                style={{ marginRight: "5px" }}
              >
                Approve
              </Button>
              <Button 
                size="sm" 
                variant="warning" 
                onClick={() => modifyEvent(event)}
                style={{ marginRight: "5px" }}
              >
                Modify
              </Button>
              <Button 
                size="sm" 
                variant="danger" 
                onClick={() => cancelEvent(event)}
              >
                Cancel
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Approved Requests Section */}
      <div>
        <h4 style={{ 
          fontSize: "18px", 
          fontWeight: "600", 
          color: "#333", 
          marginBottom: "15px", 
          borderBottom: "2px solid #28a745", 
          paddingBottom: "5px" 
        }}>
          Approved Requests
        </h4>
        {events.filter(event => event.status === "Approved").length === 0 && (
          <div style={{ color: "#666", fontSize: "14px", fontStyle: "italic" }}>
            No approved requests
          </div>
        )}
        {events.filter(event => event.status === "Approved").map((event, index) => (
          <div 
            key={index} 
            style={{ 
              padding: "10px", 
              marginBottom: "10px", 
              backgroundColor: "#fff", 
              borderRadius: "8px", 
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)", 
              borderLeft: "4px solid #28a745" 
            }}
          >
            <div style={{ fontWeight: "500", color: "#333" }}>
              {event.title} ({event.club})
            </div>
            <div style={{ fontSize: "14px", color: "#666", marginTop: "5px" }}>
              Time: {formatEventTime(event.start, event.end)}<br />
              Date: {moment(event.start).format('MMM DD, YYYY')}<br />
              Room: {event.room}<br />
              Reason: {event.reason}
            </div>
            <div style={{ marginTop: "8px" }}>
              <Button 
                size="sm" 
                variant="warning" 
                onClick={() => modifyEvent(event)}
                style={{ marginRight: "5px" }}
              >
                Modify
              </Button>
              <Button 
                size="sm" 
                variant="danger" 
                onClick={() => cancelEvent(event)}
              >
                Cancel
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// EventComponent with improved styling to show more information in limited space
const EventComponent = ({ event }) => (
  <div style={{ 
    fontSize: "12px", 
    lineHeight: "1.2",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    padding: "2px 4px"
  }}>
    <strong>{event.title}</strong> ({event.club})
  </div>
);

// Month Event Component - Custom rendering for events in month view
const MonthEventComponent = ({ event }) => (
  <div style={{ 
    fontSize: "10px", 
    lineHeight: "1.1",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    padding: "1px 2px"
  }}>
    {event.title}
  </div>
);

// Main Calendar Component
const MyCalendar = () => {
  const [events, setEvents] = useState([
    {
      id: 1,
      title: "Meeting",
      club: "Tech Club",
      reason: "Discussion",
      room: "Room 101 - Conference Hall",
      start: new Date(2024, 1, 15, 10, 30),
      end: new Date(2024, 1, 15, 11, 45),
      status: "Pending"
    },
    {
      id: 2,
      title: "Workshop",
      club: "Design Club",
      reason: "Training",
      room: "Room 202 - Seminar Hall",
      start: new Date(2024, 2, 20, 14, 15),
      end: new Date(2024, 2, 20, 16, 30),
      status: "Approved"
    },
    // Adding more sample events to demonstrate multiple events on same day
    {
      id: 3,
      title: "Seminar",
      club: "AI Club",
      reason: "Guest Lecture",
      room: "Room 404 - Auditorium",
      start: new Date(2024, 2, 20, 10, 0),
      end: new Date(2024, 2, 20, 12, 0),
      status: "Pending"
    },
    {
      id: 4,
      title: "Hackathon",
      club: "Coding Club",
      reason: "Competition",
      room: "Room 303 - Computer Lab",
      start: new Date(2024, 2, 20, 18, 0),
      end: new Date(2024, 2, 20, 22, 0),
      status: "Approved"
    }
  ]);

  const [currentView, setCurrentView] = useState(Views.DAY);
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [newEvent, setNewEvent] = useState({
    title: "",
    club: "",
    reason: "",
    room: AVAILABLE_ROOMS[0], // Default to first room
    start: null,
    end: null,
    startHour: "09",
    startMinute: "00",
    endHour: "10",
    endMinute: "00"
  });

  const hours = Array.from({ length: 24 }, (_, i) => 
    i.toString().padStart(2, '0')
  );
  
  const minutes = Array.from({ length: 60 }, (_, i) => 
    i.toString().padStart(2, '0')
  );

  const handleSignOut = () => {
    if (window.confirm('Are you sure you want to sign out?')) {
      window.location.href = '/login';
      alert('Redirecting to login page...');
    }
  };

  // Updated handleSelectSlot to handle time range selection
  const handleSelectSlot = ({ start, end }) => {
    // Use actual start and end times from the selection
    const startMoment = moment(start);
    const endMoment = moment(end);
    
    setNewEvent({
      ...newEvent,
      start: startMoment.toDate(),
      end: endMoment.toDate(),
      startHour: startMoment.format('HH'),
      startMinute: startMoment.format('mm'),
      endHour: endMoment.format('HH'),
      endMinute: endMoment.format('mm'),
      room: AVAILABLE_ROOMS[0] // Default to first room when creating new event
    });
    setShowModal(true);
  };

  const handleBookSlot = () => {
    if (newEvent.title && newEvent.club && newEvent.reason && newEvent.room) {
      const startDateTime = moment(newEvent.start)
        .hour(parseInt(newEvent.startHour, 10))
        .minute(parseInt(newEvent.startMinute, 10))
        .second(0)
        .toDate();
      
      const endDateTime = moment(newEvent.start)
        .hour(parseInt(newEvent.endHour, 10))
        .minute(parseInt(newEvent.endMinute, 10))
        .second(0)
        .toDate();

      if (moment(endDateTime).isSameOrBefore(startDateTime)) {
        alert("End time must be after start time!");
        return;
      }

      // Check for room availability
      const isRoomAvailable = checkRoomAvailability(newEvent.room, startDateTime, endDateTime, newEvent.id);
      if (!isRoomAvailable) {
        alert(`${newEvent.room} is already booked during this time slot. Please select another room or time.`);
        return;
      }

      const eventToAdd = {
        ...newEvent,
        start: startDateTime,
        end: endDateTime,
        status: newEvent.id ? newEvent.status : "Pending",
        id: newEvent.id || Date.now()
      };

      if (newEvent.id) {
        setEvents(events.map(e => e.id === eventToAdd.id ? eventToAdd : e));
      } else {
        setEvents([...events, eventToAdd]);
      }

      setShowModal(false);
      setNewEvent({
        title: "",
        club: "",
        reason: "",
        room: AVAILABLE_ROOMS[0],
        start: null,
        end: null,
        startHour: "09",
        startMinute: "00",
        endHour: "10",
        endMinute: "00"
      });
    } else {
      alert("Please fill in all details!");
    }
  };

  // Check if a room is available for booking
  const checkRoomAvailability = (room, start, end, currentEventId = null) => {
    return !events.some(event => 
      event.room === room && 
      event.id !== currentEventId &&
      ((moment(start).isBetween(event.start, event.end, null, '[)') || 
        moment(end).isBetween(event.start, event.end, null, '(]') ||
        (moment(start).isSameOrBefore(event.start) && moment(end).isSameOrAfter(event.end)))
    ));
  };

  const handleApproveEvent = (event) => {
    setEvents(events.map(e => 
      e.id === event.id ? { ...e, status: "Approved" } : e
    ));
  };

  const handleModifyEvent = (event) => {
    setNewEvent({
      ...event,
      startHour: moment(event.start).format('HH'),
      startMinute: moment(event.start).format('mm'),
      endHour: moment(event.end).format('HH'),
      endMinute: moment(event.end).format('mm')
    });
    setShowModal(true);
  };

  const handleCancelEvent = (event) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      setEvents(events.filter(e => e.id !== event.id));
    }
  };

  const handleSelectDay = (date) => {
    setSelectedDate(date);
    setCurrentView(Views.DAY);
  };

  const eventStyleGetter = (event) => {
    const style = {
      backgroundColor: event.status === "Pending" ? "#ffc107" : "#28a745",
      borderRadius: "3px",
      opacity: 0.8,
      color: event.status === "Pending" ? "black" : "white",
      border: "0px",
      display: "block"
    };
    return { style };
  };

  // Get room availabilities for the selected date
  const getRoomAvailabilities = () => {
    const selectedDateStart = moment(selectedDate).startOf('day');
    const selectedDateEnd = moment(selectedDate).endOf('day');
    
    return AVAILABLE_ROOMS.map(room => {
      const roomEvents = events.filter(event => 
        event.room === room &&
        moment(event.start).isBetween(selectedDateStart, selectedDateEnd, null, '[]')
      );
      
      return {
        room,
        events: roomEvents,
        available: roomEvents.length === 0
      };
    });
  };

  // Custom tooltip accessor for month view events
  const tooltipAccessor = (event) => {
    return `${event.title} (${event.club})
Time: ${moment(event.start).format('HH:mm')} - ${moment(event.end).format('HH:mm')}
Room: ${event.room}
Status: ${event.status}`;
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <Header onSignOut={handleSignOut} />
      
      <div style={{ display: "flex", flex: 1 }}>
        <Sidebar 
          events={events} 
          approveEvent={handleApproveEvent} 
          modifyEvent={handleModifyEvent} 
          cancelEvent={handleCancelEvent} 
        />
        
        <div style={{ flex: 1, padding: "20px" }}>
          <div style={{ marginBottom: "20px" }}>
            <Button 
              variant={currentView === Views.DAY ? "primary" : "outline-primary"} 
              onClick={() => setCurrentView(Views.DAY)}
              className="me-2"
              style={{ borderRadius: "20px", paddingLeft: "15px", paddingRight: "15px" }}
            >
              Day View
            </Button>
            <Button 
              variant={currentView === Views.WEEK ? "primary" : "outline-primary"} 
              onClick={() => setCurrentView(Views.WEEK)}
              className="me-2"
              style={{ borderRadius: "20px", paddingLeft: "15px", paddingRight: "15px" }}
            >
              Week View
            </Button>
            <Button 
              variant={currentView === Views.MONTH ? "primary" : "outline-primary"} 
              onClick={() => setCurrentView(Views.MONTH)}
              className="me-2"
              style={{ borderRadius: "20px", paddingLeft: "15px", paddingRight: "15px" }}
            >
              Month View
            </Button>
            <Button 
              variant={currentView === "year" ? "primary" : "outline-primary"} 
              onClick={() => setCurrentView("year")}
              style={{ borderRadius: "20px", paddingLeft: "15px", paddingRight: "15px" }}
            >
              Year View
            </Button>
          </div>

          {currentView === "year" ? (
            <YearlyCalendar 
              events={events} 
              onSelectDay={handleSelectDay} 
            />
          ) : (
            <BigCalendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              selectable
              onSelectSlot={handleSelectSlot}
              views={[Views.DAY, Views.WEEK, Views.MONTH]}
              view={currentView}
              date={selectedDate}
              onNavigate={date => setSelectedDate(date)}
              eventPropGetter={eventStyleGetter}
              min={moment().hours(0).minutes(0).seconds(0).toDate()}
              max={moment().hours(23).minutes(59).seconds(59).toDate()}
              step={60}
              timeslots={1}
              formats={{
                timeGutterFormat: 'HH:00',
                eventTimeRangeFormat: () => '' // Removes duplicate time display
              }}
              components={{
                event: EventComponent,
                month: {
                  event: MonthEventComponent
                }
              }}
              tooltipAccessor={tooltipAccessor}
              popup={true}
              onSelectEvent={event => {
                setSelectedDate(event.start);
                setCurrentView(Views.DAY);
              }}
              // Key configurations to show multiple events in month view
              showMultiDayTimes={true}
              length={60}
            />
          )}
        </div>
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{newEvent.id ? 'Modify Booking' : 'New Booking'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control 
                type="text" 
                value={newEvent.title} 
                onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })} 
                placeholder="Enter event title"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Club Name</Form.Label>
              <Form.Control 
                type="text" 
                value={newEvent.club} 
                onChange={(e) => setNewEvent({ ...newEvent, club: e.target.value })} 
                placeholder="Enter club name"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Date</Form.Label>
              <Form.Control 
                type="date" 
                value={newEvent.start ? moment(newEvent.start).format('YYYY-MM-DD') : ''}
                onChange={(e) => {
                  const newDate = moment(e.target.value).toDate();
                  setNewEvent({ 
                    ...newEvent, 
                    start: newDate,
                    end: moment(newDate).add(1, 'hour').toDate()
                  });
                }}
              />
            </Form.Group>
            
            <Row className="mb-3">
              <Form.Label>Start Time</Form.Label>
              <Col>
                <Form.Select
                  value={newEvent.startHour}
                  onChange={(e) => setNewEvent({ ...newEvent, startHour: e.target.value })}
                >
                  {hours.map(hour => (
                    <option key={`start-hour-${hour}`} value={hour}>{hour}</option>
                  ))}
                </Form.Select>
              </Col>
              <Col>
                <Form.Select
                  value={newEvent.startMinute}
                  onChange={(e) => setNewEvent({ ...newEvent, startMinute: e.target.value })}
                >
                  {minutes.map(minute => (
                    <option key={`start-minute-${minute}`} value={minute}>{minute}</option>
                  ))}
                </Form.Select>
              </Col>
            </Row>
            
            <Row className="mb-3">
              <Form.Label>End Time</Form.Label>
              <Col>
                <Form.Select
                  value={newEvent.endHour}
                  onChange={(e) => setNewEvent({ ...newEvent, endHour: e.target.value })}
                >
                  {hours.map(hour => (
                    <option key={`end-hour-${hour}`} value={hour}>{hour}</option>
                  ))}
                </Form.Select>
              </Col>
              <Col>
                <Form.Select
                  value={newEvent.endMinute}
                  onChange={(e) => setNewEvent({ ...newEvent, endMinute: e.target.value })}
                >
                  {minutes.map(minute => (
                    <option key={`end-minute-${minute}`} value={minute}>{minute}</option>
                  ))}
                </Form.Select>
              </Col>
            </Row>
            
            <Form.Group className="mb-3">
              <Form.Label>Room</Form.Label>
              <Form.Select
                value={newEvent.room}
                onChange={(e) => setNewEvent({ ...newEvent, room: e.target.value })}
              >
                {AVAILABLE_ROOMS.map(room => (
                  <option key={room} value={room}>{room}</option>
                ))}
              </Form.Select>
              {/* Display room availability status */}
              {newEvent.start && (
                <div className="mt-2">
                  <p style={{ fontSize: "0.9rem", color: "#666" }}>Room availability on {moment(newEvent.start).format('MMM DD, YYYY')}:</p>
                  <ul style={{ fontSize: "0.85rem", paddingLeft: "20px" }}>
                    {getRoomAvailabilities().map(({ room, available, events }) => (
                      <li key={room} style={{ color: available ? "#28a745" : "#dc3545" }}>
                        {room}: {available ? "Available all day" : `Booked (${events.length} event${events.length > 1 ? 's' : ''})`}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Reason</Form.Label>
              <Form.Control 
                as="textarea" 
                rows={3}
                value={newEvent.reason} 
                onChange={(e) => setNewEvent({ ...newEvent, reason: e.target.value })} 
                placeholder="Enter booking reason"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button 
            variant="secondary" 
            onClick={() => setShowModal(false)}
            style={{ borderRadius: "20px" }}
          >
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={handleBookSlot}
            style={{ borderRadius: "20px" }}
          >
            {newEvent.id ? 'Update Booking' : 'Request Booking'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default MyCalendar;