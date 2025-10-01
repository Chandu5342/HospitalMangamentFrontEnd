import React, { useState, useEffect, useContext } from 'react';
import { Tab, Container, Row, Col, Card, Form } from 'react-bootstrap';
import { FaUserPlus, FaList, FaUserMd, FaFileInvoice } from 'react-icons/fa';
import AddPatient from './AddPatient.jsx';
import PatientList from './PatientList.jsx';
import AssignDoctor from './AssignDoctor.jsx';
import AddBill from './AddBill.jsx';
import BillList from './BillList.jsx';
import { getPatients } from '../../api/patientApi.js';
import { AuthContext } from '../../context/AuthContext.jsx';

const ReceptionDashboard = () => {
  const { token } = useContext(AuthContext);
  const [key, setKey] = useState('patients');
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState('');
  const [reloadBillsFlag, setReloadBillsFlag] = useState(false);

  const loadPatients = async () => {
    try {
      const data = await getPatients(token, { limit: 100 });
      setPatients(Array.isArray(data.patients) ? data.patients : []);
    } catch (error) {
      console.error('Error fetching patients:', error);
      setPatients([]);
    }
  };

  useEffect(() => {
    loadPatients();
  }, []);

  const reloadBills = () => setReloadBillsFlag(prev => !prev);

  const tabs = [
    { eventKey: 'patients', title: 'Patient List', icon: <FaList /> },
    { eventKey: 'add', title: 'Add Patient', icon: <FaUserPlus /> },
    { eventKey: 'assign', title: 'Assign Doctor', icon: <FaUserMd /> },
    { eventKey: 'billing', title: 'Billing', icon: <FaFileInvoice /> },
  ];

  return (
    <Container className="mt-4">
      <h2 className="mb-4 text-primary">Reception Dashboard</h2>

      <Row className="mb-4">
        {tabs.map((tab) => (
          <Col key={tab.eventKey} md={3} sm={12} className="mb-3">
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
            <PatientList 
              patients={patients} 
              reloadPatients={loadPatients} 
              isActive={key === 'patients'} 
            />
          </Tab.Pane>

          <Tab.Pane eventKey="add">
            <AddPatient onPatientAdded={async () => { await loadPatients(); setKey('patients'); }} />
          </Tab.Pane>

          <Tab.Pane eventKey="assign">
            <AssignDoctor onAssigned={loadPatients} patients={patients} />
          </Tab.Pane>

          <Tab.Pane eventKey="billing">
            <Card className="p-3 mb-3">
              <Form.Group className="mb-3">
                <Form.Label>Select Patient</Form.Label>
                <Form.Select
                  value={selectedPatient}
                  onChange={(e) => setSelectedPatient(e.target.value)}
                >
                  <option value="">Select Patient</option>
                  {patients.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} (ID: {p.id})
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Card>

            {selectedPatient && (
              <>
                <AddBill patientId={selectedPatient} onBillAdded={reloadBills} />
                <BillList patientId={selectedPatient} reloadFlag={reloadBillsFlag} />
              </>
            )}
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>
    </Container>
  );
};

export default ReceptionDashboard;
