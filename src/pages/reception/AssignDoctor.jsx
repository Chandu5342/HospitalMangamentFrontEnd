import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext.jsx';
import { assignDoctor, getPatients, fetchDoctors } from '../../api/patientApi.js';
import { Form, Button, Card } from 'react-bootstrap';

const AssignDoctor = ({ onAssigned, patients: propPatients = [] }) => {
  const { token } = useContext(AuthContext);
  const [patients, setPatients] = useState(propPatients);
  const [doctors, setDoctors] = useState([]);
  const [data, setData] = useState({ patientId: '', doctorId: '' });

  useEffect(() => {
    const loadData = async () => {
      // Only fetch patients if not provided via props
      if (!propPatients.length) {
        try {
          const patientData = await getPatients(token);
          setPatients(Array.isArray(patientData.patients) ? patientData.patients : []);
        } catch (err) {
          console.error('Failed to fetch patients:', err);
          setPatients([]);
        }
      }

      try {
        const d = await fetchDoctors(token);
        setDoctors(Array.isArray(d) ? d : []);
      } catch (err) {
        console.error('Failed to fetch doctors:', err);
        setDoctors([]);
      }
    };

    loadData();
  }, [token, propPatients]);

  const handleAssign = async () => {
    try {
      await assignDoctor(token, data);
      setData({ patientId: '', doctorId: '' });
      if (onAssigned) onAssigned();
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
            {(patients || []).map(p => (
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
            {(doctors || []).map(d => (
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
