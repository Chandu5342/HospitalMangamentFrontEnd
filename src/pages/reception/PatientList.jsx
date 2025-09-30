import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext.jsx';
import { Table, Form, Button } from 'react-bootstrap';
import { getPatients, fetchDoctors } from '../../api/patientApi.js';

const PatientList = ({ patients: propPatients = [], reloadPatients, isActive }) => {
  const { token } = useContext(AuthContext);

  const [patientsData, setPatientsData] = useState({
    patients: Array.isArray(propPatients) ? propPatients : [],
    totalPages: 1,
    currentPage: 1,
  });

  const [search, setSearch] = useState('');
  const [doctorId, setDoctorId] = useState('');
  const [gender, setGender] = useState('');
  const [doctors, setDoctors] = useState([]);

  const loadDoctors = async () => {
    try {
      const d = await fetchDoctors(token);
      setDoctors(Array.isArray(d) ? d : []);
    } catch (error) {
      console.error('Error fetching doctors:', error);
    }
  };

  const loadPatients = async (page = 1) => {
    try {
      const data = await getPatients(token, { search, page, doctorId, gender, limit: 10 });
      setPatientsData({
        patients: Array.isArray(data.patients) ? data.patients : [],
        totalPages: data.totalPages || 1,
        currentPage: data.currentPage || 1,
      });
    } catch (error) {
      console.error('Error fetching patients:', error);
      setPatientsData({ patients: [], totalPages: 1, currentPage: 1 });
    }
  };

  // Load doctors only once
  useEffect(() => {
    loadDoctors();
  }, []);

  // Load patients when tab is active or filters change
  useEffect(() => {
    if (isActive) {
      loadPatients();
    }
  }, [isActive]);

  const handleSearch = () => loadPatients(1);

  return (
    <div className="container mt-4">
      <h3>Patient List</h3>

      <div className="d-flex mb-3">
        <Form.Control
          type="text"
          placeholder="Search patient..."
          className="me-2"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <Form.Select className="me-2" value={doctorId} onChange={e => setDoctorId(e.target.value)}>
          <option value="">All Doctors</option>
          {doctors.map(d => (
            <option key={d.id} value={d.id}>{d.name}</option>
          ))}
        </Form.Select>
        <Form.Select className="me-2" value={gender} onChange={e => setGender(e.target.value)}>
          <option value="">All Genders</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </Form.Select>
        <Button onClick={handleSearch}>Filter</Button>
      </div>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>ID</th><th>Name</th><th>Age</th><th>Gender</th><th>Contact</th><th>Address</th><th>Assigned Doctor</th>
          </tr>
        </thead>
        <tbody>
          {(patientsData.patients || []).map(p => (
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

      <div className="d-flex justify-content-between mt-2">
        <Button
          disabled={patientsData.currentPage === 1}
          onClick={() => loadPatients(patientsData.currentPage - 1)}
        >
          Previous
        </Button>
        <div>
          Page {patientsData.currentPage} of {patientsData.totalPages}
        </div>
        <Button
          disabled={patientsData.currentPage === patientsData.totalPages}
          onClick={() => loadPatients(patientsData.currentPage + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default PatientList;
