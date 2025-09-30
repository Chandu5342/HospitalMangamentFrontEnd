import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext.jsx';
import { uploadLabReport } from '../../api/labApi.js';
import { Container, Card, Form, Button } from 'react-bootstrap';

const UploadLab = () => {
  const { token } = useContext(AuthContext);
  const [formData, setFormData] = useState({ patient_id: '', report_name: '', file: null });

  const handleFileChange = (e) => {
    setFormData({ ...formData, file: e.target.files[0] });
  };

  const handleUpload = async () => {
    if (!formData.patient_id || !formData.report_name || !formData.file) {
      return alert('All fields are required');
    }
    try {
      await uploadLabReport(token, formData);
      alert('Lab report uploaded successfully');
      setFormData({ patient_id: '', report_name: '', file: null });
    } catch (error) {
      alert('Failed to upload lab report');
    }
  };

  return (
    <Container className="mt-4">
      <Card className="p-4 shadow">
        <h3 className="mb-3 text-primary">Upload Lab Report</h3>
        <Form>
          <Form.Group className="mb-2">
            <Form.Label>Patient ID</Form.Label>
            <Form.Control
              value={formData.patient_id}
              onChange={(e) => setFormData({ ...formData, patient_id: e.target.value })}
            />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Report Name</Form.Label>
            <Form.Control
              value={formData.report_name}
              onChange={(e) => setFormData({ ...formData, report_name: e.target.value })}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Select File</Form.Label>
            <Form.Control type="file" onChange={handleFileChange} />
          </Form.Group>
          <Button onClick={handleUpload}>Upload</Button>
        </Form>
      </Card>
    </Container>
  );
};

export default UploadLab;
