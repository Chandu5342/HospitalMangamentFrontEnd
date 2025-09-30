import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom'; // no Router here
import Login from './pages/auth/Login.jsx';
import Register from './pages/auth/Register.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import NavbarLayout from './components/NavbarLayout.jsx';

import AddTreatment from "./pages/doctor/AddTreatment.jsx";
import PatientHistory from "./pages/doctor/PatientHistory.jsx";
import ReceptionDashboard from './pages/reception/ReceptionDashboard.jsx';
import DoctorDashboard from './pages/doctor/DoctorDashboard.jsx';
import LabDashboard from './pages/lab/LabDashboard.jsx';
import AdminDashboard from './pages/admin/DashboardStats.jsx';

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected Routes */}
      <Route
        path="/reception/*"
        element={
          <ProtectedRoute role="reception">
            <NavbarLayout>
              <ReceptionDashboard />
            </NavbarLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/doctor/*"
        element={
          <ProtectedRoute role="doctor">
            <NavbarLayout>
              <DoctorDashboard />
            </NavbarLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/lab/*"
        element={
          <ProtectedRoute role="lab">
            <NavbarLayout>
              <LabDashboard />
            </NavbarLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/*"
        element={
          <ProtectedRoute role="admin">
            <NavbarLayout>
              <AdminDashboard />
            </NavbarLayout>
          </ProtectedRoute>
        }
      />
       {/* Doctor routes */}
        <Route
          path="/doctor/dashboard"
          element={
            <ProtectedRoute role="doctor">
              <DoctorDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/doctor/add-treatment"
          element={
            <ProtectedRoute role="doctor">
              <AddTreatment />
            </ProtectedRoute>
          }
        />
        <Route
          path="/doctor/history/:patientId"
          element={
            <ProtectedRoute role="doctor">
              <PatientHistory />
            </ProtectedRoute>
          }
        />
      {/* Fallback */}
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}

export default App;
