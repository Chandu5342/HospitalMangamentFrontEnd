import axios from 'axios';

const BASE_URL = 'https://hospitalmangamentbackend.onrender.com/api/patients';
//const BASE_URL = 'http://localhost:5000/api/patients';



export const getPatients = async (token, filters = {}) => {
  const res = await axios.get(BASE_URL, {
    headers: { Authorization: `Bearer ${token}` },
    params: filters, // Axios serializes object to query string
  });
  console.log(res);
  return res.data;
};

export const addPatient = async (token, data) => {
  const res = await axios.post(BASE_URL, data, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const assignDoctor = async (token, data) => {
  const res = await axios.put(`${BASE_URL}/assign`, data, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

// fetch all doctors (filter from admin users)
export const fetchDoctors = async (token) => {
  try {
    const res = await axios.get('http://localhost:5000/api/admin/users', {
      headers: { Authorization: `Bearer ${token}` },
      params: { role: 'doctor', limit: 100 } // optional, if your backend supports it
    });

   

    // Extract the array from the paginated response
    const users = Array.isArray(res.data.data) ? res.data.data : [];

    // Filter only doctors (just in case)
    const doctors = users.filter(u => u.role === 'doctor');

    return doctors;

  } catch (error) {
    console.error('Error fetching doctors:', error.response?.data || error.message);
    return [];
  }
};
