import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Send cookies with requests for session persistence
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized - user not authenticated
      console.log('User not authenticated');
    }
    return Promise.reject(error);
  }
);

// Auth Services
export const authService = {
  login: (username, password) =>
    api.post('/api/login', { username, password }),
  logout: () =>
    api.post('/api/logout'),
  getCurrentUser: () =>
    api.get('/api/current-user'),
};

// Admin Services
export const adminService = {
  getDashboardStats: () =>
    api.get('/admin/api/dashboard-stats'),
  getMaintenanceStatus: () =>
    api.get('/admin/api/get-maintenance'),
  setMaintenanceStatus: (enabled) =>
    api.post('/admin/api/set-maintenance', { enabled }),
  getReportOptions: () =>
    api.get('/admin/api/get-report-options'),
  downloadReport: (reportType, year, branch, semester) =>
    api.get(`/admin/api/download-report?type=${reportType}&year=${year}&branch=${branch}&semester=${semester}`, {
      responseType: 'blob',
    }),
  performBackup: () =>
    api.post('/admin/api/backup-data'),
  uploadBackup: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/admin/api/upload-backup', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

// HOD Services
export const hodService = {
  getDashboard: () =>
    api.get('/hod/api/dashboard'),
  getSubjects: () =>
    api.get('/hod/api/subjects'),
  getAllocationData: (params) =>
    api.get('/hod/api/allocation-data', { params }),
  updateAllocation: (data) =>
    api.post('/hod/api/update-allocation', data),
  getAttendanceData: (params) =>
    api.get('/hod/api/attendance-data', { params }),
  submitAttendance: (data) =>
    api.post('/hod/api/submit-attendance', data),
  getCIEData: (params) =>
    api.get('/hod/api/cie-data', { params }),
  submitCIE: (data) =>
    api.post('/hod/api/submit-cie', data),
};

// Staff Services
export const staffService = {
  getDashboard: () =>
    api.get('/staff/api/dashboard'),
  getAllocationStudents: (params) =>
    api.get('/staff/api/allocation-students', { params }),
  submitAttendance: (data) =>
    api.post('/staff/api/submit-attendance', data),
  submitCIEMarks: (data) =>
    api.post('/staff/api/submit-cie-marks', data),
  uploadBulkMarks: (file, semester, subject) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('semester', semester);
    formData.append('subject', subject);
    return api.post('/staff/api/upload-bulk-marks', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  getStudentReport: (params) =>
    api.get('/staff/api/student-report', { params }),
  generateReport: (data) =>
    api.post('/staff/api/generate-report', data, { responseType: 'blob' }),
};

export default api;
