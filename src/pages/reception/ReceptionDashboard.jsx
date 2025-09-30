import React, { useState, useEffect, useContext } from 'react';
import { Tab, Container, Row, Col, Card } from 'react-bootstrap';
import { FaUserPlus, FaList, FaUserMd } from 'react-icons/fa';
import AddPatient from './AddPatient.jsx';
import PatientList from './PatientList.jsx';
import AssignDoctor from './AssignDoctor.jsx';
import { getPatients } from '../../api/patientApi.js';
import { AuthContext } from '../../context/AuthContext.jsx';

const ReceptionDashboard = () => {
  const { token } = useContext(AuthContext);
  const [key, setKey] = useState('patients');
  const [patients, setPatients] = useState([]);

  const loadPatients = async () => {
    const data = await getPatients(token);
    setPatients(data);
  };

  useEffect(() => {
    loadPatients();
  }, []);

  const tabs = [
    { eventKey: 'patients', title: 'Patient List', icon: <FaList /> },
    { eventKey: 'add', title: 'Add Patient', icon: <FaUserPlus /> },
    { eventKey: 'assign', title: 'Assign Doctor', icon: <FaUserMd /> },
  ];

  return (
    <Container className="mt-4">
      <h2 className="mb-4 text-primary">Reception Dashboard</h2>
      
      <Row className="mb-4">
        {tabs.map((tab) => (
          <Col key={tab.eventKey} md={4} sm={12} className="mb-3">
            <Card
              onClick={() => setKey(tab.eventKey)}
              className={`text-center shadow ${key === tab.eventKey ? 'border-primary' : ''}`}
              style={{ cursor: 'pointer', transition: 'transform 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
            >
              <Card.Body>
                <div className="fs-1 mb-2">{tab.icon}</div>
                <Card.Title>{tab.title}</Card.Title>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Tab.Container activeKey={key} onSelect={(k) => setKey(k)}>
        <Tab.Content>
          <Tab.Pane eventKey="patients">
            <PatientList patients={patients} reloadPatients={loadPatients} />
          </Tab.Pane>
          <Tab.Pane eventKey="add">
            <AddPatient onPatientAdded={() => { loadPatients(); setKey('patients'); }} />
          </Tab.Pane>
          <Tab.Pane eventKey="assign">
            <AssignDoctor onAssigned={() => loadPatients()} />
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>
    </Container>
  );
};

export default ReceptionDashboard;
