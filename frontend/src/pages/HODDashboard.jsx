import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import {
  Header, Sidebar, MainContent, PageHeader, Card,
  Button, DashboardGrid, DashboardCard, Select, Table, Alert,
} from '../components/Layout';
import { hodService } from '../services/api';

export function HODDashboard() {
  const { user, logout } = useAuth();
  const [activeSection, setActiveSection] = useState('dashboard');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const [stats, setStats] = useState({ totalSubjects: 0, totalStudents: 0, closedAllocationWindows: 0, closedCIEWindows: 0 });
  const [allocations, setAllocations] = useState([]);
  const [selectedSemester, setSelectedSemester] = useState('');
  const [semesters, setSemesters] = useState([]);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [attendanceSemester, setAttendanceSemester] = useState('');
  const [attendanceStatus, setAttendanceStatus] = useState('open');
  const [cieRecords, setCieRecords] = useState([]);
  const [cieSemester, setCieSemester] = useState('');
  const [cieStatus, setCieStatus] = useState('open');

  useEffect(() => { loadDashboardData(); }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const dashRes = await hodService.getDashboard();
      setStats(dashRes.data);
      setSemesters(dashRes.data.semesters || []);
    } catch (err) { setError('Failed to load dashboard data'); } finally { setLoading(false); }
  };

  const loadAllocations = async (semester) => {
    try {
      setLoading(true);
      const res = await hodService.getAllocationData({ semester });
      setAllocations(res.data.allocations || []);
    } catch (err) { setError('Failed to load allocations'); } finally { setLoading(false); }
  };

  const loadAttendanceData = async (semester) => {
    try {
      setLoading(true);
      const res = await hodService.getAttendanceData({ semester });
      setAttendanceRecords(res.data.records || []);
      setAttendanceStatus(res.data.status || 'open');
    } catch (err) { setError('Failed to load attendance data'); } finally { setLoading(false); }
  };

  const loadCIEData = async (semester) => {
    try {
      setLoading(true);
      const res = await hodService.getCIEData({ semester });
      setCieRecords(res.data.records || []);
      setCieStatus(res.data.status || 'open');
    } catch (err) { setError('Failed to load CIE data'); } finally { setLoading(false); }
  };

  const handleLogout = async () => { await logout(); window.location.href = '/login'; };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'allocations', label: 'Staff Allocations', icon: '👥' },
    { id: 'attendance', label: 'Attendance', icon: '📋' },
    { id: 'cie-marks', label: 'CIE Marks', icon: '📝' },
  ];

  const cardData = [
    { label: 'Total Subjects', value: stats.totalSubjects, icon: '📚' },
    { label: 'Total Students', value: stats.totalStudents, icon: '👨‍🎓' },
    { label: 'Closed Allocations', value: stats.closedAllocationWindows, icon: '🔒' },
    { label: 'Closed CIE Windows', value: stats.closedCIEWindows, icon: '📝' },
  ];

  const StatusBadge = ({ status }) => (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '16px',
      padding: '6px 12px', borderRadius: '20px',
      background: status === 'open' ? '#f0fdf4' : '#fff7f7',
      border: `1px solid ${status === 'open' ? '#86efac' : '#fca5a5'}` }}>
      <div style={{ width: '8px', height: '8px', borderRadius: '50%',
        background: status === 'open' ? '#22c55e' : '#ef4444' }} />
      <span style={{ fontSize: '12px', fontWeight: '600',
        color: status === 'open' ? '#166534' : '#991b1b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        {status === 'open' ? 'Window Open' : 'Window Closed'}
      </span>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#f0f4f9', fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      <Header userName={user?.name} userRole="HOD" onLogout={handleLogout} />
      <Sidebar items={navItems} activeSection={activeSection} onSectionChange={setActiveSection} />
      <MainContent>
        {error && <Alert type="error" message={error} onClose={() => setError(null)} />}
        {success && <Alert type="success" message={success} onClose={() => setSuccess(null)} />}

        {activeSection === 'dashboard' && (
          <div>
            <PageHeader title="Dashboard" subtitle="Department overview and quick statistics" />
            <DashboardGrid>
              {cardData.map((c, i) => (
                <DashboardCard key={i} _index={i} label={c.label} value={c.value} icon={c.icon} />
              ))}
            </DashboardGrid>
          </div>
        )}

        {activeSection === 'allocations' && (
          <div>
            <PageHeader title="Staff Allocations" subtitle="Manage staff-to-subject assignments" />
            <Card>
              <div style={{ marginBottom: '20px' }}>
                <Select label="Select Semester"
                  options={[{ value: '', label: 'Select Semester' }, ...semesters.map((s) => ({ value: s, label: `Semester ${s}` }))]}
                  value={selectedSemester}
                  onChange={(e) => { setSelectedSemester(e.target.value); if (e.target.value) loadAllocations(e.target.value); }} />
              </div>
              {selectedSemester && (
                <Table
                  columns={[
                    { key: 'staffName', label: 'Staff Member' },
                    { key: 'subjectName', label: 'Subject' },
                    { key: 'classCode', label: 'Class' },
                  ]}
                  data={allocations}
                  actions={(row) => [<Button key="edit" size="sm" variant="secondary">Edit</Button>]}
                />
              )}
            </Card>
          </div>
        )}

        {activeSection === 'attendance' && (
          <div>
            <PageHeader title="Attendance Management" subtitle="Monitor and manage attendance records" />
            <Card>
              <div style={{ marginBottom: '20px' }}>
                <Select label="Select Semester"
                  options={[{ value: '', label: 'Select Semester' }, ...semesters.map((s) => ({ value: s, label: `Semester ${s}` }))]}
                  value={attendanceSemester}
                  onChange={(e) => { setAttendanceSemester(e.target.value); if (e.target.value) loadAttendanceData(e.target.value); }} />
              </div>
              {attendanceSemester && (
                <>
                  <StatusBadge status={attendanceStatus} />
                  <Table
                    columns={[
                      { key: 'staffName', label: 'Staff Member' },
                      { key: 'subjectName', label: 'Subject' },
                      { key: 'submittedDate', label: 'Last Submitted' },
                      { key: 'status', label: 'Status' },
                    ]}
                    data={attendanceRecords}
                  />
                </>
              )}
            </Card>
          </div>
        )}

        {activeSection === 'cie-marks' && (
          <div>
            <PageHeader title="CIE Marks Management" subtitle="Monitor and manage CIE marks" />
            <Card>
              <div style={{ marginBottom: '20px' }}>
                <Select label="Select Semester"
                  options={[{ value: '', label: 'Select Semester' }, ...semesters.map((s) => ({ value: s, label: `Semester ${s}` }))]}
                  value={cieSemester}
                  onChange={(e) => { setCieSemester(e.target.value); if (e.target.value) loadCIEData(e.target.value); }} />
              </div>
              {cieSemester && (
                <>
                  <StatusBadge status={cieStatus} />
                  <Table
                    columns={[
                      { key: 'staffName', label: 'Staff Member' },
                      { key: 'subjectName', label: 'Subject' },
                      { key: 'submittedDate', label: 'Last Submitted' },
                      { key: 'status', label: 'Status' },
                    ]}
                    data={cieRecords}
                  />
                </>
              )}
            </Card>
          </div>
        )}
      </MainContent>
    </div>
  );
}