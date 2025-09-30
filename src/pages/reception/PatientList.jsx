import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext.jsx';
import { Table, Form, Button } from 'react-bootstrap';
import { getPatients } from '../../api/patientApi.js';

const PatientList = ({ patients, reloadPatients }) => {
  const { token } = useContext(AuthContext);
  const [search, setSearch] = useState('');

  const handleSearch = async () => {
    const data = await getPatients(token, search);
    reloadPatients(data);
  };

  return (
    <div className="container mt-4">
      <h3>Patient List</h3>
      <div className="d-flex mb-3">
        <Form.Control
          type="text"
          placeholder="Search patient..."
          className="me-2"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button onClick={handleSearch}>Search</Button>
      </div>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Age</th>
            <th>Gender</th>
            <th>Contact</th>
            <th>Address</th>
            <th>Assigned Doctor</th>
          </tr>
        </thead>
        <tbody>
          {patients.map((p) => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.name}</td>
              <td>{p.age}</td>
              <td>{p.gender}</td>
              <td>{p.contact}</td>
              <td>{p.address}</td>
              <td>{p.assigned_doctor || '-'}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default PatientList;
