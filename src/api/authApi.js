import axios from 'axios';

const BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/auth';

export const loginUser = async (data) => {
  console.log(BASE_URL)
  const response = await axios.post(`${BASE_URL}/login`, data);
  return response.data;
};

export const registerUser = async (data) => {
  const response = await axios.post(`${BASE_URL}/register`, data);
  return response.data;
};
