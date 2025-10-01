// src/api/adminApi.js
import axios from 'axios';
const BASE_URL = 'https://hospitalmangamentbackend.onrender.com/api/admin';
//const BASE_URL = 'http://localhost:5000/api/admin';

// ----------------- USERS -----------------

// List users with pagination, search, role filter
export const listUsers = async (token, page = 1, limit = 10, search = '', role = '') => {
  const res = await axios.get(`${BASE_URL}/users`, {
    headers: { Authorization: `Bearer ${token}` },
    params: { page, limit, search, role },
  });
  return res.data;
};

// Add a new user
export const addUser = async (token, { name, email, password, role }) => {
  const res = await axios.post(
    `${BASE_URL}/users`,
    { name, email, password, role },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
};

// Update a user
export const updateUser = async (token, userId, { name, email, role, password }) => {
  const res = await axios.put(
    `${BASE_URL}/users/${userId}`,
    { name, email, role, password },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
};

// Delete a user
export const deleteUser = async (token, userId) => {
  const res = await axios.delete(`${BASE_URL}/users/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// ----------------- DASHBOARD -----------------

// Fetch hospital dashboard stats
export const fetchDashboardStats = async (token) => {
  const res = await axios.get(`${BASE_URL}/dashboard`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// ----------------- DOCTORS -----------------

// Fetch all doctors
export const fetchDoctors = async (token) => {
  try {
    const res = await axios.get(`${BASE_URL}/users`, {
      headers: { Authorization: `Bearer ${token}` },
      params: { role: 'doctor', limit: 100 },
    });

    const users = res.data.data || [];
    const doctors = users.filter(u => u.role === 'doctor');
    return doctors;
  } catch (error) {
    console.error('Error fetching doctors:', error.response?.data || error.message);
    return [];
  }
};
