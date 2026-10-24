import React, { useState, useEffect } from 'react';
import {
  getPortalData,
  savePortalData
} from '../../services/portalData';
import ChatBox from './ChatBox';
import InteractiveServicePlayerModal from './InteractiveServicePlayerModal';

export default function AcademicRolesView({ role, user, activeTab }) {
  const [data, setData] = useState(getPortalData());
  const [activePlayService, setActivePlayService] = useState(null);
  const [filterCategory, setFilterCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [marksStudent, setMarksStudent] = useState(null);
  const [marksInputs, setMarksInputs] = useState({});
  const [isHomeworkOpen, setIsHomeworkOpen] = useState(false);
  const [homeworkForm, setHomeworkForm] = useState({
    title: '',
    grade: 'Grade 10-A',
    due: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
    instructions: '',
    attachmentName: '',
  });
  const [isAnnouncementOpen, setIsAnnouncementOpen] = useState(false);
  const [announcementForm, setAnnouncementForm] = useState({
    title: '',
    target: 'All',
    category: 'General',
    content: ''
  });

  // Roll call state for attendance management
  const [rollCall, setRollCall] = useState({
    S101: 'present',
    S102: 'present',
    S103: 'present',
    S104: 'present',
    S105: 'present'
  });

  // Feedback modal
  const [feedback, setFeedback] = useState(null);

  // New Feature States
  const [staffLeaves, setStaffLeaves] = useState([
    { id: 'LV-101', teacher: 'Mrs. Selvi Murugan', subject: 'Chemistry', dates: '2026-10-24 to 2026-10-25', reason: 'Family Function in Madurai', status: 'Pending' },
    { id: 'LV-102', teacher: 'Dr. Anandhi Rajan', subject: 'Physics', dates: '2026-10-28', reason: 'Medical Appointment', status: 'Pending' },
    { id: 'LV-100', teacher: 'Mr. Anand Narayanan', subject: 'Physics', dates: '2026-10-15', reason: 'Educational Conference', status: 'Approved' },
  ]);

  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [reportCardStudent, setReportCardStudent] = useState(null);

  useEffect(() => {
    setData(getPortalData());
  }, [activeTab]);

  const refreshData = () => {
    setData(getPortalData());
  };

  // Helper for title header
  const getTabTitle = () => {
    const titles = {
      'attendance-reports': 'Attendance Reports',
      'principal-services-tab': 'Campus Extracurricular & Enrichment Services',
      'teacher-services-tab': 'Assigned Service Activities & Student Labs',
      'student-services-tab': 'My Active Enrichment Programs & Practice Labs',
      'parent-services-tab': 'Enrolled Student Services & Progress',
      'academic-performance': 'Academic Performance',
      'school-announcements': 'School Announcements',
      'communication-teachers': 'Communication with Teachers',
      'school-reports': 'School Reports',
      'dashboard-analytics': 'Dashboard Analytics',
      'my-classes': 'My Classes',
      'student-list': 'Student List',
      'attendance-management': 'Attendance Management',
      'assignments': 'Homework & Assignments',
      'study-materials': 'Study Materials',
      'announcements': 'Announcements',
      'secure-messaging': 'Secure Messaging',
      'timetable': 'Timetable',
      'view-dashboard': 'View Dashboard',
      'check-attendance': 'Check Attendance',
      'view-timetable': 'View Timetable',
      'download-materials': 'Study Materials',
      'submit-assignments': 'Submit Homework & Assignments',
      'view-homework': 'View Homework',
      'receive-announcements': 'Announcements',
      'chat-teachers': 'Chat with Teachers',
      'track-exams': 'Track Upcoming Exams',
      'child-information': 'Child Information',
      'attendance-tracking': 'Attendance Tracking',
      'staff-leave-approvals': 'Faculty & Staff Leave Approvals',
      'transport-tracking': 'School Bus Live GPS Tracking',
      'exam-results': 'Exam Results & Academic Report Card',
      'fee-reminders': 'Online Fee Payments & Receipts',
      'messaging-teachers': 'Messaging with Teachers'
    };
    return titles[activeTab] || 'Dashboard';
  };

  // Marks modal handlers
  const handleOpenMarks = (student) => {
    setMarksStudent(student);
    const initial = {};
    const subjects = ['Mathematics', 'Physics', 'Chemistry', 'Tamil', 'English'];
    subjects.forEach((sub) => {
      const existing = student.marks ? student.marks.find((m) => m.subject === sub) : null;
      initial[sub] = existing ? existing.scored : '';
    });
    setMarksInputs(initial);
  };

  const handleSaveMarks = (e) => {
    e.preventDefault();
    if (!marksStudent) return;

    const subjects = ['Mathematics', 'Physics', 'Chemistry', 'Tamil', 'English'];
    const newMarks = [];
    let totalScore = 0;
    let validCount = 0;
    let hasFail = false;

    subjects.forEach((sub) => {
      const val = (marksInputs[sub] !== undefined ? String(marksInputs[sub]) : '').trim();
      if (val.toUpperCase() === 'AB' || val.toUpperCase() === 'ABSENT') {
        newMarks.push({ subject: sub, max: 100, scored: 'AB', grade: 'AB' });
        hasFail = true;
      } else if (val !== '') {
        const num = parseInt(val) || 0;
        let grade = 'F';
        if (num >= 90) grade = 'A+';
        else if (num >= 80) grade = 'A';
        else if (num >= 70) grade = 'B';
        else if (num >= 60) grade = 'C';
        else if (num >= 50) grade = 'D';

        if (num < 50) hasFail = true;
        newMarks.push({ subject: sub, max: 100, scored: num, grade });
        totalScore += num;
        validCount++;
      } else {
        newMarks.push({ subject: sub, max: 100, scored: 'AB', grade: 'AB' });
        hasFail = true;
      }
    });

    let newPerformance = 'Absent';
    if (validCount > 0) {
      const avg = totalScore / validCount;
      if (avg >= 90 && !hasFail) newPerformance = 'Outstanding';
      else if (avg >= 75 && !hasFail) newPerformance = 'Very Good';
      else if (avg >= 50) newPerformance = 'Good';
      else newPerformance = 'Needs Improvement';
    }

    const current = getPortalData();
    const studentIdx = current.students.findIndex((s) => s.roll === marksStudent.roll);
    if (studentIdx > -1) {
      current.students[studentIdx].marks = newMarks;
      current.students[studentIdx].performance = newPerformance;
      savePortalData(current);
      refreshData();
    }

    setMarksStudent(null);
    setFeedback({
      title: 'Marks Saved Successfully',
      body: `Updated Subject Marks & AB status for ${marksStudent.name} (${marksStudent.roll}).`
    });
  };

  // Homework submission & deletion
  const handleSaveHomework = (e) => {
    e.preventDefault();
    const current = getPortalData();
    const newHw = {
      id: 'HW0' + (current.assignments.length + 1),
      title: homeworkForm.title,
      grade: homeworkForm.grade,
      due: homeworkForm.due,
      instructions: homeworkForm.instructions,
      attachmentName: homeworkForm.attachmentName || null,
      subject: 'Mathematics',
      assignedBy: user?.name || 'Mrs. Priya Krishnan',
      schoolId: 'SCHOOL002',
      assignedDate: new Date().toISOString().split('T')[0]
    };
    current.assignments.unshift(newHw);
    savePortalData(current);
    refreshData();
    setIsHomeworkOpen(false);
    setHomeworkForm({
      title: '',
      grade: 'Grade 10-A',
      due: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      instructions: '',
      attachmentName: ''
    });
    setFeedback({
      title: 'Homework Assigned',
      body: `"${newHw.title}" has been published to ${newHw.grade}${newHw.attachmentName ? ` with attachment "${newHw.attachmentName}"` : ''}.`
    });
  };

  // Grade Book CSV Export
  const handleExportGradeBook = () => {
    const students = data.students.filter((s) => s.class === 'Grade 10-A');
    let csv = 'Roll No,Student Name,Class,Attendance,Maths,Physics,Chemistry,Tamil,English,Status\n';
    students.forEach((s) => {
      const m = s.marks || [];
      const math = m.find((x) => x.subject === 'Mathematics')?.scored || '-';
      const phy = m.find((x) => x.subject === 'Physics')?.scored || '-';
      const chem = m.find((x) => x.subject === 'Chemistry')?.scored || '-';
      const tam = m.find((x) => x.subject === 'Tamil')?.scored || '-';
      const eng = m.find((x) => x.subject === 'English')?.scored || '-';
      csv += `"${s.roll}","${s.name}","${s.class}","${s.attendance}","${math}","${phy}","${chem}","${tam}","${eng}","${s.performance || 'Good'}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Grade_Book_Grade_10A_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    setFeedback({
      title: 'Grade Book Exported',
      body: 'Successfully generated and downloaded Class 10-A Grade Book (.CSV) spreadsheet.',
    });
  };

  const handleDeleteHomework = (hwId) => {
    if (window.confirm('Delete this homework assignment?')) {
      const current = getPortalData();
      current.assignments = current.assignments.filter((h) => h.id !== hwId);
      savePortalData(current);
      refreshData();
    }
  };

  // Announcement posting
  const handleSaveAnnouncement = (e) => {
    e.preventDefault();
    const current = getPortalData();
    const newAnn = {
      date: new Date().toISOString().split('T')[0],
      title: announcementForm.title,
      target: announcementForm.target,
      category: announcementForm.category,
      content: announcementForm.content,
      schoolId: 'SCHOOL002'
    };
    current.announcements.unshift(newAnn);
    savePortalData(current);
    refreshData();
    setIsAnnouncementOpen(false);
    setAnnouncementForm({
      title: '',
      target: 'All',
      category: 'General',
      content: ''
    });
    setFeedback({
      title: 'Notice Published',
      body: `"${newAnn.title}" circular has been broadcast to ${newAnn.target}.`
    });
  };

  // Shared Timetable Constants
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const periods = [
    { period: 1, time: '09:00 - 10:00' },
    { period: 2, time: '10:15 - 11:15' },
    { period: 3, time: '11:30 - 12:30' },
    { period: 4, time: '01:30 - 02:30' },
    { period: 5, time: '02:45 - 03:45' }
  ];

  const teacherSlots = (data.classTimetables || []).filter(
    (t) => t.teacherName === 'Mrs. Priya Krishnan' || t.className === 'Grade 10-A'
  );

  return (
    <div>
      {/* Top Content Header matching portal.html lines 1357-1361 */}
      <div className="content-header">
        <h2 id="section-title">{getTabTitle()}</h2>
        <div id="section-actions">
          {activeTab === 'attendance-management' && (
            <button
              className="btn btn-primary btn-sm"
              onClick={() =>
                setFeedback({
                  title: 'Attendance Recorded',
                  body: 'Daily attendance logs have been recorded and synced with campus register.'
                })
              }
            >
              Submit Attendance
            </button>
          )}
          {activeTab === 'assignments' && (
            <button className="btn btn-primary btn-sm" onClick={() => setIsHomeworkOpen(true)}>
              + Give Homework
            </button>
          )}
          {(activeTab === 'school-announcements' || activeTab === 'announcements') && (
            <button className="btn btn-primary btn-sm" onClick={() => setIsAnnouncementOpen(true)}>
              + Post Announcement
            </button>
          )}
        </div>
      </div>

      <div id="portal-content">
        {/* =================================================================== */}
        {/* ENRICHMENT SERVICES & LABS TAB FOR PRINCIPAL, TEACHER, STUDENT, PARENT */}
        {/* Controlled by Super Admin Role Portal Visibility Settings */}
        {/* =================================================================== */}
        {['principal-services-tab', 'teacher-services-tab', 'student-services-tab', 'parent-services-tab'].includes(activeTab) && (() => {
          const currentStore = getPortalData();
          const masterServices = (currentStore.services || [
            { id: 'SRV-01', name: 'Coding for Kids', icon: '💻', category: 'Technology', status: 'Active', cost: '0/yr', description: 'Interactive Python, Scratch block coding, and basic algorithmic thinking for students.', visibleRoles: ['schooladmin', 'teacher', 'student'] },
            { id: 'SRV-02', name: 'Chess Academy', icon: '♟️', category: 'Mind Sports', status: 'Active', cost: '0/yr', description: 'Grandmaster tactics, opening strategies, and tournament training.', visibleRoles: ['schooladmin', 'principal', 'teacher', 'student', 'parent'] },
            { id: 'SRV-03', name: 'Robotics', icon: '🤖', category: 'STEM', status: 'Active', cost: '0/yr', description: 'Arduino, sensor kits, circuit building and autonomous robot design.', visibleRoles: ['schooladmin', 'teacher', 'student'] },
            { id: 'SRV-04', name: 'Drawing & Art', icon: '🎨', category: 'Creative Arts', status: 'Active', cost: '0/yr', description: 'Watercolors, canvas painting, sketch portraiture and digital design.', visibleRoles: ['schooladmin', 'student', 'parent'] },
            { id: 'SRV-05', name: 'Spoken English', icon: '🗣️', category: 'Communication', status: 'Active', cost: '0/yr', description: 'Vocabulary building, public speaking, pronunciation and phonics.', visibleRoles: ['schooladmin', 'principal', 'teacher', 'student', 'parent'] },
            { id: 'SRV-06', name: 'Abacus & Vedic Maths', icon: '🧮', category: 'Mathematics', status: 'Active', cost: '0/yr', description: 'Fast mental calculation techniques, memory retention, and number speed.', visibleRoles: ['schooladmin', 'teacher', 'student', 'parent'] },
            { id: 'SRV-07', name: 'Dance & Music', icon: '🎵', category: 'Performing Arts', status: 'Active', cost: '0/yr', description: 'Classical & contemporary dance, vocal music, keyboard and guitar lessons.', visibleRoles: ['schooladmin', 'student', 'parent'] },
            { id: 'SRV-08', name: 'Sports & Fitness', icon: '⚽', category: 'Athletics', status: 'Active', cost: '0/yr', description: 'Football, basketball, athletics coaching, yoga and physical agility.', visibleRoles: ['schooladmin', 'principal', 'teacher', 'student', 'parent'] },
          ]).map((s) => ({ ...s, cost: '0/yr' }));

          // Filter by current role's authorization from Super Admin
          const visibleServices = masterServices.filter((srv) => {
            const allowed = srv.visibleRoles || ['schooladmin', 'teacher', 'student'];
            return allowed.includes(role);
          });

          return (
            <div>
              <div style={{
                background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
                color: '#ffffff',
                padding: '18px 22px',
                borderRadius: '12px',
                marginBottom: '20px',
                boxShadow: '0 4px 12px rgba(30, 58, 138, 0.15)'
              }}>
                <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.5px', opacity: 0.85, fontWeight: 700 }}>
                  Active Campus Services Authorized by Super Admin
                </div>
                <h3 style={{ margin: '4px 0', fontSize: '1.25rem', color: '#ffffff', fontWeight: 800 }}>
                  Enrichment & Extracurricular Activities ({visibleServices.length} Programs)
                </h3>
                <div style={{ fontSize: '0.86rem', opacity: 0.9 }}>
                  These services have been made visible to the <strong>{role.toUpperCase()}</strong> portal. You can interact, practice, and explore live labs below.
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: '18px' }}>
                {visibleServices.map((srv) => (
                  <div
                    key={srv.id}
                    style={{
                      background: '#ffffff',
                      border: '1px solid #e2e8f0',
                      borderRadius: '14px',
                      padding: '20px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.04)'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                        <div style={{
                          width: '46px',
                          height: '46px',
                          borderRadius: '12px',
                          background: '#eff6ff',
                          border: '1px solid #dbeafe',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '1.5rem'
                        }}>
                          {srv.icon || '🌟'}
                        </div>
                        <span className="badge badge-success">Enrolled & Active</span>
                      </div>

                      <h4 style={{ margin: '0 0 4px', fontSize: '1.08rem', fontWeight: 800, color: '#1e3a8a' }}>
                        {srv.name}
                      </h4>
                      <div style={{ fontSize: '0.76rem', color: '#4f46e5', fontWeight: 700, textTransform: 'uppercase', marginBottom: '8px' }}>
                        {srv.category}
                      </div>
                      <p style={{ fontSize: '0.84rem', color: '#64748b', lineHeight: 1.45, margin: '0 0 16px' }}>
                        {srv.description}
                      </p>
                    </div>

                    <div>
                      <button
                        type="button"
                        onClick={() => setActivePlayService(srv)}
                        style={{
                          width: '100%',
                          padding: '9px 12px',
                          borderRadius: '8px',
                          background: '#2563eb',
                          color: '#ffffff',
                          border: 'none',
                          fontWeight: 700,
                          fontSize: '0.85rem',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px',
                          boxShadow: '0 2px 4px rgba(37,99,235,0.25)'
                        }}
                      >
                        <span>▶</span> Open & Practice
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })()}
        {/* =================================================================== */}
        {/* PRINCIPAL DASHBOARD TABS */}
        {/* =================================================================== */}
        {role === 'principal' && activeTab === 'attendance-reports' && (
          <div>
            <div className="sa-schools-header-bar" style={{ marginBottom: '16px' }}>
              <div className="sa-filter-segment">
                <span style={{ fontWeight: 700, color: 'var(--color-primary)', fontSize: '0.92rem', padding: '6px 12px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  Daily Attendance Overview &mdash; Today ({new Date().toLocaleDateString()})
                </span>
              </div>
            </div>
            <div className="table-responsive">
              <table className="sa-schools-table">
                <thead>
                  <tr>
                    <th>Class / Section</th>
                    <th>Total Students</th>
                    <th>Present</th>
                    <th>Absent</th>
                    <th>Attendance Rate</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>Grade 10-A</strong></td>
                    <td>38</td>
                    <td><span style={{ color: '#16a34a', fontWeight: 700 }}>36</span></td>
                    <td><span style={{ color: '#dc2626', fontWeight: 700 }}>2</span></td>
                    <td><span className="badge badge-success">94.7%</span></td>
                  </tr>
                  <tr>
                    <td><strong>Grade 11-B</strong></td>
                    <td>40</td>
                    <td><span style={{ color: '#16a34a', fontWeight: 700 }}>39</span></td>
                    <td><span style={{ color: '#dc2626', fontWeight: 700 }}>1</span></td>
                    <td><span className="badge badge-success">97.5%</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {role === 'principal' && activeTab === 'academic-performance' && (
          <div>
            <div className="portal-card">
              <div className="portal-card-title">Secondary Board Exam Preparation</div>
              <p>Mock exams result average: <strong>89.4% passing rate</strong> with 32 students in Grade 10 achieving distinctions.</p>
            </div>
          </div>
        )}

        {role === 'principal' && activeTab === 'school-reports' && (
          <div className="grid-2">
            <div className="portal-card" style={{ borderLeftColor: 'var(--color-secondary)' }}>
              <div className="portal-card-title">Enrollment Statistics 2026-27</div>
              <p style={{ fontSize: '2rem', fontWeight: 700, margin: '10px 0', color: 'var(--color-primary)' }}>482 Students</p>
              <p>Total applications processed: 110 (+15% YoY)</p>
            </div>
            <div className="portal-card" style={{ borderLeftColor: 'var(--color-success)' }}>
              <div className="portal-card-title">Average Daily Attendance</div>
              <p style={{ fontSize: '2rem', fontWeight: 700, margin: '10px 0', color: 'var(--color-success)' }}>94.8%</p>
              <p>Target: 95.0% | Peak attendance: Monday</p>
            </div>
          </div>
        )}

        {role === 'principal' && activeTab === 'staff-leave-approvals' && (
          <div>
            <div className="sa-schools-header-bar" style={{ marginBottom: '16px' }}>
              <div className="sa-filter-segment">
                <span style={{ fontWeight: 700, color: 'var(--color-primary)', fontSize: '0.92rem', padding: '6px 12px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  Faculty Leave Applications — Approval Queue
                </span>
              </div>
            </div>
            <div className="table-responsive">
              <table className="sa-schools-table">
                <thead>
                  <tr>
                    <th>Ref ID</th>
                    <th>Faculty Member</th>
                    <th>Department</th>
                    <th>Leave Dates</th>
                    <th>Reason / Purpose</th>
                    <th style={{ textAlign: 'center' }}>Status</th>
                    <th style={{ textAlign: 'center' }}>Principal Action</th>
                  </tr>
                </thead>
                <tbody>
                  {staffLeaves.map((lv) => (
                    <tr key={lv.id}>
                      <td><code>{lv.id}</code></td>
                      <td><strong>{lv.teacher}</strong></td>
                      <td>{lv.subject}</td>
                      <td>{lv.dates}</td>
                      <td>{lv.reason}</td>
                      <td style={{ textAlign: 'center' }}>
                        <span className={`badge ${lv.status === 'Approved' ? 'badge-success' : lv.status === 'Rejected' ? 'badge-danger' : 'badge-warning'}`}>
                          {lv.status}
                        </span>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        {lv.status === 'Pending' ? (
                          <div className="sa-actions-cell" style={{ justifyContent: 'center' }}>
                            <button
                              className="sa-tbl-action success"
                              onClick={() => {
                                setStaffLeaves((prev) =>
                                  prev.map((item) => (item.id === lv.id ? { ...item, status: 'Approved' } : item))
                                );
                                setFeedback({
                                  title: 'Leave Approved',
                                  body: `Leave request ${lv.id} for ${lv.teacher} approved. Automatic substitute notification dispatched.`,
                                });
                              }}
                            >
                              Approve ✓
                            </button>
                            <button
                              className="sa-tbl-action delete"
                              onClick={() => {
                                setStaffLeaves((prev) =>
                                  prev.map((item) => (item.id === lv.id ? { ...item, status: 'Rejected' } : item))
                                );
                                setFeedback({
                                  title: 'Leave Declined',
                                  body: `Leave request ${lv.id} has been declined.`,
                                });
                              }}
                            >
                              Decline ✕
                            </button>
                          </div>
                        ) : (
                          <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Processed</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* TEACHER DASHBOARD TABS */}
        {/* =================================================================== */}
        {role === 'teacher' && activeTab === 'my-classes' && (
          <div className="portal-card">
            <div className="portal-card-header">
              <span className="portal-card-title">Grade 10-A (Mathematics)</span>
              <span className="badge badge-success">Active</span>
            </div>
            <p>Class representative: <strong>Aishwarya Kumar</strong></p>
            <p>Class Room: A-102 | Timetable: Mon, Wed, Fri (9:30 AM - 10:30 AM)</p>
          </div>
        )}

        {role === 'teacher' && activeTab === 'student-list' && (
          <div>
            <div className="sa-schools-header-bar" style={{ marginBottom: '16px' }}>
              <div className="sa-filter-segment">
                <button className="sa-filter-tab active">
                  Assigned: Grade 10-A
                  <span className="sa-filter-count">{data.students.filter((s) => s.class === 'Grade 10-A').length}</span>
                </button>
              </div>
              <div className="sa-toolbar-right" style={{ display: 'flex', gap: '8px' }}>
                <div className="sa-search-wrap">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
                  <input
                    type="text"
                    className="sa-search-input"
                    placeholder="Filter class students..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  onClick={handleExportGradeBook}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
                  Export Grade Book (.CSV)
                </button>
              </div>
            </div>
            <div className="table-responsive">
              <table className="sa-schools-table" id="class-students-table">
                <thead>
                  <tr>
                    <th>Roll No</th>
                    <th>Student Name</th>
                    <th>Assigned Grade</th>
                    <th>Midterm Rating</th>
                    <th style={{ textAlign: 'right' }}>Marks Entry</th>
                  </tr>
                </thead>
                <tbody>
                  {data.students
                    .filter(
                      (s) =>
                        s.class === 'Grade 10-A' &&
                        (s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.roll.toLowerCase().includes(searchQuery.toLowerCase()))
                    )
                    .map((s) => (
                      <tr key={s.roll}>
                        <td><strong>{s.roll}</strong></td>
                        <td>{s.name}</td>
                        <td>{s.class}</td>
                        <td>
                          <span
                            className={`badge ${
                              s.performance === 'Outstanding' || s.performance === 'Very Good'
                                ? 'badge-success'
                                : s.performance === 'Good'
                                ? 'badge-primary'
                                : 'badge-warning'
                            }`}
                          >
                            {s.performance || 'Outstanding'}
                          </span>
                        </td>
                        <td className="sa-actions-cell" style={{ justifyContent: 'flex-end' }}>
                          <button className="sa-tbl-action edit" onClick={() => handleOpenMarks(s)}>
                            Enter Marks
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {role === 'teacher' && activeTab === 'attendance-management' && (
          <div>
            <div className="sa-schools-header-bar" style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
              <div className="sa-filter-segment">
                <span style={{ fontWeight: 700, color: 'var(--color-primary)', fontSize: '0.92rem', padding: '6px 12px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  Roll Call & Attendance Logging — Grade 10-A
                </span>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  onClick={() => {
                    const allP = {};
                    data.students.filter((s) => s.class === 'Grade 10-A').forEach((s) => {
                      allP[s.roll] = 'present';
                    });
                    setRollCall(allP);
                  }}
                >
                  ✓ Mark All Present
                </button>
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  onClick={() => {
                    const allA = {};
                    data.students.filter((s) => s.class === 'Grade 10-A').forEach((s) => {
                      allA[s.roll] = 'absent';
                    });
                    setRollCall(allA);
                  }}
                >
                  ✕ Mark All Absent
                </button>
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={() => {
                    const presentCount = Object.values(rollCall).filter((v) => v === 'present').length;
                    const total = data.students.filter((s) => s.class === 'Grade 10-A').length;
                    setFeedback({
                      title: 'Attendance Saved',
                      body: `Today's attendance successfully locked.\n${presentCount} of ${total} students present (${Math.round((presentCount / (total || 1)) * 100)}%).`,
                    });
                  }}
                >
                  Save Attendance ✓
                </button>
              </div>
            </div>
            <div className="table-responsive">
              <table className="sa-schools-table">
                <thead>
                  <tr>
                    <th>Student Name</th>
                    <th>Roll Number</th>
                    <th style={{ textAlign: 'center' }}>Present</th>
                    <th style={{ textAlign: 'center' }}>Absent</th>
                  </tr>
                </thead>
                <tbody>
                  {data.students
                    .filter((s) => s.class === 'Grade 10-A')
                    .map((s) => (
                      <tr key={s.roll}>
                        <td><strong>{s.name}</strong></td>
                        <td><code>{s.roll}</code></td>
                        <td style={{ textAlign: 'center' }}>
                          <input
                            type="radio"
                            name={`att-${s.roll}`}
                            checked={rollCall[s.roll] === 'present'}
                            onChange={() => setRollCall((prev) => ({ ...prev, [s.roll]: 'present' }))}
                          />
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          <input
                            type="radio"
                            name={`att-${s.roll}`}
                            checked={rollCall[s.roll] === 'absent'}
                            onChange={() => setRollCall((prev) => ({ ...prev, [s.roll]: 'absent' }))}
                          />
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {role === 'teacher' && activeTab === 'assignments' && (
          <div>
            <div className="sa-schools-header-bar" style={{ marginBottom: '16px' }}>
              <div className="sa-filter-segment">
                <button className="sa-filter-tab active">
                  All Assignments
                  <span className="sa-filter-count">{data.assignments.length}</span>
                </button>
              </div>
              <div className="sa-toolbar-right">
                <div className="sa-search-wrap">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
                  <input
                    type="text"
                    className="sa-search-input"
                    placeholder="Search homework..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className="table-responsive">
              <table className="sa-schools-table" id="assignments-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Title</th>
                    <th>Class</th>
                    <th>Due Date</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data.assignments
                    .filter(
                      (hw) =>
                        hw.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        hw.grade.toLowerCase().includes(searchQuery.toLowerCase())
                    )
                    .map((hw) => (
                      <tr key={hw.id}>
                        <td><strong>{hw.id}</strong></td>
                        <td>{hw.title}</td>
                        <td><span className="badge badge-info">{hw.grade}</span></td>
                        <td><span className="badge badge-warning">{hw.due}</span></td>
                        <td className="sa-actions-cell" style={{ justifyContent: 'flex-end' }}>
                          <button className="sa-tbl-action danger" onClick={() => handleDeleteHomework(hw.id)}>
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {(role === 'teacher' || role === 'student') && (activeTab === 'study-materials' || activeTab === 'download-materials') && (
          <div className="portal-card">
            <div className="portal-card-header">
              <strong>Trigonometry Practice Sheet.pdf</strong>
              <span className="badge badge-info">PDF</span>
            </div>
            <p>Class resource uploaded by Mrs. Priya Krishnan.</p>
            <button
              className="btn btn-outline btn-sm"
              onClick={() =>
                setFeedback({
                  title: 'Download Study Material',
                  body: 'Downloading Trigonometry Practice Sheet.pdf (2.4 MB)...'
                })
              }
            >
              Download File ↓
            </button>
          </div>
        )}

        {role === 'teacher' && activeTab === 'timetable' && (
          <div>
            <div className="portal-card" style={{ marginBottom: '20px', borderLeftColor: 'var(--color-primary)', padding: '15px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                <div>
                  <h3 style={{ color: 'var(--color-primary)', margin: '0 0 4px 0' }}>Weekly Timetable — Mrs. Priya Krishnan</h3>
                  <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--color-text-light)' }}>
                    Primary Subject: <strong>Mathematics</strong> | Assigned Class: <strong>Grade 10-A</strong>
                  </p>
                </div>
                <span className="badge badge-info" style={{ fontSize: '0.85rem' }}>
                  Total Assigned Classes: {teacherSlots.length} Periods
                </span>
              </div>
            </div>

            <div className="table-responsive">
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center' }}>
                <thead>
                  <tr style={{ background: 'var(--color-bg-light)', borderBottom: '2px solid rgba(30,58,138,0.15)' }}>
                    <th style={{ padding: '10px', minWidth: '120px', textAlign: 'left' }}>Time / Period</th>
                    {days.map((d) => (
                      <th key={d} style={{ padding: '10px', minWidth: '110px' }}>{d}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {periods.map((p) => (
                    <tr key={p.period} style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                      <td data-label="Period" style={{ padding: '10px', textAlign: 'left', fontWeight: 700, color: 'var(--color-primary)', background: 'rgba(30,58,138,0.02)' }}>
                        <div>Period {p.period}</div>
                        <div style={{ fontSize: '0.72rem', fontWeight: 'normal', color: 'var(--color-text-light)' }}>{p.time}</div>
                      </td>
                      {days.map((day) => {
                        const slot = teacherSlots.find((s) => s.day === day && parseInt(s.period) === p.period);
                        if (slot) {
                          return (
                            <td key={day} data-label={`${day} Period ${p.period}`} style={{ padding: '6px' }}>
                              <div style={{ background: '#dcfce7', borderLeft: '3px solid #10b981', padding: '8px 6px', borderRadius: '4px', textAlign: 'left' }}>
                                <div style={{ fontWeight: 700, color: '#047857', fontSize: '0.82rem' }}>{slot.className}</div>
                                <div style={{ fontSize: '0.75rem', color: '#065f46' }}>{slot.subject}</div>
                              </div>
                            </td>
                          );
                        } else {
                          return (
                            <td key={day} data-label={`${day} Period ${p.period}`} style={{ padding: '6px' }}>
                              <div style={{ background: 'rgba(0,0,0,0.02)', border: '1px dashed rgba(0,0,0,0.08)', padding: '8px 6px', borderRadius: '4px', textAlign: 'center', color: '#94a3b8', fontSize: '0.75rem' }}>
                                <em>Free Period</em>
                              </div>
                            </td>
                          );
                        }
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* STUDENT DASHBOARD TABS */}
        {/* =================================================================== */}
        {role === 'student' && activeTab === 'view-dashboard' && (
          <div className="grid-2">
            <div className="portal-card" style={{ borderLeftColor: 'var(--color-secondary)' }}>
              <h4>My Attendance Rate</h4>
              <p style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--color-primary)', margin: '10px 0' }}>96.2%</p>
              <p>Exceeds standard requirement.</p>
            </div>
            <div className="portal-card" style={{ borderLeftColor: 'var(--color-success)' }}>
              <h4>Pending Assignments</h4>
              <p style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--color-success)', margin: '10px 0' }}>2 Tasks</p>
              <p>Next due: Algebra Exercise</p>
            </div>
          </div>
        )}

        {(role === 'student' || role === 'parent') && (activeTab === 'check-attendance' || activeTab === 'attendance-tracking') && (
          <div className="portal-card">
            <div className="portal-card-title">Attendance Tracking Logs</div>
            <p>Total school days: 90 | Present days: 86.5 | Absent days: 3.5</p>
          </div>
        )}

        {role === 'student' && activeTab === 'view-timetable' && (
          <div className="table-responsive">
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center' }}>
              <thead>
                <tr style={{ background: 'var(--color-bg-light)', borderBottom: '2px solid rgba(30,58,138,0.15)' }}>
                  <th style={{ padding: '10px', minWidth: '120px', textAlign: 'left' }}>Time / Period</th>
                  {days.map((d) => (
                    <th key={d} style={{ padding: '10px', minWidth: '110px' }}>{d}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {periods.map((p) => (
                  <tr key={p.period} style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                    <td data-label="Period" style={{ padding: '10px', textAlign: 'left', fontWeight: 700, color: 'var(--color-primary)', background: 'rgba(30,58,138,0.02)' }}>
                      <div>Period {p.period}</div>
                      <div style={{ fontSize: '0.72rem', fontWeight: 'normal', color: 'var(--color-text-light)' }}>{p.time}</div>
                    </td>
                    {days.map((day) => {
                      const slot = (data.classTimetables || []).find((s) => s.className === 'Grade 10-A' && s.day === day && parseInt(s.period) === p.period);
                      return (
                        <td key={day} style={{ padding: '6px' }}>
                          {slot ? (
                            <div style={{ background: 'rgba(37,99,235,0.08)', borderLeft: '3px solid var(--color-primary)', padding: '8px 6px', borderRadius: '4px', textAlign: 'left' }}>
                              <div style={{ fontWeight: 700, color: 'var(--color-primary)', fontSize: '0.82rem' }}>{slot.subject}</div>
                              <div style={{ fontSize: '0.75rem', color: '#475569' }}>{slot.teacherName}</div>
                            </div>
                          ) : (
                            <div style={{ background: 'rgba(0,0,0,0.02)', border: '1px dashed rgba(0,0,0,0.08)', padding: '8px 6px', borderRadius: '4px', textAlign: 'center', color: '#94a3b8', fontSize: '0.75rem' }}>
                              <em>Study Hall</em>
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {role === 'student' && activeTab === 'submit-assignments' && (
          <div className="wizard-form-box" style={{ maxWidth: '680px', margin: '0 auto', background: 'var(--color-bg-white)', borderRadius: 'var(--radius-md)', padding: '24px', boxShadow: 'var(--shadow-sm)', border: '1px solid #e2e8f0' }}>
            <div className="wizard-header-strip">
              <div className="wizard-header-icon" style={{ background: 'rgba(30, 58, 138, 0.08)', color: 'var(--color-primary)' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
              </div>
              <div className="wizard-header-titles">
                <h4>Submit Student Assignment</h4>
                <p>Upload completed exercise solutions, homework docs, or project files for grading.</p>
              </div>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setFeedback({
                  title: 'Assignment Submitted',
                  body: 'Your assignment solution file has been uploaded successfully!'
                });
              }}
            >
              <div className="wizard-grid-2">
                <div className="wizard-field span-2">
                  <label>Select Assignment / Subject <span className="req">*</span></label>
                  <select required>
                    <option value="Algebra Equations Exercise">Mathematics — Algebra Equations Exercise (Due: 2026-07-28)</option>
                    <option value="Newton Laws Lab Report">Physics — Newton Laws Experiment Report (Due: 2026-07-30)</option>
                    <option value="English Essay">English — Modern Poetry Analytical Essay (Due: 2026-08-02)</option>
                  </select>
                </div>
                <div className="wizard-field span-2">
                  <label>Upload Document / Solution File <span className="req">*</span></label>
                  <input type="file" required style={{ padding: '10px', border: '2px dashed #cbd5e1', background: '#f8fafc', borderRadius: '8px', width: '100%' }} />
                  <small style={{ color: '#64748b', fontSize: '0.78rem', marginTop: '4px', display: 'block' }}>Accepted formats: PDF, DOCX, JPG, PNG (Max size: 15MB)</small>
                </div>
                <div className="wizard-field span-2">
                  <label>Student Notes / Comments (Optional)</label>
                  <textarea rows="3" placeholder="Provide any additional comments or context for your instructor..."></textarea>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #e2e8f0' }}>
                <button type="submit" className="btn btn-primary btn-sm" style={{ padding: '9px 24px' }}>
                  Upload & Submit Assignment ✓
                </button>
              </div>
            </form>
          </div>
        )}

        {(role === 'student' || role === 'parent') && (activeTab === 'view-homework' || activeTab === 'homework') && (
          <div className="portal-card">
            <h4>Algebra Equations Exercise</h4>
            <p>Due: 2026-07-28 | Subject: Mathematics</p>
            <p>Solve exercises 3.1 to 3.4 in notebook.</p>
          </div>
        )}

        {role === 'student' && activeTab === 'receive-announcements' && (
          <div className="portal-card">
            <h4>Independence Day Celebrations</h4>
            <p>Flag hoisting ceremony starts at 8:00 AM on August 15.</p>
          </div>
        )}

        {role === 'student' && activeTab === 'track-exams' && (
          <div>
            <div className="sa-schools-header-bar" style={{ marginBottom: '16px' }}>
              <div className="sa-filter-segment">
                <span style={{ fontWeight: 700, color: 'var(--color-primary)', fontSize: '0.92rem', padding: '6px 12px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  Upcoming Examinations Schedule
                </span>
              </div>
            </div>
            <div className="table-responsive">
              <table className="sa-schools-table">
                <thead>
                  <tr>
                    <th>Subject</th>
                    <th>Exam Date</th>
                    <th>Max Marks</th>
                    <th>Pass Marks</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>Mathematics (Paper-I)</strong></td>
                    <td>2026-09-10</td>
                    <td>100</td>
                    <td>35</td>
                    <td><span className="badge badge-success">Scheduled</span></td>
                  </tr>
                  <tr>
                    <td><strong>Science & Experiments</strong></td>
                    <td>2026-09-12</td>
                    <td>100</td>
                    <td>35</td>
                    <td><span className="badge badge-success">Scheduled</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* PARENT DASHBOARD TABS */}
        {/* =================================================================== */}
        {role === 'parent' && activeTab === 'child-information' && (
          <div className="portal-card">
            <div className="portal-card-title">Student Profile Summary</div>
            <p><strong>Name:</strong> Aishwarya Kumar</p>
            <p><strong>Class:</strong> Grade 10-A (Roll No: S101)</p>
            <p><strong>Emergency Contact:</strong> Ramesh Kumar (+91 98456 12301)</p>
          </div>
        )}

        {role === 'parent' && activeTab === 'exam-results' && (
          <div>
            <div className="portal-card" style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <h4>Exam Results & Evaluation — Aishwarya Kumar (96.5% Distinction)</h4>
                <p style={{ margin: 0 }}>Mathematics: 98/100 (A+) | Physics: 92/100 (A+) | Chemistry: 86/100 (A)</p>
              </div>
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={() => setReportCardStudent(data.students[0])}
                style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /></svg>
                View & Print Official Term Report Card
              </button>
            </div>
            <div className="table-responsive">
              <table className="sa-schools-table">
                <thead>
                  <tr>
                    <th>Subject</th>
                    <th>Max Marks</th>
                    <th>Scored Marks</th>
                    <th>Grade</th>
                  </tr>
                </thead>
                <tbody>
                  {(data.students[0]?.marks || []).map((m, idx) => (
                    <tr key={idx}>
                      <td><strong>{m.subject}</strong></td>
                      <td>{m.max}</td>
                      <td><strong>{m.scored}</strong></td>
                      <td><span className="badge badge-success">{m.grade}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {role === 'parent' && activeTab === 'fee-reminders' && (
          <div>
            <div className="portal-card" style={{ borderLeftColor: 'var(--color-secondary)', marginBottom: '20px' }}>
              <div className="portal-card-header">
                <div>
                  <h4 style={{ margin: '0 0 4px 0' }}>Term-II Academic & Facility Fee 2026-27</h4>
                  <div style={{ fontSize: '0.85rem', color: '#64748b' }}>Student: Aishwarya Kumar &bull; Grade 10-A</div>
                </div>
                <span className="badge badge-warning">Due: 2026-08-10</span>
              </div>
              <p style={{ fontSize: '1.25rem', margin: '14px 0 18px' }}>Total Outstanding Due: <strong style={{ color: '#b91c1c' }}>₹12,500/-</strong></p>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => setIsPaymentModalOpen(true)}
                style={{ padding: '8px 24px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
              >
                ⚡ Pay via UPI / Razorpay Gateway
              </button>
            </div>

            <div className="table-responsive">
              <table className="sa-schools-table">
                <thead>
                  <tr>
                    <th>Receipt No</th>
                    <th>Fee Description</th>
                    <th>Amount Paid</th>
                    <th>Date</th>
                    <th>Payment Mode</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><code>REC-2026-084</code></td>
                    <td>Term-I Tuition & Lab Fee</td>
                    <td>₹15,000</td>
                    <td>2026-05-12</td>
                    <td>UPI / PhonePe</td>
                    <td><span className="badge badge-success">PAID</span></td>
                  </tr>
                  <tr>
                    <td><code>REC-2026-012</code></td>
                    <td>Annual Sports & Library Fee</td>
                    <td>₹3,500</td>
                    <td>2026-04-10</td>
                    <td>Net Banking</td>
                    <td><span className="badge badge-success">PAID</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* LIVE BUS / TRANSPORT GPS TRACKER (Student & Parent) */}
        {(role === 'student' || role === 'parent') && activeTab === 'transport-tracking' && (
          <div>
            <div className="sa-schools-header-bar" style={{ marginBottom: '16px' }}>
              <div className="sa-filter-segment">
                <span style={{ fontWeight: 700, color: 'var(--color-primary)', fontSize: '0.92rem', padding: '6px 12px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  🚌 Route #14 &mdash; Kodumudi Central to SSV Girls High School
                </span>
              </div>
              <div className="sa-toolbar-right">
                <span className="badge badge-success" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e', display: 'inline-block' }}></span>
                  Live GPS Broadcasting (Speed: 38 km/h)
                </span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px', marginBottom: '20px' }}>
              <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Assigned Bus & Driver</div>
                <div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#1e3a8a', marginTop: '4px' }}>TN 33 BM 4521</div>
                <div style={{ fontSize: '0.85rem', color: '#475569', marginTop: '4px' }}>Driver: Mr. K. Murugesan (+91 97890 23145)</div>
              </div>
              <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Next Designated Stop</div>
                <div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#047857', marginTop: '4px' }}>Anna Nagar Junction (Stop #5)</div>
                <div style={{ fontSize: '0.85rem', color: '#475569', marginTop: '4px' }}>Estimated Arrival: In 6 Minutes (08:24 AM)</div>
              </div>
              <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Campus Distance</div>
                <div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#6366f1', marginTop: '4px' }}>3.4 Kilometers Away</div>
                <div style={{ fontSize: '0.85rem', color: '#475569', marginTop: '4px' }}>On-Time Schedule: Morning Pickup</div>
              </div>
            </div>

            {/* Simulated Live Route Timeline */}
            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '24px' }}>
              <h4 style={{ margin: '0 0 20px 0', color: '#1e3a8a' }}>Route Stops & Timestamp Progress</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#dcfce7', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.85rem' }}>✓</div>
                  <div style={{ flex: 1 }}>
                    <strong>Starting Depot — Railway Colony</strong>
                    <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Departed at 07:50 AM</div>
                  </div>
                  <span className="badge badge-success">Completed</span>
                </div>
                <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#dcfce7', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.85rem' }}>✓</div>
                  <div style={{ flex: 1 }}>
                    <strong>Stop #3 — Main Bazaar & Clock Tower</strong>
                    <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Passed at 08:10 AM (Boarded 8 students)</div>
                  </div>
                  <span className="badge badge-success">Completed</span>
                </div>
                <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#fef3c7', color: '#b45309', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.85rem' }}>⚡</div>
                  <div style={{ flex: 1 }}>
                    <strong>Stop #5 — Anna Nagar Junction (Your Child's Stop)</strong>
                    <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Approaching now &bull; Expected at 08:24 AM</div>
                  </div>
                  <span className="badge badge-warning">En Route</span>
                </div>
                <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#f1f5f9', color: '#94a3b8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.85rem' }}>4</div>
                  <div style={{ flex: 1 }}>
                    <strong>Destination — Sri Sankara Vidhyasala School Gate</strong>
                    <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Expected arrival 08:35 AM</div>
                  </div>
                  <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Upcoming</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SHARED ANNOUNCEMENTS TABS (Principal, Teacher, Parent) */}
        {(activeTab === 'school-announcements' || activeTab === 'announcements') && (
          <div>
            <div className="sa-schools-header-bar">
              <div className="sa-filter-segment">
                {['All', 'Academic', 'Sports', 'General'].map((cat) => (
                  <button
                    key={cat}
                    className={`sa-filter-tab ${filterCategory === cat ? 'active' : ''}`}
                    onClick={() => setFilterCategory(cat)}
                  >
                    {cat === 'All' ? 'All Notices' : cat}
                  </button>
                ))}
              </div>
            </div>
            <div id="announcement-list">
              {data.announcements
                .filter((a) => filterCategory === 'All' || a.category === filterCategory)
                .map((a, idx) => (
                  <div key={idx} className="portal-card announcement-card" data-category={a.category || 'General'}>
                    <div className="portal-card-header">
                      <span className="portal-card-title">{a.title}</span>
                      <div>
                        <span className="badge badge-info" style={{ marginRight: '6px' }}>{a.category || 'Notice'}</span>
                        <span className="badge badge-warning">{a.date}</span>
                      </div>
                    </div>
                    <p>{a.content}</p>
                    <p style={{ fontSize: '0.8rem', color: 'var(--color-text-light)', marginTop: '10px' }}>
                      Target Audience: <strong>{a.target}</strong>
                    </p>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* SHARED CHAT MESSAGING TABS */}
        {(activeTab === 'communication-teachers' ||
          activeTab === 'chat-teachers' ||
          activeTab === 'messaging-teachers' ||
          activeTab === 'secure-messaging') && (
          <ChatBox />
        )}
      </div>

      {/* =================================================================== */}
      {/* MODALS */}
      {/* =================================================================== */}

      {/* 1. Academic Evaluation & Marks Entry Modal */}
      {marksStudent && (
        <div className="modal-overlay" style={{ display: 'flex' }}>
          <div className="modal-content wizard-modal-lg" style={{ maxWidth: '640px' }}>
            <div className="modal-header">
              <h3>Academic Marks &mdash; {marksStudent.name} ({marksStudent.roll})</h3>
              <button className="modal-close" onClick={() => setMarksStudent(null)}>&times;</button>
            </div>
            <form onSubmit={handleSaveMarks}>
              <div className="wizard-form-box">
                <div className="wizard-header-strip">
                  <div className="wizard-header-icon" style={{ background: 'rgba(30, 58, 138, 0.08)', color: 'var(--color-primary)' }}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c3 3 9 3 12 0v-5" /></svg>
                  </div>
                  <div className="wizard-header-titles">
                    <h4>Academic Evaluation & Marks Entry</h4>
                    <p>Record exam marks or assign Absent (AB) designation for official evaluation.</p>
                  </div>
                </div>

                <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '12px 16px', marginBottom: '18px', display: 'flex', flexWrap: 'wrap', gap: '20px', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div><span style={{ color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 700, display: 'block' }}>Student Name</span><strong style={{ color: 'var(--color-primary)', fontSize: '1rem' }}>{marksStudent.name}</strong></div>
                  <div><span style={{ color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 700, display: 'block' }}>Roll Number</span><code style={{ fontSize: '0.95rem', color: '#334155', fontWeight: 700 }}>{marksStudent.roll}</code></div>
                  <div><span style={{ color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 700, display: 'block' }}>Standard Class</span><span className="badge badge-info">{marksStudent.class}</span></div>
                  <div><span style={{ color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 700, display: 'block' }}>Current Standing</span><span className="badge badge-success">{marksStudent.performance || 'Good'}</span></div>
                </div>

                <p style={{ fontSize: '0.82rem', color: 'var(--color-text-light)', marginBottom: '14px' }}>
                  Enter score (0-100) for each subject or click <strong>Mark AB</strong> if student was absent.
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px', marginBottom: '10px' }}>
                  {['Mathematics', 'Physics', 'Chemistry', 'Tamil', 'English'].map((sub) => (
                    <div key={sub} className="wizard-field" style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '12px', borderRadius: '8px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <label style={{ margin: 0, fontWeight: 700, color: 'var(--color-primary)', fontSize: '0.88rem' }}>{sub}</label>
                        <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, background: '#e2e8f0', padding: '2px 8px', borderRadius: '10px' }}>Max: 100</span>
                      </div>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <input
                          type="text"
                          placeholder="0-100 or AB"
                          value={marksInputs[sub] !== undefined ? marksInputs[sub] : ''}
                          onChange={(e) => setMarksInputs({ ...marksInputs, [sub]: e.target.value })}
                          style={{ flex: 1 }}
                        />
                        <button
                          type="button"
                          className="btn btn-outline btn-sm"
                          onClick={() => setMarksInputs({ ...marksInputs, [sub]: 'AB' })}
                          style={{ whiteSpace: 'nowrap', padding: '7px 12px', fontSize: '0.78rem', borderColor: '#ef4444', color: '#ef4444', fontWeight: 600 }}
                        >
                          Mark AB
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #e2e8f0' }}>
                <button type="button" className="btn btn-outline btn-sm" onClick={() => setMarksStudent(null)}>Cancel</button>
                <button type="submit" className="btn btn-primary btn-sm" style={{ padding: '8px 22px' }}>Save All Subject Marks ✓</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. Homework Form Modal */}
      {isHomeworkOpen && (
        <div className="modal-overlay" style={{ display: 'flex' }}>
          <div className="modal-content wizard-modal-lg" style={{ maxWidth: '640px' }}>
            <div className="modal-header">
              <h3>Give New Homework Assignment</h3>
              <button className="modal-close" onClick={() => setIsHomeworkOpen(false)}>&times;</button>
            </div>
            <form onSubmit={handleSaveHomework}>
              <div className="wizard-form-box">
                <div className="wizard-header-strip">
                  <div className="wizard-header-icon" style={{ background: 'rgba(30, 58, 138, 0.08)', color: 'var(--color-primary)' }}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></svg>
                  </div>
                  <div className="wizard-header-titles">
                    <h4>Assign Homework & Tasks</h4>
                    <p>Publish homework assignment, instructions, and target submission deadline.</p>
                  </div>
                </div>
                <div className="wizard-grid-2">
                  <div className="wizard-field span-2">
                    <label>Assignment Headline / Topic <span className="req">*</span></label>
                    <input
                      type="text"
                      placeholder="e.g. Chapter 4 Trigonometry Problem Set (Q1 - Q15)"
                      required
                      value={homeworkForm.title}
                      onChange={(e) => setHomeworkForm({ ...homeworkForm, title: e.target.value })}
                    />
                  </div>
                  <div className="wizard-field">
                    <label>Target Classroom / Section <span className="req">*</span></label>
                    <input
                      type="text"
                      required
                      value={homeworkForm.grade}
                      onChange={(e) => setHomeworkForm({ ...homeworkForm, grade: e.target.value })}
                    />
                  </div>
                  <div className="wizard-field">
                    <label>Submission Due Date <span className="req">*</span></label>
                    <input
                      type="date"
                      required
                      value={homeworkForm.due}
                      onChange={(e) => setHomeworkForm({ ...homeworkForm, due: e.target.value })}
                    />
                  </div>
                  <div className="wizard-field span-2">
                    <label>Instructions & Resource Guidelines <span className="req">*</span></label>
                    <textarea
                      rows="4"
                      placeholder="Detail the step-by-step instructions or chapters to study..."
                      required
                      value={homeworkForm.instructions}
                      onChange={(e) => setHomeworkForm({ ...homeworkForm, instructions: e.target.value })}
                    ></textarea>
                  </div>
                  <div className="wizard-field span-2">
                    <label>Attach Assignment Worksheet / Reference PDF (Optional)</label>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                      <input
                        type="file"
                        id="hw-attachment-file"
                        style={{ display: 'none' }}
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            setHomeworkForm({ ...homeworkForm, attachmentName: e.target.files[0].name });
                          }
                        }}
                      />
                      <button
                        type="button"
                        className="btn btn-outline btn-sm"
                        onClick={() => document.getElementById('hw-attachment-file').click()}
                        style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" /></svg>
                        Choose Worksheet File
                      </button>
                      <span style={{ fontSize: '0.85rem', color: homeworkForm.attachmentName ? '#047857' : '#94a3b8', fontWeight: homeworkForm.attachmentName ? 600 : 'normal' }}>
                        {homeworkForm.attachmentName ? `✓ ${homeworkForm.attachmentName}` : 'No file selected (Supports PDF, DOCX, JPG)'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #e2e8f0' }}>
                <button type="button" className="btn btn-outline btn-sm" onClick={() => setIsHomeworkOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary btn-sm" style={{ padding: '8px 22px' }}>Post Homework Assignment ✓</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. Post Announcement Modal */}
      {isAnnouncementOpen && (
        <div className="modal-overlay" style={{ display: 'flex' }}>
          <div className="modal-content wizard-modal-lg" style={{ maxWidth: '640px' }}>
            <div className="modal-header">
              <h3>Post Campus Announcement</h3>
              <button className="modal-close" onClick={() => setIsAnnouncementOpen(false)}>&times;</button>
            </div>
            <form onSubmit={handleSaveAnnouncement}>
              <div className="wizard-form-box">
                <div className="wizard-header-strip">
                  <div className="wizard-header-icon" style={{ background: 'rgba(30, 58, 138, 0.08)', color: 'var(--color-primary)' }}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg>
                  </div>
                  <div className="wizard-header-titles">
                    <h4>Broadcast Circular / Notice</h4>
                    <p>Publish an official notice to students, teachers, or parents across this campus.</p>
                  </div>
                </div>
                <div className="wizard-grid-2">
                  <div className="wizard-field span-2">
                    <label>Notice Headline / Title <span className="req">*</span></label>
                    <input
                      type="text"
                      placeholder="e.g. Annual Sports Meet 2026 - Schedule Released"
                      required
                      value={announcementForm.title}
                      onChange={(e) => setAnnouncementForm({ ...announcementForm, title: e.target.value })}
                    />
                  </div>
                  <div className="wizard-field">
                    <label>Target Audience <span className="req">*</span></label>
                    <select
                      value={announcementForm.target}
                      onChange={(e) => setAnnouncementForm({ ...announcementForm, target: e.target.value })}
                    >
                      <option value="All">All Campus Stakeholders</option>
                      <option value="Students">Students Only</option>
                      <option value="Teachers">Faculty & Staff</option>
                      <option value="Parents">Parents Only</option>
                    </select>
                  </div>
                  <div className="wizard-field">
                    <label>Notice Category</label>
                    <select
                      value={announcementForm.category}
                      onChange={(e) => setAnnouncementForm({ ...announcementForm, category: e.target.value })}
                    >
                      <option value="General">General Campus Notice</option>
                      <option value="Academic">Academic / Examinations</option>
                      <option value="Sports">Sports & Cultural Events</option>
                      <option value="Holidays">Official Holidays</option>
                    </select>
                  </div>
                  <div className="wizard-field span-2">
                    <label>Detailed Announcement Notice <span className="req">*</span></label>
                    <textarea
                      rows="4"
                      placeholder="Enter the complete circular information text..."
                      required
                      value={announcementForm.content}
                      onChange={(e) => setAnnouncementForm({ ...announcementForm, content: e.target.value })}
                    ></textarea>
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #e2e8f0' }}>
                <button type="button" className="btn btn-outline btn-sm" onClick={() => setIsAnnouncementOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary btn-sm" style={{ padding: '8px 22px' }}>Publish Announcement ✓</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. Feedback Modal */}
      {feedback && (
        <div className="modal-overlay" style={{ display: 'flex' }}>
          <div className="modal-content" style={{ maxWidth: '440px', textAlign: 'center', padding: '30px 24px' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#dcfce7', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: '1.8rem' }}>
              ✓
            </div>
            <h3 style={{ color: 'var(--color-primary)', marginBottom: '10px' }}>{feedback.title}</h3>
            <p style={{ color: '#475569', fontSize: '0.92rem', lineHeight: 1.5, marginBottom: '24px' }}>{feedback.body}</p>
            <button className="btn btn-primary" onClick={() => setFeedback(null)} style={{ padding: '8px 30px', borderRadius: '50px' }}>
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* 5. Online Fee Payment Modal (Razorpay / UPI) */}
      {isPaymentModalOpen && (
        <div className="modal-overlay" style={{ display: 'flex' }}>
          <div className="modal-content" style={{ maxWidth: '480px' }}>
            <div className="modal-header">
              <h3>Secure Online Fee Checkout</h3>
              <button className="modal-close" onClick={() => setIsPaymentModalOpen(false)}>&times;</button>
            </div>
            <div style={{ padding: '20px' }}>
              <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Term-II School Fee:</span>
                  <span style={{ fontWeight: 800, fontSize: '1.25rem', color: '#1e3a8a' }}>₹12,500/-</span>
                </div>
                <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '4px' }}>
                  Student: Aishwarya Kumar (Grade 10-A, SSV Girls School)
                </div>
              </div>

              <div style={{ marginBottom: '18px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '8px' }}>Select Payment Mode</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                  {['UPI', 'Card', 'NetBanking'].map((m) => (
                    <button
                      key={m}
                      type="button"
                      className={`btn btn-sm ${paymentMethod === m ? 'btn-primary' : 'btn-outline'}`}
                      style={{ padding: '10px 4px', fontSize: '0.85rem' }}
                      onClick={() => setPaymentMethod(m)}
                    >
                      {m === 'UPI' ? '⚡ UPI / GPay' : m === 'Card' ? '💳 Debit/Credit' : '🏦 Net Banking'}
                    </button>
                  ))}
                </div>
              </div>

              {paymentMethod === 'UPI' && (
                <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', padding: '12px', borderRadius: '8px', textAlign: 'center', marginBottom: '20px' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#047857', marginBottom: '4px' }}>Instant UPI VPA</div>
                  <code>zenschool.ssv@hdfcbank</code>
                  <div style={{ fontSize: '0.75rem', color: '#065f46', marginTop: '4px' }}>Supports Google Pay, PhonePe, Paytm, BHIM</div>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', paddingTop: '12px', borderTop: '1px solid #e2e8f0' }}>
                <button type="button" className="btn btn-outline btn-sm" onClick={() => setIsPaymentModalOpen(false)}>
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={() => {
                    setIsPaymentModalOpen(false);
                    setFeedback({
                      title: 'Payment Successful',
                      body: '₹12,500/- received successfully via Razorpay/UPI gateway.\nReceipt REC-2026-118 generated & SMS acknowledgement sent.',
                    });
                  }}
                >
                  Pay ₹12,500 Securely ✓
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. Printable Official Student Report Card Modal */}
      {reportCardStudent && (
        <div className="modal-overlay" style={{ display: 'flex' }}>
          <div className="modal-content" style={{ maxWidth: '640px', padding: 0, overflow: 'hidden' }}>
            <div className="modal-header" style={{ padding: '14px 20px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
              <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#1e3a8a' }}>Official Academic Term Report Card</h3>
              <button className="modal-close" onClick={() => setReportCardStudent(null)}>&times;</button>
            </div>
            <div style={{ padding: '24px 28px' }} id="printable-report-card">
              <div style={{ textAlign: 'center', borderBottom: '2px solid #1e3a8a', paddingBottom: '14px', marginBottom: '18px' }}>
                <h3 style={{ margin: '0 0 4px 0', color: '#1e3a8a', fontSize: '1.3rem' }}>Sri Sankara Vidhyasala Girls High School</h3>
                <div style={{ fontSize: '0.85rem', color: '#64748b' }}>Affiliated to State Board &bull; Kodumudi, Tamil Nadu</div>
                <div style={{ fontWeight: 700, marginTop: '8px', fontSize: '0.95rem', color: '#0f172a' }}>
                  CONTINUOUS & COMPREHENSIVE EVALUATION (CCE) REPORT — 2026-27
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', background: '#f8fafc', padding: '12px 16px', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '18px', fontSize: '0.88rem' }}>
                <div>Student Name: <strong>{reportCardStudent.name}</strong></div>
                <div>Roll Number: <strong>{reportCardStudent.roll}</strong></div>
                <div>Standard / Section: <strong>{reportCardStudent.class}</strong></div>
                <div>Overall Attendance: <strong style={{ color: '#047857' }}>{reportCardStudent.attendance || '96%'}</strong></div>
              </div>

              <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '18px', fontSize: '0.88rem' }}>
                <thead>
                  <tr style={{ background: '#f1f5f9', borderBottom: '2px solid #cbd5e1' }}>
                    <th style={{ textAlign: 'left', padding: '8px 10px' }}>Subject</th>
                    <th style={{ textAlign: 'center', padding: '8px 10px' }}>Maximum</th>
                    <th style={{ textAlign: 'center', padding: '8px 10px' }}>Marks Scored</th>
                    <th style={{ textAlign: 'center', padding: '8px 10px' }}>Grade</th>
                  </tr>
                </thead>
                <tbody>
                  {(reportCardStudent.marks || []).map((m) => (
                    <tr key={m.subject} style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <td style={{ padding: '8px 10px' }}><strong>{m.subject}</strong></td>
                      <td style={{ textAlign: 'center', padding: '8px 10px' }}>{m.max}</td>
                      <td style={{ textAlign: 'center', padding: '8px 10px', fontWeight: 700 }}>{m.scored}</td>
                      <td style={{ textAlign: 'center', padding: '8px 10px' }}>
                        <span className={`badge ${m.grade === 'A+' || m.grade === 'A' ? 'badge-success' : 'badge-primary'}`}>
                          {m.grade}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '20px', fontSize: '0.85rem' }}>
                <strong>Class Teacher Remarks:</strong>
                <p style={{ margin: '4px 0 0 0', color: '#475569', fontStyle: 'italic' }}>
                  "Exemplary dedication in STEM and languages. Demonstrates keen analytical understanding and active participation."
                </p>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', paddingTop: '20px', borderTop: '1px dashed #cbd5e1', fontSize: '0.8rem', color: '#64748b' }}>
                <div>Class Teacher: <strong>Mrs. Priya Krishnan</strong></div>
                <div>Principal: <strong>Dr. Savithri Raman</strong></div>
                <div>Date of Issue: <strong>{new Date().toLocaleDateString()}</strong></div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', padding: '12px 20px', background: '#f8fafc', borderTop: '1px solid #e2e8f0' }}>
              <button type="button" className="btn btn-outline btn-sm" onClick={() => setReportCardStudent(null)}>
                Close
              </button>
              <button type="button" className="btn btn-primary btn-sm" onClick={() => window.print()} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 6 2 18 2 18 9" /><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" /><rect x="6" y="14" width="12" height="8" /></svg>
                Print / Save PDF Report Card
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Interactive Service Player Modal */}
      <InteractiveServicePlayerModal
        isOpen={!!activePlayService}
        service={activePlayService}
        onClose={() => setActivePlayService(null)}
      />
    </div>
  );
}
