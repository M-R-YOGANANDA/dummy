import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import {
  Header, Sidebar, MainContent, PageHeader, Card,
  Button, DashboardGrid, DashboardCard, Select, Alert,
} from '../components/Layout';
import { staffService } from '../services/api';

export function StaffDashboard() {
  const { user, logout } = useAuth();
  const [activeSection, setActiveSection] = useState('dashboard');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const [stats, setStats] = useState({ allocatedSubjects: 0, totalStudents: 0, attendanceStatus: 'open', cieStatus: 'open' });
  const [attendanceSemesters, setAttendanceSemesters] = useState([]);
  const [attendanceSubjects, setAttendanceSubjects] = useState([]);
  const [selectedAttendanceSemester, setSelectedAttendanceSemester] = useState('');
  const [selectedAttendanceSubject, setSelectedAttendanceSubject] = useState('');
  const [attendanceStudents, setAttendanceStudents] = useState([]);
  const [attendanceMarks, setAttendanceMarks] = useState({});
  const [attendanceStatus, setAttendanceStatus] = useState('open');
  const [cieSemesters, setCieSemesters] = useState([]);
  const [cieSubjects, setCieSubjects] = useState([]);
  const [selectedCIESemester, setSelectedCIESemester] = useState('');
  const [selectedCIESubject, setSelectedCIESubject] = useState('');
  const [cieStudents, setCieStudents] = useState([]);
  const [cieMarks, setCieMarks] = useState({});
  const [maxMarks, setMaxMarks] = useState(50);
  const [cieStatus, setCieStatus] = useState('open');
  const [uploadSemester, setUploadSemester] = useState('');
  const [uploadSubject, setUploadSubject] = useState('');
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadType, setUploadType] = useState('attendance');
  const [reportSemester, setReportSemester] = useState('');
  const [reportSubject, setReportSubject] = useState('');

  useEffect(() => { loadDashboard(); }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const res = await staffService.getDashboard();
      setStats(res.data);
      setAttendanceSemesters(res.data.semesters || []);
      setCieSemesters(res.data.semesters || []);
    } catch (err) { setError('Failed to load dashboard'); } finally { setLoading(false); }
  };

  const loadAttendanceStudents = async (semester, subject) => {
    try {
      setLoading(true);
      const res = await staffService.getAllocationStudents({ semester, subject, type: 'attendance' });
      setAttendanceStudents(res.data.students || []);
      setAttendanceStatus(res.data.status || 'open');
    } catch (err) { setError('Failed to load students'); } finally { setLoading(false); }
  };

  const loadCIEStudents = async (semester, subject) => {
    try {
      setLoading(true);
      const res = await staffService.getAllocationStudents({ semester, subject, type: 'cie' });
      setCieStudents(res.data.students || []);
      setCieStatus(res.data.status || 'open');
    } catch (err) { setError('Failed to load students'); } finally { setLoading(false); }
  };

  const handleAttendanceSubmit = async () => {
    if (!selectedAttendanceSemester || !selectedAttendanceSubject) { setError('Please select semester and subject'); return; }
    try {
      setLoading(true);
      await staffService.submitAttendance({ semester: selectedAttendanceSemester, subject: selectedAttendanceSubject, marks: attendanceMarks });
      setSuccess('Attendance submitted successfully'); setAttendanceMarks({});
    } catch (err) { setError('Failed to submit attendance'); } finally { setLoading(false); }
  };

  const handleCIESubmit = async () => {
    if (!selectedCIESemester || !selectedCIESubject) { setError('Please select semester and subject'); return; }
    try {
      setLoading(true);
      await staffService.submitCIEMarks({ semester: selectedCIESemester, subject: selectedCIESubject, marks: cieMarks, maxMarks });
      setSuccess('CIE marks submitted successfully'); setCieMarks({});
    } catch (err) { setError('Failed to submit CIE marks'); } finally { setLoading(false); }
  };

  const handleFileUpload = async () => {
    if (!uploadFile || !uploadSemester || !uploadSubject) { setError('Please select file, semester, and subject'); return; }
    try {
      setLoading(true);
      await staffService.uploadBulkMarks(uploadFile, uploadSemester, uploadSubject);
      setSuccess('Bulk marks uploaded successfully'); setUploadFile(null);
    } catch (err) { setError('Failed to upload marks'); } finally { setLoading(false); }
  };

  const handleGenerateReport = async () => {
    if (!reportSemester || !reportSubject) { setError('Please select semester and subject'); return; }
    try {
      setLoading(true);
      const blob = await staffService.generateReport({ semester: reportSemester, subject: reportSubject });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = `report-${reportSemester}-${reportSubject}.pdf`; a.click();
    } catch (err) { setError('Failed to generate report'); } finally { setLoading(false); }
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'attendance', label: 'Attendance', icon: '📋' },
    { id: 'cie-marks', label: 'CIE Marks', icon: '📝' },
    { id: 'bulk-upload', label: 'Bulk Upload', icon: '📤' },
    { id: 'reports', label: 'Reports', icon: '📈' },
  ];

  const inputStyle = {
    width: '80px', padding: '6px 10px', border: '1px solid #d1dae6',
    borderRadius: '6px', fontSize: '13px', outline: 'none', boxSizing: 'border-box',
    fontFamily: 'inherit'
  };

  const thStyle = {
    padding: '10px 14px', textAlign: 'left', fontSize: '11px', fontWeight: '700',
    color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em',
    background: '#f8fafc', borderBottom: '2px solid #e2e8f0'
  };

  const tdStyle = {
    padding: '11px 14px', fontSize: '13px', color: '#1e293b',
    borderBottom: '1px solid #f1f5f9'
  };

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

  const cardData = [
    { label: 'Allocated Subjects', value: stats.allocatedSubjects, icon: '📚' },
    { label: 'Total Students', value: stats.totalStudents, icon: '👨‍🎓' },
    { label: 'Attendance', value: stats.attendanceStatus?.charAt(0).toUpperCase() + stats.attendanceStatus?.slice(1), icon: stats.attendanceStatus === 'open' ? '🟢' : '🔴' },
    { label: 'CIE Window', value: stats.cieStatus?.charAt(0).toUpperCase() + stats.cieStatus?.slice(1), icon: stats.cieStatus === 'open' ? '🟢' : '🔴' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#f0f4f9', fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      <Header userName={user?.name} userRole="Staff" onLogout={logout} />
      <Sidebar items={navItems} activeSection={activeSection} onSectionChange={setActiveSection} />
      <MainContent>
        {error && <Alert type="error" message={error} onClose={() => setError(null)} />}
        {success && <Alert type="success" message={success} onClose={() => setSuccess(null)} />}

        {activeSection === 'dashboard' && (
          <div>
            <PageHeader title="Dashboard" subtitle="Your teaching overview" />
            <DashboardGrid>
              {cardData.map((c, i) => (
                <DashboardCard key={i} _index={i} label={c.label} value={c.value} icon={c.icon} />
              ))}
            </DashboardGrid>
          </div>
        )}

        {activeSection === 'attendance' && (
          <div>
            <PageHeader title="Attendance Entry" subtitle="Record student attendance" />
            <Card>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                <Select label="Semester"
                  options={[{ value: '', label: 'Select Semester' }, ...attendanceSemesters.map((s) => ({ value: s, label: `Semester ${s}` }))]}
                  value={selectedAttendanceSemester} onChange={(e) => setSelectedAttendanceSemester(e.target.value)} />
                <Select label="Subject"
                  options={[{ value: '', label: 'Select Subject' }, ...attendanceSubjects.map((s) => ({ value: s.id, label: s.name }))]}
                  value={selectedAttendanceSubject}
                  onChange={(e) => { setSelectedAttendanceSubject(e.target.value); if (e.target.value && selectedAttendanceSemester) loadAttendanceStudents(selectedAttendanceSemester, e.target.value); }} />
              </div>
              {attendanceStatus === 'closed' && <Alert type="warning" message="Attendance window is closed. No entries allowed." />}
              {attendanceStudents.length > 0 && (
                <>
                  <StatusBadge status={attendanceStatus} />
                  <div style={{ overflowX: 'auto', borderRadius: '10px', border: '1px solid #e2e8f0', marginBottom: '20px' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead>
                        <tr>
                          <th style={thStyle}>Roll No</th>
                          <th style={thStyle}>Name</th>
                          <th style={thStyle}>Classes Present</th>
                        </tr>
                      </thead>
                      <tbody>
                        {attendanceStudents.map((student) => (
                          <tr key={student.rollNo}>
                            <td style={tdStyle}>{student.rollNo}</td>
                            <td style={tdStyle}>{student.name}</td>
                            <td style={tdStyle}>
                              <input type="number" min="0" style={inputStyle}
                                value={attendanceMarks[student.rollNo] || ''}
                                onChange={(e) => setAttendanceMarks({ ...attendanceMarks, [student.rollNo]: e.target.value })}
                                disabled={attendanceStatus === 'closed'} />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <Button onClick={handleAttendanceSubmit} disabled={loading || attendanceStatus === 'closed'}>
                    ✅ Submit Attendance
                  </Button>
                </>
              )}
            </Card>
          </div>
        )}

        {activeSection === 'cie-marks' && (
          <div>
            <PageHeader title="CIE Marks Entry" subtitle="Record continuous internal evaluation marks" />
            <Card>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                <Select label="Semester"
                  options={[{ value: '', label: 'Select Semester' }, ...cieSemesters.map((s) => ({ value: s, label: `Semester ${s}` }))]}
                  value={selectedCIESemester} onChange={(e) => setSelectedCIESemester(e.target.value)} />
                <Select label="Subject"
                  options={[{ value: '', label: 'Select Subject' }, ...cieSubjects.map((s) => ({ value: s.id, label: s.name }))]}
                  value={selectedCIESubject}
                  onChange={(e) => { setSelectedCIESubject(e.target.value); if (e.target.value && selectedCIESemester) loadCIEStudents(selectedCIESemester, e.target.value); }} />
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#374151', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Max Marks
                  </label>
                  <input type="number" value={maxMarks} onChange={(e) => setMaxMarks(parseFloat(e.target.value) || 0)}
                    style={{ width: '100%', padding: '9px 12px', border: '1px solid #d1dae6', borderRadius: '8px', fontSize: '13px', outline: 'none', background: '#f8fafc', boxSizing: 'border-box', fontFamily: 'inherit' }} />
                </div>
              </div>
              {cieStatus === 'closed' && <Alert type="warning" message="CIE window is closed. No entries allowed." />}
              {cieStudents.length > 0 && (
                <>
                  <StatusBadge status={cieStatus} />
                  <div style={{ overflowX: 'auto', borderRadius: '10px', border: '1px solid #e2e8f0', marginBottom: '20px' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead>
                        <tr>
                          <th style={thStyle}>Roll No</th>
                          <th style={thStyle}>Name</th>
                          <th style={thStyle}>Marks (out of {maxMarks})</th>
                        </tr>
                      </thead>
                      <tbody>
                        {cieStudents.map((student) => (
                          <tr key={student.rollNo}>
                            <td style={tdStyle}>{student.rollNo}</td>
                            <td style={tdStyle}>{student.name}</td>
                            <td style={tdStyle}>
                              <input type="number" min="0" max={maxMarks} step="0.5" style={inputStyle}
                                value={cieMarks[student.rollNo] || ''}
                                onChange={(e) => setCieMarks({ ...cieMarks, [student.rollNo]: e.target.value })}
                                disabled={cieStatus === 'closed'} />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <Button onClick={handleCIESubmit} disabled={loading || cieStatus === 'closed'}>
                    ✅ Submit CIE Marks
                  </Button>
                </>
              )}
            </Card>
          </div>
        )}

        {activeSection === 'bulk-upload' && (
          <div>
            <PageHeader title="Bulk Mark Upload" subtitle="Upload marks from CSV or Excel file" />
            <Card>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                <Select label="Upload Type"
                  options={[{ value: 'attendance', label: 'Attendance' }, { value: 'cie', label: 'CIE Marks' }]}
                  value={uploadType} onChange={(e) => setUploadType(e.target.value)} />
                <Select label="Semester"
                  options={[{ value: '', label: 'Select Semester' }, ...attendanceSemesters.map((s) => ({ value: s, label: `Semester ${s}` }))]}
                  value={uploadSemester} onChange={(e) => setUploadSemester(e.target.value)} />
                <Select label="Subject"
                  options={[{ value: '', label: 'Select Subject' }, ...attendanceSubjects.map((s) => ({ value: s.id, label: s.name }))]}
                  value={uploadSubject} onChange={(e) => setUploadSubject(e.target.value)} />
              </div>
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#374151', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Select File (.csv, .xlsx)
                </label>
                <div style={{ padding: '20px', border: '2px dashed #d1dae6', borderRadius: '10px', background: '#f8fafc', textAlign: 'center' }}>
                  <div style={{ fontSize: '28px', marginBottom: '8px' }}>📁</div>
                  <input type="file" accept=".csv,.xlsx,.xls" onChange={(e) => setUploadFile(e.target.files?.[0])}
                    style={{ fontSize: '13px', color: '#64748b', cursor: 'pointer' }} />
                  {uploadFile && (
                    <p style={{ fontSize: '12px', color: '#1e6fc5', marginTop: '8px', fontWeight: '600' }}>
                      Selected: {uploadFile.name}
                    </p>
                  )}
                </div>
              </div>
              <Button onClick={handleFileUpload} disabled={loading || !uploadFile}>
                📤 Upload Marks
              </Button>
            </Card>
          </div>
        )}

        {activeSection === 'reports' && (
          <div>
            <PageHeader title="Generate Report" subtitle="Create student marks and attendance reports" />
            <Card>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                <Select label="Semester"
                  options={[{ value: '', label: 'Select Semester' }, ...attendanceSemesters.map((s) => ({ value: s, label: `Semester ${s}` }))]}
                  value={reportSemester} onChange={(e) => setReportSemester(e.target.value)} />
                <Select label="Subject"
                  options={[{ value: '', label: 'Select Subject' }, ...attendanceSubjects.map((s) => ({ value: s.id, label: s.name }))]}
                  value={reportSubject} onChange={(e) => setReportSubject(e.target.value)} />
              </div>
              <Button onClick={handleGenerateReport} disabled={loading}>
                📈 Generate PDF Report
              </Button>
            </Card>
          </div>
        )}
      </MainContent>
    </div>
  );
}