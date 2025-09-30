import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/lab';

// Upload lab report
export const uploadLabReport = async (token, { patient_id, report_name, file }) => {
  const formData = new FormData();
  formData.append('patient_id', patient_id);
  formData.append('report_name', report_name);
  formData.append('file', file);

  const response = await axios.post(`${BASE_URL}/upload`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data;
};

// Fetch lab results by patient
export const fetchLabResults = async (token, patientId) => {
  const response = await axios.get(`${BASE_URL}/${patientId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};
