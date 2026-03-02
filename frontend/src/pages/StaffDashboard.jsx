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
import { staffService } from '../services/api';

export function StaffDashboard() {
  const { user, logout } = useAuth();
  const [activeSection, setActiveSection] = useState('dashboard');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Dashboard
  const [stats, setStats] = useState({
    allocatedSubjects: 0,
    totalStudents: 0,
    attendanceStatus: 'open',
    cieStatus: 'open',
  });

  // Attendance
  const [attendanceSemesters, setAttendanceSemesters] = useState([]);
  const [attendanceSubjects, setAttendanceSubjects] = useState([]);
  const [selectedAttendanceSemester, setSelectedAttendanceSemester] = useState('');
  const [selectedAttendanceSubject, setSelectedAttendanceSubject] = useState('');
  const [attendanceStudents, setAttendanceStudents] = useState([]);
  const [attendanceMarks, setAttendanceMarks] = useState({});
  const [attendanceStatus, setAttendanceStatus] = useState('open');

  // CIE
  const [cieSemesters, setCieSemesters] = useState([]);
  const [cieSubjects, setCieSubjects] = useState([]);
  const [selectedCIESemester, setSelectedCIESemester] = useState('');
  const [selectedCIESubject, setSelectedCIESubject] = useState('');
  const [cieStudents, setCieStudents] = useState([]);
  const [cieMarks, setCieMarks] = useState({});
  const [maxMarks, setMaxMarks] = useState(50);
  const [cieStatus, setCieStatus] = useState('open');

  // File Upload
  const [uploadSemester, setUploadSemester] = useState('');
  const [uploadSubject, setUploadSubject] = useState('');
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadType, setUploadType] = useState('attendance');

  // Report
  const [reportSemester, setReportSemester] = useState('');
  const [reportSubject, setReportSubject] = useState('');

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const res = await staffService.getDashboard();
      setStats(res.data);
      setAttendanceSemesters(res.data.semesters || []);
      setCieSemesters(res.data.semesters || []);
    } catch (err) {
      setError('Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  const loadAttendanceStudents = async (semester, subject) => {
    try {
      setLoading(true);
      const res = await staffService.getAllocationStudents({
        semester,
        subject,
        type: 'attendance',
      });
      setAttendanceStudents(res.data.students || []);
      setAttendanceStatus(res.data.status || 'open');
    } catch (err) {
      setError('Failed to load students');
    } finally {
      setLoading(false);
    }
  };

  const loadCIEStudents = async (semester, subject) => {
    try {
      setLoading(true);
      const res = await staffService.getAllocationStudents({
        semester,
        subject,
        type: 'cie',
      });
      setCieStudents(res.data.students || []);
      setCieStatus(res.data.status || 'open');
    } catch (err) {
      setError('Failed to load students');
    } finally {
      setLoading(false);
    }
  };

  const handleAttendanceSubmit = async () => {
    if (!selectedAttendanceSemester || !selectedAttendanceSubject) {
      setError('Please select semester and subject');
      return;
    }

    try {
      setLoading(true);
      await staffService.submitAttendance({
        semester: selectedAttendanceSemester,
        subject: selectedAttendanceSubject,
        marks: attendanceMarks,
      });
      setSuccess('Attendance submitted successfully');
      setAttendanceMarks({});
    } catch (err) {
      setError('Failed to submit attendance');
    } finally {
      setLoading(false);
    }
  };

  const handleCIESubmit = async () => {
    if (!selectedCIESemester || !selectedCIESubject) {
      setError('Please select semester and subject');
      return;
    }

    try {
      setLoading(true);
      await staffService.submitCIEMarks({
        semester: selectedCIESemester,
        subject: selectedCIESubject,
        marks: cieMarks,
        maxMarks,
      });
      setSuccess('CIE marks submitted successfully');
      setCieMarks({});
    } catch (err) {
      setError('Failed to submit CIE marks');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async () => {
    if (!uploadFile || !uploadSemester || !uploadSubject) {
      setError('Please select file, semester, and subject');
      return;
    }

    try {
      setLoading(true);
      await staffService.uploadBulkMarks(uploadFile, uploadSemester, uploadSubject);
      setSuccess('Bulk marks uploaded successfully');
      setUploadFile(null);
    } catch (err) {
      setError('Failed to upload marks');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateReport = async () => {
    if (!reportSemester || !reportSubject) {
      setError('Please select semester and subject');
      return;
    }

    try {
      setLoading(true);
      const blob = await staffService.generateReport({
        semester: reportSemester,
        subject: reportSubject,
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `report-${reportSemester}-${reportSubject}.pdf`;
      a.click();
    } catch (err) {
      setError('Failed to generate report');
    } finally {
      setLoading(false);
    }
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'attendance', label: 'Attendance', icon: '📋' },
    { id: 'cie-marks', label: 'CIE Marks', icon: '📝' },
    { id: 'bulk-upload', label: 'Bulk Upload', icon: '📤' },
    { id: 'reports', label: 'Reports', icon: '📊' },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <Header userName={user?.name} userRole="Staff" onLogout={logout} />
      <Sidebar items={navItems} activeSection={activeSection} onSectionChange={setActiveSection} />
      <MainContent>
        {error && <Alert type="error" message={error} onClose={() => setError(null)} />}
        {success && <Alert type="success" message={success} onClose={() => setSuccess(null)} />}

        {/* Dashboard */}
        {activeSection === 'dashboard' && (
          <div>
            <PageHeader title="Dashboard" subtitle="Your Teaching Overview" />
            <DashboardGrid>
              <DashboardCard label="Allocated Subjects" value={stats.allocatedSubjects} icon="📚" />
              <DashboardCard label="Total Students" value={stats.totalStudents} icon="👨‍🎓" />
              <DashboardCard
                label="Attendance"
                value={stats.attendanceStatus.charAt(0).toUpperCase() + stats.attendanceStatus.slice(1)}
                icon={stats.attendanceStatus === 'open' ? '🟢' : '🔴'}
              />
              <DashboardCard
                label="CIE Window"
                value={stats.cieStatus.charAt(0).toUpperCase() + stats.cieStatus.slice(1)}
                icon={stats.cieStatus === 'open' ? '🟢' : '🔴'}
              />
            </DashboardGrid>
          </div>
        )}

        {/* Attendance */}
        {activeSection === 'attendance' && (
          <div>
            <PageHeader title="Attendance Entry" subtitle="Record student attendance" />
            <Card>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <Select
                  label="Semester"
                  options={[
                    { value: '', label: 'Select Semester' },
                    ...attendanceSemesters.map((s) => ({ value: s, label: `Semester ${s}` })),
                  ]}
                  value={selectedAttendanceSemester}
                  onChange={(e) => setSelectedAttendanceSemester(e.target.value)}
                />
                <Select
                  label="Subject"
                  options={[
                    { value: '', label: 'Select Subject' },
                    ...attendanceSubjects.map((s) => ({ value: s.id, label: s.name })),
                  ]}
                  value={selectedAttendanceSubject}
                  onChange={(e) => {
                    setSelectedAttendanceSubject(e.target.value);
                    if (e.target.value && selectedAttendanceSemester) {
                      loadAttendanceStudents(selectedAttendanceSemester, e.target.value);
                    }
                  }}
                />
              </div>

              {attendanceStatus === 'closed' && (
                <Alert type="warning" message="🔒 Attendance window is closed. No entries allowed." className="mb-4" />
              )}

              {attendanceStudents.length > 0 && (
                <>
                  <div className="mb-6 overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-slate-100">
                          <th className="border px-4 py-2 text-left text-sm font-semibold">Roll No</th>
                          <th className="border px-4 py-2 text-left text-sm font-semibold">Name</th>
                          <th className="border px-4 py-2 text-left text-sm font-semibold">Classes Present</th>
                        </tr>
                      </thead>
                      <tbody>
                        {attendanceStudents.map((student) => (
                          <tr key={student.rollNo} className="hover:bg-slate-50">
                            <td className="border px-4 py-2 text-sm">{student.rollNo}</td>
                            <td className="border px-4 py-2 text-sm">{student.name}</td>
                            <td className="border px-4 py-2">
                              <input
                                type="number"
                                min="0"
                                value={attendanceMarks[student.rollNo] || ''}
                                onChange={(e) =>
                                  setAttendanceMarks({
                                    ...attendanceMarks,
                                    [student.rollNo]: e.target.value,
                                  })
                                }
                                disabled={attendanceStatus === 'closed'}
                                className="w-20 px-2 py-1 border rounded"
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <Button
                    onClick={handleAttendanceSubmit}
                    disabled={loading || attendanceStatus === 'closed'}
                  >
                    <span>✅</span>
                    <span>Submit Attendance</span>
                  </Button>
                </>
              )}
            </Card>
          </div>
        )}

        {/* CIE Marks */}
        {activeSection === 'cie-marks' && (
          <div>
            <PageHeader title="CIE Marks Entry" subtitle="Record continuous internal evaluation marks" />
            <Card>
              <div className="grid grid-cols-3 gap-4 mb-6">
                <Select
                  label="Semester"
                  options={[
                    { value: '', label: 'Select Semester' },
                    ...cieSemesters.map((s) => ({ value: s, label: `Semester ${s}` })),
                  ]}
                  value={selectedCIESemester}
                  onChange={(e) => setSelectedCIESemester(e.target.value)}
                />
                <Select
                  label="Subject"
                  options={[
                    { value: '', label: 'Select Subject' },
                    ...cieSubjects.map((s) => ({ value: s.id, label: s.name })),
                  ]}
                  value={selectedCIESubject}
                  onChange={(e) => {
                    setSelectedCIESubject(e.target.value);
                    if (e.target.value && selectedCIESemester) {
                      loadCIEStudents(selectedCIESemester, e.target.value);
                    }
                  }}
                />
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Max Marks</label>
                  <input
                    type="number"
                    value={maxMarks}
                    onChange={(e) => setMaxMarks(parseFloat(e.target.value) || 0)}
                    className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              {cieStatus === 'closed' && (
                <Alert type="warning" message="🔒 CIE window is closed. No entries allowed." className="mb-4" />
              )}

              {cieStudents.length > 0 && (
                <>
                  <div className="mb-6 overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-slate-100">
                          <th className="border px-4 py-2 text-left text-sm font-semibold">Roll No</th>
                          <th className="border px-4 py-2 text-left text-sm font-semibold">Name</th>
                          <th className="border px-4 py-2 text-left text-sm font-semibold">Marks (out of {maxMarks})</th>
                        </tr>
                      </thead>
                      <tbody>
                        {cieStudents.map((student) => (
                          <tr key={student.rollNo} className="hover:bg-slate-50">
                            <td className="border px-4 py-2 text-sm">{student.rollNo}</td>
                            <td className="border px-4 py-2 text-sm">{student.name}</td>
                            <td className="border px-4 py-2">
                              <input
                                type="number"
                                min="0"
                                max={maxMarks}
                                step="0.5"
                                value={cieMarks[student.rollNo] || ''}
                                onChange={(e) =>
                                  setCieMarks({
                                    ...cieMarks,
                                    [student.rollNo]: e.target.value,
                                  })
                                }
                                disabled={cieStatus === 'closed'}
                                className="w-20 px-2 py-1 border rounded"
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <Button
                    onClick={handleCIESubmit}
                    disabled={loading || cieStatus === 'closed'}
                  >
                    <span>✅</span>
                    <span>Submit CIE Marks</span>
                  </Button>
                </>
              )}
            </Card>
          </div>
        )}

        {/* Bulk Upload */}
        {activeSection === 'bulk-upload' && (
          <div>
            <PageHeader title="Bulk Mark Upload" subtitle="Upload marks from CSV or Excel file" />
            <Card>
              <div className="grid grid-cols-3 gap-4 mb-6">
                <Select
                  label="Upload Type"
                  options={[
                    { value: 'attendance', label: 'Attendance' },
                    { value: 'cie', label: 'CIE Marks' },
                  ]}
                  value={uploadType}
                  onChange={(e) => setUploadType(e.target.value)}
                />
                <Select
                  label="Semester"
                  options={[
                    { value: '', label: 'Select Semester' },
                    ...attendanceSemesters.map((s) => ({ value: s, label: `Semester ${s}` })),
                  ]}
                  value={uploadSemester}
                  onChange={(e) => setUploadSemester(e.target.value)}
                />
                <Select
                  label="Subject"
                  options={[
                    { value: '', label: 'Select Subject' },
                    ...attendanceSubjects.map((s) => ({ value: s.id, label: s.name })),
                  ]}
                  value={uploadSubject}
                  onChange={(e) => setUploadSubject(e.target.value)}
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 mb-2">Select File</label>
                <input
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  onChange={(e) => setUploadFile(e.target.files?.[0])}
                  className="block w-full text-sm text-slate-500 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-success file:text-white hover:file:bg-emerald-600"
                />
              </div>

              <Button onClick={handleFileUpload} disabled={loading || !uploadFile}>
                <span>📤</span>
                <span>Upload Marks</span>
              </Button>
            </Card>
          </div>
        )}

        {/* Reports */}
        {activeSection === 'reports' && (
          <div>
            <PageHeader title="Generate Report" subtitle="Create student marks and attendance reports" />
            <Card>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <Select
                  label="Semester"
                  options={[
                    { value: '', label: 'Select Semester' },
                    ...attendanceSemesters.map((s) => ({ value: s, label: `Semester ${s}` })),
                  ]}
                  value={reportSemester}
                  onChange={(e) => setReportSemester(e.target.value)}
                />
                <Select
                  label="Subject"
                  options={[
                    { value: '', label: 'Select Subject' },
                    ...attendanceSubjects.map((s) => ({ value: s.id, label: s.name })),
                  ]}
                  value={reportSubject}
                  onChange={(e) => setReportSubject(e.target.value)}
                />
              </div>

              <Button onClick={handleGenerateReport} disabled={loading}>
                <span>📊</span>
                <span>Generate PDF Report</span>
              </Button>
            </Card>
          </div>
        )}
      </MainContent>
    </div>
  );
}
