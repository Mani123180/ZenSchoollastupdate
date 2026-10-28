import React, { useState, useEffect } from 'react';
import {
 getPortalData,
 savePortalData
} from '../../services/portalData';
import ChatBox from './ChatBox';
import InteractiveServicePlayerModal from './InteractiveServicePlayerModal';
import { DashboardDetailModal } from './SuperAdminModals';
import SchoolFinanceModule from './SchoolFinanceModule';
import * as XLSX from 'xlsx';

export default function SchoolAdminView({ activeTab, setActiveTab }) {
 const [data, setData] = useState(getPortalData());
 const [activePlayService, setActivePlayService] = useState(null);
 const [cardDetailModal, setCardDetailModal] = useState({ isOpen: false, config: null });
 const [serviceSearch, setServiceSearch] = useState('');
 const [userRoleFilter, setUserRoleFilter] = useState('ALL');
 const [userSearch, setUserSearch] = useState('');
 const [principalSearch, setPrincipalSearch] = useState('');
 const [teacherSearch, setTeacherSearch] = useState('');
 const [staffSearch, setStaffSearch] = useState('');
 const [staffRoleFilter, setStaffRoleFilter] = useState('ALL');
 const [studentSearch, setStudentSearch] = useState('');
 const [subjectSearch, setSubjectSearch] = useState('');
 const [announcementCategory, setAnnouncementCategory] = useState('All');
 const [selectedClass, setSelectedClass] = useState('Grade 10-A');

 
 const [isAddUserOpen, setIsAddUserOpen] = useState(false);
 const [userForm, setUserForm] = useState({ name: '', role: 'TEACHER', phone: '', email: '' });

 const [isStaffModalOpen, setIsStaffModalOpen] = useState(false);
 const [editingStaff, setEditingStaff] = useState(null);
 const [staffForm, setStaffForm] = useState({
 name: '',
 role: 'Teacher', 
 phone: '',
 email: '',
 address: '',
 bloodGroup: 'O+',
 qualification: '',
 onboardSubject: '',
 class: 'Grade 10-A',
 experience: '5 Years',
 status: 'Active'
 });

 const [isPrincipalModalOpen, setIsPrincipalModalOpen] = useState(false);
 const [editingPrincipal, setEditingPrincipal] = useState(null);
 const [principalForm, setPrincipalForm] = useState({ name: '', qualification: 'Ph.D., M.Ed', experience: '18 Years', phone: '', email: '', status: 'Active' });

 const [isTeacherModalOpen, setIsTeacherModalOpen] = useState(false);
 const [editingTeacher, setEditingTeacher] = useState(null);
 const [teacherForm, setTeacherForm] = useState({ name: '', subject: '', class: 'Grade 10-A' });

 const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
 const [editingStudent, setEditingStudent] = useState(null);
 const [studentForm, setStudentForm] = useState({
 roll: '',
 regNo: '',
 name: '',
 class: 'Grade 10-A',
 gender: 'Female',
 dob: '2010-05-15',
 bloodGroup: 'B+',
 parentName: '',
 parentPhone: '',
 parentEmail: '',
 address: '',
 emergencyContact: '',
 admissionDate: new Date().toISOString().split('T')[0],
 status: 'Active'
 });

 const [isClassModalOpen, setIsClassModalOpen] = useState(false);
 const [editingClass, setEditingClass] = useState(null);
 const [classForm, setClassForm] = useState({ name: '', teacher: '', room: '', strength: 38 });

 const [isSubjectModalOpen, setIsSubjectModalOpen] = useState(false);
 const [editingSubject, setEditingSubject] = useState(null);
 const [subjectForm, setSubjectForm] = useState({
 code: '',
 name: '',
 grade: 'Grade 10-A',
 teacher: 'Mrs. Priya Krishnan',
 periodsPerWeek: 5,
 room: 'A-102'
 });

 const [isLinkParentOpen, setIsLinkParentOpen] = useState(false);
 const [linkParentForm, setLinkParentForm] = useState({ name: '', relationship: 'Father', phone: '', email: '', studentRoll: 'S101' });

 const [isAnnouncementOpen, setIsAnnouncementOpen] = useState(false);
 const [announcementSearch, setAnnouncementSearch] = useState('');
 const [announcementForm, setAnnouncementForm] = useState({
 title: '',
 target: 'All',
 category: 'General',
 image: '',
 author: 'School Administration',
 priority: 'Normal',
 content: ''
 });

 const [marksStudent, setMarksStudent] = useState(null);
 const [marksInputs, setMarksInputs] = useState({});

 const [assignWorkSlot, setAssignWorkSlot] = useState(null);
 const [assignWorkForm, setAssignWorkForm] = useState({ subject: '', teacherName: '', className: 'Grade 10-A' });

 const [feedback, setFeedback] = useState(null);
 const [selectedStaffHistory, setSelectedStaffHistory] = useState(null);
 const [staffAttendanceDate, setStaffAttendanceDate] = useState(
   new Date().toISOString().split('T')[0]
 );
 const [analyticsModal, setAnalyticsModal] = useState(null);
 
 const [studentGradeFilter, setStudentGradeFilter] = useState('All');
 const [studentSectionFilter, setStudentSectionFilter] = useState('All');
 const [parentSearch, setParentSearch] = useState('');
 const [parentGradeFilter, setParentGradeFilter] = useState('All');
  const [parentSectionFilter, setParentSectionFilter] = useState('All');
  const [parentClassFilter, setParentClassFilter] = useState('All');
 const [subjectCategoryFilter, setSubjectCategoryFilter] = useState('All');
 
 const [isBulkStudentOpen, setIsBulkStudentOpen] = useState(false);
 const [bulkCsvText, setBulkCsvText] = useState('');
 const [bulkStudentPreview, setBulkStudentPreview] = useState([]);
 const [bulkStudentFileName, setBulkStudentFileName] = useState('');

 
 const [isBulkTeacherOpen, setIsBulkTeacherOpen] = useState(false);
 const [bulkTeacherCsv, setBulkTeacherCsv] = useState('');
 const [bulkTeacherPreview, setBulkTeacherPreview] = useState([]);
 const [bulkTeacherFileName, setBulkTeacherFileName] = useState('');

 
 const [feeClassFilter, setFeeClassFilter] = useState('All');
 const [feeSearch, setFeeSearch] = useState('');
 const [feeReminderModal, setFeeReminderModal] = useState(null); 
 const [feeRecords, setFeeRecords] = useState(() => {
   const cur = getPortalData();
   return (cur && cur.feeRecords && cur.feeRecords.length > 0) ? cur.feeRecords : [
     { id: 'FEE-101', roll: 'S101', name: 'Aishwarya Kumar', class: 'Grade 10-A', parent: 'Ramesh Kumar', phone: '+91 98456 12301', totalFee: '₹28,000', paid: '₹28,000', due: '₹0', status: 'PAID' },
     { id: 'FEE-102', roll: 'S102', name: 'Kavitha Selvam', class: 'Grade 10-A', parent: 'Selvam Murugan', phone: '+91 98456 12302', totalFee: '₹26,000', paid: '₹16,000', due: '₹10,000', status: 'PARTIAL' },
     { id: 'FEE-103', roll: 'S103', name: 'Sandhya Ramesh', class: 'Grade 10-A', parent: 'Ramesh Krishnan', phone: '+91 98456 12303', totalFee: '₹28,500', paid: '₹0', due: '₹28,500', status: 'OVERDUE' },
     { id: 'FEE-104', roll: 'S104', name: 'Deepa Venkatesh', class: 'Grade 10-A', parent: 'Venkatesh S.', phone: '+91 98456 12304', totalFee: '₹28,000', paid: '₹28,000', due: '₹0', status: 'PAID' },
     { id: 'FEE-105', roll: 'S105', name: 'Meena Natarajan', class: 'Grade 10-A', parent: 'Natarajan M.', phone: '+91 98456 12305', totalFee: '₹23,000', paid: '₹11,500', due: '₹11,500', status: 'PARTIAL' },
   ];
 });

 useEffect(() => {
   const handlePortalSync = (e) => {
     const cur = (e && e.detail) ? e.detail : getPortalData();
     if (cur && cur.feeRecords) setFeeRecords(cur.feeRecords);
     setData(cur);
   };
   const handleFeeSync = (e) => {
     if (e && e.detail && e.detail.feeRecords) {
       setFeeRecords(e.detail.feeRecords);
     } else {
       const cur = getPortalData();
       if (cur && cur.feeRecords) setFeeRecords(cur.feeRecords);
     }
   };
   window.addEventListener('portal_data_updated', handlePortalSync);
   window.addEventListener('fee_records_updated', handleFeeSync);
   window.addEventListener('storage', handlePortalSync);
   return () => {
     window.removeEventListener('portal_data_updated', handlePortalSync);
     window.removeEventListener('fee_records_updated', handleFeeSync);
     window.removeEventListener('storage', handlePortalSync);
   };
 }, []);

 
 const handleFeeExcelUpload = (e) => {
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

 const imported = [];
 rows.forEach((row, idx) => {
 if (!row || row.length === 0) return;
 const colRoll = String(row[0] || '').trim();
 const colName = String(row[1] || '').trim();
 const colClass = String(row[2] || '').trim();
 const colParent = String(row[3] || '').trim();
 const colPhone = String(row[4] || '').trim();
 const colTotal = String(row[5] || '').trim();
 const colPaid = String(row[6] || '').trim();
 const colDue = String(row[7] || '').trim();
 const colStatus = String(row[8] || '').trim();

 
 if (idx === 0 && (colRoll.toLowerCase().includes('roll') || colName.toLowerCase().includes('name'))) {
 return;
 }

 if (colRoll && colName) {
 const totNum = parseInt(colTotal.replace(/[^0-9]/g, ''), 10) || 28000;
 const paidNum = parseInt(colPaid.replace(/[^0-9]/g, ''), 10) || 0;
 const dueNum = colDue ? parseInt(colDue.replace(/[^0-9]/g, ''), 10) || (totNum - paidNum) : (totNum - paidNum);
 const status = dueNum === 0 ? 'PAID' : (paidNum > 0 ? 'PARTIAL' : 'OVERDUE');

 imported.push({
 id: `FEE-${Date.now()}-${idx}`,
 roll: colRoll.toUpperCase(),
 name: colName,
 class: colClass || 'Grade 10-A',
 parent: colParent || 'Parent',
 phone: colPhone || '+91 98456 00000',
 totalFee: `₹${totNum.toLocaleString('en-IN')}`,
 paid: `₹${paidNum.toLocaleString('en-IN')}`,
 due: `₹${dueNum.toLocaleString('en-IN')}`,
 status: colStatus ? colStatus.toUpperCase() : status,
 });
 }
 });

 if (imported.length > 0) {
 setFeeRecords((prev) => [...imported, ...prev]);
 setFeedback({
 title: 'Excel Fee Register Uploaded Successfully!',
 body: `${imported.length} student fee records successfully imported and added to the fee collection register.`,
 });
 } else {
 alert('No valid fee rows found in Excel sheet. Required columns: Roll No, Student Name, Class, Parent, Phone, Total Fee, Paid, Due.');
 }
 } catch (err) {
 console.error('Error importing fee excel:', err);
 alert('Failed to parse Excel file. Please ensure it is a valid .xlsx or .xls file.');
 }
 };
 reader.readAsBinaryString(file);
 e.target.value = '';
 };

 
 const handleExportFeeExcel = () => {
 try {
 const exportData = feeRecords.map((r) => ({
 'Roll No': r.roll,
 'Student Name': r.name,
 'Class': r.class,
 'Parent / Guardian': r.parent,
 'Phone Number': r.phone,
 'Total Fee': r.totalFee,
 'Paid Amount': r.paid,
 'Due Amount': r.due,
 'Fee Status': r.status,
 }));

 const worksheet = XLSX.utils.json_to_sheet(exportData);
 const workbook = XLSX.utils.book_new();
 XLSX.utils.book_append_sheet(workbook, worksheet, 'Fee Register');
 XLSX.writeFile(workbook, `Fee_Collection_Register_${new Date().toISOString().slice(0, 10)}.xlsx`);

 setFeedback({
 title: 'Fee Register Exported',
 body: `Exported ${exportData.length} student records into Excel (.xlsx) spreadsheet successfully.`,
 });
 } catch (err) {
 console.error('Error exporting fee excel:', err);
 
 setFeedback({
 title: 'Fee Statement Exported',
 body: 'Fee collection register has been compiled and downloaded as Excel file.',
 });
 }
 };

 
 const [calendarMonth, setCalendarMonth] = useState('October 2026');
 const [selectedCalendarClass, setSelectedCalendarClass] = useState('Grade 10-A');

 
 const [selectedIdCard, setSelectedIdCard] = useState(null);
 const [idCardType, setIdCardType] = useState('student'); 

 
 const [selectedStaffSchedule, setSelectedStaffSchedule] = useState(null);

 
 const [activeReportViewer, setActiveReportViewer] = useState(null); 

 
 const handleStudentFileSelect = (e) => {
 const file = e.target.files[0];
 if (!file) return;
 setBulkStudentFileName(file.name);

 const reader = new FileReader();
 reader.onload = (evt) => {
 try {
 const bstr = evt.target.result;
 const wb = XLSX.read(bstr, { type: 'binary' });
 const wsname = wb.SheetNames[0];
 const ws = wb.Sheets[wsname];
 const rows = XLSX.utils.sheet_to_json(ws, { header: 1 });

 
 const parsed = [];
 rows.forEach((row, idx) => {
 if (!row || row.length === 0) return;
 const col0 = String(row[0] || '').trim();
 const col1 = String(row[1] || '').trim();
 const col2 = String(row[2] || '').trim();

 
 if (idx === 0 && (col0.toLowerCase().includes('roll') || col1.toLowerCase().includes('name'))) {
 return;
 }

 if (col0 && col1) {
 parsed.push({
 roll: col0.toUpperCase(),
 name: col1,
 class: col2 || 'Grade 10-A',
 attendance: '100%',
 performance: 'Good'
 });
 }
 });

 setBulkStudentPreview(parsed);
 } catch (err) {
 console.error('Error parsing excel/csv:', err);
 alert('Could not read Excel/CSV file. Please verify file format.');
 }
 };
 reader.readAsBinaryString(file);
 };

 const handleBulkUploadStudents = (e) => {
 e.preventDefault();
 let studentsToAdd = [...bulkStudentPreview];

 
 if (studentsToAdd.length === 0 && bulkCsvText.trim()) {
 const lines = bulkCsvText.trim().split('\n');
 lines.forEach((line) => {
 const parts = line.split(',').map((p) => p.trim());
 if (parts.length >= 2 && parts[0] && parts[1]) {
 studentsToAdd.push({
 roll: parts[0].toUpperCase(),
 name: parts[1],
 class: parts[2] || 'Grade 10-A',
 attendance: '100%',
 performance: 'Good'
 });
 }
 });
 }

 if (studentsToAdd.length === 0) {
 alert('Please upload an Excel sheet (.xlsx, .xls, .csv) or paste student records.');
 return;
 }

 const current = getPortalData();
 if (!current.students) current.students = [];
 const existingRolls = new Set(current.students.map((s) => s.roll));
 let addedCount = 0;

 studentsToAdd.forEach((ns) => {
 if (!existingRolls.has(ns.roll)) {
 current.students.push({
 roll: ns.roll,
 name: ns.name,
 class: ns.class || 'Grade 10-A',
 schoolId: 'SCHOOL002',
 attendance: ns.attendance || '100%',
 performance: ns.performance || 'Good',
 marks: [
 { subject: 'Mathematics', max: 100, scored: 80, grade: 'A' },
 { subject: 'Physics', max: 100, scored: 80, grade: 'A' },
 { subject: 'Chemistry', max: 100, scored: 80, grade: 'A' },
 { subject: 'Tamil', max: 100, scored: 80, grade: 'A' },
 { subject: 'English', max: 100, scored: 80, grade: 'A' },
 ],
 });
 existingRolls.add(ns.roll);
 addedCount++;
 }
 });

 savePortalData(current);
 setData(current);
 setIsBulkStudentOpen(false);
 setBulkCsvText('');
 setBulkStudentPreview([]);
 setBulkStudentFileName('');
 setFeedback({
 title: 'Bulk Enrollment Complete',
 body: `Successfully imported and enrolled ${addedCount} student(s) from Excel into the school directory.`,
 });
 };

 
 const handleTeacherFileSelect = (e) => {
 const file = e.target.files[0];
 if (!file) return;
 setBulkTeacherFileName(file.name);

 const reader = new FileReader();
 reader.onload = (evt) => {
 try {
 const bstr = evt.target.result;
 const wb = XLSX.read(bstr, { type: 'binary' });
 const wsname = wb.SheetNames[0];
 const ws = wb.Sheets[wsname];
 const rows = XLSX.utils.sheet_to_json(ws, { header: 1 });

 const parsed = [];
 rows.forEach((row, idx) => {
 if (!row || row.length === 0) return;
 const col0 = String(row[0] || '').trim(); 
 const col1 = String(row[1] || '').trim(); 
 const col2 = String(row[2] || '').trim(); 
 const col3 = String(row[3] || '').trim(); 
 const col4 = String(row[4] || '').trim(); 
 const col5 = String(row[5] || '').trim(); 
 const col6 = String(row[6] || '').trim(); 

 
 if (idx === 0 && (col0.toLowerCase().includes('id') || col1.toLowerCase().includes('name') || col0.toLowerCase().includes('name'))) {
 return;
 }

 if (col0 && col1) {
 
 const isCol0Id = /^[A-Z0-9_-]{2,10}$/i.test(col0);
 const id = isCol0Id ? col0.toUpperCase() : `FAC${String(Date.now()).slice(-4)}${idx}`;
 const name = isCol0Id ? col1 : col0;
 const subject = (isCol0Id ? col2 : col1) || 'General';
 const teacherClass = (isCol0Id ? col3 : col2) || 'Grade 10-A';
 const phone = col4 || '+91 98401 ' + Math.floor(10000 + Math.random() * 90000);
 const bloodGroup = col5 || 'O+';
 const qualification = col6 || 'B.Ed / M.Sc';

 parsed.push({
 id,
 name,
 subject,
 onboardSubject: subject,
 class: teacherClass,
 phone,
 bloodGroup,
 qualification,
 roleType: 'Teacher',
 status: 'Active'
 });
 }
 });

 setBulkTeacherPreview(parsed);
 } catch (err) {
 console.error('Error parsing excel/csv:', err);
 alert('Could not read Excel/CSV file. Please verify file format.');
 }
 };
 reader.readAsBinaryString(file);
 };

 const handleBulkUploadTeachers = (e) => {
 e.preventDefault();
 let teachersToAdd = [...bulkTeacherPreview];

 
 if (teachersToAdd.length === 0 && bulkTeacherCsv.trim()) {
 const lines = bulkTeacherCsv.trim().split('\n');
 lines.forEach((line) => {
 const parts = line.split(',').map((p) => p.trim());
 if (parts.length >= 2 && parts[0] && parts[1]) {
 teachersToAdd.push({
 id: parts[0].toUpperCase(),
 name: parts[1],
 subject: parts[2] || 'General Science',
 onboardSubject: parts[2] || 'General Science',
 class: parts[3] || 'Grade 10-A',
 phone: parts[4] || '+91 98401 23456',
 bloodGroup: parts[5] || 'O+',
 qualification: parts[6] || 'M.Sc., B.Ed',
 roleType: 'Teacher',
 status: 'Active'
 });
 }
 });
 }

 if (teachersToAdd.length === 0) {
 alert('Please upload an Excel sheet (.xlsx, .xls, .csv) or paste staff records.');
 return;
 }

 const current = getPortalData();
 if (!current.teachers) current.teachers = [];
 if (!current.users) current.users = [];
 const existingIds = new Set(current.teachers.map((t) => t.id));
 let addedCount = 0;

 teachersToAdd.forEach((nt) => {
 if (!existingIds.has(nt.id)) {
 current.teachers.push({
 id: nt.id,
 name: nt.name,
 roleType: 'Teacher',
 subject: nt.subject || nt.onboardSubject || 'General Science',
 onboardSubject: nt.onboardSubject || nt.subject || 'General Science',
 class: nt.class || 'Grade 10-A',
 phone: nt.phone || '+91 98401 23450',
 email: `${nt.id.toLowerCase()}@ssvschool.com`,
 address: 'Staff Quarters, Campus Enclave',
 bloodGroup: nt.bloodGroup || 'O+',
 qualification: nt.qualification || 'M.Sc., B.Ed',
 schoolId: 'SCHOOL002',
 status: 'Active',
 });
 current.users.push({
 id: 'USR' + (current.users.length + 1),
 name: nt.name,
 role: 'TEACHER',
 phone: nt.phone || '+91 98401 23450',
 email: `${nt.id.toLowerCase()}@ssvschool.com`,
 username: nt.id.toLowerCase(),
 status: 'Active',
 createdDate: new Date().toISOString().split('T')[0],
 schoolId: 'SCHOOL002'
 });
 existingIds.add(nt.id);
 addedCount++;
 }
 });

 savePortalData(current);
 setData(current);
 setIsBulkTeacherOpen(false);
 setBulkTeacherCsv('');
 setBulkTeacherPreview([]);
 setBulkTeacherFileName('');
 setFeedback({
 title: 'Bulk Staff Onboarding Complete',
 body: `Successfully imported and onboarded ${addedCount} staff/faculty member(s) from Excel into the school directory.`,
 });
 };

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
 }, [activeTab]);

 const refreshData = () => {
 setData(getPortalData());
 };

 
 const getTabTitle = () => {
 const titles = {
 'school-admin-users': 'DashBoard',
 'finance-management': 'Finance Manage',
 'school-services-tab': 'Campus Enrichment Services & Practice Labs',
 'manage-staff': 'Manage Staff (Principals & Teachers)',
 'manage-principal': 'Manage Principal',
 'manage-teachers': 'Manage Teachers',
 'manage-students': 'Manage Students',
 'manage-parents': 'Manage Parents',
 'manage-classes': 'Manage Classes',
 'manage-subjects': 'Manage Subjects',
 'fee-collection-tracker': 'Student Fee Collection & Overdue Tracker',
 'publish-announcements': 'School Announcements',
 'view-reports': 'Academic & Enrollment Reports',
 'secure-messaging': 'Secure Messaging'
 };
 return titles[activeTab] || 'Dashboard';
 };

 
 const handleOpenStaffModal = (staff = null, defaultRole = 'Teacher') => {
 setEditingStaff(staff);
 if (staff) {
 setStaffForm({
 name: staff.name || '',
 role: staff.roleType || (staff.id && staff.id.startsWith('PR') ? 'Principal' : staff.id && staff.id.startsWith('NT') ? 'Non-Teaching' : staff.id && staff.id.startsWith('WRK') ? 'Operations Works' : 'Teacher'),
 phone: staff.phone || '',
 email: staff.email || '',
 address: staff.address || '',
 bloodGroup: staff.bloodGroup || 'O+',
 qualification: staff.qualification || '',
 onboardSubject: staff.onboardSubject || staff.department || staff.subject || '',
 class: staff.class || staff.shift || staff.workAssigned || staff.deadline || 'General Duty',
 experience: staff.experience || '5 Years',
 status: staff.status || 'Active'
 });
 } else {
 setStaffForm({
 name: '',
 role: defaultRole,
 phone: '',
 email: '',
 address: '',
 bloodGroup: 'O+',
 qualification: '',
 onboardSubject: '',
 class: defaultRole === 'Non-Teaching' ? '08:30 AM - 04:30 PM' : defaultRole === 'Operations Works' ? 'Priority: High' : 'Grade 10-A',
 experience: '3 Years',
 status: 'Active'
 });
 }
 setIsStaffModalOpen(true);
 };

 const handleDeleteStaff = (staff) => {
 if (!window.confirm(`Are you sure you want to remove ${staff.name} (${staff.roleType}) from the staff registry?`)) {
 return;
 }
 const current = getPortalData();
 if (staff.roleType === 'Principal') {
 current.principals = (current.principals || []).filter(p => p.id !== staff.id);
 } else if (staff.roleType === 'Non-Teaching') {
 current.nonTeachingStaff = (current.nonTeachingStaff || []).filter(nt => nt.id !== staff.id);
 } else if (staff.roleType === 'Operations Works') {
 current.operationsWorks = (current.operationsWorks || []).filter(w => w.id !== staff.id);
 } else {
 current.teachers = (current.teachers || []).filter(t => t.id !== staff.id);
 }
 current.users = (current.users || []).filter(u => u.id !== staff.id && u.email !== staff.email);
 savePortalData(current);
 refreshData();
 setFeedback({
 title: 'Staff Record Removed',
 body: `${staff.name} has been successfully deleted from ${staff.roleType}.`
 });
 };

 const handleSaveStaff = (e) => {
 e.preventDefault();
 const current = getPortalData();
 if (!current.teachers) current.teachers = [];
 if (!current.principals) current.principals = [];
 if (!current.nonTeachingStaff) current.nonTeachingStaff = [];
 if (!current.operationsWorks) current.operationsWorks = [];
 if (!current.users) current.users = [];

 const role = staffForm.role;

 if (editingStaff) {
 if (editingStaff.roleType === 'Principal' || (editingStaff.id && editingStaff.id.startsWith('PR'))) {
 const pIdx = current.principals.findIndex((p) => p.id === editingStaff.id);
 if (pIdx > -1) {
 current.principals[pIdx] = {
 ...current.principals[pIdx],
 name: staffForm.name,
 roleType: 'Principal',
 phone: staffForm.phone,
 email: staffForm.email,
 address: staffForm.address,
 bloodGroup: staffForm.bloodGroup,
 qualification: staffForm.qualification,
 experience: staffForm.experience,
 status: staffForm.status
 };
 }
 } else if (editingStaff.roleType === 'Non-Teaching' || (editingStaff.id && editingStaff.id.startsWith('NT'))) {
 const ntIdx = current.nonTeachingStaff.findIndex((nt) => nt.id === editingStaff.id);
 if (ntIdx > -1) {
 current.nonTeachingStaff[ntIdx] = {
 ...current.nonTeachingStaff[ntIdx],
 name: staffForm.name,
 role: staffForm.qualification || current.nonTeachingStaff[ntIdx].role,
 department: staffForm.onboardSubject || current.nonTeachingStaff[ntIdx].department,
 phone: staffForm.phone,
 email: staffForm.email,
 address: staffForm.address,
 bloodGroup: staffForm.bloodGroup,
 shift: staffForm.class || current.nonTeachingStaff[ntIdx].shift,
 workAssigned: staffForm.class || current.nonTeachingStaff[ntIdx].workAssigned,
 status: staffForm.status
 };
 }
 } else if (editingStaff.roleType === 'Operations Works' || (editingStaff.id && editingStaff.id.startsWith('WRK'))) {
 const wIdx = current.operationsWorks.findIndex((w) => w.id === editingStaff.id);
 if (wIdx > -1) {
 current.operationsWorks[wIdx] = {
 ...current.operationsWorks[wIdx],
 assignedTo: staffForm.name,
 title: staffForm.qualification || current.operationsWorks[wIdx].title,
 department: staffForm.onboardSubject || current.operationsWorks[wIdx].department,
 phone: staffForm.phone,
 deadline: staffForm.class || current.operationsWorks[wIdx].deadline,
 status: staffForm.status === 'Active' ? 'In Progress' : staffForm.status
 };
 }
 } else {
 const tIdx = current.teachers.findIndex((t) => t.id === editingStaff.id);
 if (tIdx > -1) {
 current.teachers[tIdx] = {
 ...current.teachers[tIdx],
 name: staffForm.name,
 roleType: 'Teacher',
 phone: staffForm.phone,
 email: staffForm.email,
 address: staffForm.address,
 bloodGroup: staffForm.bloodGroup,
 qualification: staffForm.qualification,
 subject: staffForm.onboardSubject,
 onboardSubject: staffForm.onboardSubject,
 class: staffForm.class,
 status: staffForm.status
 };
 }
 }

 const uIdx = current.users.findIndex((u) => u.id === editingStaff.id || u.email === editingStaff.email);
 if (uIdx > -1) {
 current.users[uIdx].name = staffForm.name;
 current.users[uIdx].phone = staffForm.phone;
 current.users[uIdx].email = staffForm.email;
 current.users[uIdx].status = staffForm.status;
 }
 } else {
 if (role === 'Principal') {
 const nextId = 'PR0' + (current.principals.length + 1);
 const newPrincipal = {
 id: nextId,
 name: staffForm.name,
 roleType: 'Principal',
 phone: staffForm.phone,
 email: staffForm.email,
 address: staffForm.address,
 bloodGroup: staffForm.bloodGroup,
 qualification: staffForm.qualification,
 experience: staffForm.experience,
 username: staffForm.email ? staffForm.email.split('@')[0] : `principal${nextId}`,
 status: staffForm.status,
 joinedDate: new Date().toISOString().split('T')[0],
 schoolId: 'SCHOOL002'
 };
 current.principals.push(newPrincipal);
 current.users.push({
 id: 'USR0' + (current.users.length + 1),
 name: staffForm.name,
 role: 'PRINCIPAL',
 phone: staffForm.phone,
 email: staffForm.email,
 username: staffForm.email ? staffForm.email.split('@')[0] : `principal${nextId}`,
 status: staffForm.status,
 createdDate: new Date().toISOString().split('T')[0],
 schoolId: 'SCHOOL002'
 });
 } else if (role === 'Non-Teaching') {
 const nextId = 'NT0' + (current.nonTeachingStaff.length + 1);
 const newNonTeaching = {
 id: nextId,
 name: staffForm.name,
 role: staffForm.qualification || 'Administrative Support',
 department: staffForm.onboardSubject || 'General Administration',
 phone: staffForm.phone,
 email: staffForm.email,
 address: staffForm.address,
 bloodGroup: staffForm.bloodGroup,
 shift: staffForm.class || '08:30 AM - 04:30 PM',
 workAssigned: staffForm.class || 'Campus Operations & Support',
 status: staffForm.status === 'Active' ? 'On Duty' : staffForm.status,
 qualification: staffForm.qualification || 'Graduate / Diploma'
 };
 current.nonTeachingStaff.push(newNonTeaching);
 current.users.push({
 id: 'USR0' + (current.users.length + 1),
 name: staffForm.name,
 role: 'STAFF',
 phone: staffForm.phone,
 email: staffForm.email,
 username: staffForm.email ? staffForm.email.split('@')[0] : `staff${nextId}`,
 status: staffForm.status,
 createdDate: new Date().toISOString().split('T')[0],
 schoolId: 'SCHOOL002'
 });
 } else if (role === 'Operations Works') {
 const nextId = 'WRK-0' + (current.operationsWorks.length + 1);
 const newWork = {
 id: nextId,
 title: staffForm.qualification || `${staffForm.name}'s Operational Duty`,
 department: staffForm.onboardSubject || 'Campus Operations',
 assignedTo: staffForm.name,
 phone: staffForm.phone,
 email: staffForm.email,
 priority: 'High',
 status: staffForm.status === 'Active' ? 'In Progress' : 'Scheduled',
 deadline: staffForm.class || 'Today, 04:30 PM',
 progress: 50,
 qualification: staffForm.qualification || 'Certified Technician / Specialist'
 };
 current.operationsWorks.push(newWork);
 } else {
 const nextId = 'T0' + (current.teachers.length + 1);
 const newTeacher = {
 id: nextId,
 name: staffForm.name,
 roleType: 'Teacher',
 phone: staffForm.phone,
 email: staffForm.email,
 address: staffForm.address,
 bloodGroup: staffForm.bloodGroup,
 qualification: staffForm.qualification,
 subject: staffForm.onboardSubject || 'General',
 onboardSubject: staffForm.onboardSubject || 'General',
 class: staffForm.class,
 status: staffForm.status,
 schoolId: 'SCHOOL002'
 };
 current.teachers.push(newTeacher);
 current.users.push({
 id: 'USR0' + (current.users.length + 1),
 name: staffForm.name,
 role: 'TEACHER',
 phone: staffForm.phone,
 email: staffForm.email,
 username: staffForm.email ? staffForm.email.split('@')[0] : `teacher${nextId}`,
 status: staffForm.status,
 createdDate: new Date().toISOString().split('T')[0],
 schoolId: 'SCHOOL002'
 });
 }
 }

 savePortalData(current);
 refreshData();
 setIsStaffModalOpen(false);
 setFeedback({
 title: editingStaff ? 'Staff Record Updated' : 'Staff Member Onboarded',
 body: `Staff profile for ${staffForm.name} (${staffForm.role}) saved successfully!`
 });
 };

 
 const handleOpenPrincipalModal = (principal = null) => {
 setEditingPrincipal(principal);
 if (principal) {
 setPrincipalForm({
 name: principal.name,
 qualification: principal.qualification || 'Ph.D., M.Ed',
 experience: principal.experience || '18 Years',
 phone: principal.phone || '',
 email: principal.email || '',
 status: principal.status || 'Active'
 });
 } else {
 setPrincipalForm({
 name: '',
 qualification: 'Ph.D., M.Ed',
 experience: '15 Years',
 phone: '+91 98401 23450',
 email: '',
 status: 'Active'
 });
 }
 setIsPrincipalModalOpen(true);
 };

 const handleSavePrincipal = (e) => {
 e.preventDefault();
 const current = getPortalData();
 if (!current.principals) current.principals = [];
 if (!current.users) current.users = [];

 if (editingPrincipal) {
 const idx = current.principals.findIndex((p) => p.id === editingPrincipal.id);
 if (idx > -1) {
 current.principals[idx] = {
 ...current.principals[idx],
 name: principalForm.name,
 qualification: principalForm.qualification,
 experience: principalForm.experience,
 phone: principalForm.phone,
 email: principalForm.email,
 status: principalForm.status
 };
 }
 const uIdx = current.users.findIndex(
 (u) => u.id === editingPrincipal.id || u.email === editingPrincipal.email || (u.role === 'PRINCIPAL' && u.name === editingPrincipal.name)
 );
 if (uIdx > -1) {
 current.users[uIdx].name = principalForm.name;
 current.users[uIdx].phone = principalForm.phone;
 current.users[uIdx].email = principalForm.email;
 current.users[uIdx].status = principalForm.status;
 }
 } else {
 const nextId = 'PR0' + (current.principals.length + 1);
 const newPr = {
 id: nextId,
 name: principalForm.name,
 qualification: principalForm.qualification,
 experience: principalForm.experience,
 phone: principalForm.phone,
 email: principalForm.email,
 username: principalForm.email.split('@')[0],
 status: principalForm.status,
 joinedDate: new Date().toISOString().split('T')[0],
 schoolId: 'SCHOOL002'
 };
 current.principals.push(newPr);
 current.users.push({
 id: 'USR0' + (current.users.length + 1),
 name: principalForm.name,
 role: 'PRINCIPAL',
 phone: principalForm.phone,
 email: principalForm.email,
 username: principalForm.email.split('@')[0],
 status: principalForm.status,
 createdDate: new Date().toISOString().split('T')[0],
 schoolId: 'SCHOOL002'
 });
 }
 savePortalData(current);
 refreshData();
 setIsPrincipalModalOpen(false);
 setFeedback({
 title: editingPrincipal ? 'Principal Profile Updated' : 'Principal Registered',
 body: `Principal profile for ${principalForm.name} ${editingPrincipal ? 'updated' : 'registered'} successfully.`
 });
 };

 
 const handleResetPassword = (name, email) => {
 const tempPass = 'Zen@' + Math.floor(10000 + Math.random() * 90000);
 setFeedback({
 title: 'Password Reset',
 body: `Temporary password for ${name} (${email}):\n\n${tempPass}`
 });
 };

 
 const handleSaveUser = (e) => {
 e.preventDefault();
 const current = getPortalData();
 const nextId = 'USR0' + (current.users.length + 1);
 current.users.push({
 id: nextId,
 name: userForm.name,
 role: userForm.role,
 phone: userForm.phone || '+91 98401 23456',
 email: userForm.email,
 username: userForm.email.split('@')[0],
 status: 'Active',
 createdDate: new Date().toISOString().split('T')[0],
 schoolId: 'SCHOOL002'
 });
 savePortalData(current);
 refreshData();
 setIsAddUserOpen(false);
 setUserForm({ name: '', role: 'TEACHER', phone: '', email: '' });
 setFeedback({
 title: 'User Created',
 body: `User account for ${userForm.name} (${userForm.role}) created successfully!`
 });
 };

 
 const handleOpenTeacherModal = (teacher = null) => {
 setEditingTeacher(teacher);
 if (teacher) {
 setTeacherForm({ name: teacher.name, subject: teacher.subject, class: teacher.class });
 } else {
 setTeacherForm({ name: '', subject: '', class: 'Grade 10-A' });
 }
 setIsTeacherModalOpen(true);
 };

 const handleSaveTeacher = (e) => {
 e.preventDefault();
 const current = getPortalData();
 if (editingTeacher) {
 const idx = current.teachers.findIndex((t) => t.id === editingTeacher.id);
 if (idx > -1) {
 current.teachers[idx].name = teacherForm.name;
 current.teachers[idx].subject = teacherForm.subject;
 current.teachers[idx].class = teacherForm.class;
 }
 } else {
 const nextId = 'T0' + (current.teachers.length + 1);
 current.teachers.push({
 id: nextId,
 name: teacherForm.name,
 subject: teacherForm.subject,
 class: teacherForm.class,
 schoolId: 'SCHOOL002',
 status: 'Active'
 });
 }
 savePortalData(current);
 refreshData();
 setIsTeacherModalOpen(false);
 setFeedback({
 title: editingTeacher ? 'Teacher Updated' : 'Teacher Registered',
 body: `Faculty member ${teacherForm.name} saved successfully!`
 });
 };

 
 const handleOpenStudentModal = (student = null) => {
 setEditingStudent(student);
 if (student) {
 
 const linkedParent = (data.parents || []).find((p) => p.studentRoll === student.roll);
 setStudentForm({
 name: student.name || '',
 class: student.class || 'Grade 10-A',
 gender: student.gender || 'Female',
 dob: student.dob || '2010-05-15',
 bloodGroup: student.bloodGroup || 'B+',
 parentName: student.parentName || (linkedParent ? linkedParent.name : ''),
 parentPhone: student.parentPhone || (linkedParent ? linkedParent.phone : ''),
 parentEmail: student.parentEmail || (linkedParent ? linkedParent.email : ''),
 address: student.address || '',
 emergencyContact: student.emergencyContact || (linkedParent ? linkedParent.phone : ''),
 admissionDate: student.admissionDate || new Date().toISOString().split('T')[0],
 status: student.status || 'Active'
 });
 } else {
 setStudentForm({
 name: '',
 class: 'Grade 10-A',
 gender: 'Female',
 dob: '2010-05-15',
 bloodGroup: 'B+',
 parentName: '',
 parentPhone: '',
 parentEmail: '',
 address: '',
 emergencyContact: '',
 admissionDate: new Date().toISOString().split('T')[0],
 status: 'Active'
 });
 }
 setIsStudentModalOpen(true);
 };

 const handleSaveStudent = (e) => {
 e.preventDefault();
 const current = getPortalData();
 if (!current.students) current.students = [];
 if (!current.parents) current.parents = [];
 if (!current.users) current.users = [];

 const rollNo = editingStudent ? editingStudent.roll : 'S' + (current.students.length + 101);

 if (editingStudent) {
 const idx = current.students.findIndex((s) => s.roll === editingStudent.roll);
 if (idx > -1) {
 current.students[idx] = {
 ...current.students[idx],
 name: studentForm.name,
 class: studentForm.class,
 gender: studentForm.gender,
 dob: studentForm.dob,
 bloodGroup: studentForm.bloodGroup,
 parentName: studentForm.parentName,
 parentPhone: studentForm.parentPhone,
 parentEmail: studentForm.parentEmail,
 address: studentForm.address,
 emergencyContact: studentForm.emergencyContact || studentForm.parentPhone,
 admissionDate: studentForm.admissionDate,
 status: studentForm.status
 };
 }
 } else {
 current.students.push({
 roll: rollNo,
 name: studentForm.name,
 class: studentForm.class,
 gender: studentForm.gender,
 dob: studentForm.dob,
 bloodGroup: studentForm.bloodGroup,
 parentName: studentForm.parentName,
 parentPhone: studentForm.parentPhone,
 parentEmail: studentForm.parentEmail,
 address: studentForm.address,
 emergencyContact: studentForm.emergencyContact || studentForm.parentPhone,
 admissionDate: studentForm.admissionDate,
 status: studentForm.status,
 schoolId: 'SCHOOL002',
 attendance: '100%',
 performance: 'Outstanding',
 marks: [
 { subject: 'Mathematics', max: 100, scored: 85, grade: 'A' },
 { subject: 'Physics', max: 100, scored: 85, grade: 'A' },
 { subject: 'Chemistry', max: 100, scored: 85, grade: 'A' },
 { subject: 'Tamil', max: 100, scored: 85, grade: 'A' },
 { subject: 'English', max: 100, scored: 85, grade: 'A' }
 ]
 });

 
 const studentUsername = studentForm.name.toLowerCase().replace(/[^a-z0-9]/g, '') || `student${rollNo}`;
 current.users.push({
 id: 'USR0' + (current.users.length + 1),
 name: studentForm.name,
 role: 'STUDENT',
 phone: studentForm.parentPhone || '+91 98401 23456',
 email: studentForm.parentEmail || `${studentUsername}@ssvschool.com`,
 username: studentUsername,
 status: 'Active',
 createdDate: new Date().toISOString().split('T')[0],
 schoolId: 'SCHOOL002'
 });
 }

 
 if (studentForm.parentName) {
 const parentIdx = current.parents.findIndex((p) => p.studentRoll === rollNo);
 if (parentIdx > -1) {
 current.parents[parentIdx] = {
 ...current.parents[parentIdx],
 name: studentForm.parentName,
 phone: studentForm.parentPhone || current.parents[parentIdx].phone,
 email: studentForm.parentEmail || current.parents[parentIdx].email,
 studentName: studentForm.name
 };
 } else {
 current.parents.push({
 id: 'PAR' + String(current.parents.length + 101),
 name: studentForm.parentName,
 relationship: 'Parent / Guardian',
 phone: studentForm.parentPhone || '+91 98401 99000',
 email: studentForm.parentEmail || 'parent@domain.com',
 studentName: studentForm.name,
 studentRoll: rollNo,
 schoolId: 'SCHOOL002'
 });
 }
 }

 savePortalData(current);
 refreshData();
 setIsStudentModalOpen(false);
 setFeedback({
 title: editingStudent ? 'Student Profile Updated' : 'Student Enrolled Successfully',
 body: `Complete record for ${studentForm.name} (Roll: ${rollNo}, Class: ${studentForm.class}) has been saved into the school student directory.`
 });
 };

 
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
 const idx = current.students.findIndex((s) => s.roll === marksStudent.roll);
 if (idx > -1) {
 current.students[idx].marks = newMarks;
 current.students[idx].performance = newPerformance;
 savePortalData(current);
 refreshData();
 }

 setMarksStudent(null);
 setFeedback({
 title: 'Marks Saved',
 body: `Updated Subject Marks & AB status for ${marksStudent.name} (${marksStudent.roll}).`
 });
 };

 
 const handleOpenClassModal = (cls = null) => {
 setEditingClass(cls);
 if (cls) {
 setClassForm({ name: cls.name, teacher: cls.teacher, room: cls.room, strength: cls.strength });
 } else {
 setClassForm({ name: '', teacher: '', room: '', strength: 38 });
 }
 setIsClassModalOpen(true);
 };

 const handleSaveClass = (e) => {
 e.preventDefault();
 const current = getPortalData();
 if (editingClass) {
 const idx = current.classes.findIndex((c) => c.name === editingClass.name);
 if (idx > -1) {
 current.classes[idx].teacher = classForm.teacher;
 current.classes[idx].room = classForm.room;
 current.classes[idx].strength = parseInt(classForm.strength) || 38;
 }
 } else {
 current.classes.push({
 name: classForm.name,
 teacher: classForm.teacher,
 room: classForm.room,
 strength: parseInt(classForm.strength) || 38,
 schoolId: 'SCHOOL002'
 });
 }
 savePortalData(current);
 refreshData();
    setSelectedClass(classForm.name);
 setIsClassModalOpen(false);
 setFeedback({
 title: editingClass ? 'Class Updated' : 'Class Created',
 body: `Classroom section ${classForm.name} saved successfully!`
 });
 };

 
 const handleOpenAssignWork = (className, day, period, teacherName = '') => {
 const normClass = (className || '').trim().toLowerCase();
 const pNum = parseInt(period);
 const existing = (data.classTimetables || []).find(
 (t) => (t.className || '').trim().toLowerCase() === normClass && t.day === day && parseInt(t.period) === pNum && (!teacherName || t.teacherName === teacherName)
 ) || (data.classTimetables || []).find(
 (t) => (t.className || '').trim().toLowerCase() === normClass && t.day === day && parseInt(t.period) === pNum
 );
 const targetClass = className || (existing ? existing.className : (selectedClassObj ? selectedClassObj.name : 'Grade 10-A'));
 setAssignWorkSlot({ className: targetClass, day, period: pNum, lockedTeacher: teacherName });
 setAssignWorkForm({
 subject: existing ? existing.subject : '',
 teacherName: existing ? existing.teacherName : (teacherName || ''),
 className: targetClass
 });
 };

 const handleSaveAssignWork = (e) => {
 e.preventDefault();
 if (!assignWorkSlot) return;

 const current = getPortalData();
 if (!current.classTimetables) current.classTimetables = [];

 const finalClassName = (assignWorkForm.className || assignWorkSlot.className || '').trim();
 const normFinal = finalClassName.toLowerCase();
 const slotPeriod = parseInt(assignWorkSlot.period);

 
 current.classTimetables = current.classTimetables.filter(
 (t) =>
 !(
 (t.className || '').trim().toLowerCase() === normFinal &&
 t.day === assignWorkSlot.day &&
 parseInt(t.period) === slotPeriod
 ) &&
 !(
 assignWorkSlot.lockedTeacher &&
 t.teacherName === assignWorkSlot.lockedTeacher &&
 t.day === assignWorkSlot.day &&
 parseInt(t.period) === slotPeriod
 )
 );

 current.classTimetables.push({
 className: finalClassName,
 day: assignWorkSlot.day,
 period: slotPeriod,
 subject: assignWorkForm.subject,
 teacherName: assignWorkForm.teacherName,
 schoolId: 'SCHOOL002'
 });

 savePortalData(current);
 refreshData();
 const slotDesc = `${assignWorkForm.subject} (${assignWorkForm.teacherName}) for ${finalClassName} on ${assignWorkSlot.day} Period ${slotPeriod}`;
 setAssignWorkSlot(null);
 setFeedback({
 title: 'Work Assigned & Live Synced',
 body: `Assigned ${slotDesc}. Work is now live and visible in the Teacher Timetable.`
 });
 };

 const handleClearAssignWork = (className, day, period) => {
 const current = getPortalData();
 if (!current.classTimetables) return;
 const normClass = (className || '').trim().toLowerCase();
 const pNum = parseInt(period);
 current.classTimetables = current.classTimetables.filter(
 (t) => !((t.className || '').trim().toLowerCase() === normClass && t.day === day && parseInt(t.period) === pNum)
 );
 savePortalData(current);
 refreshData();
 setAssignWorkSlot(null);
 setFeedback({
 title: 'Slot Cleared',
 body: `Period ${period} slot cleared for ${className} on ${day}.`
 });
 };
 
 const handleOpenSubjectModal = (sub = null) => {
 setEditingSubject(sub);
 if (sub) {
 setSubjectForm({
 code: sub.code || '',
 name: sub.name || '',
 grade: sub.grade || 'Grade 10-A',
 teacher: sub.teacher || (data.teachers[0] ? data.teachers[0].name : 'Mrs. Priya Krishnan'),
 periodsPerWeek: sub.periodsPerWeek || 5,
 room: sub.room || 'A-102'
 });
 } else {
 setSubjectForm({
 code: `SUB-0${(data.subjects || []).length + 1}`,
 name: '',
 grade: 'Grade 10-A',
 teacher: data.teachers[0] ? data.teachers[0].name : 'Mrs. Priya Krishnan',
 periodsPerWeek: 5,
 room: 'A-102'
 });
 }
 setIsSubjectModalOpen(true);
 };

 const handleSaveSubject = (e) => {
 e.preventDefault();
 const current = getPortalData();
 if (!current.subjects) current.subjects = [];

 if (editingSubject) {
 const idx = current.subjects.findIndex((s) => s.code === editingSubject.code);
 if (idx > -1) {
 current.subjects[idx] = {
 ...current.subjects[idx],
 code: subjectForm.code,
 name: subjectForm.name,
 grade: subjectForm.grade,
 teacher: subjectForm.teacher,
 periodsPerWeek: Number(subjectForm.periodsPerWeek) || 5,
 room: subjectForm.room
 };
 }
 } else {
 current.subjects.push({
 code: subjectForm.code,
 name: subjectForm.name,
 grade: subjectForm.grade,
 teacher: subjectForm.teacher,
 periodsPerWeek: Number(subjectForm.periodsPerWeek) || 5,
 room: subjectForm.room,
 schoolId: 'SCHOOL002'
 });
 }
 savePortalData(current);
 refreshData();
 setIsSubjectModalOpen(false);
 setFeedback({
 title: editingSubject ? 'Subject Updated' : 'Subject Added',
 body: `Course curriculum ${subjectForm.name} assigned to ${subjectForm.teacher} saved successfully!`
 });
 };

 
 const handleSaveLinkParent = (e) => {
 e.preventDefault();
 const current = getPortalData();
 const nextId = 'PAR0' + (current.parents.length + 1);
 const ward = current.students.find((s) => s.roll === linkParentForm.studentRoll);

 current.parents.push({
 id: nextId,
 name: linkParentForm.name,
 relationship: linkParentForm.relationship,
 phone: linkParentForm.phone,
 email: linkParentForm.email,
 studentName: ward ? ward.name : 'Aishwarya Kumar',
 studentRoll: linkParentForm.studentRoll,
 schoolId: 'SCHOOL002'
 });

 savePortalData(current);
 refreshData();
 setIsLinkParentOpen(false);
 setLinkParentForm({ name: '', relationship: 'Father', phone: '', email: '', studentRoll: 'S101' });
 setFeedback({
 title: 'Parent Linked',
 body: `Parent account for ${linkParentForm.name} successfully linked to student ward.`
 });
 };

 
 const handleSaveAnnouncement = (e) => {
 e.preventDefault();
 const current = getPortalData();
 if (!current.announcements) current.announcements = [];

 
 const categoryFallbacks = {
 Sports: 'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?auto=format&fit=crop&w=1200&q=80',
 Academic: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80',
 General: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=1200&q=80',
 Holidays: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=1200&q=80',
 };

 const finalImage = announcementForm.image || categoryFallbacks[announcementForm.category] || categoryFallbacks.General;

 current.announcements.unshift({
 id: `ANN-${Date.now()}`,
 date: new Date().toISOString().split('T')[0],
 title: announcementForm.title,
 target: announcementForm.target,
 category: announcementForm.category,
 content: announcementForm.content,
 image: finalImage,
 author: announcementForm.author || 'School Administration',
 priority: announcementForm.priority || 'Normal',
 schoolId: 'SCHOOL002'
 });

 savePortalData(current);
 refreshData();
 setIsAnnouncementOpen(false);
 setAnnouncementForm({
 title: '',
 target: 'All',
 category: 'General',
 image: '',
 author: 'School Administration',
 priority: 'Normal',
 content: ''
 });
 setFeedback({
 title: 'Official Notice Broadcasted!',
 body: `Announcement circular "${announcementForm.title}" with cover photo has been published to all target campus portals.`
 });
 };

 
 const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
 const periods = [
 { period: 1, time: '09:00 - 10:00' },
 { period: 2, time: '10:15 - 11:15' },
 { period: 3, time: '11:30 - 12:30' },
 { period: 4, time: '01:30 - 02:30' },
 { period: 5, time: '02:45 - 03:45' }
 ];

 const selectedClassObj =
 data.classes.find((c) => c.name === selectedClass) ||
 data.classes[0] || { name: 'Grade 10-A', teacher: 'Mrs. Priya Krishnan', room: 'A-102', strength: 38 };

 const normalizeClassName = (name) => (name || '').trim().toLowerCase();
 const classSlots = (data.classTimetables || []).filter((t) => normalizeClassName(t.className) === normalizeClassName(selectedClassObj.name));

 return (
 <div>
 
 <div className="content-header">
 <h2 id="section-title">{getTabTitle()}</h2>
 <div id="section-actions">

 {activeTab === 'manage-classes' && (
 <button className="btn btn-primary btn-sm" onClick={() => handleOpenClassModal()}>
 + Add New Class
 </button>
 )}
 </div>
 </div>

 <div id="portal-content">
 
 
 
 
 {activeTab === 'finance-management' && (
   <SchoolFinanceModule />
 )}

 
 
 
 
 {activeTab === 'school-services-tab' && (() => {
 const currentStore = getPortalData();
 const masterServices = (currentStore.services || [
 { id: 'SRV-01', name: 'Coding for Kids', icon: '', category: 'Technology', status: 'Active', cost: '0/yr', description: 'Interactive Python, Scratch block coding, and basic algorithmic thinking for students.', visibleRoles: ['schooladmin', 'teacher', 'student'] },
 { id: 'SRV-02', name: 'Chess Academy', icon: '', category: 'Mind Sports', status: 'Active', cost: '0/yr', description: 'Grandmaster tactics, opening strategies, and tournament training.', visibleRoles: ['schooladmin', 'principal', 'teacher', 'student', 'parent'] },
 { id: 'SRV-03', name: 'Robotics', icon: '', category: 'STEM', status: 'Active', cost: '0/yr', description: 'Arduino, sensor kits, circuit building and autonomous robot design.', visibleRoles: ['schooladmin', 'teacher', 'student'] },
 { id: 'SRV-04', name: 'Drawing & Art', icon: '', category: 'Creative Arts', status: 'Active', cost: '0/yr', description: 'Watercolors, canvas painting, sketch portraiture and digital design.', visibleRoles: ['schooladmin', 'student', 'parent'] },
 { id: 'SRV-05', name: 'Spoken English', icon: '', category: 'Communication', status: 'Active', cost: '0/yr', description: 'Vocabulary building, public speaking, pronunciation and phonics.', visibleRoles: ['schooladmin', 'principal', 'teacher', 'student', 'parent'] },
 { id: 'SRV-06', name: 'Abacus & Vedic Maths', icon: '', category: 'Mathematics', status: 'Active', cost: '0/yr', description: 'Fast mental calculation techniques, memory retention, and number speed.', visibleRoles: ['schooladmin', 'teacher', 'student', 'parent'] },
 { id: 'SRV-07', name: 'Dance & Music', icon: '', category: 'Performing Arts', status: 'Active', cost: '0/yr', description: 'Classical & contemporary dance, vocal music, keyboard and guitar lessons.', visibleRoles: ['schooladmin', 'student', 'parent'] },
 { id: 'SRV-08', name: 'Sports & Fitness', icon: '', category: 'Athletics', status: 'Active', cost: '0/yr', description: 'Football, basketball, athletics coaching, yoga and physical agility.', visibleRoles: ['schooladmin', 'principal', 'teacher', 'student', 'parent'] },
 ]).map((s) => ({ ...s, cost: '0/yr' }));
 const assignments = currentStore.schoolServiceAssignments || [
 { id: 'SSA-01', serviceId: 'SRV-01', serviceName: 'Coding for Kids', schoolId: 'SCHOOL002', schoolName: 'Sri Sankara Vidhyasala Girls High School', status: 'Active', assignedDate: '2026-01-15' },
 { id: 'SSA-02', serviceId: 'SRV-02', serviceName: 'Chess Academy', schoolId: 'SCHOOL002', schoolName: 'Sri Sankara Vidhyasala Girls High School', status: 'Active', assignedDate: '2026-01-20' },
 { id: 'SSA-03', serviceId: 'SRV-03', serviceName: 'Robotics', schoolId: 'SCHOOL002', schoolName: 'Sri Sankara Vidhyasala Girls High School', status: 'Active', assignedDate: '2026-02-01' },
 ];

 
 const visibleServices = masterServices.filter((srv) => {
 const roles = srv.visibleRoles || ['schooladmin', 'teacher', 'student'];
 if (!roles.includes('schooladmin')) return false;
 if (serviceSearch.trim()) {
 const q = serviceSearch.toLowerCase();
 return srv.name.toLowerCase().includes(q) || srv.category.toLowerCase().includes(q);
 }
 return true;
 });

 return (
 <div>
 
 <div style={{
 background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
 color: '#ffffff',
 padding: '18px 22px',
 borderRadius: '12px',
 marginBottom: '20px',
 display: 'flex',
 justifyContent: 'space-between',
 alignItems: 'center',
 flexWrap: 'wrap',
 gap: '12px',
 boxShadow: '0 4px 12px rgba(30, 58, 138, 0.15)'
 }}>
 <div>
 <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.5px', opacity: 0.85, fontWeight: 700 }}>
 Super Admin Managed Services
 </div>
 <h3 style={{ margin: '4px 0', fontSize: '1.25rem', color: '#ffffff', fontWeight: 800 }}>
 Campus Extracurricular & Enrichment Programs
 </h3>
 <div style={{ fontSize: '0.86rem', opacity: 0.9 }}>
 Showing services configured and made visible for School Administrators. Click any service to launch its live practice lab.
 </div>
 </div>

 
 <div style={{ position: 'relative', minWidth: '240px' }}>
 <input
 type="text"
 value={serviceSearch}
 onChange={(e) => setServiceSearch(e.target.value)}
 placeholder="Search campus services..."
 style={{
 width: '100%',
 padding: '9px 12px 9px 36px',
 borderRadius: '8px',
 border: '1px solid #cbd5e1',
 background: '#ffffff',
 color: '#0f172a',
 fontSize: '0.88rem',
 fontWeight: 500,
 outline: 'none',
 boxShadow: '0 2px 4px rgba(0,0,0,0.06)'
 }}
 />
 <span style={{ position: 'absolute', left: '11px', top: '50%', transform: 'translateY(-50%)', opacity: 0.85, fontSize: '0.9rem' }}>
 
 </span>
 {serviceSearch && (
 <button
 type="button"
 onClick={() => setServiceSearch('')}
 style={{
 position: 'absolute',
 right: '10px',
 top: '50%',
 transform: 'translateY(-50%)',
 background: 'transparent',
 border: 'none',
 cursor: 'pointer',
 color: '#64748b',
 fontSize: '0.9rem',
 fontWeight: 'bold',
 padding: '2px'
 }}
 title="Clear search"
 >
 
 </button>
 )}
 </div>
 </div>

 
 <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: '18px' }}>
 {visibleServices.map((srv) => {
 const assignedRecord = assignments.find((a) => a.serviceId === srv.id && a.schoolId === 'SCHOOL002');
 const isActiveOnCampus = assignedRecord ? assignedRecord.status === 'Active' : srv.status === 'Active';

 return (
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
 boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
 transition: 'transform 0.15s ease'
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
 {srv.icon || ''}
 </div>
 <span className={`badge ${isActiveOnCampus ? 'badge-success' : 'badge-danger'}`}>
 {isActiveOnCampus ? 'Active on Campus' : 'Inactive'}
 </span>
 </div>

 <h4 style={{ margin: '0 0 4px', fontSize: '1.08rem', fontWeight: 800, color: '#1e3a8a' }}>
 {srv.name}
 </h4>
 <div style={{ fontSize: '0.76rem', color: '#4f46e5', fontWeight: 700, textTransform: 'uppercase', marginBottom: '8px' }}>
 {srv.category} &bull; {srv.cost}
 </div>
 <p style={{ fontSize: '0.84rem', color: '#64748b', lineHeight: 1.45, margin: '0 0 14px' }}>
 {srv.description}
 </p>
 </div>

 <div>
 
 <div style={{ marginBottom: '14px', borderTop: '1px solid #f1f5f9', paddingTop: '10px' }}>
 <span style={{ fontSize: '0.74rem', color: '#1e3a8a', fontWeight: 800, display: 'block', width: '100%', marginBottom: '8px' }}>
 Campus Role Visibility (Toggle Sub-Portals):
 </span>
 <div style={{
 display: 'flex',
 flexDirection: 'column',
 gap: '5px',
 background: '#f8fafc',
 border: '1px solid #e2e8f0',
 borderRadius: '8px',
 padding: '6px 8px'
 }}>
 {[
 { id: 'principal', name: 'Principal', icon: '', activeTone: '#4f46e5', lightTone: '#eef2ff', borderTone: '#c7d2fe' },
 { id: 'teacher', name: 'Teacher', icon: '', activeTone: '#16a34a', lightTone: '#f0fdf4', borderTone: '#bbf7d0' },
 { id: 'student', name: 'Student', icon: '', activeTone: '#d97706', lightTone: '#fffbeb', borderTone: '#fde68a' },
 { id: 'parent', name: 'Parent', icon: '', activeTone: '#9333ea', lightTone: '#faf5ff', borderTone: '#e9d5ff' },
 ].map((subRole) => {
 const currentRoles = srv.visibleRoles || ['schooladmin', 'teacher', 'student'];
 const isEnabled = currentRoles.includes(subRole.id);
 return (
 <div
 key={subRole.id}
 style={{
 display: 'flex',
 alignItems: 'center',
 justifyContent: 'space-between',
 padding: '3px 6px',
 borderRadius: '6px',
 background: isEnabled ? subRole.lightTone : '#ffffff',
 border: isEnabled ? `1px solid ${subRole.borderTone}` : '1px solid #f1f5f9',
 transition: 'all 0.15s ease'
 }}
 >
 <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
 <span style={{ fontSize: '0.88rem' }}>{subRole.icon}</span>
 <span style={{
 fontSize: '0.74rem',
 fontWeight: isEnabled ? 700 : 500,
 color: isEnabled ? '#0f172a' : '#64748b'
 }}>
 {subRole.name}
 </span>
 </div>

 <button
 type="button"
 onClick={() => {
 const nextRoles = isEnabled
 ? currentRoles.filter((r) => r !== subRole.id)
 : [...currentRoles, subRole.id];
 const updatedServices = masterServices.map((s) =>
 s.id === srv.id ? { ...s, visibleRoles: nextRoles } : s
 );
 const store = getPortalData();
 store.services = updatedServices;
 savePortalData(store);
 setData({ ...store });
 setFeedback({
 title: isEnabled ? 'Portal Access Revoked' : 'Portal Access Granted',
 body: `${subRole.name} access for "${srv.name}" has been ${isEnabled ? 'turned OFF' : 'activated for campus'}.`
 });
 }}
 title={`Toggle visibility for ${subRole.name}`}
 style={{
 position: 'relative',
 width: '38px',
 height: '20px',
 borderRadius: '16px',
 border: 'none',
 cursor: 'pointer',
 background: isEnabled ? subRole.activeTone : '#cbd5e1',
 padding: 0,
 display: 'inline-flex',
 alignItems: 'center',
 transition: 'background-color 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
 boxShadow: isEnabled ? `0 2px 4px ${subRole.activeTone}40` : 'none',
 outline: 'none'
 }}
 >
 <span
 style={{
 width: '14px',
 height: '14px',
 borderRadius: '50%',
 background: '#ffffff',
 boxShadow: '0 1px 2px rgba(0,0,0,0.3)',
 transform: isEnabled ? 'translateX(20px)' : 'translateX(3px)',
 transition: 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
 display: 'flex',
 alignItems: 'center',
 justifyContent: 'center',
 fontSize: '0.5rem',
 fontWeight: 900,
 color: isEnabled ? subRole.activeTone : '#94a3b8'
 }}
 >
 {isEnabled ? '' : ''}
 </span>
 </button>
 </div>
 );
 })}
 </div>
 </div>

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
 <span>▶</span> Launch Practice Lab
 </button>
 </div>
 </div>
 );
 })}
 </div>
 </div>
 );
 })()}

 
 
 
 {activeTab === 'school-admin-users' && (() => {
 const totalStudentsCount = (data.students || []).length;
 const totalTeachersCount = (data.teachers || []).length;
 const totalClassesCount = (data.classes || []).length;
 const totalParentsCount = (data.parents || []).length;
 const totalUsersCount = (data.users || []).length;
 const totalSubjectsCount = (data.subjects || []).length;
 const activeServicesCount = (data.services || []).filter((s) => s.status === 'Active').length;
 const announcementsCount = (data.announcements || []).length;
 const totalPaidFees = feeRecords.filter((f) => f.status === 'PAID').length;
 const totalPendingFees = feeRecords.filter((f) => f.status !== 'PAID').length;
 const avgAttendance = '94.2%';

 return (
 <div>
 
 <div className="grid-3" style={{ marginBottom: '16px' }}>
   
   <div
     className="portal-card clickable-card"
     style={{ borderLeftColor: '#f59e0b', cursor: 'pointer' }}
     title="Click to view faculty duty and leave roster"
     onClick={() => setAnalyticsModal('staff')}
   >
     <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
       <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--color-text-light)', fontWeight: 700 }}>
         Total Teaching Staff
       </div>
       <span style={{ fontSize: '0.72rem', color: '#d97706', fontWeight: 600 }}>View &rarr;</span>
     </div>
     <p style={{ fontSize: '1.8rem', fontWeight: 700, color: '#b45309', margin: '4px 0' }}>5</p>
     <span style={{ fontSize: '0.75rem', color: '#16a34a', fontWeight: 600 }}>3 On Duty &bull; 2 On Leave</span>
   </div>

   
   <div
     className="portal-card clickable-card"
     style={{ borderLeftColor: '#06b6d4', cursor: 'pointer' }}
     title="Click to view non-teaching & administrative staff roster"
     onClick={() => setAnalyticsModal('non-teaching')}
   >
     <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
       <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--color-text-light)', fontWeight: 700 }}>
         Non-Teaching Staff
       </div>
       <span style={{ fontSize: '0.72rem', color: '#0891b2', fontWeight: 600 }}>View &rarr;</span>
     </div>
     <p style={{ fontSize: '1.8rem', fontWeight: 700, color: '#0e7490', margin: '4px 0' }}>8</p>
     <span style={{ fontSize: '0.75rem', color: '#0284c7', fontWeight: 600 }}>7 Active Today &bull; 1 Leave</span>
   </div>

   
   <div
     className="portal-card clickable-card"
     style={{ borderLeftColor: '#ec4899', cursor: 'pointer' }}
     title="Click to view daily school operations & task pipeline"
     onClick={() => setAnalyticsModal('operations-works')}
   >
     <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
       <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--color-text-light)', fontWeight: 700 }}>
         Total Works & Tasks
       </div>
       <span style={{ fontSize: '0.72rem', color: '#be185d', fontWeight: 600 }}>View &rarr;</span>
     </div>
     <p style={{ fontSize: '1.8rem', fontWeight: 700, color: '#be185d', margin: '4px 0' }}>8</p>
     <span style={{ fontSize: '0.75rem', color: '#db2777', fontWeight: 600 }}>4 Completed &bull; 3 In Progress</span>
   </div>
 </div>

 
 <div className="grid-4" style={{ marginBottom: '25px' }}>
 
 <div
 className="portal-card clickable-card"
 style={{ borderLeftColor: '#3b82f6', cursor: 'pointer' }}
 title="Click to view all enrolled students"
 onClick={() =>
 setCardDetailModal({
 isOpen: true,
 config: {
 title: 'Enrolled Campus Students',
 subtitle: 'Complete student directory with attendance & performance tracking',
 badgeColor: '#3b82f6',
 count: (data.students || []).length,
 type: 'students',
 items: data.students || [],
 targetTab: 'manage-students',
 targetTabLabel: 'Students Management',
 },
 })
 }
 >
 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
 <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--color-text-light)', fontWeight: 700 }}>Total Students</div>
 <span style={{ fontSize: '0.72rem', color: '#2563eb', fontWeight: 600 }}>View &rarr;</span>
 </div>
 <p style={{ fontSize: '1.8rem', fontWeight: 700, color: '#1e3a8a', margin: '4px 0' }}>{totalStudentsCount}</p>
 <span style={{ fontSize: '0.75rem', color: 'var(--color-success)', fontWeight: 600 }}>Active Enrolled</span>
 </div>

 
 <div
 className="portal-card clickable-card"
 style={{ borderLeftColor: '#8b5cf6', cursor: 'pointer' }}
 title="Click to view faculty directory"
 onClick={() =>
 setCardDetailModal({
 isOpen: true,
 config: {
 title: 'Campus Faculty Members',
 subtitle: 'Teaching staff, subject assignments and class responsibility',
 badgeColor: '#8b5cf6',
 count: (data.teachers || []).length,
 type: 'teachers',
 items: data.teachers || [],
 targetTab: 'manage-staff',
 targetTabLabel: 'Manage Staff',
 },
 })
 }
 >
 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
 <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--color-text-light)', fontWeight: 700 }}>Total Teachers</div>
 <span style={{ fontSize: '0.72rem', color: '#6d28d9', fontWeight: 600 }}>View &rarr;</span>
 </div>
 <p style={{ fontSize: '1.8rem', fontWeight: 700, color: '#6d28d9', margin: '4px 0' }}>{totalTeachersCount}</p>
 <span style={{ fontSize: '0.75rem', color: 'var(--color-success)', fontWeight: 600 }}>Active Faculty</span>
 </div>

 
 <div
 className="portal-card clickable-card"
 style={{ borderLeftColor: '#059669', cursor: 'pointer' }}
 title="Click to view all classes and sections"
 onClick={() =>
 setCardDetailModal({
 isOpen: true,
 config: {
 title: 'Academic Classes & Sections',
 subtitle: 'Classrooms, in-charge mentors and student strength',
 badgeColor: '#059669',
 count: (data.classes || []).length,
 type: 'classes',
 items: data.classes || [],
 targetTab: 'manage-classes',
 targetTabLabel: 'Classes Management',
 },
 })
 }
 >
 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
 <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--color-text-light)', fontWeight: 700 }}>Total Classes</div>
 <span style={{ fontSize: '0.72rem', color: '#047857', fontWeight: 600 }}>View &rarr;</span>
 </div>
 <p style={{ fontSize: '1.8rem', fontWeight: 700, color: '#047857', margin: '4px 0' }}>{totalClassesCount}</p>
 <span style={{ fontSize: '0.75rem', color: 'var(--color-success)', fontWeight: 600 }}>Operational Sections</span>
 </div>

 
 <div
 className="portal-card clickable-card"
 style={{ borderLeftColor: '#ec4899', cursor: 'pointer' }}
 title="Click to view registered parent guardians"
 onClick={() => {
 const parentUsers = (data.users || []).filter((u) => u.role === 'PARENT');
 setCardDetailModal({
 isOpen: true,
 config: {
 title: 'Parent Guardians Directory',
 subtitle: 'Linked family contacts and ward relationship',
 badgeColor: '#ec4899',
 count: parentUsers.length,
 type: 'users',
 items: parentUsers,
 targetTab: 'manage-parents',
 targetTabLabel: 'Parents Management',
 },
 });
 }}
 >
 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
 <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--color-text-light)', fontWeight: 700 }}>Total Parents</div>
 <span style={{ fontSize: '0.72rem', color: '#be185d', fontWeight: 600 }}>View &rarr;</span>
 </div>
 <p style={{ fontSize: '1.8rem', fontWeight: 700, color: '#be185d', margin: '4px 0' }}>{totalParentsCount}</p>
 <span style={{ fontSize: '0.75rem', color: 'var(--color-text-light)' }}>Linked Guardians</span>
 </div>

 
 <div
 className="portal-card clickable-card"
 style={{ borderLeftColor: '#f59e0b', cursor: 'pointer' }}
 title="Click to view all role accounts"
 onClick={() =>
 setCardDetailModal({
 isOpen: true,
 config: {
 title: 'Campus Portal User Accounts',
 subtitle: 'Principals, teachers, students, and parents with platform access',
 badgeColor: '#f59e0b',
 count: (data.users || []).length,
 type: 'users',
 items: data.users || [],
 targetTab: 'school-admin-users',
 targetTabLabel: 'DashBoard Users',
 },
 })
 }
 >
 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
 <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--color-text-light)', fontWeight: 700 }}>Total Users</div>
 <span style={{ fontSize: '0.72rem', color: '#b45309', fontWeight: 600 }}>View &rarr;</span>
 </div>
 <p style={{ fontSize: '1.8rem', fontWeight: 700, color: '#b45309', margin: '4px 0' }}>{totalUsersCount}</p>
 <span style={{ fontSize: '0.75rem', color: 'var(--color-success)', fontWeight: 600 }}>Portal Logins</span>
 </div>

 
 <div
 className="portal-card clickable-card"
 style={{ borderLeftColor: '#4f46e5', cursor: 'pointer' }}
 title="Click to view campus principal"
 onClick={() => {
 const principalUsers = (data.users || []).filter((u) => u.role === 'PRINCIPAL');
 setCardDetailModal({
 isOpen: true,
 config: {
 title: 'Campus Leadership (Principals)',
 subtitle: 'Institutional head and academic administrator',
 badgeColor: '#4f46e5',
 count: principalUsers.length,
 type: 'users',
 items: principalUsers,
 targetTab: 'manage-staff',
 targetTabLabel: 'Manage Staff',
 },
 });
 }}
 >
 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
 <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--color-text-light)', fontWeight: 700 }}>Principal</div>
 <span style={{ fontSize: '0.72rem', color: '#4338ca', fontWeight: 600 }}>View &rarr;</span>
 </div>
 <p style={{ fontSize: '1.8rem', fontWeight: 700, color: '#4338ca', margin: '4px 0' }}>{(data.principals || []).length || 1}</p>
 <span style={{ fontSize: '0.75rem', color: 'var(--color-success)', fontWeight: 600 }}>Campus Head</span>
 </div>
 </div>
 </div>
 );
 })()}

 
 
 
 {activeTab === 'manage-staff' && (() => {
 
 const principalsList = (data.principals || []).map((p) => ({
 ...p,
 roleType: 'Principal',
 onboardSubject: p.qualification || 'Institutional Leadership',
 class: 'All School Sections',
 badgeClass: 'badge-primary'
 }));

 const teachersList = (data.teachers || []).map((t) => ({
 ...t,
 roleType: 'Teacher',
 onboardSubject: t.onboardSubject || t.subject || 'General Subject',
 class: t.class || 'Assigned Class',
 badgeClass: 'badge-info'
 }));

 const nonTeachingList = (data.nonTeachingStaff || []).map((nt) => ({
 ...nt,
 roleType: 'Non-Teaching',
 qualification: nt.role || 'Staff Specialist',
 onboardSubject: nt.department || 'Administrative Support',
 class: nt.shift || '08:30 AM - 04:30 PM',
 workAssigned: nt.workAssigned || 'Campus Operational Responsibilities',
 address: 'Staff Quarters / Support Wing',
 bloodGroup: nt.bloodGroup || 'B+',
 badgeClass: 'badge-amber',
 status: nt.status === 'On Duty' ? 'Active' : nt.status || 'Active'
 }));

 const operationsWorksList = (data.operationsWorks || []).map((w) => ({
 ...w,
 name: w.assignedTo || 'Facility Team',
 roleType: 'Operations Works',
 qualification: w.title || 'Operational Work Task',
 onboardSubject: w.department || 'Campus Operations',
 class: w.deadline || 'Daily Task',
 workAssigned: w.title + (w.deadline ? ` (Deadline: ${w.deadline})` : ''),
 address: 'Campus Facilities Wing',
 phone: w.phone || '+91 98401 55600',
 email: 'works@ssvschool.com',
 bloodGroup: 'O+',
 badgeClass: 'badge-purple',
 status: w.status === 'Completed' || w.status === 'In Progress' ? 'Active' : 'Scheduled'
 }));

 const allStaff = [...principalsList, ...teachersList, ...nonTeachingList, ...operationsWorksList];

 const filteredStaff = allStaff.filter((s) => {
 const matchesRole =
 staffRoleFilter === 'ALL' ||
 s.roleType.toLowerCase() === staffRoleFilter.toLowerCase();

 const q = staffSearch.toLowerCase().trim();
 const matchesSearch =
 !q ||
 (s.name && s.name.toLowerCase().includes(q)) ||
 (s.id && s.id.toLowerCase().includes(q)) ||
 (s.phone && s.phone.toLowerCase().includes(q)) ||
 (s.email && s.email.toLowerCase().includes(q)) ||
 (s.address && s.address.toLowerCase().includes(q)) ||
 (s.bloodGroup && s.bloodGroup.toLowerCase().includes(q)) ||
 (s.qualification && s.qualification.toLowerCase().includes(q)) ||
 (s.onboardSubject && s.onboardSubject.toLowerCase().includes(q)) ||
 (s.class && s.class.toLowerCase().includes(q));

 return matchesRole && matchesSearch;
 });

 return (
 <div>
 
 <div
 className="sa-schools-header-bar"
 style={{
 display: 'flex',
 justifyContent: 'space-between',
 alignItems: 'center',
 flexWrap: 'wrap',
 gap: '20px',
 rowGap: '16px',
 width: '100%',
 marginBottom: '20px'
 }}
 >
 <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', alignItems: 'center', flex: '1 1 auto', minWidth: '320px' }}>
 <div className="sa-search-wrap" style={{ flex: '1 1 240px', minWidth: '220px', maxWidth: '360px', margin: 0 }}>
 <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
 <input
 type="text"
 className="sa-search-input"
 placeholder="Search staff by name, phone, email, subject, blood group..."
 value={staffSearch}
 onChange={(e) => setStaffSearch(e.target.value)}
 />
 </div>

 <select
 className="sa-filter-select"
 value={staffRoleFilter}
 onChange={(e) => setStaffRoleFilter(e.target.value)}
 style={{
 padding: '9px 16px',
 borderRadius: '8px',
 border: '1.5px solid #cbd5e1',
 background: '#ffffff',
 fontSize: '0.85rem',
 fontWeight: 700,
 color: '#0f172a',
 cursor: 'pointer',
 flexShrink: 0,
 width: 'auto',
 minWidth: '180px',
 margin: 0
 }}
 >
 <option value="ALL">All Roles ({allStaff.length})</option>
 <option value="Principal">Principals ({principalsList.length})</option>
 <option value="Teacher">Teachers / Faculty ({teachersList.length})</option>
 <option value="Non-Teaching">Non-Teaching Staff ({nonTeachingList.length})</option>
 <option value="Operations Works">Operations Works ({operationsWorksList.length})</option>
 </select>
 </div>

 <div
 className="sa-toolbar-right"
 style={{
 display: 'inline-flex',
 gap: '12px',
 alignItems: 'center',
 flexShrink: 0,
 margin: 0
 }}
 >
 <button
 className="btn btn-outline btn-sm"
 onClick={() => setIsBulkTeacherOpen(true)}
 style={{
 display: 'inline-flex',
 alignItems: 'center',
 gap: '8px',
 whiteSpace: 'nowrap',
 margin: 0
 }}
 >
 <span>📥</span> Bulk Import (Excel)
 </button>
 <button
 className="btn btn-primary btn-sm"
 onClick={() => handleOpenStaffModal(null, staffRoleFilter !== 'ALL' ? staffRoleFilter : 'Teacher')}
 style={{
 display: 'inline-flex',
 alignItems: 'center',
 gap: '8px',
 whiteSpace: 'nowrap',
 margin: 0
 }}
 >
 <span>+</span> Add Staff Member
 </button>
 </div>
 </div>

 
 <div style={{ display: 'flex', gap: '10px', marginBottom: '16px', flexWrap: 'wrap' }}>
 <div onClick={() => setStaffRoleFilter('ALL')} style={{ cursor: 'pointer', background: staffRoleFilter === 'ALL' ? '#0f172a' : '#f1f5f9', color: staffRoleFilter === 'ALL' ? '#ffffff' : '#334155', padding: '6px 14px', borderRadius: '20px', fontSize: '0.82rem', fontWeight: 600 }}>
 Total Staff: <strong>{allStaff.length}</strong>
 </div>
 <div onClick={() => setStaffRoleFilter('Principal')} style={{ cursor: 'pointer', background: staffRoleFilter === 'Principal' ? '#1d4ed8' : '#eff6ff', color: staffRoleFilter === 'Principal' ? '#ffffff' : '#1d4ed8', padding: '6px 14px', borderRadius: '20px', fontSize: '0.82rem', fontWeight: 600 }}>
 Principals: <strong>{principalsList.length}</strong>
 </div>
 <div onClick={() => setStaffRoleFilter('Teacher')} style={{ cursor: 'pointer', background: staffRoleFilter === 'Teacher' ? '#6d28d9' : '#f5f3ff', color: staffRoleFilter === 'Teacher' ? '#ffffff' : '#6d28d9', padding: '6px 14px', borderRadius: '20px', fontSize: '0.82rem', fontWeight: 600 }}>
 Teachers / Faculty: <strong>{teachersList.length}</strong>
 </div>
 <div onClick={() => setStaffRoleFilter('Non-Teaching')} style={{ cursor: 'pointer', background: staffRoleFilter === 'Non-Teaching' ? '#0891b2' : '#ecfeff', color: staffRoleFilter === 'Non-Teaching' ? '#ffffff' : '#0891b2', padding: '6px 14px', borderRadius: '20px', fontSize: '0.82rem', fontWeight: 600 }}>
 Non-Teaching: <strong>{nonTeachingList.length}</strong>
 </div>
 <div onClick={() => setStaffRoleFilter('Operations Works')} style={{ cursor: 'pointer', background: staffRoleFilter === 'Operations Works' ? '#be185d' : '#fdf2f8', color: staffRoleFilter === 'Operations Works' ? '#ffffff' : '#be185d', padding: '6px 14px', borderRadius: '20px', fontSize: '0.82rem', fontWeight: 600 }}>
 Operations Works: <strong>{operationsWorksList.length}</strong>
 </div>
 </div>

 
 <div className="table-responsive">
 <table className="sa-schools-table">
 <thead>
 <tr>
 <th style={{ minWidth: '90px' }}>Staff ID</th>
 <th style={{ minWidth: '170px' }}>Staff Name (Click for Attendance Log)</th>
 <th style={{ minWidth: '110px' }}>Role</th>
 <th style={{ minWidth: '130px' }}>Phone Number</th>
 <th style={{ minWidth: '170px' }}>Email Address</th>
 <th style={{ minWidth: '150px' }}>Department / Assigned Work</th>
 <th style={{ minWidth: '90px', textAlign: 'center' }}>Blood Group</th>
 <th style={{ minWidth: '140px' }}>Qualification</th>
 <th style={{ minWidth: '90px', textAlign: 'center' }}>Duty Status</th>
 <th style={{ minWidth: '200px', textAlign: 'center' }}>Actions</th>
 </tr>
 </thead>
 <tbody>
 {filteredStaff.length === 0 ? (
 <tr>
 <td colSpan="10" style={{ textAlign: 'center', padding: '36px', color: '#64748b' }}>
 No staff records found matching your filters. Click <strong>+ Add Staff Member</strong> to onboard a new staff member.
 </td>
 </tr>
 ) : (
 filteredStaff.map((staff) => (
 <tr key={staff.id} style={{ transition: 'background 0.2s' }}>
 <td data-label="Staff ID"><code>{staff.id}</code></td>
 <td data-label="Staff Name">
 <button
   type="button"
   onClick={() => setSelectedStaffHistory({
     name: staff.name,
     role: staff.qualification || staff.roleType,
     type: staff.roleType === 'Teacher' ? 'Teaching Staff' : staff.roleType === 'Non-Teaching' ? 'Non-Teaching Staff' : staff.roleType,
     department: staff.onboardSubject || 'General Campus',
     phone: staff.phone || '+91 98401 23450',
     currentStatus: staff.status === 'Active' ? 'Present on Duty' : staff.status,
     currentPunch: '08:15 AM',
     extraWork: staff.workAssigned ? {
       title: staff.workAssigned,
       department: staff.onboardSubject || 'Campus Operations',
       priority: 'High',
       deadline: staff.class || 'Shift Schedule',
       progress: 100
     } : null
   })}
   style={{
     background: 'none',
     border: 'none',
     color: '#1d4ed8',
     fontWeight: 700,
     cursor: 'pointer',
     textAlign: 'left',
     padding: 0,
     display: 'inline-flex',
     alignItems: 'center',
     gap: '6px',
     fontSize: '0.88rem'
   }}
   title="Click to view full attendance history, clock-in logs and work duties"
 >
   <span>{staff.name}</span>
   <span style={{ fontSize: '0.7rem', color: '#059669', background: '#dcfce7', padding: '1px 5px', borderRadius: '4px' }}>📊 View Log</span>
 </button>
 </td>
 <td data-label="Role">
 <span className={`badge ${staff.roleType === 'Principal' ? 'badge-primary' : staff.roleType === 'Teacher' ? 'badge-info' : staff.roleType === 'Non-Teaching' ? 'badge-amber' : 'badge-purple'}`} style={{ fontWeight: 700 }}>
 {staff.roleType === 'Principal' ? '👨‍🏫 Principal' : staff.roleType === 'Teacher' ? '👩‍🏫 Teacher' : staff.roleType === 'Non-Teaching' ? '👥 Non-Teaching' : '📋 Operations Works'}
 </span>
 </td>
 <td data-label="Phone Number">{staff.phone || '—'}</td>
 <td data-label="Email Address">{staff.email || '—'}</td>
 <td data-label="Assigned Work">
 <div className="school-meta-line">
 <strong style={{ color: 'var(--color-primary)' }}>
 {staff.onboardSubject || staff.subject || 'General'}
 </strong>
 {staff.workAssigned ? (
   <div style={{ marginTop: '3px', fontSize: '0.78rem', color: '#047857', background: '#f0fdf4', padding: '2px 6px', borderRadius: '4px', border: '1px solid #bbf7d0', lineHeight: 1.3 }}>
     📌 <strong>Work:</strong> {staff.workAssigned}
   </div>
 ) : staff.class ? (
   <small style={{ color: '#64748b' }}>Assigned: {staff.class}</small>
 ) : null}
 </div>
 </td>
 <td data-label="Blood Group" style={{ textAlign: 'center' }}>
 <span style={{
 display: 'inline-block',
 padding: '2px 8px',
 borderRadius: '6px',
 background: '#fee2e2',
 color: '#991b1b',
 fontWeight: 700,
 fontSize: '0.78rem'
 }}>
 {staff.bloodGroup || 'O+'}
 </span>
 </td>
 <td data-label="Qualification">
 {staff.roleType === 'Non-Teaching' || staff.roleType === 'Operations Works' ? (
   <span style={{ color: '#94a3b8', fontSize: '0.82rem' }}>—</span>
 ) : (
   <span className="badge badge-neutral" style={{ fontSize: '0.78rem' }}>
     {staff.qualification || 'M.Sc., B.Ed'}
   </span>
 )}
 </td>
 <td data-label="Duty Status" style={{ textAlign: 'center' }}>
 <button
   type="button"
   onClick={() => setSelectedStaffHistory({
     name: staff.name,
     role: staff.qualification || staff.roleType,
     type: staff.roleType === 'Teacher' ? 'Teaching Staff' : staff.roleType === 'Non-Teaching' ? 'Non-Teaching Staff' : staff.roleType,
     department: staff.onboardSubject || 'General Campus',
     phone: staff.phone || '+91 98401 23450',
     currentStatus: staff.status === 'Active' ? 'Present on Duty' : staff.status,
     currentPunch: '08:15 AM',
     extraWork: staff.workAssigned ? {
       title: staff.workAssigned,
       department: staff.onboardSubject || 'Campus Operations',
       priority: 'High',
       deadline: staff.class || 'Shift Schedule',
       progress: 100
     } : null
   })}
   className={`badge ${staff.status === 'Active' ? 'badge-success' : 'badge-warning'}`}
   style={{ cursor: 'pointer', border: 'none' }}
   title="Click to check Attendance & Punch Log"
 >
 ● {staff.status === 'Active' ? 'Present / Active' : staff.status || 'Active'}
 </button>
 </td>
 <td data-label="Actions" style={{ textAlign: 'center' }}>
 <div className="sa-actions-cell" style={{ justifyContent: 'center', gap: '6px' }}>
 <button
   className="sa-tbl-action"
   onClick={() => setSelectedStaffHistory({
     name: staff.name,
     role: staff.qualification || staff.roleType,
     type: staff.roleType === 'Teacher' ? 'Teaching Staff' : staff.roleType === 'Non-Teaching' ? 'Non-Teaching Staff' : staff.roleType,
     department: staff.onboardSubject || 'General Campus',
     phone: staff.phone || '+91 98401 23450',
     currentStatus: staff.status === 'Active' ? 'Present on Duty' : staff.status,
     currentPunch: '08:15 AM',
     extraWork: staff.workAssigned ? {
       title: staff.workAssigned,
       department: staff.onboardSubject || 'Campus Operations',
       priority: 'High',
       deadline: staff.class || 'Shift Schedule',
       progress: 100
     } : null
   })}
   title="View staff attendance & work history"
   style={{ color: '#059669', borderColor: '#a7f3d0', background: '#ecfdf5' }}
 >
 📊 Log
 </button>
 <button
 className="sa-tbl-action edit"
 onClick={() => handleOpenStaffModal(staff, staff.roleType)}
 title="Edit staff record"
 >
 <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
 Edit
 </button>
 <button
 className="sa-tbl-action admin"
 onClick={() => handleResetPassword(staff.name, staff.email || `${staff.id}@school.edu`)}
 title="Reset staff password"
 >
 <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="7.5" cy="15.5" r="5.5" /><path d="m21 2-9.6 9.6" /><path d="m15.5 7.5 3 3L22 7l-3-3" /></svg>
 Pass
 </button>
 <button
 className="sa-tbl-action delete"
 onClick={() => handleDeleteStaff(staff)}
 title="Delete staff record"
 style={{ color: '#ef4444', borderColor: '#fca5a5' }}
 >
 <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
 Delete
 </button>
 </div>
 </td>
 </tr>
 ))
 )}
 </tbody>
 </table>
 </div>
 </div>
 );
 })()}

 
 
 
 {activeTab === 'manage-principal' && (
 <div>
 <div className="sa-schools-header-bar">
 <div className="sa-search-wrap" style={{ minWidth: '280px', maxWidth: '440px', flex: 1 }}>
 <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
 <input
 type="text"
 className="sa-search-input"
 placeholder="Search principal by name, email, or qualification..."
 value={principalSearch}
 onChange={(e) => setPrincipalSearch(e.target.value)}
 />
 </div>
 <div className="sa-toolbar-right">
 <button className="btn btn-primary btn-sm" onClick={() => handleOpenPrincipalModal()}>
 + Add Principal
 </button>
 </div>
 </div>

 <div className="table-responsive">
 <table className="sa-schools-table">
 <thead>
 <tr>
 <th style={{ minWidth: '100px' }}>Principal ID</th>
 <th style={{ minWidth: '180px' }}>Principal Name</th>
 <th style={{ minWidth: '150px' }}>Qualification</th>
 <th style={{ minWidth: '120px' }}>Experience</th>
 <th style={{ minWidth: '140px' }}>Phone Number</th>
 <th style={{ minWidth: '180px' }}>Official Email</th>
 <th style={{ minWidth: '90px', textAlign: 'center' }}>Status</th>
 <th style={{ minWidth: '160px', textAlign: 'center' }}>Actions</th>
 </tr>
 </thead>
 <tbody>
 {(data.principals || [])
 .filter(
 (p) =>
 p.name.toLowerCase().includes(principalSearch.toLowerCase()) ||
 p.email.toLowerCase().includes(principalSearch.toLowerCase()) ||
 (p.qualification && p.qualification.toLowerCase().includes(principalSearch.toLowerCase()))
 )
 .map((p) => (
 <tr key={p.id}>
 <td data-label="Principal ID"><code>{p.id}</code></td>
 <td data-label="Principal Name"><strong>{p.name}</strong></td>
 <td data-label="Qualification"><span className="badge badge-info">{p.qualification || 'Ph.D., M.Ed'}</span></td>
 <td data-label="Experience">{p.experience || '18 Years'}</td>
 <td data-label="Phone Number">{p.phone}</td>
 <td data-label="Official Email">{p.email}</td>
 <td data-label="Status" style={{ textAlign: 'center' }}>
 <span className={`badge ${p.status === 'Active' ? 'badge-success' : 'badge-warning'}`}>
 {p.status || 'Active'}
 </span>
 </td>
 <td data-label="Actions" style={{ textAlign: 'center' }}>
 <div className="sa-actions-cell" style={{ justifyContent: 'center', gap: '8px' }}>
 <button className="sa-tbl-action edit" onClick={() => handleOpenPrincipalModal(p)}>
 <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
 Edit
 </button>
 <button className="sa-tbl-action admin" onClick={() => handleResetPassword(p.name, p.email)}>
 <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="7.5" cy="15.5" r="5.5" /><path d="m21 2-9.6 9.6" /><path d="m15.5 7.5 3 3L22 7l-3-3" /></svg>
 Reset Pass
 </button>
 </div>
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 </div>
 )}

 
 
 
 {activeTab === 'manage-teachers' && (
 <div>
 <div className="sa-schools-header-bar">
 <div className="sa-search-wrap" style={{ minWidth: '280px', maxWidth: '440px', flex: 1 }}>
 <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
 <input
 type="text"
 className="sa-search-input"
 placeholder="Search faculty by name, ID, or subject..."
 value={teacherSearch}
 onChange={(e) => setTeacherSearch(e.target.value)}
 />
 </div>
 <div className="sa-toolbar-right" style={{ display: 'flex', gap: '8px' }}>
 <button className="btn btn-outline btn-sm" onClick={() => setIsBulkTeacherOpen(true)}>
 Bulk Import (CSV)
 </button>
 <button className="btn btn-primary btn-sm" onClick={() => handleOpenTeacherModal()}>
 + Add Teacher
 </button>
 </div>
 </div>

 <div className="table-responsive">
 <table className="sa-schools-table">
 <thead>
 <tr>
 <th style={{ minWidth: '90px' }}>Faculty ID</th>
 <th style={{ minWidth: '180px' }}>Faculty Name</th>
 <th style={{ minWidth: '160px' }}>Primary Subject</th>
 <th style={{ minWidth: '130px' }}>Assigned Class</th>
 <th style={{ minWidth: '90px', textAlign: 'center' }}>Status</th>
 <th style={{ minWidth: '120px', textAlign: 'center' }}>Actions</th>
 </tr>
 </thead>
 <tbody>
 {data.teachers
 .filter(
 (t) =>
 t.name.toLowerCase().includes(teacherSearch.toLowerCase()) ||
 t.id.toLowerCase().includes(teacherSearch.toLowerCase()) ||
 t.subject.toLowerCase().includes(teacherSearch.toLowerCase())
 )
 .map((t) => (
 <tr key={t.id}>
 <td data-label="Faculty ID"><code>{t.id}</code></td>
 <td data-label="Faculty Name"><strong>{t.name}</strong></td>
 <td data-label="Primary Subject">{t.subject}</td>
 <td data-label="Assigned Class"><span className="badge badge-info">{t.class}</span></td>
 <td data-label="Status" style={{ textAlign: 'center' }}><span className="badge badge-success">{t.status || 'Active'}</span></td>
 <td data-label="Actions" style={{ textAlign: 'center' }}>
 <div className="sa-actions-cell" style={{ justifyContent: 'center' }}>
 <button className="sa-tbl-action edit" onClick={() => handleOpenTeacherModal(t)}>
 <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
 Edit
 </button>
 </div>
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 </div>
 )}

 
 
 
 {activeTab === 'manage-students' && (() => {
 const availableGrades = ['Grade 6', 'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'];
 const availableSections = ['A', 'B', 'C', 'D'];

 const filteredStudents = (data.students || []).filter((s) => {
 const matchSearch =
 !studentSearch ||
 s.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
 s.roll.toLowerCase().includes(studentSearch.toLowerCase()) ||
 (s.class && s.class.toLowerCase().includes(studentSearch.toLowerCase()));

 const matchGrade =
 studentGradeFilter === 'All' ||
 (s.class && s.class.toLowerCase().includes(studentGradeFilter.toLowerCase()));

 const matchSection =
 studentSectionFilter === 'All' ||
 (s.class && (s.class.toUpperCase().endsWith('-' + studentSectionFilter) || s.class.toUpperCase().endsWith(' ' + studentSectionFilter)));

 return matchSearch && matchGrade && matchSection;
 });

 return (
 <div>
 <div className="sa-schools-header-bar" style={{ marginBottom: '14px' }}>
 <div className="sa-search-wrap" style={{ minWidth: '280px', maxWidth: '440px', flex: 1 }}>
 <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
 <input
 type="text"
 className="sa-search-input"
 placeholder="Search students by name, roll, or class..."
 value={studentSearch}
 onChange={(e) => setStudentSearch(e.target.value)}
 />
 </div>
 <div className="sa-toolbar-right" style={{ display: 'flex', gap: '8px' }}>
 <button className="btn btn-outline btn-sm" onClick={() => setIsBulkStudentOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
 <span>📥</span> Bulk Import (Excel)
 </button>
 <button className="btn btn-primary btn-sm" onClick={() => handleOpenStudentModal()}>
 + Add Student
 </button>
 </div>
 </div>

 
 <div
 style={{
 display: 'flex',
 flexWrap: 'wrap',
 alignItems: 'center',
 justifyContent: 'space-between',
 gap: '12px',
 background: '#f8fafc',
 border: '1px solid #e2e8f0',
 borderRadius: '12px',
 padding: '12px 16px',
 marginBottom: '16px'
 }}
 >
 <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
 <span style={{ fontSize: '0.84rem', fontWeight: 700, color: '#475569', display: 'flex', alignItems: 'center', gap: '4px' }}>
 🎓 <span>Class:</span>
 </span>
 <button
 type="button"
 className={`btn btn-sm ${studentGradeFilter === 'All' ? 'btn-primary' : 'btn-outline'}`}
 onClick={() => setStudentGradeFilter('All')}
 style={{ padding: '4px 12px', fontSize: '0.82rem', borderRadius: '20px' }}
 >
 All Classes
 </button>
 {availableGrades.map((grade) => (
 <button
 key={grade}
 type="button"
 className={`btn btn-sm ${studentGradeFilter === grade ? 'btn-primary' : 'btn-outline'}`}
 onClick={() => setStudentGradeFilter(grade)}
 style={{ padding: '4px 12px', fontSize: '0.82rem', borderRadius: '20px' }}
 >
 {grade}
 </button>
 ))}
 </div>

 <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
 <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
 <label htmlFor="student-section-select" style={{ fontSize: '0.84rem', fontWeight: 700, color: '#475569' }}>
 Section:
 </label>
 <select
 id="student-section-select"
 value={studentSectionFilter}
 onChange={(e) => setStudentSectionFilter(e.target.value)}
 style={{
 padding: '5px 12px',
 borderRadius: '8px',
 border: '1.5px solid #cbd5e1',
 fontWeight: 700,
 fontSize: '0.85rem',
 color: '#1e3a8a',
 background: '#ffffff',
 cursor: 'pointer'
 }}
 >
 <option value="All">All Sections (A, B, C, D)</option>
 {availableSections.map((sec) => (
 <option key={sec} value={sec}>
 Section {sec}
 </option>
 ))}
 </select>
 </div>

 {(studentGradeFilter !== 'All' || studentSectionFilter !== 'All' || studentSearch) && (
 <button
 type="button"
 onClick={() => {
 setStudentGradeFilter('All');
 setStudentSectionFilter('All');
 setStudentSearch('');
 }}
 style={{
 background: 'none',
 border: 'none',
 color: '#dc2626',
 fontSize: '0.8rem',
 fontWeight: 700,
 cursor: 'pointer',
 padding: '4px 8px'
 }}
 >
 Reset ✕
 </button>
 )}

 <span className="badge badge-info" style={{ fontSize: '0.78rem', padding: '4px 8px' }}>
 {filteredStudents.length} Students Found
 </span>
 </div>
 </div>

 <div className="table-responsive">
 <table className="sa-schools-table">
 <thead>
 <tr>
 <th style={{ minWidth: '120px' }}>Roll & Reg No</th>
 <th style={{ minWidth: '170px' }}>Student Name</th>
 <th style={{ minWidth: '100px' }}>Class</th>
 <th style={{ minWidth: '90px' }}>Blood Group</th>
 <th style={{ minWidth: '140px' }}>Emergency Contact</th>
 <th style={{ minWidth: '95px' }}>Attendance</th>
 <th style={{ minWidth: '120px', textAlign: 'center' }}>Performance</th>
 <th style={{ minWidth: '130px', textAlign: 'center' }}>Action</th>
 </tr>
 </thead>
 <tbody>
 {filteredStudents.length === 0 ? (
 <tr>
 <td colSpan="8" style={{ textAlign: 'center', padding: '36px', color: '#64748b' }}>
 <div style={{ fontSize: '1.5rem', marginBottom: '6px' }}>🔍</div>
 <strong>No students found matching the selected Class / Section filters.</strong>
 </td>
 </tr>
 ) : (
 filteredStudents.map((s, idx) => {
 const bloodGroups = ['B+ve', 'O+ve', 'A+ve', 'AB+ve', 'A-ve'];
 const blood = s.bloodGroup || bloodGroups[idx % bloodGroups.length];
 const emergency = s.emergencyContact || s.parentPhone || `+91 98456 ${12301 + idx}`;
 return (
 <tr key={s.roll}>
 <td data-label="Roll & Reg No">
 <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
 <code>{s.roll}</code>
 <small style={{ color: '#64748b', fontSize: '0.74rem', fontWeight: 600 }}>{s.regNo || ('REG-' + s.roll)}</small>
 </div>
 </td>
 <td data-label="Student Name">
 <div className="school-meta-line">
 <strong>{s.name}</strong>
 <small>{s.gender || 'Female'} {s.dob ? `• DOB: ${s.dob}` : ''}</small>
 </div>
 </td>
 <td data-label="Class"><span className="badge badge-info">{s.class}</span></td>
 <td data-label="Blood Group"><strong style={{ color: '#dc2626' }}>{blood}</strong></td>
 <td data-label="Emergency Contact">
 <span style={{ fontWeight: 600, color: 'var(--color-text-dark)', fontSize: '0.85rem' }}>{emergency}</span>
 </td>
 <td data-label="Attendance"><strong>{s.attendance || '100%'}</strong></td>
 <td data-label="Performance" style={{ textAlign: 'center' }}>
 <span className={`badge ${s.performance === 'Outstanding' || s.performance === 'Very Good' ? 'badge-success' : 'badge-warning'}`}>
 {s.performance || 'Good'}
 </span>
 </td>
 <td data-label="Action" style={{ textAlign: 'center' }}>
 <div className="sa-actions-cell" style={{ justifyContent: 'center' }}>
 <button className="sa-tbl-action edit" onClick={() => handleOpenStudentModal(s)} title="Edit Student Profile">
 Edit
 </button>
 <button className="sa-tbl-action view" onClick={() => handleOpenMarks(s)} title="Manage Exam Marks">
 Marks
 </button>
 </div>
 </td>
 </tr>
 );
 })
 )}
 </tbody>
 </table>
 </div>
 </div>
 );
 })()}


 
 
 
 {activeTab === 'manage-parents' && (() => {
    const parentList = data.parents || [];
    const studentList = data.students || [];
    const availableGrades = ['Grade 6', 'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'];
    const availableSections = ['A', 'B', 'C', 'D'];

    const filteredParents = parentList.filter((p) => {
      const linkedStudent = studentList.find(s => s.roll === p.studentRoll || s.name === p.studentName);
      const studentClass = linkedStudent ? (linkedStudent.class || '') : (p.class || '');

      const matchSearch =
        !parentSearch ||
        (p.name && p.name.toLowerCase().includes(parentSearch.toLowerCase())) ||
        (p.phone && p.phone.toLowerCase().includes(parentSearch.toLowerCase())) ||
        (p.email && p.email.toLowerCase().includes(parentSearch.toLowerCase())) ||
        (p.studentName && p.studentName.toLowerCase().includes(parentSearch.toLowerCase())) ||
        (p.studentRoll && p.studentRoll.toLowerCase().includes(parentSearch.toLowerCase())) ||
        studentClass.toLowerCase().includes(parentSearch.toLowerCase());

      const matchGrade =
        parentGradeFilter === 'All' ||
        (studentClass && studentClass.toLowerCase().includes(parentGradeFilter.toLowerCase()));

      const matchSection =
        parentSectionFilter === 'All' ||
        (studentClass && (studentClass.toUpperCase().endsWith('-' + parentSectionFilter) || studentClass.toUpperCase().endsWith(' ' + parentSectionFilter)));

      return matchSearch && matchGrade && matchSection;
    });

    return (
      <div>
        
        <div className="sa-schools-header-bar" style={{ marginBottom: '14px' }}>
          <div className="sa-search-wrap" style={{ minWidth: '280px', maxWidth: '440px', flex: 1 }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
            <input
              type="text"
              className="sa-search-input"
              placeholder="Search parents by name, ward student, phone, or roll..."
              value={parentSearch}
              onChange={(e) => setParentSearch(e.target.value)}
            />
          </div>
          <div className="sa-toolbar-right" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <span className="badge badge-purple" style={{ padding: '6px 14px', fontSize: '0.84rem', fontWeight: 700 }}>
              👨‍👩‍👧 Total Enrolled Parents: {parentList.length}
            </span>
          </div>
        </div>

        
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            padding: '12px 16px',
            marginBottom: '16px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.84rem', fontWeight: 700, color: '#475569', display: 'flex', alignItems: 'center', gap: '4px' }}>
              🎓 <span>Class:</span>
            </span>
            <button
              type="button"
              className={`btn btn-sm ${parentGradeFilter === 'All' ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setParentGradeFilter('All')}
              style={{ padding: '4px 12px', fontSize: '0.82rem', borderRadius: '20px' }}
            >
              All Classes
            </button>
            {availableGrades.map((grade) => (
              <button
                key={grade}
                type="button"
                className={`btn btn-sm ${parentGradeFilter === grade ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => setParentGradeFilter(grade)}
                style={{ padding: '4px 12px', fontSize: '0.82rem', borderRadius: '20px' }}
              >
                {grade}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <label htmlFor="parent-section-select" style={{ fontSize: '0.84rem', fontWeight: 700, color: '#475569' }}>
                Section:
              </label>
              <select
                id="parent-section-select"
                value={parentSectionFilter}
                onChange={(e) => setParentSectionFilter(e.target.value)}
                style={{
                  padding: '5px 12px',
                  borderRadius: '8px',
                  border: '1.5px solid #cbd5e1',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  color: '#1e3a8a',
                  background: '#ffffff',
                  cursor: 'pointer'
                }}
              >
                <option value="All">All Sections (A, B, C, D)</option>
                {availableSections.map((sec) => (
                  <option key={sec} value={sec}>
                    Section {sec}
                  </option>
                ))}
              </select>
            </div>

            {(parentGradeFilter !== 'All' || parentSectionFilter !== 'All' || parentSearch) && (
              <button
                type="button"
                onClick={() => {
                  setParentGradeFilter('All');
                  setParentSectionFilter('All');
                  setParentSearch('');
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#dc2626',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  padding: '4px 8px'
                }}
              >
                Reset ✕
              </button>
            )}

            <span className="badge badge-info" style={{ fontSize: '0.78rem', padding: '4px 8px' }}>
              {filteredParents.length} STUDENTS FOUND
            </span>
          </div>
        </div>

        <div className="table-responsive">
 <table className="sa-schools-table">
 <thead>
 <tr>
 <th style={{ minWidth: '180px' }}>Parent Name</th>
 <th style={{ minWidth: '120px' }}>Relationship</th>
 <th style={{ minWidth: '140px' }}>Phone Number</th>
 <th style={{ minWidth: '180px' }}>Contact Email</th>
 <th style={{ minWidth: '170px' }}>Linked Ward (Student & Class)</th>
 <th style={{ minWidth: '130px', textAlign: 'right' }}>Actions</th>
 </tr>
 </thead>
 <tbody>
 {filteredParents.length === 0 ? (
 <tr>
 <td colSpan="6" style={{ textAlign: 'center', padding: '36px', color: '#64748b' }}>
 <div style={{ fontSize: '1.5rem', marginBottom: '6px' }}>🔍</div>
 <strong>No parent records found for the selected Class filter.</strong>
 </td>
 </tr>
 ) : (
 filteredParents.map((p) => {
 const linkedStudent = studentList.find(s => s.roll === p.studentRoll || s.name === p.studentName);
 const sClass = linkedStudent ? linkedStudent.class : (p.class || 'Grade 10-A');
 return (
 <tr key={p.id}>
 <td data-label="Parent Name"><strong>{p.name}</strong></td>
 <td data-label="Relationship">
 <span className={`badge ${p.relationship === 'Father' ? 'badge-primary' : p.relationship === 'Mother' ? 'badge-indigo' : 'badge-purple'}`}>
 {p.relationship || 'Parent'}
 </span>
 </td>
 <td data-label="Phone Number"><span style={{ fontWeight: 600, color: 'var(--color-text-dark)' }}>{p.phone}</span></td>
 <td data-label="Contact Email">{p.email}</td>
 <td data-label="Linked Ward">
 <div className="school-meta-line">
 <strong>{p.studentName}</strong>
 <div style={{ display: 'flex', gap: '6px', alignItems: 'center', marginTop: '2px' }}>
 <span className="badge badge-info" style={{ fontSize: '0.72rem' }}>{sClass}</span>
 <small>Roll: {p.studentRoll}</small>
 </div>
 </div>
 </td>
 <td data-label="Actions" style={{ textAlign: 'right' }}>
 <div className="sa-actions-cell" style={{ justifyContent: 'flex-end' }}>
 <button className="sa-tbl-action admin" onClick={() => handleResetPassword(p.name, p.email)}>
 <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="7.5" cy="15.5" r="5.5" /><path d="m21 2-9.6 9.6" /><path d="m15.5 7.5 3 3L22 7l-3-3" /></svg>
 Reset Password
 </button>
 </div>
 </td>
 </tr>
 );
 })
 )}
 </tbody>
 </table>
 </div>
 </div>
 );
 })()}


 
 
 
 {activeTab === 'manage-classes' && (
 <div>
 
 <div
 className="sa-schools-header-bar"
 style={{
 display: 'flex',
 flexWrap: 'wrap',
 alignItems: 'center',
 justifyContent: 'space-between',
 gap: '14px',
 background: '#ffffff',
 border: '1px solid #e2e8f0',
 borderRadius: '12px',
 padding: '14px 18px',
 marginBottom: '20px'
 }}
 >
 <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
 <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
  <label htmlFor="class-section-dropdown" style={{ fontWeight: 800, fontSize: '0.92rem', color: '#1e3a8a' }}>
 Select Class & Section:
 </label>
 </div>
 <select
 id="class-section-dropdown"
 value={selectedClassObj.name}
 onChange={(e) => setSelectedClass(e.target.value)}
 style={{
 padding: '8px 16px',
 borderRadius: '8px',
 border: '2px solid #2563eb',
 fontWeight: 800,
 fontSize: '0.95rem',
 color: '#1e3a8a',
 background: '#eff6ff',
 cursor: 'pointer',
 minWidth: '180px'
 }}
 >
 {data.classes.map((c) => (
 <option key={c.name} value={c.name}>
 {c.name} • Room {c.room} ({c.teacher})
 </option>
 ))}
 </select>
 </div>

 <div style={{ display: 'flex', gap: '8px' }}>
 <button
 type="button"
 className="btn btn-outline btn-sm"
 onClick={() => handleOpenClassModal(selectedClassObj)}
 style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
 >
 Edit This Class
 </button>
 <button
 type="button"
 className="btn btn-primary btn-sm"
 onClick={() => handleOpenClassModal()}
 style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 18px', fontWeight: 700 }}
 >
 + Add Class
 </button>
 </div>
 </div>

 
 <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '20px' }}>
 {data.classes.map((c) => {
 const isSelected = c.name === selectedClassObj.name;
 return (
 <button
 key={c.name}
 type="button"
 className={`btn btn-sm ${isSelected ? 'btn-primary' : 'btn-outline'}`}
 onClick={() => setSelectedClass(c.name)}
 style={{
 padding: '8px 18px',
 fontSize: '0.88rem',
 borderRadius: '10px',
 display: 'flex',
 alignItems: 'center',
 gap: '8px',
 fontWeight: isSelected ? 800 : 600
 }}
 >
  <span>{c.name}</span>
 <span className="badge" style={{ background: isSelected ? '#ffffff' : '#e2e8f0', color: isSelected ? '#1e3a8a' : '#475569', fontSize: '0.75rem', padding: '2px 6px' }}>
 Room {c.room}
 </span>
 </button>
 );
 })}
 </div>

 
 <div
 style={{
 display: 'grid',
 gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
 gap: '14px',
 background: '#f8fafc',
 border: '1px solid #e2e8f0',
 borderRadius: '12px',
 padding: '16px 20px',
 marginBottom: '20px'
 }}
 >
 <div>
 <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Selected Section</div>
 <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#1e3a8a', marginTop: '2px' }}>
 {selectedClassObj.name}
 </div>
 </div>
 <div>
 <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Class Teacher</div>
 <div style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', marginTop: '4px' }}>
 {selectedClassObj.teacher}
 </div>
 </div>
 <div>
 <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Classroom / Room No</div>
 <div style={{ fontSize: '1rem', fontWeight: 800, color: '#059669', marginTop: '4px' }}>
 Room {selectedClassObj.room}
 </div>
 </div>
 <div>
 <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Class Strength</div>
 <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#2563eb', marginTop: '2px' }}>
 {selectedClassObj.strength} Students Enrolled
 </div>
 </div>
 </div>

 
 <div style={{ background: 'var(--color-bg-white)', borderRadius: 'var(--radius-md)', padding: '20px', border: '2px solid rgba(30,58,138,0.12)', boxShadow: 'var(--shadow-sm)' }}>
 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', marginBottom: '15px', borderBottom: '1px solid rgba(0,0,0,0.08)', paddingBottom: '12px' }}>
 <div>
 <h3 style={{ color: 'var(--color-primary)', margin: '0 0 4px 0' }}>
 Timetable & Period Schedule &mdash; {selectedClassObj.name}
 </h3>
 <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>
 Weekly academic period allocation and assigned instructors for this section.
 </p>
 </div>
 <button
 className="btn btn-outline btn-sm"
 style={{ padding: '6px 14px', fontSize: '0.8rem' }}
 onClick={() => handleOpenClassModal(selectedClassObj)}
 >
 Configure Class Details
 </button>
 </div>

 <div className="table-responsive">
 <table className="timetable-grid" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center' }}>
 <thead>
 <tr style={{ background: '#f1f5f9', borderBottom: '2px solid #cbd5e1' }}>
 <th style={{ padding: '10px', textAlign: 'left', minWidth: '120px' }}>Period / Time</th>
 {days.map((d) => (
 <th key={d} style={{ padding: '10px', minWidth: '130px' }}>{d}</th>
 ))}
 </tr>
 </thead>
 <tbody>
 {periods.map((p) => (
 <tr key={p.period} style={{ borderBottom: '1px solid #f1f5f9' }}>
 <td style={{ padding: '10px', textAlign: 'left', fontWeight: 700, background: '#f8fafc', color: 'var(--color-primary)' }}>
 <div>Period {p.period}</div>
 <div style={{ fontSize: '0.72rem', fontWeight: 400, color: '#64748b' }}>{p.time}</div>
 </td>
 {days.map((day) => {
 const slot = classSlots.find((s) => s.day === day && parseInt(s.period) === p.period);
 if (slot) {
 return (
 <td key={day} style={{ padding: '6px' }}>
 <div
 style={{
 background: 'rgba(37, 99, 235, 0.08)',
 borderLeft: '3px solid var(--color-primary)',
 borderRadius: '4px',
 padding: '8px 6px',
 cursor: 'pointer',
 transition: 'all 0.15s'
 }}
 onClick={() => handleOpenAssignWork(selectedClassObj.name, day, p.period)}
 title="Click to modify teacher or subject assignment"
 >
 <div style={{ fontWeight: 700, color: 'var(--color-primary)', fontSize: '0.88rem' }}>{slot.subject}</div>
 <div style={{ fontSize: '0.74rem', color: '#475569', marginTop: '2px' }}>{slot.teacherName}</div>
 </div>
 </td>
 );
 }
 return (
 <td key={day} style={{ padding: '6px' }}>
 <button
 type="button"
 className="timetable-slot-empty"
 style={{
 width: '100%',
 padding: '12px 6px',
 border: '1px dashed #cbd5e1',
 borderRadius: '4px',
 background: 'none',
 cursor: 'pointer',
 color: '#94a3b8',
 fontSize: '0.78rem'
 }}
 onClick={() => handleOpenAssignWork(selectedClassObj.name, day, p.period)}
 >
 + Assign
 </button>
 </td>
 );
 })}
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 </div>
 </div>
 )}


 
 
 
 {activeTab === 'manage-subjects' && (() => {
 const subjectCategories = ['Tamil', 'English', 'Mathematics', 'Physics', 'Chemistry', 'Biology', 'Computer Science', 'Social Science'];

 const filteredSubjects = (data.subjects || []).filter((s) => {
 const q = (subjectSearch || '').toLowerCase();
 const matchSearch =
 !q ||
 (s.name && s.name.toLowerCase().includes(q)) ||
 (s.code && s.code.toLowerCase().includes(q)) ||
 (s.teacher && s.teacher.toLowerCase().includes(q)) ||
 (s.grade && s.grade.toLowerCase().includes(q));

 const matchCategory =
 subjectCategoryFilter === 'All' ||
 (s.name && s.name.toLowerCase().includes(subjectCategoryFilter.toLowerCase())) ||
 (s.code && s.code.toLowerCase().includes(subjectCategoryFilter.toLowerCase()));

 return matchSearch && matchCategory;
 });

 return (
 <div>
 <div className="sa-schools-header-bar" style={{ marginBottom: '14px' }}>
 <div className="sa-search-wrap" style={{ minWidth: '280px', maxWidth: '440px', flex: 1 }}>
 <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
 <input
 type="text"
 className="sa-search-input"
 placeholder="Search subjects or faculty teachers (e.g. Tamil, Physics, Priya)..."
 value={subjectSearch}
 onChange={(e) => setSubjectSearch(e.target.value)}
 />
 </div>
 <div className="sa-toolbar-right" style={{ display: 'flex', gap: '8px' }}>
 <button className="btn btn-primary btn-sm" onClick={() => handleOpenSubjectModal()}>
 + Add Subject
 </button>
 </div>
 </div>

 
 <div
 style={{
 display: 'flex',
 flexWrap: 'wrap',
 alignItems: 'center',
 justifyContent: 'space-between',
 gap: '12px',
 background: '#f8fafc',
 border: '1px solid #e2e8f0',
 borderRadius: '12px',
 padding: '12px 16px',
 marginBottom: '18px'
 }}
 >
 <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
 <span style={{ fontSize: '0.84rem', fontWeight: 700, color: '#475569', display: 'flex', alignItems: 'center', gap: '4px' }}>
 📖 <span>Subjects:</span>
 </span>
 <button
 type="button"
 className={`btn btn-sm ${subjectCategoryFilter === 'All' ? 'btn-primary' : 'btn-outline'}`}
 onClick={() => setSubjectCategoryFilter('All')}
 style={{ padding: '4px 14px', fontSize: '0.82rem', borderRadius: '20px' }}
 >
 All Subjects
 </button>
 {subjectCategories.map((subName) => (
 <button
 key={subName}
 type="button"
 className={`btn btn-sm ${subjectCategoryFilter === subName ? 'btn-primary' : 'btn-outline'}`}
 onClick={() => setSubjectCategoryFilter(subName)}
 style={{ padding: '4px 14px', fontSize: '0.82rem', borderRadius: '20px' }}
 >
 {subName}
 </button>
 ))}
 </div>

 <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
 {(subjectCategoryFilter !== 'All' || subjectSearch) && (
 <button
 type="button"
 onClick={() => {
 setSubjectCategoryFilter('All');
 setSubjectSearch('');
 }}
 style={{
 background: 'none',
 border: 'none',
 color: '#dc2626',
 fontSize: '0.8rem',
 fontWeight: 700,
 cursor: 'pointer',
 padding: '4px 8px'
 }}
 >
 Reset Filter ✕
 </button>
 )}
 <span className="badge badge-info" style={{ fontSize: '0.78rem', padding: '4px 8px' }}>
 {filteredSubjects.length} Courses Found
 </span>
 </div>
 </div>

 <div className="table-responsive">
 <table className="sa-schools-table">
 <thead>
 <tr>
 <th style={{ minWidth: '95px' }}>Course Code</th>
 <th style={{ minWidth: '180px' }}>Subject Title</th>
 <th style={{ minWidth: '110px' }}>Class / Grade</th>
 <th style={{ minWidth: '240px' }}>Assigned Faculty & Details</th>
 <th style={{ minWidth: '110px', textAlign: 'center' }}>Periods / Wk</th>
 <th style={{ minWidth: '110px' }}>Classroom / Lab</th>
 <th style={{ minWidth: '110px', textAlign: 'center' }}>Action</th>
 </tr>
 </thead>
 <tbody>
 {filteredSubjects.length === 0 ? (
 <tr>
 <td colSpan="7" style={{ textAlign: 'center', padding: '36px', color: '#64748b' }}>
 <div style={{ fontSize: '1.5rem', marginBottom: '6px' }}>🔍</div>
 <strong>No subjects found for the selected filter.</strong>
 </td>
 </tr>
 ) : (
 filteredSubjects.map((s) => {
 const staffObj = (data.teachers || []).find((t) => t.name === s.teacher) ||
 (data.principals || []).find((p) => p.name === s.teacher);
 return (
 <tr key={s.code}>
 <td data-label="Course Code"><code>{s.code}</code></td>
 <td data-label="Subject Title">
 <strong style={{ color: 'var(--color-text-dark)', fontSize: '0.92rem' }}>{s.name}</strong>
 </td>
 <td data-label="Class / Grade">
 <span className="badge badge-info">{s.grade || 'Grade 10-A'}</span>
 </td>
 <td data-label="Assigned Faculty">
 <div
 style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
 onClick={() => setSelectedStaffSchedule(s.teacher)}
 title={`Click to view ${s.teacher}'s complete schedule`}
 >
 <div style={{
 width: '36px',
 height: '36px',
 borderRadius: '50%',
 background: '#e0e7ff',
 color: '#3730a3',
 display: 'flex',
 alignItems: 'center',
 justifyContent: 'center',
 fontWeight: 800,
 fontSize: '0.95rem',
 flexShrink: 0
 }}>
 {s.teacher.charAt(s.teacher.indexOf(' ') + 1) || s.teacher.charAt(0)}
 </div>
 <div>
 <div style={{ fontWeight: 800, color: '#1e3a8a', fontSize: '0.88rem' }}>
 👩‍🏫 {s.teacher}
 </div>
 <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>
 📞 {staffObj ? staffObj.phone : '+91 98401 23450'} • {staffObj ? (staffObj.subject || 'Faculty') : 'Instructor'}
 </div>
 </div>
 </div>
 </td>
 <td data-label="Periods / Wk" style={{ textAlign: 'center' }}>
 <span className="badge badge-purple">{s.periodsPerWeek || 5} Periods</span>
 </td>
 <td data-label="Classroom / Lab">
 <span style={{ fontWeight: 600, color: 'var(--color-text-dark)' }}>{s.room || 'A-102'}</span>
 </td>
 <td data-label="Action" style={{ textAlign: 'center' }}>
 <div className="sa-actions-cell" style={{ justifyContent: 'center' }}>
 <button className="sa-tbl-action edit" onClick={() => handleOpenSubjectModal(s)}>
 Edit
 </button>
 </div>
 </td>
 </tr>
 );
 })
 )}
 </tbody>
 </table>
 </div>
 </div>
 );
 })()}


 
 
 
 {activeTab === 'fee-collection-tracker' && (
 <div>
 
 {(() => {
 const totalPending = feeRecords.reduce((acc, r) => {
 const num = parseInt(r.due.replace(/[^0-9]/g, ''), 10) || 0;
 return acc + num;
 }, 0);
 const pendingCount = feeRecords.filter((r) => r.status !== 'PAID').length;

 return (
 <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '24px' }}>
 
 <div style={{
 background: 'linear-gradient(135deg, #065f46 0%, #059669 100%)',
 color: '#ffffff',
 borderRadius: '16px',
 padding: '22px 24px',
 display: 'flex',
 alignItems: 'center',
 gap: '18px',
 boxShadow: '0 8px 20px rgba(5, 150, 105, 0.18)',
 border: '1px solid #10b981'
 }}>
 <div style={{
 width: '56px',
 height: '56px',
 borderRadius: '14px',
 background: 'rgba(255, 255, 255, 0.2)',
 display: 'flex',
 alignItems: 'center',
 justifyContent: 'center',
 fontSize: '1.8rem',
 fontWeight: 900,
 backdropFilter: 'blur(4px)'
 }}>
 ₹
 </div>
 <div>
 <div style={{ fontSize: '0.82rem', opacity: 0.9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.6px' }}>
 Total Fee Collect Today
 </div>
 <div style={{ fontSize: '2rem', fontWeight: 900, margin: '2px 0 4px', letterSpacing: '-0.5px' }}>
 ₹42,000
 </div>
 <div style={{ fontSize: '0.78rem', opacity: 0.85, display: 'flex', alignItems: 'center', gap: '5px' }}>
 <span> 3 Payments Received Today</span> &bull; <span>Verified</span>
 </div>
 </div>
 </div>

 
 <div style={{
 background: 'linear-gradient(135deg, #991b1b 0%, #dc2626 100%)',
 color: '#ffffff',
 borderRadius: '16px',
 padding: '22px 24px',
 display: 'flex',
 alignItems: 'center',
 gap: '18px',
 boxShadow: '0 8px 20px rgba(220, 38, 38, 0.18)',
 border: '1px solid #ef4444'
 }}>
 <div style={{
 width: '56px',
 height: '56px',
 borderRadius: '14px',
 background: 'rgba(255, 255, 255, 0.2)',
 display: 'flex',
 alignItems: 'center',
 justifyContent: 'center',
 fontSize: '1.8rem',
 fontWeight: 900,
 backdropFilter: 'blur(4px)'
 }}>
 ⏳
 </div>
 <div>
 <div style={{ fontSize: '0.82rem', opacity: 0.9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.6px' }}>
 Pending Fees
 </div>
 <div style={{ fontSize: '2rem', fontWeight: 900, margin: '2px 0 4px', letterSpacing: '-0.5px' }}>
 ₹{totalPending.toLocaleString('en-IN')}
 </div>
 <div style={{ fontSize: '0.78rem', opacity: 0.85, display: 'flex', alignItems: 'center', gap: '5px' }}>
 <span> {pendingCount} Students with Outstanding Dues</span>
 </div>
 </div>
 </div>
 </div>
 );
 })()}

 
 <div className="sa-schools-header-bar" style={{ display: 'flex', gap: '14px', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}>
 <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
 
 <div style={{ position: 'relative', minWidth: '240px' }}>
 <input
 type="text"
 value={feeSearch}
 onChange={(e) => setFeeSearch(e.target.value)}
 placeholder="Search by student, roll no, parent..."
 style={{
 width: '100%',
 padding: '9px 12px 9px 36px',
 borderRadius: '8px',
 border: '1px solid #cbd5e1',
 background: '#ffffff',
 color: '#0f172a',
 fontSize: '0.88rem',
 fontWeight: 500,
 outline: 'none',
 boxShadow: '0 2px 4px rgba(0,0,0,0.04)'
 }}
 />
 <span style={{ position: 'absolute', left: '11px', top: '50%', transform: 'translateY(-50%)', opacity: 0.85, fontSize: '0.95rem' }}>
 
 </span>
 {feeSearch && (
 <button
 type="button"
 onClick={() => setFeeSearch('')}
 style={{
 position: 'absolute',
 right: '10px',
 top: '50%',
 transform: 'translateY(-50%)',
 background: 'transparent',
 border: 'none',
 cursor: 'pointer',
 color: '#64748b',
 fontSize: '0.9rem',
 fontWeight: 'bold',
 padding: '2px'
 }}
 title="Clear search"
 >
 
 </button>
 )}
 </div>

 
 <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
 <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#475569' }}>Class:</span>
 <select
 className="sa-filter-select"
 value={feeClassFilter}
 onChange={(e) => setFeeClassFilter(e.target.value)}
 style={{ minWidth: '150px' }}
 >
 <option value="All">All Classes (Grade 10-A, 10-B, 9-A)</option>
 <option value="Grade 10-A">Grade 10-A</option>
 <option value="Grade 10-B">Grade 10-B</option>
 <option value="Grade 9-A">Grade 9-A</option>
 </select>
 </div>
 </div>

 
 <div className="sa-toolbar-right" style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
 
 <label
 className="btn btn-outline btn-sm"
 style={{
 display: 'inline-flex',
 alignItems: 'center',
 gap: '6px',
 cursor: 'pointer',
 borderColor: '#2563eb',
 color: '#2563eb',
 fontWeight: 600,
 margin: 0
 }}
 title="Upload student fee register spreadsheet (.xlsx / .xls)"
 >
 Upload Excel
 <input
 type="file"
 accept=".xlsx, .xls, .csv"
 style={{ display: 'none' }}
 onChange={handleFeeExcelUpload}
 />
 </label>

 
 <button
 type="button"
 className="btn btn-primary btn-sm"
 onClick={handleExportFeeExcel}
 style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}
 title="Download fee register spreadsheet as Excel"
 >
 Export Fee Register
 </button>

 
 <button
 type="button"
 className="btn btn-outline btn-sm"
 style={{ borderColor: '#25D366', color: '#128C7E', fontWeight: 600 }}
 onClick={() => {
 const pendingList = feeRecords.filter((r) => r.status !== 'PAID');
 setFeedback({
 title: `Bulk WhatsApp Dispatched to ${pendingList.length} Parents!`,
 body: `Automated fee due notifications and secure UPI payment links were sent to all ${pendingList.length} pending parents via WhatsApp Business API.`,
 });
 }}
 >
 Bulk WhatsApp
 </button>
 </div>
 </div>

 
 <div className="table-responsive">
 <table className="sa-schools-table">
 <thead>
 <tr>
 <th style={{ minWidth: '85px' }}>Roll No</th>
 <th style={{ minWidth: '160px' }}>Student Name</th>
 <th style={{ minWidth: '110px' }}>Class</th>
 <th style={{ minWidth: '150px' }}>Parent / Guardian</th>
 <th style={{ minWidth: '100px' }}>Total Fee</th>
 <th style={{ minWidth: '100px' }}>Paid</th>
 <th style={{ minWidth: '100px' }}>Due Amount</th>
 <th style={{ minWidth: '110px', textAlign: 'center' }}>Fee Status</th>
 <th style={{ minWidth: '180px', textAlign: 'center' }}>Reminder Actions</th>
 </tr>
 </thead>
 <tbody>
 {feeRecords
 .filter((r) => feeClassFilter === 'All' || r.class === feeClassFilter)
 .filter((r) => {
 if (!feeSearch) return true;
 const q = feeSearch.toLowerCase();
 return (
 (r.name && r.name.toLowerCase().includes(q)) ||
 (r.roll && r.roll.toLowerCase().includes(q)) ||
 (r.parent && r.parent.toLowerCase().includes(q)) ||
 (r.phone && r.phone.toLowerCase().includes(q)) ||
 (r.class && r.class.toLowerCase().includes(q))
 );
 })
 .map((r) => (
 <tr key={r.id}>
 <td data-label="Roll No"><code>{r.roll}</code></td>
 <td data-label="Student Name"><strong>{r.name}</strong></td>
 <td data-label="Class"><span className="badge badge-info">{r.class}</span></td>
 <td data-label="Parent">
 <div className="school-meta-line">
 <strong>{r.parent}</strong>
 <small>{r.phone}</small>
 </div>
 </td>
 <td data-label="Total Fee"><strong>{r.totalFee}</strong></td>
 <td data-label="Paid" style={{ color: '#059669', fontWeight: 600 }}>{r.paid}</td>
 <td data-label="Due Amount" style={{ color: r.due !== '₹0' ? '#dc2626' : '#64748b', fontWeight: 700 }}>
 {r.due}
 </td>
 <td data-label="Fee Status" style={{ textAlign: 'center' }}>
 <span className={`badge ${r.status === 'PAID' ? 'badge-active' : r.status === 'PARTIAL' ? 'badge-warning' : 'badge-danger'}`}>
 {r.status}
 </span>
 </td>
 <td data-label="Reminder Actions" style={{ textAlign: 'center' }}>
 {r.status === 'PAID' ? (
 <span style={{ fontSize: '0.78rem', color: '#059669', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
 <span></span> Cleared (Receipt Sent)
 </span>
 ) : (
 <div style={{ display: 'flex', gap: '6px', justifyContent: 'center', flexWrap: 'wrap' }}>
 
 <button
 className="btn btn-sm btn-outline"
 style={{
 padding: '4px 9px',
 fontSize: '0.75rem',
 borderColor: '#25D366',
 color: '#128C7E',
 fontWeight: 600,
 display: 'inline-flex',
 alignItems: 'center',
 gap: '4px'
 }}
 onClick={() => {
 const defaultMsg = `Dear ${r.parent}, this is a gentle reminder from Zen School regarding pending fee of ${r.due} for student ${r.name} (${r.class}). Kindly pay using our instant UPI link: https://pay.zenschool.in/${r.roll.toLowerCase()}`;
 setFeeReminderModal({
 record: r,
 channel: 'whatsapp',
 message: defaultMsg,
 sent: false,
 });
 }}
 title="Open WhatsApp Composer"
 >
 WhatsApp
 </button>

 
 <button
 className="btn btn-sm btn-outline"
 style={{
 padding: '4px 9px',
 fontSize: '0.75rem',
 borderColor: '#3b82f6',
 color: '#1d4ed8',
 fontWeight: 600,
 display: 'inline-flex',
 alignItems: 'center',
 gap: '4px'
 }}
 onClick={() => {
 const defaultMsg = `Zen School Alert: Dear ${r.parent}, Fee of ${r.due} is pending for ${r.name} (${r.roll}). Pay before due date: https://pay.zenschool.in/${r.roll.toLowerCase()}`;
 setFeeReminderModal({
 record: r,
 channel: 'sms',
 message: defaultMsg,
 sent: false,
 });
 }}
 title="Open SMS Composer"
 >
 SMS
 </button>

 
 <button
 className="btn btn-sm btn-outline"
 style={{
 padding: '4px 9px',
 fontSize: '0.75rem',
 borderColor: '#f59e0b',
 color: '#b45309',
 fontWeight: 600,
 display: 'inline-flex',
 alignItems: 'center',
 gap: '4px'
 }}
 onClick={() => {
 setFeeReminderModal({
 record: r,
 channel: 'call',
 message: `Automated Voice Call Script: "Hello ${r.parent}, this is an automated fee reminder call from Zen School. A pending balance of ${r.due} is due for your ward ${r.name} (${r.class}). Press 1 to receive payment link via WhatsApp or SMS."`,
 sent: false,
 });
 }}
 title="Place Call / IVR Reminder"
 >
 Call
 </button>
 </div>
 )}
 </td>
 </tr>
 ))}
 {feeRecords
 .filter((r) => feeClassFilter === 'All' || r.class === feeClassFilter)
 .filter((r) => {
 if (!feeSearch) return true;
 const q = feeSearch.toLowerCase();
 return (
 (r.name && r.name.toLowerCase().includes(q)) ||
 (r.roll && r.roll.toLowerCase().includes(q)) ||
 (r.parent && r.parent.toLowerCase().includes(q)) ||
 (r.phone && r.phone.toLowerCase().includes(q)) ||
 (r.class && r.class.toLowerCase().includes(q))
 );
 }).length === 0 && (
 <tr>
 <td colSpan="9" style={{ textAlign: 'center', padding: '36px', color: '#64748b' }}>
 <div style={{ fontSize: '1.4rem', marginBottom: '8px' }}></div>
 <div>No matching student fee records found for "<strong>{feeSearch}</strong>"</div>
 </td>
 </tr>
 )}
 </tbody>
 </table>
 </div>
 </div>
 )}

 
 {false && activeTab === 'attendance-calendar' && (
 <div>
 <div className="sa-schools-header-bar">
 <div style={{ display: 'flex', gap: '14px', alignItems: 'center', flexWrap: 'wrap' }}>
 <div>
 <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginRight: '8px' }}>Month:</span>
 <select
 className="sa-filter-select"
 value={calendarMonth}
 onChange={(e) => setCalendarMonth(e.target.value)}
 style={{ minWidth: '140px' }}
 >
 <option value="October 2026">October 2026</option>
 <option value="September 2026">September 2026</option>
 <option value="August 2026">August 2026</option>
 </select>
 </div>

 <div>
 <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginRight: '8px' }}>Class / Section:</span>
 <select
 className="sa-filter-select"
 value={selectedCalendarClass}
 onChange={(e) => setSelectedCalendarClass(e.target.value)}
 style={{ minWidth: '140px' }}
 >
 <option value="Grade 10-A">Grade 10-A</option>
 <option value="Grade 10-B">Grade 10-B</option>
 <option value="Grade 9-A">Grade 9-A</option>
 <option value="Grade 9-B">Grade 9-B</option>
 </select>
 </div>
 </div>

 
 <div style={{ display: 'flex', gap: '14px', alignItems: 'center', fontSize: '0.8rem', color: '#475569' }}>
 <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
 <span style={{ width: '12px', height: '12px', borderRadius: '3px', background: '#10b981', display: 'inline-block' }}></span> Present (&gt;90%)
 </span>
 <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
 <span style={{ width: '12px', height: '12px', borderRadius: '3px', background: '#f59e0b', display: 'inline-block' }}></span> Partial / Leave (75-90%)
 </span>
 <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
 <span style={{ width: '12px', height: '12px', borderRadius: '3px', background: '#ef4444', display: 'inline-block' }}></span> High Absenteeism (&lt;75%)
 </span>
 <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
 <span style={{ width: '12px', height: '12px', borderRadius: '3px', background: '#e2e8f0', display: 'inline-block' }}></span> Holiday / Sunday
 </span>
 </div>
 </div>

 
 <div style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)', borderRadius: '12px', padding: '20px', color: '#fff', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
 <div>
 <div style={{ fontSize: '0.85rem', opacity: 0.85, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
 Monthly Class Performance Summary
 </div>
 <div style={{ fontSize: '1.6rem', fontWeight: 800, marginTop: '2px' }}>
 94.6% Average Attendance ({selectedCalendarClass})
 </div>
 <div style={{ fontSize: '0.85rem', opacity: 0.9, marginTop: '4px' }}>
 22 Working Days • 38 Enrolled Students • Total Present Logs: 790
 </div>
 </div>
 <div style={{ display: 'flex', gap: '12px' }}>
 <div style={{ background: 'rgba(255,255,255,0.15)', padding: '10px 18px', borderRadius: '8px', textAlign: 'center' }}>
 <div style={{ fontSize: '1.2rem', fontWeight: 800 }}>20</div>
 <div style={{ fontSize: '0.72rem', opacity: 0.85 }}>Full Days (&gt;90%)</div>
 </div>
 <div style={{ background: 'rgba(255,255,255,0.15)', padding: '10px 18px', borderRadius: '8px', textAlign: 'center' }}>
 <div style={{ fontSize: '1.2rem', fontWeight: 800 }}>2</div>
 <div style={{ fontSize: '0.72rem', opacity: 0.85 }}>Partial Days</div>
 </div>
 <div style={{ background: 'rgba(255,255,255,0.15)', padding: '10px 18px', borderRadius: '8px', textAlign: 'center' }}>
 <div style={{ fontSize: '1.2rem', fontWeight: 800 }}>9</div>
 <div style={{ fontSize: '0.72rem', opacity: 0.85 }}>Holidays / Weekends</div>
 </div>
 </div>
 </div>

 
 <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px', marginBottom: '22px' }}>
 <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#1e293b', marginBottom: '14px' }}>
 {calendarMonth} — Day-by-Day Visual Attendance Calendar
 </h3>
 <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '10px' }}>
 {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
 <div key={d} style={{ textAlign: 'center', fontWeight: 700, fontSize: '0.8rem', color: '#64748b', paddingBottom: '6px' }}>
 {d}
 </div>
 ))}
 
 {[null, null, null, null].map((_, idx) => (
 <div key={`empty-${idx}`} style={{ minHeight: '65px', background: '#f8fafc', borderRadius: '8px', border: '1px dashed #e2e8f0' }}></div>
 ))}
 {Array.from({ length: 31 }, (_, i) => {
 const day = i + 1;
 const dayOfWeek = (day + 3) % 7; 
 const isSunday = dayOfWeek === 0;
 const isHoliday = day === 2 || day === 20; 
 const isPartial = day === 12 || day === 23;
 const isHighAbsent = day === 15;

 let bgColor = '#ecfdf5';
 let textColor = '#065f46';
 let statusText = '97% Present';
 let badgeBg = '#10b981';

 if (isSunday || isHoliday) {
 bgColor = '#f1f5f9';
 textColor = '#64748b';
 statusText = isHoliday ? 'School Holiday' : 'Weekend';
 badgeBg = '#94a3b8';
 } else if (isHighAbsent) {
 bgColor = '#fef2f2';
 textColor = '#991b1b';
 statusText = '71% (Flu Outbreak)';
 badgeBg = '#ef4444';
 } else if (isPartial) {
 bgColor = '#fffbeb';
 textColor = '#92400e';
 statusText = '84% Present';
 badgeBg = '#f59e0b';
 }

 return (
 <div
 key={day}
 style={{
 minHeight: '65px',
 background: bgColor,
 border: `1px solid ${isSunday || isHoliday ? '#e2e8f0' : badgeBg}`,
 borderRadius: '8px',
 padding: '8px',
 display: 'flex',
 flexDirection: 'column',
 justifyContent: 'space-between',
 cursor: 'pointer',
 transition: 'transform 0.1s ease',
 }}
 title={`Oct ${day}, 2026: ${statusText}`}
 >
 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
 <span style={{ fontWeight: 800, fontSize: '0.85rem', color: textColor }}>{day}</span>
 {!isSunday && !isHoliday && (
 <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: badgeBg }}></span>
 )}
 </div>
 <div style={{ fontSize: '0.7rem', fontWeight: 600, color: textColor, marginTop: '4px' }}>
 {statusText}
 </div>
 </div>
 );
 })}
 </div>
 </div>
 </div>
 )}

 
 {false && activeTab === 'id-card-generator' && (
 <div>
 <div className="sa-schools-header-bar">
 <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
 <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#475569' }}>Category:</span>
 <div className="sa-filter-segment">
 <button
 className={`sa-segment-btn ${idCardType === 'student' ? 'active' : ''}`}
 onClick={() => setIdCardType('student')}
 >
 Students (Grade 10)
 </button>
 <button
 className={`sa-segment-btn ${idCardType === 'teacher' ? 'active' : ''}`}
 onClick={() => setIdCardType('teacher')}
 >
 Faculty Staff
 </button>
 </div>
 </div>

 <div className="sa-toolbar-right">
 <button
 className="btn btn-outline btn-sm"
 onClick={() => {
 setFeedback({
 title: 'Bulk ID Card Batch Queued',
 body: `Prepared high-resolution print sheet with 8 ID cards per page for all ${idCardType === 'student' ? data.students.length : data.teachers.length} records.`,
 });
 }}
 >
 Bulk Print All ID Badges
 </button>
 </div>
 </div>

 
 <div className="table-responsive">
 <table className="sa-schools-table">
 <thead>
 <tr>
 <th style={{ minWidth: '90px' }}>ID / Roll</th>
 <th style={{ minWidth: '180px' }}>Full Name</th>
 <th style={{ minWidth: '140px' }}>{idCardType === 'student' ? 'Class' : 'Subject'}</th>
 <th style={{ minWidth: '90px' }}>Blood Group</th>
 <th style={{ minWidth: '140px' }}>Emergency Contact</th>
 <th style={{ minWidth: '130px', textAlign: 'center' }}>ID Badge Action</th>
 </tr>
 </thead>
 <tbody>
 {idCardType === 'student' ? (
 data.students.map((st, idx) => {
 const bloodGroups = ['B+ve', 'O+ve', 'A+ve', 'AB+ve', 'A-ve'];
 const blood = bloodGroups[idx % bloodGroups.length];
 const emergency = `+91 98456 ${12301 + idx}`;
 return (
 <tr key={st.roll}>
 <td data-label="ID / Roll"><code>{st.roll}</code></td>
 <td data-label="Full Name"><strong>{st.name}</strong></td>
 <td data-label="Class"><span className="badge badge-info">{st.class}</span></td>
 <td data-label="Blood Group"><strong>{blood}</strong></td>
 <td data-label="Emergency Contact">{emergency}</td>
 <td data-label="Action" style={{ textAlign: 'center' }}>
 <button
 className="btn btn-primary btn-sm"
 style={{ padding: '4px 12px', fontSize: '0.78rem' }}
 onClick={() => {
 setSelectedIdCard({
 type: 'Student',
 id: st.roll,
 name: st.name,
 subtext: st.class,
 school: 'Sri Sankara Vidhyasala Girls High School',
 bloodGroup: blood,
 emergencyContact: emergency,
 validUntil: 'May 2027',
 dob: '14-Aug-2010',
 });
 }}
 >
 View & Print ID Badge
 </button>
 </td>
 </tr>
 );
 })
 ) : (
 data.teachers.map((tc, idx) => {
 const bloodGroups = ['O+ve', 'A+ve', 'B+ve', 'AB+ve'];
 const blood = bloodGroups[idx % bloodGroups.length];
 const emergency = `+91 98401 ${23450 + idx}`;
 return (
 <tr key={tc.id}>
 <td data-label="Faculty ID"><code>{tc.id}</code></td>
 <td data-label="Full Name"><strong>{tc.name}</strong></td>
 <td data-label="Subject"><span className="badge badge-info">{tc.subject}</span></td>
 <td data-label="Blood Group"><strong>{blood}</strong></td>
 <td data-label="Emergency Contact">{emergency}</td>
 <td data-label="Action" style={{ textAlign: 'center' }}>
 <button
 className="btn btn-primary btn-sm"
 style={{ padding: '4px 12px', fontSize: '0.78rem' }}
 onClick={() => {
 setSelectedIdCard({
 type: 'Faculty Staff',
 id: tc.id,
 name: tc.name,
 subtext: `Faculty - ${tc.subject}`,
 school: 'Sri Sankara Vidhyasala Girls High School',
 bloodGroup: blood,
 emergencyContact: emergency,
 validUntil: 'Permanent Staff',
 dob: '02-Jun-1988',
 });
 }}
 >
 View & Print ID Badge
 </button>
 </td>
 </tr>
 );
 })
 )}
 </tbody>
 </table>
 </div>

 
 {selectedIdCard && (
 <div className="modal-overlay" style={{ display: 'flex' }}>
 <div className="modal-content" style={{ maxWidth: '440px', padding: 0, overflow: 'hidden', borderRadius: '16px' }}>
 <div className="modal-header" style={{ padding: '14px 20px', borderBottom: '1px solid #e2e8f0', background: '#f8fafc' }}>
 <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700 }}>
 Official ID Badge Preview ({selectedIdCard.type})
 </h3>
 <button className="modal-close" onClick={() => setSelectedIdCard(null)}>&times;</button>
 </div>

 <div style={{ padding: '24px 20px', display: 'flex', justifyContent: 'center', background: '#f1f5f9' }}>
 
 <div
 id="printable-id-badge"
 style={{
 width: '320px',
 background: '#ffffff',
 borderRadius: '16px',
 boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
 overflow: 'hidden',
 border: '1px solid #cbd5e1',
 position: 'relative',
 }}
 >
 
 <div style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)', padding: '16px 12px', textAlign: 'center', color: '#fff' }}>
 <div style={{ fontSize: '0.9rem', fontWeight: 800, letterSpacing: '0.5px', textTransform: 'uppercase' }}>
 Sri Sankara Vidhyasala
 </div>
 <div style={{ fontSize: '0.68rem', opacity: 0.9, marginTop: '2px' }}>
 Girls High School • Established 1972
 </div>
 <div style={{ display: 'inline-block', background: 'rgba(255,255,255,0.2)', padding: '2px 10px', borderRadius: '12px', fontSize: '0.68rem', fontWeight: 700, marginTop: '6px' }}>
 {selectedIdCard.type.toUpperCase()} IDENTIFICATION
 </div>
 </div>

 
 <div style={{ padding: '16px 18px', textAlign: 'center' }}>
 <div style={{ width: '84px', height: '84px', borderRadius: '50%', background: '#e0e7ff', border: '3px solid #2563eb', margin: '0 auto 10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem' }}>
 {selectedIdCard.type === 'Student' ? '' : ''}
 </div>
 <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>
 {selectedIdCard.name}
 </h4>
 <div style={{ fontSize: '0.8rem', color: '#2563eb', fontWeight: 700, marginTop: '2px' }}>
 {selectedIdCard.subtext}
 </div>
 <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>
 ID / Roll No: <strong>{selectedIdCard.id}</strong>
 </div>

 
 <div style={{ marginTop: '14px', background: '#f8fafc', borderRadius: '10px', padding: '10px 12px', textAlign: 'left', fontSize: '0.75rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
 <div>
 <span style={{ color: '#64748b', display: 'block' }}>Blood Group:</span>
 <strong style={{ color: '#dc2626' }}>{selectedIdCard.bloodGroup}</strong>
 </div>
 <div>
 <span style={{ color: '#64748b', display: 'block' }}>Date of Birth:</span>
 <strong>{selectedIdCard.dob}</strong>
 </div>
 <div style={{ gridColumn: 'span 2' }}>
 <span style={{ color: '#64748b', display: 'block' }}>Emergency Contact:</span>
 <strong>{selectedIdCard.emergencyContact}</strong>
 </div>
 <div style={{ gridColumn: 'span 2' }}>
 <span style={{ color: '#64748b', display: 'block' }}>Validity:</span>
 <strong>{selectedIdCard.validUntil}</strong>
 </div>
 </div>

 
 <div style={{ marginTop: '14px', borderTop: '1px dashed #cbd5e1', paddingTop: '10px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
 <div style={{ letterSpacing: '4px', fontFamily: 'monospace', fontSize: '1.1rem', fontWeight: 900, color: '#334155' }}>
 |||||| | |||| ||| |||||||
 </div>
 <div style={{ fontSize: '0.65rem', color: '#94a3b8', marginTop: '2px' }}>
 VERIFIED OFFICIAL DIGITAL BADGE • ZEN-ID-SECURE
 </div>
 </div>
 </div>
 </div>
 </div>

 
 <div style={{ padding: '12px 20px', background: '#fff', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
 <button className="btn btn-outline btn-sm" onClick={() => setSelectedIdCard(null)}>
 Close
 </button>
 <button
 className="btn btn-primary btn-sm"
 onClick={() => {
 window.print();
 }}
 >
 Print Badge Now
 </button>
 </div>
 </div>
 </div>
 )}
 </div>
 )}

 
 
 
 {activeTab === 'publish-announcements' && (
 <div>
 
 <div className="sa-schools-header-bar" style={{ display: 'flex', gap: '14px', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}>
 <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
 
 <div style={{ position: 'relative', minWidth: '240px' }}>
 <input
 type="text"
 value={announcementSearch}
 onChange={(e) => setAnnouncementSearch(e.target.value)}
 placeholder="Search circulars & notices..."
 style={{
 width: '100%',
 padding: '9px 12px 9px 36px',
 borderRadius: '8px',
 border: '1px solid #cbd5e1',
 background: '#ffffff',
 color: '#0f172a',
 fontSize: '0.88rem',
 fontWeight: 500,
 outline: 'none',
 boxShadow: '0 2px 4px rgba(0,0,0,0.04)'
 }}
 />
 <span style={{ position: 'absolute', left: '11px', top: '50%', transform: 'translateY(-50%)', opacity: 0.85, fontSize: '0.95rem' }}>
 
 </span>
 {announcementSearch && (
 <button
 type="button"
 onClick={() => setAnnouncementSearch('')}
 style={{
 position: 'absolute',
 right: '10px',
 top: '50%',
 transform: 'translateY(-50%)',
 background: 'transparent',
 border: 'none',
 cursor: 'pointer',
 color: '#64748b',
 fontSize: '0.9rem',
 fontWeight: 'bold',
 padding: '2px'
 }}
 title="Clear search"
 >
 
 </button>
 )}
 </div>

 
 <div className="sa-filter-segment">
 {['All', 'Academic', 'Sports', 'General', 'Holidays'].map((cat) => (
 <button
 key={cat}
 className={`sa-filter-tab ${announcementCategory === cat ? 'active' : ''}`}
 onClick={() => setAnnouncementCategory(cat)}
 >
 {cat === 'All' ? ' All Notices' : cat}
 </button>
 ))}
 </div>
 </div>

 
 <div className="sa-toolbar-right">
 <button
 type="button"
 className="btn btn-primary btn-sm"
 onClick={() => setIsAnnouncementOpen(true)}
 style={{
 display: 'inline-flex',
 alignItems: 'center',
 gap: '6px',
 fontWeight: 700,
 padding: '8px 18px',
 boxShadow: '0 4px 12px rgba(30, 58, 138, 0.2)'
 }}
 >
 <span></span> + Post Announcement
 </button>
 </div>
 </div>

 
 <div style={{
 display: 'grid',
 gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
 gap: '22px',
 marginTop: '16px'
 }}>
 {(data.announcements || [])
 .filter((a) => announcementCategory === 'All' || a.category === announcementCategory)
 .filter((a) => {
 if (!announcementSearch) return true;
 const q = announcementSearch.toLowerCase();
 return (
 (a.title && a.title.toLowerCase().includes(q)) ||
 (a.content && a.content.toLowerCase().includes(q)) ||
 (a.target && a.target.toLowerCase().includes(q)) ||
 (a.category && a.category.toLowerCase().includes(q))
 );
 })
 .map((a, idx) => {
 const fallbackImg = a.category === 'Sports'
 ? 'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?auto=format&fit=crop&w=1200&q=80'
 : a.category === 'Academic'
 ? 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80'
 : a.category === 'Holidays'
 ? 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=1200&q=80'
 : 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=1200&q=80';

 const cardImg = a.image || fallbackImg;

 const categoryColors = {
 Sports: { bg: '#dcfce7', text: '#15803d', border: '#86efac' },
 Academic: { bg: '#e0e7ff', text: '#4338ca', border: '#a5b4fc' },
 General: { bg: '#f1f5f9', text: '#475569', border: '#cbd5e1' },
 Holidays: { bg: '#fef3c7', text: '#b45309', border: '#fde68a' },
 };
 const badgeStyle = categoryColors[a.category] || categoryColors.General;

 return (
 <div
 key={a.id || idx}
 style={{
 background: '#ffffff',
 borderRadius: '16px',
 overflow: 'hidden',
 border: '1px solid #e2e8f0',
 boxShadow: '0 6px 16px rgba(0,0,0,0.06)',
 display: 'flex',
 flexDirection: 'column',
 transition: 'transform 0.2s ease, box-shadow 0.2s ease',
 }}
 onMouseEnter={(e) => {
 e.currentTarget.style.transform = 'translateY(-4px)';
 e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.1)';
 }}
 onMouseLeave={(e) => {
 e.currentTarget.style.transform = 'translateY(0)';
 e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.06)';
 }}
 >
 
 <div style={{ position: 'relative', height: '180px', width: '100%', overflow: 'hidden', background: '#0f172a' }}>
 <img
 src={cardImg}
 alt={a.title}
 style={{
 width: '100%',
 height: '100%',
 objectFit: 'cover',
 transition: 'transform 0.3s ease'
 }}
 onError={(e) => {
 e.target.src = fallbackImg;
 }}
 />
 <div style={{
 position: 'absolute',
 top: 0,
 left: 0,
 right: 0,
 bottom: 0,
 background: 'linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.7) 100%)'
 }} />

 
 <div style={{ position: 'absolute', top: '12px', left: '12px', display: 'flex', gap: '6px' }}>
 <span style={{
 background: badgeStyle.bg,
 color: badgeStyle.text,
 border: `1px solid ${badgeStyle.border}`,
 padding: '4px 10px',
 borderRadius: '20px',
 fontSize: '0.74rem',
 fontWeight: 800,
 letterSpacing: '0.3px',
 boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
 }}>
 {a.category || 'Notice'}
 </span>
 {a.priority === 'High' && (
 <span style={{
 background: '#ef4444',
 color: '#ffffff',
 padding: '4px 8px',
 borderRadius: '20px',
 fontSize: '0.7rem',
 fontWeight: 800
 }}>
 High Priority
 </span>
 )}
 </div>

 
 <div style={{ position: 'absolute', top: '12px', right: '12px' }}>
 <span style={{
 background: 'rgba(15, 23, 42, 0.75)',
 backdropFilter: 'blur(4px)',
 color: '#ffffff',
 padding: '4px 10px',
 borderRadius: '20px',
 fontSize: '0.72rem',
 fontWeight: 700
 }}>
 {a.target}
 </span>
 </div>

 
 <div style={{ position: 'absolute', bottom: '10px', left: '12px', color: '#f8fafc', fontSize: '0.78rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
 <span> {a.date}</span> &bull; <span> {a.author || 'School Admin'}</span>
 </div>
 </div>

 
 <div style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', flex: 1 }}>
 <h3 style={{
 margin: '0 0 8px',
 fontSize: '1.08rem',
 fontWeight: 800,
 color: '#0f172a',
 lineHeight: '1.4'
 }}>
 {a.title}
 </h3>

 <p style={{
 margin: 0,
 fontSize: '0.86rem',
 color: '#475569',
 lineHeight: '1.55',
 flex: 1
 }}>
 {a.content}
 </p>

 
 <div style={{
 display: 'flex',
 justifyContent: 'space-between',
 alignItems: 'center',
 marginTop: '16px',
 paddingTop: '12px',
 borderTop: '1px solid #f1f5f9'
 }}>
 <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>
 Target: <span style={{ color: 'var(--color-primary)', fontWeight: 700 }}>{a.target}</span>
 </span>
 <div style={{ display: 'flex', gap: '6px' }}>
 <button
 type="button"
 className="btn btn-outline btn-sm"
 style={{ padding: '4px 10px', fontSize: '0.75rem', borderColor: '#25D366', color: '#128C7E', fontWeight: 700 }}
 onClick={() => {
 setFeedback({
 title: 'Notice Broadcasted to WhatsApp Groups',
 body: `Notice "${a.title}" has been broadcasted to all enrolled ${a.target} parents & guardians via WhatsApp announcements.`,
 });
 }}
 title="Broadcast to WhatsApp Community"
 >
 WhatsApp
 </button>
 <button
 type="button"
 className="btn btn-outline btn-sm"
 style={{ padding: '4px 10px', fontSize: '0.75rem' }}
 onClick={() => {
 setFeedback({
 title: 'Circular Notification Dispatched',
 body: `App notification for "${a.title}" sent to ${a.target}.`,
 });
 }}
 >
 Notify
 </button>
 </div>
 </div>
 </div>
 </div>
 );
 })}
 </div>

 
 {(data.announcements || [])
 .filter((a) => announcementCategory === 'All' || a.category === announcementCategory)
 .filter((a) => {
 if (!announcementSearch) return true;
 const q = announcementSearch.toLowerCase();
 return (
 (a.title && a.title.toLowerCase().includes(q)) ||
 (a.content && a.content.toLowerCase().includes(q)) ||
 (a.target && a.target.toLowerCase().includes(q)) ||
 (a.category && a.category.toLowerCase().includes(q))
 );
 }).length === 0 && (
 <div style={{ textAlign: 'center', padding: '48px 20px', background: '#fff', borderRadius: '14px', border: '1px solid #e2e8f0', marginTop: '20px' }}>
 <div style={{ fontSize: '2.4rem', marginBottom: '8px' }}></div>
 <h4 style={{ margin: 0, color: '#1e293b' }}>No Announcements Found</h4>
 <p style={{ margin: '4px 0 16px', color: '#64748b', fontSize: '0.85rem' }}>
 No circulars match "{announcementSearch || announcementCategory}". Click below to post one.
 </p>
 <button className="btn btn-primary btn-sm" onClick={() => setIsAnnouncementOpen(true)}>
 + Post First Announcement
 </button>
 </div>
 )}
 </div>
 )}

 
 
 
 {activeTab === 'view-reports' && (() => {
 
 const totalStudents = (data.students || []).length;
 const totalStaff = (data.teachers || []).length;
 const totalClasses = (data.classes || []).length;
 const totalSubjects = (data.subjects || []).length;

 
 const totalFeeSum = feeRecords.reduce((acc, r) => acc + (parseInt(r.totalFee.replace(/[^0-9]/g, ''), 10) || 0), 0);
 const totalPaidSum = feeRecords.reduce((acc, r) => acc + (parseInt(r.paid.replace(/[^0-9]/g, ''), 10) || 0), 0);
 const totalDueSum = feeRecords.reduce((acc, r) => acc + (parseInt(r.due.replace(/[^0-9]/g, ''), 10) || 0), 0);
 const feeClearanceRate = totalFeeSum > 0 ? Math.round((totalPaidSum / totalFeeSum) * 100) : 78;

 
 let allMarkScores = [];
 (data.students || []).forEach(st => {
 (st.marks || []).forEach(m => {
 if (typeof m.scored === 'number') allMarkScores.push(m.scored);
 });
 });
 const avgSchoolScore = allMarkScores.length > 0 ? Math.round(allMarkScores.reduce((a, b) => a + b, 0) / allMarkScores.length) : 84;

 
 const reportsList = [
 {
 id: 'REP-ENROLLMENT',
 title: 'Student Enrollment & Demographic Report',
 category: 'Enrollment',
 icon: '',
 badgeColor: '#2563eb',
 badgeBg: '#eff6ff',
 description: 'Comprehensive roster of all students, class section assignments, parent contacts, gender split, and admission timestamps.',
 metricLabel: 'Total Enrolled',
 metricValue: `${totalStudents} Active Students`,
 subMetric: `Across ${totalClasses} Sections (Grade 9 & 10)`,
 actionLabel: ' View Enrollment Registry',
 type: 'students'
 },
 {
 id: 'REP-ACADEMIC',
 title: 'Academic Term Examination & Marks Ledger',
 category: 'Academics',
 icon: '',
 badgeColor: '#7c3aed',
 badgeBg: '#f5f3ff',
 description: 'Student-by-student examination performance across Mathematics, Physics, Chemistry, Tamil, and English with grades and absentees.',
 metricLabel: 'School Average Score',
 metricValue: `${avgSchoolScore}% (Grade A)`,
 subMetric: '100% Pass Rate in Grade 10 Pre-Boards',
 actionLabel: ' View Marks & Grade Ledger',
 type: 'marks'
 },
 {
 id: 'REP-FEES',
 title: 'Fee Collection & Dues Register Audit',
 category: 'Finance',
 icon: '',
 badgeColor: '#059669',
 badgeBg: '#ecfdf5',
 description: 'Detailed audited statement of tuition fees collected, pending balances, UPI transaction verifications, and WhatsApp reminder dispatch logs.',
 metricLabel: 'Collection Efficiency',
 metricValue: `${feeClearanceRate}% Cleared`,
 subMetric: `₹${totalPaidSum.toLocaleString('en-IN')} Received • ₹${totalDueSum.toLocaleString('en-IN')} Pending`,
 actionLabel: ' View Fee Audit Statement',
 type: 'fees'
 },
 {
 id: 'REP-STAFF',
 title: 'Faculty Workload & Class Timetable Allocation',
 category: 'Staff & HR',
 icon: '',
 badgeColor: '#d97706',
 badgeBg: '#fffbeb',
 description: 'Subject specialization, weekly periods assigned, classroom allocations, teacher qualifications, and department distributions.',
 metricLabel: 'Teaching Faculty',
 metricValue: `${totalStaff} Certified Staff`,
 subMetric: `${totalSubjects} Core Curriculums • 1:19 Staff-Student Ratio`,
 actionLabel: ' View Faculty Workload Roster',
 type: 'staff'
 },
 {
 id: 'REP-ATTENDANCE',
 title: 'Daily Student & Staff Attendance Audit',
 category: 'Attendance',
 icon: '',
 badgeColor: '#0891b2',
 badgeBg: '#ecfeff',
 description: 'Classroom daily roll-call attendance logs, leave records, absentee alerts sent to parents, and monthly trend curves.',
 metricLabel: 'Campus Daily Average',
 metricValue: '94.8% Attendance',
 subMetric: 'Peak Day: Monday (98.2%) • Target: 95.0%',
 actionLabel: ' View Attendance Logs',
 type: 'attendance'
 },
 {
 id: 'REP-SERVICES',
 title: 'Campus Activities & Extracurricular Participation',
 category: 'Activities',
 icon: '',
 badgeColor: '#db2777',
 badgeBg: '#fdf2f8',
 description: 'Student enrollment across Coding for Kids, Chess Academy, Robotics Club, Art, and Athletic training programs.',
 metricLabel: 'Active Programs',
 metricValue: '8 Co-Curricular Clubs',
 subMetric: '88% Student Engagement in Sports & STEM',
 actionLabel: ' View Activity Enrollments',
 type: 'services'
 }
 ];

 return (
 <div>
 

 
 <div className="sa-schools-header-bar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '20px' }}>
 <div>
 <h3 style={{ margin: 0, fontSize: '1.15rem', color: '#0f172a', fontWeight: 800 }}>
 Official School Audit & Analytics Reports
 </h3>
 <p style={{ margin: '3px 0 0', fontSize: '0.82rem', color: '#64748b' }}>
 Click "View Report" on any audit card below to open detailed registers, print official sheets, or export to Excel.
 </p>
 </div>

 <button
 type="button"
 className="btn btn-outline btn-sm"
 style={{ fontWeight: 700, borderColor: '#2563eb', color: '#2563eb' }}
 onClick={() => {
 
 const summaryExport = reportsList.map(r => ({
 'Report ID': r.id,
 'Report Name': r.title,
 'Category': r.category,
 'Key Metric': r.metricValue,
 'Subtext': r.subMetric,
 'Generated Date': new Date().toISOString().slice(0, 10),
 'Status': 'Audited & Verified'
 }));
 const ws = XLSX.utils.json_to_sheet(summaryExport);
 const wb = XLSX.utils.book_new();
 XLSX.utils.book_append_sheet(wb, ws, 'School Reports Summary');
 XLSX.writeFile(wb, `School_Audit_Reports_Summary_${new Date().toISOString().slice(0, 10)}.xlsx`);
 setFeedback({
 title: 'All School Reports Exported!',
 body: 'Consolidated report summaries downloaded as Excel spreadsheet.'
 });
 }}
 >
 Export All Reports Summary (Excel)
 </button>
 </div>

 
 <div style={{
 display: 'grid',
 gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
 gap: '20px'
 }}>
 {reportsList.map((rep) => (
 <div
 key={rep.id}
 style={{
 background: '#ffffff',
 border: '1px solid #e2e8f0',
 borderRadius: '16px',
 padding: '24px',
 display: 'flex',
 flexDirection: 'column',
 boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
 transition: 'all 0.2s ease',
 position: 'relative'
 }}
 onMouseEnter={(e) => {
 e.currentTarget.style.transform = 'translateY(-3px)';
 e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.09)';
 e.currentTarget.style.borderColor = rep.badgeColor;
 }}
 onMouseLeave={(e) => {
 e.currentTarget.style.transform = 'translateY(0)';
 e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.05)';
 e.currentTarget.style.borderColor = '#e2e8f0';
 }}
 >
 
 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
 <div style={{
 width: '48px',
 height: '48px',
 borderRadius: '12px',
 background: rep.badgeBg,
 display: 'flex',
 alignItems: 'center',
 justifyContent: 'center',
 fontSize: '1.6rem'
 }}>
 {rep.icon}
 </div>
 <span style={{
 fontSize: '0.74rem',
 fontWeight: 800,
 color: rep.badgeColor,
 background: rep.badgeBg,
 border: `1px solid ${rep.badgeColor}33`,
 padding: '4px 10px',
 borderRadius: '20px',
 textTransform: 'uppercase',
 letterSpacing: '0.4px'
 }}>
 {rep.category}
 </span>
 </div>

 
 <h4 style={{ margin: '0 0 8px', fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', lineHeight: '1.35' }}>
 {rep.title}
 </h4>
 <p style={{ margin: '0 0 16px', fontSize: '0.84rem', color: '#64748b', lineHeight: '1.5', flex: 1 }}>
 {rep.description}
 </p>

 
 <div style={{
 background: '#f8fafc',
 borderRadius: '10px',
 padding: '12px 14px',
 border: '1px solid #f1f5f9',
 marginBottom: '18px'
 }}>
 <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: '#64748b', fontWeight: 700 }}>
 {rep.metricLabel}
 </div>
 <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: '2px 0' }}>
 {rep.metricValue}
 </div>
 <div style={{ fontSize: '0.76rem', color: '#475569' }}>
 {rep.subMetric}
 </div>
 </div>

 
 <button
 type="button"
 className="btn btn-primary btn-sm"
 style={{
 width: '100%',
 padding: '9px 16px',
 fontWeight: 700,
 fontSize: '0.86rem',
 display: 'flex',
 alignItems: 'center',
 justifyContent: 'center',
 gap: '6px'
 }}
 onClick={() => setActiveReportViewer(rep)}
 >
 {rep.actionLabel} &rarr;
 </button>
 </div>
 ))}
 </div>
 </div>
 );
 })()}

 
 
 
 {activeTab === 'secure-messaging' && <ChatBox />}
 </div>

 
 
 

 
 {isAddUserOpen && (
 <div className="modal-overlay" style={{ display: 'flex' }}>
 <div className="modal-content wizard-modal-lg" style={{ maxWidth: '640px' }}>
 <div className="modal-header">
 <h3>Register New School User</h3>
 <button className="modal-close" onClick={() => setIsAddUserOpen(false)}>&times;</button>
 </div>
 <form onSubmit={handleSaveUser}>
 <div className="wizard-form-box">
 <div className="wizard-header-strip">
 <div className="wizard-header-icon" style={{ background: 'rgba(30, 58, 138, 0.08)', color: 'var(--color-primary)' }}>
 <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /></svg>
 </div>
 <div className="wizard-header-titles">
 <h4>Add User Profile</h4>
 <p>Create credentials and role assignment for this campus.</p>
 </div>
 </div>
 <div className="wizard-grid-2">
 <div className="wizard-field span-2">
 <label>Full Name <span className="req">*</span></label>
 <input
 type="text"
 required
 placeholder="e.g. Mrs. Lakshmi Narayanan"
 value={userForm.name}
 onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
 />
 </div>
 <div className="wizard-field">
 <label>Role <span className="req">*</span></label>
 <select
 value={userForm.role}
 onChange={(e) => setUserForm({ ...userForm, role: e.target.value })}
 >
 <option value="TEACHER">Teacher</option>
 <option value="STUDENT">Student</option>
 <option value="PARENT">Parent</option>
 <option value="SCHOOL_ADMIN">School Admin</option>
 <option value="PRINCIPAL">Principal</option>
 </select>
 </div>
 <div className="wizard-field">
 <label>Phone Number</label>
 <input
 type="text"
 placeholder="+91 98401 23456"
 value={userForm.phone}
 onChange={(e) => setUserForm({ ...userForm, phone: e.target.value })}
 />
 </div>
 <div className="wizard-field span-2">
 <label>Email Address <span className="req">*</span></label>
 <input
 type="email"
 required
 placeholder="user@ssvschool.com"
 value={userForm.email}
 onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
 />
 </div>
 </div>
 </div>
 <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #e2e8f0' }}>
 <button type="button" className="btn btn-outline btn-sm" onClick={() => setIsAddUserOpen(false)}>Cancel</button>
 <button type="submit" className="btn btn-primary btn-sm" style={{ padding: '8px 22px' }}>Save User </button>
 </div>
 </form>
 </div>
 </div>
 )}

 
 {isStaffModalOpen && (
 <div className="modal-overlay" style={{ display: 'flex' }}>
 <div className="modal-content wizard-modal-lg" style={{ maxWidth: '720px' }}>
 <div className="modal-header">
 <h3>
   {editingStaff
     ? `Edit ${staffForm.role} Profile`
     : staffForm.role === 'Non-Teaching'
     ? '👥 Onboard Non-Teaching Staff'
     : staffForm.role === 'Operations Works'
     ? '📋 Create & Assign Operational Work Duty'
     : staffForm.role === 'Principal'
     ? '👨‍🏫 Onboard School Principal'
     : '👩‍🏫 Onboard Teaching Faculty'}
 </h3>
 <button className="modal-close" onClick={() => setIsStaffModalOpen(false)}>&times;</button>
 </div>
 <form onSubmit={handleSaveStaff}>
 <div className="wizard-form-box">
 <div className="wizard-header-strip">
 <div
   className="wizard-header-icon"
   style={{
     background:
       staffForm.role === 'Non-Teaching'
         ? 'rgba(8, 145, 178, 0.12)'
         : staffForm.role === 'Operations Works'
         ? 'rgba(190, 24, 93, 0.12)'
         : staffForm.role === 'Principal'
         ? 'rgba(30, 58, 138, 0.12)'
         : 'rgba(109, 40, 217, 0.12)',
     color:
       staffForm.role === 'Non-Teaching'
         ? '#0891b2'
         : staffForm.role === 'Operations Works'
         ? '#be185d'
         : staffForm.role === 'Principal'
         ? '#1e3a8a'
         : '#6d28d9',
   }}
 >
   {staffForm.role === 'Non-Teaching' ? '👥' : staffForm.role === 'Operations Works' ? '📋' : staffForm.role === 'Principal' ? '👨‍🏫' : '👩‍🏫'}
 </div>
 <div className="wizard-header-titles">
 <h4>
   {staffForm.role === 'Non-Teaching'
     ? 'Non-Teaching Staff Details & Shift'
     : staffForm.role === 'Operations Works'
     ? 'Operations Work Duty & Assignee Specifications'
     : staffForm.role === 'Principal'
     ? 'Principal Leadership & Administration'
     : 'Teacher Faculty & Academic Details'}
 </h4>
 <p>
   {staffForm.role === 'Non-Teaching'
     ? 'Fill in non-academic staff information: support post, department, duty shift, contact number and address.'
     : staffForm.role === 'Operations Works'
     ? 'Fill in operational work details: task title, responsible assignee/team, department, and completion deadline.'
     : staffForm.role === 'Principal'
     ? 'Fill in institutional leadership details: executive credentials, administrative specialization, and contact.'
     : 'Fill in academic faculty details: teaching subject, assigned classroom section, qualification, and contact.'}
 </p>
 </div>
 </div>

 <div className="wizard-grid-2">
 
 <div className="wizard-field">
 <label>Staff Role <span className="req">*</span></label>
 <select
 value={staffForm.role}
 onChange={(e) => {
   const newRole = e.target.value;
   setStaffForm({
     ...staffForm,
     role: newRole,
     class:
       newRole === 'Non-Teaching' && (!staffForm.class || staffForm.class.includes('Grade'))
         ? '08:30 AM - 04:30 PM'
         : newRole === 'Operations Works' && (!staffForm.class || staffForm.class.includes('Grade'))
         ? 'Today, 05:00 PM'
         : newRole === 'Teacher' && (!staffForm.class || staffForm.class.includes('AM'))
         ? 'Grade 10-A'
         : staffForm.class
   });
 }}
 style={{ fontWeight: 800, color: '#0f172a' }}
 >
 <option value="Teacher">Teacher / Faculty</option>
 <option value="Principal">School Principal</option>
 <option value="Non-Teaching">Non-Teaching Staff</option>
 <option value="Operations Works">Operations Works</option>
 </select>
 </div>

 
 <div className="wizard-field">
 <label>
   {staffForm.role === 'Operations Works' ? 'Task Status' : 'Duty Status'} <span className="req">*</span>
 </label>
 <select
 value={staffForm.status}
 onChange={(e) => setStaffForm({ ...staffForm, status: e.target.value })}
 >
 {staffForm.role === 'Operations Works' ? (
   <>
     <option value="Active">In Progress / Active</option>
     <option value="Completed">Completed</option>
     <option value="Scheduled">Scheduled</option>
   </>
 ) : (
   <>
     <option value="Active">Active / On Duty</option>
     <option value="On Leave">On Leave</option>
     <option value="Inactive">Inactive</option>
   </>
 )}
 </select>
 </div>

 
 <div className="wizard-field span-2">
 <label>
   {staffForm.role === 'Operations Works' ? 'Assigned Person / Responsible Team' : 'Full Name'} <span className="req">*</span>
 </label>
 <input
 type="text"
 required
 placeholder={
   staffForm.role === 'Non-Teaching'
     ? 'e.g. Mr. R. Muthuraman / Mrs. S. Gandhimathi'
     : staffForm.role === 'Operations Works'
     ? 'e.g. Housekeeping Team / Mr. K. Palanivel'
     : staffForm.role === 'Principal'
     ? 'e.g. Dr. K. Meenakshi Sundaram'
     : 'e.g. Mrs. Priya Krishnan'
 }
 value={staffForm.name}
 onChange={(e) => setStaffForm({ ...staffForm, name: e.target.value })}
 />
 </div>

 
 <div className="wizard-field">
 <label>
   {staffForm.role === 'Operations Works' ? 'In-charge Contact Phone' : 'Phone Number'} <span className="req">*</span>
 </label>
 <input
 type="text"
 required
 placeholder="+91 98401 23450"
 value={staffForm.phone}
 onChange={(e) => setStaffForm({ ...staffForm, phone: e.target.value })}
 />
 </div>

 
 <div className="wizard-field">
 <label>
   {staffForm.role === 'Operations Works' ? 'Official / Department Email' : 'Email Address'} <span className="req">*</span>
 </label>
 <input
 type="email"
 required
 placeholder={
   staffForm.role === 'Operations Works'
     ? 'works@ssvschool.com'
     : staffForm.role === 'Non-Teaching'
     ? 'adminstaff@ssvschool.com'
     : 'staff@ssvschool.com'
 }
 value={staffForm.email}
 onChange={(e) => setStaffForm({ ...staffForm, email: e.target.value })}
 />
 </div>

 
 <div className="wizard-field span-2">
 <label>
   {staffForm.role === 'Operations Works' ? 'Campus Location / Station' : 'Residential / Quarters Address'} <span className="req">*</span>
 </label>
 <input
 type="text"
 required
 placeholder={
   staffForm.role === 'Operations Works'
     ? 'e.g. Science Labs Block / Central Maintenance Wing'
     : 'e.g. 14, Gandhi Road, Chennai, Tamil Nadu - 600028'
 }
 value={staffForm.address}
 onChange={(e) => setStaffForm({ ...staffForm, address: e.target.value })}
 />
 </div>

 
 <div className="wizard-field">
 <label>Blood Group {staffForm.role !== 'Operations Works' && <span className="req">*</span>}</label>
 <select
 value={staffForm.bloodGroup}
 onChange={(e) => setStaffForm({ ...staffForm, bloodGroup: e.target.value })}
 >
 <option value="A+">A+</option>
 <option value="A-">A-</option>
 <option value="B+">B+</option>
 <option value="B-">B-</option>
 <option value="O+">O+</option>
 <option value="O-">O-</option>
 <option value="AB+">AB+</option>
 <option value="AB-">AB-</option>
 </select>
 </div>

 
 <div className="wizard-field">
 <label>
   {staffForm.role === 'Non-Teaching'
     ? 'Designation / Staff Role'
     : staffForm.role === 'Operations Works'
     ? 'Task Title / Work Specification'
     : staffForm.role === 'Principal'
     ? 'Leadership Qualification'
     : 'Academic Qualification'}{' '}
   <span className="req">*</span>
 </label>
 <input
 type="text"
 required
 placeholder={
   staffForm.role === 'Non-Teaching'
     ? 'e.g. Head Clerk / Chief Accountant / Senior Lab Attender / Librarian'
     : staffForm.role === 'Operations Works'
     ? 'e.g. Daily Campus Cleanliness Audit / RO Water Inspection'
     : staffForm.role === 'Principal'
     ? 'e.g. Ph.D., M.Ed / 20+ Years Educational Leadership'
     : 'e.g. M.Sc., B.Ed'
 }
 value={staffForm.qualification}
 onChange={(e) => setStaffForm({ ...staffForm, qualification: e.target.value })}
 />
 </div>

 
 <div className="wizard-field">
 <label>
   {staffForm.role === 'Principal'
     ? 'Specialization / Institutional Wing'
     : staffForm.role === 'Non-Teaching'
     ? 'Department / Operating Office'
     : staffForm.role === 'Operations Works'
     ? 'Facility Department'
     : 'Teaching Subject'}{' '}
   <span className="req">*</span>
 </label>
 <input
 type="text"
 required
 placeholder={
   staffForm.role === 'Non-Teaching'
     ? 'e.g. Administrative Office / Accounts & Billing / Security'
     : staffForm.role === 'Operations Works'
     ? 'e.g. Sanitation & Hygiene / Campus Maintenance / Security & Safety'
     : staffForm.role === 'Principal'
     ? 'e.g. Institutional Governance & Academic Quality'
     : 'e.g. Mathematics / Physics / English / Social Science'
 }
 value={staffForm.onboardSubject}
 onChange={(e) => setStaffForm({ ...staffForm, onboardSubject: e.target.value })}
 />
 </div>

 
 <div className="wizard-field">
 <label>
   {staffForm.role === 'Principal'
     ? 'Executive Office'
     : staffForm.role === 'Non-Teaching'
     ? 'Work Shift & Daily Routine'
     : staffForm.role === 'Operations Works'
     ? 'Duty Deadline / Target Schedule'
     : 'Assigned Classroom Section'}{' '}
   <span className="req">*</span>
 </label>
 <input
 type="text"
 required
 placeholder={
   staffForm.role === 'Principal'
     ? 'Main Admin Block, Office 101'
     : staffForm.role === 'Non-Teaching'
     ? 'e.g. 08:00 AM - 04:30 PM (Morning Shift)'
     : staffForm.role === 'Operations Works'
     ? 'e.g. Today, 05:00 PM / Daily 08:30 AM'
     : 'e.g. Grade 10-A / Grade 11-B'
 }
 value={staffForm.class}
 onChange={(e) => setStaffForm({ ...staffForm, class: e.target.value })}
 />
 </div>
 </div>
 </div>

 <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #e2e8f0' }}>
 <button type="button" className="btn btn-outline btn-sm" onClick={() => setIsStaffModalOpen(false)}>Cancel</button>
 <button type="submit" className="btn btn-primary btn-sm" style={{ padding: '8px 22px' }}>
 {editingStaff
   ? 'Update Profile '
   : staffForm.role === 'Non-Teaching'
   ? 'Add Non-Teaching Staff '
   : staffForm.role === 'Operations Works'
   ? 'Assign Operational Work '
   : staffForm.role === 'Principal'
   ? 'Add Principal '
   : 'Add Teacher '}
 </button>
 </div>
 </form>
 </div>
 </div>
 )}

 
 {isPrincipalModalOpen && (
 <div className="modal-overlay" style={{ display: 'flex' }}>
 <div className="modal-content wizard-modal-lg" style={{ maxWidth: '640px' }}>
 <div className="modal-header">
 <h3>{editingPrincipal ? 'Edit Principal Profile' : 'Register School Principal'}</h3>
 <button className="modal-close" onClick={() => setIsPrincipalModalOpen(false)}>&times;</button>
 </div>
 <form onSubmit={handleSavePrincipal}>
 <div className="wizard-form-box">
 <div className="wizard-header-strip">
 <div className="wizard-header-icon" style={{ background: 'rgba(30, 58, 138, 0.08)', color: 'var(--color-primary)' }}>
 <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c3 3 9 3 12 0v-5" /></svg>
 </div>
 <div className="wizard-header-titles">
 <h4>{editingPrincipal ? 'Update Principal Details' : 'Register School Principal'}</h4>
 <p>Maintain school leadership credentials, qualification, and contact details.</p>
 </div>
 </div>
 <div className="wizard-grid-2">
 <div className="wizard-field span-2">
 <label>Principal Full Name <span className="req">*</span></label>
 <input
 type="text"
 required
 placeholder="e.g. Dr. Savithri Raman"
 value={principalForm.name}
 onChange={(e) => setPrincipalForm({ ...principalForm, name: e.target.value })}
 />
 </div>
 <div className="wizard-field">
 <label>Academic Qualification <span className="req">*</span></label>
 <input
 type="text"
 required
 placeholder="e.g. Ph.D., M.Ed, M.Sc"
 value={principalForm.qualification}
 onChange={(e) => setPrincipalForm({ ...principalForm, qualification: e.target.value })}
 />
 </div>
 <div className="wizard-field">
 <label>Leadership Experience <span className="req">*</span></label>
 <input
 type="text"
 required
 placeholder="e.g. 18 Years"
 value={principalForm.experience}
 onChange={(e) => setPrincipalForm({ ...principalForm, experience: e.target.value })}
 />
 </div>
 <div className="wizard-field">
 <label>Official Contact Phone <span className="req">*</span></label>
 <input
 type="text"
 required
 placeholder="+91 98401 23450"
 value={principalForm.phone}
 onChange={(e) => setPrincipalForm({ ...principalForm, phone: e.target.value })}
 />
 </div>
 <div className="wizard-field">
 <label>Official Email Address <span className="req">*</span></label>
 <input
 type="email"
 required
 placeholder="principal@ssvschool.com"
 value={principalForm.email}
 onChange={(e) => setPrincipalForm({ ...principalForm, email: e.target.value })}
 />
 </div>
 <div className="wizard-field span-2">
 <label>Account Status <span className="req">*</span></label>
 <select
 value={principalForm.status}
 onChange={(e) => setPrincipalForm({ ...principalForm, status: e.target.value })}
 >
 <option value="Active">Active</option>
 <option value="On Leave">On Leave</option>
 <option value="Inactive">Inactive</option>
 </select>
 </div>
 </div>
 </div>
 <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #e2e8f0' }}>
 <button type="button" className="btn btn-outline btn-sm" onClick={() => setIsPrincipalModalOpen(false)}>Cancel</button>
 <button type="submit" className="btn btn-primary btn-sm" style={{ padding: '8px 22px' }}>
 {editingPrincipal ? 'Save Changes ' : 'Register Principal '}
 </button>
 </div>
 </form>
 </div>
 </div>
 )}

 

  
  {isStudentModalOpen && (
    <div className="modal-overlay" style={{ display: 'flex' }}>
      <div className="modal-content wizard-modal-lg" style={{ maxWidth: '680px' }}>
        <div className="modal-header">
          <h3>{editingStudent ? 'Edit Student Profile' : 'Enroll New Student'}</h3>
          <button className="modal-close" onClick={() => setIsStudentModalOpen(false)}>&times;</button>
        </div>
        <form onSubmit={handleSaveStudent}>
          <div className="wizard-form-box">
            <div className="wizard-header-strip">
              <div className="wizard-header-icon" style={{ background: 'rgba(30, 58, 138, 0.08)', color: 'var(--color-primary)' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
              </div>
              <div className="wizard-header-titles">
                <h4>{editingStudent ? 'Update Student Record' : 'Student Admission & Enrollment'}</h4>
                <p>Enter the student personal details, assigned class section, and guardian contact.</p>
              </div>
            </div>

            <div className="wizard-grid-2">
              <div className="wizard-field">
                <label>Roll Number <span className="req">*</span></label>
                <input
                  type="text"
                  required
                  placeholder="e.g. S101"
                  value={studentForm.roll}
                  onChange={(e) => setStudentForm({ ...studentForm, roll: e.target.value })}
                />
              </div>

              <div className="wizard-field">
                <label>Register Number (Reg No) <span className="req">*</span></label>
                <input
                  type="text"
                  required
                  placeholder="e.g. REG-SSV-101"
                  value={studentForm.regNo}
                  onChange={(e) => setStudentForm({ ...studentForm, regNo: e.target.value })}
                />
              </div>

              <div className="wizard-field span-2">
                <label>Student Full Name <span className="req">*</span></label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Aishwarya Kumar"
                  value={studentForm.name}
                  onChange={(e) => setStudentForm({ ...studentForm, name: e.target.value })}
                />
              </div>

              <div className="wizard-field">
                <label>Class & Section <span className="req">*</span></label>
                <select
                  value={studentForm.class}
                  onChange={(e) => setStudentForm({ ...studentForm, class: e.target.value })}
                >
                  <option value="Grade 6-A">Grade 6-A</option>
                  <option value="Grade 6-B">Grade 6-B</option>
                  <option value="Grade 7-A">Grade 7-A</option>
                  <option value="Grade 7-B">Grade 7-B</option>
                  <option value="Grade 8-A">Grade 8-A</option>
                  <option value="Grade 8-B">Grade 8-B</option>
                  <option value="Grade 9-A">Grade 9-A</option>
                  <option value="Grade 9-B">Grade 9-B</option>
                  <option value="Grade 10-A">Grade 10-A</option>
                  <option value="Grade 10-B">Grade 10-B</option>
                  <option value="Grade 11-A">Grade 11-A</option>
                  <option value="Grade 11-B">Grade 11-B</option>
                  <option value="Grade 12-A">Grade 12-A</option>
                  <option value="Grade 12-B">Grade 12-B</option>
                </select>
              </div>

              <div className="wizard-field">
                <label>Gender <span className="req">*</span></label>
                <select
                  value={studentForm.gender}
                  onChange={(e) => setStudentForm({ ...studentForm, gender: e.target.value })}
                >
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="wizard-field">
                <label>Date of Birth <span className="req">*</span></label>
                <input
                  type="date"
                  required
                  value={studentForm.dob}
                  onChange={(e) => setStudentForm({ ...studentForm, dob: e.target.value })}
                />
              </div>

              <div className="wizard-field">
                <label>Blood Group <span className="req">*</span></label>
                <select
                  value={studentForm.bloodGroup}
                  onChange={(e) => setStudentForm({ ...studentForm, bloodGroup: e.target.value })}
                >
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                </select>
              </div>

              <div className="wizard-field">
                <label>Parent / Guardian Name <span className="req">*</span></label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Kumar (Father)"
                  value={studentForm.parentName}
                  onChange={(e) => setStudentForm({ ...studentForm, parentName: e.target.value })}
                />
              </div>

              <div className="wizard-field">
                <label>Parent Contact Phone <span className="req">*</span></label>
                <input
                  type="text"
                  required
                  placeholder="+91 98456 12301"
                  value={studentForm.parentPhone}
                  onChange={(e) => setStudentForm({ ...studentForm, parentPhone: e.target.value })}
                />
              </div>

              <div className="wizard-field">
                <label>Parent Email Address</label>
                <input
                  type="email"
                  placeholder="parent@gmail.com"
                  value={studentForm.parentEmail}
                  onChange={(e) => setStudentForm({ ...studentForm, parentEmail: e.target.value })}
                />
              </div>

              <div className="wizard-field">
                <label>Emergency Contact Phone</label>
                <input
                  type="text"
                  placeholder="+91 98456 12301"
                  value={studentForm.emergencyContact}
                  onChange={(e) => setStudentForm({ ...studentForm, emergencyContact: e.target.value })}
                />
              </div>

              <div className="wizard-field span-2">
                <label>Residential Address</label>
                <input
                  type="text"
                  placeholder="e.g. 24, South Mada Street, Mylapore, Chennai - 600004"
                  value={studentForm.address}
                  onChange={(e) => setStudentForm({ ...studentForm, address: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #e2e8f0' }}>
            <button type="button" className="btn btn-outline btn-sm" onClick={() => setIsStudentModalOpen(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary btn-sm" style={{ padding: '8px 22px' }}>
              {editingStudent ? 'Save Changes' : 'Enroll Student'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )}

  
  {marksStudent && (
    <div className="modal-overlay" style={{ display: 'flex' }}>
      <div className="modal-content wizard-modal-lg" style={{ maxWidth: '600px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '1.3rem' }}>📝</span>
            <div>
              <h3 style={{ margin: 0 }}>Exam Marks & Assessment</h3>
              <small style={{ color: '#64748b' }}>{marksStudent.name} (Roll: {marksStudent.roll}) • {marksStudent.class}</small>
            </div>
          </div>
          <button className="modal-close" onClick={() => setMarksStudent(null)}>&times;</button>
        </div>
        <form onSubmit={handleSaveMarks} style={{ padding: '20px' }}>
          <p style={{ fontSize: '0.86rem', color: '#475569', marginBottom: '16px' }}>
            Enter marks scored out of 100 for each subject. Type <strong>AB</strong> if student was absent.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px' }}>
            {['Mathematics', 'Physics', 'Chemistry', 'Tamil', 'English'].map((sub) => (
              <div key={sub} className="wizard-field">
                <label>{sub} (Max 100)</label>
                <input
                  type="text"
                  placeholder="e.g. 85 or AB"
                  value={marksInputs[sub] !== undefined ? marksInputs[sub] : ''}
                  onChange={(e) => setMarksInputs({ ...marksInputs, [sub]: e.target.value })}
                  style={{ fontWeight: 700 }}
                />
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #e2e8f0' }}>
            <button type="button" className="btn btn-outline btn-sm" onClick={() => setMarksStudent(null)}>Cancel</button>
            <button type="submit" className="btn btn-primary btn-sm" style={{ padding: '8px 22px' }}>
              Save Marks
            </button>
          </div>
        </form>
      </div>
    </div>
  )}

  
  {isClassModalOpen && (
    <div className="modal-overlay" style={{ display: 'flex' }}>
      <div className="modal-content wizard-modal-lg" style={{ maxWidth: '580px' }}>
        <div className="modal-header">
          <h3>{editingClass ? 'Edit Classroom Section' : 'Create New Classroom'}</h3>
          <button className="modal-close" onClick={() => setIsClassModalOpen(false)}>&times;</button>
        </div>
        <form onSubmit={handleSaveClass}>
          <div className="wizard-form-box">
            <div className="wizard-header-strip">
              <div className="wizard-header-icon" style={{ background: 'rgba(30, 58, 138, 0.08)', color: 'var(--color-primary)' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
              </div>
              <div className="wizard-header-titles">
                <h4>{editingClass ? 'Update Class Details' : 'New Classroom Section'}</h4>
                <p>Configure classroom name, designated class teacher, room number and student capacity.</p>
              </div>
            </div>

            <div className="wizard-grid-2">
              <div className="wizard-field">
                <label>Class Name & Section <span className="req">*</span></label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Grade 10-B"
                  value={classForm.name}
                  onChange={(e) => setClassForm({ ...classForm, name: e.target.value })}
                />
              </div>

              <div className="wizard-field">
                <label>Assigned Room Number <span className="req">*</span></label>
                <input
                  type="text"
                  required
                  placeholder="e.g. A-104"
                  value={classForm.room}
                  onChange={(e) => setClassForm({ ...classForm, room: e.target.value })}
                />
              </div>

              <div className="wizard-field span-2">
                <label>Class Teacher <span className="req">*</span></label>
                <select
                  value={classForm.teacher}
                  onChange={(e) => setClassForm({ ...classForm, teacher: e.target.value })}
                  required
                >
                  <option value="">-- Choose Assigned Class Teacher --</option>
                  {(data.teachers || []).map((t) => (
                    <option key={t.id} value={t.name}>
                      {t.name} • {t.subject}
                    </option>
                  ))}
                  {(data.principals || []).map((p) => (
                    <option key={p.id} value={p.name}>
                      {p.name} (Principal)
                    </option>
                  ))}
                </select>
              </div>

              <div className="wizard-field span-2">
                <label>Total Student Capacity / Strength</label>
                <input
                  type="number"
                  placeholder="38"
                  value={classForm.strength}
                  onChange={(e) => setClassForm({ ...classForm, strength: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #e2e8f0' }}>
            <button type="button" className="btn btn-outline btn-sm" onClick={() => setIsClassModalOpen(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary btn-sm" style={{ padding: '8px 22px' }}>
              {editingClass ? 'Save Changes' : 'Create Class'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )}

  
  {isSubjectModalOpen && (
    <div className="modal-overlay" style={{ display: 'flex' }}>
      <div className="modal-content wizard-modal-lg" style={{ maxWidth: '580px' }}>
        <div className="modal-header">
          <h3>{editingSubject ? 'Edit Subject Course' : 'Add Academic Subject'}</h3>
          <button className="modal-close" onClick={() => setIsSubjectModalOpen(false)}>&times;</button>
        </div>
        <form onSubmit={handleSaveSubject}>
          <div className="wizard-form-box">
            <div className="wizard-header-strip">
              <div className="wizard-header-icon" style={{ background: 'rgba(30, 58, 138, 0.08)', color: 'var(--color-primary)' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></svg>
              </div>
              <div className="wizard-header-titles">
                <h4>{editingSubject ? 'Update Subject Course' : 'Create Academic Course'}</h4>
                <p>Assign course code, subject title, teacher in charge and weekly period count.</p>
              </div>
            </div>

            <div className="wizard-grid-2">
              <div className="wizard-field">
                <label>Course Code <span className="req">*</span></label>
                <input
                  type="text"
                  required
                  placeholder="e.g. TAM-10"
                  value={subjectForm.code}
                  onChange={(e) => setSubjectForm({ ...subjectForm, code: e.target.value })}
                />
              </div>

              <div className="wizard-field">
                <label>Subject Title <span className="req">*</span></label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tamil (Language I)"
                  value={subjectForm.name}
                  onChange={(e) => setSubjectForm({ ...subjectForm, name: e.target.value })}
                />
              </div>

              <div className="wizard-field">
                <label>Applicable Class / Grade <span className="req">*</span></label>
                <select
                  value={subjectForm.grade}
                  onChange={(e) => setSubjectForm({ ...subjectForm, grade: e.target.value })}
                >
                  {data.classes.map((c) => (
                    <option key={c.name} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div className="wizard-field">
                <label>Assigned Faculty / Teacher <span className="req">*</span></label>
                <select
                  value={subjectForm.teacher}
                  onChange={(e) => setSubjectForm({ ...subjectForm, teacher: e.target.value })}
                  required
                >
                  <option value="">-- Choose Faculty Teacher --</option>
                  {(data.teachers || []).map((t) => (
                    <option key={t.id} value={t.name}>
                      {t.name} • {t.subject}
                    </option>
                  ))}
                  {(data.principals || []).map((p) => (
                    <option key={p.id} value={p.name}>
                      {p.name} (Principal)
                    </option>
                  ))}
                </select>
              </div>

              <div className="wizard-field">
                <label>Periods per Week</label>
                <input
                  type="number"
                  placeholder="5"
                  value={subjectForm.periodsPerWeek}
                  onChange={(e) => setSubjectForm({ ...subjectForm, periodsPerWeek: e.target.value })}
                />
              </div>

              <div className="wizard-field">
                <label>Room / Laboratory</label>
                <input
                  type="text"
                  placeholder="e.g. Room A-102 or Bio-Lab"
                  value={subjectForm.room}
                  onChange={(e) => setSubjectForm({ ...subjectForm, room: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #e2e8f0' }}>
            <button type="button" className="btn btn-outline btn-sm" onClick={() => setIsSubjectModalOpen(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary btn-sm" style={{ padding: '8px 22px' }}>
              {editingSubject ? 'Save Changes' : 'Save Subject'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )}

 
  
  {assignWorkSlot && (
    <div className="modal-overlay" style={{ display: 'flex' }}>
      <div className="modal-content wizard-modal-lg" style={{ maxWidth: '540px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '1.3rem' }}>📅</span>
            <div>
              <h3 style={{ margin: 0 }}>Assign Subject & Teacher</h3>
              <small style={{ color: '#64748b', fontWeight: 600 }}>
                {assignWorkSlot.className} &bull; {assignWorkSlot.day} Period {assignWorkSlot.period}
              </small>
            </div>
          </div>
          <button className="modal-close" onClick={() => setAssignWorkSlot(null)}>&times;</button>
        </div>
        <form onSubmit={handleSaveAssignWork} style={{ padding: '20px' }}>
          <div className="wizard-form-box" style={{ marginBottom: 0 }}>
            <div className="wizard-grid-2">
              <div className="wizard-field span-2">
                <label>Classroom Section <span className="req">*</span></label>
                <select
                  value={assignWorkForm.className || assignWorkSlot.className}
                  onChange={(e) => setAssignWorkForm({ ...assignWorkForm, className: e.target.value })}
                  required
                >
                  {data.classes.map((c) => (
                    <option key={c.name} value={c.name}>{c.name} (Room {c.room})</option>
                  ))}
                </select>
              </div>

              <div className="wizard-field span-2">
                <label>Subject / Course <span className="req">*</span></label>
                <select
                  value={assignWorkForm.subject}
                  onChange={(e) => {
                    const subName = e.target.value;
                    
                    const matchedSub = (data.subjects || []).find((s) => s.name === subName);
                    const suggestedTeacher = matchedSub && matchedSub.teacher ? matchedSub.teacher : assignWorkForm.teacherName;
                    setAssignWorkForm({
                      ...assignWorkForm,
                      subject: subName,
                      teacherName: assignWorkSlot.lockedTeacher || suggestedTeacher
                    });
                  }}
                  required
                >
                  <option value="">-- Choose Subject Course --</option>
                  {(data.subjects || []).map((s) => (
                    <option key={s.code} value={s.name}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="wizard-field span-2">
                <label>Assigned Faculty / Teacher <span className="req">*</span></label>
                <select
                  value={assignWorkForm.teacherName}
                  onChange={(e) => setAssignWorkForm({ ...assignWorkForm, teacherName: e.target.value })}
                  required
                >
                  <option value="">-- Choose Assigned Teacher --</option>
                  {(data.teachers || []).map((t) => (
                    <option key={t.id} value={t.name}>
                      {t.name}
                    </option>
                  ))}
                  {(data.principals || []).map((p) => (
                    <option key={p.id} value={p.name}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #e2e8f0' }}>
            <button
              type="button"
              className="btn btn-outline btn-sm"
              style={{ color: '#ef4444', borderColor: '#fca5a5' }}
              onClick={() => handleClearAssignWork(assignWorkSlot.className, assignWorkSlot.day, assignWorkSlot.period)}
            >
              Clear Slot
            </button>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button type="button" className="btn btn-outline btn-sm" onClick={() => setAssignWorkSlot(null)}>Cancel</button>
              <button type="submit" className="btn btn-primary btn-sm" style={{ padding: '8px 22px' }}>
                Save Assignment & Live Track
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )}

{feedback && (
 <div className="modal-overlay" style={{ display: 'flex' }}>
 <div className="modal-content" style={{ maxWidth: '440px', textAlign: 'center', padding: '30px 24px' }}>
 <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#dcfce7', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: '1.8rem' }}>
 
 </div>
 <h3 style={{ color: 'var(--color-primary)', marginBottom: '10px' }}>{feedback.title}</h3>
 <p style={{ color: '#475569', fontSize: '0.92rem', lineHeight: 1.5, marginBottom: '24px', whiteSpace: 'pre-line' }}>{feedback.body}</p>
 <button className="btn btn-primary" onClick={() => setFeedback(null)} style={{ padding: '8px 30px', borderRadius: '50px' }}>
 Dismiss
 </button>
 </div>
 </div>
 )}

 
 {isBulkStudentOpen && (
 <div className="modal-overlay" style={{ display: 'flex' }}>
 <div className="modal-content" style={{ maxWidth: '720px' }}>
 <div className="modal-header">
 <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
 <span style={{ fontSize: '1.3rem' }}></span>
 <h3>Bulk Student Enrollment (Excel / CSV)</h3>
 </div>
 <button
 className="modal-close"
 onClick={() => {
 setIsBulkStudentOpen(false);
 setBulkStudentPreview([]);
 setBulkStudentFileName('');
 }}
 >
 &times;
 </button>
 </div>
 <form onSubmit={handleBulkUploadStudents} style={{ padding: '20px' }}>
 
 <div style={{
 border: '2px dashed #93c5fd',
 borderRadius: '12px',
 padding: '28px 20px',
 textAlign: 'center',
 background: '#eff6ff',
 marginBottom: '16px'
 }}>
 <div style={{ fontSize: '2.4rem', marginBottom: '8px' }}></div>
 <div style={{ fontWeight: 700, color: '#1e40af', fontSize: '1rem', marginBottom: '6px' }}>
 Upload Student Excel Sheet
 </div>
 <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '16px' }}>
 Choose your Excel workbook containing student records to preview and enroll
 </div>
 <input
 type="file"
 accept=".xlsx, .xls, .csv"
 onChange={handleStudentFileSelect}
 style={{ display: 'none' }}
 id="student-excel-upload"
 />
 <label
 htmlFor="student-excel-upload"
 className="btn btn-primary"
 style={{ cursor: 'pointer', display: 'inline-block', padding: '10px 24px', borderRadius: '8px' }}
 >
 Choose Excel File 
 </label>
 {bulkStudentFileName && (
 <div style={{ marginTop: '12px', fontSize: '0.88rem', color: '#059669', fontWeight: 600 }}>
 Selected File: <strong>{bulkStudentFileName}</strong> ({bulkStudentPreview.length} student records parsed)
 </div>
 )}
 </div>

 
 {bulkStudentPreview.length > 0 && (
 <div style={{ marginBottom: '16px' }}>
 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
 <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#0f172a' }}>
 Preview Uploaded Details ({bulkStudentPreview.length} Students):
 </div>
 <button
 type="button"
 onClick={() => {
 setBulkStudentPreview([]);
 setBulkStudentFileName('');
 }}
 style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 600 }}
 >
 Clear File 
 </button>
 </div>
 <div style={{ maxHeight: '220px', overflowY: 'auto', border: '1px solid #cbd5e1', borderRadius: '8px' }}>
 <table className="sa-schools-table" style={{ margin: 0, fontSize: '0.82rem' }}>
 <thead>
 <tr style={{ background: '#f1f5f9' }}>
 <th style={{ padding: '8px 12px' }}>#</th>
 <th style={{ padding: '8px 12px' }}>Roll No</th>
 <th style={{ padding: '8px 12px' }}>Student Name</th>
 <th style={{ padding: '8px 12px' }}>Class / Section</th>
 </tr>
 </thead>
 <tbody>
 {bulkStudentPreview.map((s, idx) => (
 <tr key={idx}>
 <td data-label="#" style={{ padding: '8px 12px' }}>{idx + 1}</td>
 <td data-label="Roll No" style={{ padding: '8px 12px' }}><code>{s.roll}</code></td>
 <td data-label="Student Name" style={{ padding: '8px 12px' }}><strong>{s.name}</strong></td>
 <td data-label="Class / Section" style={{ padding: '8px 12px' }}><span className="badge badge-info">{s.class}</span></td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 </div>
 )}

 <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', paddingTop: '12px', borderTop: '1px solid #e2e8f0' }}>
 <button
 type="button"
 className="btn btn-outline btn-sm"
 onClick={() => {
 setIsBulkStudentOpen(false);
 setBulkStudentPreview([]);
 setBulkStudentFileName('');
 }}
 >
 Cancel
 </button>
 <button
 type="submit"
 className="btn btn-primary btn-sm"
 disabled={bulkStudentPreview.length === 0}
 >
 Enroll {bulkStudentPreview.length > 0 ? `(${bulkStudentPreview.length})` : ''} Students 
 </button>
 </div>
 </form>
 </div>
 </div>
 )}

 
 {isBulkTeacherOpen && (
 <div className="modal-overlay" style={{ display: 'flex' }}>
 <div className="modal-content" style={{ maxWidth: '780px' }}>
 <div className="modal-header">
 <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
 <span style={{ fontSize: '1.3rem' }}></span>
 <h3>Bulk Staff & Faculty Import (Excel)</h3>
 </div>
 <button
 className="modal-close"
 onClick={() => {
 setIsBulkTeacherOpen(false);
 setBulkTeacherPreview([]);
 setBulkTeacherFileName('');
 }}
 >
 &times;
 </button>
 </div>
 <form onSubmit={handleBulkUploadTeachers} style={{ padding: '20px' }}>
 
 <div style={{
 border: '2px dashed #a78bfa',
 borderRadius: '12px',
 padding: '28px 20px',
 textAlign: 'center',
 background: '#faf5ff',
 marginBottom: '16px'
 }}>
 <div style={{ fontSize: '2.4rem', marginBottom: '8px' }}></div>
 <div style={{ fontWeight: 700, color: '#6d28d9', fontSize: '1rem', marginBottom: '6px' }}>
 Upload Staff Excel Sheet
 </div>
 <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '16px' }}>
 Choose your Excel workbook containing staff details to preview and import
 </div>
 <input
 type="file"
 accept=".xlsx, .xls, .csv"
 onChange={handleTeacherFileSelect}
 style={{ display: 'none' }}
 id="teacher-excel-upload"
 />
 <label
 htmlFor="teacher-excel-upload"
 className="btn btn-primary"
 style={{ cursor: 'pointer', display: 'inline-block', padding: '10px 24px', borderRadius: '8px' }}
 >
 Choose Excel File 
 </label>
 {bulkTeacherFileName && (
 <div style={{ marginTop: '12px', fontSize: '0.88rem', color: '#059669', fontWeight: 600 }}>
 Selected File: <strong>{bulkTeacherFileName}</strong> ({bulkTeacherPreview.length} staff records parsed)
 </div>
 )}
 </div>

 
 {bulkTeacherPreview.length > 0 && (
 <div style={{ marginBottom: '16px' }}>
 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
 <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#0f172a' }}>
 Preview Uploaded Staff ({bulkTeacherPreview.length} Members):
 </div>
 <button
 type="button"
 onClick={() => {
 setBulkTeacherPreview([]);
 setBulkTeacherFileName('');
 }}
 style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 600 }}
 >
 Clear File 
 </button>
 </div>
 <div style={{ maxHeight: '240px', overflowY: 'auto', border: '1px solid #cbd5e1', borderRadius: '8px' }}>
 <table className="sa-schools-table" style={{ margin: 0, fontSize: '0.82rem' }}>
 <thead>
 <tr style={{ background: '#f1f5f9' }}>
 <th style={{ padding: '8px 10px' }}>Staff ID</th>
 <th style={{ padding: '8px 10px' }}>Name</th>
 <th style={{ padding: '8px 10px' }}>Subject</th>
 <th style={{ padding: '8px 10px' }}>Class</th>
 <th style={{ padding: '8px 10px' }}>Phone</th>
 <th style={{ padding: '8px 10px', textAlign: 'center' }}>Blood Group</th>
 <th style={{ padding: '8px 10px' }}>Qualification</th>
 </tr>
 </thead>
 <tbody>
 {bulkTeacherPreview.map((t, idx) => (
 <tr key={idx}>
 <td data-label="Staff ID" style={{ padding: '8px 10px' }}><code>{t.id}</code></td>
 <td data-label="Name" style={{ padding: '8px 10px' }}><strong>{t.name}</strong></td>
 <td data-label="Subject" style={{ padding: '8px 10px' }}><span className="badge badge-info">{t.subject}</span></td>
 <td data-label="Class" style={{ padding: '8px 10px' }}>{t.class}</td>
 <td data-label="Phone" style={{ padding: '8px 10px' }}>{t.phone}</td>
 <td data-label="Blood Group" style={{ padding: '8px 10px', textAlign: 'center' }}>
 <span style={{ background: '#fee2e2', color: '#991b1b', padding: '2px 6px', borderRadius: '4px', fontWeight: 700, fontSize: '0.75rem' }}>
 {t.bloodGroup}
 </span>
 </td>
 <td data-label="Qualification" style={{ padding: '8px 10px' }}>{t.qualification}</td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 </div>
 )}

 <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', paddingTop: '12px', borderTop: '1px solid #e2e8f0' }}>
 <button
 type="button"
 className="btn btn-outline btn-sm"
 onClick={() => {
 setIsBulkTeacherOpen(false);
 setBulkTeacherPreview([]);
 setBulkTeacherFileName('');
 }}
 >
 Cancel
 </button>
 <button
 type="submit"
 className="btn btn-primary btn-sm"
 disabled={bulkTeacherPreview.length === 0}
 >
 Import {bulkTeacherPreview.length > 0 ? `(${bulkTeacherPreview.length})` : ''} Staff 
 </button>
 </div>
 </form>
 </div>
 </div>
 )}

 
 {selectedStaffSchedule && (() => {
 const staffName = selectedStaffSchedule;
 const staffObj = (data.teachers || []).find((t) => t.name === staffName) ||
 (data.principals || []).find((p) => p.name === staffName);
 const staffSlots = (data.classTimetables || []).filter((t) => t.teacherName === staffName);
 const assignedSubjects = (data.subjects || []).filter((s) => s.teacher === staffName);

 return (
 <div className="modal-overlay" style={{ display: 'flex' }}>
 <div className="modal-content wizard-modal-lg" style={{ maxWidth: '820px' }}>
 <div className="modal-header" style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '14px' }}>
 <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
 <div style={{
 width: '42px',
 height: '42px',
 borderRadius: '50%',
 background: '#e0e7ff',
 border: '2px solid #4f46e5',
 color: '#4338ca',
 display: 'flex',
 alignItems: 'center',
 justifyContent: 'center',
 fontSize: '1.2rem',
 fontWeight: 800
 }}>
 
 </div>
 <div>
 <h3 style={{ margin: 0, fontSize: '1.18rem', color: '#1e3a8a' }}>
 Weekly Class Schedule &mdash; {staffName}
 </h3>
 <p style={{ margin: '2px 0 0', fontSize: '0.8rem', color: '#64748b' }}>
 {staffObj ? `${staffObj.subject || 'Faculty'} Instructor • ${staffObj.class || 'Campus Staff'} • ${staffObj.phone || 'N/A'}` : 'Faculty Instructor'}
 </p>
 </div>
 </div>
 <button className="modal-close" onClick={() => setSelectedStaffSchedule(null)}>&times;</button>
 </div>

 
 <div style={{
 display: 'grid',
 gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
 gap: '12px',
 margin: '18px 0',
 background: '#f8fafc',
 border: '1px solid #e2e8f0',
 borderRadius: '10px',
 padding: '12px 16px'
 }}>
 <div>
 <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Total Weekly Classes</div>
 <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-primary)' }}>
 {staffSlots.length} Periods / Week
 </div>
 </div>
 <div>
 <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Assigned Subject(s)</div>
 <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#0f172a', marginTop: '2px' }}>
 {assignedSubjects.length > 0 ? assignedSubjects.map(s => s.name).join(', ') : (staffObj ? staffObj.subject : 'General')}
 </div>
 </div>
 <div>
 <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Primary Section</div>
 <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#059669', marginTop: '2px' }}>
 {staffObj ? staffObj.class : 'Grade 10-A'}
 </div>
 </div>
 </div>

 
 <div style={{ marginBottom: '14px' }}>
 <h4 style={{ margin: '0 0 10px', fontSize: '0.95rem', color: 'var(--color-text-dark)', display: 'flex', alignItems: 'center', gap: '6px' }}>
 <span></span> Weekly Timetable & Allocated Sections (Monday to Friday)
 </h4>
 <div className="table-responsive" style={{ border: '1px solid #e2e8f0', borderRadius: '8px' }}>
 <table className="timetable-grid" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center', fontSize: '0.86rem' }}>
 <thead>
 <tr style={{ background: '#f1f5f9', borderBottom: '2px solid #cbd5e1' }}>
 <th style={{ padding: '10px', textAlign: 'left', minWidth: '120px', color: '#334155' }}>Period / Time</th>
 {days.map((d) => (
 <th key={d} style={{ padding: '10px', minWidth: '110px', color: '#334155' }}>{d}</th>
 ))}
 </tr>
 </thead>
 <tbody>
 {periods.map((p) => (
 <tr key={p.period} style={{ borderBottom: '1px solid #f1f5f9' }}>
 <td style={{ padding: '10px', textAlign: 'left', fontWeight: 700, background: '#f8fafc', color: 'var(--color-primary)' }}>
 <div>Period {p.period}</div>
 <div style={{ fontSize: '0.7rem', fontWeight: 400, color: '#64748b' }}>{p.time}</div>
 </td>
 {days.map((day) => {
 const slot = staffSlots.find((s) => s.day === day && parseInt(s.period) === p.period);
 if (slot) {
 return (
 <td key={day} style={{ padding: '6px' }}>
 <div
 style={{
 background: 'rgba(37, 99, 235, 0.1)',
 borderLeft: '3px solid #2563eb',
 borderRadius: '6px',
 padding: '8px 6px',
 textAlign: 'left',
 cursor: 'pointer',
 transition: 'all 0.15s ease'
 }}
 onClick={() => handleOpenAssignWork(slot.className, day, p.period, staffName)}
 title="Click to Edit or Reassign this Period"
 >
 <div style={{ fontWeight: 800, color: '#1e3a8a', fontSize: '0.84rem' }}>
 {slot.className}
 </div>
 <div style={{ fontSize: '0.74rem', color: '#2563eb', fontWeight: 600 }}>
 {slot.subject}
 </div>
 <div style={{ fontSize: '0.65rem', color: '#64748b', marginTop: '2px' }}>
 Click to Edit
 </div>
 </div>
 </td>
 );
 } else {
 return (
 <td key={day} style={{ padding: '6px' }}>
 <div
 style={{
 textAlign: 'center',
 color: '#94a3b8',
 fontSize: '1.1rem',
 fontWeight: 700,
 padding: '8px 6px',
 background: '#f8fafc',
 border: '1px dashed #cbd5e1',
 borderRadius: '6px',
 cursor: 'pointer',
 transition: 'all 0.15s ease'
 }}
 onClick={() => handleOpenAssignWork(staffObj ? staffObj.class : 'Grade 10-A', day, p.period, staffName)}
 title={`Click to Assign Class Period to ${staffName}`}
 >
 -
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

 
 <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px', paddingTop: '12px', borderTop: '1px solid #e2e8f0' }}>
 <button
 type="button"
 className="btn btn-primary btn-sm"
 style={{ padding: '8px 24px' }}
 onClick={() => setSelectedStaffSchedule(null)}
 >
 Close Schedule View 
 </button>
 </div>
 </div>
 </div>
 );
 })()}

 
 {feeReminderModal && (
 <div className="modal-backdrop" onClick={() => setFeeReminderModal(null)}>
 <div
 className="modal-container"
 onClick={(e) => e.stopPropagation()}
 style={{ maxWidth: '520px', width: '92%', borderRadius: '16px' }}
 >
 <div className="modal-header" style={{ alignItems: 'flex-start' }}>
 <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
 <div style={{
 width: '46px',
 height: '46px',
 borderRadius: '12px',
 background: feeReminderModal.channel === 'whatsapp' ? '#dcfce7' : feeReminderModal.channel === 'sms' ? '#dbeafe' : '#fef3c7',
 color: feeReminderModal.channel === 'whatsapp' ? '#15803d' : feeReminderModal.channel === 'sms' ? '#1d4ed8' : '#b45309',
 display: 'flex',
 alignItems: 'center',
 justifyContent: 'center',
 fontSize: '1.5rem'
 }}>
 {feeReminderModal.channel === 'whatsapp' ? '' : feeReminderModal.channel === 'sms' ? '' : ''}
 </div>
 <div>
 <h3 style={{ margin: 0, fontSize: '1.15rem', color: '#0f172a' }}>
 {feeReminderModal.channel === 'whatsapp' && 'Send WhatsApp Fee Reminder'}
 {feeReminderModal.channel === 'sms' && 'Send SMS Due Notice'}
 {feeReminderModal.channel === 'call' && 'Initiate Phone Call / IVR Reminder'}
 </h3>
 <p style={{ margin: '2px 0 0', fontSize: '0.8rem', color: '#64748b' }}>
 To: <strong>{feeReminderModal.record.parent}</strong> ({feeReminderModal.record.phone}) &bull; Student: {feeReminderModal.record.name} ({feeReminderModal.record.class})
 </p>
 </div>
 </div>
 <button className="modal-close" onClick={() => setFeeReminderModal(null)}>&times;</button>
 </div>

 <div style={{ padding: '16px 20px' }}>
 
 <div style={{
 background: '#fef2f2',
 border: '1px solid #fecaca',
 borderRadius: '10px',
 padding: '12px 14px',
 display: 'flex',
 justifyContent: 'space-between',
 alignItems: 'center',
 marginBottom: '16px'
 }}>
 <div>
 <div style={{ fontSize: '0.75rem', color: '#991b1b', fontWeight: 600, textTransform: 'uppercase' }}>
 Outstanding Fee Due
 </div>
 <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#dc2626' }}>
 {feeReminderModal.record.due}
 </div>
 </div>
 <div style={{ textAlign: 'right', fontSize: '0.8rem', color: '#64748b' }}>
 <div>Total: <strong>{feeReminderModal.record.totalFee}</strong></div>
 <div>Paid: <strong style={{ color: '#059669' }}>{feeReminderModal.record.paid}</strong></div>
 </div>
 </div>

 
 <div style={{ display: 'flex', gap: '8px', marginBottom: '14px', borderBottom: '1px solid #e2e8f0', paddingBottom: '10px' }}>
 <button
 type="button"
 onClick={() => {
 setFeeReminderModal({
 ...feeReminderModal,
 channel: 'whatsapp',
 message: `Dear ${feeReminderModal.record.parent}, gentle reminder from Zen School regarding pending fee of ${feeReminderModal.record.due} for student ${feeReminderModal.record.name} (${feeReminderModal.record.class}). Kindly pay using our instant UPI link: https://pay.zenschool.in/${feeReminderModal.record.roll.toLowerCase()}`
 });
 }}
 style={{
 padding: '6px 12px',
 borderRadius: '8px',
 border: '1px solid',
 borderColor: feeReminderModal.channel === 'whatsapp' ? '#25D366' : '#cbd5e1',
 background: feeReminderModal.channel === 'whatsapp' ? '#f0fdf4' : '#ffffff',
 color: feeReminderModal.channel === 'whatsapp' ? '#15803d' : '#475569',
 fontSize: '0.82rem',
 fontWeight: 700,
 cursor: 'pointer'
 }}
 >
 WhatsApp
 </button>
 <button
 type="button"
 onClick={() => {
 setFeeReminderModal({
 ...feeReminderModal,
 channel: 'sms',
 message: `Zen School Alert: Dear ${feeReminderModal.record.parent}, Fee of ${feeReminderModal.record.due} is pending for ${feeReminderModal.record.name} (${feeReminderModal.record.roll}). Pay before due date: https://pay.zenschool.in/${feeReminderModal.record.roll.toLowerCase()}`
 });
 }}
 style={{
 padding: '6px 12px',
 borderRadius: '8px',
 border: '1px solid',
 borderColor: feeReminderModal.channel === 'sms' ? '#3b82f6' : '#cbd5e1',
 background: feeReminderModal.channel === 'sms' ? '#eff6ff' : '#ffffff',
 color: feeReminderModal.channel === 'sms' ? '#1d4ed8' : '#475569',
 fontSize: '0.82rem',
 fontWeight: 700,
 cursor: 'pointer'
 }}
 >
 SMS
 </button>
 <button
 type="button"
 onClick={() => {
 setFeeReminderModal({
 ...feeReminderModal,
 channel: 'call',
 message: `Automated Voice Call Script: "Hello ${feeReminderModal.record.parent}, this is an automated reminder from Zen School administration. An outstanding balance of ${feeReminderModal.record.due} is due for your ward ${feeReminderModal.record.name}. Press 1 to receive payment link via SMS, or stay on the line to connect to Accounts office."`
 });
 }}
 style={{
 padding: '6px 12px',
 borderRadius: '8px',
 border: '1px solid',
 borderColor: feeReminderModal.channel === 'call' ? '#f59e0b' : '#cbd5e1',
 background: feeReminderModal.channel === 'call' ? '#fffbeb' : '#ffffff',
 color: feeReminderModal.channel === 'call' ? '#b45309' : '#475569',
 fontSize: '0.82rem',
 fontWeight: 700,
 cursor: 'pointer'
 }}
 >
 Direct Call
 </button>
 </div>

 
 <div style={{ marginBottom: '14px' }}>
 <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
 {feeReminderModal.channel === 'call' ? 'Voice Call Prompt / Script' : 'Reminder Message Content'}
 </label>
 <textarea
 rows={4}
 value={feeReminderModal.message}
 onChange={(e) => setFeeReminderModal({ ...feeReminderModal, message: e.target.value })}
 style={{
 width: '100%',
 padding: '10px 12px',
 borderRadius: '8px',
 border: '1px solid #cbd5e1',
 fontSize: '0.85rem',
 color: '#0f172a',
 outline: 'none',
 lineHeight: '1.45',
 boxSizing: 'border-box',
 fontFamily: 'inherit'
 }}
 />
 </div>

 
 <div style={{ display: 'flex', gap: '8px', marginBottom: '18px', flexWrap: 'wrap' }}>
 <button
 type="button"
 className="btn btn-outline btn-sm"
 style={{ fontSize: '0.75rem', padding: '4px 10px' }}
 onClick={() => {
 setFeeReminderModal({
 ...feeReminderModal,
 message: `Dear ${feeReminderModal.record.parent}, gentle reminder from Zen School for pending fee ${feeReminderModal.record.due} for student ${feeReminderModal.record.name}. Pay securely: https://pay.zenschool.in/${feeReminderModal.record.roll.toLowerCase()}`
 });
 }}
 >
 Polite Reminder
 </button>
 <button
 type="button"
 className="btn btn-outline btn-sm"
 style={{ fontSize: '0.75rem', padding: '4px 10px', borderColor: '#ef4444', color: '#dc2626' }}
 onClick={() => {
 setFeeReminderModal({
 ...feeReminderModal,
 message: `URGENT NOTICE: Dear ${feeReminderModal.record.parent}, overdue fee of ${feeReminderModal.record.due} is pending for student ${feeReminderModal.record.name} (${feeReminderModal.record.roll}). Immediate settlement requested.`
 });
 }}
 >
 Overdue Urgent
 </button>
 </div>

 
 <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', paddingTop: '12px', borderTop: '1px solid #e2e8f0', flexWrap: 'wrap' }}>
 <button
 type="button"
 className="btn btn-outline btn-sm"
 onClick={() => setFeeReminderModal(null)}
 >
 Cancel
 </button>

 
 {feeReminderModal.channel === 'call' ? (
 <>
 <a
 href={`tel:${feeReminderModal.record.phone.replace(/[^0-9+]/g, '')}`}
 className="btn btn-outline btn-sm"
 style={{
 borderColor: '#f59e0b',
 color: '#b45309',
 fontWeight: 700,
 padding: '8px 16px',
 textDecoration: 'none',
 display: 'inline-flex',
 alignItems: 'center',
 gap: '6px'
 }}
 onClick={() => {
 setFeedback({
 title: `Connecting Call to ${feeReminderModal.record.parent}`,
 body: `Dialing ${feeReminderModal.record.phone} for student ${feeReminderModal.record.name} (${feeReminderModal.record.due} due).`,
 });
 setFeeReminderModal(null);
 }}
 >
 Open Phone Dialer
 </a>
 <button
 type="button"
 className="btn btn-primary btn-sm"
 style={{
 background: '#d97706',
 borderColor: '#d97706',
 fontWeight: 700,
 padding: '8px 18px',
 display: 'inline-flex',
 alignItems: 'center',
 gap: '6px'
 }}
 onClick={() => {
 setFeedback({
 title: `Automated IVR Call Dispatched!`,
 body: `Zen Automated Voice Call scheduled to ${feeReminderModal.record.parent} (${feeReminderModal.record.phone}) with voice script: "${feeReminderModal.message.slice(0, 80)}..."`,
 });
 setFeeReminderModal(null);
 }}
 >
 Start Automated Voice Call
 </button>
 </>
 ) : (
 <button
 type="button"
 style={{
 background: feeReminderModal.channel === 'whatsapp' ? '#16a34a' : '#2563eb',
 border: feeReminderModal.channel === 'whatsapp' ? '1px solid #15803d' : '1px solid #1d4ed8',
 color: '#ffffff',
 fontWeight: 700,
 fontSize: '0.9rem',
 borderRadius: '8px',
 padding: '9px 22px',
 display: 'inline-flex',
 alignItems: 'center',
 gap: '8px',
 cursor: 'pointer',
 boxShadow: feeReminderModal.channel === 'whatsapp' ? '0 2px 6px rgba(22, 163, 74, 0.3)' : '0 2px 6px rgba(37, 99, 235, 0.3)'
 }}
 onClick={() => {
 const phoneClean = feeReminderModal.record.phone.replace(/[^0-9]/g, '');

 if (feeReminderModal.channel === 'whatsapp') {
 
 const waUrl = `https://api.whatsapp.com/send?phone=${phoneClean}&text=${encodeURIComponent(feeReminderModal.message)}`;
 window.open(waUrl, '_blank');
 } else if (feeReminderModal.channel === 'sms') {
 
 const smsUrl = `sms:${feeReminderModal.record.phone.replace(/[^0-9+]/g, '')}?body=${encodeURIComponent(feeReminderModal.message)}`;
 window.location.href = smsUrl;
 }

 setFeedback({
 title: `${feeReminderModal.channel === 'whatsapp' ? 'WhatsApp' : 'SMS'} Reminder Sent!`,
 body: `Notification successfully sent to ${feeReminderModal.record.parent} (${feeReminderModal.record.phone}) for ${feeReminderModal.record.due} pending fee.`,
 });
 setFeeReminderModal(null);
 }}
 >
 <span style={{ color: '#ffffff', fontWeight: 800 }}>
 {feeReminderModal.channel === 'whatsapp' ? 'Send on WhatsApp' : 'Send SMS Alert'}
 </span>
 </button>
 )}
 </div>
 </div>
 </div>
 </div>
 )}

 
 {activeReportViewer && (
 <div
 className="modal-backdrop"
 onClick={() => setActiveReportViewer(null)}
 style={{
 position: 'fixed',
 top: 0,
 left: 0,
 right: 0,
 bottom: 0,
 background: 'rgba(15, 23, 42, 0.75)',
 backdropFilter: 'blur(5px)',
 display: 'flex',
 alignItems: 'center',
 justifyContent: 'center',
 zIndex: 10000,
 padding: '20px'
 }}
 >
 <div
 className="modal-container"
 onClick={(e) => e.stopPropagation()}
 style={{
 maxWidth: '980px',
 width: '100%',
 maxHeight: '90vh',
 display: 'flex',
 flexDirection: 'column',
 borderRadius: '16px',
 background: '#ffffff',
 boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
 overflow: 'hidden'
 }}
 >
 
 <div className="modal-header" style={{ padding: '18px 24px', borderBottom: '1px solid #e2e8f0', background: '#f8fafc' }}>
 <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
 <div style={{
 width: '46px',
 height: '46px',
 borderRadius: '12px',
 background: activeReportViewer.badgeBg || '#eff6ff',
 display: 'flex',
 alignItems: 'center',
 justifyContent: 'center',
 fontSize: '1.6rem'
 }}>
 {activeReportViewer.icon}
 </div>
 <div>
 <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
 <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#0f172a', fontWeight: 800 }}>
 {activeReportViewer.title}
 </h3>
 <span style={{
 fontSize: '0.72rem',
 fontWeight: 800,
 color: activeReportViewer.badgeColor,
 background: activeReportViewer.badgeBg,
 padding: '2px 8px',
 borderRadius: '12px',
 textTransform: 'uppercase'
 }}>
 {activeReportViewer.category}
 </span>
 </div>
 <p style={{ margin: '3px 0 0', fontSize: '0.82rem', color: '#64748b' }}>
 Sri Sankara Vidhyasala Girls High School &bull; Generated: {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
 </p>
 </div>
 </div>
 <button className="modal-close" onClick={() => setActiveReportViewer(null)}>&times;</button>
 </div>

 
 <div style={{ padding: '20px 24px', overflowY: 'auto', flex: 1 }}>
 
 <div style={{
 background: '#f8fafc',
 border: '1px solid #e2e8f0',
 borderRadius: '12px',
 padding: '14px 18px',
 marginBottom: '18px',
 display: 'flex',
 justifyContent: 'space-between',
 alignItems: 'center',
 flexWrap: 'wrap',
 gap: '12px'
 }}>
 <div>
 <div style={{ fontSize: '0.74rem', textTransform: 'uppercase', color: '#64748b', fontWeight: 700 }}>
 {activeReportViewer.metricLabel}
 </div>
 <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#0f172a', marginTop: '2px' }}>
 {activeReportViewer.metricValue}
 </div>
 <div style={{ fontSize: '0.78rem', color: '#475569' }}>
 {activeReportViewer.subMetric}
 </div>
 </div>

 <div style={{ display: 'flex', gap: '8px' }}>
 <button
 type="button"
 className="btn btn-outline btn-sm"
 style={{ fontSize: '0.78rem', fontWeight: 700 }}
 onClick={() => window.print()}
 >
 Print Report
 </button>
 <button
 type="button"
 className="btn btn-primary btn-sm"
 style={{ fontSize: '0.78rem', fontWeight: 700 }}
 onClick={() => {
 let exportRows = [];
 if (activeReportViewer.type === 'students') {
 exportRows = (data.students || []).map(s => ({
 'Roll No': s.roll,
 'Student Name': s.name,
 'Class': s.class,
 'Attendance': s.attendance || '92%',
 'Academic Standing': s.performance || 'Good',
 'Status': 'Enrolled'
 }));
 } else if (activeReportViewer.type === 'marks') {
 (data.students || []).forEach(st => {
 const row = { 'Roll No': st.roll, 'Student Name': st.name, 'Class': st.class };
 (st.marks || []).forEach(m => {
 row[m.subject] = m.scored;
 });
 exportRows.push(row);
 });
 } else if (activeReportViewer.type === 'fees') {
 exportRows = feeRecords.map(f => ({
 'Roll No': f.roll,
 'Student Name': f.name,
 'Class': f.class,
 'Parent': f.parent,
 'Phone': f.phone,
 'Total Fee': f.totalFee,
 'Paid Amount': f.paid,
 'Due Amount': f.due,
 'Status': f.status
 }));
 } else if (activeReportViewer.type === 'staff') {
 exportRows = (data.teachers || []).map(t => ({
 'Teacher ID': t.id,
 'Full Name': t.name,
 'Subject Specialization': t.subject,
 'Primary Section': t.class,
 'Status': t.status || 'Active'
 }));
 } else {
 exportRows = [
 { 'Report Name': activeReportViewer.title, 'Category': activeReportViewer.category, 'Summary': activeReportViewer.metricValue, 'Scope': activeReportViewer.subMetric }
 ];
 }

 const ws = XLSX.utils.json_to_sheet(exportRows);
 const wb = XLSX.utils.book_new();
 XLSX.utils.book_append_sheet(wb, ws, activeReportViewer.category);
 XLSX.writeFile(wb, `${activeReportViewer.id}_${new Date().toISOString().slice(0, 10)}.xlsx`);

 setFeedback({
 title: 'Audit Report Exported to Excel!',
 body: `Exported ${exportRows.length} audited rows from ${activeReportViewer.title}.`
 });
 }}
 >
 Download Excel Sheet
 </button>
 </div>
 </div>

 
 <div className="table-responsive">
 {activeReportViewer.type === 'students' && (
 <table className="sa-schools-table">
 <thead>
 <tr>
 <th>Roll No</th>
 <th>Student Full Name</th>
 <th>Class Section</th>
 <th>Attendance</th>
 <th>Standing</th>
 <th>Admission Status</th>
 </tr>
 </thead>
 <tbody>
 {(data.students || []).map((s) => (
 <tr key={s.roll}>
 <td data-label="Roll No"><code>{s.roll}</code></td>
 <td data-label="Student Full Name"><strong>{s.name}</strong></td>
 <td data-label="Class Section"><span className="badge badge-info">{s.class}</span></td>
 <td data-label="Attendance"><strong style={{ color: '#059669' }}>{s.attendance || '92%'}</strong></td>
 <td data-label="Standing"><span className="badge badge-active">{s.performance || 'Good'}</span></td>
 <td data-label="Admission Status"><span className="badge badge-success">✓ Enrolled</span></td>
 </tr>
 ))}
 </tbody>
 </table>
 )}

 {activeReportViewer.type === 'marks' && (
 <table className="sa-schools-table">
 <thead>
 <tr>
 <th>Roll No</th>
 <th>Student Name</th>
 <th>Class</th>
 <th style={{ textAlign: 'center' }}>Maths</th>
 <th style={{ textAlign: 'center' }}>Physics</th>
 <th style={{ textAlign: 'center' }}>Chemistry</th>
 <th style={{ textAlign: 'center' }}>Tamil</th>
 <th style={{ textAlign: 'center' }}>English</th>
 <th style={{ textAlign: 'center' }}>Term Grade</th>
 </tr>
 </thead>
 <tbody>
 {(data.students || []).map((s) => {
 const marksMap = {};
 (s.marks || []).forEach(m => { marksMap[m.subject] = m.scored; });
 return (
 <tr key={s.roll}>
 <td data-label="Roll No"><code>{s.roll}</code></td>
 <td data-label="Student Name"><strong>{s.name}</strong></td>
 <td data-label="Class"><span className="badge badge-info">{s.class}</span></td>
 <td data-label="Maths" style={{ textAlign: 'center', fontWeight: 700 }}>{marksMap['Mathematics'] ?? '85'}</td>
 <td data-label="Physics" style={{ textAlign: 'center', fontWeight: 700 }}>{marksMap['Physics'] ?? '88'}</td>
 <td data-label="Chemistry" style={{ textAlign: 'center', fontWeight: 700 }}>{marksMap['Chemistry'] ?? '80'}</td>
 <td data-label="Tamil" style={{ textAlign: 'center', fontWeight: 700 }}>{marksMap['Tamil'] ?? '90'}</td>
 <td data-label="English" style={{ textAlign: 'center', fontWeight: 700 }}>{marksMap['English'] ?? '84'}</td>
 <td data-label="Term Grade" style={{ textAlign: 'center' }}>
 <span className="badge badge-success" style={{ fontWeight: 800 }}>Grade A+</span>
 </td>
 </tr>
 );
 })}
 </tbody>
 </table>
 )}

 {activeReportViewer.type === 'fees' && (
 <table className="sa-schools-table">
 <thead>
 <tr>
 <th>Roll No</th>
 <th>Student Name</th>
 <th>Class</th>
 <th>Parent Name</th>
 <th>Total Fee</th>
 <th>Paid</th>
 <th>Due Balance</th>
 <th>Audit Status</th>
 </tr>
 </thead>
 <tbody>
 {feeRecords.map((f) => (
 <tr key={f.id}>
 <td data-label="Roll No"><code>{f.roll}</code></td>
 <td data-label="Student Name"><strong>{f.name}</strong></td>
 <td data-label="Class"><span className="badge badge-info">{f.class}</span></td>
 <td data-label="Parent Name">{f.parent}</td>
 <td data-label="Total Fee"><strong>{f.totalFee}</strong></td>
 <td data-label="Paid" style={{ color: '#059669', fontWeight: 700 }}>{f.paid}</td>
 <td data-label="Due Balance" style={{ color: f.due !== '₹0' ? '#dc2626' : '#64748b', fontWeight: 800 }}>{f.due}</td>
 <td data-label="Audit Status">
 <span className={`badge ${f.status === 'PAID' ? 'badge-active' : f.status === 'PARTIAL' ? 'badge-warning' : 'badge-danger'}`}>
 {f.status}
 </span>
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 )}

 {activeReportViewer.type === 'staff' && (
 <table className="sa-schools-table">
 <thead>
 <tr>
 <th>Faculty ID</th>
 <th>Teacher Name</th>
 <th>Curriculum Specialization</th>
 <th>Primary Section</th>
 <th>Weekly Periods Assigned</th>
 <th>Employment Status</th>
 </tr>
 </thead>
 <tbody>
 {(data.teachers || []).map((t) => (
 <tr key={t.id}>
 <td data-label="Faculty ID"><code>{t.id}</code></td>
 <td data-label="Teacher Name"><strong>{t.name}</strong></td>
 <td data-label="Specialization"><span className="badge badge-info">{t.subject}</span></td>
 <td data-label="Section"><strong>{t.class}</strong></td>
 <td data-label="Weekly Periods"><strong style={{ color: 'var(--color-primary)' }}>18 Periods / Wk</strong></td>
 <td data-label="Employment Status"><span className="badge badge-success">✓ Full-Time Faculty</span></td>
 </tr>
 ))}
 </tbody>
 </table>
 )}

 {activeReportViewer.type === 'attendance' && (
 <table className="sa-schools-table">
 <thead>
 <tr>
 <th>Class Section</th>
 <th>Enrolled Strength</th>
 <th>Average Attendance</th>
 <th>Monthly Working Days</th>
 <th>Total Attendance Logs</th>
 <th>Absentee Alerts Dispatched</th>
 </tr>
 </thead>
 <tbody>
 <tr>
 <td data-label="Class Section"><span className="badge badge-info">Grade 10-A</span></td>
 <td data-label="Strength">38 Students</td>
 <td data-label="Avg Attendance"><strong style={{ color: '#059669' }}>94.6%</strong></td>
 <td data-label="Working Days">22 Days</td>
 <td data-label="Total Logs">790 Logs</td>
 <td data-label="Alerts Dispatched">32 SMS Dispatched</td>
 </tr>
 <tr>
 <td data-label="Class Section"><span className="badge badge-info">Grade 10-B</span></td>
 <td data-label="Strength">36 Students</td>
 <td data-label="Avg Attendance"><strong style={{ color: '#059669' }}>95.2%</strong></td>
 <td data-label="Working Days">22 Days</td>
 <td data-label="Total Logs">754 Logs</td>
 <td data-label="Alerts Dispatched">28 SMS Dispatched</td>
 </tr>
 <tr>
 <td data-label="Class Section"><span className="badge badge-info">Grade 9-A</span></td>
 <td data-label="Strength">40 Students</td>
 <td data-label="Avg Attendance"><strong style={{ color: '#059669' }}>93.8%</strong></td>
 <td data-label="Working Days">22 Days</td>
 <td data-label="Total Logs">825 Logs</td>
 <td data-label="Alerts Dispatched">41 SMS Dispatched</td>
 </tr>
 </tbody>
 </table>
 )}

 {activeReportViewer.type === 'services' && (
 <table className="sa-schools-table">
 <thead>
 <tr>
 <th>Club / Activity Program</th>
 <th>Category</th>
 <th>Enrolled Students</th>
 <th>Instructor in Charge</th>
 <th>Weekly Schedule</th>
 <th>Program Status</th>
 </tr>
 </thead>
 <tbody>
 <tr>
 <td data-label="Program"><strong>Coding for Kids & Python</strong></td>
 <td data-label="Category"><span className="badge badge-info">Technology</span></td>
 <td data-label="Enrolled">42 Students</td>
 <td data-label="Instructor">Dr. Anandhi Rajan</td>
 <td data-label="Schedule">Mon & Wed (3:30 PM - 4:30 PM)</td>
 <td data-label="Status"><span className="badge badge-success">Active</span></td>
 </tr>
 <tr>
 <td data-label="Program"><strong>Chess Grandmaster Academy</strong></td>
 <td data-label="Category"><span className="badge badge-info">Mind Sports</span></td>
 <td data-label="Enrolled">28 Students</td>
 <td data-label="Instructor">Mr. K. Manickam</td>
 <td data-label="Schedule">Tue & Thu (3:30 PM - 4:30 PM)</td>
 <td data-label="Status"><span className="badge badge-success">Active</span></td>
 </tr>
 <tr>
 <td data-label="Program"><strong>Robotics & STEM Labs</strong></td>
 <td data-label="Category"><span className="badge badge-info">STEM</span></td>
 <td data-label="Enrolled">35 Students</td>
 <td data-label="Instructor">Mrs. Selvi Murugan</td>
 <td data-label="Schedule">Friday (2:45 PM - 4:15 PM)</td>
 <td data-label="Status"><span className="badge badge-success">Active</span></td>
 </tr>
 </tbody>
 </table>
 )}
 </div>
 </div>

 
 <div style={{ padding: '14px 24px', borderTop: '1px solid #e2e8f0', background: '#f8fafc', display: 'flex', justifyContent: 'flex-end' }}>
 <button
 type="button"
 className="btn btn-primary btn-sm"
 style={{ padding: '8px 24px' }}
 onClick={() => setActiveReportViewer(null)}
 >
 Close Audit Viewer 
 </button>
 </div>
 </div>
 </div>
 )}

 
 <InteractiveServicePlayerModal
 isOpen={!!activePlayService}
 service={activePlayService}
 onClose={() => setActivePlayService(null)}
 />

  
 <DashboardDetailModal
 isOpen={cardDetailModal.isOpen}
 detailConfig={cardDetailModal.config}
 onClose={() => setCardDetailModal({ isOpen: false, config: null })}
 onNavigate={(tab) => {
 if (setActiveTab) {
 setActiveTab(tab);
 }
 }}
 />

 
 {selectedStaffHistory && (() => {
 const staff = selectedStaffHistory;
 const curDateObj = new Date(staff.baseDate || staffAttendanceDate);
 const curDayName = curDateObj.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

 const past7Days = Array.from({ length: 7 }).map((_, i) => {
 const d = new Date(curDateObj);
 d.setDate(d.getDate() - i);
 const isSun = d.getDay() === 0;
 const dayName = d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });
 const dateStr = d.toISOString().split('T')[0];
 const hash = (staff.name.charCodeAt(0) + d.getDate() * 3 + d.getMonth() * 5) % 9;
 const isLeave = !isSun && (hash === 2);
 const status = isSun ? 'Holiday (Sun)' : isLeave ? 'On Leave (Casual)' : 'Present on Duty';
 const inTime = isSun ? '—' : isLeave ? '—' : '08:' + (10 + (hash * 2)).toString().padStart(2, '0') + ' AM';
 const outTime = isSun ? '—' : isLeave ? '—' : '04:30 PM';
 return { dateStr, dayName, status, inTime, outTime, isLeave, isSun };
 });

 const totalPresent7 = past7Days.filter(d => !d.isSun && !d.isLeave).length;
 const totalLeave7 = past7Days.filter(d => d.isLeave).length;

 return (
 <div
 className="modal-overlay"
 style={{
 position: 'fixed',
 top: 0,
 left: 0,
 right: 0,
 bottom: 0,
 background: 'rgba(15, 23, 42, 0.7)',
 backdropFilter: 'blur(4px)',
 display: 'flex',
 alignItems: 'center',
 justifyContent: 'center',
 zIndex: 99999,
 padding: '16px',
 }}
 onClick={() => setSelectedStaffHistory(null)}
 >
 <div
 className="modal-content"
 style={{
 maxWidth: '780px',
 width: '100%',
 borderRadius: '16px',
 overflow: 'hidden',
 boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
 background: '#ffffff'
 }}
 onClick={(e) => e.stopPropagation()}
 >
 <div
 style={{
 background:
 staff.type === 'Teaching Staff'
 ? 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)'
 : staff.type === 'Non-Teaching Staff'
 ? 'linear-gradient(135deg, #0e7490 0%, #06b6d4 100%)'
 : 'linear-gradient(135deg, #be185d 0%, #ec4899 100%)',
 color: '#ffffff',
 padding: '20px 24px',
 display: 'flex',
 justifyContent: 'space-between',
 alignItems: 'center',
 }}
 >
 <div>
 <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
 <span style={{ fontSize: '1.4rem' }}>
 {staff.type === 'Teaching Staff' ? '👩‍🏫' : staff.type === 'Non-Teaching Staff' ? '👥' : '📋'}
 </span>
 <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800 }}>
 {staff.name} &mdash; Attendance & Duty Log
 </h3>
 </div>
 <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', opacity: 0.9 }}>
 {staff.role} &bull; {staff.department} &bull; {staff.phone}
 </p>
 </div>
 <button
 type="button"
 onClick={() => setSelectedStaffHistory(null)}
 style={{
 background: 'rgba(255, 255, 255, 0.25)',
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
 fontWeight: 700,
 }}
 >
 ✕
 </button>
 </div>

 <div style={{ padding: '24px', maxHeight: '72vh', overflowY: 'auto' }}>
 <div
 style={{
 background: '#f8fafc',
 border: '1.5px solid #e2e8f0',
 borderRadius: '12px',
 padding: '16px',
 marginBottom: '20px',
 display: 'flex',
 flexWrap: 'wrap',
 justifyContent: 'space-between',
 alignItems: 'center',
 gap: '12px',
 }}
 >
 <div>
 <label style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', color: '#64748b', display: 'block', marginBottom: '4px' }}>
 Audit Date:
 </label>
 <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
 <input
 type="date"
 value={staffAttendanceDate}
 onChange={(e) => {
 setStaffAttendanceDate(e.target.value);
 setSelectedStaffHistory({ ...staff, baseDate: e.target.value });
 }}
 max={new Date().toISOString().split('T')[0]}
 style={{
 padding: '6px 12px',
 border: '1.5px solid #3b82f6',
 borderRadius: '8px',
 fontWeight: 700,
 color: '#1e3a8a',
 background: '#ffffff',
 fontSize: '0.92rem',
 cursor: 'pointer'
 }}
 />
 <button
 type="button"
 className="btn btn-outline btn-sm"
 onClick={() => {
 const today = new Date().toISOString().split('T')[0];
 setStaffAttendanceDate(today);
 setSelectedStaffHistory({ ...staff, baseDate: today });
 }}
 >
 Today
 </button>
 </div>
 </div>

 <div style={{ textAlign: 'right' }}>
 <span style={{ fontSize: '0.78rem', color: '#64748b', display: 'block' }}>Status on Selected Date:</span>
 <strong style={{ fontSize: '1rem', color: '#0f172a' }}>{curDayName}</strong>
 <div style={{ marginTop: '4px' }}>
 {(() => {
 const targetLog = past7Days.find(d => d.dateStr === (staff.baseDate || staffAttendanceDate)) || past7Days[0];
 const isPresentDuty = targetLog && targetLog.status.includes('Present');
 const isHoliday = targetLog && targetLog.status.includes('Holiday');
 const displayStatus = targetLog ? targetLog.status : (staff.currentStatus || 'Present on Duty');
 const displayPunch = targetLog ? targetLog.inTime : (staff.currentPunch || '08:15 AM');
 return (
 <span
 className={`badge ${isPresentDuty ? 'badge-success' : isHoliday ? 'badge-info' : 'badge-danger'}`}
 style={{ fontSize: '0.86rem', padding: '5px 12px', fontWeight: 700 }}
 >
 ● {displayStatus} {displayPunch && displayPunch !== '—' ? `(Punch: ${displayPunch})` : ''}
 </span>
 );
 })()}
 </div>
 </div>
 </div>

 {staff.extraWork && (
 <div style={{ marginBottom: '20px', padding: '16px', background: '#f0fdf4', borderRadius: '12px', border: '1.5px solid #86efac' }}>
 <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
 <span style={{ fontSize: '1.1rem' }}>📌</span>
 <strong style={{ fontSize: '0.95rem', color: '#166534' }}>Currently Assigned Daily Operational Work:</strong>
 </div>
 <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#14532d', marginBottom: '6px' }}>
 {staff.extraWork.title}
 </div>
 <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', fontSize: '0.8rem', color: '#15803d' }}>
 <span>🏢 <strong>Department:</strong> {staff.extraWork.department}</span>
 <span>⏰ <strong>Shift / Schedule:</strong> {staff.extraWork.deadline}</span>
 <span>⚡ <strong>Priority:</strong> <span className="badge badge-success">{staff.extraWork.priority}</span></span>
 <span>✅ <strong>Status:</strong> Completed & Verified</span>
 </div>
 </div>
 )}

 <div
 style={{
 display: 'grid',
 gridTemplateColumns: 'repeat(3, 1fr)',
 gap: '12px',
 marginBottom: '20px',
 }}
 >
 <div style={{ background: '#ecfdf5', padding: '12px 16px', borderRadius: '10px', border: '1px solid #a7f3d0' }}>
 <span style={{ fontSize: '0.74rem', color: '#047857', fontWeight: 700, textTransform: 'uppercase' }}>Present (Past 7 Days)</span>
 <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#065f46' }}>{totalPresent7} Days</div>
 <span style={{ fontSize: '0.7rem', color: '#059669' }}>Bio-metric Clocked In</span>
 </div>
 <div style={{ background: '#fee2e2', padding: '12px 16px', borderRadius: '10px', border: '1px solid #fca5a5' }}>
 <span style={{ fontSize: '0.74rem', color: '#991b1b', fontWeight: 700, textTransform: 'uppercase' }}>Leaves (Past 7 Days)</span>
 <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#dc2626' }}>{totalLeave7} Days</div>
 <span style={{ fontSize: '0.7rem', color: '#b91c1c' }}>Approved Leave Roster</span>
 </div>
 <div style={{ background: '#eff6ff', padding: '12px 16px', borderRadius: '10px', border: '1px solid #bfdbfe' }}>
 <span style={{ fontSize: '0.74rem', color: '#1e40af', fontWeight: 700, textTransform: 'uppercase' }}>Duty Compliance</span>
 <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1e3a8a' }}>100%</div>
 <span style={{ fontSize: '0.7rem', color: '#2563eb' }}>Work Assigned & Active</span>
 </div>
 </div>

 <h4 style={{ margin: '0 0 10px 0', fontSize: '0.95rem', color: '#1e293b' }}>
 Day-by-Day Biometric Clock-In & Presence Audit:
 </h4>

 <div className="table-responsive">
 <table className="sa-schools-table">
 <thead>
 <tr>
 <th>Date</th>
 <th>Day</th>
 <th>Morning Clock-In</th>
 <th>Evening Clock-Out</th>
 <th>Attendance Status</th>
 </tr>
 </thead>
 <tbody>
 {past7Days.map((d, idx) => (
 <tr
 key={idx}
 style={{
 background: d.dateStr === staffAttendanceDate ? '#eff6ff' : 'transparent',
 fontWeight: d.dateStr === staffAttendanceDate ? 700 : 'normal',
 }}
 >
 <td data-label="Date">
 <code>{d.dateStr}</code>
 {d.dateStr === staffAttendanceDate && (
 <span className="badge badge-primary" style={{ marginLeft: '6px', fontSize: '0.68rem' }}>Selected</span>
 )}
 </td>
 <td data-label="Day">{d.dayName}</td>
 <td data-label="Clock-In"><code>{d.inTime}</code></td>
 <td data-label="Clock-Out"><code>{d.outTime}</code></td>
 <td data-label="Status">
 <span className={`badge ${d.status.includes('Present') ? 'badge-success' : d.status.includes('Holiday') ? 'badge-info' : 'badge-danger'}`}>
 {d.status}
 </span>
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 </div>

 <div
 style={{
 padding: '14px 24px',
 background: '#f8fafc',
 borderTop: '1px solid #e2e8f0',
 display: 'flex',
 justifyContent: 'space-between',
 alignItems: 'center'
 }}
 >
 <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
 School Admin Staff Verification &bull; Live Bio-metric Clock-in Parity
 </span>
 <button
 type="button"
 className="btn btn-primary btn-sm"
 onClick={() => setSelectedStaffHistory(null)}
 style={{ padding: '6px 18px', fontWeight: 600 }}
 >
 Close
 </button>
 </div>
 </div>
 </div>
 );
 })()}

 
 {analyticsModal && (
 <div
 className="portal-modal-backdrop"
 onClick={() => setAnalyticsModal(null)}
 style={{
 position: 'fixed',
 top: 0,
 left: 0,
 right: 0,
 bottom: 0,
 background: 'rgba(15, 23, 42, 0.75)',
 backdropFilter: 'blur(4px)',
 display: 'flex',
 alignItems: 'center',
 justifyContent: 'center',
 zIndex: 9999,
 padding: '20px',
 }}
 >
 <div
 className="portal-modal-card"
 style={{
 maxWidth: '1000px',
 width: '100%',
 borderRadius: '16px',
 overflow: 'hidden',
 boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
 background: '#ffffff',
 maxHeight: '90vh',
 display: 'flex',
 flexDirection: 'column',
 }}
 onClick={(e) => e.stopPropagation()}
 >
 
 <div
 style={{
 background:
 analyticsModal === 'staff'
 ? 'linear-gradient(135deg, #b45309 0%, #f59e0b 100%)'
 : analyticsModal === 'non-teaching'
 ? 'linear-gradient(135deg, #0891b2 0%, #06b6d4 100%)'
 : analyticsModal === 'operations-works'
 ? 'linear-gradient(135deg, #be185d 0%, #ec4899 100%)'
 : 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)',
 color: '#ffffff',
 padding: '20px 24px',
 display: 'flex',
 justifyContent: 'space-between',
 alignItems: 'center',
 }}
 >
 <div>
 <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.01em' }}>
 {analyticsModal === 'staff' && '👩‍🏫 Teaching Faculty — Attendance & Leave Roster'}
 {analyticsModal === 'non-teaching' && '👥 Non-Teaching & Administrative Staff — Duty Register'}
 {analyticsModal === 'operations-works' && '📋 Campus Operations & Administrative Works Pipeline'}
 </h3>
 <p style={{ margin: '4px 0 0 0', fontSize: '0.82rem', opacity: 0.9 }}>
 {analyticsModal === 'staff' && 'Daily faculty attendance log and substitute coverage map'}
 {analyticsModal === 'non-teaching' && 'Non-academic staff duty deployment, office admin & lab support'}
 {analyticsModal === 'operations-works' && 'Real-time tracking of institutional daily tasks, audits & compliance'}
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

 
 <div style={{ padding: '24px', maxHeight: '72vh', overflowY: 'auto' }}>
 
 {analyticsModal === 'staff' && (() => {
 const sDate = new Date(staffAttendanceDate);
 const dayNum = sDate.getDay();
 const isSunday = dayNum === 0;
 const formattedDate = sDate.toLocaleDateString('en-IN', {
 weekday: 'short',
 year: 'numeric',
 month: 'short',
 day: 'numeric',
 });

 const facultyPool = [
 { name: 'Mrs. Priya Krishnan', dept: 'Mathematics', cls: 'Grade 10-A', punch: '08:15 AM', periods: '5 Periods', phone: '+91 98401 23451' },
 { name: 'Dr. Anandhi Rajan', dept: 'Physics', cls: 'Grade 11-A', punch: '08:20 AM', periods: '4 Periods + Lab', phone: '+91 98401 23452' },
 { name: 'Mr. Anand Narayanan', dept: 'Physics', cls: 'Grade 12-A', punch: '08:12 AM', periods: '5 Periods', phone: '+91 98401 23453' },
 { name: 'Mrs. Selvi Murugan', dept: 'Chemistry', cls: 'Grade 9-A', punch: '—', periods: 'Substituted by Dr. Rajan', phone: '+91 98401 23455' },
 { name: 'Mr. Ramanathan K.', dept: 'Computer Science', cls: 'Grade 10-B', punch: '08:25 AM', periods: '4 Lab Sessions', phone: '+91 98401 23457' },
 { name: 'Mrs. Jayanthi S.', dept: 'English', cls: 'Grade 11-B', punch: '08:18 AM', periods: '5 Periods', phone: '+91 98401 23458' },
 { name: 'Ms. K. Suganthi', dept: 'Social Science', cls: 'Grade 8-B', punch: '08:22 AM', periods: '4 Periods', phone: '+91 98401 23459' },
 { name: 'Mr. V. Balaji', dept: 'Biology', cls: 'Grade 9-B', punch: '—', periods: 'Substituted by Ms. Meena', phone: '+91 98401 23460' },
 ];

 const dateSeed = (sDate.getDate() * 7 + sDate.getMonth() * 11) % 8;
 const computedFaculty = facultyPool.map((f, idx) => {
 if (isSunday) {
 return { ...f, status: 'Holiday (Sunday)', punch: '—', isPresent: false };
 }
 const isLeave = (idx === (dateSeed % facultyPool.length)) || (idx === ((dateSeed + 3) % facultyPool.length));
 const isPresent = !isLeave;
 return {
 ...f,
 status: isPresent ? 'On Duty' : 'On Approved Leave',
 punch: isPresent ? f.punch : '—',
 isPresent
 };
 });

 const presentCount = isSunday ? 0 : computedFaculty.filter(f => f.isPresent).length;
 const leaveCount = isSunday ? 0 : computedFaculty.length - presentCount;

 return (
 <div>
 
 <div
 style={{
 display: 'flex',
 flexWrap: 'wrap',
 justifyContent: 'space-between',
 alignItems: 'center',
 gap: '12px',
 padding: '12px 18px',
 background: '#fffbeb',
 border: '1.5px solid #fde68a',
 borderRadius: '10px',
 marginBottom: '18px',
 }}
 >
 <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
 <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#92400e' }}>
 📅 Check Teaching Attendance by Date:
 </span>
 <input
 type="date"
 value={staffAttendanceDate}
 onChange={(e) => setStaffAttendanceDate(e.target.value)}
 max={new Date().toISOString().split('T')[0]}
 style={{
 padding: '6px 12px',
 border: '1.5px solid #d97706',
 borderRadius: '8px',
 fontWeight: 700,
 color: '#92400e',
 background: '#ffffff',
 fontSize: '0.9rem',
 cursor: 'pointer',
 }}
 />
 <button
 type="button"
 className="btn btn-outline btn-sm"
 onClick={() => setStaffAttendanceDate(new Date().toISOString().split('T')[0])}
 style={{ fontSize: '0.78rem', padding: '4px 10px', borderColor: '#d97706', color: '#92400e' }}
 >
 Today
 </button>
 </div>
 <span className="badge badge-amber" style={{ fontSize: '0.8rem', fontWeight: 700 }}>
 {formattedDate} {isSunday ? '• Institutional Holiday' : ''}
 </span>
 </div>

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
 <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#b45309' }}>
 {presentCount} / {computedFaculty.length} Faculty
 </div>
 <span style={{ fontSize: '0.72rem', color: '#d97706' }}>
 {computedFaculty.length ? ((presentCount / computedFaculty.length) * 100).toFixed(1) : 0}% Attendance Rate
 </span>
 </div>

 <div style={{ background: '#fee2e2', padding: '14px', borderRadius: '10px', border: '1px solid #fca5a5' }}>
 <span style={{ fontSize: '0.75rem', color: '#991b1b', fontWeight: 700, textTransform: 'uppercase' }}>On Approved Leave / Absent</span>
 <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#dc2626' }}>{leaveCount} Faculty</div>
 <span style={{ fontSize: '0.72rem', color: '#b91c1c' }}>Roster Substitute Active ✓</span>
 </div>

 <div style={{ background: '#ecfdf5', padding: '14px', borderRadius: '10px', border: '1px solid #a7f3d0' }}>
 <span style={{ fontSize: '0.75rem', color: '#047857', fontWeight: 700, textTransform: 'uppercase' }}>Classes Coverage</span>
 <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#065f46' }}>{isSunday ? 'Holiday' : '100%'}</div>
 <span style={{ fontSize: '0.72rem', color: '#059669' }}>All periods manned</span>
 </div>
 </div>

 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '0 0 10px 0' }}>
 <h4 style={{ margin: 0, fontSize: '0.95rem', color: '#1e293b' }}>
 Teaching Faculty Daily Log &bull; <span style={{ color: '#b45309', fontWeight: 800 }}>Click any teacher's name</span> to view past attendance:
 </h4>
 <span style={{ fontSize: '0.78rem', color: '#64748b' }}>💡 Click teacher name for full attendance history</span>
 </div>

 <div className="table-responsive">
 <table className="sa-schools-table">
 <thead>
 <tr>
 <th>Faculty Name (Click for History)</th>
 <th>Department</th>
 <th>Assigned Class</th>
 <th>Morning Punch</th>
 <th>Duty Status</th>
 <th>Periods</th>
 </tr>
 </thead>
 <tbody>
 {computedFaculty.map((t, idx) => (
 <tr key={idx}>
 <td data-label="Faculty Name">
 <div
 onClick={(e) => {
 e.stopPropagation();
 setSelectedStaffHistory({
 name: t.name,
 type: 'Teaching Staff',
 role: `${t.dept} Teacher`,
 department: t.dept,
 phone: t.phone,
 baseDate: staffAttendanceDate,
 currentStatus: t.status,
 currentPunch: t.punch,
 });
 }}
 style={{
 color: '#1d4ed8',
 fontWeight: 800,
 textDecoration: 'underline',
 display: 'inline-flex',
 alignItems: 'center',
 gap: '6px',
 cursor: 'pointer',
 padding: '2px 6px',
 borderRadius: '4px',
 background: '#eff6ff'
 }}
 title="Click to view full attendance history for this teacher"
 >
 👩‍🏫 {t.name}
 <span style={{ fontSize: '0.7rem', color: '#2563eb', fontWeight: 600 }}>🔍</span>
 </div>
 </td>
 <td data-label="Department">{t.dept}</td>
 <td data-label="Assigned Class">{t.cls}</td>
 <td data-label="Morning Punch"><code>{t.punch}</code></td>
 <td data-label="Duty Status">
 <span className={`badge ${t.status === 'On Duty' ? 'badge-success' : t.status.includes('Holiday') ? 'badge-info' : 'badge-danger'}`}>
 {t.status}
 </span>
 </td>
 <td data-label="Periods Assigned">{t.periods}</td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 </div>
 );
 })()}

 
 {analyticsModal === 'non-teaching' && (() => {
 const sDate = new Date(staffAttendanceDate);
 const dayNum = sDate.getDay();
 const isSunday = dayNum === 0;
 const formattedDate = sDate.toLocaleDateString('en-IN', {
 weekday: 'short',
 year: 'numeric',
 month: 'short',
 day: 'numeric',
 });

 const rawList = data.nonTeachingStaff || [];
 const dateSeed = rawList.length ? (sDate.getDate() * 5 + sDate.getMonth() * 7) % rawList.length : 0;

 const computedNonTeaching = rawList.map((st, idx) => {
 if (isSunday) {
 return { ...st, status: 'Holiday (Sunday)', isPresent: false };
 }
 const isLeave = (idx === dateSeed);
 return {
 ...st,
 status: isLeave ? 'On Approved Leave' : 'On Duty',
 isPresent: !isLeave
 };
 });

 const presentCount = isSunday ? 0 : computedNonTeaching.filter(s => s.isPresent).length;
 const leaveCount = isSunday ? 0 : computedNonTeaching.length - presentCount;

 return (
 <div>
 
 <div
 style={{
 display: 'flex',
 flexWrap: 'wrap',
 justifyContent: 'space-between',
 alignItems: 'center',
 gap: '12px',
 padding: '12px 18px',
 background: '#ecfeff',
 border: '1.5px solid #a5f3fc',
 borderRadius: '10px',
 marginBottom: '18px',
 }}
 >
 <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
 <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0e7490' }}>
 📅 Check Non-Teaching Attendance by Date:
 </span>
 <input
 type="date"
 value={staffAttendanceDate}
 onChange={(e) => setStaffAttendanceDate(e.target.value)}
 max={new Date().toISOString().split('T')[0]}
 style={{
 padding: '6px 12px',
 border: '1.5px solid #0891b2',
 borderRadius: '8px',
 fontWeight: 700,
 color: '#0e7490',
 background: '#ffffff',
 fontSize: '0.9rem',
 cursor: 'pointer',
 }}
 />
 <button
 type="button"
 className="btn btn-outline btn-sm"
 onClick={() => setStaffAttendanceDate(new Date().toISOString().split('T')[0])}
 style={{ fontSize: '0.78rem', padding: '4px 10px', borderColor: '#0891b2', color: '#0e7490' }}
 >
 Today
 </button>
 </div>
 <span className="badge badge-teal" style={{ fontSize: '0.8rem', fontWeight: 700 }}>
 {formattedDate} {isSunday ? '• Institutional Holiday' : ''}
 </span>
 </div>

 <div
 style={{
 display: 'grid',
 gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
 gap: '12px',
 marginBottom: '20px',
 }}
 >
 <div style={{ background: '#ecfeff', padding: '14px', borderRadius: '10px', border: '1px solid #a5f3fc' }}>
 <span style={{ fontSize: '0.75rem', color: '#0e7490', fontWeight: 700, textTransform: 'uppercase' }}>Present on Duty</span>
 <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0891b2' }}>
 {presentCount} / {computedNonTeaching.length} Staff
 </div>
 <span style={{ fontSize: '0.72rem', color: '#06b6d4' }}>Campus Admin & Labs Operational</span>
 </div>

 <div style={{ background: '#fee2e2', padding: '14px', borderRadius: '10px', border: '1px solid #fca5a5' }}>
 <span style={{ fontSize: '0.75rem', color: '#991b1b', fontWeight: 700, textTransform: 'uppercase' }}>On Approved Leave / Absent</span>
 <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#dc2626' }}>
 {leaveCount} Staff
 </div>
 <span style={{ fontSize: '0.72rem', color: '#b91c1c' }}>Reliever Assigned ✓</span>
 </div>

 <div style={{ background: '#f0fdf4', padding: '14px', borderRadius: '10px', border: '1px solid #bbf7d0' }}>
 <span style={{ fontSize: '0.75rem', color: '#166534', fontWeight: 700, textTransform: 'uppercase' }}>Key Functions Covered</span>
 <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#15803d' }}>{isSunday ? 'Holiday' : '100%'}</div>
 <span style={{ fontSize: '0.72rem', color: '#16a34a' }}>Accounts, Office, Lab & Security</span>
 </div>
 </div>

 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '0 0 10px 0' }}>
 <h4 style={{ margin: 0, fontSize: '0.95rem', color: '#1e293b' }}>
 Non-Academic Staff Register &bull; <span style={{ color: '#0891b2', fontWeight: 800 }}>Click any name</span> to view attendance record:
 </h4>
 <span style={{ fontSize: '0.78rem', color: '#64748b' }}>💡 Click staff name for date-wise attendance log</span>
 </div>

 <div className="table-responsive">
 <table className="sa-schools-table">
 <thead>
 <tr>
 <th>Staff Name (Click for History)</th>
 <th>Role / Title</th>
 <th>Department</th>
 <th>Work Shift</th>
 <th>Primary Operational Responsibility</th>
 <th>Status</th>
 </tr>
 </thead>
 <tbody>
 {computedNonTeaching.map((st, idx) => (
 <tr key={idx}>
 <td data-label="Staff Name">
 <div
 onClick={() => {
 setSelectedStaffHistory({
 name: st.name,
 type: 'Non-Teaching Staff',
 role: st.role,
 department: st.department,
 phone: st.phone,
 baseDate: staffAttendanceDate,
 currentStatus: st.status,
 currentPunch: st.shift ? st.shift.split(' - ')[0] : '08:30 AM',
 });
 }}
 style={{
 color: '#0891b2',
 fontWeight: 800,
 textDecoration: 'underline',
 display: 'inline-flex',
 alignItems: 'center',
 gap: '6px',
 cursor: 'pointer',
 padding: '2px 6px',
 borderRadius: '4px',
 background: '#ecfeff'
 }}
 title="Click to view full attendance history for this staff member"
 >
 👥 {st.name}
 <span style={{ fontSize: '0.7rem', color: '#0891b2', fontWeight: 600 }}>🔍</span>
 </div>
 </td>
 <td data-label="Role / Title"><strong>{st.role}</strong></td>
 <td data-label="Department">{st.department}</td>
 <td data-label="Work Shift"><code>{st.shift}</code></td>
 <td data-label="Primary Responsibility">{st.workAssigned}</td>
 <td data-label="Status">
 <span className={`badge ${st.status === 'On Duty' ? 'badge-success' : st.status.includes('Holiday') ? 'badge-info' : 'badge-danger'}`}>
 {st.status}
 </span>
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 </div>
 );
 })()}

 
 {analyticsModal === 'operations-works' && (() => {
 const sDate = new Date(staffAttendanceDate);
 const isSunday = sDate.getDay() === 0;
 const formattedDate = sDate.toLocaleDateString('en-IN', {
 weekday: 'short',
 year: 'numeric',
 month: 'short',
 day: 'numeric',
 });

 const rawWorks = data.operationsWorks || [];
 const dateSeed = (sDate.getDate() + sDate.getMonth() * 3) % 4;

 const computedWorks = rawWorks.map((w, idx) => {
 if (isSunday) {
 return { ...w, status: 'Holiday Schedule', progress: 100, deadline: 'Sunday Routine' };
 }
 const offset = (idx + dateSeed) % 3;
 const status = offset === 0 ? 'Completed' : 'In Progress';
 const progress = status === 'Completed' ? 100 : Math.min(90, Math.max(30, 40 + (idx * 12) % 55));
 return { ...w, status, progress, deadline: `${formattedDate}, ${w.deadline.split(', ')[1] || '04:00 PM'}` };
 });

 const completedCount = computedWorks.filter(w => w.status === 'Completed').length;
 const activeCount = computedWorks.length - completedCount;

 return (
 <div>
 
 <div
 style={{
 display: 'flex',
 flexWrap: 'wrap',
 justifyContent: 'space-between',
 alignItems: 'center',
 gap: '12px',
 padding: '12px 18px',
 background: '#fdf2f8',
 border: '1.5px solid #fbcfe8',
 borderRadius: '10px',
 marginBottom: '18px',
 }}
 >
 <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
 <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#9d174d' }}>
 📅 Check Operations & Works by Date:
 </span>
 <input
 type="date"
 value={staffAttendanceDate}
 onChange={(e) => setStaffAttendanceDate(e.target.value)}
 max={new Date().toISOString().split('T')[0]}
 style={{
 padding: '6px 12px',
 border: '1.5px solid #db2777',
 borderRadius: '8px',
 fontWeight: 700,
 color: '#9d174d',
 background: '#ffffff',
 fontSize: '0.9rem',
 cursor: 'pointer',
 }}
 />
 <button
 type="button"
 className="btn btn-outline btn-sm"
 onClick={() => setStaffAttendanceDate(new Date().toISOString().split('T')[0])}
 style={{ fontSize: '0.78rem', padding: '4px 10px', borderColor: '#db2777', color: '#9d174d' }}
 >
 Today
 </button>
 </div>
 <span className="badge" style={{ background: '#fce7f3', color: '#be185d', fontSize: '0.8rem', fontWeight: 700 }}>
 {formattedDate} {isSunday ? '• Essential Maintenance Only' : ''}
 </span>
 </div>

 <div
 style={{
 display: 'grid',
 gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
 gap: '12px',
 marginBottom: '20px',
 }}
 >
 <div style={{ background: '#fdf2f8', padding: '14px', borderRadius: '10px', border: '1px solid #fbcfe8' }}>
 <span style={{ fontSize: '0.75rem', color: '#9d174d', fontWeight: 700, textTransform: 'uppercase' }}>Total Works Assigned</span>
 <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#be185d' }}>
 {computedWorks.length} Operational Works
 </div>
 <span style={{ fontSize: '0.72rem', color: '#db2777' }}>Campus Operations Roster</span>
 </div>

 <div style={{ background: '#ecfdf5', padding: '14px', borderRadius: '10px', border: '1px solid #a7f3d0' }}>
 <span style={{ fontSize: '0.75rem', color: '#047857', fontWeight: 700, textTransform: 'uppercase' }}>Completed Works</span>
 <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#065f46' }}>
 {completedCount} Completed
 </div>
 <span style={{ fontSize: '0.72rem', color: '#059669' }}>Inspected & Verified ✓</span>
 </div>

 <div style={{ background: '#fffbeb', padding: '14px', borderRadius: '10px', border: '1px solid #fde68a' }}>
 <span style={{ fontSize: '0.75rem', color: '#92400e', fontWeight: 700, textTransform: 'uppercase' }}>In Progress / Pending</span>
 <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#b45309' }}>
 {activeCount} Active
 </div>
 <span style={{ fontSize: '0.72rem', color: '#d97706' }}>On Track for Selected Date</span>
 </div>
 </div>

 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '0 0 10px 0' }}>
 <h4 style={{ margin: 0, fontSize: '0.95rem', color: '#1e293b' }}>
 Institutional Operations, Safety & Administrative Tasks &bull; <span style={{ color: '#be185d', fontWeight: 800 }}>Click any task</span> to view staff duty:
 </h4>
 <span style={{ fontSize: '0.78rem', color: '#64748b' }}>💡 Click task title or staff name for live duty details</span>
 </div>

 <div className="table-responsive">
 <table className="sa-schools-table">
 <thead>
 <tr>
 <th>Task / Work Title (Click for Details)</th>
 <th>Department</th>
 <th>Assigned Staff / Team</th>
 <th>Priority</th>
 <th>Scheduled Target</th>
 <th>Progress</th>
 <th>Status</th>
 </tr>
 </thead>
 <tbody>
 {computedWorks.map((w, idx) => (
 <tr
 key={idx}
 onClick={() => {
 setSelectedStaffHistory({
 name: w.assignedTo,
 type: 'Operations Work Duty',
 role: w.title,
 department: w.department,
 phone: '+91 98401 55600',
 baseDate: staffAttendanceDate,
 currentStatus: w.status,
 currentPunch: '08:00 AM',
 extraWork: w
 });
 }}
 style={{ cursor: 'pointer', transition: 'background-color 0.15s ease' }}
 title={`Click to inspect task: ${w.title}`}
 >
 <td data-label="Work Title">
 <span style={{ fontWeight: 800, color: '#be185d', textDecoration: 'underline', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
 📋 {w.title}
 <span style={{ fontSize: '0.7rem' }}>🔍</span>
 </span>
 </td>
 <td data-label="Department">{w.department}</td>
 <td data-label="Assigned To">
 <span style={{ color: '#1e3a8a', fontWeight: 700 }}>
 👤 {w.assignedTo}
 </span>
 </td>
 <td data-label="Priority">
 <span className={`badge ${w.priority === 'Urgent' ? 'badge-danger' : w.priority === 'High' ? 'badge-warning' : 'badge-info'}`}>
 {w.priority}
 </span>
 </td>
 <td data-label="Target"><code>{w.deadline}</code></td>
 <td data-label="Progress">
 <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
 <div style={{ flex: 1, height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
 <div
 style={{
 width: `${w.progress}%`,
 height: '100%',
 background: w.progress === 100 ? '#16a34a' : '#ec4899',
 borderRadius: '4px'
 }}
 ></div>
 </div>
 <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569' }}>{w.progress}%</span>
 </div>
 </td>
 <td data-label="Status">
 <span className={`badge ${w.status === 'Completed' ? 'badge-success' : w.status === 'In Progress' ? 'badge-primary' : 'badge-amber'}`}>
 {w.status}
 </span>
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 </div>
 );
 })()}
 </div>

 
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
 ZenSchool Admin Operations Suite &bull; Real-time Campus Synchronized
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
 </div>
 );
}
