import axios from 'axios';

const BASE_URL = ('https://hospitalmangamentbackend.onrender.com' || 'http://localhost:5000') + '/api/auth';

export const loginUser = async (data) => {
  console.log(BASE_URL)
  const response = await axios.post(`${BASE_URL}/login`, data);
  return response.data;
};

export const registerUser = async (data) => {
  const response = await axios.post(`${BASE_URL}/register`, data);
  return response.data;
};
