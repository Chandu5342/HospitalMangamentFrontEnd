import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext.jsx';
import { createBill } from '../../api/billingApi.js';
import { Form, Button, Card } from 'react-bootstrap';

const AddBill = ({ patientId, onBillAdded }) => {
  const { token } = useContext(AuthContext);
  const [items, setItems] = useState([{ description: '', amount: '' }]);
  const [total, setTotal] = useState(0);

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
    setTotal(newItems.reduce((sum, i) => sum + (parseFloat(i.amount) || 0), 0));
  };

  const addNewItem = () => setItems([...items, { description: '', amount: '' }]);

  const handleSubmit = async () => {
    try {
      await createBill(token, patientId, items, total);
      setItems([{ description: '', amount: '' }]);
      setTotal(0);
      if (onBillAdded) onBillAdded(); // Trigger parent to reload bills
    } catch (err) {
      console.error('Failed to create bill', err);
    }
  };

  return (
    <Card className="p-3 mt-4">
      <h3>Create Bill</h3>
      {items.map((item, idx) => (
        <div key={idx} className="d-flex mb-2">
          <Form.Control
            placeholder="Description"
            value={item.description}
            onChange={e => handleItemChange(idx, 'description', e.target.value)}
            className="me-2"
          />
          <Form.Control
            type="number"
            placeholder="Amount"
            value={item.amount}
            onChange={e => handleItemChange(idx, 'amount', e.target.value)}
          />
        </div>
      ))}
      <Button variant="secondary" onClick={addNewItem} className="me-2">Add Item</Button>
      <Button onClick={handleSubmit}>Save Bill</Button>
      <div className="mt-2">Total: {total.toFixed(2)}</div>
    </Card>
  );
};

export default AddBill;
