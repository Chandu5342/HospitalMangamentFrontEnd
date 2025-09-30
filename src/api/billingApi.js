import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api/billings';

export const createBill = async (token, patientId, items, totalAmount) => {
  const res = await axios.post(
    `${BASE_URL}/${patientId}/bills`,
    { items, totalAmount },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
};

export const getBills = async (token, patientId) => {
  const res = await axios.get(`${BASE_URL}/${patientId}/bills`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const payBill = async (token, patientId, billId) => {
  const res = await axios.patch(`${BASE_URL}/${patientId}/bills/${billId}/pay`, {}, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};
