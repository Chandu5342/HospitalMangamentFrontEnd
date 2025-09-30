import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/admin';

// Add new user
export const addUser = async (token, userData) => {
  const response = await axios.post(`${BASE_URL}/users`, userData, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

// List all users
export const listUsers = async (token) => {
  const response = await axios.get(`${BASE_URL}/users`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

// Delete user
export const deleteUser = async (token, userId) => {
  const response = await axios.delete(`${BASE_URL}/users/${userId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

// Dashboard stats
export const fetchDashboardStats = async (token) => {
  const response = await axios.get(`${BASE_URL}/dashboard`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};
