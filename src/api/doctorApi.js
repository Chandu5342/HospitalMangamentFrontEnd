import axios from 'axios';

const BASE_URL = 'https://hospitalmangamentbackend.onrender.com/api/doctor';
//const BASE_URL = 'http://localhost:5000/api/doctor';


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
export const fetchPatientHistory = async (token, patientId, page = null, limit = null) => {
  const params = {};
  if (page && limit) {
    params.page = page;
    params.limit = limit;
  }
  const response = await axios.get(`${BASE_URL}/history/${patientId}`, {
    headers: { Authorization: `Bearer ${token}` },
    params
  });
  return response.data;
};

export const fetchDoctors = async (token) => {
  const res = await axios.get(`http://localhost:5000/api/admin/users`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  // filter only doctors
  return res.data.filter(user => user.role === 'doctor');
};

export const fetchLabResults = async (token, patientId) => {
  const response = await axios.get(`${BASE_URL}/lab-results/${patientId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

const downloadLabResult = async (lr) => {
  try {
    const response = await axios.get(lr.file_path, {
      headers: { Authorization: `Bearer ${token}` },
      responseType: 'blob', // important for binary files
    });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', lr.report_name); // filename
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (error) {
    alert('Failed to download lab result');
  }
};