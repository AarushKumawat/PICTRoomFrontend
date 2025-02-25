import React, { useState } from 'react';
import { Container, Card, Form, Button, Alert, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import bcrypt from 'bcryptjs';
import { useAuth } from '../../hooks/useAuth';
import pictLogo from '../../assets/images/pict-logo.png';
import './LoginPage.css';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    role: '',
    uniqueId: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showRecovery, setShowRecovery] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const roles = [
    { value: 'hod', label: 'HOD' },
    { value: 'clubs', label: 'Clubs' },
    { value: 'principal', label: 'Principal' },
    { value: 'tnp', label: 'TNP' },
    { value: 'dean', label: 'Dean' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.role || !formData.uniqueId || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      const hashedPassword = await bcrypt.hash(formData.password, 10);
      console.log('Login attempt with:', {
        ...formData,
        password: hashedPassword
      });

      await login({
        id: formData.uniqueId,
        role: formData.role,
        department: 'department'
      });

      setSuccess('Login successful!');
      setTimeout(() => navigate('/calendar'), 1000);
    } catch (err) {
      setError('Login failed. Please try again.');
    }
  };

  const handlePasswordRecovery = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!phoneNumber) {
      setError('Please enter your phone number');
      return;
    }

    try {
      console.log('Password recovery requested for:', phoneNumber);
      setSuccess('Recovery instructions sent to your phone');
    } catch (err) {
      setError('Password recovery failed. Please try again.');
    }
  };

  return (
    <Container fluid className="login-container min-vh-100">
      {/* Added Calendar Header */}
      <div className="calendar-header text-center py-3">
        <h1 className="calendar-title">PICT Calendar</h1>
      </div>

      <Row className="min-vh-100 align-items-center">
        <Col md={5} className="d-flex justify-content-center align-items-center logo-section">
          <div className="text-center">
            <img
              src={pictLogo}
              alt="PICT Logo"
              
              className="pict-logo mb-4"
            />
            <h2 className="institution-name mt-3">Pune Institute of Computer Technology</h2>
            <p className="institution-subtitle">An Autonomous Institute of Government of Maharashtra</p>
          </div>
        </Col>
        
        <Col md={7} className="d-flex justify-content-center">
          <Card className="login-card shadow">
            <Card.Header as="h5" className="text-center text-white">
              Institution Login
            </Card.Header>
            <Card.Body className="p-4">
              {!showRecovery ? (
                <Form onSubmit={handleLogin}>
                  <Form.Group className="mb-3">
                    <Form.Label>Role</Form.Label>
                    <Form.Select
                      name="role"
                      value={formData.role}
                      onChange={handleInputChange}
                      className="form-control-lg"
                    >
                      <option value="">Select Role</option>
                      {roles.map(role => (
                        <option key={role.value} value={role.value}>
                          {role.label}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Unique ID</Form.Label>
                    <Form.Control
                      type="text"
                      name="uniqueId"
                      value={formData.uniqueId}
                      onChange={handleInputChange}
                      placeholder="Enter your ID"
                      className="form-control-lg"
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <div className="position-relative">
                      <Form.Control
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder="Enter your password"
                        className="form-control-lg"
                      />
                      <Button
                        variant="link"
                        onClick={() => setShowPassword(!showPassword)}
                        className="password-toggle"
                      >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </Button>
                    </div>
                  </Form.Group>

                  <Button variant="primary" type="submit" className="w-100 btn-lg mb-3">
                    Login
                  </Button>
                </Form>
              ) : (
                <Form onSubmit={handlePasswordRecovery}>
                  <Form.Group className="mb-3">
                    <Form.Label>Phone Number</Form.Label>
                    <Form.Control
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="Enter your phone number"
                      className="form-control-lg"
                    />
                  </Form.Group>

                  <Button variant="primary" type="submit" className="w-100 btn-lg mb-3">
                    Recover Password
                  </Button>
                </Form>
              )}

              {error && (
                <Alert variant="danger" className="mt-3">
                  {error}
                </Alert>
              )}

              {success && (
                <Alert variant="success" className="mt-3">
                  {success}
                </Alert>
              )}
            </Card.Body>
            <Card.Footer className="text-center bg-light">
              <Button
                variant="link"
                onClick={() => {
                  setShowRecovery(!showRecovery);
                  setError('');
                  setSuccess('');
                }}
              >
                {showRecovery ? 'Back to Login' : 'Forgot Password?'}
              </Button>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default LoginPage;