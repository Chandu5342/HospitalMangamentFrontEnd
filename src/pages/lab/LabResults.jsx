import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext.jsx';
import { fetchLabResults } from '../../api/labApi.js';
import { Table, Container, Card, Form, Button } from 'react-bootstrap';

const LabResults = () => {
  const { token } = useContext(AuthContext);
  const [patientId, setPatientId] = useState('');
  const [results, setResults] = useState([]);

  const handleFetch = async () => {
    if (!patientId) return alert('Enter Patient ID');
    try {
      const data = await fetchLabResults(token, patientId);
      setResults(data);
    } catch (error) {
      alert('Failed to fetch lab results');
    }
  };

  return (
    <Container className="mt-4">
      <Card className="p-4 shadow mb-4">
        <h3 className="mb-3 text-primary">View Lab Results</h3>
        <Form className="d-flex">
          <Form.Control
            placeholder="Enter Patient ID"
            value={patientId}
            onChange={(e) => setPatientId(e.target.value)}
          />
          <Button className="ms-2" onClick={handleFetch}>Fetch</Button>
        </Form>
      </Card>

      {results.length > 0 && (
        <Card className="p-3 shadow">
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>ID</th>
                <th>Report Name</th>
                <th>Lab Staff</th>
                <th>Uploaded At</th>
                <th>File</th>
              </tr>
            </thead>
            <tbody>
              {results.map((r) => (
                <tr key={r.id}>
                  <td>{r.id}</td>
                  <td>{r.report_name}</td>
                  <td>{r.lab_staff_name}</td>
                  <td>{new Date(r.created_at).toLocaleString()}</td>
                  <td>
                    <a href={`http://localhost:5000/${r.file_path}`} target="_blank" rel="noreferrer">
                      View
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card>
      )}
    </Container>
  );
};

export default LabResults;
