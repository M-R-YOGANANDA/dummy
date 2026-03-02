import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { LoginPage } from './pages/LoginPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { HODDashboard } from './pages/HODDashboard';
import { StaffDashboard } from './pages/StaffDashboard';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />

          {/* Admin Routes */}
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute requiredRole="admin">
                <Routes>
                  <Route path="dashboard" element={<AdminDashboard />} />
                  <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
                </Routes>
              </ProtectedRoute>
            }
          />

          {/* HOD Routes */}
          <Route
            path="/hod/*"
            element={
              <ProtectedRoute requiredRole="hod">
                <Routes>
                  <Route path="dashboard" element={<HODDashboard />} />
                  <Route path="*" element={<Navigate to="/hod/dashboard" replace />} />
                </Routes>
              </ProtectedRoute>
            }
          />

          {/* Staff Routes */}
          <Route
            path="/staff/*"
            element={
              <ProtectedRoute requiredRole="staff">
                <Routes>
                  <Route path="dashboard" element={<StaffDashboard />} />
                  <Route path="*" element={<Navigate to="/staff/dashboard" replace />} />
                </Routes>
              </ProtectedRoute>
            }
          />

          {/* Fallback Routes */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
