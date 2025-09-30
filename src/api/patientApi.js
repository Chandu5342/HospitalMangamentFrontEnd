import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api/patients';

export const getPatients = async (token, search = '') => {
  const res = await axios.get(`${BASE_URL}?search=${search}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const addPatient = async (token, data) => {
  const res = await axios.post(BASE_URL, data, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const assignDoctor = async (token, data) => {
  const res = await axios.put(`${BASE_URL}/assign`, data, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

// fetch all doctors (filter from admin users)
export const fetchDoctors = async (token) => {
  const res = await axios.get(`http://localhost:5000/api/admin/users`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data.filter(user => user.role === 'doctor');
};
