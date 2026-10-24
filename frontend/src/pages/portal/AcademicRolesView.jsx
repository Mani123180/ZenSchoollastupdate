import React, { useState, useEffect, useRef } from 'react';
import * as XLSX from 'xlsx';
import {
  getPortalData,
  savePortalData
} from '../../services/portalData';
import ChatBox from './ChatBox';
import InteractiveServicePlayerModal from './InteractiveServicePlayerModal';
import { downloadStudyMaterialPDF } from '../../services/pdfDownloadUtil';

export default function AcademicRolesView({ role, user, activeTab, setActiveTab }) {
  const [data, setData] = useState(getPortalData());
  const [activePlayService, setActivePlayService] = useState(null);
  const [filterCategory, setFilterCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [teacherSelectedClass, setTeacherSelectedClass] = useState('Grade 10-A');

  // Modals state
  const [marksStudent, setMarksStudent] = useState(null);
  const [marksInputs, setMarksInputs] = useState({});
  const [selectedStudentDetail, setSelectedStudentDetail] = useState(null);
  const [isHomeworkOpen, setIsHomeworkOpen] = useState(false);
  const [homeworkForm, setHomeworkForm] = useState({
    title: '',
    grade: 'Grade 10-A',
    givenDate: new Date().toISOString().split('T')[0],
    due: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
    instructions: '',
    attachmentName: '',
  });

  // Study Materials Upload Modal State
  const [isMaterialModalOpen, setIsMaterialModalOpen] = useState(false);
  const [materialForm, setMaterialForm] = useState({
    title: '',
    grade: 'Grade 10-A',
    subject: 'Mathematics',
    description: '',
    fileName: '',
    fileSize: '2.5 MB',
    fileType: 'PDF'
  });
  const studyMaterialFileInputRef = useRef(null);
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
  const [analyticsModal, setAnalyticsModal] = useState(null);
  const [selectedAttendanceDate, setSelectedAttendanceDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [attendanceClassModal, setAttendanceClassModal] = useState(null);
  const [staffTimetableModal, setStaffTimetableModal] = useState(null);
  const [activeTimetableStaff, setActiveTimetableStaff] = useState(null);

  // Exam Scheduling State
  const [isExamModalOpen, setIsExamModalOpen] = useState(false);
  const [examGradeFilter, setExamGradeFilter] = useState('All');
  const [examForm, setExamForm] = useState({
    name: 'Midterm Examination 2026',
    subject: 'Mathematics',
    grade: 'Grade 10-A',
    date: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
    time: '09:30 AM - 12:30 PM',
    room: 'Hall A-1',
    maxMarks: 100,
    passMarks: 35,
    syllabus: 'Chapters 1 to 5: Algebra, Trigonometry and Statistics'
  });

  useEffect(() => {
    setData(getPortalData());

    const handleDataUpdate = (e) => {
      if (e && e.detail) {
        setData(e.detail);
      } else {
        setData(getPortalData());
      }
    };

    window.addEventListener('portal_data_updated', handleDataUpdate);
    window.addEventListener('storage', handleDataUpdate);

    return () => {
      window.removeEventListener('portal_data_updated', handleDataUpdate);
      window.removeEventListener('storage', handleDataUpdate);
    };
  }, [activeTab, role]);

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
      givenDate: homeworkForm.givenDate || new Date().toISOString().split('T')[0],
      due: homeworkForm.due,
      instructions: homeworkForm.instructions,
      attachmentName: homeworkForm.attachmentName || null,
      subject: 'Mathematics',
      assignedBy: user?.name || 'Mrs. Priya Krishnan',
      schoolId: 'SCHOOL002',
      assignedDate: homeworkForm.givenDate || new Date().toISOString().split('T')[0]
    };
    current.assignments.unshift(newHw);
    savePortalData(current);
    refreshData();
    setIsHomeworkOpen(false);
    setHomeworkForm({
      title: '',
      grade: 'Grade 10-A',
      givenDate: new Date().toISOString().split('T')[0],
      due: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      instructions: '',
      attachmentName: ''
    });
    setFeedback({
      title: 'Homework Assigned',
      body: `"${newHw.title}" has been published to ${newHw.grade} (Given: ${newHw.givenDate} | End Date: ${newHw.due})${newHw.attachmentName ? ` with attachment "${newHw.attachmentName}"` : ''}.`
    });
  };

  // Study Materials Upload & Delete Handlers
  const handleSaveStudyMaterial = (e) => {
    e.preventDefault();
    const current = getPortalData();
    if (!current.studyMaterials) current.studyMaterials = [];

    const newMaterial = {
      id: `MAT-${Date.now().toString().slice(-4)}`,
      title: materialForm.title,
      grade: materialForm.grade || 'Grade 10-A',
      subject: materialForm.subject || 'Mathematics',
      fileName: materialForm.fileName || `${materialForm.title.replace(/\s+/g, '_')}.pdf`,
      fileSize: materialForm.fileSize || '2.5 MB',
      fileType: materialForm.fileType || 'PDF',
      uploadedBy: user?.name || (role === 'teacher' ? 'Mrs. Priya Krishnan' : 'Faculty Member'),
      date: new Date().toISOString().split('T')[0],
      description: materialForm.description || 'Reference notes, problem sheets, and study materials.'
    };

    current.studyMaterials.unshift(newMaterial);
    savePortalData(current);
    refreshData();
    setIsMaterialModalOpen(false);
    setMaterialForm({
      title: '',
      grade: 'Grade 10-A',
      subject: 'Mathematics',
      description: '',
      fileName: '',
      fileSize: '2.5 MB',
      fileType: 'PDF'
    });
    setFeedback({
      title: 'Study Material Uploaded Successfully',
      body: `"${newMaterial.title}" (${newMaterial.fileName}) is now live and accessible by students of ${newMaterial.grade}.`
    });
  };

  const handleDeleteStudyMaterial = (matId) => {
    if (!window.confirm('Are you sure you want to delete this study material?')) return;
    const current = getPortalData();
    current.studyMaterials = (current.studyMaterials || []).filter((m) => m.id !== matId);
    savePortalData(current);
    refreshData();
    setFeedback({
      title: 'Study Material Deleted',
      body: 'The selected resource has been removed from the portal library.'
    });
  };

  // Exam Scheduling Handlers
  const handleSaveExam = (e) => {
    e.preventDefault();
    const current = getPortalData();
    if (!current.exams) current.exams = [];

    const newExam = {
      id: `EX-${Date.now().toString().slice(-4)}`,
      name: examForm.name,
      subject: examForm.subject,
      grade: examForm.grade,
      date: examForm.date,
      time: examForm.time || '09:30 AM - 12:30 PM',
      room: examForm.room || 'Examination Hall',
      maxMarks: parseInt(examForm.maxMarks) || 100,
      passMarks: parseInt(examForm.passMarks) || 35,
      syllabus: examForm.syllabus || 'As prescribed by State Board curriculum',
      status: 'Scheduled',
      uploadedBy: user?.name || (role === 'principal' ? 'Principal Office' : 'Faculty Member')
    };

    current.exams.unshift(newExam);
    savePortalData(current);
    refreshData();
    setIsExamModalOpen(false);
    setExamForm({
      name: 'Midterm Examination 2026',
      subject: 'Mathematics',
      grade: 'Grade 10-A',
      date: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      time: '09:30 AM - 12:30 PM',
      room: 'Hall A-1',
      maxMarks: 100,
      passMarks: 35,
      syllabus: 'Chapters 1 to 5: Algebra, Trigonometry and Statistics'
    });
    setFeedback({
      title: 'Exam Scheduled & Published',
      body: `Examination "${newExam.subject}" for ${newExam.grade} on ${newExam.date} has been published and is now visible to all students and parents.`
    });
  };

  const handleDeleteExam = (examId) => {
    if (!window.confirm('Are you sure you want to cancel and remove this scheduled examination?')) return;
    const current = getPortalData();
    current.exams = (current.exams || []).filter((x) => x.id !== examId);
    savePortalData(current);
    refreshData();
    setFeedback({
      title: 'Exam Removed',
      body: 'The examination timetable entry has been removed.'
    });
  };

  const excelFileInputRef = useRef(null);

  // Teacher Student Excel Upload Handler
  const handleStudentExcelUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const rows = XLSX.utils.sheet_to_json(ws, { header: 1 });

        if (!rows || rows.length <= 1) {
          alert('Excel file is empty or missing data rows.');
          return;
        }

        const current = getPortalData();
        let addedCount = 0;
        let updatedCount = 0;

        rows.forEach((row, idx) => {
          if (!row || row.length === 0) return;
          const colRoll = String(row[0] || '').trim();
          const colName = String(row[1] || '').trim();
          const colClass = String(row[2] || 'Grade 10-A').trim();
          const colAttendance = String(row[3] || '95%').trim();
          const colMath = String(row[4] !== undefined ? row[4] : '').trim();
          const colPhy = String(row[5] !== undefined ? row[5] : '').trim();
          const colChem = String(row[6] !== undefined ? row[6] : '').trim();
          const colTam = String(row[7] !== undefined ? row[7] : '').trim();
          const colEng = String(row[8] !== undefined ? row[8] : '').trim();
          const colPerf = String(row[9] || 'Good').trim();

          // Skip headers row
          if (
            idx === 0 &&
            (colRoll.toLowerCase().includes('roll') ||
              colName.toLowerCase().includes('name') ||
              colName.toLowerCase().includes('student'))
          ) {
            return;
          }

          if (colRoll && colName) {
            const formatMark = (sub, val) => {
              if (val.toUpperCase() === 'AB' || val.toUpperCase() === 'ABSENT') {
                return { subject: sub, max: 100, scored: 'AB', grade: 'AB' };
              }
              const num = parseInt(val, 10);
              if (isNaN(num)) return { subject: sub, max: 100, scored: 80, grade: 'A' };
              let g = 'F';
              if (num >= 90) g = 'A+';
              else if (num >= 80) g = 'A';
              else if (num >= 70) g = 'B';
              else if (num >= 60) g = 'C';
              else if (num >= 50) g = 'D';
              return { subject: sub, max: 100, scored: num, grade: g };
            };

            const marksArray = [
              formatMark('Mathematics', colMath || '85'),
              formatMark('Physics', colPhy || '80'),
              formatMark('Chemistry', colChem || '78'),
              formatMark('Tamil', colTam || '88'),
              formatMark('English', colEng || '82'),
            ];

            const existingIdx = current.students.findIndex(
              (s) => s.roll.toLowerCase() === colRoll.toLowerCase()
            );

            if (existingIdx >= 0) {
              current.students[existingIdx] = {
                ...current.students[existingIdx],
                name: colName,
                class: colClass || current.students[existingIdx].class,
                attendance: colAttendance.includes('%') ? colAttendance : `${colAttendance}%`,
                marks: marksArray,
                performance: colPerf || current.students[existingIdx].performance,
              };
              updatedCount++;
            } else {
              current.students.push({
                roll: colRoll,
                name: colName,
                class: colClass || 'Grade 10-A',
                schoolId: 'SCHOOL002',
                attendance: colAttendance.includes('%') ? colAttendance : `${colAttendance}%`,
                performance: colPerf || 'Good',
                marks: marksArray,
              });
              addedCount++;
            }
          }
        });

        savePortalData(current);
        refreshData();

        if (excelFileInputRef.current) {
          excelFileInputRef.current.value = '';
        }

        setFeedback({
          title: 'Excel Students Upload Successful',
          body: `Processed spreadsheet: ${addedCount} new student(s) added, ${updatedCount} existing student(s) updated in Grade Book.`,
        });
      } catch (err) {
        console.error('Error importing Excel:', err);
        alert('Failed to parse Excel file. Please ensure it is a valid .xlsx or .xls spreadsheet.');
      }
    };
    reader.readAsBinaryString(file);
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
        {/* PRINCIPAL DASHBOARD TABS */}
        {/* =================================================================== */}
        {role === 'principal' && activeTab === 'attendance-reports' && (() => {
          const selDateObj = new Date(selectedAttendanceDate);
          const isSunday = selDateObj.getDay() === 0;
          const formattedDateStr = selDateObj.toLocaleDateString('en-IN', {
            weekday: 'long',
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          });

          // All sections master list
          const classSections = [
            { cls: 'Grade 10-A', section: 'A', stream: 'General / CBSE', teacher: 'Mrs. Priya Krishnan', room: 'Room 201', total: 38, basePresent: 36 },
            { cls: 'Grade 10-B', section: 'B', stream: 'General / CBSE', teacher: 'Mr. Ramanathan K.', room: 'Room 202', total: 37, basePresent: 36 },
            { cls: 'Grade 11-A', section: 'A', stream: 'Science (Bio-Maths)', teacher: 'Dr. Anandhi Rajan', room: 'Science Block 101', total: 40, basePresent: 39 },
            { cls: 'Grade 11-B', section: 'B', stream: 'Commerce & Accounts', teacher: 'Mrs. Jayanthi S.', room: 'Room 304', total: 39, basePresent: 37 },
            { cls: 'Grade 12-A', section: 'A', stream: 'Science (Computer)', teacher: 'Mr. Anand Narayanan', room: 'Lab 2', total: 42, basePresent: 41 },
            { cls: 'Grade 12-B', section: 'B', stream: 'Commerce & Economics', teacher: 'Mrs. Chitra Devi', room: 'Room 306', total: 41, basePresent: 39 },
            { cls: 'Grade 9-A', section: 'A', stream: 'Secondary', teacher: 'Mrs. Selvi Murugan', room: 'Room 105', total: 36, basePresent: 34 },
            { cls: 'Grade 9-B', section: 'B', stream: 'Secondary', teacher: 'Mr. V. Balaji', room: 'Room 106', total: 35, basePresent: 33 },
            { cls: 'Grade 8-A', section: 'A', stream: 'Middle School', teacher: 'Ms. Meena Kumari', room: 'Room 101', total: 36, basePresent: 35 },
            { cls: 'Grade 8-B', section: 'B', stream: 'Middle School', teacher: 'Ms. K. Suganthi', room: 'Room 102', total: 35, basePresent: 33 },
            { cls: 'Grade 7-A', section: 'A', stream: 'Middle School', teacher: 'Mrs. Lakshmi Narayanan', room: 'Room G-3', total: 34, basePresent: 33 },
            { cls: 'Grade 6-A', section: 'A', stream: 'Upper Primary', teacher: 'Mr. K. Parthiban', room: 'Room G-1', total: 33, basePresent: 31 },
          ];

          // Deterministic seed by date
          const dateSeed = (selDateObj.getDate() * 3 + selDateObj.getMonth()) % 5;
          const processedClasses = classSections.map((item, idx) => {
            if (isSunday) {
              return { ...item, present: 0, absent: 0, pct: '0%', status: 'Sunday Holiday' };
            }
            const offset = (idx + dateSeed) % 3 === 0 ? 1 : 0;
            const present = Math.min(item.total, Math.max(item.total - 4, item.basePresent - offset));
            const absent = item.total - present;
            const pct = ((present / item.total) * 100).toFixed(1) + '%';
            const status = parseFloat(pct) >= 97 ? 'Top Performing' : parseFloat(pct) >= 94 ? 'Normal' : 'Attention';
            return { ...item, present, absent, pct, status };
          });

          const totalAll = classSections.reduce((s, c) => s + c.total, 0);
          const presentAll = isSunday ? 0 : processedClasses.reduce((s, c) => s + c.present, 0);
          const absentAll = isSunday ? 0 : totalAll - presentAll;
          const avgRate = isSunday ? '0.0%' : ((presentAll / totalAll) * 100).toFixed(1) + '%';

          return (
            <div>
              {/* Top Controls & Filter Header */}
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '14px',
                  padding: '16px 20px',
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  marginBottom: '20px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                }}
              >
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.15rem', color: '#1e293b', fontWeight: 800 }}>
                    📊 Campus Attendance Reports — Class & Section Directory
                  </h3>
                  <p style={{ margin: '3px 0 0 0', fontSize: '0.82rem', color: '#64748b' }}>
                    Select date to audit daily registers &bull; Click any class to view student-wise attendance
                  </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>
                    Audit Date:
                  </label>
                  <input
                    type="date"
                    value={selectedAttendanceDate}
                    onChange={(e) => setSelectedAttendanceDate(e.target.value)}
                    max={new Date().toISOString().split('T')[0]}
                    style={{
                      padding: '7px 12px',
                      border: '1.5px solid #2563eb',
                      borderRadius: '8px',
                      fontWeight: 700,
                      color: '#1e3a8a',
                      background: '#eff6ff',
                      fontSize: '0.9rem',
                      cursor: 'pointer',
                    }}
                  />
                  <button
                    type="button"
                    className="btn btn-outline btn-sm"
                    onClick={() => setSelectedAttendanceDate(new Date().toISOString().split('T')[0])}
                  >
                    Today
                  </button>
                </div>
              </div>

              {/* KPI Summary Cards */}
              <div className="grid-4" style={{ marginBottom: '22px' }}>
                <div className="portal-card" style={{ borderLeftColor: '#3b82f6', padding: '16px 18px' }}>
                  <div style={{ fontSize: '0.78rem', textTransform: 'uppercase', color: '#64748b', fontWeight: 700 }}>Total Registered Classes</div>
                  <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#1e3a8a', margin: '4px 0' }}>12 Sections</div>
                  <span style={{ fontSize: '0.75rem', color: '#2563eb', fontWeight: 600 }}>Grade 6 to Grade 12</span>
                </div>

                <div className="portal-card" style={{ borderLeftColor: '#10b981', padding: '16px 18px' }}>
                  <div style={{ fontSize: '0.78rem', textTransform: 'uppercase', color: '#64748b', fontWeight: 700 }}>Overall Attendance %</div>
                  <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#047857', margin: '4px 0' }}>{avgRate}</div>
                  <span style={{ fontSize: '0.75rem', color: '#16a34a', fontWeight: 600 }}>
                    {presentAll} Students Present Today
                  </span>
                </div>

                <div className="portal-card" style={{ borderLeftColor: '#f59e0b', padding: '16px 18px' }}>
                  <div style={{ fontSize: '0.78rem', textTransform: 'uppercase', color: '#64748b', fontWeight: 700 }}>Absentees Count</div>
                  <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#b45309', margin: '4px 0' }}>{absentAll} Students</div>
                  <span style={{ fontSize: '0.75rem', color: '#d97706', fontWeight: 600 }}>Parent SMS Alerts Sent ✓</span>
                </div>

                <div className="portal-card" style={{ borderLeftColor: '#8b5cf6', padding: '16px 18px' }}>
                  <div style={{ fontSize: '0.78rem', textTransform: 'uppercase', color: '#64748b', fontWeight: 700 }}>Audit Date</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#6d28d9', margin: '6px 0' }}>
                    {selDateObj.toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </div>
                  <span style={{ fontSize: '0.75rem', color: '#7c3aed', fontWeight: 600 }}>{selDateObj.toLocaleDateString('en-IN', { weekday: 'long' })}</span>
                </div>
              </div>

              {/* Class & Section Table with Clickable Rows */}
              <div className="portal-card" style={{ borderLeftColor: '#2563eb', padding: '20px' }}>
                <div className="portal-card-header" style={{ marginBottom: '14px', borderBottom: '1px solid #f1f5f9', paddingBottom: '10px' }}>
                  <div>
                    <span className="portal-card-title" style={{ fontSize: '1.05rem' }}>
                      📋 Class-Wise Attendance Roster ({formattedDateStr})
                    </span>
                    <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '2px' }}>
                      Click on any class name or the <strong>"View Attendance &rarr;"</strong> button to open student-by-student roll call
                    </div>
                  </div>
                  <span className="badge badge-primary">Interactive Directory</span>
                </div>

                <div className="table-responsive">
                  <table className="sa-schools-table">
                    <thead>
                      <tr>
                        <th>Class & Section</th>
                        <th>Stream / Academic Level</th>
                        <th>Class Teacher</th>
                        <th>Room</th>
                        <th style={{ textAlign: 'center' }}>Total</th>
                        <th style={{ textAlign: 'center' }}>Present</th>
                        <th style={{ textAlign: 'center' }}>Absent</th>
                        <th style={{ textAlign: 'center' }}>Rate</th>
                        <th style={{ textAlign: 'center' }}>Status</th>
                        <th style={{ textAlign: 'center' }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {processedClasses.map((item) => (
                        <tr
                          key={item.cls}
                          style={{ cursor: 'pointer', transition: 'background 0.15s ease' }}
                          onClick={() => setAttendanceClassModal({ ...item, date: formattedDateStr })}
                          title={`Click to view student attendance for ${item.cls}`}
                        >
                          <td data-label="Class & Section">
                            <strong style={{ color: '#1e40af', fontSize: '0.94rem' }}>{item.cls}</strong>
                          </td>
                          <td data-label="Stream / Level">
                            <span style={{ fontSize: '0.82rem', color: '#475569' }}>{item.stream}</span>
                          </td>
                          <td data-label="Class Teacher">
                            <strong>{item.teacher}</strong>
                          </td>
                          <td data-label="Room">
                            <code>{item.room}</code>
                          </td>
                          <td data-label="Total" style={{ textAlign: 'center' }}>
                            <strong>{item.total}</strong>
                          </td>
                          <td data-label="Present" style={{ textAlign: 'center' }}>
                            <span style={{ color: '#16a34a', fontWeight: 800 }}>{item.present}</span>
                          </td>
                          <td data-label="Absent" style={{ textAlign: 'center' }}>
                            <span style={{ color: item.absent > 0 ? '#dc2626' : '#94a3b8', fontWeight: 800 }}>
                              {item.absent}
                            </span>
                          </td>
                          <td data-label="Rate" style={{ textAlign: 'center' }}>
                            <span
                              className={`badge ${
                                isSunday
                                  ? 'badge-warning'
                                  : parseFloat(item.pct) >= 97
                                  ? 'badge-success'
                                  : parseFloat(item.pct) >= 94
                                  ? 'badge-primary'
                                  : 'badge-warning'
                              }`}
                            >
                              {item.pct}
                            </span>
                          </td>
                          <td data-label="Status" style={{ textAlign: 'center' }}>
                            <span
                              style={{
                                fontSize: '0.78rem',
                                color: item.status.includes('Top') ? '#16a34a' : item.status === 'Normal' ? '#2563eb' : '#d97706',
                                fontWeight: 700,
                              }}
                            >
                              {item.status}
                            </span>
                          </td>
                          <td data-label="Action" style={{ textAlign: 'center' }}>
                            <button
                              type="button"
                              className="btn btn-outline btn-sm"
                              style={{
                                padding: '4px 10px',
                                fontSize: '0.75rem',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                color: '#2563eb',
                                borderColor: '#93c5fd',
                              }}
                              onClick={(e) => {
                                e.stopPropagation();
                                setAttendanceClassModal({ ...item, date: formattedDateStr });
                              }}
                            >
                              <span>View Attendance</span>
                              <span>&rarr;</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          );
        })()}

        {/* Dashboard Analytics (Principal Master KPI & Overview) */}
        {role === 'principal' && (activeTab === 'dashboard-analytics' || activeTab === 'academic-performance') && (
          <div>
            {/* Top Metric KPI Cards - Clickable Drilldown */}
            <div className="grid-4" style={{ marginBottom: '24px' }}>
              {/* 1. Total Enrolled Students */}
              <div
                className="portal-card clickable-card"
                style={{
                  borderLeftColor: '#3b82f6',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  padding: '18px 20px',
                  background: '#ffffff',
                }}
                title="Click to view full class-wise enrollment & section distribution"
                onClick={() => setAnalyticsModal('students')}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.78rem', textTransform: 'uppercase', color: '#64748b', fontWeight: 700, letterSpacing: '0.04em' }}>
                      Total Enrolled Students
                    </span>
                    <span style={{ fontSize: '1.25rem' }}>🎓</span>
                  </div>
                  <div style={{ fontSize: '2rem', fontWeight: 800, color: '#1e3a8a', margin: '8px 0 4px 0', lineHeight: 1.1 }}>
                    {data.students?.length ? data.students.length * 160 + 2 : 482}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#16a34a', fontWeight: 600 }}>
                    ↑ +12% YoY &bull; 16 Sections Active
                  </div>
                </div>

                <div
                  style={{
                    marginTop: '16px',
                    paddingTop: '12px',
                    borderTop: '1px solid #f1f5f9',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#2563eb' }}>
                    View Class Breakdown
                  </span>
                  <span
                    style={{
                      background: '#eff6ff',
                      color: '#2563eb',
                      width: '26px',
                      height: '26px',
                      borderRadius: '50%',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.85rem',
                      fontWeight: 700,
                    }}
                  >
                    &rarr;
                  </span>
                </div>
              </div>

              {/* 2. Overall Daily Attendance with Date Picker */}
              <div
                className="portal-card clickable-card"
                style={{
                  borderLeftColor: '#10b981',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  padding: '18px 20px',
                  background: '#ffffff',
                }}
                title="Click to view class-wise attendance report"
                onClick={() => setAnalyticsModal('attendance')}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.78rem', textTransform: 'uppercase', color: '#64748b', fontWeight: 700, letterSpacing: '0.04em' }}>
                      Overall Daily Attendance
                    </span>
                    <span style={{ fontSize: '1.25rem' }}>📅</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', margin: '8px 0 4px 0' }}>
                    <div style={{ fontSize: '2rem', fontWeight: 800, color: '#047857', lineHeight: 1.1 }}>
                      {(() => {
                        // Deterministic variation based on selected date
                        const d = new Date(selectedAttendanceDate);
                        const day = d.getDay();
                        if (day === 0) return 'Holiday (Sun)';
                        if (day === 6) return '96.8%';
                        if (day === 1) return '97.2%';
                        if (day === 5) return '94.6%';
                        return '95.4%';
                      })()}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '4px' }}>
                    <div style={{ fontSize: '0.75rem', color: '#16a34a', fontWeight: 600 }}>
                      ✓ Benchmark: 95.0%
                    </div>
                    {/* Inline Quick Date Selector */}
                    <div
                      onClick={(e) => e.stopPropagation()}
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                    >
                      <input
                        type="date"
                        value={selectedAttendanceDate}
                        onChange={(e) => setSelectedAttendanceDate(e.target.value)}
                        max={new Date().toISOString().split('T')[0]}
                        style={{
                          fontSize: '0.74rem',
                          padding: '2px 6px',
                          border: '1px solid #cbd5e1',
                          borderRadius: '6px',
                          color: '#0f172a',
                          background: '#f8fafc',
                          fontWeight: 600,
                          cursor: 'pointer',
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    marginTop: '16px',
                    paddingTop: '12px',
                    borderTop: '1px solid #f1f5f9',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#059669' }}>
                    View Class Attendance
                  </span>
                  <span
                    style={{
                      background: '#ecfdf5',
                      color: '#059669',
                      width: '26px',
                      height: '26px',
                      borderRadius: '50%',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.85rem',
                      fontWeight: 700,
                    }}
                  >
                    &rarr;
                  </span>
                </div>
              </div>

              {/* 3. Teaching Staff On Duty */}
              <div
                className="portal-card clickable-card"
                style={{
                  borderLeftColor: '#f59e0b',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  padding: '18px 20px',
                  background: '#ffffff',
                }}
                title="Click to view faculty duty and leave roster"
                onClick={() => setAnalyticsModal('staff')}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.78rem', textTransform: 'uppercase', color: '#64748b', fontWeight: 700, letterSpacing: '0.04em' }}>
                      Teaching Staff On Duty
                    </span>
                    <span style={{ fontSize: '1.25rem' }}>👩‍🏫</span>
                  </div>
                  <div style={{ fontSize: '2rem', fontWeight: 800, color: '#b45309', margin: '8px 0 4px 0', lineHeight: 1.1 }}>
                    {data.teachers?.length || 32} / { (data.teachers?.length || 32) + 2 }
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>
                    2 On Leave &bull; 100% Classes Covered
                  </div>
                </div>

                <div
                  style={{
                    marginTop: '16px',
                    paddingTop: '12px',
                    borderTop: '1px solid #f1f5f9',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#d97706' }}>
                    View Faculty Roster
                  </span>
                  <span
                    style={{
                      background: '#fffbeb',
                      color: '#d97706',
                      width: '26px',
                      height: '26px',
                      borderRadius: '50%',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.85rem',
                      fontWeight: 700,
                    }}
                  >
                    &rarr;
                  </span>
                </div>
              </div>

              {/* 4. Pass Percentage */}
              <div
                className="portal-card clickable-card"
                style={{
                  borderLeftColor: '#8b5cf6',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  padding: '18px 20px',
                  background: '#ffffff',
                }}
                title="Click to view grade-wise pass percentage & board results"
                onClick={() => setAnalyticsModal('results')}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.78rem', textTransform: 'uppercase', color: '#64748b', fontWeight: 700, letterSpacing: '0.04em' }}>
                      Pass Percentage (Board Exam)
                    </span>
                    <span style={{ fontSize: '1.25rem' }}>🏆</span>
                  </div>
                  <div style={{ fontSize: '2rem', fontWeight: 800, color: '#6d28d9', margin: '8px 0 4px 0', lineHeight: 1.1 }}>
                    98.2%
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#16a34a', fontWeight: 600 }}>
                    ↑ +2.4% vs Previous Year
                  </div>
                </div>

                <div
                  style={{
                    marginTop: '16px',
                    paddingTop: '12px',
                    borderTop: '1px solid #f1f5f9',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#7c3aed' }}>
                    View Subject Scores
                  </span>
                  <span
                    style={{
                      background: '#f5f3ff',
                      color: '#7c3aed',
                      width: '26px',
                      height: '26px',
                      borderRadius: '50%',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.85rem',
                      fontWeight: 700,
                    }}
                  >
                    &rarr;
                  </span>
                </div>
              </div>
            </div>

            {/* Academic Performance Breakdown (Full Width) */}
            <div style={{ marginBottom: '24px' }}>
              <div className="portal-card" style={{ borderLeftColor: '#1e3a8a', background: '#ffffff', padding: '20px' }}>
                <div className="portal-card-header" style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '12px', marginBottom: '16px' }}>
                  <span className="portal-card-title" style={{ fontSize: '1.05rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    📊 Academic Performance & Grading Distribution
                  </span>
                  <span className="badge badge-info" style={{ fontSize: '0.75rem' }}>Term 2 Exam Review</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', marginBottom: '6px' }}>
                      <span style={{ fontWeight: 600, color: '#1e293b' }}>Distinction / Grade A+ (85% - 100%)</span>
                      <strong style={{ color: '#16a34a' }}>148 Students (38%)</strong>
                    </div>
                    <div style={{ height: '10px', background: '#e2e8f0', borderRadius: '5px', overflow: 'hidden' }}>
                      <div style={{ width: '38%', height: '100%', background: '#16a34a', borderRadius: '5px' }}></div>
                    </div>
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', marginBottom: '6px' }}>
                      <span style={{ fontWeight: 600, color: '#1e293b' }}>First Class / Grade A (70% - 84%)</span>
                      <strong style={{ color: '#2563eb' }}>186 Students (48%)</strong>
                    </div>
                    <div style={{ height: '10px', background: '#e2e8f0', borderRadius: '5px', overflow: 'hidden' }}>
                      <div style={{ width: '48%', height: '100%', background: '#2563eb', borderRadius: '5px' }}></div>
                    </div>
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', marginBottom: '6px' }}>
                      <span style={{ fontWeight: 600, color: '#1e293b' }}>Second Class / Grade B (50% - 69%)</span>
                      <strong style={{ color: '#f59e0b' }}>42 Students (11%)</strong>
                    </div>
                    <div style={{ height: '10px', background: '#e2e8f0', borderRadius: '5px', overflow: 'hidden' }}>
                      <div style={{ width: '11%', height: '100%', background: '#f59e0b', borderRadius: '5px' }}></div>
                    </div>
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', marginBottom: '6px' }}>
                      <span style={{ fontWeight: 600, color: '#1e293b' }}>Remedial Coaching Needed (&lt; 50%)</span>
                      <strong style={{ color: '#ef4444' }}>12 Students (3%)</strong>
                    </div>
                    <div style={{ height: '10px', background: '#e2e8f0', borderRadius: '5px', overflow: 'hidden' }}>
                      <div style={{ width: '3%', height: '100%', background: '#ef4444', borderRadius: '5px' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Classroom Attendance & Performance Summary Table */}
            <div className="portal-card" style={{ borderLeftColor: '#6366f1' }}>
              <div className="portal-card-header">
                <div>
                  <span className="portal-card-title" style={{ fontSize: '1.05rem' }}>
                    📋 Grade-Wise Academic & Attendance Operational Summary
                  </span>
                  <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '2px' }}>
                    Real-time compilation across all sections for Principal review
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <span className="badge badge-info">Term 2 Academic Session</span>
                </div>
              </div>

              <div className="table-responsive" style={{ marginTop: '12px' }}>
                <table className="sa-schools-table">
                  <thead>
                    <tr>
                      <th>Class & Section</th>
                      <th>Class Teacher</th>
                      <th>Total Enrolled</th>
                      <th>Today's Present</th>
                      <th>Attendance Rate</th>
                      <th>Average Exam Score</th>
                      <th>Academic Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><strong>Grade 10-A</strong></td>
                      <td>Mrs. Priya Krishnan</td>
                      <td>38</td>
                      <td><span style={{ color: '#16a34a', fontWeight: 700 }}>36</span></td>
                      <td><span className="badge badge-success">94.7%</span></td>
                      <td><strong>88.4%</strong></td>
                      <td><span className="badge badge-success">Distinction Batch</span></td>
                    </tr>
                    <tr>
                      <td><strong>Grade 11-B</strong></td>
                      <td>Dr. Anandhi Rajan</td>
                      <td>40</td>
                      <td><span style={{ color: '#16a34a', fontWeight: 700 }}>39</span></td>
                      <td><span className="badge badge-success">97.5%</span></td>
                      <td><strong>84.2%</strong></td>
                      <td><span className="badge badge-success">Excellent</span></td>
                    </tr>
                    <tr>
                      <td><strong>Grade 9-A</strong></td>
                      <td>Mrs. Selvi Murugan</td>
                      <td>36</td>
                      <td><span style={{ color: '#16a34a', fontWeight: 700 }}>34</span></td>
                      <td><span className="badge badge-success">94.4%</span></td>
                      <td><strong>81.5%</strong></td>
                      <td><span className="badge badge-info">Good</span></td>
                    </tr>
                    <tr>
                      <td><strong>Grade 12-A</strong></td>
                      <td>Mr. Anand Narayanan</td>
                      <td>42</td>
                      <td><span style={{ color: '#16a34a', fontWeight: 700 }}>41</span></td>
                      <td><span className="badge badge-success">97.6%</span></td>
                      <td><strong>91.0%</strong></td>
                      <td><span className="badge badge-success">Board Exam Focus</span></td>
                    </tr>
                    <tr>
                      <td><strong>Grade 8-B</strong></td>
                      <td>Ms. K. Suganthi</td>
                      <td>35</td>
                      <td><span style={{ color: '#16a34a', fontWeight: 700 }}>33</span></td>
                      <td><span className="badge badge-warning">94.2%</span></td>
                      <td><strong>79.8%</strong></td>
                      <td><span className="badge badge-info">Normal</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
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
                      <td data-label="Ref ID"><code>{lv.id}</code></td>
                      <td data-label="Faculty Member">
                        <button
                          type="button"
                          onClick={() =>
                            setStaffTimetableModal({
                              name: lv.teacher,
                              dept: lv.subject,
                              cls: 'All Grades',
                              status: lv.status === 'Approved' ? 'On Leave' : 'On Duty'
                            })
                          }
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#1d4ed8',
                            fontWeight: 700,
                            padding: 0,
                            cursor: 'pointer',
                            textDecoration: 'underline',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                          title="Click to view weekly faculty timetable"
                        >
                          📅 {lv.teacher}
                        </button>
                      </td>
                      <td data-label="Department">{lv.subject}</td>
                      <td data-label="Leave Dates">{lv.dates}</td>
                      <td data-label="Reason / Purpose">{lv.reason}</td>
                      <td data-label="Status" style={{ textAlign: 'center' }}>
                        <span className={`badge ${lv.status === 'Approved' ? 'badge-success' : lv.status === 'Rejected' ? 'badge-danger' : 'badge-warning'}`}>
                          {lv.status}
                        </span>
                      </td>
                      <td data-label="Principal Action" style={{ textAlign: 'center' }}>
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
        {/* =================================================================== */}
        {/* =================================================================== */}
        {/* TEACHER DASHBOARD TABS */}
        {/* =================================================================== */}
        {role === 'teacher' && activeTab === 'my-classes' && (() => {
          const currentClassInfo = {
            id: 'Grade 10-A',
            name: 'Grade 10 - Section A',
            subject: 'Mathematics'
          };

          const classStudents = data.students.filter((s) => s.class === currentClassInfo.id);
          const totalCount = classStudents.length;

          return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

              {/* Top Banner with Total Students */}
              <div
                className="portal-card"
                style={{
                  margin: 0,
                  borderLeft: '4px solid var(--color-primary)',
                  background: '#ffffff',
                  borderRadius: '12px',
                  padding: '20px 24px',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.04)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '16px'
                }}
              >
                <div>
                  <h2 style={{ margin: 0, fontSize: '1.4rem', color: 'var(--color-primary)', fontWeight: 800 }}>
                    {currentClassInfo.name}
                  </h2>
                  <p style={{ margin: '4px 0 0 0', color: '#64748b', fontSize: '0.9rem' }}>
                    Subject: <strong>{currentClassInfo.subject}</strong> &bull; Click any student to view Result, Exam Marks, Parent Name & Phone Number.
                  </p>
                </div>

                <div
                  style={{
                    background: 'linear-gradient(135deg, #1e3a8a, #2563eb)',
                    color: '#ffffff',
                    padding: '12px 24px',
                    borderRadius: '10px',
                    textAlign: 'center',
                    minWidth: '160px',
                    boxShadow: '0 4px 12px rgba(37,99,235,0.25)'
                  }}
                >
                  <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600, opacity: 0.9 }}>
                    Total Students
                  </div>
                  <div style={{ fontSize: '1.9rem', fontWeight: 800, lineHeight: 1.1, marginTop: '2px' }}>
                    {totalCount}
                  </div>
                  <div style={{ fontSize: '0.74rem', opacity: 0.85, marginTop: '2px' }}>
                    Enrolled in this class
                  </div>
                </div>
              </div>

              {/* Students List Table */}
              <div className="portal-card" style={{ margin: 0, borderRadius: '12px', padding: '20px 24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
                  <h3 style={{ margin: 0, fontSize: '1.05rem', color: '#0f172a', fontWeight: 700 }}>
                    Students in {currentClassInfo.name} ({totalCount})
                  </h3>
                  <span style={{ fontSize: '0.82rem', color: '#64748b' }}>
                    💡 Click on any student row or "View Result & Parent Details"
                  </span>
                </div>

                <div className="table-responsive">
                  <table className="sa-schools-table">
                    <thead>
                      <tr>
                        <th>Roll No</th>
                        <th>Student Name</th>
                        <th>Parent / Guardian</th>
                        <th>Parent Phone</th>
                        <th>Academic Standing</th>
                        <th style={{ textAlign: 'right' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {classStudents.length === 0 ? (
                        <tr>
                          <td colSpan="6" style={{ textAlign: 'center', padding: '30px', color: '#64748b' }}>
                            No students enrolled in this section. Upload students list from Student List tab.
                          </td>
                        </tr>
                      ) : (
                        classStudents.map((s) => (
                          <tr
                            key={s.roll}
                            onClick={() => setSelectedStudentDetail(s)}
                            style={{ cursor: 'pointer', transition: 'background 0.15s ease' }}
                            title="Click to view Exam Results and Parent Contact Information"
                          >
                            <td>
                              <code style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--color-primary)' }}>
                                {s.roll}
                              </code>
                            </td>
                            <td>
                              <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.94rem' }}>{s.name}</div>
                              <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Attendance: {s.attendance || '95%'}</span>
                            </td>
                            <td>
                              <div style={{ fontWeight: 600, color: '#334155', fontSize: '0.88rem' }}>
                                👨‍👩‍👦 {s.parentName || 'Mr. Guardian'}
                              </div>
                            </td>
                            <td>
                              <a
                                href={`tel:${s.parentPhone || '+91 98401 22334'}`}
                                onClick={(e) => e.stopPropagation()}
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '5px',
                                  color: '#059669',
                                  fontWeight: 600,
                                  fontSize: '0.86rem',
                                  textDecoration: 'none'
                                }}
                              >
                                📞 {s.parentPhone || '+91 98401 22334'}
                              </a>
                            </td>
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
                                {s.performance || 'Good'}
                              </span>
                            </td>
                            <td className="sa-actions-cell" style={{ justifyContent: 'flex-end' }}>
                              <button
                                type="button"
                                className="btn btn-primary btn-sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedStudentDetail(s);
                                }}
                                style={{ padding: '5px 12px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                              >
                                <span>📊</span>
                                View Result & Details
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          );
        })()}

        {role === 'teacher' && activeTab === 'student-list' && (
          <div>
            <div className="sa-schools-header-bar" style={{ marginBottom: '16px' }}>
              <div className="sa-filter-segment">
                <button className="sa-filter-tab active">
                  Assigned: Grade 10-A
                  <span className="sa-filter-count">{data.students.filter((s) => s.class === 'Grade 10-A').length}</span>
                </button>
              </div>
              <div className="sa-toolbar-right" style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
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

                {/* Hidden Excel File Input */}
                <input
                  type="file"
                  ref={excelFileInputRef}
                  style={{ display: 'none' }}
                  accept=".xlsx, .xls, .csv"
                  onChange={handleStudentExcelUpload}
                />

                {/* Upload Excel Button */}
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={() => excelFileInputRef.current && excelFileInputRef.current.click()}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                  title="Upload students list from Excel (.xlsx/.xls/.csv)"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
                  Upload Excel (.XLSX)
                </button>

                {/* Export Grade Book CSV */}
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  onClick={handleExportGradeBook}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
                  Export Grade Book
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
                    const todayStr = new Date().toISOString().split('T')[0];
                    const current = getPortalData();
                    if (!current.attendanceLogs) {
                      current.attendanceLogs = [];
                    }

                    // Remove any existing log for this date & class
                    const updatedLogs = current.attendanceLogs.filter(
                      (l) => !(l.date === todayStr && l.className === 'Grade 10-A')
                    );

                    // Add new log entry
                    const newLog = {
                      date: todayStr,
                      className: 'Grade 10-A',
                      markedBy: user?.name || 'Mrs. Priya Krishnan',
                      timestamp: new Date().toISOString(),
                      records: { ...rollCall }
                    };
                    updatedLogs.unshift(newLog);
                    current.attendanceLogs = updatedLogs;

                    // Update student attendance percentages dynamically
                    current.students = current.students.map((st) => {
                      if (st.class === 'Grade 10-A' && rollCall[st.roll] !== undefined) {
                        const status = rollCall[st.roll];
                        // Calculate total logs for this student
                        const studentLogs = updatedLogs.filter((l) => l.className === 'Grade 10-A' && l.records && l.records[st.roll]);
                        const totalDays = studentLogs.length;
                        const presentDays = studentLogs.filter((l) => l.records[st.roll] === 'present').length;
                        const pct = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : (status === 'present' ? 100 : 0);
                        return {
                          ...st,
                          attendance: `${pct}%`,
                          todayStatus: status
                        };
                      }
                      return st;
                    });

                    savePortalData(current);
                    setData(current);

                    const presentCount = Object.values(rollCall).filter((v) => v === 'present').length;
                    const total = data.students.filter((s) => s.class === 'Grade 10-A').length;
                    setFeedback({
                      title: 'Attendance Saved & Synced',
                      body: `Today's attendance (${todayStr}) successfully saved and updated across Student and Parent Dashboards.\n${presentCount} of ${total} students present (${Math.round((presentCount / (total || 1)) * 100)}%).`,
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
              <div className="sa-toolbar-right" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
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
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={() => setIsHomeworkOpen(true)}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                  + Give Homework
                </button>
              </div>
            </div>
            <div className="table-responsive">
              <table className="sa-schools-table" id="assignments-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Topic / Title</th>
                    <th>Target Class</th>
                    <th>Given Date</th>
                    <th>End Date (Due)</th>
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
                        <td>
                          <div style={{ fontWeight: 600, color: 'var(--color-text)' }}>{hw.title}</div>
                          {hw.instructions && (
                            <small style={{ color: '#64748b', display: 'block', maxWidth: '340px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {hw.instructions}
                            </small>
                          )}
                          {hw.attachmentName && (
                            <span style={{ fontSize: '0.75rem', color: '#047857', display: 'inline-flex', alignItems: 'center', gap: '3px', marginTop: '2px' }}>
                              📎 {hw.attachmentName}
                            </span>
                          )}
                        </td>
                        <td><span className="badge badge-info">{hw.grade}</span></td>
                        <td>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem', color: '#475569', fontWeight: 500 }}>
                            📅 {hw.givenDate || hw.assignedDate || '2026-10-24'}
                          </span>
                        </td>
                        <td>
                          <span className="badge badge-warning" style={{ fontSize: '0.82rem', padding: '4px 8px' }}>
                            ⏳ {hw.due}
                          </span>
                        </td>
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

        {(role === 'teacher' || role === 'student') && (activeTab === 'study-materials' || activeTab === 'download-materials') && (() => {
          const materials = data.studyMaterials || [];
          const filteredMaterials = materials.filter((m) => {
            if (role === 'student') {
              return m.grade === 'Grade 10-A' || m.grade === 'All Grades';
            }
            return true;
          });

          return (
            <div>
              <div className="sa-schools-header-bar" style={{ marginBottom: '16px' }}>
                <div className="sa-filter-segment">
                  <button className="sa-filter-tab active">
                    {role === 'teacher' ? 'All Uploaded Study Materials' : 'Available Course Materials'}
                    <span className="sa-filter-count">{filteredMaterials.length}</span>
                  </button>
                </div>
                {role === 'teacher' && (
                  <div className="sa-toolbar-right">
                    <button
                      type="button"
                      className="btn btn-primary btn-sm"
                      onClick={() => setIsMaterialModalOpen(true)}
                      style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                      + Upload Study Material
                    </button>
                  </div>
                )}
              </div>

              {filteredMaterials.length === 0 ? (
                <div className="portal-card" style={{ textAlign: 'center', padding: '40px 20px', color: '#64748b' }}>
                  <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ margin: '0 auto 12px auto', color: '#94a3b8' }}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>
                  <h4>No Study Materials Uploaded Yet</h4>
                  <p style={{ margin: 0, fontSize: '0.9rem' }}>Teachers can upload handouts, formulas, and revision documents here.</p>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
                  {filteredMaterials.map((mat) => (
                    <div
                      key={mat.id}
                      className="portal-card"
                      style={{
                        margin: 0,
                        borderLeft: '4px solid var(--color-primary)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.04)',
                        borderRadius: '10px'
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px', marginBottom: '8px' }}>
                          <span className="badge badge-info" style={{ fontSize: '0.78rem' }}>{mat.subject}</span>
                          <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                            <span className="badge badge-success" style={{ fontSize: '0.75rem' }}>{mat.grade}</span>
                            <span className="badge badge-warning" style={{ fontSize: '0.72rem' }}>{mat.fileType || 'PDF'}</span>
                          </div>
                        </div>

                        <h4 style={{ margin: '0 0 6px 0', fontSize: '1.05rem', color: '#0f172a', fontWeight: 700 }}>
                          {mat.title}
                        </h4>

                        <p style={{ margin: '0 0 12px 0', color: '#475569', fontSize: '0.86rem', lineHeight: '1.4' }}>
                          {mat.description}
                        </p>

                        <div style={{ background: '#f8fafc', padding: '8px 10px', borderRadius: '6px', fontSize: '0.8rem', color: '#64748b', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            📄 <strong>{mat.fileName}</strong>
                          </span>
                          <span>{mat.fileSize || '2.5 MB'}</span>
                        </div>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid #f1f5f9', fontSize: '0.78rem', color: '#94a3b8' }}>
                        <span>Uploaded by: <strong style={{ color: '#475569' }}>{mat.uploadedBy}</strong> ({mat.date})</span>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button
                            type="button"
                            className="btn btn-outline btn-sm"
                            onClick={async () => {
                              try {
                                setFeedback({
                                  title: 'Generating & Downloading PDF',
                                  body: `Preparing ${mat.fileName} (${mat.fileSize || '2.4 MB'}) for download...`
                                });
                                await downloadStudyMaterialPDF(mat);
                              } catch (err) {
                                console.error('Download error:', err);
                              }
                            }}
                            style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '4px 10px', fontSize: '0.8rem' }}
                          >
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
                            Download PDF
                          </button>
                          {role === 'teacher' && (
                            <button
                              type="button"
                              className="sa-tbl-action danger"
                              onClick={() => handleDeleteStudyMaterial(mat.id)}
                              style={{ padding: '4px 8px', fontSize: '0.78rem' }}
                            >
                              Delete
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })()}

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
              <table className="timetable-grid" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center' }}>
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
        {role === 'student' && activeTab === 'view-dashboard' && (() => {
          const studentHw = (data.assignments || []).filter((h) => h.grade === 'Grade 10-A' || h.grade === 'All Grades');
          const upcomingExams = (data.exams || []).filter((x) => x.grade === 'Grade 10-A' || x.grade === 'All Grades');

          // Dynamically compute attendance from attendanceLogs for S101
          const studentRoll = 'S101';
          const logs = (data.attendanceLogs || []).filter((l) => l.className === 'Grade 10-A');
          const studentLogs = logs.filter((l) => l.records && l.records[studentRoll]);
          const totalDays = studentLogs.length;
          const presentDays = studentLogs.filter((l) => l.records[studentRoll] === 'present').length;
          const currentStudent = (data.students || []).find((s) => s.roll === studentRoll);
          const dynamicRate = totalDays > 0 ? `${Math.round((presentDays / totalDays) * 100)}%` : (currentStudent?.attendance || '96%');

          return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {/* Stat Summary Cards */}
              <div className="grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
                <div className="portal-card" style={{ borderLeft: '4px solid #10b981', margin: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h4 style={{ margin: 0, color: '#334155', fontSize: '0.95rem' }}>My Attendance Rate</h4>
                    <span style={{ fontSize: '1.4rem' }}>📈</span>
                  </div>
                  <p style={{ fontSize: '2.2rem', fontWeight: 800, color: '#10b981', margin: '8px 0 4px 0' }}>{dynamicRate}</p>
                  <p style={{ fontSize: '0.82rem', color: '#64748b', margin: 0 }}>
                    {presentDays} of {totalDays} logged days attended
                  </p>
                </div>

                <div className="portal-card" style={{ borderLeft: '4px solid #f59e0b', margin: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h4 style={{ margin: 0, color: '#334155', fontSize: '0.95rem' }}>Pending Homework & Assignments</h4>
                    <span style={{ fontSize: '1.4rem' }}>📝</span>
                  </div>
                  <p style={{ fontSize: '2.2rem', fontWeight: 800, color: '#f59e0b', margin: '8px 0 4px 0' }}>
                    {studentHw.length} <span style={{ fontSize: '1.1rem', fontWeight: 500, color: '#64748b' }}>Active Tasks</span>
                  </p>
                  <p style={{ fontSize: '0.82rem', color: '#64748b', margin: 0 }}>
                    {studentHw.length > 0 ? `Next due: ${studentHw[0].title}` : 'All caught up!'}
                  </p>
                </div>

                <div className="portal-card" style={{ borderLeft: '4px solid #3b82f6', margin: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h4 style={{ margin: 0, color: '#334155', fontSize: '0.95rem' }}>Upcoming Exams</h4>
                    <span style={{ fontSize: '1.4rem' }}>📅</span>
                  </div>
                  <p style={{ fontSize: '2.2rem', fontWeight: 800, color: '#3b82f6', margin: '8px 0 4px 0' }}>
                    {upcomingExams.length} <span style={{ fontSize: '1.1rem', fontWeight: 500, color: '#64748b' }}>Scheduled</span>
                  </p>
                  <p style={{ fontSize: '0.82rem', color: '#64748b', margin: 0 }}>Grade 10-A Midterm Schedule</p>
                </div>
              </div>

              {/* Pending Homework & Assignments Section */}
              <div className="portal-card" style={{ margin: 0, padding: '22px', border: '1px solid #e2e8f0', borderRadius: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
                  <div>
                    <h3 style={{ margin: '0 0 4px 0', fontSize: '1.15rem', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span>📝</span> Pending Homework & Assignments
                    </h3>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>
                      Review assignments assigned to your class (Grade 10-A) and submit before the deadline.
                    </p>
                  </div>
                  {setActiveTab && (
                    <button
                      className="btn btn-outline btn-sm"
                      onClick={() => setActiveTab('submit-assignments')}
                      style={{ fontSize: '0.82rem', padding: '6px 14px' }}
                    >
                      Go to Submission Portal →
                    </button>
                  )}
                </div>

                {studentHw.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '36px 20px', background: '#f8fafc', borderRadius: '10px', border: '1px dashed #cbd5e1' }}>
                    <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>🎉</div>
                    <h4 style={{ margin: '0 0 6px 0', color: '#1e293b' }}>No Pending Homework</h4>
                    <p style={{ margin: 0, color: '#64748b', fontSize: '0.88rem' }}>You have completed all assigned tasks or none have been assigned yet.</p>
                  </div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
                    {studentHw.map((hw) => (
                      <div
                        key={hw.id}
                        style={{
                          background: '#ffffff',
                          border: '1px solid #e2e8f0',
                          borderLeft: '4px solid #f59e0b',
                          borderRadius: '10px',
                          padding: '16px',
                          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                          gap: '12px',
                          transition: 'transform 0.15s ease, box-shadow 0.15s ease'
                        }}
                      >
                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px', gap: '8px' }}>
                            <span
                              style={{
                                background: '#eff6ff',
                                color: '#1d4ed8',
                                padding: '3px 8px',
                                borderRadius: '4px',
                                fontSize: '0.78rem',
                                fontWeight: 700
                              }}
                            >
                              {hw.subject || 'General'}
                            </span>
                            <span
                              style={{
                                background: '#fef3c7',
                                color: '#b45309',
                                padding: '3px 8px',
                                borderRadius: '4px',
                                fontSize: '0.78rem',
                                fontWeight: 700
                              }}
                            >
                              ⏳ Due: {hw.due}
                            </span>
                          </div>

                          <h4 style={{ margin: '0 0 8px 0', fontSize: '1.05rem', color: '#0f172a', fontWeight: 700 }}>
                            {hw.title}
                          </h4>

                          <p style={{ margin: '0 0 10px 0', color: '#475569', fontSize: '0.86rem', lineHeight: '1.45' }}>
                            {hw.instructions || 'Follow the instructions provided in your syllabus or textbook.'}
                          </p>

                          {hw.attachmentName && (
                            <div style={{ background: '#f1f5f9', padding: '6px 10px', borderRadius: '6px', fontSize: '0.78rem', color: '#0f766e', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <span>📎</span>
                              <span>Reference doc: <strong>{hw.attachmentName}</strong></span>
                            </div>
                          )}
                        </div>

                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px', borderTop: '1px solid #f1f5f9', fontSize: '0.78rem', color: '#64748b', marginBottom: '12px' }}>
                            <span>Assigned: <strong style={{ color: '#1e293b' }}>{hw.givenDate || hw.assignedDate || 'Recent'}</strong></span>
                            <span>By: <strong style={{ color: '#1e293b' }}>{hw.assignedBy || 'Subject Teacher'}</strong></span>
                          </div>

                          <button
                            type="button"
                            className="btn btn-primary btn-sm"
                            style={{ width: '100%', fontSize: '0.82rem', padding: '8px 12px', borderRadius: '6px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px' }}
                            onClick={() => {
                              if (setActiveTab) {
                                setActiveTab('submit-assignments');
                              } else {
                                setFeedback({
                                  title: 'Submit Assignment',
                                  body: `Please navigate to "Submit Homework & Assignments" tab to upload your solution for ${hw.title}.`
                                });
                              }
                            }}
                          >
                            <span>📤</span> Submit Solution Now
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })()}

        {(role === 'student' || role === 'parent') && (activeTab === 'check-attendance' || activeTab === 'attendance-tracking') && (() => {
          const studentRoll = 'S101';
          const logs = (data.attendanceLogs || []).filter((l) => l.className === 'Grade 10-A');
          const studentLogs = logs.filter((l) => l.records && l.records[studentRoll]);
          const totalDays = studentLogs.length;
          const presentDays = studentLogs.filter((l) => l.records[studentRoll] === 'present').length;
          const absentDays = totalDays - presentDays;
          const currentStudent = (data.students || []).find((s) => s.roll === studentRoll);
          const attendancePercent = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 96;

          return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Header metrics card */}
              <div className="portal-card" style={{ margin: 0, padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
                  <div>
                    <h3 style={{ margin: '0 0 4px 0', fontSize: '1.2rem', color: '#0f172a' }}>
                      📋 Student Attendance & Real-Time Tracking
                    </h3>
                    <p style={{ margin: 0, color: '#64748b', fontSize: '0.86rem' }}>
                      Live records recorded and locked by Class Teacher (Grade 10-A).
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <span className="badge badge-success" style={{ fontSize: '0.85rem', padding: '6px 12px' }}>
                      ✓ Overall: {attendancePercent}%
                    </span>
                  </div>
                </div>

                <div className="grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
                  <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '8px', borderLeft: '4px solid #3b82f6' }}>
                    <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Total Logged School Days</div>
                    <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#1e293b', marginTop: '4px' }}>{totalDays} Days</div>
                  </div>
                  <div style={{ background: '#f0fdf4', padding: '14px', borderRadius: '8px', borderLeft: '4px solid #10b981' }}>
                    <div style={{ fontSize: '0.8rem', color: '#15803d' }}>Days Present</div>
                    <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#16a34a', marginTop: '4px' }}>{presentDays} Days</div>
                  </div>
                  <div style={{ background: '#fef2f2', padding: '14px', borderRadius: '8px', borderLeft: '4px solid #ef4444' }}>
                    <div style={{ fontSize: '0.8rem', color: '#b91c1c' }}>Days Absent</div>
                    <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#dc2626', marginTop: '4px' }}>{absentDays} Days</div>
                  </div>
                </div>
              </div>

              {/* Day-by-Day Logged Records Table */}
              <div className="portal-card" style={{ margin: 0, padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <h4 style={{ margin: 0, color: '#0f172a', fontSize: '1.05rem' }}>
                    🗓️ Daily Attendance History & Staff Sign-off
                  </h4>
                  <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Showing all verified dates</span>
                </div>

                {logs.length === 0 ? (
                  <p style={{ color: '#64748b', textAlign: 'center', padding: '20px' }}>No attendance records logged yet.</p>
                ) : (
                  <div className="table-responsive">
                    <table className="sa-schools-table" style={{ width: '100%' }}>
                      <thead>
                        <tr>
                          <th>Date</th>
                          <th>Class</th>
                          <th>Teacher / Staff</th>
                          <th>Status</th>
                          <th>Recorded Time</th>
                        </tr>
                      </thead>
                      <tbody>
                        {logs.map((log, idx) => {
                          const status = log.records?.[studentRoll] || 'present';
                          const isPresent = status === 'present';
                          return (
                            <tr key={idx} style={{ background: idx === 0 ? 'rgba(59, 130, 246, 0.03)' : 'transparent' }}>
                              <td>
                                <strong>{log.date}</strong>
                                {idx === 0 && (
                                  <span style={{ marginLeft: '8px', background: '#dbeafe', color: '#1d4ed8', fontSize: '0.7rem', padding: '2px 6px', borderRadius: '4px', fontWeight: 700 }}>
                                    Latest
                                  </span>
                                )}
                              </td>
                              <td>{log.className}</td>
                              <td>{log.markedBy || 'Mrs. Priya Krishnan'}</td>
                              <td>
                                <span
                                  className={`badge ${isPresent ? 'badge-success' : 'badge-danger'}`}
                                  style={{
                                    fontSize: '0.82rem',
                                    fontWeight: 700,
                                    padding: '4px 10px',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '4px'
                                  }}
                                >
                                  {isPresent ? '✓ Present' : '✕ Absent'}
                                </span>
                              </td>
                              <td style={{ fontSize: '0.8rem', color: '#64748b' }}>
                                {log.timestamp ? new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '09:15 AM'}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          );
        })()}

        {role === 'student' && activeTab === 'view-timetable' && (
          <div className="table-responsive">
            <table className="timetable-grid" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center' }}>
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

        {(role === 'student' || role === 'parent') && (activeTab === 'view-homework' || activeTab === 'homework') && (() => {
          const studentHw = (data.assignments || []).filter((h) => h.grade === 'Grade 10-A' || h.grade === 'All Grades');
          return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="sa-schools-header-bar" style={{ marginBottom: '8px' }}>
                <div className="sa-filter-segment">
                  <button className="sa-filter-tab active">
                    Assigned Homework Tasks
                    <span className="sa-filter-count">{studentHw.length}</span>
                  </button>
                </div>
              </div>

              {studentHw.length === 0 ? (
                <div className="portal-card" style={{ textAlign: 'center', padding: '30px' }}>
                  <p style={{ margin: 0, color: '#64748b' }}>No pending homework assignments currently.</p>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
                  {studentHw.map((hw) => (
                    <div key={hw.id} className="portal-card" style={{ margin: 0, borderLeft: '4px solid #f59e0b', borderRadius: '10px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                        <span className="badge badge-info" style={{ fontSize: '0.8rem' }}>{hw.subject || 'Mathematics'}</span>
                        <span className="badge badge-warning" style={{ fontSize: '0.8rem' }}>Due: {hw.due}</span>
                      </div>
                      <h4 style={{ margin: '0 0 8px 0', fontSize: '1.05rem', color: '#0f172a' }}>{hw.title}</h4>
                      <p style={{ margin: '0 0 12px 0', color: '#475569', fontSize: '0.88rem' }}>{hw.instructions}</p>
                      
                      {hw.attachmentName && (
                        <div style={{ background: '#f8fafc', padding: '8px 10px', borderRadius: '6px', fontSize: '0.82rem', color: '#047857', marginBottom: '12px' }}>
                          📎 Reference File: <strong>{hw.attachmentName}</strong>
                        </div>
                      )}

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px', borderTop: '1px solid #f1f5f9', fontSize: '0.8rem', color: '#64748b' }}>
                        <span>Given Date: <strong style={{ color: '#0f172a' }}>{hw.givenDate || hw.assignedDate || '2026-10-24'}</strong></span>
                        <span>End Date: <strong style={{ color: '#b45309' }}>{hw.due}</strong></span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })()}

        {role === 'student' && activeTab === 'receive-announcements' && (
          <div className="portal-card">
            <h4>Independence Day Celebrations</h4>
            <p>Flag hoisting ceremony starts at 8:00 AM on August 15.</p>
          </div>
        )}

        {/* SHARED EXAMINATION SCHEDULE TAB (Principal, Teacher, Student, Parent) */}
        {activeTab === 'track-exams' && (() => {
          const allExams = data.exams || [];
          const canManageExams = role === 'principal' || role === 'teacher';

          // Filter by grade for student/parent or selected grade for principal/teacher
          const filteredExams = allExams.filter((x) => {
            if (role === 'student' || role === 'parent') {
              // Student is Grade 10-A
              return x.grade === 'Grade 10-A' || x.grade === 'All Grades';
            }
            if (examGradeFilter === 'All') return true;
            return x.grade === examGradeFilter;
          });

          return (
            <div>
              <div className="sa-schools-header-bar" style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                <div className="sa-filter-segment" style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <span style={{ fontWeight: 700, color: 'var(--color-primary)', fontSize: '0.92rem', padding: '6px 12px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                    🎯 Upcoming Examination Schedule
                  </span>
                  {canManageExams && (
                    <div style={{ display: 'inline-flex', gap: '4px', marginLeft: '6px' }}>
                      {['All', 'Grade 10-A', 'Grade 10-B', 'Grade 11-A', 'Grade 11-B', 'Grade 12-A', 'Grade 9-A'].map((grd) => (
                        <button
                          key={grd}
                          type="button"
                          className={`sa-filter-tab ${examGradeFilter === grd ? 'active' : ''}`}
                          onClick={() => setExamGradeFilter(grd)}
                          style={{ padding: '4px 10px', fontSize: '0.78rem' }}
                        >
                          {grd}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  {canManageExams && (
                    <button
                      type="button"
                      className="btn btn-primary btn-sm"
                      onClick={() => setIsExamModalOpen(true)}
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '7px 14px', borderRadius: '6px' }}
                    >
                      <span>+</span>
                      <span>Schedule New Exam</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Notice Banner */}
              {(role === 'student' || role === 'parent') && (
                <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '8px', padding: '12px 16px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '1.3rem' }}>📢</span>
                  <div style={{ fontSize: '0.86rem', color: '#1e40af' }}>
                    <strong>Official Notice:</strong> Showing all scheduled board & term tests for <strong>Grade 10-A</strong>. Hall tickets will be issued 3 days prior. Exam starts promptly at designated timings.
                  </div>
                </div>
              )}

              <div
                style={{
                  background: '#ffffff',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.04)',
                  overflow: 'hidden'
                }}
              >
                <div className="table-responsive" style={{ margin: 0 }}>
                  <table className="sa-schools-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '850px' }}>
                    <thead>
                      <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                        <th style={{ padding: '14px 16px', fontWeight: 700, fontSize: '0.82rem', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                          Examination & Session
                        </th>
                        <th style={{ padding: '14px 16px', fontWeight: 700, fontSize: '0.82rem', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                          Subject / Paper
                        </th>
                        <th style={{ padding: '14px 16px', fontWeight: 700, fontSize: '0.82rem', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                          Class
                        </th>
                        <th style={{ padding: '14px 16px', fontWeight: 700, fontSize: '0.82rem', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                          Date & Timing
                        </th>
                        <th style={{ padding: '14px 16px', fontWeight: 700, fontSize: '0.82rem', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                          Exam Hall / Room
                        </th>
                        <th style={{ padding: '14px 16px', fontWeight: 700, fontSize: '0.82rem', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', textAlign: 'center' }}>
                          Marks (Max / Pass)
                        </th>
                        <th style={{ padding: '14px 16px', fontWeight: 700, fontSize: '0.82rem', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', textAlign: 'center' }}>
                          Status
                        </th>
                        {canManageExams && (
                          <th style={{ padding: '14px 16px', fontWeight: 700, fontSize: '0.82rem', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', textAlign: 'right' }}>
                            Actions
                          </th>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {filteredExams.length > 0 ? (
                        filteredExams.map((ex, idx) => (
                          <tr
                            key={ex.id || idx}
                            style={{
                              borderBottom: '1px solid #f1f5f9',
                              transition: 'background 0.15s ease',
                              background: idx % 2 === 0 ? '#ffffff' : '#fafafa'
                            }}
                          >
                            <td data-label="Examination & Session" style={{ padding: '14px 16px' }}>
                              <div className="school-meta-line">
                                <strong style={{ fontSize: '0.94rem', color: '#0f172a' }}>
                                  {ex.name}
                                </strong>
                                <small>👤 By: {ex.uploadedBy || 'Principal Office'}</small>
                              </div>
                            </td>

                            <td data-label="Subject / Paper" style={{ padding: '14px 16px' }}>
                              <div className="school-meta-line">
                                <strong style={{ color: '#1e3a8a', fontSize: '0.95rem' }}>
                                  {ex.subject}
                                </strong>
                                {ex.syllabus && (
                                  <small style={{ maxWidth: '280px' }}>📘 <em>{ex.syllabus}</em></small>
                                )}
                              </div>
                            </td>

                            <td data-label="Class" style={{ padding: '14px 16px' }}>
                              <span
                                style={{
                                  display: 'inline-block',
                                  padding: '4px 10px',
                                  borderRadius: '6px',
                                  fontSize: '0.8rem',
                                  fontWeight: 600,
                                  background: '#eff6ff',
                                  color: '#1d4ed8'
                                }}
                              >
                                {ex.grade}
                              </span>
                            </td>

                            <td data-label="Date & Timing" style={{ padding: '14px 16px' }}>
                              <div className="school-meta-line">
                                <strong style={{ fontSize: '0.9rem' }}>📅 {ex.date}</strong>
                                <small>⏰ {ex.time || '09:30 AM - 12:30 PM'}</small>
                              </div>
                            </td>

                            <td data-label="Exam Hall" style={{ padding: '14px 16px' }}>
                              <span
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '5px',
                                  fontSize: '0.84rem',
                                  fontWeight: 600,
                                  color: '#334155',
                                  background: '#f1f5f9',
                                  padding: '4px 10px',
                                  borderRadius: '6px'
                                }}
                              >
                                📍 {ex.room || 'Main Examination Hall'}
                              </span>
                            </td>

                            <td data-label="Marks (Max / Pass)" style={{ padding: '14px 16px', textAlign: 'center' }}>
                              <div className="school-meta-line">
                                <strong style={{ fontSize: '0.96rem', color: '#059669' }}>
                                  {ex.maxMarks || 100}
                                </strong>
                                <small>Min: {ex.passMarks || 35}</small>
                              </div>
                            </td>

                            <td data-label="Status" style={{ padding: '14px 16px', textAlign: 'center' }}>
                              <span
                                style={{
                                  display: 'inline-block',
                                  padding: '4px 10px',
                                  borderRadius: '20px',
                                  fontSize: '0.78rem',
                                  fontWeight: 700,
                                  background: ex.status === 'Completed' ? '#dcfce7' : '#fef3c7',
                                  color: ex.status === 'Completed' ? '#15803d' : '#b45309'
                                }}
                              >
                                {ex.status || 'Scheduled'}
                              </span>
                            </td>

                            {canManageExams && (
                              <td data-label="Actions" style={{ padding: '14px 16px', textAlign: 'right' }}>
                                <button
                                  type="button"
                                  className="sa-tbl-action danger"
                                  onClick={() => handleDeleteExam(ex.id)}
                                  title="Cancel and remove this scheduled examination"
                                  style={{ padding: '5px 10px', fontSize: '0.78rem' }}
                                >
                                  Delete ✕
                                </button>
                              </td>
                            )}
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan={canManageExams ? 8 : 7}
                            style={{ textAlign: 'center', padding: '40px 20px', color: '#94a3b8' }}
                          >
                            <div style={{ fontSize: '2rem', marginBottom: '8px' }}>📅</div>
                            <div style={{ fontWeight: 600, color: '#475569', fontSize: '1rem' }}>
                              No upcoming examinations scheduled for {examGradeFilter}.
                            </div>
                            <div style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '4px' }}>
                              Click "+ Schedule New Exam" above to add new examination dates.
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          );
        })()}

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

      {/* 0. Student Result & Parent Details Modal */}
      {selectedStudentDetail && (
        <div className="modal-overlay" style={{ display: 'flex' }}>
          <div className="modal-content wizard-modal-lg" style={{ maxWidth: '680px', borderRadius: '14px', overflow: 'hidden' }}>
            <div className="modal-header" style={{ background: 'linear-gradient(135deg, #1e3a8a, #2563eb)', color: '#ffffff' }}>
              <div>
                <h3 style={{ margin: 0, color: '#ffffff', fontSize: '1.2rem', fontWeight: 800 }}>
                  Student Profile & Exam Results
                </h3>
                <span style={{ fontSize: '0.82rem', opacity: 0.9 }}>
                  {selectedStudentDetail.name} &bull; Roll: {selectedStudentDetail.roll} &bull; {selectedStudentDetail.class}
                </span>
              </div>
              <button
                className="modal-close"
                onClick={() => setSelectedStudentDetail(null)}
                style={{ color: '#ffffff', opacity: 0.8 }}
              >
                &times;
              </button>
            </div>

            <div style={{ padding: '24px' }}>
              {/* Parent & Contact Details Card */}
              <div
                style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderLeft: '4px solid #10b981',
                  borderRadius: '10px',
                  padding: '16px 20px',
                  marginBottom: '20px'
                }}
              >
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#059669', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>
                  👨‍👩‍👦 Parent / Guardian Contact Details
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
                  <div>
                    <span style={{ fontSize: '0.78rem', color: '#64748b', display: 'block' }}>Parent Name</span>
                    <strong style={{ fontSize: '1rem', color: '#0f172a' }}>
                      {selectedStudentDetail.parentName || 'Mr. Kumarasamy (Father)'}
                    </strong>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.78rem', color: '#64748b', display: 'block' }}>Contact Phone Number</span>
                    <a
                      href={`tel:${selectedStudentDetail.parentPhone || '+91 98401 55210'}`}
                      style={{
                        fontSize: '1rem',
                        fontWeight: 700,
                        color: '#2563eb',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        textDecoration: 'none'
                      }}
                    >
                      📞 {selectedStudentDetail.parentPhone || '+91 98401 55210'}
                    </a>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.78rem', color: '#64748b', display: 'block' }}>School Attendance Rate</span>
                    <strong style={{ fontSize: '0.98rem', color: '#059669' }}>
                      {selectedStudentDetail.attendance || '96%'}
                    </strong>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.78rem', color: '#64748b', display: 'block' }}>Overall Performance</span>
                    <span className="badge badge-success">
                      {selectedStudentDetail.performance || 'Outstanding'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Exam Results Scorecard */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <h4 style={{ margin: 0, fontSize: '1rem', color: 'var(--color-primary)', fontWeight: 700 }}>
                    📊 Academic Midterm Exam Results
                  </h4>
                  <button
                    type="button"
                    className="btn btn-outline btn-sm"
                    onClick={() => {
                      const st = selectedStudentDetail;
                      setSelectedStudentDetail(null);
                      handleOpenMarks(st);
                    }}
                    style={{ fontSize: '0.8rem', padding: '4px 10px' }}
                  >
                    ✏️ Edit / Enter Marks
                  </button>
                </div>

                <div className="table-responsive">
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                    <thead>
                      <tr style={{ background: '#f1f5f9', textAlign: 'left', borderBottom: '2px solid #cbd5e1' }}>
                        <th style={{ padding: '10px 12px', color: '#475569', fontWeight: 700 }}>Subject</th>
                        <th style={{ padding: '10px 12px', color: '#475569', fontWeight: 700, textAlign: 'center' }}>Max Marks</th>
                        <th style={{ padding: '10px 12px', color: '#475569', fontWeight: 700, textAlign: 'center' }}>Scored</th>
                        <th style={{ padding: '10px 12px', color: '#475569', fontWeight: 700, textAlign: 'center' }}>Grade</th>
                        <th style={{ padding: '10px 12px', color: '#475569', fontWeight: 700, textAlign: 'right' }}>Result Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(selectedStudentDetail.marks || [
                        { subject: 'Mathematics', max: 100, scored: 98, grade: 'A+' },
                        { subject: 'Physics', max: 100, scored: 92, grade: 'A+' },
                        { subject: 'Chemistry', max: 100, scored: 86, grade: 'A' },
                        { subject: 'Tamil', max: 100, scored: 94, grade: 'A+' },
                        { subject: 'English', max: 100, scored: 90, grade: 'A+' }
                      ]).map((m, idx) => {
                        const isAbsent = m.scored === 'AB' || m.scored === 'Absent';
                        const isPass = !isAbsent && Number(m.scored) >= 35;
                        return (
                          <tr key={idx} style={{ borderBottom: '1px solid #e2e8f0' }}>
                            <td style={{ padding: '10px 12px', fontWeight: 600, color: '#0f172a' }}>{m.subject}</td>
                            <td style={{ padding: '10px 12px', textAlign: 'center', color: '#64748b' }}>{m.max || 100}</td>
                            <td style={{ padding: '10px 12px', textAlign: 'center', fontWeight: 700, color: isAbsent ? '#ef4444' : '#0f172a' }}>
                              {m.scored}
                            </td>
                            <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                              <span className={`badge ${isAbsent ? 'badge-danger' : m.grade === 'A+' || m.grade === 'A' ? 'badge-success' : 'badge-primary'}`}>
                                {m.grade}
                              </span>
                            </td>
                            <td style={{ padding: '10px 12px', textAlign: 'right' }}>
                              <span style={{ fontWeight: 700, fontSize: '0.84rem', color: isAbsent ? '#ef4444' : isPass ? '#059669' : '#dc2626' }}>
                                {isAbsent ? 'ABSENT' : isPass ? 'PASS ✓' : 'FAIL ✕'}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Total & Average Summary Footer */}
              {(() => {
                const marksList = selectedStudentDetail.marks || [];
                const validMarks = marksList.filter(m => m.scored !== 'AB' && !isNaN(Number(m.scored)));
                const totalScored = validMarks.reduce((acc, curr) => acc + Number(curr.scored), 0);
                const totalMax = validMarks.length * 100;
                const percentage = validMarks.length > 0 ? (totalScored / validMarks.length).toFixed(1) : 0;

                return (
                  <div
                    style={{
                      marginTop: '20px',
                      padding: '14px 18px',
                      background: '#f8fafc',
                      borderRadius: '8px',
                      border: '1px solid #e2e8f0',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: '12px'
                    }}
                  >
                    <div>
                      <span style={{ fontSize: '0.82rem', color: '#64748b' }}>Cumulative Total Score:</span>
                      <strong style={{ fontSize: '1.1rem', color: '#0f172a', marginLeft: '6px' }}>
                        {totalScored} / {totalMax}
                      </strong>
                    </div>
                    <div>
                      <span style={{ fontSize: '0.82rem', color: '#64748b' }}>Aggregate Percentage:</span>
                      <strong style={{ fontSize: '1.25rem', color: '#2563eb', marginLeft: '6px' }}>
                        {percentage}%
                      </strong>
                    </div>
                  </div>
                );
              })()}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '16px 24px', background: '#f8fafc', borderTop: '1px solid #e2e8f0' }}>
              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={() => setSelectedStudentDetail(null)}
                style={{ padding: '8px 22px' }}
              >
                Close Window
              </button>
            </div>
          </div>
        </div>
      )}

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
                  <div className="wizard-field span-2">
                    <label>Target Classroom / Section <span className="req">*</span></label>
                    <select
                      required
                      value={homeworkForm.grade}
                      onChange={(e) => setHomeworkForm({ ...homeworkForm, grade: e.target.value })}
                    >
                      <option value="Grade 10-A">Grade 10-A (Mathematics Core)</option>
                      <option value="Grade 9-A">Grade 9-A</option>
                      <option value="Grade 11-B">Grade 11-B</option>
                      <option value="Grade 12-A">Grade 12-A</option>
                    </select>
                  </div>
                  <div className="wizard-field">
                    <label>Given Date (Assigned Date) <span className="req">*</span></label>
                    <input
                      type="date"
                      required
                      value={homeworkForm.givenDate}
                      onChange={(e) => setHomeworkForm({ ...homeworkForm, givenDate: e.target.value })}
                    />
                  </div>
                  <div className="wizard-field">
                    <label>End Date (Submission Deadline) <span className="req">*</span></label>
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

      {/* 2B. Upload Study Material Modal */}
      {isMaterialModalOpen && (
        <div className="modal-overlay" style={{ display: 'flex' }}>
          <div className="modal-content wizard-modal-lg" style={{ maxWidth: '640px' }}>
            <div className="modal-header">
              <h3>Upload Course Study Material</h3>
              <button className="modal-close" onClick={() => setIsMaterialModalOpen(false)}>&times;</button>
            </div>
            <form onSubmit={handleSaveStudyMaterial}>
              <div className="wizard-form-box">
                <div className="wizard-header-strip">
                  <div className="wizard-header-icon" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#059669' }}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></svg>
                  </div>
                  <div className="wizard-header-titles">
                    <h4>Upload Study Notes & Resources</h4>
                    <p>Share textbook summaries, formulas, and revision documents with students.</p>
                  </div>
                </div>

                <div className="wizard-grid-2">
                  <div className="wizard-field span-2">
                    <label>Resource Title / Document Topic <span className="req">*</span></label>
                    <input
                      type="text"
                      placeholder="e.g. Complete Trigonometry Formulas & Proofs"
                      required
                      value={materialForm.title}
                      onChange={(e) => setMaterialForm({ ...materialForm, title: e.target.value })}
                    />
                  </div>

                  <div className="wizard-field">
                    <label>Target Class / Standard <span className="req">*</span></label>
                    <select
                      value={materialForm.grade}
                      onChange={(e) => setMaterialForm({ ...materialForm, grade: e.target.value })}
                    >
                      <option value="Grade 10-A">Grade 10-A</option>
                      <option value="Grade 9-A">Grade 9-A</option>
                      <option value="Grade 11-B">Grade 11-B</option>
                      <option value="Grade 12-A">Grade 12-A</option>
                      <option value="All Grades">All Grades</option>
                    </select>
                  </div>

                  <div className="wizard-field">
                    <label>Academic Subject <span className="req">*</span></label>
                    <select
                      value={materialForm.subject}
                      onChange={(e) => setMaterialForm({ ...materialForm, subject: e.target.value })}
                    >
                      <option value="Mathematics">Mathematics</option>
                      <option value="Physics">Physics</option>
                      <option value="Chemistry">Chemistry</option>
                      <option value="Biology">Biology</option>
                      <option value="Tamil">Tamil</option>
                      <option value="English">English</option>
                    </select>
                  </div>

                  <div className="wizard-field span-2">
                    <label>Document Description / Topics Covered <span className="req">*</span></label>
                    <textarea
                      rows="3"
                      placeholder="Explain key concepts or chapter references included in this document..."
                      required
                      value={materialForm.description}
                      onChange={(e) => setMaterialForm({ ...materialForm, description: e.target.value })}
                    ></textarea>
                  </div>

                  <div className="wizard-field span-2">
                    <label>Choose File (PDF, DOCX, PPT, Sheet) <span className="req">*</span></label>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                      <input
                        type="file"
                        ref={studyMaterialFileInputRef}
                        style={{ display: 'none' }}
                        accept=".pdf, .docx, .doc, .pptx, .ppt, .xlsx, .xls, .zip"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            const f = e.target.files[0];
                            const sizeMb = (f.size / (1024 * 1024)).toFixed(1) + ' MB';
                            const ext = f.name.split('.').pop().toUpperCase();
                            setMaterialForm({
                              ...materialForm,
                              fileName: f.name,
                              fileSize: sizeMb,
                              fileType: ext || 'PDF'
                            });
                          }
                        }}
                      />
                      <button
                        type="button"
                        className="btn btn-outline btn-sm"
                        onClick={() => studyMaterialFileInputRef.current && studyMaterialFileInputRef.current.click()}
                        style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
                        Select Document File
                      </button>
                      <span style={{ fontSize: '0.85rem', color: materialForm.fileName ? '#047857' : '#64748b', fontWeight: materialForm.fileName ? 600 : 'normal' }}>
                        {materialForm.fileName ? `✓ ${materialForm.fileName} (${materialForm.fileSize})` : 'No file chosen (PDF, PPT, DOCX supported)'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #e2e8f0' }}>
                <button type="button" className="btn btn-outline btn-sm" onClick={() => setIsMaterialModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary btn-sm" style={{ padding: '8px 22px' }}>Upload Material to Students ✓</button>
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

      {/* 3b. Schedule Examination Modal (Principal & Teacher) */}
      {isExamModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsExamModalOpen(false)} style={{ zIndex: 9999 }}>
          <div
            className="modal-content"
            style={{
              maxWidth: '640px',
              width: '92%',
              maxHeight: '90vh',
              display: 'flex',
              flexDirection: 'column',
              borderRadius: '14px',
              overflow: 'hidden',
              padding: 0,
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.25), 0 8px 10px -6px rgba(0, 0, 0, 0.25)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)',
                color: '#ffffff',
                padding: '18px 24px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexShrink: 0,
              }}
            >
              <div>
                <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800 }}>
                  🎯 Schedule New Examination
                </h3>
                <p style={{ margin: '4px 0 0 0', fontSize: '0.82rem', opacity: 0.9 }}>
                  Publish exam dates, timings, and syllabus to Student and Parent dashboards.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsExamModalOpen(false)}
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  border: 'none',
                  color: '#ffffff',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.2rem',
                }}
              >
                &times;
              </button>
            </div>

            <form
              onSubmit={handleSaveExam}
              style={{
                padding: '24px',
                overflowY: 'auto',
                flex: 1,
              }}
            >
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                <div style={{ gridColumn: 'span 2' }}>
                  <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, color: '#1e293b', marginBottom: '6px' }}>
                    Exam Series Name <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Midterm Examination 2026 / Term-II Final Board Mock"
                    value={examForm.name}
                    onChange={(e) => setExamForm({ ...examForm, name: e.target.value })}
                    style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '0.9rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, color: '#1e293b', marginBottom: '6px' }}>
                    Subject <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <select
                    value={examForm.subject}
                    onChange={(e) => setExamForm({ ...examForm, subject: e.target.value })}
                    style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '0.9rem' }}
                  >
                    <option value="Mathematics">Mathematics</option>
                    <option value="Physics">Physics</option>
                    <option value="Chemistry">Chemistry</option>
                    <option value="Biology">Biology</option>
                    <option value="Tamil">Tamil (Language I)</option>
                    <option value="English">English (Language II)</option>
                    <option value="Computer Science">Computer Science & Coding</option>
                    <option value="Social Science">Social Science & History</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, color: '#1e293b', marginBottom: '6px' }}>
                    Target Class / Grade <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <select
                    value={examForm.grade}
                    onChange={(e) => setExamForm({ ...examForm, grade: e.target.value })}
                    style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '0.9rem' }}
                  >
                    <option value="Grade 10-A">Grade 10-A</option>
                    <option value="Grade 10-B">Grade 10-B</option>
                    <option value="Grade 11-A">Grade 11-A</option>
                    <option value="Grade 11-B">Grade 11-B</option>
                    <option value="Grade 12-A">Grade 12-A</option>
                    <option value="Grade 12-B">Grade 12-B</option>
                    <option value="Grade 9-A">Grade 9-A</option>
                    <option value="Grade 9-B">Grade 9-B</option>
                    <option value="All Grades">All Grades (School-wide)</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, color: '#1e293b', marginBottom: '6px' }}>
                    Exam Date <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={examForm.date}
                    onChange={(e) => setExamForm({ ...examForm, date: e.target.value })}
                    style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '0.9rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, color: '#1e293b', marginBottom: '6px' }}>
                    Exam Timing <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="09:30 AM - 12:30 PM"
                    value={examForm.time}
                    onChange={(e) => setExamForm({ ...examForm, time: e.target.value })}
                    style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '0.9rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, color: '#1e293b', marginBottom: '6px' }}>
                    Exam Hall / Room
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Hall A-1 or Main Auditorium"
                    value={examForm.room}
                    onChange={(e) => setExamForm({ ...examForm, room: e.target.value })}
                    style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '0.9rem' }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, color: '#1e293b', marginBottom: '6px' }}>
                      Max Marks
                    </label>
                    <input
                      type="number"
                      value={examForm.maxMarks}
                      onChange={(e) => setExamForm({ ...examForm, maxMarks: e.target.value })}
                      style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '0.9rem' }}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, color: '#1e293b', marginBottom: '6px' }}>
                      Pass Marks
                    </label>
                    <input
                      type="number"
                      value={examForm.passMarks}
                      onChange={(e) => setExamForm({ ...examForm, passMarks: e.target.value })}
                      style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '0.9rem' }}
                    />
                  </div>
                </div>

                <div style={{ gridColumn: 'span 2' }}>
                  <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, color: '#1e293b', marginBottom: '6px' }}>
                    Syllabus / Covered Chapters (Optional)
                  </label>
                  <textarea
                    rows="3"
                    placeholder="Specify syllabus portions or study material reference..."
                    value={examForm.syllabus}
                    onChange={(e) => setExamForm({ ...examForm, syllabus: e.target.value })}
                    style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '0.9rem' }}
                  ></textarea>
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: '10px',
                  marginTop: '24px',
                  paddingTop: '16px',
                  borderTop: '1px solid #e2e8f0',
                  position: 'sticky',
                  bottom: 0,
                  background: '#ffffff',
                }}
              >
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setIsExamModalOpen(false)}
                  style={{ padding: '8px 20px', borderRadius: '6px' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ padding: '8px 24px', borderRadius: '6px' }}
                >
                  Publish Exam Schedule ✓
                </button>
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

      {/* =================================================================== */}
      {/* PRINCIPAL DASHBOARD ANALYTICS DRILLDOWN MODAL */}
      {/* =================================================================== */}
      {analyticsModal && (
        <div className="modal-backdrop" onClick={() => setAnalyticsModal(null)}>
          <div
            className="modal-content"
            style={{ maxWidth: '850px', width: '92%', borderRadius: '14px', overflow: 'hidden' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div
              style={{
                background:
                  analyticsModal === 'attendance'
                    ? 'linear-gradient(135deg, #059669 0%, #10b981 100%)'
                    : analyticsModal === 'students'
                    ? 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)'
                    : analyticsModal === 'staff'
                    ? 'linear-gradient(135deg, #b45309 0%, #f59e0b 100%)'
                    : 'linear-gradient(135deg, #6d28d9 0%, #8b5cf6 100%)',
                color: '#ffffff',
                padding: '20px 24px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div>
                <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.01em' }}>
                  {analyticsModal === 'attendance' && '📅 Daily Attendance — Class-Wise Detailed Report'}
                  {analyticsModal === 'students' && '🎓 Enrolled Students — Section Distribution & Class Strength'}
                  {analyticsModal === 'staff' && '👩‍🏫 Teaching Faculty — Attendance & Leave Roster'}
                  {analyticsModal === 'results' && '🏆 Board Exam & Academic Performance by Subject'}
                </h3>
                <p style={{ margin: '4px 0 0 0', fontSize: '0.82rem', opacity: 0.9 }}>
                  {analyticsModal === 'attendance' && `Live morning session roll call audit • Date: ${new Date().toLocaleDateString()}`}
                  {analyticsModal === 'students' && 'Academic Year 2026-27 Active Enrollment Register'}
                  {analyticsModal === 'staff' && 'Daily faculty attendance log and substitute coverage map'}
                  {analyticsModal === 'results' && 'Comprehensive subject-wise pass percentage and distinction count'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setAnalyticsModal(null)}
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  border: 'none',
                  color: '#ffffff',
                  fontSize: '1.2rem',
                  cursor: 'pointer',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '24px', maxHeight: '72vh', overflowY: 'auto' }}>
              {/* 1. ATTENDANCE CLASS-WISE DRILLDOWN */}
              {analyticsModal === 'attendance' && (() => {
                const selDateObj = new Date(selectedAttendanceDate);
                const dayOfWeek = selDateObj.getDay();
                const isSunday = dayOfWeek === 0;
                const formattedDateStr = selDateObj.toLocaleDateString('en-IN', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                });

                // Deterministic calculation for different dates
                const dateSeed = (selDateObj.getDate() * 3 + selDateObj.getMonth()) % 5;
                const absenteeDelta = isSunday ? 0 : (dateSeed - 2); // -2 to +2
                const totalStudents = 482;
                const totalAbsent = isSunday ? 0 : Math.max(8, 22 + absenteeDelta);
                const totalPresent = isSunday ? 0 : totalStudents - totalAbsent;
                const overallPct = isSunday ? '0.0%' : ((totalPresent / totalStudents) * 100).toFixed(1) + '%';

                const classRows = [
                  { cls: 'Grade 10-A', teacher: 'Mrs. Priya Krishnan', total: 38, basePresent: 36 },
                  { cls: 'Grade 10-B', teacher: 'Mr. Ramanathan K.', total: 37, basePresent: 36 },
                  { cls: 'Grade 11-A', teacher: 'Dr. Anandhi Rajan', total: 40, basePresent: 39 },
                  { cls: 'Grade 11-B', teacher: 'Mrs. Jayanthi S.', total: 39, basePresent: 37 },
                  { cls: 'Grade 12-A', teacher: 'Mr. Anand Narayanan', total: 42, basePresent: 41 },
                  { cls: 'Grade 12-B', teacher: 'Mrs. Chitra Devi', total: 41, basePresent: 39 },
                  { cls: 'Grade 9-A', teacher: 'Mrs. Selvi Murugan', total: 36, basePresent: 34 },
                  { cls: 'Grade 9-B', teacher: 'Mr. V. Balaji', total: 35, basePresent: 33 },
                  { cls: 'Grade 8-A', teacher: 'Ms. Meena Kumari', total: 36, basePresent: 35 },
                  { cls: 'Grade 8-B', teacher: 'Ms. K. Suganthi', total: 35, basePresent: 33 },
                  { cls: 'Grade 7-A', teacher: 'Mrs. Lakshmi Narayanan', total: 34, basePresent: 33 },
                  { cls: 'Grade 6-A', teacher: 'Mr. K. Parthiban', total: 33, basePresent: 31 },
                ].map((c, i) => {
                  if (isSunday) {
                    return { ...c, present: 0, absent: 0, pct: '—', status: 'Holiday (Sunday)' };
                  }
                  const offset = ((i + dateSeed) % 3 === 0) ? 1 : 0;
                  const present = Math.min(c.total, Math.max(c.total - 4, c.basePresent + (offset === 1 ? -1 : 0)));
                  const absent = c.total - present;
                  const pctNum = ((present / c.total) * 100).toFixed(1);
                  const status = pctNum >= 97 ? 'Top Performing' : pctNum >= 94 ? 'Normal' : 'Attention';
                  return { ...c, present, absent, pct: `${pctNum}%`, status };
                });

                return (
                  <div>
                    {/* Date Picker Bar */}
                    <div
                      style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '14px 18px',
                        background: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        borderRadius: '10px',
                        marginBottom: '20px',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#1e293b' }}>
                          Select Attendance Date:
                        </span>
                        <input
                          type="date"
                          value={selectedAttendanceDate}
                          onChange={(e) => setSelectedAttendanceDate(e.target.value)}
                          max={new Date().toISOString().split('T')[0]}
                          style={{
                            padding: '6px 12px',
                            border: '1.5px solid #10b981',
                            borderRadius: '8px',
                            fontWeight: 700,
                            color: '#047857',
                            background: '#ffffff',
                            fontSize: '0.92rem',
                            cursor: 'pointer',
                          }}
                        />
                        <button
                          type="button"
                          className="btn btn-outline btn-sm"
                          onClick={() => setSelectedAttendanceDate(new Date().toISOString().split('T')[0])}
                          style={{ padding: '5px 10px', fontSize: '0.78rem' }}
                        >
                          Today
                        </button>
                      </div>

                      <div style={{ fontSize: '0.86rem', color: '#475569', fontWeight: 600 }}>
                        Viewing: <strong style={{ color: '#047857' }}>{formattedDateStr}</strong>
                      </div>
                    </div>

                    {isSunday ? (
                      <div
                        style={{
                          padding: '30px',
                          textAlign: 'center',
                          background: '#fffbeb',
                          borderRadius: '12px',
                          border: '1px solid #fde68a',
                          marginBottom: '20px',
                        }}
                      >
                        <div style={{ fontSize: '2rem', marginBottom: '8px' }}>☀️</div>
                        <h4 style={{ margin: '0 0 4px 0', color: '#92400e' }}>School Holiday (Sunday)</h4>
                        <p style={{ margin: 0, fontSize: '0.85rem', color: '#b45309' }}>
                          No classes scheduled for Sunday. Select a weekday (Monday to Saturday) to view class-wise attendance register.
                        </p>
                      </div>
                    ) : (
                      <>
                        {/* Attendance Summary Stat Cards */}
                        <div
                          style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
                            gap: '12px',
                            marginBottom: '20px',
                          }}
                        >
                          <div style={{ background: '#ecfdf5', padding: '14px', borderRadius: '10px', border: '1px solid #a7f3d0' }}>
                            <span style={{ fontSize: '0.75rem', color: '#047857', fontWeight: 700, textTransform: 'uppercase' }}>
                              Date Attendance Rate
                            </span>
                            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#065f46' }}>{overallPct}</div>
                            <span style={{ fontSize: '0.72rem', color: '#059669' }}>
                              {totalPresent} Present / {totalStudents} Total
                            </span>
                          </div>

                          <div style={{ background: '#eff6ff', padding: '14px', borderRadius: '10px', border: '1px solid #bfdbfe' }}>
                            <span style={{ fontSize: '0.75rem', color: '#1e40af', fontWeight: 700, textTransform: 'uppercase' }}>
                              Highest Section
                            </span>
                            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#1d4ed8' }}>
                              {classRows[4].pct}
                            </div>
                            <span style={{ fontSize: '0.72rem', color: '#2563eb' }}>
                              Grade 12-A ({classRows[4].present}/{classRows[4].total})
                            </span>
                          </div>

                          <div style={{ background: '#fef3c7', padding: '14px', borderRadius: '10px', border: '1px solid #fde68a' }}>
                            <span style={{ fontSize: '0.75rem', color: '#92400e', fontWeight: 700, textTransform: 'uppercase' }}>
                              Total Absentees
                            </span>
                            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#b45309' }}>{totalAbsent}</div>
                            <span style={{ fontSize: '0.72rem', color: '#d97706' }}>Parent SMS Notifications Dispatched ✓</span>
                          </div>
                        </div>

                        {/* Class-wise Attendance Table */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                          <h4 style={{ margin: 0, fontSize: '0.95rem', color: '#1e293b' }}>
                            All Classes & Sections Breakdown for {formattedDateStr}:
                          </h4>
                          <span className="badge badge-info" style={{ fontSize: '0.75rem' }}>
                            12 Active Sections
                          </span>
                        </div>

                        <div className="table-responsive">
                          <table className="sa-schools-table">
                            <thead>
                              <tr>
                                <th>Class & Section</th>
                                <th>Class Teacher</th>
                                <th>Total Strength</th>
                                <th>Present</th>
                                <th>Absent</th>
                                <th>Attendance %</th>
                                <th>Status</th>
                                <th style={{ textAlign: 'center' }}>Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {classRows.map((row, idx) => (
                                <tr
                                  key={idx}
                                  style={{ cursor: 'pointer', transition: 'background 0.15s ease' }}
                                  title={`Click to view student attendance for ${row.cls}`}
                                  onClick={() => setAttendanceClassModal({ ...row, date: formattedDateStr })}
                                >
                                  <td data-label="Class & Section"><strong style={{ color: '#1e40af' }}>{row.cls}</strong></td>
                                  <td data-label="Class Teacher">{row.teacher}</td>
                                  <td data-label="Total Strength">{row.total}</td>
                                  <td data-label="Present"><span style={{ color: '#16a34a', fontWeight: 700 }}>{row.present}</span></td>
                                  <td data-label="Absent"><span style={{ color: '#dc2626', fontWeight: 700 }}>{row.absent}</span></td>
                                  <td data-label="Attendance %">
                                    <span className={`badge ${parseFloat(row.pct) >= 97 ? 'badge-success' : parseFloat(row.pct) >= 94 ? 'badge-primary' : 'badge-warning'}`}>
                                      {row.pct}
                                    </span>
                                  </td>
                                  <td data-label="Status">
                                    <span style={{ fontSize: '0.78rem', color: row.status.includes('Top') ? '#16a34a' : row.status === 'Normal' ? '#2563eb' : '#d97706', fontWeight: 600 }}>
                                      {row.status}
                                    </span>
                                  </td>
                                  <td data-label="Action" style={{ textAlign: 'center' }}>
                                    <span style={{ fontSize: '0.75rem', color: '#2563eb', fontWeight: 700 }}>
                                      View Roll Call &rarr;
                                    </span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </>
                    )}
                  </div>
                );
              })()}

              {/* 2. TOTAL ENROLLED STUDENTS DRILLDOWN */}
              {analyticsModal === 'students' && (
                <div>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                      gap: '12px',
                      marginBottom: '20px',
                    }}
                  >
                    <div style={{ background: '#eff6ff', padding: '14px', borderRadius: '10px', border: '1px solid #bfdbfe' }}>
                      <span style={{ fontSize: '0.75rem', color: '#1e40af', fontWeight: 700, textTransform: 'uppercase' }}>Total Enrolled</span>
                      <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#1e3a8a' }}>482 Students</div>
                      <span style={{ fontSize: '0.72rem', color: '#2563eb' }}>16 Sections Active</span>
                    </div>

                    <div style={{ background: '#ecfdf5', padding: '14px', borderRadius: '10px', border: '1px solid #a7f3d0' }}>
                      <span style={{ fontSize: '0.75rem', color: '#047857', fontWeight: 700, textTransform: 'uppercase' }}>Girl Students Ratio</span>
                      <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#065f46' }}>54.2%</div>
                      <span style={{ fontSize: '0.72rem', color: '#059669' }}>261 Girls / 221 Boys</span>
                    </div>

                    <div style={{ background: '#faf5ff', padding: '14px', borderRadius: '10px', border: '1px solid #e9d5ff' }}>
                      <span style={{ fontSize: '0.75rem', color: '#6b21a8', fontWeight: 700, textTransform: 'uppercase' }}>New Admissions (2026-27)</span>
                      <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#7e22ce' }}>+84 Fresh Admissions</div>
                      <span style={{ fontSize: '0.72rem', color: '#9333ea' }}>+12% Annual Growth</span>
                    </div>
                  </div>

                  <h4 style={{ margin: '0 0 10px 0', fontSize: '0.95rem', color: '#1e293b' }}>
                    Section Capacity & Enrolled Strength Matrix:
                  </h4>
                  <div className="table-responsive">
                    <table className="sa-schools-table">
                      <thead>
                        <tr>
                          <th>Grade / Standard</th>
                          <th>Sections</th>
                          <th>Total Students</th>
                          <th>Boys</th>
                          <th>Girls</th>
                          <th>Class Capacity</th>
                          <th>Occupancy</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { grade: 'Grade 12 (Higher Secondary)', sections: '12-A (Sci), 12-B (Com)', total: 83, boys: 38, girls: 45, cap: 90, occ: '92.2%' },
                          { grade: 'Grade 11 (Higher Secondary)', sections: '11-A (Sci), 11-B (Arts)', total: 79, boys: 36, girls: 43, cap: 90, occ: '87.7%' },
                          { grade: 'Grade 10 (Secondary Board)', sections: '10-A, 10-B', total: 75, boys: 34, girls: 41, cap: 80, occ: '93.7%' },
                          { grade: 'Grade 9 (Secondary)', sections: '9-A, 9-B', total: 71, boys: 32, girls: 39, cap: 80, occ: '88.7%' },
                          { grade: 'Grade 8 (Middle School)', sections: '8-A, 8-B', total: 71, boys: 33, girls: 38, cap: 80, occ: '88.7%' },
                          { grade: 'Grade 7 (Middle School)', sections: '7-A, 7-B', total: 68, boys: 31, girls: 37, cap: 80, occ: '85.0%' },
                          { grade: 'Grade 6 (Upper Primary)', sections: '6-A', total: 35, boys: 17, girls: 18, cap: 40, occ: '87.5%' },
                        ].map((row, idx) => (
                          <tr key={idx}>
                            <td data-label="Grade / Standard"><strong>{row.grade}</strong></td>
                            <td data-label="Sections">{row.sections}</td>
                            <td data-label="Total Students"><strong>{row.total}</strong></td>
                            <td data-label="Boys">{row.boys}</td>
                            <td data-label="Girls">{row.girls}</td>
                            <td data-label="Class Capacity">{row.cap}</td>
                            <td data-label="Occupancy">
                              <span className="badge badge-success">{row.occ}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* 3. TEACHING STAFF ON DUTY DRILLDOWN */}
              {analyticsModal === 'staff' && (
                <div>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                      gap: '12px',
                      marginBottom: '20px',
                    }}
                  >
                    <div style={{ background: '#fef3c7', padding: '14px', borderRadius: '10px', border: '1px solid #fde68a' }}>
                      <span style={{ fontSize: '0.75rem', color: '#92400e', fontWeight: 700, textTransform: 'uppercase' }}>Present on Duty</span>
                      <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#b45309' }}>32 / 34 Faculty</div>
                      <span style={{ fontSize: '0.72rem', color: '#d97706' }}>94.1% Staff Presence</span>
                    </div>

                    <div style={{ background: '#fee2e2', padding: '14px', borderRadius: '10px', border: '1px solid #fca5a5' }}>
                      <span style={{ fontSize: '0.75rem', color: '#991b1b', fontWeight: 700, textTransform: 'uppercase' }}>On Approved Leave</span>
                      <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#dc2626' }}>2 Faculty</div>
                      <span style={{ fontSize: '0.72rem', color: '#b91c1c' }}>Substitute Arrangements Made ✓</span>
                    </div>

                    <div style={{ background: '#ecfdf5', padding: '14px', borderRadius: '10px', border: '1px solid #a7f3d0' }}>
                      <span style={{ fontSize: '0.75rem', color: '#047857', fontWeight: 700, textTransform: 'uppercase' }}>Period Coverage Rate</span>
                      <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#065f46' }}>100%</div>
                      <span style={{ fontSize: '0.72rem', color: '#059669' }}>0 Free / Unattended Periods</span>
                    </div>
                  </div>

                  <h4 style={{ margin: '0 0 10px 0', fontSize: '0.95rem', color: '#1e293b' }}>
                    Faculty Daily Log & Department Status:
                  </h4>
                  <div className="table-responsive">
                    <table className="sa-schools-table">
                      <thead>
                        <tr>
                          <th>Faculty Name</th>
                          <th>Department</th>
                          <th>Assigned Class</th>
                          <th>Morning Punch</th>
                          <th>Duty Status</th>
                          <th>Periods Assigned</th>
                          <th style={{ textAlign: 'center' }}>Timetable</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { name: 'Mrs. Priya Krishnan', dept: 'Mathematics', cls: 'Grade 10-A', punch: '08:15 AM', status: 'On Duty', periods: '5 Periods' },
                          { name: 'Dr. Anandhi Rajan', dept: 'Physics', cls: 'Grade 11-A', punch: '08:20 AM', status: 'On Duty', periods: '4 Periods + Lab' },
                          { name: 'Mr. Anand Narayanan', dept: 'Physics', cls: 'Grade 12-A', punch: '08:12 AM', status: 'On Duty', periods: '5 Periods' },
                          { name: 'Mrs. Selvi Murugan', dept: 'Chemistry', cls: 'Grade 9-A', punch: '—', status: 'On Leave (Casual)', periods: 'Substituted by Dr. Rajan' },
                          { name: 'Mr. Ramanathan K.', dept: 'Computer Science', cls: 'Grade 10-B', punch: '08:25 AM', status: 'On Duty', periods: '4 Lab Sessions' },
                          { name: 'Mrs. Jayanthi S.', dept: 'English', cls: 'Grade 11-B', punch: '08:18 AM', status: 'On Duty', periods: '5 Periods' },
                          { name: 'Ms. K. Suganthi', dept: 'Social Science', cls: 'Grade 8-B', punch: '08:22 AM', status: 'On Duty', periods: '4 Periods' },
                          { name: 'Mr. V. Balaji', dept: 'Biology', cls: 'Grade 9-B', punch: '—', status: 'On Leave (Medical)', periods: 'Substituted by Ms. Meena' },
                        ].map((t, idx) => {
                          const isSelected = activeTimetableStaff?.name === t.name;
                          return (
                            <tr
                              key={idx}
                              onClick={() => {
                                setActiveTimetableStaff(isSelected ? null : t);
                                setStaffTimetableModal(t);
                              }}
                              style={{
                                cursor: 'pointer',
                                transition: 'background-color 0.15s ease',
                                background: isSelected ? '#eff6ff' : 'transparent',
                              }}
                              title={`Click to view ${t.name}'s weekly timetable right here`}
                            >
                              <td data-label="Faculty Name">
                                <span style={{ color: '#1d4ed8', fontWeight: 700, textDecoration: 'underline' }}>
                                  👩‍🏫 {t.name}
                                </span>
                              </td>
                              <td data-label="Department">{t.dept}</td>
                              <td data-label="Assigned Class">{t.cls}</td>
                              <td data-label="Morning Punch"><code>{t.punch}</code></td>
                              <td data-label="Duty Status">
                                <span className={`badge ${t.status.includes('Duty') ? 'badge-success' : 'badge-danger'}`}>
                                  {t.status}
                                </span>
                              </td>
                              <td data-label="Periods Assigned">{t.periods}</td>
                              <td data-label="Timetable" style={{ textAlign: 'center' }}>
                                <button
                                  type="button"
                                  className={`btn ${isSelected ? 'btn-success' : 'btn-primary'} btn-sm`}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setActiveTimetableStaff(isSelected ? null : t);
                                    setStaffTimetableModal(t);
                                  }}
                                  style={{
                                    padding: '4px 10px',
                                    fontSize: '0.78rem',
                                    borderRadius: '6px',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '4px'
                                  }}
                                >
                                  📅 {isSelected ? 'Viewing Timetable ✓' : 'View Timetable →'}
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {/* Inline Timetable Display Right Below Table */}
                  {activeTimetableStaff && (() => {
                    const staff = activeTimetableStaff;
                    const allDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
                    const allPeriods = [
                      { period: 1, time: '09:00 - 10:00' },
                      { period: 2, time: '10:15 - 11:15' },
                      { period: 3, time: '11:30 - 12:30' },
                      { period: 4, time: '01:30 - 02:30' },
                      { period: 5, time: '02:45 - 03:45' },
                    ];

                    const assignedSlots = (data.classTimetables || []).filter(
                      (s) => s.teacherName === staff.name
                    );

                    const getInlineSlot = (day, pNum) => {
                      const match = assignedSlots.find(
                        (s) => s.day === day && parseInt(s.period) === pNum
                      );
                      if (match) return match;
                      const hash = (staff.name.charCodeAt(0) + day.charCodeAt(0) + pNum) % 6;
                      if (hash === 0 || hash === 3) return null;
                      const gradeFallback = staff.cls && staff.cls.includes('Grade') ? staff.cls : 'Grade 10-B';
                      return {
                        className: gradeFallback,
                        subject: staff.dept || 'Core Subject',
                        room: 'Room ' + (100 + (pNum * 2))
                      };
                    };

                    return (
                      <div
                        style={{
                          marginTop: '20px',
                          border: '2px solid #3b82f6',
                          borderRadius: '12px',
                          background: '#ffffff',
                          overflow: 'hidden',
                          boxShadow: '0 8px 24px rgba(37,99,235,0.12)',
                          animation: 'fadeIn 0.2s ease-in-out'
                        }}
                      >
                        <div
                          style={{
                            background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)',
                            color: '#ffffff',
                            padding: '12px 18px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontSize: '1.3rem' }}>📅</span>
                            <div>
                              <strong style={{ fontSize: '1rem' }}>
                                Weekly Teaching Timetable &mdash; {staff.name}
                              </strong>
                              <span style={{ fontSize: '0.8rem', opacity: 0.9, marginLeft: '8px' }}>
                                ({staff.dept} &bull; {staff.cls})
                              </span>
                            </div>
                          </div>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button
                              type="button"
                              className="btn btn-sm"
                              onClick={() => window.print()}
                              style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: '#fff', fontSize: '0.78rem' }}
                            >
                              🖨️ Print
                            </button>
                            <button
                              type="button"
                              onClick={() => setActiveTimetableStaff(null)}
                              style={{
                                background: 'rgba(255,255,255,0.25)',
                                border: 'none',
                                color: '#ffffff',
                                borderRadius: '50%',
                                width: '26px',
                                height: '26px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: 700
                              }}
                              title="Close Timetable"
                            >
                              ✕
                            </button>
                          </div>
                        </div>

                        <div style={{ padding: '16px', overflowX: 'auto' }}>
                          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center', minWidth: '600px' }}>
                            <thead>
                              <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                                <th style={{ padding: '10px 8px', fontSize: '0.82rem', textAlign: 'left', color: '#1e3a8a', width: '130px' }}>
                                  Period / Time
                                </th>
                                {allDays.map((d) => (
                                  <th key={d} style={{ padding: '10px 8px', fontSize: '0.82rem', color: '#1e3a8a' }}>
                                    {d}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {allPeriods.map((p) => (
                                <tr key={p.period} style={{ borderBottom: '1px solid #e2e8f0' }}>
                                  <td style={{ padding: '8px 10px', textAlign: 'left', background: '#f8fafc', borderRight: '1px solid #e2e8f0' }}>
                                    <div style={{ fontWeight: 800, color: '#1e3a8a', fontSize: '0.82rem' }}>
                                      Period {p.period}
                                    </div>
                                    <div style={{ fontSize: '0.7rem', color: '#64748b' }}>
                                      {p.time}
                                    </div>
                                  </td>
                                  {allDays.map((d) => {
                                    const slot = getInlineSlot(d, p.period);
                                    return (
                                      <td key={d} style={{ padding: '6px', verticalAlign: 'top' }}>
                                        {slot ? (
                                          <div
                                            style={{
                                              background: '#eff6ff',
                                              borderLeft: '3px solid #2563eb',
                                              padding: '6px 8px',
                                              borderRadius: '5px',
                                              textAlign: 'left',
                                            }}
                                          >
                                            <div style={{ fontWeight: 800, color: '#1e3a8a', fontSize: '0.78rem' }}>
                                              {slot.subject}
                                            </div>
                                            <div style={{ fontSize: '0.7rem', color: '#2563eb', fontWeight: 600 }}>
                                              📍 {slot.className}
                                            </div>
                                          </div>
                                        ) : (
                                          <div
                                            style={{
                                              background: '#f8fafc',
                                              border: '1px dashed #cbd5e1',
                                              padding: '6px 8px',
                                              borderRadius: '5px',
                                              color: '#94a3b8',
                                              fontSize: '0.72rem',
                                              fontStyle: 'italic'
                                            }}
                                          >
                                            ☕ Free Slot
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
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* 4. PASS PERCENTAGE & ACADEMIC DRILLDOWN */}
              {analyticsModal === 'results' && (
                <div>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                      gap: '12px',
                      marginBottom: '20px',
                    }}
                  >
                    <div style={{ background: '#faf5ff', padding: '14px', borderRadius: '10px', border: '1px solid #e9d5ff' }}>
                      <span style={{ fontSize: '0.75rem', color: '#6b21a8', fontWeight: 700, textTransform: 'uppercase' }}>Overall Pass Rate</span>
                      <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#6d28d9' }}>98.2%</div>
                      <span style={{ fontSize: '0.72rem', color: '#7c3aed' }}>State Board Mock Exam Series</span>
                    </div>

                    <div style={{ background: '#ecfdf5', padding: '14px', borderRadius: '10px', border: '1px solid #a7f3d0' }}>
                      <span style={{ fontSize: '0.75rem', color: '#047857', fontWeight: 700, textTransform: 'uppercase' }}>Distinctions (A+)</span>
                      <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#065f46' }}>148 Students</div>
                      <span style={{ fontSize: '0.72rem', color: '#059669' }}>38% of total student body</span>
                    </div>

                    <div style={{ background: '#eff6ff', padding: '14px', borderRadius: '10px', border: '1px solid #bfdbfe' }}>
                      <span style={{ fontSize: '0.75rem', color: '#1e40af', fontWeight: 700, textTransform: 'uppercase' }}>Centum Scores (100/100)</span>
                      <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#1e3a8a' }}>18 Centums</div>
                      <span style={{ fontSize: '0.72rem', color: '#2563eb' }}>Math (9), Physics (6), CS (3)</span>
                    </div>
                  </div>

                  <h4 style={{ margin: '0 0 10px 0', fontSize: '0.95rem', color: '#1e293b' }}>
                    Subject-Wise Academic Performance & Distinctions:
                  </h4>
                  <div className="table-responsive">
                    <table className="sa-schools-table">
                      <thead>
                        <tr>
                          <th>Subject</th>
                          <th>Department Head</th>
                          <th>Students Appeared</th>
                          <th>Pass Rate %</th>
                          <th>Class Average Score</th>
                          <th>Centums (100)</th>
                          <th>Performance Rating</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { subject: 'Mathematics', hod: 'Mrs. Priya Krishnan', appeared: 78, pass: '99.1%', avg: '88.5%', centum: 9, rating: 'Outstanding' },
                          { subject: 'Physics', hod: 'Dr. Anandhi Rajan', appeared: 78, pass: '98.5%', avg: '86.2%', centum: 6, rating: 'Excellent' },
                          { subject: 'Chemistry', hod: 'Mrs. Selvi Murugan', appeared: 78, pass: '97.4%', avg: '83.7%', centum: 2, rating: 'Very Good' },
                          { subject: 'Computer Science', hod: 'Mr. Ramanathan K.', appeared: 45, pass: '100%', avg: '92.4%', centum: 3, rating: 'Exceptional' },
                          { subject: 'English Literature', hod: 'Mrs. Jayanthi S.', appeared: 78, pass: '98.8%', avg: '85.6%', centum: 1, rating: 'Excellent' },
                          { subject: 'Tamil Language', hod: 'Mr. K. Parthiban', appeared: 78, pass: '99.5%', avg: '89.1%', centum: 4, rating: 'Outstanding' },
                        ].map((row, idx) => (
                          <tr key={idx}>
                            <td data-label="Subject"><strong>{row.subject}</strong></td>
                            <td data-label="Department Head">{row.hod}</td>
                            <td data-label="Students Appeared">{row.appeared}</td>
                            <td data-label="Pass Rate %"><strong style={{ color: '#16a34a' }}>{row.pass}</strong></td>
                            <td data-label="Class Average">{row.avg}</td>
                            <td data-label="Centums (100)"><span className="badge badge-success">{row.centum} Centum</span></td>
                            <td data-label="Rating">
                              <span className="badge badge-primary">{row.rating}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px 24px',
                background: '#f8fafc',
                borderTop: '1px solid #e2e8f0',
              }}
            >
              <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                ZenSchool Principal Analytics Suite &bull; Real-time Campus Synchronized
              </span>
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={() => setAnalyticsModal(null)}
              >
                Close Drilldown
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* ATTENDANCE CLASS MODAL - STUDENT-WISE DETAILED ROLL CALL */}
      {/* =================================================================== */}
      {attendanceClassModal && (() => {
        // Students belonging to or synthesized for this class
        const existingClassStudents = (data.students || []).filter(
          (s) => s.class === attendanceClassModal.cls
        );

        // Fill up realistic student list for the class strength
        const studentNamesPool = [
          'Aishwarya Kumar', 'Kavitha Selvam', 'Sandhya Ramesh', 'Deepa Venkatesh', 'Meena Natarajan',
          'Priyadarshini Sundaram', 'Ananya Raghavan', 'Divya Meenakshi', 'Harini Balaji', 'Janani Swaminathan',
          'Keerthana Murugan', 'Lavanya Sridhar', 'Nandhini Prakash', 'Pavithra Rajesh', 'Rohini Gopal',
          'Sangeetha Raman', 'Swathi Narayanan', 'Tharani Vignesh', 'Vaishnavi Chandran', 'Yuvashree Mohan',
          'Bhavani Shankar', 'Charulatha Iyer', 'Dhanalakshmi V.', 'Gayathri Krishnan', 'Ishwarya R.',
          'Karpagam S.', 'Malathi R.', 'Nithya Kalyani', 'Preethi Varma', 'Radha Madhavan',
          'Shobana K.', 'Subhashini G.', 'Uma Maheshwari', 'Vandana Rao', 'Vidya Sagar',
          'Yamuna Devi', 'Abirami S.', 'Hemalatha K.', 'Karthika R.', 'Manju Bhargavi'
        ];

        const targetCount = attendanceClassModal.total || 38;
        const absentCount = attendanceClassModal.absent || 2;
        const presentCount = attendanceClassModal.present || (targetCount - absentCount);

        const studentsList = Array.from({ length: targetCount }).map((_, i) => {
          const roll = `S${attendanceClassModal.cls.replace(/[^0-9]/g, '') || '10'}${String(i + 1).padStart(2, '0')}`;
          const existing = existingClassStudents[i];
          const name = existing ? existing.name : studentNamesPool[i % studentNamesPool.length];
          // Last few students marked absent to match absentCount
          const isAbsent = i >= presentCount;
          const status = isAbsent ? 'Absent' : 'Present';
          const punchTime = isAbsent ? '—' : `08:${String(15 + (i % 25)).padStart(2, '0')} AM`;
          const parentContact = `+91 98401 ${String(23450 + (i % 90)).padStart(5, '0')}`;
          return { roll, name, status, punchTime, parentContact };
        });

        return (
          <div className="modal-backdrop" onClick={() => setAttendanceClassModal(null)}>
            <div
              className="modal-content"
              style={{ maxWidth: '850px', width: '92%', borderRadius: '14px', overflow: 'hidden' }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div
                style={{
                  background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)',
                  color: '#ffffff',
                  padding: '20px 24px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '1.4rem' }}>🏫</span>
                    <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800 }}>
                      {attendanceClassModal.cls} &bull; Daily Attendance Register
                    </h3>
                  </div>
                  <p style={{ margin: '4px 0 0 0', fontSize: '0.82rem', opacity: 0.9 }}>
                    Class Teacher: <strong>{attendanceClassModal.teacher}</strong> &bull; {attendanceClassModal.room} &bull; Date: <strong>{attendanceClassModal.date}</strong>
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setAttendanceClassModal(null)}
                  style={{
                    background: 'rgba(255, 255, 255, 0.2)',
                    border: 'none',
                    color: '#ffffff',
                    fontSize: '1.2rem',
                    cursor: 'pointer',
                    borderRadius: '50%',
                    width: '32px',
                    height: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  ✕
                </button>
              </div>

              {/* Modal Body */}
              <div style={{ padding: '24px', maxHeight: '72vh', overflowY: 'auto' }}>
                {/* Class Stats Summary */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
                    gap: '12px',
                    marginBottom: '20px',
                  }}
                >
                  <div style={{ background: '#eff6ff', padding: '12px 16px', borderRadius: '10px', border: '1px solid #bfdbfe' }}>
                    <span style={{ fontSize: '0.74rem', color: '#1e40af', fontWeight: 700, textTransform: 'uppercase' }}>Total Enrolled</span>
                    <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1e3a8a' }}>{attendanceClassModal.total}</div>
                  </div>

                  <div style={{ background: '#ecfdf5', padding: '12px 16px', borderRadius: '10px', border: '1px solid #a7f3d0' }}>
                    <span style={{ fontSize: '0.74rem', color: '#047857', fontWeight: 700, textTransform: 'uppercase' }}>Present Today</span>
                    <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#065f46' }}>{attendanceClassModal.present}</div>
                  </div>

                  <div style={{ background: '#fee2e2', padding: '12px 16px', borderRadius: '10px', border: '1px solid #fca5a5' }}>
                    <span style={{ fontSize: '0.74rem', color: '#991b1b', fontWeight: 700, textTransform: 'uppercase' }}>Absent Today</span>
                    <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#dc2626' }}>{attendanceClassModal.absent}</div>
                  </div>

                  <div style={{ background: '#f8fafc', padding: '12px 16px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                    <span style={{ fontSize: '0.74rem', color: '#475569', fontWeight: 700, textTransform: 'uppercase' }}>Attendance Rate</span>
                    <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#059669' }}>{attendanceClassModal.pct}</div>
                  </div>
                </div>

                {/* Student Roster Table */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <h4 style={{ margin: 0, fontSize: '0.95rem', color: '#1e293b' }}>
                    Student Roll Call & Daily In-Time Status:
                  </h4>
                  <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                    Morning Biometric / QR Attendance Sync
                  </span>
                </div>

                <div className="table-responsive">
                  <table className="sa-schools-table">
                    <thead>
                      <tr>
                        <th>Roll No</th>
                        <th>Student Full Name</th>
                        <th>Class & Section</th>
                        <th>Parent Contact</th>
                        <th style={{ textAlign: 'center' }}>Attendance Status</th>
                        <th style={{ textAlign: 'center' }}>Parent Notification</th>
                      </tr>
                    </thead>
                    <tbody>
                      {studentsList.map((st) => (
                        <tr key={st.roll}>
                          <td data-label="Roll No"><code>{st.roll}</code></td>
                          <td data-label="Student Name"><strong>{st.name}</strong></td>
                          <td data-label="Class">
                            <span className="badge badge-info" style={{ fontWeight: 700 }}>
                              {attendanceClassModal.cls}
                            </span>
                          </td>
                          <td data-label="Parent Contact" style={{ fontSize: '0.85rem', color: '#475569' }}>{st.parentContact}</td>
                          <td data-label="Status" style={{ textAlign: 'center' }}>
                            <span className={`badge ${st.status === 'Present' ? 'badge-success' : 'badge-danger'}`}>
                              {st.status}
                            </span>
                          </td>
                          <td data-label="Notification" style={{ textAlign: 'center' }}>
                            {st.status === 'Absent' ? (
                              <span style={{ fontSize: '0.78rem', color: '#dc2626', fontWeight: 600 }}>
                                📲 SMS Alert Sent
                              </span>
                            ) : (
                              <span style={{ fontSize: '0.78rem', color: '#16a34a', fontWeight: 600 }}>
                                ✓ Verified Present
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Modal Footer */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px 24px',
                  background: '#f8fafc',
                  borderTop: '1px solid #e2e8f0',
                }}
              >
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  onClick={() => window.print()}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  🖨️ Print Class Roll Call
                </button>
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={() => setAttendanceClassModal(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* =================================================================== */}
      {/* PRINCIPAL FACULTY / STAFF TIMETABLE MODAL */}
      {/* =================================================================== */}
      {staffTimetableModal && (() => {
        const staff = staffTimetableModal;
        const allDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
        const allPeriods = [
          { period: 1, time: '09:00 - 10:00' },
          { period: 2, time: '10:15 - 11:15' },
          { period: 3, time: '11:30 - 12:30' },
          { period: 4, time: '01:30 - 02:30' },
          { period: 5, time: '02:45 - 03:45' },
        ];

        // Find assigned timetable slots from portal data
        const assignedSlots = (data.classTimetables || []).filter(
          (s) => s.teacherName === staff.name
        );

        // Helper to get slot for day & period
        const getSlot = (day, periodNum) => {
          const directMatch = assignedSlots.find(
            (s) => s.day === day && parseInt(s.period) === periodNum
          );
          if (directMatch) return directMatch;

          // Default fallback timetable distribution if teacher hasn't custom slots in classTimetables
          // Dr. Anandhi Rajan, Mrs. Priya Krishnan, Mrs. Selvi Murugan have default entries in classTimetables
          // For other teachers, construct realistic periods
          const teacherHash = (staff.name.charCodeAt(0) + day.charCodeAt(0) + periodNum) % 6;
          if (teacherHash === 0 || teacherHash === 3) {
            return null; // Free / Preparation Period
          }
          const gradeFallback = staff.cls && staff.cls.includes('Grade') ? staff.cls : 'Grade 10-B';
          return {
            className: gradeFallback,
            subject: staff.dept || 'Core Subject',
            room: 'Room ' + (100 + (periodNum * 2))
          };
        };

        // Calculate workload
        let totalAssignedPeriods = 0;
        allDays.forEach((day) => {
          allPeriods.forEach((p) => {
            if (getSlot(day, p.period)) totalAssignedPeriods++;
          });
        });

        return (
          <div className="modal-backdrop" onClick={() => setStaffTimetableModal(null)} style={{ zIndex: 9999 }}>
            <div
              className="modal-content"
              style={{ maxWidth: '920px', width: '94%', borderRadius: '14px', overflow: 'hidden' }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div
                style={{
                  background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
                  color: '#ffffff',
                  padding: '20px 24px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '1.6rem' }}>👩‍🏫</span>
                    <div>
                      <h3 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 800 }}>
                        {staff.name} &bull; Weekly Teaching Timetable
                      </h3>
                      <p style={{ margin: '4px 0 0 0', fontSize: '0.84rem', opacity: 0.9 }}>
                        Department: <strong>{staff.dept}</strong> &bull; Primary Class: <strong>{staff.cls || 'All Grades'}</strong> &bull; Status: <span className="badge badge-success" style={{ marginLeft: '4px' }}>{staff.status || 'Active'}</span>
                      </p>
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setStaffTimetableModal(null)}
                  style={{
                    background: 'rgba(255, 255, 255, 0.2)',
                    border: 'none',
                    color: '#ffffff',
                    fontSize: '1.2rem',
                    cursor: 'pointer',
                    borderRadius: '50%',
                    width: '32px',
                    height: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  title="Close modal"
                >
                  &times;
                </button>
              </div>

              {/* Body */}
              <div style={{ padding: '20px 24px', maxHeight: '72vh', overflowY: 'auto' }}>
                {/* Stats Bar */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '12px',
                    marginBottom: '20px',
                  }}
                >
                  <div
                    style={{
                      background: '#eff6ff',
                      padding: '12px 16px',
                      borderRadius: '8px',
                      border: '1px solid #bfdbfe',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                    }}
                  >
                    <span style={{ fontSize: '1.5rem' }}>📚</span>
                    <div>
                      <div style={{ fontSize: '0.75rem', color: '#1e40af', fontWeight: 700, textTransform: 'uppercase' }}>
                        Weekly Teaching Hours
                      </div>
                      <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#1e3a8a' }}>
                        {totalAssignedPeriods} Periods / Week
                      </div>
                    </div>
                  </div>

                  <div
                    style={{
                      background: '#f0fdf4',
                      padding: '12px 16px',
                      borderRadius: '8px',
                      border: '1px solid #bbf7d0',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                    }}
                  >
                    <span style={{ fontSize: '1.5rem' }}>☕</span>
                    <div>
                      <div style={{ fontSize: '0.75rem', color: '#166534', fontWeight: 700, textTransform: 'uppercase' }}>
                        Preparation & Free Slots
                      </div>
                      <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#15803d' }}>
                        {25 - totalAssignedPeriods} Free Slots
                      </div>
                    </div>
                  </div>

                  <div
                    style={{
                      background: '#fef3c7',
                      padding: '12px 16px',
                      borderRadius: '8px',
                      border: '1px solid #fde68a',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                    }}
                  >
                    <span style={{ fontSize: '1.5rem' }}>🏫</span>
                    <div>
                      <div style={{ fontSize: '0.75rem', color: '#92400e', fontWeight: 700, textTransform: 'uppercase' }}>
                        Department / Lab Assigned
                      </div>
                      <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#b45309' }}>
                        {staff.dept} Department
                      </div>
                    </div>
                  </div>
                </div>

                {/* Timetable Weekly Matrix */}
                <div className="table-responsive">
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center' }}>
                    <thead>
                      <tr style={{ background: '#f8fafc', borderBottom: '2px solid #cbd5e1' }}>
                        <th style={{ padding: '12px 10px', minWidth: '130px', textAlign: 'left', color: '#1e3a8a' }}>
                          Period / Time
                        </th>
                        {allDays.map((d) => (
                          <th key={d} style={{ padding: '12px 10px', minWidth: '130px', color: '#1e3a8a' }}>
                            {d}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {allPeriods.map((p) => (
                        <tr key={p.period} style={{ borderBottom: '1px solid #e2e8f0' }}>
                          <td
                            style={{
                              padding: '12px 10px',
                              textAlign: 'left',
                              background: '#f8fafc',
                              borderRight: '1px solid #e2e8f0'
                            }}
                          >
                            <div style={{ fontWeight: 800, color: '#1e3a8a', fontSize: '0.88rem' }}>
                              Period {p.period}
                            </div>
                            <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                              {p.time}
                            </div>
                          </td>

                          {allDays.map((day) => {
                            const slot = getSlot(day, p.period);
                            return (
                              <td key={day} style={{ padding: '8px', verticalAlign: 'top' }}>
                                {slot ? (
                                  <div
                                    style={{
                                      background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
                                      borderLeft: '4px solid #2563eb',
                                      padding: '8px 10px',
                                      borderRadius: '6px',
                                      textAlign: 'left',
                                      boxShadow: '0 1px 2px rgba(0,0,0,0.04)'
                                    }}
                                  >
                                    <div style={{ fontWeight: 800, color: '#1e3a8a', fontSize: '0.82rem' }}>
                                      {slot.subject}
                                    </div>
                                    <div style={{ fontSize: '0.74rem', color: '#2563eb', fontWeight: 600, marginTop: '2px' }}>
                                      📍 {slot.className}
                                    </div>
                                  </div>
                                ) : (
                                  <div
                                    style={{
                                      background: '#f8fafc',
                                      border: '1px dashed #cbd5e1',
                                      padding: '8px 10px',
                                      borderRadius: '6px',
                                      textAlign: 'center',
                                      color: '#94a3b8',
                                      fontSize: '0.75rem',
                                      fontStyle: 'italic'
                                    }}
                                  >
                                    ☕ Free / Prep Period
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
              </div>

              {/* Footer */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '14px 24px',
                  background: '#f8fafc',
                  borderTop: '1px solid #e2e8f0',
                }}
              >
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  onClick={() => window.print()}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  🖨️ Print Faculty Timetable
                </button>
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={() => setStaffTimetableModal(null)}
                >
                  Close Timetable
                </button>
              </div>
            </div>
          </div>
        );
      })()}
      <InteractiveServicePlayerModal
        isOpen={!!activePlayService}
        service={activePlayService}
        onClose={() => setActivePlayService(null)}
      />
    </div>
  );
}
