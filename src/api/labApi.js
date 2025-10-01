import axios from 'axios';

const BASE_URL = ('https://hospitalmangamentbackend.onrender.com' || 'http://localhost:5000') + '/api/lab';

export const uploadLabReport = async (token, { patient_id, report_name, file }) => {
  const formData = new FormData();
  formData.append('patient_id', patient_id);
  formData.append('report_name', report_name);
  formData.append('file', file);

  const res = await axios.post(`${BASE_URL}/upload`, formData, {
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
  });
  return res.data;
};

// Fetch lab results with pagination
export const fetchLabResults = async (token, patientId, page=1, limit=10) => {
  const res = await axios.get(`${BASE_URL}/${patientId}`, {
    headers: { Authorization: `Bearer ${token}` },
    params: { page, limit }
  });
  return res.data;
};
