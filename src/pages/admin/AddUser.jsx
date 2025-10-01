import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext.jsx';
import { addUser } from '../../api/adminApi.js';
import { Container, Card, Form, Button } from 'react-bootstrap';

const AddUser = ({ onUserAdded }) => {
  const { token } = useContext(AuthContext);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: '' });

  const handleAddUser = async () => {
    if (!formData.name || !formData.email || !formData.password || !formData.role) return alert('All fields required');
    try {
      await addUser(token, formData);
      alert('User added successfully');
      setFormData({ name: '', email: '', password: '', role: '' });
      onUserAdded(); // <-- notify parent to refresh
    } catch {
      alert('Failed to add user');
    }
  };

  return (
    <Container className="mt-4">
      <Card className="p-4 shadow">
        <h3 className="mb-3 text-primary">Add New User</h3>
        <Form>
          <Form.Group className="mb-2">
            <Form.Label>Name</Form.Label>
            <Form.Control value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Email</Form.Label>
            <Form.Control value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Role</Form.Label>
            <Form.Select value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })}>
              <option value="">Select Role</option>
              <option value="doctor">Doctor</option>
              <option value="reception">Receptionist</option>
              <option value="lab">Lab Staff</option>
              <option value="admin">Admin</option>
            </Form.Select>
          </Form.Group>
          <Button onClick={handleAddUser}>Add User</Button>
        </Form>
      </Card>
    </Container>
  );
};

export default AddUser;
