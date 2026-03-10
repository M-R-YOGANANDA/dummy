import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import {
  Header, Sidebar, MainContent, PageHeader, Card,
  Button, DashboardGrid, DashboardCard, ToggleSwitch, Select, Alert,
} from '../components/Layout';
import { adminService } from '../services/api';

export function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('dashboard');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const [stats, setStats] = useState({ hodCount: 0, studentsCount: 0, staffCount: 0, branchCount: 0 });
  const [maintenanceEnabled, setMaintenanceEnabled] = useState(false);
  const [reportOptions, setReportOptions] = useState({ years: [], branches: [], semesters: [] });
  const [reportFilters, setReportFilters] = useState({ type: '', year: '', branch: '', semester: '' });
  const [backupStatus, setBackupStatus] = useState('idle');

  useEffect(() => { loadDashboardData(); }, []);

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
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => { await logout(); navigate('/login'); };

  const handleMaintenanceToggle = async () => {
    try {
      setLoading(true);
      await adminService.setMaintenanceStatus(!maintenanceEnabled);
      setMaintenanceEnabled(!maintenanceEnabled);
      setSuccess(`Maintenance mode ${!maintenanceEnabled ? 'enabled' : 'disabled'}`);
    } catch (err) { setError('Failed to update maintenance status'); } finally { setLoading(false); }
  };

  const handleReportDownload = async () => {
    if (!reportFilters.type || !reportFilters.year || !reportFilters.branch || !reportFilters.semester) {
      setError('Please select all report filters'); return;
    }
    try {
      setLoading(true);
      const blob = await adminService.downloadReport(reportFilters.type, reportFilters.year, reportFilters.branch, reportFilters.semester);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = `report-${Date.now()}.pdf`; a.click();
      setSuccess('Report downloaded successfully');
    } catch (err) { setError('Failed to download report'); } finally { setLoading(false); }
  };

  const handleBackupData = async () => {
    try {
      setLoading(true); setBackupStatus('processing');
      await adminService.performBackup();
      setBackupStatus('success'); setSuccess('Backup completed successfully');
      setTimeout(() => setBackupStatus('idle'), 5000);
    } catch (err) { setBackupStatus('error'); setError('Failed to perform backup'); } finally { setLoading(false); }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0]; if (!file) return;
    try {
      setLoading(true);
      await adminService.uploadBackup(file);
      setSuccess('Backup restored successfully');
    } catch (err) { setError('Failed to restore backup'); } finally { setLoading(false); }
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'system-controls', label: 'System Controls', icon: '⚙️' },
    { id: 'report-downloads', label: 'Report Downloads', icon: '📥' },
    { id: 'backup-recovery', label: 'Backup & Recovery', icon: '💾' },
  ];

  const cardData = [
    { label: 'Total HODs', value: stats.hodCount, icon: '👨‍💼', subtext: 'Head of departments' },
    { label: 'Students', value: stats.studentsCount, icon: '👨‍🎓', subtext: 'Total enrolled' },
    { label: 'Teaching Staff', value: stats.staffCount, icon: '👨‍🏫', subtext: 'Faculty members' },
    { label: 'Branches', value: stats.branchCount, icon: '🏢', subtext: 'Departments' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#f0f4f9', fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      <Header userName={user?.name} userRole={user?.role} onLogout={handleLogout} />
      <Sidebar
        items={navItems}
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        extraContent={
          <Button variant="primary" size="sm" style={{ width: '100%', justifyContent: 'center' }}>
            + Create User
          </Button>
        }
      />
      <MainContent>
        {error && <Alert type="error" message={error} onClose={() => setError(null)} />}
        {success && <Alert type="success" message={success} onClose={() => setSuccess(null)} />}

        {activeSection === 'dashboard' && (
          <div>
            <PageHeader title="Dashboard" subtitle="System overview and quick statistics" />
            <DashboardGrid>
              {cardData.map((c, i) => (
                <DashboardCard key={i} _index={i} label={c.label} value={c.value} icon={c.icon} subtext={c.subtext} />
              ))}
            </DashboardGrid>
          </div>
        )}

        {activeSection === 'system-controls' && (
          <div>
            <PageHeader title="System Controls" subtitle="Enable or disable major system modules" />
            <Card>
              <ToggleSwitch
                enabled={maintenanceEnabled}
                onChange={handleMaintenanceToggle}
                label="Maintenance Mode"
                description="When enabled, only administrators can log in. All other users will see a maintenance message."
              />
            </Card>
            {maintenanceEnabled && (
              <div style={{ marginTop: '16px' }}>
                <Alert type="warning" title="Maintenance Active" message="System is currently under maintenance. User access is restricted." />
              </div>
            )}
          </div>
        )}

        {activeSection === 'report-downloads' && (
          <div>
            <PageHeader title="Report Downloads" subtitle="Generate and download academic reports" />
            <Card>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                <Select label="Report Type"
                  options={[{ value: '', label: 'Select Report Type' }, { value: 'attendance', label: 'Attendance Report' }, { value: 'cie', label: 'CIE Marks Report' }]}
                  value={reportFilters.type} onChange={(e) => setReportFilters({ ...reportFilters, type: e.target.value })} />
                <Select label="Academic Year"
                  options={[{ value: '', label: 'Select Year' }, ...reportOptions.years.map((y) => ({ value: y, label: y }))]}
                  value={reportFilters.year} onChange={(e) => setReportFilters({ ...reportFilters, year: e.target.value })} />
                <Select label="Branch"
                  options={[{ value: '', label: 'Select Branch' }, ...reportOptions.branches.map((b) => ({ value: b, label: b }))]}
                  value={reportFilters.branch} onChange={(e) => setReportFilters({ ...reportFilters, branch: e.target.value })} />
                <Select label="Semester"
                  options={[{ value: '', label: 'Select Semester' }, ...reportOptions.semesters.map((s) => ({ value: s, label: `Semester ${s}` }))]}
                  value={reportFilters.semester} onChange={(e) => setReportFilters({ ...reportFilters, semester: e.target.value })} />
              </div>
              <Button onClick={handleReportDownload} disabled={loading}>
                📥 Download Report
              </Button>
            </Card>
          </div>
        )}

        {activeSection === 'backup-recovery' && (
          <div>
            <PageHeader title="Data Backup & Recovery" subtitle="Manage system backups and data restoration" />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <Card>
                <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#0d1b2a', margin: '0 0 6px' }}>Manual Backup</h3>
                <p style={{ fontSize: '12px', color: '#64748b', margin: '0 0 20px', lineHeight: 1.5 }}>
                  Create a full snapshot of the current database and files.
                </p>
                <Button onClick={handleBackupData} disabled={loading || backupStatus === 'processing'}
                  variant={backupStatus === 'success' ? 'secondary' : 'primary'}>
                  💾 {backupStatus === 'processing' ? 'Backing up...' : 'Perform Backup'}
                </Button>
                {backupStatus === 'success' && (
                  <div style={{ marginTop: '16px' }}><Alert type="success" message="Backup completed successfully" /></div>
                )}
              </Card>
              <Card>
                <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#0d1b2a', margin: '0 0 6px' }}>Restore from Backup</h3>
                <p style={{ fontSize: '12px', color: '#64748b', margin: '0 0 20px', lineHeight: 1.5 }}>
                  Upload a previously exported backup file to restore system data.
                </p>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#374151', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Select Backup File
                </label>
                <input type="file" onChange={handleFileUpload} accept=".zip,.tar,.gz" disabled={loading}
                  style={{ display: 'block', width: '100%', fontSize: '12px', color: '#64748b', cursor: 'pointer' }} />
              </Card>
            </div>
          </div>
        )}
      </MainContent>
    </div>
  );
}