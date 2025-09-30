import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext.jsx';
import { fetchDashboardStats } from '../../api/adminApi.js';
import { Container, Card, Row, Col } from 'react-bootstrap';

const DashboardStats = () => {
  const { token } = useContext(AuthContext);
  const [stats, setStats] = useState({ totalPatients: 0, totalTreatments: 0, totalLabReports: 0 });

  const getStats = async () => {
    try {
      const data = await fetchDashboardStats(token);
      setStats(data);
    } catch (error) {
      alert('Failed to fetch stats');
    }
  };

  useEffect(() => {
    getStats();
  }, []);

  return (
    <Container className="mt-4">
      <h3 className="mb-3 text-primary">Hospital Dashboard</h3>
      <Row className="g-3">
        <Col md={4}>
          <Card className="p-3 shadow text-center bg-light">
            <h5>Total Patients</h5>
            <h2>{stats.totalPatients}</h2>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="p-3 shadow text-center bg-light">
            <h5>Total Treatments</h5>
            <h2>{stats.totalTreatments}</h2>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="p-3 shadow text-center bg-light">
            <h5>Total Lab Reports</h5>
            <h2>{stats.totalLabReports}</h2>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default DashboardStats;
