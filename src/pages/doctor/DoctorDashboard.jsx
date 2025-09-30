import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext.jsx';
import { fetchDoctorPatients } from '../../api/doctorApi.js';
import { Card, Row, Col, Form, Button, Container } from 'react-bootstrap';
import { FaUserInjured, FaNotesMedical, FaPlusCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const DoctorDashboard = () => {
  const { token } = useContext(AuthContext);
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const loadPatients = async () => {
    try {
      const data = await fetchDoctorPatients(token, search);
      setPatients(data);
    } catch (error) {
      alert('Failed to load patients');
    }
  };

  useEffect(() => {
    loadPatients();
  }, []);

  return (
    <Container className="mt-4">
      <h2 className="mb-4 text-success">Doctor Dashboard</h2>

      {/* Add Treatment Button */}
      <Button
        className="mb-4"
        variant="primary"
        onClick={() => navigate('/doctor/add-treatment')}
      >
        <FaPlusCircle className="me-2" /> Add Treatment
      </Button>

      {/* Search */}
      <Form className="d-flex mb-4">
        <Form.Control
          type="text"
          placeholder="Search assigned patient..."
          className="me-2"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button onClick={loadPatients}>Search</Button>
      </Form>

      {/* Patients Grid */}
      <Row>
        {patients.map((p) => (
          <Col key={p.id} md={4} sm={12} className="mb-3">
            <Card className="shadow h-100">
              <Card.Body>
                <div className="fs-2 mb-2 text-primary"><FaUserInjured /></div>
                <Card.Title>{p.name}</Card.Title>
                <Card.Text>
                  <strong>Age:</strong> {p.age} <br />
                  <strong>Gender:</strong> {p.gender} <br />
                  <strong>Contact:</strong> {p.contact} <br />
                </Card.Text>
                <Button
                  variant="success"
                  onClick={() => navigate(`/doctor/history/${p.id}`)}
                >
                  <FaNotesMedical className="me-1" /> View History
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default DoctorDashboard;
