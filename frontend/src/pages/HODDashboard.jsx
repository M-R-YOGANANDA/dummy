import React, { useState, useEffect } from 'react';
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
  Select,
  Table,
  Alert,
} from '../components/Layout';
import { hodService } from '../services/api';

export function HODDashboard() {
  const { user, logout } = useAuth();
  const [activeSection, setActiveSection] = useState('dashboard');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Dashboard stats
  const [stats, setStats] = useState({
    totalSubjects: 0,
    totalStudents: 0,
    closedAllocationWindows: 0,
    closedCIEWindows: 0,
  });

  // Staff allocations
  const [allocations, setAllocations] = useState([]);
  const [selectedSemester, setSelectedSemester] = useState('');
  const [semesters, setSemesters] = useState([]);

  // Attendance
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [attendanceSemester, setAttendanceSemester] = useState('');
  const [attendanceStatus, setAttendanceStatus] = useState('open');

  // CIE Marks
  const [cieRecords, setCieRecords] = useState([]);
  const [cieSemester, setCieSemester] = useState('');
  const [cieStatus, setCieStatus] = useState('open');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const dashRes = await hodService.getDashboard();
      setStats(dashRes.data);
      setSemesters(dashRes.data.semesters || []);
    } catch (err) {
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const loadAllocations = async (semester) => {
    try {
      setLoading(true);
      const res = await hodService.getAllocationData({ semester });
      setAllocations(res.data.allocations || []);
    } catch (err) {
      setError('Failed to load allocations');
    } finally {
      setLoading(false);
    }
  };

  const loadAttendanceData = async (semester) => {
    try {
      setLoading(true);
      const res = await hodService.getAttendanceData({ semester });
      setAttendanceRecords(res.data.records || []);
      setAttendanceStatus(res.data.status || 'open');
    } catch (err) {
      setError('Failed to load attendance data');
    } finally {
      setLoading(false);
    }
  };

  const loadCIEData = async (semester) => {
    try {
      setLoading(true);
      const res = await hodService.getCIEData({ semester });
      setCieRecords(res.data.records || []);
      setCieStatus(res.data.status || 'open');
    } catch (err) {
      setError('Failed to load CIE data');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    window.location.href = '/login';
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'allocations', label: 'Staff Allocations', icon: '👥' },
    { id: 'attendance', label: 'Attendance', icon: '📋' },
    { id: 'cie-marks', label: 'CIE Marks', icon: '📝' },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <Header userName={user?.name} userRole="HOD" onLogout={handleLogout} />
      <Sidebar items={navItems} activeSection={activeSection} onSectionChange={setActiveSection} />
      <MainContent>
        {error && <Alert type="error" message={error} onClose={() => setError(null)} />}
        {success && <Alert type="success" message={success} onClose={() => setSuccess(null)} />}

        {/* Dashboard */}
        {activeSection === 'dashboard' && (
          <div>
            <PageHeader title="Dashboard" subtitle="Department Overview & Quick Stats" />
            <DashboardGrid>
              <DashboardCard label="Total Subjects" value={stats.totalSubjects} icon="📚" />
              <DashboardCard label="Total Students" value={stats.totalStudents} icon="👨‍🎓" />
              <DashboardCard label="Closed Allocations" value={stats.closedAllocationWindows} icon="🔒" />
              <DashboardCard label="Closed CIE Windows" value={stats.closedCIEWindows} icon="📝" />
            </DashboardGrid>
          </div>
        )}

        {/* Staff Allocations */}
        {activeSection === 'allocations' && (
          <div>
            <PageHeader title="Staff Allocations" subtitle="Manage staff-to-subject assignments" />
            <Card className="mb-6">
              <div className="mb-4">
                <Select
                  label="Select Semester"
                  options={[
                    { value: '', label: 'Select Semester' },
                    ...semesters.map((s) => ({ value: s, label: `Semester ${s}` })),
                  ]}
                  value={selectedSemester}
                  onChange={(e) => {
                    setSelectedSemester(e.target.value);
                    if (e.target.value) loadAllocations(e.target.value);
                  }}
                />
              </div>
              {selectedSemester && (
                <div>
                  <Table
                    columns={[
                      { key: 'staffName', label: 'Staff Member' },
                      { key: 'subjectName', label: 'Subject' },
                      { key: 'classCode', label: 'Class' },
                    ]}
                    data={allocations}
                    actions={(row) => [
                      <Button size="sm" variant="secondary">
                        Edit
                      </Button>,
                    ]}
                  />
                </div>
              )}
            </Card>
          </div>
        )}

        {/* Attendance */}
        {activeSection === 'attendance' && (
          <div>
            <PageHeader title="Attendance Management" subtitle="Monitor and manage attendance records" />
            <Card className="mb-6">
              <div className="mb-4">
                <Select
                  label="Select Semester"
                  options={[
                    { value: '', label: 'Select Semester' },
                    ...semesters.map((s) => ({ value: s, label: `Semester ${s}` })),
                  ]}
                  value={attendanceSemester}
                  onChange={(e) => {
                    setAttendanceSemester(e.target.value);
                    if (e.target.value) loadAttendanceData(e.target.value);
                  }}
                />
              </div>

              {attendanceSemester && (
                <>
                  <div className="mb-4">
                    <div className="inline-flex items-center gap-2">
                      <span className={`w-3 h-3 rounded-full ${attendanceStatus === 'open' ? 'bg-success' : 'bg-error'}`} />
                      <span className="text-sm font-medium">
                        Attendance Window: <span className="uppercase font-bold">{attendanceStatus}</span>
                      </span>
                    </div>
                  </div>
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

        {/* CIE Marks */}
        {activeSection === 'cie-marks' && (
          <div>
            <PageHeader title="CIE Marks Management" subtitle="Monitor and manage CIE marks" />
            <Card className="mb-6">
              <div className="mb-4">
                <Select
                  label="Select Semester"
                  options={[
                    { value: '', label: 'Select Semester' },
                    ...semesters.map((s) => ({ value: s, label: `Semester ${s}` })),
                  ]}
                  value={cieSemester}
                  onChange={(e) => {
                    setCieSemester(e.target.value);
                    if (e.target.value) loadCIEData(e.target.value);
                  }}
                />
              </div>

              {cieSemester && (
                <>
                  <div className="mb-4">
                    <div className="inline-flex items-center gap-2">
                      <span className={`w-3 h-3 rounded-full ${cieStatus === 'open' ? 'bg-success' : 'bg-error'}`} />
                      <span className="text-sm font-medium">
                        CIE Window: <span className="uppercase font-bold">{cieStatus}</span>
                      </span>
                    </div>
                  </div>
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
