import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext.jsx';
import { fetchDashboardStats, listUsers } from '../../api/adminApi.js';
import { Container, Card, Row, Col, Button } from 'react-bootstrap';
import jsPDF from 'jspdf';

const DashboardStats = () => {
  const { token } = useContext(AuthContext);
  const [stats, setStats] = useState({
    totalPatients: 0,
    totalTreatments: 0,
    totalLabReports: 0,
  });
  const [users, setUsers] = useState([]);

  // Fetch hospital stats
  const getStats = async () => {
    try {
      const hospitalStats = await fetchDashboardStats(token);
      setStats(hospitalStats);

      // Fetch all users
      let page = 1;
      let allUsers = [];
      let totalPages = 1;

      do {
        const res = await listUsers(token, page, 50, '', '');
        allUsers = [...allUsers, ...res.data];
        totalPages = res.totalPages;
        page++;
      } while (page <= totalPages);

      setUsers(allUsers);
    } catch {
      alert('Failed to fetch stats');
    }
  };

  useEffect(() => { getStats(); }, []);

  // Generate PDF using jsPDF only
  const generatePDF = () => {
    const doc = new jsPDF();
    let y = 20;

    doc.setFontSize(20);
    doc.text('Hospital Report', 105, y, null, null, 'center');
    y += 15;

    doc.setFontSize(14);
    doc.text(`Total Patients: ${stats.totalPatients}`, 20, y);
    y += 10;
    doc.text(`Total Treatments: ${stats.totalTreatments}`, 20, y);
    y += 10;
    doc.text(`Total Lab Reports: ${stats.totalLabReports}`, 20, y);
    y += 15;

    // Table headers
    const headers = ["ID", "Name", "Email", "Role", "Created At"];
    const colWidth = [15, 40, 50, 25, 50]; // approximate widths
    let startX = 20;

    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    headers.forEach((h, i) => {
      doc.text(h, startX, y);
      startX += colWidth[i];
    });
    y += 7;
    doc.setFont(undefined, 'normal');

    // Table rows
    users.forEach(user => {
      startX = 20;
      const row = [
        user.id.toString(),
        user.name,
        user.email,
        user.role,
        new Date(user.created_at).toLocaleString()
      ];

      row.forEach((text, i) => {
        doc.text(text, startX, y);
        startX += colWidth[i];
      });

      y += 7;

      // Add page if y exceeds page height
      if (y > 280) {
        doc.addPage();
        y = 20;
      }
    });

    doc.save('hospital_report.pdf');
  };

  return (
    <Container className="mt-4">
      <h3 className="mb-3 text-primary">Hospital Dashboard</h3>
      <Row className="g-3">
        <Col md={4}><Card className="p-3 shadow text-center bg-light"><h5>Total Patients</h5><h2>{stats.totalPatients}</h2></Card></Col>
        <Col md={4}><Card className="p-3 shadow text-center bg-light"><h5>Total Treatments</h5><h2>{stats.totalTreatments}</h2></Card></Col>
        <Col md={4}><Card className="p-3 shadow text-center bg-light"><h5>Total Lab Reports</h5><h2>{stats.totalLabReports}</h2></Card></Col>
      </Row>
      <Button className="mt-3" onClick={generatePDF}>Generate PDF Report</Button>
    </Container>
  );
};

export default DashboardStats;
