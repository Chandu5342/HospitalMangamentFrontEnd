import axios from 'axios';


const BASE_URL = ('https://hospitalmangamentbackend.onrender.com' || 'http://localhost:5000') + '/api/admin';

export const addUser = async (token, userData) => {
  const res = await axios.post(`${BASE_URL}/users`, userData, { headers: { Authorization: `Bearer ${token}` } });
  return res.data;
};

export const listUsers = async (token, page=1, limit=10, search='', role='') => {
  const res = await axios.get(`${BASE_URL}/users`, {
    headers: { Authorization: `Bearer ${token}` },
    params: { page, limit, search, role }
  });
  return res.data;
};

export const deleteUser = async (token, userId) => {
  const res = await axios.delete(`${BASE_URL}/users/${userId}`, { headers: { Authorization: `Bearer ${token}` } });
  return res.data;
};

export const updateUser = async (token, userId, data) => {
  const res = await axios.put(`${BASE_URL}/users/${userId}`, data, { headers: { Authorization: `Bearer ${token}` } });
  return res.data;
};

export const fetchDashboardStats = async (token) => {
  const res = await axios.get(`${BASE_URL}/dashboard`, { headers: { Authorization: `Bearer ${token}` } });
  return res.data;
};
