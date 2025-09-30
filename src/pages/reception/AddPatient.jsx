import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext.jsx';
import { createPatient } from '../../api/patientApi.js';
import { Form, Button, Card } from 'react-bootstrap';

const AddPatient = ({ onPatientAdded }) => {
  const { token } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    name: '', age: '', gender: '', contact: '', address: ''
  });

  const handleAdd = async () => {
    await createPatient(token, formData);
    setFormData({ name: '', age: '', gender: '', contact: '', address: '' });
    if (onPatientAdded) onPatientAdded();
  };

  return (
    <Card className="p-3 mt-4">
      <h3>Add Patient</h3>
      <Form>
        <Form.Group className="mb-2">
          <Form.Label>Name</Form.Label>
          <Form.Control value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
        </Form.Group>
        <Form.Group className="mb-2">
          <Form.Label>Age</Form.Label>
          <Form.Control type="number" value={formData.age} onChange={e => setFormData({ ...formData, age: e.target.value })} />
        </Form.Group>
        <Form.Group className="mb-2">
          <Form.Label>Gender</Form.Label>
          <Form.Select value={formData.gender} onChange={e => setFormData({ ...formData, gender: e.target.value })}>
            <option value="">Select</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </Form.Select>
        </Form.Group>
        <Form.Group className="mb-2">
          <Form.Label>Contact</Form.Label>
          <Form.Control value={formData.contact} onChange={e => setFormData({ ...formData, contact: e.target.value })} />
        </Form.Group>
        <Form.Group className="mb-2">
          <Form.Label>Address</Form.Label>
          <Form.Control value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} />
        </Form.Group>
        <Button onClick={handleAdd} className="mt-2">Add Patient</Button>
      </Form>
    </Card>
  );
};

export default AddPatient;
