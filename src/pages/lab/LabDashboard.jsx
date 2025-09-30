import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext.jsx';
import { uploadLabReport, fetchLabResults } from '../../api/labApi.js';
import { Container, Card, Form, Button, Table } from 'react-bootstrap';

const LabDashboard = () => {
  const { token } = useContext(AuthContext);

  // Upload Lab State
  const [uploadData, setUploadData] = useState({ patient_id: '', report_name: '', file: null });

  // Lab Results State
  const [patientId, setPatientId] = useState('');
  const [results, setResults] = useState([]);

  // Handle file select
  const handleFileChange = (e) => setUploadData({ ...uploadData, file: e.target.files[0] });

  // Upload Lab Report
  const handleUpload = async () => {
    if (!uploadData.patient_id || !uploadData.report_name || !uploadData.file) {
      return alert('All fields are required');
    }
    try {
      await uploadLabReport(token, uploadData);
      alert('Lab report uploaded successfully');
      setUploadData({ patient_id: '', report_name: '', file: null });
    } catch (error) {
      alert('Failed to upload lab report');
    }
  };

  // Fetch Lab Results
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
      {/* Upload Lab Report */}
      <Card className="p-4 shadow mb-4">
        <h3 className="mb-3 text-primary">Upload Lab Report</h3>
        <Form>
          <Form.Group className="mb-2">
            <Form.Label>Patient ID</Form.Label>
            <Form.Control
              value={uploadData.patient_id}
              onChange={(e) => setUploadData({ ...uploadData, patient_id: e.target.value })}
            />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Report Name</Form.Label>
            <Form.Control
              value={uploadData.report_name}
              onChange={(e) => setUploadData({ ...uploadData, report_name: e.target.value })}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Select File</Form.Label>
            <Form.Control type="file" onChange={handleFileChange} />
          </Form.Group>
          <Button onClick={handleUpload}>Upload</Button>
        </Form>
      </Card>

      {/* View Lab Results */}
      <Card className="p-4 shadow mb-4">
        <h3 className="mb-3 text-primary">View Lab Results</h3>
        <Form className="d-flex mb-3">
          <Form.Control
            placeholder="Enter Patient ID"
            value={patientId}
            onChange={(e) => setPatientId(e.target.value)}
          />
          <Button className="ms-2" onClick={handleFetch}>Fetch</Button>
        </Form>
        {results.length > 0 && (
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
                    <a href={`http://localhost:5000${r.file_path}`} target="_blank" rel="noreferrer">View</a>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card>
    </Container>
  );
};

export default LabDashboard;
