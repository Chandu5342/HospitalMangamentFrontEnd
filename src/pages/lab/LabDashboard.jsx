import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext.jsx';
import { uploadLabReport, fetchLabResults } from '../../api/labApi.js';
import { getPatients } from '../../api/patientApi.js';
import { Container, Card, Form, Button, Table, Nav, Tab } from 'react-bootstrap';
import axios from 'axios';

const LabDashboard = () => {
  const { token } = useContext(AuthContext);

  // Upload state
  const [uploadData, setUploadData] = useState({ patient_id: '', report_name: '', file: null });

  // Lab results state
  const [patientId, setPatientId] = useState('');
  const [results, setResults] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Patients dropdown
  const [patients, setPatients] = useState([]);

  // Load patients
  useEffect(() => {
    const loadPatients = async () => {
      try {
        const data = await getPatients(token);
        setPatients(Array.isArray(data.patients) ? data.patients : []);
      } catch (err) {
        alert('Failed to load patients');
        setPatients([]);
      }
    };
    loadPatients();
  }, [token]);

  // Handle file selection
  const handleFileChange = (e) => setUploadData({ ...uploadData, file: e.target.files[0] });

  // Upload lab report
  const handleUpload = async () => {
    if (!uploadData.patient_id || !uploadData.report_name || !uploadData.file) {
      return alert('All fields are required');
    }
    try {
      await uploadLabReport(token, uploadData);
      alert('Lab report uploaded successfully');
      setUploadData({ patient_id: '', report_name: '', file: null });
      if (uploadData.patient_id === patientId) loadResults(1);
    } catch (err) {
      alert('Upload failed');
      console.error(err);
    }
  };

  // Fetch lab results
  const loadResults = async (pageNumber = 1) => {
    if (!patientId) return alert('Select a patient first');
    try {
      const data = await fetchLabResults(token, patientId, pageNumber, 2);
      setResults(Array.isArray(data.data) ? data.data : []);
      setPage(data.currentPage || 1);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      alert('Failed to fetch results');
      console.error(err);
      setResults([]);
    }
  };

  // Secure download
  const handleDownload = async (id, report_name, file_path) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/lab/download/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', report_name + file_path.slice(file_path.lastIndexOf('.')));
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert('Download failed');
      console.error(err);
    }
  };

  return (
    <Container className="mt-4">
      <Tab.Container defaultActiveKey="upload">
        <Nav variant="tabs">
          <Nav.Item>
            <Nav.Link eventKey="upload">Upload Lab Report</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="view">View Lab Results</Nav.Link>
          </Nav.Item>
        </Nav>

        <Tab.Content className="mt-4">
          {/* Upload Tab */}
          <Tab.Pane eventKey="upload">
            <Card className="p-4 shadow mb-4">
              <Form>
                <Form.Group className="mb-2">
                  <Form.Label>Select Patient</Form.Label>
                  <Form.Select
                    value={uploadData.patient_id}
                    onChange={(e) => setUploadData({ ...uploadData, patient_id: e.target.value })}
                  >
                    <option value="">-- Select Patient --</option>
                    {patients.map((p) => (
                      <option key={p.id} value={p.id}>{p.name} (ID: {p.id})</option>
                    ))}
                  </Form.Select>
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
          </Tab.Pane>

          {/* View Tab */}
          <Tab.Pane eventKey="view">
            <Card className="p-4 shadow mb-4">
              <Form className="d-flex mb-3">
                <Form.Select value={patientId} onChange={(e) => setPatientId(e.target.value)}>
                  <option value="">-- Select Patient --</option>
                  {patients.map((p) => (
                    <option key={p.id} value={p.id}>{p.name} (ID: {p.id})</option>
                  ))}
                </Form.Select>
                <Button className="ms-2" onClick={() => loadResults(1)}>Fetch</Button>
              </Form>

              {results.length > 0 && (
                <>
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
                            <Button
                              variant="link"
                              onClick={() => handleDownload(r.id, r.report_name, r.file_path)}
                            >
                              Download
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>

                  {totalPages > 1 && (
                    <div className="d-flex justify-content-between">
                      <Button disabled={page === 1} onClick={() => loadResults(page - 1)}>Previous</Button>
                      <span>Page {page} of {totalPages}</span>
                      <Button disabled={page === totalPages} onClick={() => loadResults(page + 1)}>Next</Button>
                    </div>
                  )}
                </>
              )}
            </Card>
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>
    </Container>
  );
};

export default LabDashboard;
