import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext.jsx';
import { fetchPatientHistory, fetchLabResults } from '../../api/doctorApi.js';
import { Table, Container, Card, Button } from 'react-bootstrap';
import jsPDF from 'jspdf';
import axios from 'axios';

const PatientHistory = () => {
  const { token } = useContext(AuthContext);
  const { patientId } = useParams();
  const [history, setHistory] = useState([]);
  const [labResults, setLabResults] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 5; // records per page

  // Load treatment history with optional pagination
  const loadHistory = async (pageNumber = 1) => {
    try {
      const data = await fetchPatientHistory(token, patientId, pageNumber, limit);
      if (data.data) {
        setHistory(data.data);
        setTotalPages(data.totalPages);
      } else {
        setHistory(data);
        setTotalPages(1);
      }
      setPage(pageNumber);
    } catch (error) {
      alert('Failed to load patient history');
    }
  };

  // Load lab results
  const loadLabResults = async () => {
    try {
      const results = await fetchLabResults(token, patientId);
      setLabResults(results);
    } catch (error) {
      alert('Failed to load lab results');
    }
  };

  useEffect(() => {
    loadHistory();
    loadLabResults();
  }, [patientId]);

  // Download individual treatment record as PDF
  const downloadTreatmentPDF = (treatment) => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('Treatment Record', 20, 20);
    doc.setFontSize(12);
    doc.text(`ID: ${treatment.id}`, 20, 40);
    doc.text(`Doctor: ${treatment.doctor_name}`, 20, 50);
    doc.text(`Diagnosis: ${treatment.diagnosis}`, 20, 60);
    doc.text(`Prescription: ${treatment.prescription || '-'}`, 20, 70);
    doc.text(`Treatment Date: ${new Date(treatment.treatment_date).toLocaleString()}`, 20, 80);
    doc.save(`treatment_${treatment.id}.pdf`);
  };

  // Download individual lab result via Axios (with token)
  const downloadLabResult = async (lr) => {
    try {
      const response = await axios.get(lr.file_path, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob', // important for binary files
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', lr.report_name);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      alert('Failed to download lab result');
    }
  };

  // Download all lab results as a single PDF
  const downloadLabResultsPDF = () => {
    if (!labResults.length) return alert('No lab results to download');

    const doc = new jsPDF();
    labResults.forEach((lr, index) => {
      if (index > 0) doc.addPage(); // new page for each report
      doc.setFontSize(16);
      doc.text(`Lab Report: ${lr.report_name}`, 20, 20);
      doc.setFontSize(12);
      doc.text(`Uploaded by: ${lr.lab_staff}`, 20, 40);
      doc.text(`Date: ${new Date(lr.created_at).toLocaleString()}`, 20, 50);
      doc.text(`File: ${lr.file_path}`, 20, 60);
    });
    doc.save(`lab_results_patient_${patientId}.pdf`);
  };

  return (
    <Container className="mt-4">
      <h2 className="mb-4 text-success">Patient History</h2>

      {/* Lab Results */}
      <Card className="p-3 mb-3 shadow">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <h4>Lab Results</h4>
          <Button 
            size="sm" 
            variant="success" 
            onClick={downloadLabResultsPDF}
            disabled={labResults.length === 0}
          >
            Download All Lab Results PDF
          </Button>
        </div>
        <ul>
          {labResults.length === 0 && <li>No lab results</li>}
          {labResults.map(lr => (
            <li key={lr.id} className="mb-2">
              {lr.report_name} (uploaded by {lr.lab_staff})
              <Button
                size="sm"
                variant="info"
                className="ms-2"
                onClick={() => downloadLabResult(lr)}
              >
                View / Download
              </Button>
            </li>
          ))}
        </ul>
      </Card>

      {/* Treatment History */}
      <Card className="p-3 shadow mb-3">
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>ID</th>
              <th>Doctor</th>
              <th>Diagnosis</th>
              <th>Prescription</th>
              <th>Treatment Date</th>
              <th>PDF</th>
            </tr>
          </thead>
          <tbody>
            {history.map(t => (
              <tr key={t.id}>
                <td>{t.id}</td>
                <td>{t.doctor_name}</td>
                <td>{t.diagnosis}</td>
                <td>{t.prescription || '-'}</td>
                <td>{new Date(t.treatment_date).toLocaleString()}</td>
                <td>
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() => downloadTreatmentPDF(t)}
                  >
                    Download PDF
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="d-flex justify-content-between mt-2">
            <Button disabled={page === 1} onClick={() => loadHistory(page - 1)}>
              Previous
            </Button>
            <span>Page {page} of {totalPages}</span>
            <Button disabled={page === totalPages} onClick={() => loadHistory(page + 1)}>
              Next
            </Button>
          </div>
        )}
      </Card>
    </Container>
  );
};

export default PatientHistory;
