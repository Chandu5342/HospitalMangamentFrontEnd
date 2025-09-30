import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext.jsx';
import { assignDoctor } from '../../api/patientApi.js';
import { Form, Button, Card } from 'react-bootstrap';

const AssignDoctor = ({ onAssigned }) => {
  const { token } = useContext(AuthContext);
  const [data, setData] = useState({ patientId: '', doctorId: '' });

  const handleAssign = async () => {
    await assignDoctor(token, data);
    setData({ patientId: '', doctorId: '' });
    if (onAssigned) onAssigned();
  };

  return (
    <Card className="p-3 mt-4">
      <h3>Assign Doctor</h3>
      <Form>
        <Form.Group className="mb-2">
          <Form.Label>Patient ID</Form.Label>
          <Form.Control value={data.patientId} onChange={e => setData({ ...data, patientId: e.target.value })} />
        </Form.Group>
        <Form.Group className="mb-2">
          <Form.Label>Doctor ID</Form.Label>
          <Form.Control value={data.doctorId} onChange={e => setData({ ...data, doctorId: e.target.value })} />
        </Form.Group>
        <Button onClick={handleAssign} className="mt-2">Assign</Button>
      </Form>
    </Card>
  );
};

export default AssignDoctor;
