import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext.jsx';
import { addTreatmentRecord } from '../../api/doctorApi.js';
import { Form, Button, Card, Container } from 'react-bootstrap';

const AddTreatment = () => {
  const { token } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    patient_id: '', diagnosis: '', prescription: ''
  });

  const handleAdd = async () => {
    if (!formData.patient_id || !formData.diagnosis) return alert('Patient ID and Diagnosis required');

    try {
      await addTreatmentRecord(token, formData);
      alert('Treatment added successfully');
      setFormData({ patient_id: '', diagnosis: '', prescription: '' });
    } catch (error) {
      alert('Failed to add treatment');
    }
  };

  return (
    <Container className="mt-4">
      <Card className="p-4 shadow">
        <h3 className="mb-3 text-success">Add Treatment</h3>
        <Form>
          <Form.Group className="mb-2">
            <Form.Label>Patient ID</Form.Label>
            <Form.Control
              value={formData.patient_id}
              onChange={e => setFormData({ ...formData, patient_id: e.target.value })}
            />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Diagnosis</Form.Label>
            <Form.Control
              value={formData.diagnosis}
              onChange={e => setFormData({ ...formData, diagnosis: e.target.value })}
            />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Prescription</Form.Label>
            <Form.Control
              value={formData.prescription}
              onChange={e => setFormData({ ...formData, prescription: e.target.value })}
            />
          </Form.Group>
          <Button className="mt-2" onClick={handleAdd}>Add Treatment</Button>
        </Form>
      </Card>
    </Container>
  );
};

export default AddTreatment;
