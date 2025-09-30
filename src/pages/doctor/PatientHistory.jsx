import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext.jsx';
import { fetchPatientHistory } from '../../api/doctorApi.js';
import { Table, Container, Card } from 'react-bootstrap';

const PatientHistory = () => {
  const { token } = useContext(AuthContext);
  const { patientId } = useParams();
  const [history, setHistory] = useState([]);

  const loadHistory = async () => {
    try {
      const data = await fetchPatientHistory(token, patientId);
      setHistory(data);
    } catch (error) {
      alert('Failed to load patient history');
    }
  };

  useEffect(() => {
    loadHistory();
  }, [patientId]);

  return (
    <Container className="mt-4">
      <h2 className="mb-4 text-success">Patient History</h2>
      <Card className="p-3 shadow">
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>ID</th>
              <th>Doctor</th>
              <th>Diagnosis</th>
              <th>Prescription</th>
              <th>Treatment Date</th>
            </tr>
          </thead>
          <tbody>
            {history.map((t) => (
              <tr key={t.id}>
                <td>{t.id}</td>
                <td>{t.doctor_name}</td>
                <td>{t.diagnosis}</td>
                <td>{t.prescription || '-'}</td>
                <td>{new Date(t.treatment_date).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card>
    </Container>
  );
};

export default PatientHistory;
