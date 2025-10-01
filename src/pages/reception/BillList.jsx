import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext.jsx';
import { getBills, payBill } from '../../api/billingApi.js';
import { Table, Button } from 'react-bootstrap';
import jsPDF from 'jspdf';

const BillList = ({ patientId, reloadFlag }) => {
  const { token } = useContext(AuthContext);
  const [bills, setBills] = useState([]);

  const loadBills = async () => {
    const data = await getBills(token, patientId);
    setBills(data);
  };

  useEffect(() => {
    if (patientId) loadBills();
  }, [patientId, reloadFlag]); // <-- reloadFlag triggers refresh

  const handlePay = async (billId) => {
    await payBill(token, patientId, billId);
    loadBills();
  };

  const handleDownloadPDF = (bill) => {
    const doc = new jsPDF();

    doc.setFontSize(20);
    doc.text(' My Hospital', 14, 20);
    doc.setFontSize(12);
    doc.text('123 Health St, Wellness City', 14, 28);
    doc.text('Phone: (123) 456-7890', 14, 34);
    doc.text('Email: info@myhospital.com', 14, 40);

    doc.setLineWidth(0.5);
    doc.line(14, 45, 196, 45);

    doc.setFontSize(14);
    doc.text('Invoice', 14, 52);

    const today = new Date();
    doc.setFontSize(12);
    doc.text(`Bill ID: ${bill.id}`, 14, 60);
    doc.text(`Patient ID: ${patientId}`, 14, 68);
    doc.text(`Status: ${bill.status}`, 14, 76);
    doc.text(`Date: ${today.toLocaleDateString()}`, 14, 84);

    const startY = 92;
    const colX = [14, 90, 160];
    const rowHeight = 8;

    doc.setFont(undefined, 'bold');
    doc.text('#', colX[0], startY);
    doc.text('Description', colX[1], startY);
    doc.text('Amount', colX[2], startY);
    doc.setFont(undefined, 'normal');

    const items = typeof bill.items === 'string' ? JSON.parse(bill.items) : bill.items;
    let currentY = startY + rowHeight;

    items.forEach((item, idx) => {
      doc.text(`${idx + 1}`, colX[0], currentY);
      doc.text(item.description, colX[1], currentY);
      doc.text(`$${item.amount}`, colX[2], currentY);
      currentY += rowHeight;
    });

    doc.setFont(undefined, 'bold');
    doc.text(`Total: $${bill.total_amount}`, colX[1], currentY + 4);

    doc.save(`Bill_${bill.id}.pdf`);
  };

  return (
    <div className="mt-3">
      <h3>Patient Bills</h3>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Items</th>
            <th>Total</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {bills.map(b => (
            <tr key={b.id}>
              <td>{b.id}</td>
              <td>
                <ul className="mb-0">
                  {(typeof b.items === 'string' ? JSON.parse(b.items) : b.items).map((item, idx) => (
                    <li key={idx}>
                      {item.description} - ${item.amount || 0}
                    </li>
                  ))}
                </ul>
              </td>
              <td>{b.total_amount}</td>
              <td>{b.status}</td>
              <td>
                {b.status === 'unpaid' && <Button size="sm" onClick={() => handlePay(b.id)}>Pay</Button>}{' '}
                <Button size="sm" variant="success" onClick={() => handleDownloadPDF(b)}>Download PDF</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default BillList;
