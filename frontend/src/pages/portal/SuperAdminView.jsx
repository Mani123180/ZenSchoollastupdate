import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { getPortalData, savePortalData } from '../../services/portalData';
import NewSchoolWizardModal from './NewSchoolWizardModal';
import SubscriptionModal from './SubscriptionModal';
import SchoolAdminView from './SchoolAdminView';
import AcademicRolesView from './AcademicRolesView';
import ChatBox from './ChatBox';
import {
  CampusOverviewModal,
  EditSchoolModal,
  AdminProfileModal,
  AddAdminModal,
  AssignAdminModal,
  CreateInvoiceModal,
  FeedbackModal,
  ConfirmationModal,
  PrintableInvoiceModal,
  DashboardDetailModal,
} from './SuperAdminModals';
import SuperAdminSecurityView from './SuperAdminSecurityView';
import InteractiveServicePlayerModal from './InteractiveServicePlayerModal';
import { downloadInvoicePDF } from '../../services/pdfDownloadUtil';

// Default Demo Data matching js/portal.js lines 245-522
const defaultSchools = [
  {
    id: 'SCHOOL002',
    name: 'Sri Sankara Vidhyasala Girls High School',
    code: 'SSV-KOD',
    city: 'Kodumudi',
    phone: '+91 98456 12301',
    email: 'info@ssvgirlsschool.edu',
    principal: 'Dr. Savithri Raman',
    academicYear: '2026-2027',
    admin: 'admin@ssvschool.com',
    adminName: 'Mrs. Savithri Raman',
    status: 'Active',
    studentsCount: 482,
    teachersCount: 34,
    parentsCount: 460,
    subscription: 'Enterprise Plan',
    createdDate: '2026-02-15',
    board: 'State Board (Tamil Nadu)',
  },
  {
    id: 'SCHOOL001',
    name: 'ABC Matriculation School',
    code: 'ABC-CHE',
    city: 'Chennai',
    phone: '+91 94433 11223',
    email: 'contact@abcschool.com',
    principal: 'Dr. K. Ramanathan',
    academicYear: '2026-2027',
    admin: 'admin@abcschool.com',
    adminName: 'Admin Rajesh',
    status: 'Active',
    studentsCount: 520,
    teachersCount: 28,
    parentsCount: 480,
    subscription: 'Pro Plan',
    createdDate: '2026-01-10',
    board: 'Matriculation',
  },
  {
    id: 'SCHOOL003',
    name: 'St. Marys Academy',
    code: 'STM-ERD',
    city: 'Erode',
    phone: '+91 97890 45678',
    email: 'office@stmarys.edu',
    principal: 'Fr. Thomas Varghese',
    academicYear: '2026-2027',
    admin: 'admin@stmarys.com',
    adminName: 'Admin Joseph',
    status: 'Active',
    studentsCount: 650,
    teachersCount: 42,
    parentsCount: 620,
    subscription: 'Pro Plan',
    createdDate: '2026-03-01',
    board: 'ICSE',
  },
  {
    id: 'SCHOOL005',
    name: 'Oxford International Academy',
    code: 'OXF-CHN',
    city: 'Chennai',
    phone: '+91 91234 56789',
    email: 'admin@oxford.edu',
    principal: 'Mr. David Paul',
    academicYear: '2026-2027',
    admin: 'admin@oxford.edu',
    adminName: 'Admin Vikram',
    status: 'Inactive',
    studentsCount: 320,
    teachersCount: 22,
    parentsCount: 310,
    subscription: 'Basic Plan',
    createdDate: '2025-08-12',
    board: 'CBSE',
  },
  {
    id: 'SCHOOL004',
    name: 'Delhi Public World School',
    code: 'DPW-CBE',
    city: 'Coimbatore',
    phone: '+91 94888 23456',
    email: 'contact@dpwschool.edu',
    principal: 'Mrs. Anitha Sharma',
    academicYear: '2026-2027',
    admin: 'admin@dpwschool.edu',
    adminName: 'Admin Anitha',
    status: 'Active',
    studentsCount: 710,
    teachersCount: 45,
    parentsCount: 680,
    subscription: 'Enterprise Plan',
    createdDate: '2026-02-01',
    board: 'CBSE',
  },
];

const defaultUsers = [
  { id: 'USR001', name: 'Super Administrator', email: 'superadmin@zenschool.com', phone: '+91 98401 11001', username: 'superadmin', role: 'SUPER_ADMIN', schoolId: null, schoolName: '', status: 'Active', createdDate: '2025-01-01' },
  { id: 'USR003', name: 'School Administrator (SSV)', email: 'admin@ssvschool.com', phone: '+91 98401 22002', username: 'admin_ssv', role: 'SCHOOL_ADMIN', schoolId: 'SCHOOL002', schoolName: 'Sri Sankara Vidhyasala Girls High School', status: 'Active', createdDate: '2026-02-15' },
  { id: 'USR002', name: 'Admin Rajesh (ABC School)', email: 'admin@abcschool.com', phone: '+91 98401 33003', username: 'admin_abc', role: 'SCHOOL_ADMIN', schoolId: 'SCHOOL001', schoolName: 'ABC Matriculation School', status: 'Active', createdDate: '2026-01-10' },
  { id: 'USR004', name: 'Admin Joseph (St. Marys)', email: 'admin@stmarys.com', phone: '+91 98401 44004', username: 'admin_stm', role: 'SCHOOL_ADMIN', schoolId: 'SCHOOL003', schoolName: 'St. Marys Academy', status: 'Active', createdDate: '2026-03-01' },
  { id: 'USR005', name: 'Admin Vikram (Oxford)', email: 'admin@oxford.edu', phone: '+91 98401 55005', username: 'admin_oxf', role: 'SCHOOL_ADMIN', schoolId: 'SCHOOL005', schoolName: 'Oxford International Academy', status: 'Inactive', createdDate: '2025-08-12' },
];

const defaultServices = [
  { id: 'SRV-01', name: 'Coding for Kids', icon: '', category: 'Technology', status: 'Active', cost: '0/yr', description: 'Interactive Python, Scratch block coding, and basic algorithmic thinking for students.', visibleRoles: ['schooladmin', 'teacher', 'student'] },
  { id: 'SRV-02', name: 'Chess Academy', icon: '', category: 'Mind Sports', status: 'Active', cost: '0/yr', description: 'Grandmaster tactics, opening strategies, and tournament training.', visibleRoles: ['schooladmin', 'principal', 'teacher', 'student', 'parent'] },
  { id: 'SRV-03', name: 'Robotics', icon: '', category: 'STEM', status: 'Active', cost: '0/yr', description: 'Arduino, sensor kits, circuit building and autonomous robot design.', visibleRoles: ['schooladmin', 'teacher', 'student'] },
  { id: 'SRV-04', name: 'Drawing & Art', icon: '', category: 'Creative Arts', status: 'Active', cost: '0/yr', description: 'Watercolors, canvas painting, sketch portraiture and digital design.', visibleRoles: ['schooladmin', 'student', 'parent'] },
  { id: 'SRV-05', name: 'Spoken English', icon: '', category: 'Communication', status: 'Active', cost: '0/yr', description: 'Vocabulary building, public speaking, pronunciation and phonics.', visibleRoles: ['schooladmin', 'principal', 'teacher', 'student', 'parent'] },
  { id: 'SRV-06', name: 'Abacus & Vedic Maths', icon: '', category: 'Mathematics', status: 'Active', cost: '0/yr', description: 'Fast mental calculation techniques, memory retention, and number speed.', visibleRoles: ['schooladmin', 'teacher', 'student', 'parent'] },
  { id: 'SRV-07', name: 'Dance & Music', icon: '', category: 'Performing Arts', status: 'Active', cost: '0/yr', description: 'Classical & contemporary dance, vocal music, keyboard and guitar lessons.', visibleRoles: ['schooladmin', 'student', 'parent'] },
  { id: 'SRV-08', name: 'Sports & Fitness', icon: '', category: 'Athletics', status: 'Active', cost: '0/yr', description: 'Football, basketball, athletics coaching, yoga and physical agility.', visibleRoles: ['schooladmin', 'principal', 'teacher', 'student', 'parent'] },
];

const defaultSchoolServiceAssignments = [
  { id: 'SSA-01', serviceId: 'SRV-01', serviceName: 'Coding for Kids', schoolId: 'SCHOOL002', schoolName: 'Sri Sankara Vidhyasala Girls High School', status: 'Active', assignedDate: '2026-01-15' },
  { id: 'SSA-02', serviceId: 'SRV-02', serviceName: 'Chess Academy', schoolId: 'SCHOOL002', schoolName: 'Sri Sankara Vidhyasala Girls High School', status: 'Active', assignedDate: '2026-01-20' },
  { id: 'SSA-03', serviceId: 'SRV-03', serviceName: 'Robotics', schoolId: 'SCHOOL002', schoolName: 'Sri Sankara Vidhyasala Girls High School', status: 'Active', assignedDate: '2026-02-01' },
  { id: 'SSA-04', serviceId: 'SRV-04', serviceName: 'Drawing & Art', schoolId: 'SCHOOL001', schoolName: 'ABC Matriculation School', status: 'Active', assignedDate: '2026-01-10' },
  { id: 'SSA-05', serviceId: 'SRV-05', serviceName: 'Spoken English', schoolId: 'SCHOOL001', schoolName: 'ABC Matriculation School', status: 'Inactive', assignedDate: '2026-01-12' },
  { id: 'SSA-06', serviceId: 'SRV-06', serviceName: 'Abacus & Vedic Maths', schoolId: 'SCHOOL003', schoolName: 'St. Marys Academy', status: 'Active', assignedDate: '2026-03-01' },
];

const defaultPlans = [
  { id: 'PLAN-01', name: 'Basic Plan', maxStudents: 500, price: '0/yr', features: 'Attendance, Marks, Notices & Student Records' },
  { id: 'PLAN-02', name: 'Pro Plan', maxStudents: 1500, price: '0/yr', features: 'Basic + Online Fee Portal, SMS Gateway, Assignments' },
  { id: 'PLAN-03', name: 'Enterprise Plan', maxStudents: 5000, price: '0/yr', features: 'Pro + Custom Mobile App, GPS Tracking, Dedicated Support' },
];

const defaultSubscriptions = [
  { id: 'SUB-02', schoolId: 'SCHOOL002', school: 'Sri Sankara Vidhyasala Girls High School', plan: 'Enterprise Plan', startDate: '2026-02-15', endDate: '2027-02-14', status: 'ACTIVE', amount: '0/yr' },
  { id: 'SUB-01', schoolId: 'SCHOOL001', school: 'ABC Matriculation School', plan: 'Pro Plan', startDate: '2026-01-10', endDate: '2027-01-09', status: 'ACTIVE', amount: '0/yr' },
  { id: 'SUB-03', schoolId: 'SCHOOL003', school: 'St. Marys Academy', plan: 'Pro Plan', startDate: '2026-03-01', endDate: '2027-02-28', status: 'ACTIVE', amount: '0/yr' },
  { id: 'SUB-04', schoolId: 'SCHOOL005', school: 'Oxford International Academy', plan: 'Basic Plan', startDate: '2025-08-12', endDate: '2026-06-30', status: 'EXPIRED', amount: '0/yr' },
];

const defaultBills = [
  { invoiceNo: 'INV-2026-001', schoolId: 'SCHOOL002', school: 'Sri Sankara Vidhyasala Girls High School', plan: 'Enterprise Plan', amount: '0/yr', dueDate: '2026-02-20', paymentDate: '2026-02-16', status: 'PAID' },
  { invoiceNo: 'INV-2026-002', schoolId: 'SCHOOL001', school: 'ABC Matriculation School', plan: 'Pro Plan', amount: '0/yr', dueDate: '2026-01-15', paymentDate: '2026-01-12', status: 'PAID' },
  { invoiceNo: 'INV-2026-003', schoolId: 'SCHOOL003', school: 'St. Marys Academy', plan: 'Pro Plan', amount: '0/yr', dueDate: '2026-03-10', paymentDate: '2026-03-05', status: 'PAID' },
  { invoiceNo: 'INV-2026-005', schoolId: 'SCHOOL005', school: 'Oxford International Academy', plan: 'Basic Plan', amount: '0/yr', dueDate: '2026-06-15', paymentDate: null, status: 'OVERDUE' },
];

const defaultActivities = [
  { id: 'ACT-1', type: 'sub_activated', text: 'Enterprise Subscription activated for Sri Sankara Vidhyasala Girls High School', time: '1 day ago' },
  { id: 'ACT-2', type: 'payment_received', text: 'Payment received: 0/yr (Invoice INV-2026-001) from Sri Sankara Vidhyasala', time: '1 day ago' },
  { id: 'ACT-3', type: 'school_registered', text: 'New School Campus Registered: Delhi Public World School (DPW-CBE)', time: '3 days ago' },
  { id: 'ACT-4', type: 'school_activated', text: 'Campus status switched to Active for ABC Matriculation School', time: '5 days ago' },
];


export default function SuperAdminView({ activeTab = 'sa-dashboard', setActiveTab }) {
  const { impersonate } = useAuth();
  const [systemHealth, setSystemHealth] = useState({
    status: 'online',
    latency: '18ms',
    db: 'Connected (MongoDB Primary)',
    activeTenants: 5,
  });
  // Main Data States with initial demo defaults merged with local portal storage
  const [schools, setSchools] = useState(() => {
    try {
      const store = getPortalData();
      if (store && store.schools && store.schools.length > 0) {
        const storedIds = new Set(store.schools.map((s) => s.id));
        const remainingDefaults = defaultSchools.filter((s) => !storedIds.has(s.id));
        return [...store.schools, ...remainingDefaults];
      }
    } catch (e) {}
    return defaultSchools;
  });

  const [users, setUsers] = useState(() => {
    try {
      const store = getPortalData();
      if (store && store.users && store.users.length > 0) {
        const storedAdmins = store.users.filter((u) => u.role === 'SCHOOL_ADMIN' || u.role === 'SUPER_ADMIN');
        if (storedAdmins.length > 0) {
          const storedIds = new Set(storedAdmins.map((u) => u.id));
          const remainingDefaults = defaultUsers.filter((u) => !storedIds.has(u.id));
          return [...storedAdmins, ...remainingDefaults];
        }
      }
    } catch (e) {}
    return defaultUsers;
  });

  const [services, setServices] = useState(() => {
    try {
      const store = getPortalData();
      if (store && store.services && store.services.length > 0) {
        return store.services.map((s) => ({ ...s, icon: '', cost: '0/yr' }));
      }
    } catch (e) {}
    return defaultServices;
  });
  const [plans, setPlans] = useState(() => {
    try {
      const store = getPortalData();
      if (store && store.plans && store.plans.length > 0) {
        return store.plans.map((p) => ({ ...p, price: '0/yr' }));
      }
    } catch (e) {}
    return defaultPlans;
  });

  const [subscriptions, setSubscriptions] = useState(() => {
    try {
      const store = getPortalData();
      if (store && store.subscriptions && store.subscriptions.length > 0) {
        return store.subscriptions.map((s) => ({ ...s, amount: '0/yr' }));
      }
    } catch (e) {}
    return defaultSubscriptions;
  });

  const [bills, setBills] = useState(() => {
    try {
      const store = getPortalData();
      if (store && store.bills && store.bills.length > 0) {
        return store.bills.map((b) => ({ ...b, amount: '0/yr' }));
      }
    } catch (e) {}
    return defaultBills;
  });

  const [activities, setActivities] = useState(defaultActivities);

  // Filters & Search States
  const [schoolFilter, setSchoolFilter] = useState('All');
  const [schoolSearch, setSchoolSearch] = useState('');
  const [adminFilter, setAdminFilter] = useState('All');
  const [adminSearch, setAdminSearch] = useState('');
  const [serviceSearch, setServiceSearch] = useState('');
  const [selectedSchoolForServiceView, setSelectedSchoolForServiceView] = useState('All');
  const [activeInteractiveService, setActiveInteractiveService] = useState(null);
  const [subViewType, setSubViewType] = useState('subs'); // 'subs' or 'plans'
  const [subStatusFilter, setSubStatusFilter] = useState('All');
  const [billFilter, setBillFilter] = useState('All');
  const [settingsSection, setSettingsSection] = useState('platform');
  const [servicesMainSection, setServicesMainSection] = useState('available'); // 'available' | 'school-services' | 'management'
  const [schoolServiceFilter, setSchoolServiceFilter] = useState('All'); // 'All' | 'Active' | 'Inactive'
  const [schoolAssignments, setSchoolAssignments] = useState(() => {
    try {
      const store = getPortalData();
      if (store && store.schoolServiceAssignments && store.schoolServiceAssignments.length > 0) {
        return store.schoolServiceAssignments;
      }
    } catch (e) {}
    return defaultSchoolServiceAssignments;
  });
  const [isAssignServiceModalOpen, setIsAssignServiceModalOpen] = useState(false);
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [serviceFormData, setServiceFormData] = useState({
    name: '',
    icon: '',
    category: 'General',
    cost: '0/yr',
    description: '',
    status: 'Active',
    visibleRoles: ['schooladmin', 'teacher', 'student']
  });
  const [assignFormData, setAssignFormData] = useState({ serviceId: '', schoolId: '', status: 'Active' });

  // Modals States
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [isOverviewOpen, setIsOverviewOpen] = useState(false);
  const [selectedSchool, setSelectedSchool] = useState(null);
  const [activeCampusPortal, setActiveCampusPortal] = useState(null); // When super admin opens a school's full dashboards suite
  const [activeCampusRole, setActiveCampusRole] = useState('schooladmin'); // 'schooladmin' | 'principal' | 'teacher' | 'student' | 'parent'
  const [activeCampusTab, setActiveCampusTab] = useState('school-admin-users');
  const [isEditSchoolOpen, setIsEditSchoolOpen] = useState(false);
  const [isAdminProfileOpen, setIsAdminProfileOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [isAddAdminOpen, setIsAddAdminOpen] = useState(false);
  const [isAssignAdminOpen, setIsAssignAdminOpen] = useState(false);
  const [assignInitialAdminId, setAssignInitialAdminId] = useState(null);
  const [isSubModalOpen, setIsSubModalOpen] = useState(false);
  const [subModalTab, setSubModalTab] = useState('subscription');
  const [selectedPlanObj, setSelectedPlanObj] = useState(null);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [feedback, setFeedback] = useState({ isOpen: false, title: '', message: '' });
  const [cardDetailModal, setCardDetailModal] = useState({ isOpen: false, config: null });
  const [selectedInvoiceForPrint, setSelectedInvoiceForPrint] = useState(null);
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, title: '', message: '', onConfirm: () => {} });



  // Sync data from backend if available
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [schRes, plnRes, subRes, bilRes, usrRes] = await Promise.all([
          api.getSchools().catch(() => ({ success: false })),
          api.getPlans().catch(() => ({ success: false })),
          api.getSubscriptions().catch(() => ({ success: false })),
          api.getBills().catch(() => ({ success: false })),
          api.getUsers({ role: 'schooladmin' }).catch(() => ({ success: false })),
        ]);
        if (schRes.success && schRes.data && schRes.data.length > 0) {
          // Normalize school fields
          const mapped = schRes.data.map((s) => ({
            id: s.schoolId || s._id,
            name: s.name,
            code: s.code || `SCH-${s.schoolId}`,
            city: s.city || 'Tamil Nadu',
            phone: s.phone || '+91 94400 00000',
            email: s.email || 'contact@school.edu',
            principal: s.principalName || s.principal || 'Principal',
            academicYear: s.academicYear || '2026-2027',
            admin: s.email || 'admin@school.edu',
            adminName: s.principalName || 'Admin',
            status: s.status || 'Active',
            studentsCount: s.studentCount || s.studentsCount || 450,
            teachersCount: s.teacherCount || s.teachersCount || 25,
            parentsCount: s.parentsCount || 420,
            subscription: s.plan || 'Pro Plan',
            createdDate: s.joinedDate || s.createdAt?.split('T')[0] || '2026-01-15',
            board: s.board || 'State Board',
          }));
          setSchools((prev) => {
            const apiIds = new Set(mapped.map((m) => m.id));
            const localOnly = prev.filter((p) => !apiIds.has(p.id));
            return [...localOnly, ...mapped];
          });
        }
        if (plnRes.success && plnRes.data && plnRes.data.length > 0) {
          setPlans(plnRes.data.map((p) => ({
            id: p.planId || p._id,
            name: p.name,
            maxStudents: p.maxStudents || 1500,
            price: p.price.startsWith('₹') ? p.price : `₹${p.price}/yr`,
            features: Array.isArray(p.features) ? p.features.join(', ') : p.features,
          })));
        }
        if (subRes.success && subRes.data && subRes.data.length > 0) {
          const mappedSubs = subRes.data.map((sub) => ({
            id: sub.subscriptionId || sub._id,
            schoolId: sub.schoolId,
            school: sub.schoolName || 'School Campus',
            plan: sub.planName || 'Pro Plan',
            startDate: sub.startDate ? sub.startDate.split('T')[0] : '2026-01-01',
            endDate: sub.endDate ? sub.endDate.split('T')[0] : '2027-01-01',
            amount: typeof sub.amount === 'number' ? `₹${sub.amount.toLocaleString()}` : sub.amount,
            status: sub.status ? sub.status.toUpperCase() : 'ACTIVE',
          }));
          setSubscriptions((prev) => {
            const apiIds = new Set(mappedSubs.map((m) => m.id));
            const localOnly = prev.filter((p) => !apiIds.has(p.id));
            return [...localOnly, ...mappedSubs];
          });
        }
        if (bilRes.success && bilRes.data && bilRes.data.length > 0) {
          const mappedBills = bilRes.data.map((b) => ({
            invoiceNo: b.invoiceNo || b.billId,
            schoolId: b.schoolId,
            school: b.schoolName || 'School Campus',
            plan: b.planName || 'Pro Plan',
            amount: typeof b.amount === 'number' ? `₹${b.amount.toLocaleString()}` : b.amount,
            dueDate: b.dueDate ? b.dueDate.split('T')[0] : '2026-03-31',
            paymentDate: b.paymentDate ? b.paymentDate.split('T')[0] : null,
            status: b.status ? b.status.toUpperCase() : 'PENDING',
          }));
          setBills((prev) => {
            const apiIds = new Set(mappedBills.map((b) => b.invoiceNo));
            const localOnly = prev.filter((p) => !apiIds.has(p.invoiceNo));
            return [...localOnly, ...mappedBills];
          });
        }
        if (usrRes.success && usrRes.data && usrRes.data.length > 0) {
          const mappedUsers = usrRes.data.map((u) => ({
            id: u.userId || u._id,
            name: u.name,
            email: u.email,
            phone: u.phone,
            username: u.username,
            role: 'SCHOOL_ADMIN',
            schoolId: u.schoolId,
            schoolName: u.schoolName,
            status: u.status || 'Active',
            createdDate: u.createdAt ? u.createdAt.split('T')[0] : '2026-01-15',
          }));
          setUsers((prev) => {
            const apiIds = new Set(mappedUsers.map((m) => m.id));
            const localOnly = prev.filter((p) => !apiIds.has(p.id));
            return [...localOnly, ...mappedUsers];
          });
        }
      } catch (err) {
        console.warn('API sync notice:', err);
      }
    };
    fetchData();
  }, []);

  const showFeedback = (title, message) => {
    setFeedback({ isOpen: true, title, message });
  };

  // Activity icon matching getSaActivityIcon
  const renderActivityIcon = (type) => {
    switch (type) {
      case 'sub_activated':
        return (
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line>
          </svg>
        );
      case 'payment_received':
        return (
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
          </svg>
        );
      case 'school_registered':
        return (
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 21h18"></path><path d="M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16"></path>
          </svg>
        );
      case 'school_activated':
        return (
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
        );
      case 'school_deactivated':
        return (
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line>
          </svg>
        );
      default:
        return (
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3"></circle>
          </svg>
        );
    }
  };

  // Aggregates for 12 Dashboard cards
  const totalSchools = schools.length;
  const activeSchools = schools.filter((s) => s.status === 'Active').length;
  const inactiveSchools = schools.filter((s) => s.status !== 'Active').length;
  const schoolAdmins = users.filter((u) => u.role === 'SCHOOL_ADMIN');
  const totalSchoolAdmins = schoolAdmins.length;
  const activeSubs = subscriptions.filter((s) => s.status === 'ACTIVE' || s.status === 'Active').length;
  const expiringSubs = subscriptions.filter((s) => s.status === 'EXPIRED' || s.status === 'PENDING').length;
  const pendingBills = bills.filter((b) => b.status === 'PENDING' || b.status === 'OVERDUE').length;
  const totalRevenue = bills
    .filter((b) => b.status === 'PAID')
    .reduce((sum, b) => {
      const raw = typeof b.amount === 'string' ? b.amount.replace(/[^0-9]/g, '') : b.amount;
      return sum + (parseInt(raw) || 0);
    }, 0);
  const totalStudents = schools.reduce((sum, s) => sum + (s.studentsCount || 0), 0);
  const totalTeachers = schools.reduce((sum, s) => sum + (s.teachersCount || 0), 0);
  const totalParents = schools.reduce((sum, s) => sum + (s.parentsCount || 0), 0);
  const totalStaff = totalTeachers + totalSchoolAdmins + schools.length;

  // Toggle school active/inactive
  const handleToggleSchool = (id, newStatus) => {
    setSchools((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: newStatus } : s))
    );
    const target = schools.find((s) => s.id === id);
    setActivities((prev) => [
      {
        id: 'ACT-' + Date.now(),
        type: newStatus === 'Active' ? 'school_activated' : 'school_deactivated',
        text: `Campus status changed to ${newStatus} for ${target ? target.name : id}`,
        time: 'Just now',
      },
      ...prev,
    ]);
    showFeedback('Status Updated', `School status updated to ${newStatus}.`);
  };

  // Toggle admin active/inactive
  const handleToggleAdmin = (id, newStatus) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, status: newStatus } : u))
    );
    showFeedback('Admin Status Updated', `Administrator status set to ${newStatus}.`);
  };

  // Reset admin password
  const handleResetAdminPassword = (adminId) => {
    const admin = users.find((u) => u.id === adminId);
    if (!admin) return;
    const newPass = 'Zen@' + Math.floor(10000 + Math.random() * 90000);
    showFeedback('Password Reset', `Temporary password for ${admin.name} (${admin.email}):\n\n${newPass}`);
  };

  // Assign admin to school
  const handleAssignAdmin = (adminId, schoolId) => {
    const admin = users.find((u) => (u.id || u.userId) === adminId);
    const school = schools.find((s) => (s.id || s.schoolId) === schoolId);
    if (admin && school) {
      setUsers((prev) =>
        prev.map((u) =>
          (u.id || u.userId) === adminId
            ? { ...u, schoolId, schoolName: school.name }
            : u
        )
      );
      setSchools((prev) =>
        prev.map((s) =>
          (s.id || s.schoolId) === schoolId
            ? { ...s, admin: admin.email, adminName: admin.name }
            : s
        )
      );
      showFeedback('Admin Reassigned', `${admin.name} is now the assigned School Admin for ${school.name}.`);
    }
  };

  // Add new school admin
  const handleAddAdmin = (newAdmin) => {
    setUsers((prev) => [newAdmin, ...prev]);
    if (newAdmin.schoolId) {
      setSchools((prev) =>
        prev.map((s) =>
          (s.id || s.schoolId) === newAdmin.schoolId
            ? { ...s, admin: newAdmin.email, adminName: newAdmin.name }
            : s
        )
      );
    }
    showFeedback('Admin Created', `Admin ${newAdmin.name} created and assigned.`);
  };

  // Toggle service status
  const handleToggleService = (id) => {
    setServices((prev) =>
      prev.map((srv) =>
        srv.id === id
          ? { ...srv, status: srv.status === 'Active' ? 'Inactive' : 'Active' }
          : srv
      )
    );
  };

  // Mark bill paid
  const handleMarkBillPaid = (invoiceNo) => {
    const bill = bills.find((b) => b.invoiceNo === invoiceNo);
    if (bill) {
      setBills((prev) =>
        prev.map((b) =>
          b.invoiceNo === invoiceNo
            ? { ...b, status: 'PAID', paymentDate: new Date().toISOString().split('T')[0] }
            : b
        )
      );
      setActivities((prev) => [
        {
          id: 'ACT-' + Date.now(),
          type: 'payment_received',
          text: `Payment received: ${bill.amount} (${invoiceNo}) from ${bill.school}`,
          time: 'Just now',
        },
        ...prev,
      ]);
      showFeedback('Payment Recorded', `Invoice ${invoiceNo} marked as PAID.`);
    }
  };

  // Save new invoice
  const handleSaveInvoice = (newBill) => {
    setBills((prev) => [newBill, ...prev]);
    showFeedback('Invoice Generated', `Invoice ${newBill.invoiceNo} for ${newBill.school} generated.`);
  };

  // Save subscription or plan
  const handleSaveSubOrPlan = (event) => {
    if (event.type === 'subscription') {
      setSubscriptions((prev) => {
        const existingIdx = prev.findIndex(
          (s) => s.schoolId === event.data.schoolId || s.id === event.data.id || s.school === event.data.school
        );
        if (existingIdx >= 0) {
          const updated = [...prev];
          updated[existingIdx] = { ...updated[existingIdx], ...event.data };
          return updated;
        }
        return [event.data, ...prev];
      });

      // Update the school's subscription in schools list
      setSchools((prev) =>
        prev.map((s) => {
          if (s.id === event.data.schoolId || s.schoolId === event.data.schoolId || s.name === event.data.school) {
            const planObj = plans.find((p) => p.name === event.data.plan);
            const maxStudents = planObj ? planObj.maxStudents : (s.studentsCount || 450);
            return {
              ...s,
              subscription: event.data.plan,
              studentsCount: s.studentsCount || Math.min(450, maxStudents),
              teachersCount: s.teachersCount || 24,
              parentsCount: s.parentsCount || 410,
            };
          }
          return s;
        })
      );

      // Generate invoice & payment record for billing
      const newInvoice = {
        invoiceNo: 'INV-2026-0' + Math.floor(10 + Math.random() * 90),
        schoolId: event.data.schoolId,
        school: event.data.school,
        plan: event.data.plan,
        amount: event.data.amount,
        dueDate: event.data.endDate,
        paymentDate: event.data.status === 'ACTIVE' ? new Date().toISOString().split('T')[0] : null,
        status: event.data.status === 'ACTIVE' ? 'PAID' : 'PENDING',
      };
      setBills((prev) => [newInvoice, ...prev]);

      setActivities((prev) => [
        {
          id: 'ACT-' + Date.now(),
          type: 'sub_activated',
          text: `${event.data.plan} activated for ${event.data.school}`,
          time: 'Just now',
        },
        ...prev,
      ]);

      // Persist in portal storage
      try {
        const store = getPortalData();
        if (!store.subscriptions) store.subscriptions = [];
        const subIdx = store.subscriptions.findIndex(
          (s) => s.schoolId === event.data.schoolId || s.id === event.data.id || s.school === event.data.school
        );
        if (subIdx >= 0) {
          store.subscriptions[subIdx] = { ...store.subscriptions[subIdx], ...event.data };
        } else {
          store.subscriptions.unshift(event.data);
        }

        if (store.schools) {
          store.schools = store.schools.map((s) =>
            s.id === event.data.schoolId || s.name === event.data.school
              ? { ...s, subscription: event.data.plan }
              : s
          );
        }
        if (!store.bills) store.bills = [];
        store.bills.unshift(newInvoice);
        savePortalData(store);
      } catch (e) {}

      showFeedback(
        'Subscription & Payment Activated',
        `Subscription ${event.data.id} (${event.data.plan} - ${event.data.amount}) successfully activated for ${event.data.school}.\nInvoice ${newInvoice.invoiceNo} generated.`
      );
    } else if (event.type === 'plan') {
      if (event.isEdit) {
        setPlans((prev) => prev.map((p) => (p.id === event.data.id ? event.data : p)));
        showFeedback('Plan Updated', `Plan ${event.data.name} updated.`);
      } else {
        setPlans((prev) => [...prev, event.data]);
        showFeedback('Plan Created', `New plan tier ${event.data.name} added.`);
      }
    }
  };

  // Save onboarding school
  const handleSchoolOnboarded = (newSchool) => {
    setIsWizardOpen(false);

    // 1) Add school to Schools list
    setSchools((prev) => [newSchool, ...prev]);

    // 2) Create Administrator and add to Admin Management
    const adminEmail = newSchool.admin || newSchool.email || `admin@${(newSchool.code || 'school').toLowerCase().replace(/[^a-z0-9]/g, '')}.edu`;
    const adminUsername = newSchool.username || `admin_${(newSchool.code || 'school').toLowerCase().replace(/[^a-z0-9]/g, '').substring(0, 8)}`;
    const adminName = newSchool.adminName || `Admin ${newSchool.name}`;

    const createdAdmin = {
      id: 'USR0' + (users.length + 10) + Math.floor(10 + Math.random() * 89),
      name: adminName,
      email: adminEmail,
      phone: newSchool.phone || '+91 94400 00000',
      username: adminUsername,
      role: 'SCHOOL_ADMIN',
      schoolId: newSchool.id,
      schoolName: newSchool.name,
      status: 'Active',
      createdDate: new Date().toISOString().split('T')[0],
    };
    setUsers((prev) => [createdAdmin, ...prev]);

    // 3) Create Pending Subscription record so school immediately shows in Subscriptions
    const pendingSub = {
      id: 'SUB-' + (newSchool.code || newSchool.id).replace(/[^A-Z0-9]/gi, '').toUpperCase() + '-01',
      schoolId: newSchool.id,
      school: newSchool.name,
      plan: 'Pending Activation',
      startDate: new Date().toISOString().split('T')[0],
      endDate: '—',
      amount: 'Pending',
      status: 'PENDING',
    };
    setSubscriptions((prev) => [pendingSub, ...prev]);

    setActivities((prev) => [
      {
        id: 'ACT-' + Date.now(),
        type: 'school_registered',
        text: `New School Campus Onboarded: ${newSchool.name} (${newSchool.code})`,
        time: 'Just now',
      },
      ...prev,
    ]);

    // Persist all in portal local storage
    try {
      const store = getPortalData();
      if (!store.schools) store.schools = [];
      if (!store.users) store.users = [];
      if (!store.subscriptions) store.subscriptions = [];
      store.schools.unshift(newSchool);
      store.users.unshift(createdAdmin);
      store.subscriptions.unshift(pendingSub);
      savePortalData(store);
    } catch (e) {}

    showFeedback(
      'School Onboarded Successfully',
      `1. School "${newSchool.name}" registered in Schools Management.\n2. Administrator "${adminName}" created in Admin Management.\n3. School enrolled in Subscriptions as "Pending Activation" — you can activate their SaaS plan anytime!`
    );
  };

  // =========================================================================
  // Security & Governance Suite Handlers
  // =========================================================================
  // Filtered array calculations
  const filteredSchools = schools.filter((s) => {
    if (schoolFilter !== 'All' && s.status !== schoolFilter) return false;
    if (schoolSearch && !s.name.toLowerCase().includes(schoolSearch.toLowerCase()) && !(s.code || '').toLowerCase().includes(schoolSearch.toLowerCase()) && !(s.adminName || s.admin || '').toLowerCase().includes(schoolSearch.toLowerCase())) return false;
    return true;
  });

  const filteredAdmins = users.filter((u) => u.role === 'SCHOOL_ADMIN').filter((a) => {
    if (adminFilter !== 'All' && a.status !== adminFilter) return false;
    if (adminSearch && !a.name.toLowerCase().includes(adminSearch.toLowerCase()) && !a.email.toLowerCase().includes(adminSearch.toLowerCase())) return false;
    return true;
  });

  const filteredSubs = subscriptions.filter((s) => {
    if (subStatusFilter !== 'All' && s.status !== subStatusFilter) return false;
    return true;
  });

  const filteredBills = bills.filter((b) => {
    if (billFilter !== 'All' && b.status !== billFilter) return false;
    return true;
  });

  return (
    <div>
      {/* ===================================================================== */}
      {/* 1. SUPER ADMIN: DASHBOARD (sa-dashboard) */}
      {/* ===================================================================== */}
      {activeTab === 'sa-dashboard' && (
        <div>
          {/* Header Bar */}
          <div className="content-header">
            <h2 id="section-title">Super Admin Dashboard</h2>
            <div id="section-actions"></div>
          </div>

          <div id="portal-content">
            {/* Top 12 Summary SaaS Cards */}
            <div className="grid-4" style={{ marginBottom: '25px' }}>
              {/* 1. Total Schools */}
              <div
                className="portal-card clickable-card"
                style={{ borderLeftColor: '#2563eb' }}
                title="Click to view all registered schools"
                onClick={() =>
                  setCardDetailModal({
                    isOpen: true,
                    config: {
                      title: 'All Registered Schools',
                      subtitle: 'Comprehensive directory of onboarded multi-tenant campuses',
                      badgeColor: '#2563eb',
                      count: schools.length,
                      type: 'schools',
                      items: schools,
                      targetTab: 'sa-schools',
                      targetTabLabel: 'Schools Management',
                    },
                  })
                }
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--color-text-light)', fontWeight: 700 }}>Total Schools</div>
                  <span style={{ fontSize: '0.72rem', color: '#2563eb', fontWeight: 600 }}>View &rarr;</span>
                </div>
                <p style={{ fontSize: '1.8rem', fontWeight: 700, color: '#1e3a8a', margin: '4px 0' }}>{totalSchools}</p>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-success)', fontWeight: 600 }}>Platform Multi-Tenant</span>
              </div>

              {/* 2. Active Schools */}
              <div
                className="portal-card clickable-card"
                style={{ borderLeftColor: '#10b981' }}
                title="Click to view active operational schools"
                onClick={() => {
                  const items = schools.filter((s) => s.status === 'Active');
                  setCardDetailModal({
                    isOpen: true,
                    config: {
                      title: 'Active Schools',
                      subtitle: 'Currently operational and enabled campuses',
                      badgeColor: '#10b981',
                      count: items.length,
                      type: 'schools',
                      items,
                      targetTab: 'sa-schools',
                      targetTabLabel: 'Schools Management',
                    },
                  });
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--color-text-light)', fontWeight: 700 }}>Active Schools</div>
                  <span style={{ fontSize: '0.72rem', color: '#10b981', fontWeight: 600 }}>View &rarr;</span>
                </div>
                <p style={{ fontSize: '1.8rem', fontWeight: 700, color: '#047857', margin: '4px 0' }}>{activeSchools}</p>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-success)', fontWeight: 600 }}>Operational</span>
              </div>

              {/* 3. InActive Schools */}
              <div
                className="portal-card clickable-card"
                style={{ borderLeftColor: '#ef4444' }}
                title="Click to view suspended or inactive schools"
                onClick={() => {
                  const items = schools.filter((s) => s.status !== 'Active');
                  setCardDetailModal({
                    isOpen: true,
                    config: {
                      title: 'Inactive & Suspended Schools',
                      subtitle: 'Campuses pending activation or suspended for review',
                      badgeColor: '#ef4444',
                      count: items.length,
                      type: 'schools',
                      items,
                      targetTab: 'sa-schools',
                      targetTabLabel: 'Schools Management',
                    },
                  });
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--color-text-light)', fontWeight: 700 }}>InActive Schools</div>
                  <span style={{ fontSize: '0.72rem', color: '#dc2626', fontWeight: 600 }}>View &rarr;</span>
                </div>
                <p style={{ fontSize: '1.8rem', fontWeight: 700, color: '#b91c1c', margin: '4px 0' }}>{inactiveSchools}</p>
                <span style={{ fontSize: '0.75rem', color: '#dc2626', fontWeight: 600 }}>Suspended / Expired</span>
              </div>

              {/* 4. Total School Admins */}
              <div
                className="portal-card clickable-card"
                style={{ borderLeftColor: '#f59e0b' }}
                title="Click to view assigned school administrators"
                onClick={() =>
                  setCardDetailModal({
                    isOpen: true,
                    config: {
                      title: 'School Administrators',
                      subtitle: 'Assigned school head administrators & campus principals',
                      badgeColor: '#f59e0b',
                      count: schoolAdmins.length,
                      type: 'admins',
                      items: schoolAdmins,
                      targetTab: 'sa-admin-management',
                      targetTabLabel: 'Admin Management',
                    },
                  })
                }
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--color-text-light)', fontWeight: 700 }}>Total School Admins</div>
                  <span style={{ fontSize: '0.72rem', color: '#b45309', fontWeight: 600 }}>View &rarr;</span>
                </div>
                <p style={{ fontSize: '1.8rem', fontWeight: 700, color: '#b45309', margin: '4px 0' }}>{totalSchoolAdmins}</p>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-light)' }}>Assigned Admins</span>
              </div>

              {/* 5. Active Subscriptions */}
              <div
                className="portal-card clickable-card"
                style={{ borderLeftColor: '#10b981' }}
                title="Click to view active SaaS subscriptions"
                onClick={() => {
                  const items = subscriptions.filter((s) => s.status === 'ACTIVE' || s.status === 'Active');
                  setCardDetailModal({
                    isOpen: true,
                    config: {
                      title: 'Active SaaS Subscriptions',
                      subtitle: 'Campuses on active annual software subscriptions',
                      badgeColor: '#10b981',
                      count: items.length,
                      type: 'subscriptions',
                      items,
                      targetTab: 'sa-subscriptions',
                      targetTabLabel: 'Subscriptions',
                    },
                  });
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--color-text-light)', fontWeight: 700 }}>Active Subscriptions</div>
                  <span style={{ fontSize: '0.72rem', color: '#059669', fontWeight: 600 }}>View &rarr;</span>
                </div>
                <p style={{ fontSize: '1.8rem', fontWeight: 700, color: '#059669', margin: '4px 0' }}>{activeSubs}</p>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-success)', fontWeight: 600 }}>Paid SaaS Tier</span>
              </div>

              {/* 6. Expiring / Expired */}
              <div
                className="portal-card clickable-card"
                style={{ borderLeftColor: '#f97316' }}
                title="Click to view expired or pending renewal subscriptions"
                onClick={() => {
                  const items = subscriptions.filter((s) => s.status === 'EXPIRED' || s.status === 'PENDING');
                  setCardDetailModal({
                    isOpen: true,
                    config: {
                      title: 'Expiring / Expired Subscriptions',
                      subtitle: 'Subscriptions needing immediate renewal or activation',
                      badgeColor: '#f97316',
                      count: items.length,
                      type: 'subscriptions',
                      items,
                      targetTab: 'sa-subscriptions',
                      targetTabLabel: 'Subscriptions',
                    },
                  });
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--color-text-light)', fontWeight: 700 }}>Expiring / Expired</div>
                  <span style={{ fontSize: '0.72rem', color: '#c2410c', fontWeight: 600 }}>View &rarr;</span>
                </div>
                <p style={{ fontSize: '1.8rem', fontWeight: 700, color: '#c2410c', margin: '4px 0' }}>{expiringSubs}</p>
                <span style={{ fontSize: '0.75rem', color: '#ea580c', fontWeight: 600 }}>Action Required</span>
              </div>

              {/* 7. Pending Bills */}
              <div
                className="portal-card clickable-card"
                style={{ borderLeftColor: '#ef4444' }}
                title="Click to view pending or overdue invoices"
                onClick={() => {
                  const items = bills.filter((b) => b.status === 'PENDING' || b.status === 'OVERDUE');
                  setCardDetailModal({
                    isOpen: true,
                    config: {
                      title: 'Pending & Overdue Invoices',
                      subtitle: 'Invoices awaiting payment clearance from schools',
                      badgeColor: '#ef4444',
                      count: items.length,
                      type: 'bills',
                      items,
                      targetTab: 'sa-billing',
                      targetTabLabel: 'Billing Management',
                    },
                  });
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--color-text-light)', fontWeight: 700 }}>Pending Bills</div>
                  <span style={{ fontSize: '0.72rem', color: '#dc2626', fontWeight: 600 }}>View &rarr;</span>
                </div>
                <p style={{ fontSize: '1.8rem', fontWeight: 700, color: '#dc2626', margin: '4px 0' }}>{pendingBills}</p>
                <span style={{ fontSize: '0.75rem', color: '#dc2626', fontWeight: 600 }}>Invoices Unpaid</span>
              </div>

              {/* 8. Total Revenue */}
              <div
                className="portal-card clickable-card"
                style={{ borderLeftColor: '#059669' }}
                title="Click to view collected billing invoices"
                onClick={() => {
                  const items = bills.filter((b) => b.status === 'PAID');
                  setCardDetailModal({
                    isOpen: true,
                    config: {
                      title: 'Revenue Collections Breakdown',
                      subtitle: `Lifetime collected revenue from paid school licenses (Total: ₹${totalRevenue.toLocaleString()}/-)`,
                      badgeColor: '#059669',
                      count: items.length,
                      type: 'bills',
                      items,
                      targetTab: 'sa-billing',
                      targetTabLabel: 'Billing Management',
                    },
                  });
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--color-text-light)', fontWeight: 700 }}>Total Revenue</div>
                  <span style={{ fontSize: '0.72rem', color: '#047857', fontWeight: 600 }}>View &rarr;</span>
                </div>
                <p style={{ fontSize: '1.8rem', fontWeight: 700, color: '#047857', margin: '4px 0' }}>₹{totalRevenue.toLocaleString()}/-</p>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-success)', fontWeight: 600 }}>Lifetime Collections</span>
              </div>

              {/* 9. Total Students */}
              <div
                className="portal-card clickable-card"
                style={{ borderLeftColor: '#3b82f6' }}
                title="Click to view student population by school"
                onClick={() =>
                  setCardDetailModal({
                    isOpen: true,
                    config: {
                      title: 'Students Across Campuses',
                      subtitle: `Total of ${totalStudents.toLocaleString()} students enrolled across all active partner campuses`,
                      badgeColor: '#3b82f6',
                      count: schools.length,
                      type: 'people',
                      items: schools,
                      targetTab: 'sa-schools',
                      targetTabLabel: 'Schools Management',
                    },
                  })
                }
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--color-text-light)', fontWeight: 700 }}>Total Students</div>
                  <span style={{ fontSize: '0.72rem', color: '#1d4ed8', fontWeight: 600 }}>View &rarr;</span>
                </div>
                <p style={{ fontSize: '1.8rem', fontWeight: 700, color: '#1d4ed8', margin: '4px 0' }}>{totalStudents.toLocaleString()}</p>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-light)' }}>Across All Campuses</span>
              </div>

              {/* 10. Total Teachers */}
              <div
                className="portal-card clickable-card"
                style={{ borderLeftColor: '#8b5cf6' }}
                title="Click to view faculty distribution by school"
                onClick={() =>
                  setCardDetailModal({
                    isOpen: true,
                    config: {
                      title: 'Faculty Members by Campus',
                      subtitle: `Total of ${totalTeachers} teaching staff members across all campuses`,
                      badgeColor: '#8b5cf6',
                      count: schools.length,
                      type: 'people',
                      items: schools,
                      targetTab: 'sa-schools',
                      targetTabLabel: 'Schools Management',
                    },
                  })
                }
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--color-text-light)', fontWeight: 700 }}>Total Teachers</div>
                  <span style={{ fontSize: '0.72rem', color: '#6d28d9', fontWeight: 600 }}>View &rarr;</span>
                </div>
                <p style={{ fontSize: '1.8rem', fontWeight: 700, color: '#6d28d9', margin: '4px 0' }}>{totalTeachers}</p>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-light)' }}>Faculty Members</span>
              </div>

              {/* 11. Total Parents */}
              <div
                className="portal-card clickable-card"
                style={{ borderLeftColor: '#ec4899' }}
                title="Click to view parent registrations by school"
                onClick={() =>
                  setCardDetailModal({
                    isOpen: true,
                    config: {
                      title: 'Parent Guardians by Campus',
                      subtitle: `Total of ${totalParents.toLocaleString()} registered parent guardian accounts`,
                      badgeColor: '#ec4899',
                      count: schools.length,
                      type: 'people',
                      items: schools,
                      targetTab: 'sa-schools',
                      targetTabLabel: 'Schools Management',
                    },
                  })
                }
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--color-text-light)', fontWeight: 700 }}>Total Parents</div>
                  <span style={{ fontSize: '0.72rem', color: '#be185d', fontWeight: 600 }}>View &rarr;</span>
                </div>
                <p style={{ fontSize: '1.8rem', fontWeight: 700, color: '#be185d', margin: '4px 0' }}>{totalParents.toLocaleString()}</p>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-light)' }}>Registered Portals</span>
              </div>

              {/* 12. Total Staff */}
              <div
                className="portal-card clickable-card"
                style={{ borderLeftColor: '#6366f1' }}
                title="Click to view full staff breakdown"
                onClick={() =>
                  setCardDetailModal({
                    isOpen: true,
                    config: {
                      title: 'School Staff & Leadership Breakdown',
                      subtitle: `Total of ${totalStaff} staff (Admins, Faculty & School personnel)`,
                      badgeColor: '#6366f1',
                      count: schools.length,
                      type: 'people',
                      items: schools,
                      targetTab: 'sa-admin-management',
                      targetTabLabel: 'Admin Management',
                    },
                  })
                }
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--color-text-light)', fontWeight: 700 }}>Total Staff</div>
                  <span style={{ fontSize: '0.72rem', color: '#4338ca', fontWeight: 600 }}>View &rarr;</span>
                </div>
                <p style={{ fontSize: '1.8rem', fontWeight: 700, color: '#4338ca', margin: '4px 0' }}>{totalStaff}</p>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-light)' }}>Admins & Teachers</span>
              </div>
            </div>

            {/* Recent Activities */}
            <div style={{ marginTop: '35px' }}>
              <h3 style={{ color: 'var(--color-primary)', fontSize: '1.25rem', marginBottom: '12px' }}>Recent Platform Activities</h3>
              <div className="activity-timeline">
                {activities.map((act) => (
                  <div key={act.id} className="activity-item">
                    <span className="activity-icon-badge" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(30,58,138,0.06)', flexShrink: 0 }}>
                      {renderActivityIcon(act.type)}
                    </span>
                    <div>
                      <strong>{act.text}</strong>
                    </div>
                    <span className="activity-time">{act.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* 2. SUPER ADMIN: SCHOOLS (sa-schools) */}
      {/* ===================================================================== */}
      {activeTab === 'sa-schools' && (
        <div>
          {activeCampusPortal ? (
            /* =============================================================== */
            /* DEEP DIVE: FULL SCHOOL DASHBOARDS SUITE FOR SUPER ADMIN          */
            /* =============================================================== */
            <div className="sa-school-deep-dive">
              {/* Clean Structured Header Bar */}
              <div className="sa-campus-header-card" style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '16px 20px',
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                marginBottom: '20px',
                boxShadow: '0 2px 6px rgba(0, 0, 0, 0.04)',
                flexWrap: 'wrap',
                gap: '14px'
              }}>
                <div className="sa-campus-header-left" style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    onClick={() => setActiveCampusPortal(null)}
                    className="btn btn-outline"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '8px 16px',
                      fontWeight: 700,
                      color: 'var(--color-primary, #1e3a8a)',
                      borderColor: '#cbd5e1',
                      borderRadius: '8px',
                      background: '#f8fafc',
                      cursor: 'pointer'
                    }}
                    title="Return to Schools Management table"
                  >
                    <span style={{ fontSize: '1.1rem' }}>&larr;</span> Back to All Schools
                  </button>

                  <div className="sa-campus-header-info" style={{ borderLeft: '1px solid #e2e8f0', paddingLeft: '14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-primary, #1e3a8a)' }}>
                        {activeCampusPortal.name}
                      </h2>
                      <span className="badge badge-info" style={{ fontWeight: 700 }}>
                        {activeCampusPortal.code || 'CAMPUS'}
                      </span>
                      <span className="badge badge-success">
                        {activeCampusPortal.subscription || 'Enterprise Plan'}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '4px', lineHeight: 1.4 }}>
                      Partition ID: <code>{activeCampusPortal.id}</code> &bull; City: <strong>{activeCampusPortal.city || 'Tamil Nadu'}</strong> &bull; Students: <strong>{activeCampusPortal.studentsCount || 450}</strong> &bull; Teachers: <strong>{activeCampusPortal.teachersCount || 25}</strong>
                    </div>
                  </div>
                </div>

                <div className="sa-campus-header-badge" style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: '#f5f3ff',
                  border: '1px solid #ddd6fe',
                  color: '#6d28d9',
                  padding: '6px 14px',
                  borderRadius: '20px',
                  fontSize: '0.82rem',
                  fontWeight: 700
                }}>
                  <span>⚡ Super Admin Access</span>
                </div>
              </div>

              {/* Structured Role Navigation Tabs */}
              <div style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '16px 20px',
                marginBottom: '20px',
                boxShadow: '0 2px 6px rgba(0, 0, 0, 0.04)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
                  <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Select Dashboard Perspective
                  </div>
                </div>

                <div style={{
                  display: 'flex',
                  gap: '8px',
                  flexWrap: 'wrap',
                  borderBottom: '1px solid #f1f5f9',
                  paddingBottom: '14px',
                  marginBottom: '14px'
                }}>
                  {[
                    { id: 'schooladmin', label: 'School Admin Dashboard', defaultTab: 'school-admin-users' },
                    { id: 'principal', label: 'Principal Dashboard', defaultTab: 'attendance-reports' },
                    { id: 'teacher', label: 'Faculty / Teacher', defaultTab: 'my-classes' },
                    { id: 'student', label: 'Student Portal', defaultTab: 'view-dashboard' },
                    { id: 'parent', label: 'Parent Portal', defaultTab: 'child-information' },
                  ].map((roleItem) => {
                    const isActive = activeCampusRole === roleItem.id;
                    return (
                      <button
                        key={roleItem.id}
                        type="button"
                        onClick={() => {
                          setActiveCampusRole(roleItem.id);
                          setActiveCampusTab(roleItem.defaultTab);
                        }}
                        style={{
                          padding: '8px 18px',
                          borderRadius: '8px',
                          fontSize: '0.88rem',
                          fontWeight: isActive ? 700 : 600,
                          border: isActive ? '1px solid #7c3aed' : '1px solid #e2e8f0',
                          background: isActive ? '#7c3aed' : '#ffffff',
                          color: isActive ? '#ffffff' : '#475569',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '8px',
                          boxShadow: isActive ? '0 2px 6px rgba(124, 58, 237, 0.25)' : 'none',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <span>{roleItem.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Sub-tab Navigation for the selected role */}
                <div style={{
                  display: 'flex',
                  gap: '8px',
                  flexWrap: 'wrap',
                  alignItems: 'center'
                }}>
                  {activeCampusRole === 'schooladmin' && (
                    <>
                      <button className={`btn btn-sm ${activeCampusTab === 'school-admin-users' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setActiveCampusTab('school-admin-users')}>DashBoard</button>
                      <button className={`btn btn-sm ${activeCampusTab === 'finance-management' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setActiveCampusTab('finance-management')} style={{ fontWeight: 700 }}>Finance Manage</button>
                      <button className={`btn btn-sm ${activeCampusTab === 'school-services-tab' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setActiveCampusTab('school-services-tab')}>Campus Services & Activities</button>
                      <button className={`btn btn-sm ${activeCampusTab === 'manage-staff' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setActiveCampusTab('manage-staff')}>Manage Staff</button>
                      <button className={`btn btn-sm ${activeCampusTab === 'manage-students' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setActiveCampusTab('manage-students')}>Manage Students</button>
                      <button className={`btn btn-sm ${activeCampusTab === 'manage-parents' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setActiveCampusTab('manage-parents')}>Manage Parents</button>
                      <button className={`btn btn-sm ${activeCampusTab === 'manage-classes' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setActiveCampusTab('manage-classes')}>Manage Classes</button>
                      <button className={`btn btn-sm ${activeCampusTab === 'manage-subjects' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setActiveCampusTab('manage-subjects')}>Manage Subjects</button>
                      <button className={`btn btn-sm ${activeCampusTab === 'fee-collection-tracker' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setActiveCampusTab('fee-collection-tracker')}>Fee Collection & Dues</button>
                      <button className={`btn btn-sm ${activeCampusTab === 'publish-announcements' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setActiveCampusTab('publish-announcements')}>Announcements</button>
                      <button className={`btn btn-sm ${activeCampusTab === 'view-reports' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setActiveCampusTab('view-reports')}>School Reports</button>
                      <button className={`btn btn-sm ${activeCampusTab === 'secure-messaging' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setActiveCampusTab('secure-messaging')}>Secure Messaging</button>
                    </>
                  )}
                  {activeCampusRole === 'principal' && (
                    <>
                      <button className={`btn btn-sm ${activeCampusTab === 'dashboard-analytics' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setActiveCampusTab('dashboard-analytics')}>Dashboard Analytics</button>
                      <button className={`btn btn-sm ${activeCampusTab === 'attendance-reports' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setActiveCampusTab('attendance-reports')}>Attendance Reports</button>
                      <button className={`btn btn-sm ${activeCampusTab === 'track-exams' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setActiveCampusTab('track-exams')}>Examination Schedule & Dates</button>
                      <button className={`btn btn-sm ${activeCampusTab === 'principal-services-tab' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setActiveCampusTab('principal-services-tab')}>Enrichment Programs & Services</button>
                      <button className={`btn btn-sm ${activeCampusTab === 'staff-leave-approvals' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setActiveCampusTab('staff-leave-approvals')}>Staff Leave Approvals</button>
                      <button className={`btn btn-sm ${activeCampusTab === 'school-announcements' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setActiveCampusTab('school-announcements')}>School Announcements</button>
                      <button className={`btn btn-sm ${activeCampusTab === 'communication-teachers' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setActiveCampusTab('communication-teachers')}>Communication with Teachers</button>
                    </>
                  )}
                  {activeCampusRole === 'teacher' && (
                    <>
                      <button className={`btn btn-sm ${activeCampusTab === 'my-classes' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setActiveCampusTab('my-classes')}>My Classes</button>
                      <button className={`btn btn-sm ${activeCampusTab === 'teacher-services-tab' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setActiveCampusTab('teacher-services-tab')}>Activities & Service Labs</button>
                      <button className={`btn btn-sm ${activeCampusTab === 'student-list' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setActiveCampusTab('student-list')}>Student List</button>
                      <button className={`btn btn-sm ${activeCampusTab === 'attendance-management' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setActiveCampusTab('attendance-management')}>Attendance Management</button>
                      <button className={`btn btn-sm ${activeCampusTab === 'track-exams' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setActiveCampusTab('track-exams')}>Exam Schedule & Dates</button>
                      <button className={`btn btn-sm ${activeCampusTab === 'assignments' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setActiveCampusTab('assignments')}>Homework & Assignments</button>
                      <button className={`btn btn-sm ${activeCampusTab === 'study-materials' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setActiveCampusTab('study-materials')}>Study Materials</button>
                      <button className={`btn btn-sm ${activeCampusTab === 'announcements' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setActiveCampusTab('announcements')}>Announcements</button>
                      <button className={`btn btn-sm ${activeCampusTab === 'leave-request' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setActiveCampusTab('leave-request')}>Leave Requests & Approvals</button>
                      <button className={`btn btn-sm ${activeCampusTab === 'secure-messaging' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setActiveCampusTab('secure-messaging')}>Secure Messaging</button>
                      <button className={`btn btn-sm ${activeCampusTab === 'timetable' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setActiveCampusTab('timetable')}>Timetable</button>
                    </>
                  )}
                  {activeCampusRole === 'student' && (
                    <>
                      <button className={`btn btn-sm ${activeCampusTab === 'view-dashboard' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setActiveCampusTab('view-dashboard')}>View Dashboard</button>
                      <button className={`btn btn-sm ${activeCampusTab === 'student-services-tab' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setActiveCampusTab('student-services-tab')}>My Active Services & Play</button>
                      <button className={`btn btn-sm ${activeCampusTab === 'check-attendance' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setActiveCampusTab('check-attendance')}>Check Attendance</button>
                      <button className={`btn btn-sm ${activeCampusTab === 'view-timetable' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setActiveCampusTab('view-timetable')}>View Timetable</button>
                      <button className={`btn btn-sm ${activeCampusTab === 'download-materials' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setActiveCampusTab('download-materials')}>Study Materials</button>
                      <button className={`btn btn-sm ${activeCampusTab === 'submit-assignments' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setActiveCampusTab('submit-assignments')}>Submit Homework & Assignments</button>
                      <button className={`btn btn-sm ${activeCampusTab === 'view-homework' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setActiveCampusTab('view-homework')}>View Homework</button>
                      <button className={`btn btn-sm ${activeCampusTab === 'receive-announcements' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setActiveCampusTab('receive-announcements')}>Announcements</button>
                      <button className={`btn btn-sm ${activeCampusTab === 'chat-teachers' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setActiveCampusTab('chat-teachers')}>Chat with Teachers</button>
                      <button className={`btn btn-sm ${activeCampusTab === 'track-exams' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setActiveCampusTab('track-exams')}>Track Upcoming Exams</button>
                    </>
                  )}
                  {activeCampusRole === 'parent' && (
                    <>
                      <button className={`btn btn-sm ${activeCampusTab === 'child-information' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setActiveCampusTab('child-information')}>Child Information</button>
                      <button className={`btn btn-sm ${activeCampusTab === 'parent-services-tab' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setActiveCampusTab('parent-services-tab')}>Student Enrolled Services</button>
                      <button className={`btn btn-sm ${activeCampusTab === 'attendance-tracking' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setActiveCampusTab('attendance-tracking')}>Attendance Tracking</button>
                      <button className={`btn btn-sm ${activeCampusTab === 'homework' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setActiveCampusTab('homework')}>Homework & Assignments</button>
                      <button className={`btn btn-sm ${activeCampusTab === 'track-exams' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setActiveCampusTab('track-exams')}>Upcoming Exam Schedule</button>
                      <button className={`btn btn-sm ${activeCampusTab === 'exam-results' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setActiveCampusTab('exam-results')}>Exam Results & Report Card</button>
                      <button className={`btn btn-sm ${activeCampusTab === 'fee-reminders' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setActiveCampusTab('fee-reminders')}>Fee Payments</button>
                      <button className={`btn btn-sm ${activeCampusTab === 'school-announcements' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setActiveCampusTab('school-announcements')}>School Announcements</button>
                      <button className={`btn btn-sm ${activeCampusTab === 'messaging-teachers' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setActiveCampusTab('messaging-teachers')}>Messaging with Teachers</button>
                    </>
                  )}
                </div>
              </div>

              {/* Live Rendered View */}
              <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '20px', minHeight: '600px' }}>
                {activeCampusRole === 'schooladmin' ? (
                  <SchoolAdminView activeTab={activeCampusTab} setActiveTab={setActiveCampusTab} />
                ) : (
                  <AcademicRolesView
                    role={activeCampusRole}
                    user={{
                      name: `Super Admin Viewing (${activeCampusPortal.name})`,
                      role: activeCampusRole.toUpperCase(),
                      schoolId: activeCampusPortal.id,
                      schoolName: activeCampusPortal.name,
                    }}
                    activeTab={activeCampusTab}
                    setActiveTab={setActiveCampusTab}
                  />
                )}
              </div>
            </div>
          ) : (
            /* =============================================================== */
            /* STANDARD SCHOOLS DIRECTORY TABLE VIEW                           */
            /* =============================================================== */
            <>
              <div className="content-header">
                <h2 id="section-title">Schools Management</h2>
                <div id="section-actions"></div>
              </div>

              <div id="portal-content">
                {/* Modern SaaS Schools Toolbar */}
                <div className="sa-schools-toolbar">
              <div className="sa-filter-segment">
                <button
                  type="button"
                  className={`sa-filter-tab ${schoolFilter === 'All' ? 'active' : ''}`}
                  onClick={() => setSchoolFilter('All')}
                >
                  <span>All Schools</span>
                  <span className="sa-tab-badge" id="badge-all-schools">{schools.length}</span>
                </button>
                <button
                  type="button"
                  className={`sa-filter-tab ${schoolFilter === 'Active' ? 'active' : ''}`}
                  onClick={() => setSchoolFilter('Active')}
                >
                  <span>Active</span>
                  <span className="sa-tab-badge badge-green" id="badge-active-schools">{activeSchools}</span>
                </button>
                <button
                  type="button"
                  className={`sa-filter-tab ${schoolFilter === 'Inactive' ? 'active' : ''}`}
                  onClick={() => setSchoolFilter('Inactive')}
                >
                  <span>Inactive</span>
                  <span className="sa-tab-badge badge-rose" id="badge-inactive-schools">{inactiveSchools}</span>
                </button>
              </div>

              <div className="sa-toolbar-right">
                <div className="sa-search-wrap">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  </svg>
                  <input
                    type="text"
                    className="sa-search-input"
                    placeholder="Search schools by name, code, city, admin..."
                    value={schoolSearch}
                    onChange={(e) => setSchoolSearch(e.target.value)}
                  />
                </div>
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={() => setIsWizardOpen(true)}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '9px 16px' }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                  Add School
                </button>
              </div>
            </div>

            <div className="table-responsive">
              <table className="sa-schools-table">
                <thead>
                  <tr>
                    <th style={{ minWidth: '220px' }}>School Name</th>
                    <th>School Code</th>
                    <th>Admin</th>
                    <th>Students</th>
                    <th>Teachers</th>
                    <th>Subscription</th>
                    <th>Status</th>
                    <th>Created Date</th>
                    <th style={{ textAlign: 'center', minWidth: '240px' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSchools.map((s) => (
                    <tr key={s.id} className="sa-school-row" data-status={s.status}>
                      <td
                        data-label="School Name"
                        className="school-meta-line"
                        style={{ cursor: 'pointer', verticalAlign: 'middle' }}
                        title="Click to view all dashboards of this school"
                        onClick={() => {
                          setActiveCampusPortal(s);
                          setActiveCampusRole('schooladmin');
                          setActiveCampusTab('school-admin-users');
                        }}
                      >
                        <div className="school-meta-content">
                          <strong style={{ color: 'var(--color-primary, #1e3a8a)', fontSize: '0.94rem', display: 'block', lineHeight: 1.3 }}>
                            {s.name}
                          </strong>
                          <small style={{ color: '#64748b', fontSize: '0.78rem', display: 'block', marginTop: '2px' }}>{s.city || 'Tamil Nadu'}</small>
                        </div>
                      </td>
                      <td data-label="School Code"><span className="badge badge-info">{s.code || ''}</span></td>
                      <td data-label="Admin" className="school-meta-line">
                        <div className="school-meta-content">
                          <strong style={{ display: 'block' }}>{s.adminName || s.admin || 'Unassigned'}</strong>
                          <small style={{ display: 'block', marginTop: '2px' }}>{s.admin || ''}</small>
                        </div>
                      </td>
                      <td data-label="Students">{s.studentsCount || 0}</td>
                      <td data-label="Teachers">{s.teachersCount || 0}</td>
                      <td data-label="Subscription">
                        <span
                          className={`badge ${s.subscription === 'Pending Activation' ? 'badge-warning' : 'badge-info'}`}
                          style={s.subscription === 'Pending Activation' ? { cursor: 'pointer' } : {}}
                          title={s.subscription === 'Pending Activation' ? 'Click to activate SaaS subscription' : ''}
                          onClick={() => {
                            if (s.subscription === 'Pending Activation') {
                              setSelectedPlanObj({ schoolId: s.id, schoolName: s.name });
                              setSubModalTab('subscription');
                              setIsSubModalOpen(true);
                            }
                          }}
                        >
                          {s.subscription || 'Pending Activation'}
                          {s.subscription === 'Pending Activation' ? ' ⚡' : ''}
                        </span>
                      </td>
                      <td data-label="Status">
                        <span className={`badge ${s.status === 'Active' ? 'badge-success' : s.status === 'Pending' ? 'badge-warning' : 'badge-danger'}`}>
                          {s.status}
                        </span>
                      </td>
                      <td data-label="Created Date">{s.createdDate || '2026-01-01'}</td>
                      <td data-label="Actions" style={{ textAlign: 'center' }}>
                        <div className="sa-actions-cell">
                          <button
                            type="button"
                            className="sa-tbl-action"
                            style={{ color: '#4338ca', borderColor: '#818cf8', background: '#e0e7ff', fontWeight: 700 }}
                            title={`Open all dashboards for ${s.name} directly as Super Admin`}
                            onClick={() => {
                              setActiveCampusPortal(s);
                              setActiveCampusRole('schooladmin');
                              setActiveCampusTab('school-admin-users');
                            }}
                          >
                            📊 Dashboards
                          </button>
                          {s.subscription === 'Pending Activation' && (
                            <button
                              type="button"
                              className="sa-tbl-action"
                              style={{ color: '#047857', borderColor: '#10b981', background: '#ecfdf5', fontWeight: 600 }}
                              title="Activate SaaS Subscription"
                              onClick={() => {
                                setSelectedPlanObj({ schoolId: s.id, schoolName: s.name });
                                setSubModalTab('subscription');
                                setIsSubModalOpen(true);
                              }}
                            >
                              ⚡ Plan
                            </button>
                          )}
                          <button
                            type="button"
                            className="sa-tbl-action view"
                            title="View Campus Details"
                            onClick={() => { setSelectedSchool(s); setIsOverviewOpen(true); }}
                          >
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
                            </svg>
                            <span>View</span>
                          </button>
                          <button
                            type="button"
                            className="sa-tbl-action edit"
                            title="Edit School Information"
                            onClick={() => { setSelectedSchool(s); setIsEditSchoolOpen(true); }}
                          >
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                            </svg>
                            <span>Edit</span>
                          </button>
                          {s.status === 'Active' ? (
                            <button
                              type="button"
                              className="sa-tbl-action danger"
                              title="Deactivate School"
                              onClick={() => handleToggleSchool(s.id, 'Inactive')}
                            >
                              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="10" /><line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
                              </svg>
                              <span>Deactivate</span>
                            </button>
                          ) : (
                            <button
                              type="button"
                              className="sa-tbl-action success"
                              title="Activate School"
                              onClick={() => handleToggleSchool(s.id, 'Active')}
                            >
                              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
                              </svg>
                              <span>Activate</span>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
            </>
          )}
        </div>
      )}

      {/* ===================================================================== */}
      {/* 3. SUPER ADMIN: ADMIN MANAGEMENT (sa-admin-management) */}
      {/* ===================================================================== */}
      {activeTab === 'sa-admin-management' && (
        <div>
          <div className="content-header">
            <h2 id="section-title">Admin Management</h2>
            <div id="section-actions"></div>
          </div>

          <div id="portal-content">
            <div className="sa-schools-header-bar">
              <div className="sa-filter-segment">
                <button
                  className={`sa-filter-tab ${adminFilter === 'All' ? 'active' : ''}`}
                  onClick={() => setAdminFilter('All')}
                >
                  All Admins <span className="sa-tab-badge">{schoolAdmins.length}</span>
                </button>
                <button
                  className={`sa-filter-tab ${adminFilter === 'Active' ? 'active' : ''}`}
                  onClick={() => setAdminFilter('Active')}
                >
                  Active <span className="sa-tab-badge badge-green">{schoolAdmins.filter((a) => a.status === 'Active').length}</span>
                </button>
                <button
                  className={`sa-filter-tab ${adminFilter === 'Inactive' ? 'active' : ''}`}
                  onClick={() => setAdminFilter('Inactive')}
                >
                  Inactive <span className="sa-tab-badge badge-rose">{schoolAdmins.filter((a) => a.status !== 'Active').length}</span>
                </button>
              </div>
              <div className="sa-toolbar-right">
                <div className="sa-search-wrap">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                  <input
                    type="text"
                    className="sa-search-input"
                    placeholder="Search admins by name, email, campus..."
                    value={adminSearch}
                    onChange={(e) => setAdminSearch(e.target.value)}
                  />
                </div>
                <button className="btn btn-primary btn-sm" onClick={() => setIsAddAdminOpen(true)}>
                  + Add Admin
                </button>
              </div>
            </div>

            <div className="table-responsive">
              <table className="sa-schools-table" style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0 }}>
                <thead>
                  <tr>
                    <th style={{ minWidth: '220px', padding: '12px 16px' }}>Admin Profile</th>
                    <th style={{ minWidth: '180px', padding: '12px 16px' }}>Official Email</th>
                    <th style={{ minWidth: '200px', padding: '12px 16px' }}>Assigned Campus</th>
                    <th style={{ minWidth: '100px', textAlign: 'center', padding: '12px 16px' }}>Status</th>
                    <th style={{ minWidth: '120px', padding: '12px 16px' }}>Created Date</th>
                    <th style={{ minWidth: '240px', textAlign: 'center', padding: '12px 16px' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAdmins.length === 0 ? (
                    <tr>
                      <td colSpan="6" style={{ textAlign: 'center', padding: '30px', color: '#64748b' }}>
                        No campus administrators found matching the criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredAdmins.map((a) => (
                      <tr key={a.id} className="sa-admin-row" data-status={a.status}>
                        <td data-label="Admin Profile" className="sa-admin-profile-cell" style={{ verticalAlign: 'middle', padding: '12px 16px' }}>
                          <div className="sa-admin-profile-inner" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{
                              width: '36px',
                              height: '36px',
                              borderRadius: '8px',
                              background: '#eff6ff',
                              color: 'var(--color-primary, #1e3a8a)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontWeight: 700,
                              fontSize: '0.9rem',
                              border: '1px solid #dbeafe',
                              flexShrink: 0
                            }}>
                              {a.name ? a.name.charAt(0).toUpperCase() : 'A'}
                            </div>
                            <div className="school-meta-line">
                              <strong style={{ color: '#0f172a', fontSize: '0.92rem', display: 'block' }}>{a.name}</strong>
                              <small style={{ color: '#64748b', fontSize: '0.78rem' }}>Username: <code style={{ color: '#2563eb' }}>{a.username}</code></small>
                            </div>
                          </div>
                        </td>
                        <td data-label="Official Email" style={{ verticalAlign: 'middle', padding: '12px 16px', color: '#334155' }}>
                          <span style={{ fontSize: '0.86rem' }}>{a.email}</span>
                          {a.phone && <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>{a.phone}</div>}
                        </td>
                        <td data-label="Assigned Campus" style={{ verticalAlign: 'middle', padding: '12px 16px' }}>
                          <div className="school-meta-line">
                            <strong style={{ color: '#1e293b', fontSize: '0.88rem', display: 'block' }}>{a.schoolName || 'Unassigned'}</strong>
                            {a.schoolId && <span className="badge badge-info" style={{ marginTop: '3px', display: 'inline-block' }}>{a.schoolId}</span>}
                          </div>
                        </td>
                        <td data-label="Status" style={{ textAlign: 'center', verticalAlign: 'middle', padding: '12px 16px' }}>
                          <span className={`badge ${a.status === 'Active' ? 'badge-success' : 'badge-warning'}`}>
                            {a.status}
                          </span>
                        </td>
                        <td data-label="Created Date" style={{ verticalAlign: 'middle', padding: '12px 16px', color: '#475569', fontSize: '0.84rem' }}>
                          {a.createdDate || '2026-01-01'}
                        </td>
                        <td data-label="Actions" style={{ textAlign: 'center', verticalAlign: 'middle', padding: '12px 16px' }}>
                          <div className="sa-actions-cell" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                            <button
                              type="button"
                              className="sa-tbl-action view"
                              onClick={() => { setSelectedAdmin(a); setIsAdminProfileOpen(true); }}
                              title="View Profile"
                            >
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
                              </svg>
                              <span>View</span>
                            </button>
                            <button
                              type="button"
                              className="sa-tbl-action edit"
                              onClick={() => { setAssignInitialAdminId(a.id); setIsAssignAdminOpen(true); }}
                              title="Reassign Campus"
                            >
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="8.5" cy="7" r="4" /><polyline points="17 11 19 13 23 9" />
                              </svg>
                              <span>Reassign</span>
                            </button>
                            {a.status === 'Active' ? (
                              <button
                                type="button"
                                className="sa-tbl-action danger"
                                onClick={() => handleToggleAdmin(a.id, 'Inactive')}
                                title="Deactivate Account"
                              >
                                Deactivate
                              </button>
                            ) : (
                              <button
                                type="button"
                                className="sa-tbl-action success"
                                onClick={() => handleToggleAdmin(a.id, 'Active')}
                                title="Activate Account"
                              >
                                Activate
                              </button>
                            )}
                            <button
                              type="button"
                              className="sa-tbl-action admin"
                              onClick={() => handleResetAdminPassword(a.id)}
                              title="Reset Password"
                            >
                              Reset
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
        </div>
      )}

      {/* ===================================================================== */}
      {/* 4. SUPER ADMIN: SERVICES (sa-services) */}
      {/* ===================================================================== */}
      {activeTab === 'sa-services' && (
        <div>
          <div className="content-header" style={{ marginBottom: '18px' }}>
            <div>
              <h2 id="section-title">Enrichment & Extracurricular Services</h2>
            </div>
          </div>

          {/* Three Level Primary Services Navigation */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '12px',
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            padding: '10px 14px',
            marginBottom: '20px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            flexWrap: 'wrap'
          }}>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => setServicesMainSection('available')}
                style={{
                  padding: '9px 18px',
                  borderRadius: '8px',
                  border: 'none',
                  background: servicesMainSection === 'available' ? 'var(--color-primary, #1e3a8a)' : '#f8fafc',
                  color: servicesMainSection === 'available' ? '#ffffff' : '#475569',
                  fontWeight: servicesMainSection === 'available' ? 700 : 600,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.15s ease'
                }}
              >
                <span>Available Services</span>
                <span style={{
                  background: servicesMainSection === 'available' ? 'rgba(255,255,255,0.25)' : '#e2e8f0',
                  color: servicesMainSection === 'available' ? '#ffffff' : '#334155',
                  padding: '1px 7px',
                  borderRadius: '10px',
                  fontSize: '0.74rem'
                }}>
                  {services.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setServicesMainSection('school-services')}
                style={{
                  padding: '9px 18px',
                  borderRadius: '8px',
                  border: 'none',
                  background: servicesMainSection === 'school-services' ? 'var(--color-primary, #1e3a8a)' : '#f8fafc',
                  color: servicesMainSection === 'school-services' ? '#ffffff' : '#475569',
                  fontWeight: servicesMainSection === 'school-services' ? 700 : 600,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.15s ease'
                }}
              >
                <span>School Services</span>
                <span style={{
                  background: servicesMainSection === 'school-services' ? 'rgba(255,255,255,0.25)' : '#e2e8f0',
                  color: servicesMainSection === 'school-services' ? '#ffffff' : '#334155',
                  padding: '1px 7px',
                  borderRadius: '10px',
                  fontSize: '0.74rem'
                }}>
                  {schoolAssignments.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setServicesMainSection('management')}
                style={{
                  padding: '9px 18px',
                  borderRadius: '8px',
                  border: 'none',
                  background: servicesMainSection === 'management' ? 'var(--color-primary, #1e3a8a)' : '#f8fafc',
                  color: servicesMainSection === 'management' ? '#ffffff' : '#475569',
                  fontWeight: servicesMainSection === 'management' ? 700 : 600,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.15s ease'
                }}
              >
                <span>Management Services</span>
              </button>
            </div>

            {/* Search Bar with Search Icon */}
            <div style={{ position: 'relative', minWidth: '260px' }}>
              <span style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#64748b',
                display: 'flex',
                alignItems: 'center',
                pointerEvents: 'none'
              }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </span>
              <input
                type="text"
                value={serviceSearch}
                onChange={(e) => setServiceSearch(e.target.value)}
                placeholder="Search services or categories..."
                style={{
                  width: '100%',
                  padding: '8px 12px 8px 34px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.86rem',
                  background: '#f8fafc',
                  outline: 'none',
                  color: '#0f172a'
                }}
              />
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
                    color: '#94a3b8',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    padding: 0
                  }}
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* 1. AVAILABLE SERVICES SECTION */}
          {servicesMainSection === 'available' && (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '18px' }}>
                {services
                  .filter((srv) => {
                    if (!serviceSearch.trim()) return true;
                    const query = serviceSearch.toLowerCase();
                    return (
                      srv.name.toLowerCase().includes(query) ||
                      srv.category.toLowerCase().includes(query) ||
                      (srv.description && srv.description.toLowerCase().includes(query))
                    );
                  })
                  .map((srv) => (
                    <div
                      key={srv.id}
                      style={{
                        background: '#ffffff',
                        border: '1px solid #e2e8f0',
                        borderRadius: '14px',
                        padding: '20px',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        transition: 'transform 0.15s ease, box-shadow 0.15s ease'
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                          <div style={{
                            width: '42px',
                            height: '42px',
                            borderRadius: '10px',
                            background: '#eff6ff',
                            border: '1px solid #dbeafe',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '1rem',
                            fontWeight: 800,
                            color: '#1e40af'
                          }}>
                            {srv.name ? srv.name.charAt(0).toUpperCase() : 'S'}
                          </div>
                          <span className={`badge ${srv.status === 'Active' ? 'badge-success' : 'badge-danger'}`}>
                            {srv.status}
                          </span>
                        </div>

                        <h3 style={{ margin: '0 0 4px', fontSize: '1.1rem', fontWeight: 800, color: 'var(--color-primary, #1e3a8a)' }}>
                          {srv.name}
                        </h3>
                        <div style={{ fontSize: '0.78rem', color: '#4f46e5', fontWeight: 700, textTransform: 'uppercase', marginBottom: '8px' }}>
                          {srv.category}
                        </div>
                        <p style={{ fontSize: '0.84rem', color: '#64748b', lineHeight: 1.45, margin: '0 0 16px' }}>
                          {srv.description}
                        </p>
                      </div>

                      <div>
                        {/* Live Practice / Play Work button */}
                        <div style={{ marginBottom: '12px' }}>
                          <button
                            type="button"
                            onClick={() => setActiveInteractiveService(srv)}
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
                              gap: '8px',
                              boxShadow: '0 2px 4px rgba(37,99,235,0.25)',
                              transition: 'all 0.15s ease'
                            }}
                          >
                            <span>▶</span> Open & Practice Service
                          </button>
                        </div>

                        <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '0.92rem', fontWeight: 800, color: '#0f172a' }}>
                            {srv.cost}
                          </span>
                          <button
                            type="button"
                            className="btn btn-sm btn-outline"
                            onClick={() => {
                              setAssignFormData({ serviceId: srv.id, schoolId: schools[0]?.id || '', status: 'Active' });
                              setIsAssignServiceModalOpen(true);
                            }}
                            style={{ fontSize: '0.78rem', padding: '4px 10px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                          >
                            Assign to School
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* 2. SCHOOL SERVICES SECTION */}
          {servicesMainSection === 'school-services' && (
            <div>
              {/* Filter Bar with School Selection & Status Filter */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '18px',
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '12px 18px',
                flexWrap: 'wrap',
                gap: '12px'
              }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
                  {/* School Selector Dropdown to show which services are active for each school */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#475569', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <span>🏫</span> Select School:
                    </span>
                    <select
                      value={selectedSchoolForServiceView}
                      onChange={(e) => setSelectedSchoolForServiceView(e.target.value)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '6px',
                        border: '1px solid #cbd5e1',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        color: '#0f172a',
                        background: '#f8fafc',
                        cursor: 'pointer'
                      }}
                    >
                      <option value="All">All Schools (Overview)</option>
                      {schools.map((sch) => (
                        <option key={sch.id} value={sch.id}>
                          {sch.name} ({sch.city || sch.code})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Status:</span>
                    <button
                      type="button"
                      className={`btn btn-sm ${schoolServiceFilter === 'All' ? 'btn-primary' : 'btn-outline'}`}
                      onClick={() => setSchoolServiceFilter('All')}
                    >
                      All
                    </button>
                    <button
                      type="button"
                      className={`btn btn-sm ${schoolServiceFilter === 'Active' ? 'btn-primary' : 'btn-outline'}`}
                      onClick={() => setSchoolServiceFilter('Active')}
                    >
                      Active Services
                    </button>
                    <button
                      type="button"
                      className={`btn btn-sm ${schoolServiceFilter === 'Inactive' ? 'btn-primary' : 'btn-outline'}`}
                      onClick={() => setSchoolServiceFilter('Inactive')}
                    >
                      Inactive Services
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={() => {
                    setAssignFormData({
                      serviceId: services[0]?.id || '',
                      schoolId: selectedSchoolForServiceView === 'All' ? (schools[0]?.id || '') : selectedSchoolForServiceView,
                      status: 'Active'
                    });
                    setIsAssignServiceModalOpen(true);
                  }}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                >
                  <span>+</span> Assign Services to School
                </button>
              </div>

              {/* Active Services Summary Banner if specific school is selected */}
              {selectedSchoolForServiceView !== 'All' && (
                <div style={{
                  background: 'linear-gradient(135deg, #eff6ff 0%, #e0e7ff 100%)',
                  border: '1px solid #bfdbfe',
                  borderRadius: '10px',
                  padding: '12px 18px',
                  marginBottom: '16px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '10px'
                }}>
                  <div>
                    <strong style={{ color: '#1e3a8a', fontSize: '0.98rem' }}>
                      {schools.find((s) => s.id === selectedSchoolForServiceView)?.name || selectedSchoolForServiceView}
                    </strong>
                    <div style={{ fontSize: '0.8rem', color: '#4338ca', marginTop: '2px' }}>
                      Active Enrichment Services: {
                        schoolAssignments.filter(
                          (a) => a.schoolId === selectedSchoolForServiceView && a.status === 'Active'
                        ).length
                      } active program(s) running
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {schoolAssignments
                      .filter((a) => a.schoolId === selectedSchoolForServiceView && a.status === 'Active')
                      .map((a) => (
                        <span
                          key={a.id}
                          style={{
                            background: '#ffffff',
                            padding: '4px 10px',
                            borderRadius: '20px',
                            fontSize: '0.78rem',
                            fontWeight: 700,
                            color: '#1e3a8a',
                            border: '1px solid #bfdbfe',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          {a.serviceName}
                        </span>
                      ))}
                  </div>
                </div>
              )}

              {/* Assignments Table */}
              <div className="table-responsive">
                <table className="sa-schools-table" style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0 }}>
                  <thead>
                    <tr>
                      <th style={{ minWidth: '180px', padding: '12px 16px' }}>Service Name</th>
                      <th style={{ minWidth: '220px', padding: '12px 16px' }}>Assigned School</th>
                      <th style={{ minWidth: '120px', padding: '12px 16px' }}>Assigned Date</th>
                      <th style={{ minWidth: '100px', textAlign: 'center', padding: '12px 16px' }}>Status</th>
                      <th style={{ minWidth: '210px', textAlign: 'center', padding: '12px 16px' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {schoolAssignments
                      .filter((item) => {
                        // School filter
                        if (selectedSchoolForServiceView !== 'All' && item.schoolId !== selectedSchoolForServiceView) {
                          return false;
                        }
                        // Status filter
                        if (schoolServiceFilter !== 'All' && item.status !== schoolServiceFilter) {
                          return false;
                        }
                        // Search filter
                        if (serviceSearch.trim()) {
                          const q = serviceSearch.toLowerCase();
                          const matchesName = item.serviceName.toLowerCase().includes(q);
                          const matchesSchool = item.schoolName.toLowerCase().includes(q);
                          if (!matchesName && !matchesSchool) return false;
                        }
                        return true;
                      })
                      .map((item) => {
                        const srvObj = services.find((s) => s.id === item.serviceId);
                        return (
                          <tr key={item.id}>
                            <td data-label="Service Name" style={{ verticalAlign: 'middle', padding: '12px 16px' }}>
                              <div>
                                <strong style={{ color: '#0f172a', fontSize: '0.92rem' }}>{item.serviceName}</strong>
                                <div style={{ fontSize: '0.76rem', color: '#64748b' }}>{srvObj?.category || 'Enrichment'}</div>
                              </div>
                            </td>
                            <td data-label="Assigned School" style={{ verticalAlign: 'middle', padding: '12px 16px' }}>
                              <strong style={{ color: 'var(--color-primary, #1e3a8a)', fontSize: '0.9rem' }}>
                                {item.schoolName}
                              </strong>
                              <div style={{ fontSize: '0.76rem', color: '#64748b' }}>
                                Code: <span className="badge badge-info">{item.schoolId}</span>
                              </div>
                            </td>
                            <td data-label="Assigned Date" style={{ verticalAlign: 'middle', padding: '12px 16px', color: '#475569', fontSize: '0.84rem' }}>
                              {item.assignedDate || '2026-01-15'}
                            </td>
                            <td data-label="Status" style={{ textAlign: 'center', verticalAlign: 'middle', padding: '12px 16px' }}>
                              <span className={`badge ${item.status === 'Active' ? 'badge-success' : 'badge-danger'}`}>
                                {item.status}
                              </span>
                            </td>
                            <td data-label="Actions" style={{ textAlign: 'center', verticalAlign: 'middle', padding: '12px 16px' }}>
                              <div className="sa-actions-cell" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                                <button
                                  type="button"
                                  className="sa-tbl-action"
                                  onClick={() => {
                                    if (srvObj) {
                                      setActiveInteractiveService(srvObj);
                                    } else {
                                      setActiveInteractiveService({ name: item.serviceName, icon: '', category: 'General' });
                                    }
                                  }}
                                  style={{ background: '#2563eb', color: '#ffffff', borderColor: '#2563eb' }}
                                  title="Open Interactive Practice / Work"
                                >
                                  <span>▶ Practice</span>
                                </button>
                                <button
                                  type="button"
                                  className={`sa-tbl-action ${item.status === 'Active' ? 'danger' : 'success'}`}
                                  onClick={() => {
                                    const nextStatus = item.status === 'Active' ? 'Inactive' : 'Active';
                                    setSchoolAssignments((prev) =>
                                      prev.map((a) => (a.id === item.id ? { ...a, status: nextStatus } : a))
                                    );
                                    showFeedback('Status Updated', `${item.serviceName} for ${item.schoolName} is now ${nextStatus}.`);
                                  }}
                                  title={item.status === 'Active' ? 'Mark Inactive' : 'Activate Service'}
                                >
                                  {item.status === 'Active' ? 'Deactivate' : 'Activate'}
                                </button>
                                <button
                                  type="button"
                                  className="sa-tbl-action danger"
                                  onClick={() => {
                                    setConfirmModal({
                                      isOpen: true,
                                      title: 'Remove Service Assignment',
                                      message: `Are you sure you want to unassign ${item.serviceName} from ${item.schoolName}?`,
                                      onConfirm: () => {
                                        setSchoolAssignments((prev) => prev.filter((a) => a.id !== item.id));
                                        showFeedback('Assignment Removed', `${item.serviceName} unassigned successfully.`);
                                        setConfirmModal({ isOpen: false });
                                      }
                                    });
                                  }}
                                  title="Unassign Service"
                                >
                                  Remove
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 3. MANAGEMENT SERVICES SECTION */}
          {servicesMainSection === 'management' && (
            <div>
              <div style={{
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'center',
                marginBottom: '18px',
                flexWrap: 'wrap',
                gap: '12px'
              }}>
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={() => {
                    setEditingService(null);
                    setServiceFormData({ name: '', icon: '', category: 'General', cost: '0/yr', description: '', status: 'Active' });
                    setIsServiceModalOpen(true);
                  }}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                >
                  <span>+</span> Add New Service
                </button>
              </div>

              <div className="table-responsive">
                <table className="sa-schools-table" style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0 }}>
                  <thead>
                    <tr>
                      <th style={{ minWidth: '180px', padding: '12px 16px' }}>Service Name</th>
                      <th style={{ minWidth: '130px', padding: '12px 16px' }}>Category</th>
                      <th style={{ minWidth: '110px', padding: '12px 16px' }}>Monthly Cost</th>
                      <th style={{ minWidth: '220px', padding: '12px 16px' }}>Portal Visibility (Role Access)</th>
                      <th style={{ minWidth: '200px', padding: '12px 16px' }}>Description</th>
                      <th style={{ minWidth: '85px', textAlign: 'center', padding: '12px 16px' }}>Status</th>
                      <th style={{ minWidth: '150px', textAlign: 'center', padding: '12px 16px' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {services.map((srv) => {
                      const roles = srv.visibleRoles || ['schooladmin', 'teacher', 'student'];
                      return (
                        <tr key={srv.id}>
                          <td data-label="Service Name" style={{ verticalAlign: 'middle', padding: '12px 16px' }}>
                            <strong style={{ color: 'var(--color-primary, #1e3a8a)', fontSize: '0.92rem' }}>{srv.name}</strong>
                            <div style={{ fontSize: '0.74rem', color: '#64748b' }}>ID: <code>{srv.id}</code></div>
                          </td>
                          <td data-label="Category" style={{ verticalAlign: 'middle', padding: '12px 16px' }}>
                            <span className="badge badge-info">{srv.category}</span>
                          </td>
                          <td data-label="Cost" style={{ verticalAlign: 'middle', padding: '12px 16px', fontWeight: 700, color: '#0f172a' }}>
                            {srv.cost}
                          </td>
                          <td data-label="Portal Visibility" style={{ verticalAlign: 'middle', padding: '10px 12px', minWidth: '190px' }}>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                              {[
                                { id: 'schooladmin', label: 'School Admin', activeTone: '#1e40af', activeBg: '#dbeafe', activeBorder: '#93c5fd' },
                                { id: 'principal', label: 'Principal', activeTone: '#3730a3', activeBg: '#e0e7ff', activeBorder: '#c7d2fe' },
                                { id: 'teacher', label: 'Teacher', activeTone: '#166534', activeBg: '#dcfce7', activeBorder: '#86efac' },
                                { id: 'student', label: 'Student', activeTone: '#92400e', activeBg: '#fef3c7', activeBorder: '#fde68a' },
                                { id: 'parent', label: 'Parent', activeTone: '#86198f', activeBg: '#fae8ff', activeBorder: '#f0abfc' },
                              ].map((roleItem) => {
                                const isEnabled = roles.includes(roleItem.id);
                                return (
                                  <button
                                    key={roleItem.id}
                                    type="button"
                                    onClick={() => {
                                      const updatedRoles = isEnabled
                                        ? roles.filter((r) => r !== roleItem.id)
                                        : [...roles, roleItem.id];
                                      const updatedServices = services.map((s) =>
                                        s.id === srv.id ? { ...s, visibleRoles: updatedRoles } : s
                                      );
                                      setServices(updatedServices);
                                      try {
                                        const store = getPortalData();
                                        store.services = updatedServices;
                                        savePortalData(store);
                                      } catch (err) {}
                                      showFeedback(
                                        isEnabled ? 'Access Disabled' : 'Access Enabled',
                                        `${roleItem.label} visibility for "${srv.name}" turned ${isEnabled ? 'OFF' : 'ON'}.`
                                      );
                                    }}
                                    title={`Click to turn ${isEnabled ? 'OFF' : 'ON'} access for ${roleItem.label}`}
                                    style={{
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      gap: '4px',
                                      padding: '3px 7px',
                                      borderRadius: '6px',
                                      border: isEnabled ? `1px solid ${roleItem.activeBorder}` : '1px solid #cbd5e1',
                                      background: isEnabled ? roleItem.activeBg : '#f8fafc',
                                      color: isEnabled ? roleItem.activeTone : '#94a3b8',
                                      fontSize: '0.72rem',
                                      fontWeight: isEnabled ? 700 : 500,
                                      cursor: 'pointer',
                                      transition: 'all 0.15s ease',
                                      boxShadow: isEnabled ? '0 1px 2px rgba(0,0,0,0.05)' : 'none',
                                      outline: 'none',
                                      lineHeight: 1.2
                                    }}
                                  >
                                    <span>{roleItem.label}</span>
                                    <span style={{
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      width: '12px',
                                      height: '12px',
                                      borderRadius: '50%',
                                      background: isEnabled ? roleItem.activeTone : '#94a3b8',
                                      color: '#ffffff',
                                      fontSize: '0.55rem',
                                      fontWeight: 900,
                                      marginLeft: '2px'
                                    }}>
                                      {isEnabled ? '✓' : '×'}
                                    </span>
                                  </button>
                                );
                              })}
                            </div>
                          </td>
                          <td data-label="Description" style={{ verticalAlign: 'middle', padding: '12px 16px', fontSize: '0.82rem', color: '#475569', lineHeight: 1.4 }}>
                            {srv.description}
                          </td>
                          <td data-label="Status" style={{ textAlign: 'center', verticalAlign: 'middle', padding: '12px 16px' }}>
                            <span className={`badge ${srv.status === 'Active' ? 'badge-success' : 'badge-danger'}`}>
                              {srv.status}
                            </span>
                          </td>
                          <td data-label="Actions" style={{ textAlign: 'center', verticalAlign: 'middle', padding: '12px 16px' }}>
                            <div className="sa-actions-cell" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                              <button
                                type="button"
                                className="sa-tbl-action edit"
                                onClick={() => {
                                  setEditingService(srv);
                                  setServiceFormData({
                                    name: srv.name,
                                    icon: srv.icon || '',
                                    category: srv.category || 'General',
                                    cost: srv.cost || '0/yr',
                                    description: srv.description || '',
                                    status: srv.status || 'Active',
                                    visibleRoles: srv.visibleRoles || ['schooladmin', 'teacher', 'student']
                                  });
                                  setIsServiceModalOpen(true);
                                }}
                                title="Edit Service Details & Role Visibility"
                              >
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                </svg>
                                <span>Edit</span>
                              </button>
                            <button
                              type="button"
                              className="sa-tbl-action danger"
                              onClick={() => {
                                setConfirmModal({
                                  isOpen: true,
                                  title: 'Delete Service',
                                  message: `Are you sure you want to permanently delete "${srv.name}"? This cannot be undone.`,
                                  onConfirm: () => {
                                    setServices((prev) => prev.filter((s) => s.id !== srv.id));
                                    setSchoolAssignments((prev) => prev.filter((a) => a.serviceId !== srv.id));
                                    showFeedback('Service Deleted', `"${srv.name}" has been removed from master directory.`);
                                    setConfirmModal({ isOpen: false });
                                  }
                                });
                              }}
                              title="Delete Service"
                            >
                              <span>Delete</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Modal: Add / Edit Service */}
          {isServiceModalOpen && (
            <div className="modal-overlay" style={{ display: 'flex' }}>
              <div className="modal-content" style={{ maxWidth: '540px' }}>
                <div className="modal-header">
                  <h3>{editingService ? 'Edit Service' : 'Add New Service'}</h3>
                  <button className="modal-close" onClick={() => setIsServiceModalOpen(false)}>&times;</button>
                </div>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (editingService) {
                      const updated = services.map((s) => (s.id === editingService.id ? { ...s, ...serviceFormData } : s));
                      setServices(updated);
                      const updatedAssigns = schoolAssignments.map((a) => (a.serviceId === editingService.id ? { ...a, serviceName: serviceFormData.name } : a));
                      setSchoolAssignments(updatedAssigns);
                      try {
                        const store = getPortalData();
                        store.services = updated;
                        store.schoolServiceAssignments = updatedAssigns;
                        savePortalData(store);
                      } catch (err) {}
                      showFeedback('Service Updated', `"${serviceFormData.name}" updated successfully.`);
                    } else {
                      const newId = 'SRV-' + String(services.length + 1).padStart(2, '0');
                      const newObj = { id: newId, ...serviceFormData };
                      const updated = [...services, newObj];
                      setServices(updated);
                      try {
                        const store = getPortalData();
                        store.services = updated;
                        savePortalData(store);
                      } catch (err) {}
                      showFeedback('Service Created', `"${serviceFormData.name}" added to master services.`);
                    }
                    setIsServiceModalOpen(false);
                  }}
                  style={{ padding: '20px' }}
                >
                  <div className="form-group" style={{ marginBottom: '14px' }}>
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.86rem', fontWeight: 600 }}>Service Name *</label>
                    <input
                      type="text"
                      className="form-control"
                      required
                      placeholder="e.g. Coding for Kids"
                      value={serviceFormData.name}
                      onChange={(e) => setServiceFormData({ ...serviceFormData, name: e.target.value })}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
                    <div className="form-group">
                      <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.86rem', fontWeight: 600 }}>Category</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. STEM, Sports, Arts"
                        value={serviceFormData.category}
                        onChange={(e) => setServiceFormData({ ...serviceFormData, category: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.86rem', fontWeight: 600 }}>Status</label>
                      <select
                        className="form-control"
                        value={serviceFormData.status}
                        onChange={(e) => setServiceFormData({ ...serviceFormData, status: e.target.value })}
                      >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group" style={{ marginBottom: '14px' }}>
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.86rem', fontWeight: 600 }}>Monthly Cost</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="0/yr"
                      value={serviceFormData.cost}
                      onChange={(e) => setServiceFormData({ ...serviceFormData, cost: e.target.value })}
                    />
                  </div>

                  <div className="form-group" style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.86rem', fontWeight: 600 }}>Description</label>
                    <textarea
                      className="form-control"
                      rows={3}
                      placeholder="Brief details regarding curriculum, tools used, or requirements..."
                      value={serviceFormData.description}
                      onChange={(e) => setServiceFormData({ ...serviceFormData, description: e.target.value })}
                    />
                  </div>

                  {/* Portal Visibility / Role Access Selector */}
                  <div className="form-group" style={{ marginBottom: '20px', background: '#f8fafc', padding: '12px 14px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.86rem', fontWeight: 700, color: '#1e3a8a' }}>
                      Portal Visibility — Which Roles Can Access & View This Service?
                    </label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '8px' }}>
                      {[
                        { id: 'schooladmin', label: 'School Admin' },
                        { id: 'principal', label: 'Principal' },
                        { id: 'teacher', label: 'Teacher' },
                        { id: 'student', label: 'Student' },
                        { id: 'parent', label: 'Parent' },
                      ].map((r) => {
                        const currentRoles = serviceFormData.visibleRoles || ['schooladmin', 'teacher', 'student'];
                        const isChecked = currentRoles.includes(r.id);
                        return (
                          <label
                            key={r.id}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                              fontSize: '0.82rem',
                              fontWeight: 600,
                              cursor: 'pointer',
                              background: isChecked ? '#eff6ff' : '#ffffff',
                              border: isChecked ? '1px solid #93c5fd' : '1px solid #cbd5e1',
                              padding: '6px 10px',
                              borderRadius: '6px'
                            }}
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={(e) => {
                                let updatedRoles;
                                if (e.target.checked) {
                                  updatedRoles = [...currentRoles, r.id];
                                } else {
                                  updatedRoles = currentRoles.filter((x) => x !== r.id);
                                }
                                setServiceFormData({ ...serviceFormData, visibleRoles: updatedRoles });
                              }}
                            />
                            <span>{r.label}</span>
                          </label>
                        );
                      })}
                    </div>
                    <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '6px' }}>
                      Selected portals will show this service under their Enrichment & Services menu tab.
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                    <button type="button" className="btn btn-outline btn-sm" onClick={() => setIsServiceModalOpen(false)}>Cancel</button>
                    <button type="submit" className="btn btn-primary btn-sm">{editingService ? 'Save Changes' : 'Create Service'}</button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Modal: Assign Service to School */}
          {isAssignServiceModalOpen && (
            <div className="modal-overlay" style={{ display: 'flex' }}>
              <div className="modal-content" style={{ maxWidth: '500px' }}>
                <div className="modal-header">
                  <h3>Assign Service to School</h3>
                  <button className="modal-close" onClick={() => setIsAssignServiceModalOpen(false)}>&times;</button>
                </div>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const srv = services.find((s) => s.id === assignFormData.serviceId);
                    const sch = schools.find((sc) => sc.id === assignFormData.schoolId);
                    if (srv && sch) {
                      const newAssignId = 'SSA-' + Date.now().toString().slice(-4);
                      const newAssignment = {
                        id: newAssignId,
                        serviceId: srv.id,
                        serviceName: srv.name,
                        schoolId: sch.id,
                        schoolName: sch.name,
                        status: assignFormData.status,
                        assignedDate: new Date().toISOString().split('T')[0]
                      };
                      const updated = [newAssignment, ...schoolAssignments];
                      setSchoolAssignments(updated);
                      try {
                        const store = getPortalData();
                        store.schoolServiceAssignments = updated;
                        savePortalData(store);
                      } catch (err) {}
                      showFeedback('Service Assigned', `Successfully assigned "${srv.name}" to "${sch.name}".`);
                      setIsAssignServiceModalOpen(false);
                      setServicesMainSection('school-services');
                    }
                  }}
                  style={{ padding: '20px' }}
                >
                  <div className="form-group" style={{ marginBottom: '14px' }}>
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.86rem', fontWeight: 600 }}>Select Service *</label>
                    <select
                      className="form-control"
                      required
                      value={assignFormData.serviceId}
                      onChange={(e) => setAssignFormData({ ...assignFormData, serviceId: e.target.value })}
                    >
                      <option value="">-- Choose a Service --</option>
                      {services.map((srv) => (
                        <option key={srv.id} value={srv.id}>
                          {srv.name} ({srv.cost})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group" style={{ marginBottom: '14px' }}>
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.86rem', fontWeight: 600 }}>Select School Campus *</label>
                    <select
                      className="form-control"
                      required
                      value={assignFormData.schoolId}
                      onChange={(e) => setAssignFormData({ ...assignFormData, schoolId: e.target.value })}
                    >
                      <option value="">-- Choose a School --</option>
                      {schools.map((sch) => (
                        <option key={sch.id} value={sch.id}>
                          {sch.name} ({sch.code || sch.id})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group" style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.86rem', fontWeight: 600 }}>Initial Status</label>
                    <select
                      className="form-control"
                      value={assignFormData.status}
                      onChange={(e) => setAssignFormData({ ...assignFormData, status: e.target.value })}
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                    <button type="button" className="btn btn-outline btn-sm" onClick={() => setIsAssignServiceModalOpen(false)}>Cancel</button>
                    <button type="submit" className="btn btn-primary btn-sm">Confirm Assignment</button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ===================================================================== */}
      {/* 5. SUPER ADMIN: SUBSCRIPTION (sa-subscriptions) */}
      {/* ===================================================================== */}
      {activeTab === 'sa-subscriptions' && (
        <div>
          <div className="content-header">
            <h2 id="section-title">Subscriptions Management</h2>
            <div id="section-actions"></div>
          </div>

          <div id="portal-content">
            <div className="sa-schools-header-bar">
              <div className="sa-filter-segment">
                <button
                  className={`sa-filter-tab ${subViewType === 'subs' && subStatusFilter === 'All' ? 'active' : ''}`}
                  onClick={() => { setSubViewType('subs'); setSubStatusFilter('All'); }}
                >
                  All Subscriptions <span className="sa-tab-badge">{subscriptions.length}</span>
                </button>
                <button
                  className={`sa-filter-tab ${subViewType === 'plans' ? 'active' : ''}`}
                  onClick={() => setSubViewType('plans')}
                >
                  Subscription Plans
                </button>
                <button
                  className={`sa-filter-tab ${subViewType === 'subs' && subStatusFilter === 'ACTIVE' ? 'active' : ''}`}
                  onClick={() => { setSubViewType('subs'); setSubStatusFilter('ACTIVE'); }}
                >
                  Active <span className="sa-tab-badge badge-green">{subscriptions.filter((s) => s.status === 'ACTIVE').length}</span>
                </button>
                <button
                  className={`sa-filter-tab ${subViewType === 'subs' && subStatusFilter === 'EXPIRED' ? 'active' : ''}`}
                  onClick={() => { setSubViewType('subs'); setSubStatusFilter('EXPIRED'); }}
                >
                  Expired <span className="sa-tab-badge badge-rose">{subscriptions.filter((s) => s.status === 'EXPIRED').length}</span>
                </button>
                <button
                  className={`sa-filter-tab ${subViewType === 'subs' && subStatusFilter === 'PENDING' ? 'active' : ''}`}
                  onClick={() => { setSubViewType('subs'); setSubStatusFilter('PENDING'); }}
                >
                  Pending <span className="sa-tab-badge badge-warning">{subscriptions.filter((s) => s.status === 'PENDING').length}</span>
                </button>
              </div>
              <div className="sa-toolbar-right">
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => { setSelectedPlanObj(null); setSubModalTab('subscription'); setIsSubModalOpen(true); }}
                >
                  + New Subscription
                </button>
              </div>
            </div>

            {/* Plans Grid View */}
            {subViewType === 'plans' && (
              <div id="sub-plans-pane" style={{ marginBottom: '25px' }}>
                <div className="grid-3">
                  {plans.map((p) => (
                    <div key={p.id} className="portal-card" style={{ borderLeftColor: 'var(--color-primary)' }}>
                      <div className="portal-card-header">
                        <span className="portal-card-title">{p.name}</span>
                        <span className="badge badge-info">Up to {p.maxStudents} Students</span>
                      </div>
                      <p style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--color-primary)', margin: '8px 0' }}>{p.price}</p>
                      <p style={{ fontSize: '0.85rem', color: 'var(--color-text-dark)' }}>{p.features}</p>
                      <button
                        className="btn btn-outline btn-sm"
                        style={{ marginTop: '14px', width: '100%' }}
                        onClick={() => { setSelectedPlanObj(p); setSubModalTab('plan'); setIsSubModalOpen(true); }}
                      >
                        Configure Plan
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Subscriptions Table View */}
            {subViewType === 'subs' && (
              <div id="sub-table-pane" className="table-responsive">
                <table className="sa-schools-table">
                  <thead>
                    <tr>
                      <th style={{ minWidth: '120px' }}>Subscription ID</th>
                      <th style={{ minWidth: '180px' }}>School Campus</th>
                      <th style={{ minWidth: '140px' }}>Plan Tier</th>
                      <th style={{ minWidth: '110px' }}>Start Date</th>
                      <th style={{ minWidth: '110px' }}>End Date</th>
                      <th style={{ minWidth: '110px', textAlign: 'center' }}>Amount</th>
                      <th style={{ minWidth: '100px', textAlign: 'center' }}>Status</th>
                      <th style={{ minWidth: '140px', textAlign: 'center' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSubs.map((sub) => (
                      <tr key={sub.id} className="sa-sub-row" data-status={sub.status}>
                        <td data-label="Subscription ID"><code>{sub.id}</code></td>
                        <td data-label="School Campus">
                          <div className="school-meta-line">
                            <strong>{sub.school}</strong>
                            <small>{sub.schoolId || ''}</small>
                          </div>
                        </td>
                        <td data-label="Plan Tier">
                          <span className={`badge ${sub.status === 'PENDING' ? 'badge-warning' : 'badge-info'}`}>
                            {sub.plan}
                          </span>
                        </td>
                        <td data-label="Start Date">{sub.startDate}</td>
                        <td data-label="End Date">{sub.endDate}</td>
                        <td data-label="Amount" style={{ textAlign: 'center' }}>
                          <span className="badge badge-subtle" style={{ fontWeight: 700, color: 'var(--color-primary, #1e3a8a)' }}>
                            {sub.amount && sub.amount.includes('/') ? sub.amount : '0/yr'}
                          </span>
                        </td>
                        <td data-label="Status" style={{ textAlign: 'center' }}>
                          <span className={`badge ${sub.status === 'ACTIVE' ? 'badge-success' : sub.status === 'EXPIRED' ? 'badge-danger' : 'badge-warning'}`}>
                            {sub.status}
                          </span>
                        </td>
                        <td data-label="Action" style={{ textAlign: 'center' }}>
                          <div className="sa-actions-cell">
                            {sub.status === 'PENDING' ? (
                              <button
                                className="sa-tbl-action"
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '5px',
                                  color: '#047857',
                                  background: '#ecfdf5',
                                  borderColor: '#a7f3d0',
                                  fontWeight: 600,
                                  padding: '5px 12px',
                                  borderRadius: '6px',
                                }}
                                onClick={() => {
                                  setSelectedPlanObj(sub);
                                  setSubModalTab('subscription');
                                  setIsSubModalOpen(true);
                                }}
                              >
                                ⚡ Activate Plan
                              </button>
                            ) : (
                              <button
                                className="sa-tbl-action edit"
                                onClick={() => {
                                  setSelectedPlanObj(sub);
                                  setSubModalTab('subscription');
                                  setIsSubModalOpen(true);
                                }}
                              >
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                </svg>
                                Renew / Edit
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* 6. SUPER ADMIN: BILLS / BILLING (sa-billing) */}
      {/* ===================================================================== */}
      {activeTab === 'sa-billing' && (
        <div>
          <div className="content-header">
            <h2 id="section-title">Bills & Billing Management</h2>
            <div id="section-actions"></div>
          </div>

          <div id="portal-content">
            <div className="sa-schools-header-bar">
              <div className="sa-filter-segment">
                <button
                  className={`sa-filter-tab ${billFilter === 'All' ? 'active' : ''}`}
                  onClick={() => setBillFilter('All')}
                >
                  All Bills <span className="sa-tab-badge">{bills.length}</span>
                </button>
                <button
                  className={`sa-filter-tab ${billFilter === 'PAID' ? 'active' : ''}`}
                  onClick={() => setBillFilter('PAID')}
                >
                  Paid <span className="sa-tab-badge badge-green">{bills.filter((b) => b.status === 'PAID').length}</span>
                </button>
                <button
                  className={`sa-filter-tab ${billFilter === 'PENDING' ? 'active' : ''}`}
                  onClick={() => setBillFilter('PENDING')}
                >
                  Pending <span className="sa-tab-badge">{bills.filter((b) => b.status === 'PENDING').length}</span>
                </button>
                <button
                  className={`sa-filter-tab ${billFilter === 'OVERDUE' ? 'active' : ''}`}
                  onClick={() => setBillFilter('OVERDUE')}
                >
                  Overdue <span className="sa-tab-badge badge-rose">{bills.filter((b) => b.status === 'OVERDUE').length}</span>
                </button>
              </div>
              <div className="sa-toolbar-right">
                <button className="btn btn-primary btn-sm" onClick={() => setIsInvoiceModalOpen(true)}>
                  + Create Invoice
                </button>
              </div>
            </div>

            <div className="table-responsive">
              <table className="sa-schools-table">
                <thead>
                  <tr>
                    <th style={{ minWidth: '110px' }}>Invoice ID</th>
                    <th style={{ minWidth: '180px' }}>School Campus</th>
                    <th style={{ minWidth: '130px' }}>Plan Tier</th>
                    <th style={{ minWidth: '100px' }}>Amount</th>
                    <th style={{ minWidth: '100px' }}>Due Date</th>
                    <th style={{ minWidth: '100px' }}>Payment Date</th>
                    <th style={{ minWidth: '90px', textAlign: 'center' }}>Status</th>
                    <th style={{ minWidth: '160px', textAlign: 'center' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBills.map((b) => (
                    <tr key={b.invoiceNo} className="sa-bill-row" data-status={b.status}>
                      <td data-label="Invoice ID"><strong>{b.invoiceNo}</strong></td>
                      <td data-label="School"><strong>{b.school}</strong></td>
                      <td data-label="Plan"><span className="badge badge-info">{b.plan}</span></td>
                      <td data-label="Amount"><strong>{b.amount}</strong></td>
                      <td data-label="Due Date">{b.dueDate}</td>
                      <td data-label="Payment Date">{b.paymentDate || '—'}</td>
                      <td data-label="Status" style={{ textAlign: 'center' }}>
                        <span className={`badge ${b.status === 'PAID' ? 'badge-success' : b.status === 'PENDING' ? 'badge-warning' : 'badge-danger'}`}>
                          {b.status}
                        </span>
                      </td>
                      <td data-label="Actions" style={{ textAlign: 'center' }}>
                        <div className="sa-actions-cell">
                          <button
                            className="sa-tbl-action view"
                            onClick={() => setSelectedInvoiceForPrint(b)}
                            title="View official printable invoice"
                          >
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" />
                            </svg>
                            Invoice / PDF
                          </button>
                          <button
                            className="sa-tbl-action"
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              color: '#1e3a8a',
                              background: '#eff6ff',
                              borderColor: '#bfdbfe',
                              fontWeight: 600,
                              fontSize: '0.75rem',
                              padding: '5px 9px',
                              borderRadius: '6px'
                            }}
                            onClick={() => downloadInvoicePDF(b)}
                            title="Direct download invoice PDF to your computer"
                          >
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                              <polyline points="14 2 14 8 20 8" />
                              <line x1="12" y1="18" x2="12" y2="12" />
                              <line x1="9" y1="15" x2="12" y2="18" />
                              <line x1="15" y1="15" x2="12" y2="18" />
                            </svg>
                            Download PDF
                          </button>
                          {b.status !== 'PAID' && (
                            <button
                              className="sa-tbl-action success"
                              onClick={() => handleMarkBillPaid(b.invoiceNo)}
                            >
                              Mark Paid
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* 6.5 SUPER ADMIN: SECURE MESSAGING (sa-messaging) */}
      {/* ===================================================================== */}
      {activeTab === 'sa-messaging' && (
        <div>
          <div className="content-header">
            <h2 id="section-title">Institutional Secure Messaging</h2>
            <div id="section-actions"></div>
          </div>
          <div id="portal-content" style={{ marginTop: '16px' }}>
            <ChatBox />
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* 7. SUPER ADMIN: SETTINGS (sa-settings) */}
      {/* ===================================================================== */}
      {activeTab === 'sa-settings' && (
        <div>
          <div className="content-header">
            <h2 id="section-title">Platform Settings</h2>
            <div id="section-actions"></div>
          </div>

          <div id="portal-content">
            <div className="sa-schools-header-bar" style={{ marginBottom: '20px' }}>
              <div className="sa-filter-segment">
                <button
                  className={`sa-filter-tab ${settingsSection === 'platform' ? 'active' : ''}`}
                  onClick={() => setSettingsSection('platform')}
                >
                  Platform Settings
                </button>
                <button
                  className={`sa-filter-tab ${settingsSection === 'roles' ? 'active' : ''}`}
                  onClick={() => setSettingsSection('roles')}
                >
                  Roles & Permissions
                </button>
                <button
                  className={`sa-filter-tab ${settingsSection === 'notifications' ? 'active' : ''}`}
                  onClick={() => setSettingsSection('notifications')}
                >
                  Notifications
                </button>
                <button
                  className={`sa-filter-tab ${settingsSection === 'security' ? 'active' : ''}`}
                  onClick={() => setSettingsSection('security')}
                >
                  High Security
                </button>
                <button
                  className={`sa-filter-tab ${settingsSection === 'profile' ? 'active' : ''}`}
                  onClick={() => setSettingsSection('profile')}
                >
                  Profile
                </button>
              </div>
            </div>

            {settingsSection === 'security' ? (
              <div style={{ marginTop: '20px' }}>
                <SuperAdminSecurityView />
              </div>
            ) : (
              <div id="settings-content-pane" style={{ maxWidth: '760px', marginTop: '15px' }}>
                <div className="wizard-form-box" style={{ background: 'var(--color-bg-white)', borderRadius: 'var(--radius-md)', padding: '24px', boxShadow: 'var(--shadow-sm)', border: '1px solid #e2e8f0' }}>
                  <div className="wizard-header-strip">
                    <div className="wizard-header-icon" style={{ background: 'rgba(30, 58, 138, 0.08)', color: 'var(--color-primary)' }}>
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                      </svg>
                    </div>
                    <div className="wizard-header-titles">
                      {settingsSection === 'platform' && (
                        <>
                          <h4>ZenSchool Platform Configuration</h4>
                          <p>Global multi-campus parameters, institutional branding, contact endpoints, and server state.</p>
                        </>
                      )}
                      {settingsSection !== 'platform' && (
                        <>
                          <h4>ZenSchool {settingsSection.toUpperCase()} Policy Settings</h4>
                          <p>Configure institutional standards, policy enforcement flags, and security controls.</p>
                        </>
                      )}
                    </div>
                  </div>

                  {settingsSection === 'platform' && (
                    <form onSubmit={(e) => { e.preventDefault(); }}>
                      <div className="wizard-grid-2">
                        <div className="wizard-field">
                          <label>Platform Name <span className="req">*</span></label>
                          <input type="text" defaultValue="ZenSchool Multi-School Platform" required />
                        </div>
                        <div className="wizard-field">
                          <label>Super Admin Contact Email <span className="req">*</span></label>
                          <input type="email" defaultValue="superadmin@zenschool.com" required />
                        </div>
                        <div className="wizard-field">
                          <label>Default Currency <span className="req">*</span></label>
                          <input type="text" defaultValue="INR (₹)" required />
                        </div>
                        <div className="wizard-field">
                          <label>Platform Maintenance Mode <span className="req">*</span></label>
                          <select defaultValue="Disabled">
                            <option value="Disabled">Disabled (Platform Online)</option>
                            <option value="Enabled">Enabled (Maintenance Mode)</option>
                          </select>
                        </div>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #e2e8f0' }}>
                        <button type="submit" className="btn btn-primary btn-sm" style={{ padding: '8px 24px' }}>Save Platform Settings ✓</button>
                      </div>
                    </form>
                  )}

                  {settingsSection !== 'platform' && (
                    <form onSubmit={(e) => { e.preventDefault(); }}>
                      <div className="wizard-grid-2">
                        <div className="wizard-field span-2">
                          <label>Policy Header / Description <span className="req">*</span></label>
                          <input type="text" defaultValue={`Standard ${settingsSection} enterprise policy configuration`} required />
                        </div>
                        <div className="wizard-field">
                          <label>Enforcement Status <span className="req">*</span></label>
                          <select defaultValue="Active">
                            <option value="Active">Enforced Across All Campuses</option>
                            <option value="Disabled">Optional per Campus</option>
                          </select>
                        </div>
                        <div className="wizard-field">
                          <label>Audit Logging</label>
                          <select defaultValue="Enabled">
                            <option value="Enabled">Full Activity Logging</option>
                            <option value="Minimal">Basic Logging</option>
                          </select>
                        </div>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #e2e8f0' }}>
                        <button type="submit" className="btn btn-primary btn-sm" style={{ padding: '8px 24px' }}>Update {settingsSection} Settings ✓</button>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}


      {/* ===================================================================== */}
      {/* ALL MODALS MOUNTED ACCORDING TO PORTAL.JS BEHAVIOR */}
      {/* ===================================================================== */}
      {/* 1. Onboarding Wizard Modal */}
      <NewSchoolWizardModal
        key={isWizardOpen ? 'wiz-open' : 'wiz-closed'}
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
        onSchoolCreated={handleSchoolOnboarded}
      />

      {/* 2. Campus Overview Modal */}
      <CampusOverviewModal
        isOpen={isOverviewOpen}
        school={selectedSchool}
        onClose={() => setIsOverviewOpen(false)}
        onEdit={(s) => { setSelectedSchool(s); setIsEditSchoolOpen(true); }}
        onEnterSchool={(s) => {
          setActiveCampusPortal(s);
          setActiveCampusRole('schooladmin');
          setActiveCampusTab('school-admin-users');
        }}
      />

      {/* 3. Edit School Modal */}
      <EditSchoolModal
        isOpen={isEditSchoolOpen}
        school={selectedSchool}
        onClose={() => setIsEditSchoolOpen(false)}
        onSave={(updated) => {
          setSchools((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
          showFeedback('Campus Updated', `Changes saved for ${updated.name}.`);
        }}
      />

      {/* 4. Admin Profile Modal */}
      <AdminProfileModal
        isOpen={isAdminProfileOpen}
        admin={selectedAdmin}
        onClose={() => setIsAdminProfileOpen(false)}
      />

      {/* 5. Add Admin Modal */}
      <AddAdminModal
        isOpen={isAddAdminOpen}
        schools={schools}
        onClose={() => setIsAddAdminOpen(false)}
        onSave={handleAddAdmin}
      />

      {/* 6. Assign Admin Modal */}
      <AssignAdminModal
        isOpen={isAssignAdminOpen}
        admins={schoolAdmins}
        schools={schools}
        initialAdminId={assignInitialAdminId}
        onClose={() => setIsAssignAdminOpen(false)}
        onSave={handleAssignAdmin}
      />

      {/* 7. Subscription / Plan Modal */}
      <SubscriptionModal
        isOpen={isSubModalOpen}
        defaultTab={subModalTab}
        planObj={selectedPlanObj}
        schools={schools}
        plans={plans}
        onClose={() => setIsSubModalOpen(false)}
        onSave={handleSaveSubOrPlan}
      />

      {/* 8. Create Invoice Modal */}
      <CreateInvoiceModal
        isOpen={isInvoiceModalOpen}
        schools={schools}
        onClose={() => setIsInvoiceModalOpen(false)}
        onSave={handleSaveInvoice}
      />

      {/* 9. Feedback Confirmation Modal */}
      <FeedbackModal
        isOpen={feedback.isOpen}
        title={feedback.title}
        message={feedback.message}
        onClose={() => setFeedback({ ...feedback, isOpen: false })}
      />

      {/* 10. Dashboard Card Drill-down Modal */}
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

      {/* 11. Printable Invoice Modal */}
      <PrintableInvoiceModal
        isOpen={!!selectedInvoiceForPrint}
        bill={selectedInvoiceForPrint}
        onClose={() => setSelectedInvoiceForPrint(null)}
      />

      {/* 12. Safety Action Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        onConfirm={confirmModal.onConfirm}
        onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })}
      />

      {/* 13. Interactive Service Practice & Lab Modal */}
      <InteractiveServicePlayerModal
        isOpen={!!activeInteractiveService}
        service={activeInteractiveService}
        onClose={() => setActiveInteractiveService(null)}
      />
    </div>
  );
}
