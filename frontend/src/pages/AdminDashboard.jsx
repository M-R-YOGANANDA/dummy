import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import {
  Header,
  Sidebar,
  MainContent,
  PageHeader,
  Card,
  Button,
  DashboardGrid,
  DashboardCard,
  ToggleSwitch,
  Select,
  Alert,
} from '../components/Layout';
import { adminService } from '../services/api';

export function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('dashboard');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Dashboard stats
  const [stats, setStats] = useState({
    hodCount: 0,
    studentsCount: 0,
    staffCount: 0,
    branchCount: 0,
  });

  // System controls
  const [maintenanceEnabled, setMaintenanceEnabled] = useState(false);

  // Report downloads
  const [reportOptions, setReportOptions] = useState({
    years: [],
    branches: [],
    semesters: [],
  });
  const [reportFilters, setReportFilters] = useState({
    type: '',
    year: '',
    branch: '',
    semester: '',
  });

  // Backup
  const [backupStatus, setBackupStatus] = useState('idle');
  const [manualBackupFile, setManualBackupFile] = useState(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [statsRes, maintenanceRes, reportOptionsRes] = await Promise.all([
        adminService.getDashboardStats(),
        adminService.getMaintenanceStatus(),
        adminService.getReportOptions(),
      ]);

      setStats(statsRes.data);
      setMaintenanceEnabled(maintenanceRes.data.enabled);
      setReportOptions(reportOptionsRes.data);
    } catch (err) {
      console.error('Error loading dashboard:', err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleMaintenanceToggle = async () => {
    try {
      setLoading(true);
      await adminService.setMaintenanceStatus(!maintenanceEnabled);
      setMaintenanceEnabled(!maintenanceEnabled);
      setSuccess(`Maintenance mode ${!maintenanceEnabled ? 'enabled' : 'disabled'}`);
    } catch (err) {
      setError('Failed to update maintenance status');
    } finally {
      setLoading(false);
    }
  };

  const handleReportDownload = async () => {
    if (!reportFilters.type || !reportFilters.year || !reportFilters.branch || !reportFilters.semester) {
      setError('Please select all report filters');
      return;
    }

    try {
      setLoading(true);
      const blob = await adminService.downloadReport(
        reportFilters.type,
        reportFilters.year,
        reportFilters.branch,
        reportFilters.semester
      );

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `report-${Date.now()}.pdf`;
      a.click();
      setSuccess('Report downloaded successfully');
    } catch (err) {
      setError('Failed to download report');
    } finally {
      setLoading(false);
    }
  };

  const handleBackupData = async () => {
    try {
      setLoading(true);
      setBackupStatus('processing');
      const response = await adminService.performBackup();
      setBackupStatus('success');
      setSuccess('Backup completed successfully');
      setTimeout(() => setBackupStatus('idle'), 5000);
    } catch (err) {
      setBackupStatus('error');
      setError('Failed to perform backup');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setLoading(true);
      await adminService.uploadBackup(file);
      setSuccess('Backup restored successfully');
      setManualBackupFile(null);
    } catch (err) {
      setError('Failed to restore backup');
    } finally {
      setLoading(false);
    }
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'system-controls', label: 'System Controls', icon: '⚙️' },
    { id: 'report-downloads', label: 'Report Downloads', icon: '📥' },
    { id: 'backup-recovery', label: 'Data Backup & Recovery', icon: '💾' },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <Header userName={user?.name} userRole={user?.role} onLogout={handleLogout} />
      <Sidebar
        items={navItems}
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        extraContent={
          <Button variant="primary" size="sm" className="w-full mb-2 justify-center">
            <span>➕</span>
            <span>Create User</span>
          </Button>
        }
      />
      <MainContent>
        {error && <Alert type="error" message={error} onClose={() => setError(null)} />}
        {success && <Alert type="success" message={success} onClose={() => setSuccess(null)} />}

        {/* Dashboard Section */}
        {activeSection === 'dashboard' && (
          <div>
            <PageHeader title="Dashboard" subtitle="System Overview & Quick Stats" />
            <DashboardGrid>
              <DashboardCard label="Total HODs" value={stats.hodCount} icon="👨‍💼" subtext="Head of departments" />
              <DashboardCard label="Students" value={stats.studentsCount} icon="👨‍🎓" subtext="Total enrolled" />
              <DashboardCard label="Teaching Staff" value={stats.staffCount} icon="👨‍🏫" subtext="Faculty members" />
              <DashboardCard label="Branches" value={stats.branchCount} icon="🏢" subtext="Departments" />
            </DashboardGrid>
          </div>
        )}

        {/* System Controls Section */}
        {activeSection === 'system-controls' && (
          <div>
            <PageHeader title="System Controls" subtitle="Enable or disable major system modules" />
            <Card>
              <ToggleSwitch
                enabled={maintenanceEnabled}
                onChange={handleMaintenanceToggle}
                label="Maintenance Mode"
                description="Enable or disable system-wide maintenance. Only admin can log in during maintenance."
              />
            </Card>
            {maintenanceEnabled && (
              <Alert type="warning" title="⚠️ Warning" message="System is under maintenance. User actions are restricted." />
            )}
          </div>
        )}

        {/* Report Downloads Section */}
        {activeSection === 'report-downloads' && (
          <div>
            <PageHeader title="Report Downloads" subtitle="Generate and download academic reports" />
            <Card>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <Select
                  label="Report Type"
                  options={[
                    { value: '', label: 'Select Report Type' },
                    { value: 'attendance', label: 'Attendance Report' },
                    { value: 'cie', label: 'CIE Marks Report' },
                  ]}
                  value={reportFilters.type}
                  onChange={(e) => setReportFilters({ ...reportFilters, type: e.target.value })}
                />
                <Select
                  label="Academic Year"
                  options={[
                    { value: '', label: 'Select Year' },
                    ...reportOptions.years.map((y) => ({ value: y, label: y })),
                  ]}
                  value={reportFilters.year}
                  onChange={(e) => setReportFilters({ ...reportFilters, year: e.target.value })}
                />
                <Select
                  label="Branch"
                  options={[
                    { value: '', label: 'Select Branch' },
                    ...reportOptions.branches.map((b) => ({ value: b, label: b })),
                  ]}
                  value={reportFilters.branch}
                  onChange={(e) => setReportFilters({ ...reportFilters, branch: e.target.value })}
                />
                <Select
                  label="Semester"
                  options={[
                    { value: '', label: 'Select Semester' },
                    ...reportOptions.semesters.map((s) => ({ value: s, label: `Semester ${s}` })),
                  ]}
                  value={reportFilters.semester}
                  onChange={(e) => setReportFilters({ ...reportFilters, semester: e.target.value })}
                />
              </div>
              <Button onClick={handleReportDownload} disabled={loading}>
                <span>📥</span>
                <span>Download Report</span>
              </Button>
            </Card>
          </div>
        )}

        {/* Backup & Recovery Section */}
        {activeSection === 'backup-recovery' && (
          <div>
            <PageHeader title="Data Backup & Recovery" subtitle="Manage system backups and data restoration" />

            {/* Manual Backup */}
            <Card className="mb-6">
              <h3 className="text-lg font-semibold text-primary-900 mb-4">Manual Backup</h3>
              <Button
                onClick={handleBackupData}
                disabled={loading || backupStatus === 'processing'}
                variant={backupStatus === 'success' ? 'secondary' : 'primary'}
              >
                <span>💾</span>
                <span>{backupStatus === 'processing' ? 'Backing up...' : 'Perform Backup'}</span>
              </Button>
              {backupStatus === 'success' && (
                <Alert type="success" message="✅ Backup completed successfully" className="mt-4" />
              )}
            </Card>

            {/* File Upload */}
            <Card>
              <h3 className="text-lg font-semibold text-primary-900 mb-4">Restore from Backup</h3>
              <div className="mb-4">
                <label className="block mb-2 text-sm font-medium text-slate-700">Select Backup File</label>
                <input
                  type="file"
                  onChange={handleFileUpload}
                  accept=".zip,.tar,.gz"
                  disabled={loading}
                  className="block w-full text-sm text-slate-500 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-success file:text-white hover:file:bg-emerald-600"
                />
              </div>
            </Card>
          </div>
        )}
      </MainContent>
    </div>
  );
}
