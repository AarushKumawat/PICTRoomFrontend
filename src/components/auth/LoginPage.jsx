import React, { useState } from 'react';
import { Container, Card, Form, Button, Alert, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import pictLogo from '../../assets/images/pict-logo.png';
import './LoginPage.css';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    role: '',
    username: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const roles = [
    { value: 'HOD', label: 'HOD' },
    { value: 'CLUB', label: 'Clubs' },
    { value: 'Principal', label: 'Principal' },
    { value: 'TNP', label: 'TNP' },
    { value: 'Dean', label: 'Dean' }
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

    if (!formData.role || !formData.username || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      const response = await login({
        role: formData.role,
        username: formData.username,
        password: formData.password,
      });

      if (response) {
        setSuccess('Login successful!');
        setTimeout(() => navigate('/calendar'), 1000);
      } else {
        setError('Login failed. Please try again.');
      }
    } catch (err) {
      console.error('Login Error:', err);
      setError(err.message || 'Login failed. Please try again.');
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
            <p className="institution-subtitle">An Autonomous Institute affiliated to Savitribai Phule Pune University</p>
          </div>
        </Col>
        
        <Col md={7} className="d-flex justify-content-center">
          <Card className="login-card shadow">
            <Card.Header as="h5" className="text-center text-white">
              Institution Login
            </Card.Header>
            <Card.Body className="p-4">
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
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    placeholder="Enter your username"
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
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default LoginPage;