import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api/patients';

// Get patients with optional search
export const fetchPatients = async (token, search = '') => {
  const response = await axios.get(BASE_URL + (search ? `?search=${search}` : ''), {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Add a new patient
export const createPatient = async (token, data) => {
  const response = await axios.post(BASE_URL, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Assign doctor to patient
export const assignDoctor = async (token, data) => {
  const response = await axios.put(BASE_URL + '/assign', data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};
