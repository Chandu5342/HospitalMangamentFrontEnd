// src/components/NavbarLayout.jsx
import React from 'react';
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';

const NavbarLayout = ({ children }) => {
  const navigate = useNavigate();
  const role = localStorage.getItem('role');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  };

  return (
    <>
      <Navbar bg="primary" variant="dark" expand="lg" className="mb-4">
        <Container>
          <Navbar.Brand as={Link} to={`/${role}`}>
            Hospital Management
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              {role === 'reception' && (
                <>
                  <Nav.Link as={Link} to="/reception">Dashboard</Nav.Link>
                </>
              )}
              {role === 'doctor' && (
                <>
                  <Nav.Link as={Link} to="/doctor">Dashboard</Nav.Link>
                </>
              )}
              {role === 'lab' && (
                <>
                  <Nav.Link as={Link} to="/lab">Dashboard</Nav.Link>
                </>
              )}
              {role === 'admin' && (
                <>
                  <Nav.Link as={Link} to="/admin">Dashboard</Nav.Link>
                </>
              )}
            </Nav>
            <Nav>
              <NavDropdown title={role?.toUpperCase()} id="basic-nav-dropdown">
                <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container>{children}</Container>
    </>
  );
};

export default NavbarLayout;
