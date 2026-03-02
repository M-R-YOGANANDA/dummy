import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Send cookies with requests
});

// Auth Services
export const authService = {
  login: (username, password) =>
    api.post('/auth/login', { username, password }),
  logout: () =>
    api.get('/auth/logout'),
  getCurrentUser: () =>
    api.get('/auth/current-user'),
};

// Admin Services
export const adminService = {
  getDashboardStats: () =>
    api.get('/admin/dashboard-stats'),
  getMaintenanceStatus: () =>
    api.get('/admin/get-maintenance'),
  setMaintenanceStatus: (enabled) =>
    api.post('/admin/set-maintenance', { enabled }),
  getReportOptions: () =>
    api.get('/admin/get-report-options'),
  downloadReport: (reportType, year, branch, semester) =>
    api.get(`/admin/download-report?type=${reportType}&year=${year}&branch=${branch}&semester=${semester}`, {
      responseType: 'blob',
    }),
  performBackup: () =>
    api.post('/admin/backup-data'),
  uploadBackup: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/admin/upload-backup', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

// HOD Services
export const hodService = {
  getDashboard: () =>
    api.get('/hod/dashboard'),
  getSubjects: () =>
    api.get('/hod/subjects'),
  getAllocationData: (params) =>
    api.get('/hod/allocation-data', { params }),
  updateAllocation: (data) =>
    api.post('/hod/update-allocation', data),
  getAttendanceData: (params) =>
    api.get('/hod/attendance-data', { params }),
  submitAttendance: (data) =>
    api.post('/hod/submit-attendance', data),
  getCIEData: (params) =>
    api.get('/hod/cie-data', { params }),
  submitCIE: (data) =>
    api.post('/hod/submit-cie', data),
};

// Staff Services
export const staffService = {
  getDashboard: () =>
    api.get('/staff/dashboard'),
  getAllocationStudents: (params) =>
    api.get('/staff/allocation-students', { params }),
  submitAttendance: (data) =>
    api.post('/staff/submit-attendance', data),
  submitCIEMarks: (data) =>
    api.post('/staff/submit-cie-marks', data),
  uploadBulkMarks: (file, semester, subject) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('semester', semester);
    formData.append('subject', subject);
    return api.post('/staff/upload-bulk-marks', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  getStudentReport: (params) =>
    api.get('/staff/student-report', { params }),
  generateReport: (data) =>
    api.post('/staff/generate-report', data, { responseType: 'blob' }),
};

export default api;
