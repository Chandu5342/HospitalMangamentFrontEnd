import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/doctor';

// Get all patients assigned to doctor
export const fetchDoctorPatients = async (token, search = '') => {
  const response = await axios.get(`${BASE_URL}/patients`, {
    params: { search },
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Add treatment record
export const addTreatmentRecord = async (token, { patient_id, diagnosis, prescription }) => {
  const response = await axios.post(
    `${BASE_URL}/treatment`,
    { patient_id, diagnosis, prescription },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};

// Fetch patient history by patientId
export const fetchPatientHistory = async (token, patientId) => {
  const response = await axios.get(`${BASE_URL}/history/${patientId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};
