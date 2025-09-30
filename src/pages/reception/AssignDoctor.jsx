import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext.jsx';
import { assignDoctor, getPatients } from '../../api/patientApi.js';
import { fetchDoctors } from '../../api/patientApi.js'; // same file
import { Form, Button, Card } from 'react-bootstrap';

const AssignDoctor = ({ onAssigned }) => {
  const { token } = useContext(AuthContext);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [data, setData] = useState({ patientId: '', doctorId: '' });

  useEffect(() => {
    const loadData = async () => {
      const p = await getPatients(token);
      const d = await fetchDoctors(token);
      setPatients(p);
      setDoctors(d);
    };
    loadData();
  }, [token]);

  const handleAssign = async () => {
    try {
      await assignDoctor(token, data);
      setData({ patientId: '', doctorId: '' });
      if (onAssigned) onAssigned(); // reload patient list
    } catch (error) {
      console.error('Failed to assign doctor:', error);
    }
  };

  return (
    <Card className="p-3 mt-4">
      <h3>Assign Doctor</h3>
      <Form>
        <Form.Group className="mb-2">
          <Form.Label>Patient</Form.Label>
          <Form.Select
            value={data.patientId}
            onChange={e => setData({ ...data, patientId: e.target.value })}
          >
            <option value="">Select Patient</option>
            {patients.map(p => (
              <option key={p.id} value={p.id}>
                {p.name} (ID: {p.id})
              </option>
            ))}
          </Form.Select>
        </Form.Group>
        <Form.Group className="mb-2">
          <Form.Label>Doctor</Form.Label>
          <Form.Select
            value={data.doctorId}
            onChange={e => setData({ ...data, doctorId: e.target.value })}
          >
            <option value="">Select Doctor</option>
            {doctors.map(d => (
              <option key={d.id} value={d.id}>
                {d.name} (ID: {d.id})
              </option>
            ))}
          </Form.Select>
        </Form.Group>
        <Button 
          onClick={handleAssign} 
          className="mt-2" 
          disabled={!data.patientId || !data.doctorId}
        >
          Assign
        </Button>
      </Form>
    </Card>
  );
};

export default AssignDoctor;
