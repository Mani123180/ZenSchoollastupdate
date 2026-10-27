import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { downloadStudentBillPDF, downloadSalarySlipPDF } from '../../services/pdfDownloadUtil';
import { syncBillToPortalFeeRecords } from '../../services/portalData';
import * as XLSX from 'xlsx';

export default function SchoolFinanceModule({ user }) {
  // Active Submenu tab
  // 1: 'dashboard', 2: 'student-billing', 3: 'staff-salary', 4: 'school-expenses', 5: 'finance-reports', 6: 'payment-history'
  const [subTab, setSubTab] = useState('dashboard');
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Dashboard Data State
  const [dashboardData, setDashboardData] = useState({
    summary: {
      totalStudentFees: 133500,
      totalFeesCollected: 83500,
      totalPendingStudentFees: 50000,
      totalStaffSalary: 213190,
      totalSalaryPaid: 144570,
      totalSalaryPending: 68620,
      totalSchoolExpenses: 89000,
      totalExpensesPaid: 61500,
      totalExpensesPending: 27500,
      totalIncome: 83500,
      totalOutstandingPayments: 146120,
      counts: { billsCount: 5, salaryCount: 6, expenseCount: 4, transactionsCount: 6 }
    },
    charts: {
      monthlyIncomeData: [
        { month: 'June', amount: 320000 },
        { month: 'July', amount: 280000 },
        { month: 'August', amount: 310000 },
        { month: 'September', amount: 295000 },
        { month: 'October', amount: 83500 },
        { month: 'November', amount: 350000 }
      ],
      monthlyExpensesData: [
        { month: 'June', salary: 140000, expenses: 75000 },
        { month: 'July', salary: 140000, expenses: 82000 },
        { month: 'August', salary: 145000, expenses: 78000 },
        { month: 'September', salary: 145000, expenses: 80000 },
        { month: 'October', salary: 144570, expenses: 61500 },
        { month: 'November', salary: 150000, expenses: 85000 }
      ],
      categoryTotals: {
        'Electricity and Utilities': 34500,
        'Transport': 22000,
        'Maintenance': 14500,
        'Office Expenses': 18000
      }
    },
    recentTransactions: []
  });

  // Dashboard Filter State
  const [dashFilters, setDashFilters] = useState({
    academicYear: '2026-2027',
    month: 'October',
    class: 'All',
    section: 'All'
  });

  // ==========================================
  // 1. Student Bills State
  // ==========================================
  const [bills, setBills] = useState([]);
  const [billSearch, setBillSearch] = useState('');
  const [selectedStudentCard, setSelectedStudentCard] = useState(null);
  const [drillDownModal, setDrillDownModal] = useState({ isOpen: false, type: '', title: '', subtitle: '', color: '#3b82f6', targetTab: '' });
  const [billStatusFilter, setBillStatusFilter] = useState('All');
  const [billClassFilter, setBillClassFilter] = useState('All');
  const [billYearFilter, setBillYearFilter] = useState('2026-2027');
  const [billMonthFilter, setBillMonthFilter] = useState('All');
  const [billSectionFilter, setBillSectionFilter] = useState('All');

  // Bulk Import Modal State
  const [bulkImportModal, setBulkImportModal] = useState({
    isOpen: false,
    type: 'student', // 'student' | 'salary'
    previewData: [],
    fileName: '',
    importing: false,
    importedList: []
  });
  const [isBillModalOpen, setIsBillModalOpen] = useState(false);
  const [editingBill, setEditingBill] = useState(null);
  const [selectedBillForView, setSelectedBillForView] = useState(null);
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [activePayingRecord, setActivePayingRecord] = useState(null);

  // Standard fee types
  const standardFeeTypes = [
    'Monthly Fees',
    'Transport Fees',
    'Co-curricular Fees',
    'Term Fees',
    'Admission Fees',
    'Registration Fees',
    'Library Fees',
    'Laboratory Fees',
    'Sports Fees',
    'Computer Fees',
    'Uniform Fees',
    'Books Fees',
    'Annual Fees',
    'Exam Fees',
    'Building Fees',
    'Development Fees',
    'Miscellaneous Fees'
  ];

  const [billForm, setBillForm] = useState({
    studentName: '',
    studentId: '',
    admissionNumber: '',
    rollNo: '',
    grade: 'Grade 10',
    section: 'A',
    academicYear: '2026-2027',
    billingMonth: 'October',
    billingDate: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0],
    feeItems: [
      { feeType: 'Monthly Fees', description: 'Tuition Fee Oct 2026', amount: 15000, discount: 0, fine: 0, netAmount: 15000 },
      { feeType: 'Transport Fees', description: 'School Bus Route #2', amount: 5000, discount: 0, fine: 0, netAmount: 5000 },
      { feeType: 'Co-curricular Fees', description: 'Sports & Arts Lab', amount: 3000, discount: 0, fine: 0, netAmount: 3000 },
      { feeType: 'Term Fees', description: 'Term 1 Exam', amount: 5000, discount: 0, fine: 0, netAmount: 5000 }
    ],
    paidAmount: 0,
    paymentMethod: 'Cash',
    remarks: ''
  });

  // ==========================================
  // 2. Staff Salary State (Teaching & Non-Teaching)
  // ==========================================
  const [salaries, setSalaries] = useState([]);
  const [salarySearch, setSalarySearch] = useState('');
  const [staffCategoryTab, setStaffCategoryTab] = useState('ALL'); // 'ALL' | 'Teaching' | 'Non-Teaching'
  const [staffRoleFilter, setStaffRoleFilter] = useState('ALL'); // 'ALL' | 'Transport Driver' | 'Cleaning Worker' | 'Hostel Warden'
  const [salaryPayStatusFilter, setSalaryPayStatusFilter] = useState('ALL'); // 'ALL' | 'PAID' | 'NON-PAID'
  const [salaryMonthFilter, setSalaryMonthFilter] = useState('All');
  const [salaryYearFilter, setSalaryYearFilter] = useState('2026');
  const [salaryDepartmentFilter, setSalaryDepartmentFilter] = useState('All');
  const [isSalaryModalOpen, setIsSalaryModalOpen] = useState(false);
  const [editingSalary, setEditingSalary] = useState(null);
  const [selectedSalaryForView, setSelectedSalaryForView] = useState(null);

  const [salaryForm, setSalaryForm] = useState({
    staffName: '',
    staffId: '',
    staffType: 'Teaching',
    designation: 'Senior Teacher',
    department: 'Mathematics',
    salaryMonth: 'October',
    salaryYear: 2026,
    basicSalary: 35000,
    hra: 12000,
    allowances: 4000,
    bonus: 0,
    incentives: 0,
    pf: 4200,
    esi: 1200,
    otherDeductions: 0,
    salaryAdvance: 0,
    paidAmount: 0,
    paymentMethod: 'Bank Transfer',
    bankAccountNo: '',
    remarks: ''
  });

  // ==========================================
  // 3. School Expenses State
  // ==========================================
  const expenseCategories = [
    'Electricity and Utilities',
    'Maintenance',
    'Transport',
    'Office Expenses',
    'Cleaning and Security',
    'Academic and Activities',
    'Other Expenses'
  ];

  const [expenses, setExpenses] = useState([]);
  const [expenseSearch, setExpenseSearch] = useState('');
  const [expenseCatFilter, setExpenseCatFilter] = useState('All');
  const [expenseStatusFilter, setExpenseStatusFilter] = useState('All');
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [selectedExpenseForView, setSelectedExpenseForView] = useState(null);

  const [expenseForm, setExpenseForm] = useState({
    expenseCategory: 'Electricity and Utilities',
    expenseName: '',
    description: '',
    vendorName: '',
    invoiceNumber: '',
    expenseDate: new Date().toISOString().split('T')[0],
    amount: 5000,
    paidAmount: 0,
    paymentMethod: 'Bank Transfer',
    remarks: '',
    attachmentUrl: ''
  });

  // ==========================================
  // 4. Payment History State
  // ==========================================
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [paySearch, setPaySearch] = useState('');
  const [payTypeFilter, setPayTypeFilter] = useState('All');
  const [payStartDate, setPayStartDate] = useState('');
  const [payEndDate, setPayEndDate] = useState('');

  // ==========================================
  // 5. Reports Filter & State
  // ==========================================
  const [reportType, setReportType] = useState('student-fee-collection');
  const [reportMonth, setReportMonth] = useState('All');
  const [reportYear, setReportYear] = useState('2026-2027');
  const [reportClass, setReportClass] = useState('All');
  const [reportStatus, setReportStatus] = useState('All');

  // Single Payment Input Modal Form
  const [paymentRecordForm, setPaymentRecordForm] = useState({
    amount: '',
    paymentMethod: 'Bank Transfer',
    paymentDate: new Date().toISOString().split('T')[0],
    remarks: ''
  });

  // Toast notifier helper
  const showToast = (title, message, isError = false) => {
    setToastMessage({ title, message, isError });
    setTimeout(() => setToastMessage(null), 4500);
  };

  // Fetch Dashboard Summary
  const loadDashboardData = async () => {
    try {
      const res = await api.getFinanceDashboard(dashFilters);
      if (res && res.success) {
        setDashboardData(res);
      }
    } catch (err) {
      console.warn('Finance Dashboard API fallback:', err.message);
    }
  };

  // Fetch Student Bills
  const loadStudentBills = async () => {
    try {
      const res = await api.getStudentBills();
      if (res && res.success) {
        setBills(res.bills);
        // Default select first student if available and none selected
        if (res.bills && res.bills.length > 0 && !selectedStudentCard) {
          setSelectedStudentCard(res.bills[0]);
        }
      }
    } catch (err) {
      console.warn('Student Bills API fallback:', err.message);
    }
  };

  // Fetch Staff Salaries
  const loadStaffSalaries = async () => {
    try {
      const res = await api.getStaffSalaries();
      if (res && res.success) {
        setSalaries(res.salaries);
      }
    } catch (err) {
      console.warn('Staff Salaries API fallback:', err.message);
    }
  };

  // Fetch School Expenses
  const loadSchoolExpenses = async () => {
    try {
      const res = await api.getSchoolExpenses();
      if (res && res.success) {
        setExpenses(res.expenses);
      }
    } catch (err) {
      console.warn('School Expenses API fallback:', err.message);
    }
  };

  // Fetch Payment History
  const loadPaymentHistory = async () => {
    try {
      const res = await api.getPaymentHistory({
        type: payTypeFilter,
        search: paySearch,
        startDate: payStartDate,
        endDate: payEndDate
      });
      if (res && res.success) {
        setPaymentHistory(res.transactions);
      }
    } catch (err) {
      console.warn('Payment History API fallback:', err.message);
    }
  };

  // Initial Load
  useEffect(() => {
    loadDashboardData();
    loadStudentBills();
    loadStaffSalaries();
    loadSchoolExpenses();
    loadPaymentHistory();
  }, []);

  // When dashFilters change, reload dashboard
  useEffect(() => {
    loadDashboardData();
  }, [dashFilters]);

  // When payment filters change, reload history
  useEffect(() => {
    loadPaymentHistory();
  }, [payTypeFilter, paySearch, payStartDate, payEndDate]);

  // ==========================================
  // Student Billing Handlers
  // ==========================================
  const handleOpenBillModal = (bill = null) => {
    setEditingBill(bill);
    if (bill) {
      setBillForm({
        studentName: bill.studentName,
        studentId: bill.studentId,
        admissionNumber: bill.admissionNumber || '',
        rollNo: bill.rollNo || bill.studentId || '',
        grade: bill.grade,
        section: bill.section || 'A',
        academicYear: bill.academicYear || '2026-2027',
        billingMonth: bill.billingMonth,
        billingDate: bill.billingDate,
        dueDate: bill.dueDate,
        feeItems: (bill.feeItems && bill.feeItems.length > 0) ? bill.feeItems.map(it => ({
          ...it,
          status: it.status || (bill.paymentStatus === 'Paid' ? 'Paid' : 'Unpaid'),
          paidAmount: it.paidAmount != null ? it.paidAmount : (it.status === 'Paid' || bill.paymentStatus === 'Paid' ? Number(it.netAmount || it.amount || 0) : 0)
        })) : [
          { feeType: 'Monthly Fees', description: 'Tuition Fee Oct 2026', amount: 15000, discount: 0, fine: 0, netAmount: 15000, status: bill.paymentStatus === 'Paid' ? 'Paid' : 'Unpaid', paidAmount: bill.paymentStatus === 'Paid' ? 15000 : 0 },
          { feeType: 'Transport Fees', description: 'School Bus Route #2', amount: 5000, discount: 0, fine: 0, netAmount: 5000, status: bill.paymentStatus === 'Paid' ? 'Paid' : 'Unpaid', paidAmount: bill.paymentStatus === 'Paid' ? 5000 : 0 },
          { feeType: 'Co-curricular Fees', description: 'Sports & Arts Lab', amount: 3000, discount: 0, fine: 0, netAmount: 3000, status: bill.paymentStatus === 'Paid' ? 'Paid' : 'Unpaid', paidAmount: bill.paymentStatus === 'Paid' ? 3000 : 0 },
          { feeType: 'Term Fees', description: 'Term 1 Exam', amount: 5000, discount: 0, fine: 0, netAmount: 5000, status: bill.paymentStatus === 'Paid' ? 'Paid' : 'Unpaid', paidAmount: bill.paymentStatus === 'Paid' ? 5000 : 0 }
        ],
        paidAmount: bill.paidAmount,
        paymentMethod: bill.paymentMethod || 'Cash',
        remarks: bill.remarks || ''
      });
    } else {
      setBillForm({
        studentName: '',
        studentId: `S${Math.floor(100 + Math.random() * 900)}`,
        admissionNumber: `ADM-2024-${Math.floor(100 + Math.random() * 900)}`,
        rollNo: `S${Math.floor(100 + Math.random() * 900)}`,
        grade: 'Grade 10',
        section: 'A',
        academicYear: '2026-2027',
        billingMonth: 'October',
        billingDate: new Date().toISOString().split('T')[0],
        dueDate: new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0],
        feeItems: [
          { feeType: 'Monthly Fees', description: 'Tuition Fee Oct 2026', amount: 15000, discount: 0, fine: 0, netAmount: 15000, status: 'Unpaid', paidAmount: 0 },
          { feeType: 'Transport Fees', description: 'School Bus Route #2', amount: 5000, discount: 0, fine: 0, netAmount: 5000, status: 'Unpaid', paidAmount: 0 },
          { feeType: 'Co-curricular Fees', description: 'Sports & Arts Lab', amount: 3000, discount: 0, fine: 0, netAmount: 3000, status: 'Unpaid', paidAmount: 0 },
          { feeType: 'Term Fees', description: 'Term 1 Exam', amount: 5000, discount: 0, fine: 0, netAmount: 5000, status: 'Unpaid', paidAmount: 0 }
        ],
        paidAmount: 0,
        paymentMethod: 'Cash',
        remarks: ''
      });
    }
    setIsBillModalOpen(true);
  };

  const handleAddFeeItemRow = () => {
    setBillForm(prev => ({
      ...prev,
      feeItems: [
        ...prev.feeItems,
        { feeType: 'Miscellaneous Fees', description: '', amount: 1000, discount: 0, fine: 0, netAmount: 1000, status: 'Unpaid', paidAmount: 0 }
      ]
    }));
  };

  const handleRemoveFeeItemRow = (idx) => {
    if (billForm.feeItems.length <= 1) {
      showToast('Validation Error', 'A bill must have at least one fee item row.', true);
      return;
    }
    setBillForm(prev => ({
      ...prev,
      feeItems: prev.feeItems.filter((_, i) => i !== idx)
    }));
  };

  const handleFeeItemChange = (idx, field, val) => {
    setBillForm(prev => {
      const updated = [...prev.feeItems];
      const row = { ...updated[idx], [field]: val };
      if (['amount', 'discount', 'fine'].includes(field)) {
        const amt = Number(field === 'amount' ? val : row.amount) || 0;
        const disc = Number(field === 'discount' ? val : row.discount) || 0;
        const fine = Number(field === 'fine' ? val : row.fine) || 0;
        row.netAmount = Math.max(0, amt - disc + fine);
      }
      updated[idx] = row;
      return { ...prev, feeItems: updated };
    });
  };

  const handleToggleFeeItemStatus = (idx) => {
    setBillForm(prev => {
      const updated = [...prev.feeItems];
      const cur = updated[idx];
      const newStatus = cur.status === 'Paid' ? 'Unpaid' : 'Paid';
      const net = Number(cur.netAmount || 0);
      updated[idx] = {
        ...cur,
        status: newStatus,
        paidAmount: newStatus === 'Paid' ? net : 0
      };
      const autoSumPaid = updated.reduce((sum, it) => sum + (it.status === 'Paid' ? Number(it.netAmount || 0) : Number(it.paidAmount || 0)), 0);
      return {
        ...prev,
        feeItems: updated,
        paidAmount: autoSumPaid
      };
    });
  };

  const handleSaveBill = async (e) => {
    e.preventDefault();
    if (!billForm.studentName.trim()) {
      showToast('Validation Error', 'Student Name is required.', true);
      return;
    }

    setLoading(true);
    try {
      if (editingBill) {
        const res = await api.updateStudentBill(editingBill._id || editingBill.invoiceNumber, billForm);
        showToast('Success', 'Student fee invoice updated successfully!');
        const updatedBill = res.bill || { ...editingBill, ...billForm };
        if (selectedStudentCard && (selectedStudentCard._id === editingBill._id || selectedStudentCard.invoiceNumber === editingBill.invoiceNumber)) {
          setSelectedStudentCard(updatedBill);
        }
        syncBillToPortalFeeRecords(updatedBill);
      } else {
        const res = await api.createStudentBill(billForm);
        showToast('Success', 'New student fee invoice generated!');
        if (res.bill) {
          setSelectedStudentCard(res.bill);
          syncBillToPortalFeeRecords(res.bill);
        }
      }
      setIsBillModalOpen(false);
      loadStudentBills();
      loadDashboardData();
      loadPaymentHistory();
    } catch (err) {
      showToast('Error', err.message, true);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBill = async (bill) => {
    if (!window.confirm(`Are you sure you want to delete invoice ${bill.invoiceNumber} for ${bill.studentName}?`)) {
      return;
    }
    try {
      await api.deleteStudentBill(bill._id || bill.invoiceNumber);
      showToast('Deleted', `Invoice ${bill.invoiceNumber} deleted successfully.`);
      if (selectedStudentCard && (selectedStudentCard._id === bill._id || selectedStudentCard.invoiceNumber === bill.invoiceNumber)) {
        setSelectedStudentCard(null);
      }
      loadStudentBills();
      loadDashboardData();
    } catch (err) {
      showToast('Error', err.message, true);
    }
  };

  // ==========================================
  // BULK EXCEL UPLOAD HANDLERS
  // ==========================================
  const handleOpenBulkModal = (type) => {
    setBulkImportModal({
      isOpen: true,
      type, // 'student' | 'salary'
      previewData: [],
      fileName: '',
      importing: false,
      importedList: []
    });
  };

  const handleExcelFileSelect = (e, type) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws);

        if (!data || data.length === 0) {
          showToast('Import Warning', 'Selected file contains no valid rows.', true);
          return;
        }

        setBulkImportModal(prev => ({
          ...prev,
          isOpen: true,
          type,
          fileName: file.name,
          previewData: data,
          importedList: []
        }));
        showToast('File Loaded', `Found ${data.length} records ready for preview & import.`);
      } catch (err) {
        showToast('Parse Error', 'Failed to read Excel file: ' + err.message, true);
      }
    };
    reader.readAsBinaryString(file);
    e.target.value = ''; // reset
  };

  const handleConfirmBulkImport = async () => {
    if (!bulkImportModal.previewData || bulkImportModal.previewData.length === 0) {
      showToast('Validation Error', 'No records to import.', true);
      return;
    }

    setBulkImportModal(prev => ({ ...prev, importing: true }));
    try {
      if (bulkImportModal.type === 'student') {
        const res = await api.bulkImportStudentBills(bulkImportModal.previewData);
        showToast('Bulk Import Success', res.message || `Imported ${bulkImportModal.previewData.length} student records!`);
        if (res.bills && Array.isArray(res.bills)) {
          res.bills.forEach(b => syncBillToPortalFeeRecords(b));
          setBulkImportModal(prev => ({ ...prev, importing: false, importedList: res.bills }));
        } else {
          setBulkImportModal(prev => ({ ...prev, importing: false, importedList: bulkImportModal.previewData }));
        }
        loadStudentBills();
        loadDashboardData();
      } else {
        const res = await api.bulkImportStaffSalaries(bulkImportModal.previewData);
        showToast('Bulk Import Success', res.message || `Imported ${bulkImportModal.previewData.length} staff salary records!`);
        setBulkImportModal(prev => ({
          ...prev,
          importing: false,
          importedList: res.salaries || bulkImportModal.previewData
        }));
        loadStaffSalaries();
        loadDashboardData();
      }
    } catch (err) {
      showToast('Import Error', err.message, true);
      setBulkImportModal(prev => ({ ...prev, importing: false }));
    }
  };

  const downloadSampleTemplate = (type) => {
    if (type === 'student') {
      const sample = [
        {
          'Student Name': 'Aishwarya Kumar',
          'Student ID': 'S101',
          'Roll No': 'S101',
          'Class': 'Grade 10',
          'Section': 'A',
          'Academic Year': '2026-2027',
          'Month': 'October',
          'Monthly Fees': 15000,
          'Transport Fees': 5000,
          'Co-curricular Fees': 3000,
          'Term Fees': 5000,
          'Total Fees': 28000,
          'Paid Amount': 28000,
          'Due Date': '2026-10-15',
          'Monthly Fee Status': 'Paid',
          'Transport Fee Status': 'Paid',
          'Co-curricular Fee Status': 'Paid',
          'Term Fee Status': 'Paid',
          'Payment Method': 'UPI / NetBanking',
          'Parent Name': 'Ramesh Kumar',
          'Parent Phone': '+91 98456 12301'
        },
        {
          'Student Name': 'Kavitha Selvam',
          'Student ID': 'S102',
          'Roll No': 'S102',
          'Class': 'Grade 10',
          'Section': 'A',
          'Academic Year': '2026-2027',
          'Month': 'October',
          'Monthly Fees': 15000,
          'Transport Fees': 5000,
          'Co-curricular Fees': 3000,
          'Term Fees': 5000,
          'Total Fees': 28000,
          'Paid Amount': 16000,
          'Due Date': '2026-10-15',
          'Monthly Fee Status': 'Paid',
          'Transport Fee Status': 'Unpaid',
          'Co-curricular Fee Status': 'Unpaid',
          'Term Fee Status': 'Unpaid',
          'Payment Method': 'Bank Transfer',
          'Parent Name': 'Selvam Murugan',
          'Parent Phone': '+91 98456 12302'
        }
      ];
      exportToExcel(sample, 'Sample_Student_Billing_Template');
    } else {
      const sample = [
        {
          'Staff ID': 'T01',
          'Staff Name': 'Mrs. Priya Krishnan',
          'Designation': 'Senior Mathematics Teacher',
          'Department': 'Mathematics',
          'Staff Type': 'Teaching',
          'Month': 'October',
          'Year': 2026,
          'Basic Salary': 35000,
          'HRA': 12000,
          'Allowances': 5000,
          'Bonus': 2000,
          'Incentives': 1000,
          'PF': 4200,
          'ESI': 1200,
          'Other Deductions': 0,
          'Advance': 0,
          'Paid Amount': 49600,
          'Payment Method': 'Bank Transfer',
          'Bank Account No': 'SBIN0048123',
          'Payment Date': '2026-10-01'
        },
        {
          'Staff ID': 'NT01',
          'Staff Name': 'Mr. Murugan Velu',
          'Designation': 'Transport Driver',
          'Department': 'Transport',
          'Staff Type': 'Non-Teaching',
          'Month': 'October',
          'Year': 2026,
          'Basic Salary': 18000,
          'HRA': 5000,
          'Allowances': 3000,
          'Bonus': 1000,
          'Incentives': 500,
          'PF': 2160,
          'ESI': 750,
          'Other Deductions': 0,
          'Advance': 0,
          'Paid Amount': 24590,
          'Payment Method': 'Bank Transfer',
          'Bank Account No': 'IOBA0019284',
          'Payment Date': '2026-10-01'
        }
      ];
      exportToExcel(sample, 'Sample_Staff_Salary_Template');
    }
  };

  // Helper to extract specific fee from feeItems
  const getFeeAmount = (bill, typeName) => {
    if (!bill || !bill.feeItems) return 0;
    const item = bill.feeItems.find(f => (f.feeType || '').toLowerCase().includes(typeName.toLowerCase()));
    return item ? Number(item.netAmount || item.amount || 0) : 0;
  };

  const getFeeStatus = (bill, typeName) => {
    if (!bill || !bill.feeItems) return bill?.paymentStatus === 'Paid' ? 'Paid' : 'Unpaid';
    const item = bill.feeItems.find(f => (f.feeType || '').toLowerCase().includes(typeName.toLowerCase()));
    if (!item) return bill.paymentStatus === 'Paid' ? 'Paid' : 'Unpaid';
    if (item.status) return item.status;
    return bill.paymentStatus === 'Paid' ? 'Paid' : 'Unpaid';
  };

  // ==========================================
  // Staff Salary Handlers
  // ==========================================
  const handleOpenSalaryModal = (salary = null, defaultType = 'Teaching', defaultDesig = 'Senior Teacher') => {
    setEditingSalary(salary);
    if (salary) {
      setSalaryForm({
        staffName: salary.staffName,
        staffId: salary.staffId,
        staffType: salary.staffType || 'Teaching',
        designation: salary.designation,
        department: salary.department,
        salaryMonth: salary.salaryMonth,
        salaryYear: salary.salaryYear,
        basicSalary: salary.basicSalary,
        hra: salary.hra || 0,
        allowances: salary.allowances || 0,
        bonus: salary.bonus || 0,
        incentives: salary.incentives || 0,
        pf: salary.pf || 0,
        esi: salary.esi || 0,
        otherDeductions: salary.otherDeductions || 0,
        salaryAdvance: salary.salaryAdvance || 0,
        paidAmount: salary.paidAmount || 0,
        paymentMethod: salary.paymentMethod || 'Bank Transfer',
        bankAccountNo: salary.bankAccountNo || '',
        remarks: salary.remarks || ''
      });
    } else {
      const isNT = defaultType === 'Non-Teaching';
      setSalaryForm({
        staffName: '',
        staffId: isNT ? `NT-0${Math.floor(1 + Math.random() * 9)}` : `T0${Math.floor(1 + Math.random() * 8)}`,
        staffType: defaultType,
        designation: defaultDesig,
        department: isNT ? (defaultDesig.includes('Driver') ? 'Transport & Fleet' : defaultDesig.includes('Cleaning') ? 'Housekeeping' : 'Hostel') : 'Academics',
        salaryMonth: 'October',
        salaryYear: 2026,
        basicSalary: isNT ? 18000 : 35000,
        hra: isNT ? 4500 : 12000,
        allowances: isNT ? 2500 : 4000,
        bonus: 0,
        incentives: 0,
        pf: isNT ? 2160 : 4200,
        esi: isNT ? 650 : 1200,
        otherDeductions: 0,
        salaryAdvance: 0,
        paidAmount: 0,
        paymentMethod: 'Bank Transfer',
        bankAccountNo: 'SBI-XXXX8892',
        remarks: ''
      });
    }
    setIsSalaryModalOpen(true);
  };

  const handleSaveSalary = async (e) => {
    e.preventDefault();
    if (!salaryForm.staffName.trim()) {
      showToast('Validation Error', 'Staff name is required.', true);
      return;
    }

    setLoading(true);
    try {
      if (editingSalary) {
        await api.updateStaffSalary(editingSalary._id || editingSalary.salarySlipNo, salaryForm);
        showToast('Salary Updated', 'Salary record updated successfully.');
      } else {
        await api.generateStaffSalary(salaryForm);
        showToast('Salary Generated', 'Staff salary slip generated successfully.');
      }
      setIsSalaryModalOpen(false);
      loadStaffSalaries();
      loadDashboardData();
      loadPaymentHistory();
    } catch (err) {
      showToast('Duplicate / Error', err.message, true);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // School Expenses Handlers
  // ==========================================
  const handleOpenExpenseModal = (expense = null) => {
    setEditingExpense(expense);
    if (expense) {
      setExpenseForm({
        expenseCategory: expense.expenseCategory,
        expenseName: expense.expenseName,
        description: expense.description || '',
        vendorName: expense.vendorName,
        invoiceNumber: expense.invoiceNumber || '',
        expenseDate: expense.expenseDate,
        amount: expense.amount,
        paidAmount: expense.paidAmount || 0,
        paymentMethod: expense.paymentMethod || 'Bank Transfer',
        remarks: expense.remarks || '',
        attachmentUrl: expense.attachmentUrl || ''
      });
    } else {
      setExpenseForm({
        expenseCategory: 'Electricity and Utilities',
        expenseName: '',
        description: '',
        vendorName: '',
        invoiceNumber: `INV-${Date.now().toString().slice(-4)}`,
        expenseDate: new Date().toISOString().split('T')[0],
        amount: 5000,
        paidAmount: 0,
        paymentMethod: 'Bank Transfer',
        remarks: '',
        attachmentUrl: ''
      });
    }
    setIsExpenseModalOpen(true);
  };

  const handleSaveExpense = async (e) => {
    e.preventDefault();
    if (!expenseForm.expenseName.trim() || !expenseForm.vendorName.trim()) {
      showToast('Validation Error', 'Expense Name and Vendor Name are required.', true);
      return;
    }

    setLoading(true);
    try {
      if (editingExpense) {
        await api.updateSchoolExpense(editingExpense._id || editingExpense.expenseId, expenseForm);
        showToast('Updated', 'Expense entry updated successfully.');
      } else {
        await api.addSchoolExpense(expenseForm);
        showToast('Expense Added', 'New school expense recorded successfully.');
      }
      setIsExpenseModalOpen(false);
      loadSchoolExpenses();
      loadDashboardData();
      loadPaymentHistory();
    } catch (err) {
      showToast('Error', err.message, true);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteExpense = async (expense) => {
    if (!window.confirm(`Are you sure you want to remove expense ${expense.expenseName} (${expense.expenseId})?`)) {
      return;
    }
    try {
      await api.deleteSchoolExpense(expense._id || expense.expenseId);
      showToast('Deleted', 'Expense record deleted.');
      loadSchoolExpenses();
      loadDashboardData();
    } catch (err) {
      showToast('Error', err.message, true);
    }
  };

  // ==========================================
  // Record Payment Modal (Unified for Bill, Salary, Expense)
  // ==========================================
  const handleOpenPayModal = (record, type) => {
    setActivePayingRecord({ ...record, _paymentType: type });
    setPaymentRecordForm({
      amount: record.pendingAmount || '',
      paymentMethod: record.paymentMethod || (type === 'Student' ? 'Cash' : 'Bank Transfer'),
      paymentDate: new Date().toISOString().split('T')[0],
      remarks: `Payment towards ${record.invoiceNumber || record.salarySlipNo || record.expenseId}`
    });
    setIsPayModalOpen(true);
  };

  const handleExecutePayment = async (e) => {
    e.preventDefault();
    const payAmt = Number(paymentRecordForm.amount);
    if (isNaN(payAmt) || payAmt <= 0) {
      showToast('Validation Error', 'Please enter a valid positive payment amount.', true);
      return;
    }

    if (payAmt > activePayingRecord.pendingAmount) {
      showToast(
        'Overpayment Prevented',
        `Payment (₹${payAmt.toLocaleString()}) cannot exceed the pending balance (₹${activePayingRecord.pendingAmount.toLocaleString()}).`,
        true
      );
      return;
    }

    setLoading(true);
    try {
      if (activePayingRecord._paymentType === 'Student') {
        const res = await api.recordStudentBillPayment(activePayingRecord._id || activePayingRecord.invoiceNumber, paymentRecordForm);
        loadStudentBills();
        const updatedBill = res.bill || {
          ...activePayingRecord,
          paidAmount: (Number(activePayingRecord.paidAmount) || 0) + payAmt,
          pendingAmount: Math.max(0, (Number(activePayingRecord.pendingAmount) || 0) - payAmt),
          paymentStatus: (Number(activePayingRecord.pendingAmount) || 0) - payAmt <= 0 ? 'Paid' : 'Partially Paid'
        };
        if (selectedStudentCard && (selectedStudentCard._id === activePayingRecord._id || selectedStudentCard.invoiceNumber === activePayingRecord.invoiceNumber)) {
          setSelectedStudentCard(updatedBill);
        }
        syncBillToPortalFeeRecords(updatedBill);
      } else if (activePayingRecord._paymentType === 'Salary') {
        await api.recordStaffSalaryPayment(activePayingRecord._id || activePayingRecord.salarySlipNo, paymentRecordForm);
        loadStaffSalaries();
      } else if (activePayingRecord._paymentType === 'Expense') {
        await api.recordSchoolExpensePayment(activePayingRecord._id || activePayingRecord.expenseId, paymentRecordForm);
        loadSchoolExpenses();
      }

      showToast('Payment Successful', `₹${payAmt.toLocaleString()} payment recorded successfully!`);
      setIsPayModalOpen(false);
      loadDashboardData();
      loadPaymentHistory();
    } catch (err) {
      showToast('Error Recording Payment', err.message, true);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // Export Excel Handlers
  // ==========================================
  const exportToExcel = (dataList, fileName) => {
    try {
      const ws = XLSX.utils.json_to_sheet(dataList);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Report');
      XLSX.writeFile(wb, `${fileName}_${new Date().toISOString().split('T')[0]}.xlsx`);
      showToast('Export Complete', `${fileName}.xlsx downloaded.`);
    } catch (err) {
      showToast('Export Error', err.message, true);
    }
  };

  // Calculated Salary Preview in form
  const calcGross = (Number(salaryForm.basicSalary) || 0) +
    (Number(salaryForm.hra) || 0) +
    (Number(salaryForm.allowances) || 0) +
    (Number(salaryForm.bonus) || 0) +
    (Number(salaryForm.incentives) || 0);

  const calcDeductions = (Number(salaryForm.pf) || 0) +
    (Number(salaryForm.esi) || 0) +
    (Number(salaryForm.otherDeductions) || 0) +
    (Number(salaryForm.salaryAdvance) || 0);

  const calcNet = Math.max(0, calcGross - calcDeductions);

  // Filtered views
  const filteredBills = bills.filter(b => {
    const q = billSearch.toLowerCase();
    const matchSearch = (b.studentName || '').toLowerCase().includes(q) ||
      (b.invoiceNumber || '').toLowerCase().includes(q) ||
      (b.rollNo || '').toLowerCase().includes(q) ||
      (b.studentId || '').toLowerCase().includes(q);
    const matchStatus = billStatusFilter === 'All' || b.paymentStatus === billStatusFilter;
    const matchClass = billClassFilter === 'All' || (b.grade || '').includes(billClassFilter);
    const matchYear = billYearFilter === 'All' || (b.academicYear || '2026-2027') === billYearFilter;
    const matchMonth = billMonthFilter === 'All' || (b.billingMonth || '').toLowerCase() === billMonthFilter.toLowerCase();
    const matchSection = billSectionFilter === 'All' || (b.section || 'A').toUpperCase() === billSectionFilter.toUpperCase();
    return matchSearch && matchStatus && matchClass && matchYear && matchMonth && matchSection;
  });

  // Staff Salary Filter with Teaching & Non-Teaching (Drivers, Cleaners, Wardens) and Paid / Non-Paid
  const filteredSalaries = salaries.filter(s => {
    const q = salarySearch.toLowerCase();
    const matchSearch = (s.staffName || '').toLowerCase().includes(q) ||
      (s.staffId || '').toLowerCase().includes(q) ||
      (s.department || '').toLowerCase().includes(q) ||
      (s.designation || '').toLowerCase().includes(q);

    // Teaching vs Non-Teaching category
    const isNonTeaching = s.staffType === 'Non-Teaching' ||
      ['Transport Driver', 'Cleaning Worker', 'Hostel Warden', 'Security', 'Driver', 'Housekeeping'].includes(s.designation);

    const matchCategory = staffCategoryTab === 'ALL' ||
      (staffCategoryTab === 'Teaching' && !isNonTeaching) ||
      (staffCategoryTab === 'Non-Teaching' && isNonTeaching);

    // Non-Teaching Specific Role Sub-filter
    let matchRole = true;
    if (staffRoleFilter !== 'ALL') {
      matchRole = (s.designation || '').toLowerCase().includes(staffRoleFilter.toLowerCase());
    }

    // Paid vs Non-Paid button filter
    let matchPaid = true;
    if (salaryPayStatusFilter === 'PAID') {
      matchPaid = s.paymentStatus === 'Paid';
    } else if (salaryPayStatusFilter === 'NON-PAID') {
      matchPaid = s.paymentStatus !== 'Paid';
    }

    const matchMonth = salaryMonthFilter === 'All' || s.salaryMonth === salaryMonthFilter;
    const matchYear = salaryYearFilter === 'All' || String(s.salaryYear) === String(salaryYearFilter);
    const matchDept = salaryDepartmentFilter === 'All' || (s.department || '').toLowerCase().includes(salaryDepartmentFilter.toLowerCase());

    return matchSearch && matchCategory && matchRole && matchPaid && matchMonth && matchYear && matchDept;
  });

  const filteredExpenses = expenses.filter(e => {
    const matchSearch = (e.expenseName || '').toLowerCase().includes(expenseSearch.toLowerCase()) ||
      (e.vendorName || '').toLowerCase().includes(expenseSearch.toLowerCase()) ||
      (e.expenseId || '').toLowerCase().includes(expenseSearch.toLowerCase());
    const matchCat = expenseCatFilter === 'All' || e.expenseCategory === expenseCatFilter;
    const matchStatus = expenseStatusFilter === 'All' || e.paymentStatus === expenseStatusFilter;
    return matchSearch && matchCat && matchStatus;
  });

  return (
    <div className="school-finance-container" style={{ padding: '4px' }}>
      {/* Toast Notification Alert */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '24px',
          zIndex: 99999,
          background: toastMessage.isError ? '#ef4444' : '#10b981',
          color: '#ffffff',
          padding: '14px 20px',
          borderRadius: '10px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.18)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          maxWidth: '420px',
          animation: 'fadeIn 0.3s ease-out'
        }}>
          <span style={{ fontSize: '1.2rem' }}>{toastMessage.isError ? '⚠️' : '✅'}</span>
          <div>
            <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>{toastMessage.title}</div>
            <div style={{ fontSize: '0.82rem', opacity: 0.95 }}>{toastMessage.message}</div>
          </div>
          <button
            onClick={() => setToastMessage(null)}
            style={{ marginLeft: 'auto', background: 'none', border: 'none', color: '#fff', fontSize: '1.2rem', cursor: 'pointer' }}
          >
            &times;
          </button>
        </div>
      )}

      {/* Primary Submenu Tabs Bar (All 6 Submenus under one Finance Menu) */}
      <div style={{
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '12px',
        padding: '8px',
        marginBottom: '24px',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '6px',
        boxShadow: '0 2px 6px rgba(0,0,0,0.03)'
      }}>
        {[
          { id: 'dashboard', label: '1. Finance Dashboard' },
          { id: 'student-billing', label: '2. Student Billing' },
          { id: 'staff-salary', label: '3. Staff Salary' },
          { id: 'school-expenses', label: '4. School Expenses' },
          { id: 'finance-reports', label: '5. Finance Reports' },
          { id: 'payment-history', label: '6. Payment History' },
        ].map((tab) => {
          const isActive = subTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setSubTab(tab.id)}
              style={{
                flex: '1 1 auto',
                minWidth: '150px',
                padding: '10px 16px',
                borderRadius: '8px',
                border: 'none',
                background: isActive ? 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)' : 'transparent',
                color: isActive ? '#ffffff' : '#475569',
                fontWeight: isActive ? 700 : 600,
                fontSize: '0.9rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'all 0.2s ease',
                boxShadow: isActive ? '0 4px 12px rgba(37, 99, 235, 0.25)' : 'none'
              }}
            >
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* =================================================================== */}
      {/* 1. FINANCE DASHBOARD */}
      {/* =================================================================== */}
      {subTab === 'dashboard' && (
        <div>
          {/* Dashboard Header & Multi-Filter Bar */}
          <div style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            padding: '18px 20px',
            marginBottom: '24px',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '16px'
          }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#1e3a8a', fontWeight: 800 }}>
                Campus Finance Overview & Key Performance
              </h3>
              <p style={{ margin: '4px 0 0', fontSize: '0.84rem', color: '#64748b' }}>
                Real-time synchronized ledger across fees, staff salaries, and campus infrastructure expenses
              </p>
            </div>

            {/* Filters: Academic Year, Month, Class, Section */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Academic Year</label>
                <select
                  value={dashFilters.academicYear}
                  onChange={(e) => setDashFilters({ ...dashFilters, academicYear: e.target.value })}
                  style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                >
                  <option value="2026-2027">2026-2027</option>
                  <option value="2025-2026">2025-2026</option>
                  <option value="All">All Years</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Month</label>
                <select
                  value={dashFilters.month}
                  onChange={(e) => setDashFilters({ ...dashFilters, month: e.target.value })}
                  style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                >
                  <option value="October">October</option>
                  <option value="November">November</option>
                  <option value="September">September</option>
                  <option value="August">August</option>
                  <option value="All">All Months</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Class</label>
                <select
                  value={dashFilters.class}
                  onChange={(e) => setDashFilters({ ...dashFilters, class: e.target.value })}
                  style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                >
                  <option value="All">All Classes</option>
                  <option value="Grade 10">Grade 10</option>
                  <option value="Grade 9">Grade 9</option>
                  <option value="Grade 11">Grade 11</option>
                  <option value="Grade 12">Grade 12</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Section</label>
                <select
                  value={dashFilters.section}
                  onChange={(e) => setDashFilters({ ...dashFilters, section: e.target.value })}
                  style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                >
                  <option value="All">All Sections</option>
                  <option value="A">Sec A</option>
                  <option value="B">Sec B</option>
                  <option value="C">Sec C</option>
                </select>
              </div>

              <button
                className="btn btn-sm btn-outline"
                onClick={loadDashboardData}
                style={{ marginTop: '16px', borderRadius: '6px' }}
              >
                Refresh
              </button>
            </div>
          </div>

          {/* 9 Summary Cards as Specified */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '16px',
            marginBottom: '24px'
          }}>
            {/* Card 1: Total Student Fees */}
            <div
              onClick={() => setDrillDownModal({
                isOpen: true,
                type: 'student-fees-all',
                title: 'Total Student Fees Breakdown',
                subtitle: 'All billed student accounts across grades and terms',
                color: '#3b82f6',
                targetTab: 'student-billing'
              })}
              style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '10px',
                padding: '16px',
                borderLeft: '4px solid #3b82f6',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 16px rgba(59,130,246,0.18)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.05)'; }}
              title="Click to view details"
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: '0.76rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Total Student Fees</div>
                <span style={{ fontSize: '0.74rem', color: '#3b82f6', fontWeight: 700 }}>View &rarr;</span>
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1e3a8a', marginTop: '6px' }}>
                ₹{(dashboardData.summary?.totalStudentFees || 0).toLocaleString()}
              </div>
              <div style={{ fontSize: '0.76rem', color: '#64748b', marginTop: '4px' }}>Billed student accounts ({dashboardData.summary?.counts?.billsCount || 0} active)</div>
            </div>

            {/* Card 2: Total Fees Collected */}
            <div
              onClick={() => setDrillDownModal({
                isOpen: true,
                type: 'fees-collected',
                title: 'Total Fees Collected Breakdown',
                subtitle: 'Paid student fee receipts received via UPI, NetBanking & Cash',
                color: '#10b981',
                targetTab: 'payment-history'
              })}
              style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '10px',
                padding: '16px',
                borderLeft: '4px solid #10b981',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 16px rgba(16,185,129,0.18)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.05)'; }}
              title="Click to view details"
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: '0.76rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Total Fees Collected</div>
                <span style={{ fontSize: '0.74rem', color: '#10b981', fontWeight: 700 }}>View &rarr;</span>
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#10b981', marginTop: '6px' }}>
                ₹{(dashboardData.summary?.totalFeesCollected || 0).toLocaleString()}
              </div>
              <div style={{ fontSize: '0.76rem', color: '#16a34a', marginTop: '4px' }}>Received via UPI, NetBanking & Cash</div>
            </div>

            {/* Card 3: Total Pending Student Fees */}
            <div
              onClick={() => setDrillDownModal({
                isOpen: true,
                type: 'student-fees-pending',
                title: 'Total Pending Student Fees Breakdown',
                subtitle: 'Students with unpaid or partial tuition and term balances',
                color: '#ef4444',
                targetTab: 'student-billing'
              })}
              style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '10px',
                padding: '16px',
                borderLeft: '4px solid #ef4444',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 16px rgba(239,68,68,0.18)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.05)'; }}
              title="Click to view details"
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: '0.76rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Total Pending Student Fees</div>
                <span style={{ fontSize: '0.74rem', color: '#ef4444', fontWeight: 700 }}>View &rarr;</span>
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ef4444', marginTop: '6px' }}>
                ₹{(dashboardData.summary?.totalPendingStudentFees || 0).toLocaleString()}
              </div>
              <div style={{ fontSize: '0.76rem', color: '#dc2626', marginTop: '4px' }}>Awaiting settlement & partial balances</div>
            </div>

            {/* Card 4: Total Staff Salary */}
            <div
              onClick={() => setDrillDownModal({
                isOpen: true,
                type: 'staff-salary-all',
                title: 'Total Staff Salary Payroll',
                subtitle: 'Teaching and Non-Teaching staff monthly net payroll liability',
                color: '#6366f1',
                targetTab: 'staff-salary'
              })}
              style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '10px',
                padding: '16px',
                borderLeft: '4px solid #6366f1',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 16px rgba(99,102,241,0.18)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.05)'; }}
              title="Click to view details"
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: '0.76rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Total Staff Salary</div>
                <span style={{ fontSize: '0.74rem', color: '#6366f1', fontWeight: 700 }}>View &rarr;</span>
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#4f46e5', marginTop: '6px' }}>
                ₹{(dashboardData.summary?.totalStaffSalary || 0).toLocaleString()}
              </div>
              <div style={{ fontSize: '0.76rem', color: '#64748b', marginTop: '4px' }}>Net payroll liability (Teaching + Non-Teaching)</div>
            </div>

            {/* Card 5: Total Salary Paid */}
            <div
              onClick={() => setDrillDownModal({
                isOpen: true,
                type: 'staff-salary-paid',
                title: 'Total Salary Paid Records',
                subtitle: 'Disbursed staff salary bank transfers & payouts',
                color: '#14b8a6',
                targetTab: 'staff-salary'
              })}
              style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '10px',
                padding: '16px',
                borderLeft: '4px solid #14b8a6',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 16px rgba(20,184,166,0.18)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.05)'; }}
              title="Click to view details"
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: '0.76rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Total Salary Paid</div>
                <span style={{ fontSize: '0.74rem', color: '#14b8a6', fontWeight: 700 }}>View &rarr;</span>
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0d9488', marginTop: '6px' }}>
                ₹{(dashboardData.summary?.totalSalaryPaid || 0).toLocaleString()}
              </div>
              <div style={{ fontSize: '0.76rem', color: '#14b8a6', marginTop: '4px' }}>Disbursed directly into bank accounts</div>
            </div>

            {/* Card 6: Total Salary Pending */}
            <div
              onClick={() => setDrillDownModal({
                isOpen: true,
                type: 'staff-salary-pending',
                title: 'Total Pending Staff Salary',
                subtitle: 'Staff awaiting payroll batch processing or partial disbursement',
                color: '#f59e0b',
                targetTab: 'staff-salary'
              })}
              style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '10px',
                padding: '16px',
                borderLeft: '4px solid #f59e0b',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 16px rgba(245,158,11,0.18)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.05)'; }}
              title="Click to view details"
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: '0.76rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Total Salary Pending</div>
                <span style={{ fontSize: '0.74rem', color: '#f59e0b', fontWeight: 700 }}>View &rarr;</span>
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#d97706', marginTop: '6px' }}>
                ₹{(dashboardData.summary?.totalSalaryPending || 0).toLocaleString()}
              </div>
              <div style={{ fontSize: '0.76rem', color: '#b45309', marginTop: '4px' }}>Pending batch transfer processing</div>
            </div>

            {/* Card 7: Total School Expenses */}
            <div
              onClick={() => setDrillDownModal({
                isOpen: true,
                type: 'expenses-all',
                title: 'Campus School Expenses Breakdown',
                subtitle: 'Utilities, maintenance, transport fuel, vendor invoices and operations',
                color: '#8b5cf6',
                targetTab: 'school-expenses'
              })}
              style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '10px',
                padding: '16px',
                borderLeft: '4px solid #8b5cf6',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 16px rgba(139,92,246,0.18)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.05)'; }}
              title="Click to view details"
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: '0.76rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Total School Expenses</div>
                <span style={{ fontSize: '0.74rem', color: '#8b5cf6', fontWeight: 700 }}>View &rarr;</span>
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#7c3aed', marginTop: '6px' }}>
                ₹{(dashboardData.summary?.totalSchoolExpenses || 0).toLocaleString()}
              </div>
              <div style={{ fontSize: '0.76rem', color: '#64748b', marginTop: '4px' }}>Utilities, fleet fuel & maintenance</div>
            </div>

            {/* Card 8: Total Income */}
            <div
              onClick={() => setDrillDownModal({
                isOpen: true,
                type: 'income-all',
                title: 'Gross Institutional Revenue & Inflow',
                subtitle: 'All fees collected, registration inflows, and institutional revenue',
                color: '#059669',
                targetTab: 'finance-reports'
              })}
              style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '10px',
                padding: '16px',
                borderLeft: '4px solid #059669',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 16px rgba(5,150,105,0.18)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.05)'; }}
              title="Click to view details"
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: '0.76rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Total Income</div>
                <span style={{ fontSize: '0.74rem', color: '#059669', fontWeight: 700 }}>View &rarr;</span>
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#059669', marginTop: '6px' }}>
                ₹{(dashboardData.summary?.totalIncome || 0).toLocaleString()}
              </div>
              <div style={{ fontSize: '0.76rem', color: '#10b981', marginTop: '4px' }}>Gross collected revenue inflow</div>
            </div>

            {/* Card 9: Total Outstanding Payments */}
            <div
              onClick={() => setDrillDownModal({
                isOpen: true,
                type: 'outstanding-all',
                title: 'Combined Outstanding Payments & Payables',
                subtitle: 'Consolidated pending receivables from students & pending payable obligations',
                color: '#e11d48',
                targetTab: 'student-billing'
              })}
              style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '10px',
                padding: '16px',
                borderLeft: '4px solid #e11d48',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 16px rgba(225,29,72,0.18)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.05)'; }}
              title="Click to view details"
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: '0.76rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Total Outstanding Payments</div>
                <span style={{ fontSize: '0.74rem', color: '#e11d48', fontWeight: 700 }}>View &rarr;</span>
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#e11d48', marginTop: '6px' }}>
                ₹{(dashboardData.summary?.totalOutstandingPayments || 0).toLocaleString()}
              </div>
              <div style={{ fontSize: '0.76rem', color: '#e11d48', marginTop: '4px' }}>Combined dues across fees & bills</div>
            </div>
          </div>

          {/* Charts Visual Section */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '20px', marginBottom: '24px' }}>
            {/* Visual 1: Monthly Income vs Expenses Chart */}
            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px' }}>
              <h4 style={{ margin: '0 0 16px', fontSize: '1rem', color: '#1e3a8a', fontWeight: 700 }}>
                📈 Monthly Income & Expense Trends
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {(dashboardData.charts?.monthlyIncomeData || []).map((m, idx) => {
                  const maxAmt = 400000;
                  const expMatch = (dashboardData.charts?.monthlyExpensesData || [])[idx] || { salary: 140000, expenses: 70000 };
                  const totalExp = (expMatch.salary || 0) + (expMatch.expenses || 0);

                  const incomePct = Math.min(100, (m.amount / maxAmt) * 100);
                  const expPct = Math.min(100, (totalExp / maxAmt) * 100);

                  return (
                    <div key={m.month}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>
                        <span>{m.month}</span>
                        <span>Income: ₹{m.amount.toLocaleString()} | Exp: ₹{totalExp.toLocaleString()}</span>
                      </div>
                      <div style={{ height: '8px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden', display: 'flex', gap: '2px' }}>
                        <div style={{ width: `${incomePct}%`, background: '#10b981', height: '100%', borderRadius: '4px' }} title={`Income: ₹${m.amount}`}></div>
                      </div>
                      <div style={{ height: '6px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden', marginTop: '3px' }}>
                        <div style={{ width: `${expPct}%`, background: '#ef4444', height: '100%', borderRadius: '4px' }} title={`Expense: ₹${totalExp}`}></div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div style={{ display: 'flex', gap: '16px', marginTop: '16px', fontSize: '0.78rem', color: '#64748b' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '12px', height: '12px', background: '#10b981', borderRadius: '2px' }}></span> Inflow (Student Fee Collection)
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '12px', height: '12px', background: '#ef4444', borderRadius: '2px' }}></span> Outflow (Salary + Expenses)
                </div>
              </div>
            </div>

            {/* Visual 2: Expense Category Breakdown */}
            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px' }}>
              <h4 style={{ margin: '0 0 16px', fontSize: '1rem', color: '#1e3a8a', fontWeight: 700 }}>
                Campus Expense Category Distribution
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {Object.entries(dashboardData.charts?.categoryTotals || {}).map(([cat, amt]) => {
                  const total = dashboardData.summary?.totalSchoolExpenses || 89000;
                  const pct = total > 0 ? Math.round((amt / total) * 100) : 0;
                  return (
                    <div key={cat}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.84rem', marginBottom: '4px' }}>
                        <span style={{ color: '#1e293b', fontWeight: 600 }}>{cat}</span>
                        <span style={{ color: '#64748b', fontWeight: 700 }}>₹{amt.toLocaleString()} ({pct}%)</span>
                      </div>
                      <div style={{ height: '8px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{ width: `${pct}%`, background: '#6366f1', height: '100%', borderRadius: '4px' }}></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* 2. STUDENT BILLING (Select/Search Student -> Full Details Card + Separated Fee Columns) */}
      {/* =================================================================== */}
      {subTab === 'student-billing' && (
        <div>
          {/* Header & Controls */}
          <div style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            padding: '16px 20px',
            marginBottom: '20px',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '12px'
          }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.18rem', color: '#1e3a8a', fontWeight: 800 }}>
                Student Billing Management
              </h3>
              <div style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '2px' }}>
                Select or search any student to view full details card, itemized fee breakdown, and actions
              </div>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              <button
                className="btn btn-primary"
                onClick={() => handleOpenBillModal()}
                style={{ borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <span>➕</span> Create New Bill
              </button>

              <label
                className="btn btn-outline"
                style={{
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  cursor: 'pointer',
                  borderColor: '#10b981',
                  color: '#059669',
                  fontWeight: 700,
                  margin: 0
                }}
                title="Upload Excel File with Student Bills"
              >
                <span>📤</span> Bulk Excel Upload
                <input
                  type="file"
                  accept=".xlsx, .xls, .csv"
                  onChange={(e) => handleExcelFileSelect(e, 'student')}
                  style={{ display: 'none' }}
                />
              </label>

              <button
                className="btn btn-outline"
                onClick={() => {
                  const exportRows = filteredBills.map(b => ({
                    'Invoice No': b.invoiceNumber,
                    'Student Name': b.studentName,
                    'Roll No': b.rollNo || b.studentId,
                    'Class': `${b.grade}-${b.section}`,
                    'Billing Month': b.billingMonth,
                    'Monthly Fees': getFeeAmount(b, 'Monthly Fees'),
                    'Transport Fees': getFeeAmount(b, 'Transport Fees'),
                    'Co-curricular Fees': getFeeAmount(b, 'Co-curricular Fees'),
                    'Term Fees': getFeeAmount(b, 'Term Fees'),
                    'Total Fees': b.totalFees,
                    'Paid Amount': b.paidAmount,
                    'Pending Amount': b.pendingAmount,
                    'Status': b.paymentStatus,
                    'Due Date': b.dueDate
                  }));
                  exportToExcel(exportRows, 'Student_Billing_Register');
                }}
                style={{ borderRadius: '8px' }}
              >
                Export Excel
              </button>
            </div>
          </div>

          {/* Standardized Filter Option Bar matching screenshot: ACADEMIC YEAR | MONTH | CLASS | SECTION | Refresh + Search */}
          <div style={{
            background: '#ffffff',
            border: '1px solid #cbd5e1',
            borderRadius: '10px',
            padding: '14px 18px',
            marginBottom: '20px',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '14px',
            alignItems: 'flex-end',
            boxShadow: '0 1px 4px rgba(0,0,0,0.03)'
          }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, color: '#3b82f6', textTransform: 'uppercase', marginBottom: '4px', letterSpacing: '0.3px' }}>
                ACADEMIC YEAR
              </label>
              <select
                value={billYearFilter}
                onChange={(e) => setBillYearFilter(e.target.value)}
                style={{ padding: '7px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.88rem', fontWeight: 600, color: '#0f172a', background: '#ffffff', minWidth: '130px' }}
              >
                <option value="2026-2027">2026-2027</option>
                <option value="2025-2026">2025-2026</option>
                <option value="All">All Years</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, color: '#3b82f6', textTransform: 'uppercase', marginBottom: '4px', letterSpacing: '0.3px' }}>
                MONTH
              </label>
              <select
                value={billMonthFilter}
                onChange={(e) => setBillMonthFilter(e.target.value)}
                style={{ padding: '7px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.88rem', fontWeight: 600, color: '#0f172a', background: '#ffffff', minWidth: '130px' }}
              >
                <option value="All">All Months</option>
                <option value="October">October</option>
                <option value="November">November</option>
                <option value="September">September</option>
                <option value="August">August</option>
                <option value="July">July</option>
                <option value="June">June</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, color: '#3b82f6', textTransform: 'uppercase', marginBottom: '4px', letterSpacing: '0.3px' }}>
                CLASS
              </label>
              <select
                value={billClassFilter}
                onChange={(e) => setBillClassFilter(e.target.value)}
                style={{ padding: '7px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.88rem', fontWeight: 600, color: '#0f172a', background: '#ffffff', minWidth: '140px' }}
              >
                <option value="All">All Classes</option>
                <option value="Grade 10">Grade 10</option>
                <option value="Grade 9">Grade 9</option>
                <option value="Grade 11">Grade 11</option>
                <option value="Grade 12">Grade 12</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, color: '#3b82f6', textTransform: 'uppercase', marginBottom: '4px', letterSpacing: '0.3px' }}>
                SECTION
              </label>
              <select
                value={billSectionFilter}
                onChange={(e) => setBillSectionFilter(e.target.value)}
                style={{ padding: '7px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.88rem', fontWeight: 600, color: '#0f172a', background: '#ffffff', minWidth: '130px' }}
              >
                <option value="All">All Sections</option>
                <option value="A">Section A</option>
                <option value="B">Section B</option>
                <option value="C">Section C</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, color: '#3b82f6', textTransform: 'uppercase', marginBottom: '4px', letterSpacing: '0.3px' }}>
                STATUS
              </label>
              <select
                value={billStatusFilter}
                onChange={(e) => setBillStatusFilter(e.target.value)}
                style={{ padding: '7px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.88rem', fontWeight: 600, color: '#0f172a', background: '#ffffff', minWidth: '130px' }}
              >
                <option value="All">All Statuses</option>
                <option value="Paid">Paid</option>
                <option value="Partially Paid">Partially Paid</option>
                <option value="Unpaid">Unpaid</option>
                <option value="Overdue">Overdue</option>
              </select>
            </div>

            <div>
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => {
                  setBillSearch('');
                  setBillYearFilter('2026-2027');
                  setBillMonthFilter('All');
                  setBillClassFilter('All');
                  setBillSectionFilter('All');
                  setBillStatusFilter('All');
                  loadStudentBills();
                  showToast('Refreshed', 'Student billing list refreshed with latest records.');
                }}
                style={{
                  padding: '7px 16px',
                  borderRadius: '8px',
                  border: '2px solid #1e3a8a',
                  color: '#1e3a8a',
                  fontWeight: 800,
                  fontSize: '0.88rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: '#ffffff'
                }}
              >
                <span>🔄</span> Refresh
              </button>
            </div>

            <div style={{ flex: 1, minWidth: '220px', marginLeft: 'auto' }}>
              <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '4px' }}>
                SEARCH
              </label>
              <input
                type="text"
                placeholder="🔍 Student name, roll no, invoice #..."
                value={billSearch}
                onChange={(e) => {
                  setBillSearch(e.target.value);
                  const query = e.target.value.toLowerCase().trim();
                  if (query) {
                    const match = bills.find(b =>
                      (b.studentName || '').toLowerCase().includes(query) ||
                      (b.rollNo || '').toLowerCase().includes(query) ||
                      (b.studentId || '').toLowerCase().includes(query)
                    );
                    if (match) setSelectedStudentCard(match);
                  }
                }}
                style={{ width: '100%', padding: '7px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.88rem' }}
              />
            </div>
          </div>

          {/* ======================================================== */}
          {/* SPECIAL FULL DETAILS CARD FOR SELECTED STUDENT (As Requested) */}
          {/* ======================================================== */}
          {selectedStudentCard && (
            <div style={{
              background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
              border: '2px solid #3b82f6',
              borderRadius: '12px',
              padding: '20px 24px',
              marginBottom: '24px',
              boxShadow: '0 4px 16px rgba(59, 130, 246, 0.12)',
              position: 'relative'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '1.4rem' }}></span>
                    <div>
                      <h4 style={{ margin: 0, fontSize: '1.3rem', color: '#1e3a8a', fontWeight: 800 }}>
                        {selectedStudentCard.studentName}
                      </h4>
                      <div style={{ fontSize: '0.84rem', color: '#64748b', marginTop: '2px' }}>
                        Roll No: <strong>{selectedStudentCard.rollNo || selectedStudentCard.studentId}</strong> | Invoice No: <strong>{selectedStudentCard.invoiceNumber}</strong>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Status Badge & Due Date Banner */}
                <div style={{ textAlign: 'right' }}>
                  <span className={`badge ${selectedStudentCard.paymentStatus === 'Paid' ? 'badge-success' : selectedStudentCard.paymentStatus === 'Partially Paid' ? 'badge-warning' : 'badge-danger'}`}
                    style={{ fontSize: '0.85rem', padding: '6px 14px' }}>
                    {selectedStudentCard.paymentStatus}
                  </span>
                  <div style={{ fontSize: '0.8rem', color: '#ef4444', fontWeight: 700, marginTop: '4px' }}>
                    Due Date: {selectedStudentCard.dueDate}
                  </div>
                </div>
              </div>

              {/* Exact Fields Requested in Student Billing Details Grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
                gap: '12px',
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '10px',
                padding: '16px',
                marginBottom: '16px'
              }}>
                <div>
                  <div style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Grade / Class</div>
                  <div style={{ fontSize: '0.98rem', fontWeight: 700, color: '#0f172a', marginTop: '2px' }}>{selectedStudentCard.grade}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Section</div>
                  <div style={{ fontSize: '0.98rem', fontWeight: 700, color: '#0f172a', marginTop: '2px' }}>{selectedStudentCard.section || 'A'}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Billing Month</div>
                  <div style={{ fontSize: '0.98rem', fontWeight: 700, color: '#0f172a', marginTop: '2px' }}>{selectedStudentCard.billingMonth}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Monthly Fees</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                    <span style={{ fontSize: '1rem', fontWeight: 700, color: '#1e3a8a' }}>₹{getFeeAmount(selectedStudentCard, 'Monthly Fees').toLocaleString()}</span>
                    <span style={{ fontSize: '0.7rem', padding: '1px 6px', borderRadius: '4px', fontWeight: 700, background: getFeeStatus(selectedStudentCard, 'Monthly Fees') === 'Paid' ? '#dcfce7' : '#fee2e2', color: getFeeStatus(selectedStudentCard, 'Monthly Fees') === 'Paid' ? '#15803d' : '#b91c1c' }}>
                      {getFeeStatus(selectedStudentCard, 'Monthly Fees')}
                    </span>
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Transport Fees</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                    <span style={{ fontSize: '1rem', fontWeight: 700, color: '#1e3a8a' }}>₹{getFeeAmount(selectedStudentCard, 'Transport Fees').toLocaleString()}</span>
                    <span style={{ fontSize: '0.7rem', padding: '1px 6px', borderRadius: '4px', fontWeight: 700, background: getFeeStatus(selectedStudentCard, 'Transport Fees') === 'Paid' ? '#dcfce7' : '#fee2e2', color: getFeeStatus(selectedStudentCard, 'Transport Fees') === 'Paid' ? '#15803d' : '#b91c1c' }}>
                      {getFeeStatus(selectedStudentCard, 'Transport Fees')}
                    </span>
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Co-curricular Fees</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                    <span style={{ fontSize: '1rem', fontWeight: 700, color: '#1e3a8a' }}>₹{getFeeAmount(selectedStudentCard, 'Co-curricular Fees').toLocaleString()}</span>
                    <span style={{ fontSize: '0.7rem', padding: '1px 6px', borderRadius: '4px', fontWeight: 700, background: getFeeStatus(selectedStudentCard, 'Co-curricular Fees') === 'Paid' ? '#dcfce7' : '#fee2e2', color: getFeeStatus(selectedStudentCard, 'Co-curricular Fees') === 'Paid' ? '#15803d' : '#b91c1c' }}>
                      {getFeeStatus(selectedStudentCard, 'Co-curricular Fees')}
                    </span>
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Term Fees</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                    <span style={{ fontSize: '1rem', fontWeight: 700, color: '#1e3a8a' }}>₹{getFeeAmount(selectedStudentCard, 'Term Fees').toLocaleString()}</span>
                    <span style={{ fontSize: '0.7rem', padding: '1px 6px', borderRadius: '4px', fontWeight: 700, background: getFeeStatus(selectedStudentCard, 'Term Fees') === 'Paid' ? '#dcfce7' : '#fee2e2', color: getFeeStatus(selectedStudentCard, 'Term Fees') === 'Paid' ? '#15803d' : '#b91c1c' }}>
                      {getFeeStatus(selectedStudentCard, 'Term Fees')}
                    </span>
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Total Fees</div>
                  <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#1e3a8a', marginTop: '2px' }}>₹{Number(selectedStudentCard.totalFees).toLocaleString()}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.72rem', color: '#10b981', textTransform: 'uppercase', fontWeight: 700 }}>Paid Amount</div>
                  <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#10b981', marginTop: '2px' }}>₹{Number(selectedStudentCard.paidAmount).toLocaleString()}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.72rem', color: '#ef4444', textTransform: 'uppercase', fontWeight: 700 }}>Pending Amount</div>
                  <div style={{ fontSize: '1.15rem', fontWeight: 800, color: Number(selectedStudentCard.pendingAmount) > 0 ? '#ef4444' : '#10b981', marginTop: '2px' }}>
                    ₹{Number(selectedStudentCard.pendingAmount).toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Action Buttons: View, Edit, Download Bill, Record Payment */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', flexWrap: 'wrap', gap: '10px' }}>
                {selectedStudentCard.pendingAmount > 0 && (
                  <button
                    className="btn btn-primary"
                    onClick={() => handleOpenPayModal(selectedStudentCard, 'Student')}
                    style={{ borderRadius: '6px', fontSize: '0.85rem' }}
                  >
                    Record Payment
                  </button>
                )}
                <button
                  className="btn btn-outline"
                  onClick={() => setSelectedBillForView(selectedStudentCard)}
                  style={{ borderRadius: '6px', fontSize: '0.85rem' }}
                >
                  👁️ View Full Invoice
                </button>
                <button
                  className="btn btn-outline"
                  onClick={() => handleOpenBillModal(selectedStudentCard)}
                  style={{ borderRadius: '6px', fontSize: '0.85rem' }}
                >
                  ✏️ Edit Bill
                </button>
                <button
                  className="btn btn-outline"
                  onClick={() => downloadStudentBillPDF(selectedStudentCard)}
                  style={{ borderRadius: '6px', fontSize: '0.85rem' }}
                >
                  Download Bill PDF
                </button>
                <button
                  className="btn btn-outline"
                  onClick={() => handleDeleteBill(selectedStudentCard)}
                  style={{ borderRadius: '6px', fontSize: '0.85rem', color: '#ef4444' }}
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* HORIZONTALLY SCROLLABLE STUDENT BILLING SHEET (Left to Right Movement) */}
          {/* Separated Fee Columns as Requested */}
          {/* ======================================================== */}
          <div style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
          }}>
            <div style={{ padding: '12px 16px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: '0.84rem', fontWeight: 700, color: '#1e3a8a' }}>
                📋 Student Fee Register (Scroll ⇄ Left to Right to view all columns)
              </div>
              <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                Showing {filteredBills.length} student records
              </div>
            </div>

            <div style={{ overflowX: 'auto', width: '100%', WebkitOverflowScrolling: 'touch' }}>
              <table className="sa-schools-table" style={{ width: '100%', minWidth: '1350px', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#f1f5f9', borderBottom: '2px solid #cbd5e1' }}>
                    <th style={{ padding: '12px 14px', textAlign: 'left', fontSize: '0.76rem', color: '#475569', position: 'sticky', left: 0, background: '#f1f5f9', zIndex: 2 }}>STUDENT NAME</th>
                    <th style={{ padding: '12px 14px', textAlign: 'left', fontSize: '0.76rem', color: '#475569' }}>GRADE / CLASS</th>
                    <th style={{ padding: '12px 14px', textAlign: 'left', fontSize: '0.76rem', color: '#475569' }}>SECTION</th>
                    <th style={{ padding: '12px 14px', textAlign: 'left', fontSize: '0.76rem', color: '#475569' }}>MONTH</th>
                    <th style={{ padding: '12px 14px', textAlign: 'right', fontSize: '0.76rem', color: '#1e3a8a' }}>MONTHLY FEES</th>
                    <th style={{ padding: '12px 14px', textAlign: 'right', fontSize: '0.76rem', color: '#1e3a8a' }}>TRANSPORT FEES</th>
                    <th style={{ padding: '12px 14px', textAlign: 'right', fontSize: '0.76rem', color: '#1e3a8a' }}>CO-CURRICULAR</th>
                    <th style={{ padding: '12px 14px', textAlign: 'right', fontSize: '0.76rem', color: '#1e3a8a' }}>TERM FEES</th>
                    <th style={{ padding: '12px 14px', textAlign: 'right', fontSize: '0.76rem', color: '#0f172a' }}>TOTAL FEES</th>
                    <th style={{ padding: '12px 14px', textAlign: 'right', fontSize: '0.76rem', color: '#10b981' }}>PAID AMOUNT</th>
                    <th style={{ padding: '12px 14px', textAlign: 'right', fontSize: '0.76rem', color: '#ef4444' }}>PENDING AMOUNT</th>
                    <th style={{ padding: '12px 14px', textAlign: 'center', fontSize: '0.76rem', color: '#475569' }}>STATUS</th>
                    <th style={{ padding: '12px 14px', textAlign: 'left', fontSize: '0.76rem', color: '#475569' }}>DUE DATE</th>
                    <th style={{ padding: '12px 14px', textAlign: 'center', fontSize: '0.76rem', color: '#475569', position: 'sticky', right: 0, background: '#f1f5f9', zIndex: 2 }}>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBills.length === 0 ? (
                    <tr>
                      <td colSpan="14" style={{ textAlign: 'center', padding: '36px', color: '#94a3b8' }}>
                        No student fee records found matching your filters.
                      </td>
                    </tr>
                  ) : (
                    filteredBills.map((b) => {
                      const isSelected = selectedStudentCard && (selectedStudentCard._id === b._id || selectedStudentCard.invoiceNumber === b.invoiceNumber);
                      const statusClass = b.paymentStatus === 'Paid'
                        ? 'badge-success'
                        : b.paymentStatus === 'Partially Paid'
                        ? 'badge-warning'
                        : 'badge-danger';

                      return (
                        <tr
                          key={b._id || b.invoiceNumber}
                          onClick={() => setSelectedStudentCard(b)}
                          style={{
                            borderBottom: '1px solid #f1f5f9',
                            cursor: 'pointer',
                            background: isSelected ? '#eff6ff' : 'transparent',
                            transition: 'background 0.15s ease'
                          }}
                        >
                          <td style={{ padding: '12px 14px', position: 'sticky', left: 0, background: isSelected ? '#eff6ff' : '#ffffff', zIndex: 1 }}>
                            <div style={{ fontWeight: 800, color: '#1e3a8a', fontSize: '0.88rem' }}>{b.studentName}</div>
                            <div style={{ fontSize: '0.74rem', color: '#64748b' }}>Roll: {b.rollNo || b.studentId} • Inv: {b.invoiceNumber}</div>
                          </td>
                          <td style={{ padding: '12px 14px', fontSize: '0.84rem', color: '#334155' }}>
                            {b.grade}
                          </td>
                          <td style={{ padding: '12px 14px', fontSize: '0.84rem', color: '#334155' }}>
                            {b.section || 'A'}
                          </td>
                          <td style={{ padding: '12px 14px', fontSize: '0.84rem', fontWeight: 600, color: '#0f172a' }}>
                            {b.billingMonth}
                          </td>
                          <td style={{ padding: '12px 14px', textAlign: 'right' }}>
                            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1e3a8a' }}>
                              ₹{getFeeAmount(b, 'Monthly Fees').toLocaleString()}
                            </div>
                            <span style={{
                              fontSize: '0.68rem',
                              padding: '2px 6px',
                              borderRadius: '4px',
                              fontWeight: 700,
                              background: getFeeStatus(b, 'Monthly Fees') === 'Paid' ? '#dcfce7' : '#fee2e2',
                              color: getFeeStatus(b, 'Monthly Fees') === 'Paid' ? '#15803d' : '#b91c1c',
                              display: 'inline-block',
                              marginTop: '2px'
                            }}>
                              {getFeeStatus(b, 'Monthly Fees')}
                            </span>
                          </td>
                          <td style={{ padding: '12px 14px', textAlign: 'right' }}>
                            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1e3a8a' }}>
                              ₹{getFeeAmount(b, 'Transport Fees').toLocaleString()}
                            </div>
                            <span style={{
                              fontSize: '0.68rem',
                              padding: '2px 6px',
                              borderRadius: '4px',
                              fontWeight: 700,
                              background: getFeeStatus(b, 'Transport Fees') === 'Paid' ? '#dcfce7' : '#fee2e2',
                              color: getFeeStatus(b, 'Transport Fees') === 'Paid' ? '#15803d' : '#b91c1c',
                              display: 'inline-block',
                              marginTop: '2px'
                            }}>
                              {getFeeStatus(b, 'Transport Fees')}
                            </span>
                          </td>
                          <td style={{ padding: '12px 14px', textAlign: 'right' }}>
                            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1e3a8a' }}>
                              ₹{getFeeAmount(b, 'Co-curricular Fees').toLocaleString()}
                            </div>
                            <span style={{
                              fontSize: '0.68rem',
                              padding: '2px 6px',
                              borderRadius: '4px',
                              fontWeight: 700,
                              background: getFeeStatus(b, 'Co-curricular Fees') === 'Paid' ? '#dcfce7' : '#fee2e2',
                              color: getFeeStatus(b, 'Co-curricular Fees') === 'Paid' ? '#15803d' : '#b91c1c',
                              display: 'inline-block',
                              marginTop: '2px'
                            }}>
                              {getFeeStatus(b, 'Co-curricular Fees')}
                            </span>
                          </td>
                          <td style={{ padding: '12px 14px', textAlign: 'right' }}>
                            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1e3a8a' }}>
                              ₹{getFeeAmount(b, 'Term Fees').toLocaleString()}
                            </div>
                            <span style={{
                              fontSize: '0.68rem',
                              padding: '2px 6px',
                              borderRadius: '4px',
                              fontWeight: 700,
                              background: getFeeStatus(b, 'Term Fees') === 'Paid' ? '#dcfce7' : '#fee2e2',
                              color: getFeeStatus(b, 'Term Fees') === 'Paid' ? '#15803d' : '#b91c1c',
                              display: 'inline-block',
                              marginTop: '2px'
                            }}>
                              {getFeeStatus(b, 'Term Fees')}
                            </span>
                          </td>
                          <td style={{ padding: '12px 14px', textAlign: 'right', fontWeight: 800, color: '#0f172a', fontSize: '0.9rem' }}>
                            ₹{Number(b.totalFees).toLocaleString()}
                          </td>
                          <td style={{ padding: '12px 14px', textAlign: 'right', fontWeight: 700, color: '#10b981', fontSize: '0.88rem' }}>
                            ₹{Number(b.paidAmount).toLocaleString()}
                          </td>
                          <td style={{ padding: '12px 14px', textAlign: 'right', fontWeight: 800, color: b.pendingAmount > 0 ? '#ef4444' : '#10b981', fontSize: '0.88rem' }}>
                            ₹{Number(b.pendingAmount).toLocaleString()}
                          </td>
                          <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                            <span className={`badge ${statusClass}`} style={{ fontSize: '0.74rem' }}>
                              {b.paymentStatus}
                            </span>
                          </td>
                          <td style={{ padding: '12px 14px', fontSize: '0.82rem', color: '#64748b', whiteSpace: 'nowrap' }}>
                            {b.dueDate}
                          </td>
                          <td style={{ padding: '12px 14px', textAlign: 'center', position: 'sticky', right: 0, background: isSelected ? '#eff6ff' : '#ffffff', zIndex: 1 }}>
                            <div style={{ display: 'inline-flex', gap: '6px' }} onClick={(e) => e.stopPropagation()}>
                              <button
                                className="btn btn-sm btn-outline"
                                onClick={() => setSelectedBillForView(b)}
                                style={{ padding: '4px 8px', fontSize: '0.75rem', borderRadius: '4px' }}
                                title="View Bill"
                              >
                                👁️ View
                              </button>
                              <button
                                className="btn btn-sm btn-outline"
                                onClick={() => handleOpenBillModal(b)}
                                style={{ padding: '4px 8px', fontSize: '0.75rem', borderRadius: '4px' }}
                                title="Edit Bill"
                              >
                                ✏️ Edit
                              </button>
                              <button
                                className="btn btn-sm btn-outline"
                                onClick={() => downloadStudentBillPDF(b)}
                                style={{ padding: '4px 8px', fontSize: '0.75rem', borderRadius: '4px' }}
                                title="Download Bill"
                              >
                                Download
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
        </div>
      )}

      {/* =================================================================== */}
      {/* 3. STAFF SALARY MANAGEMENT (Teaching & Non-Teaching: Drivers, Cleaning, Wardens + Paid / Non-Paid) */}
      {/* =================================================================== */}
      {subTab === 'staff-salary' && (
        <div>
          {/* Header & Controls */}
          <div style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            padding: '16px 20px',
            marginBottom: '20px',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '12px'
          }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.18rem', color: '#1e3a8a', fontWeight: 800 }}>
                Staff Salary Management (Teaching & Non-Teaching)
              </h3>
              <div style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '2px' }}>
                Separated tabs for Teaching Faculty and Non-Teaching Staff (Transport Drivers, Cleaning Workers, Hostel Wardens)
              </div>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              <button
                className="btn btn-primary"
                onClick={() => handleOpenSalaryModal(null, staffCategoryTab === 'Non-Teaching' ? 'Non-Teaching' : 'Teaching')}
                style={{ borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <span>➕</span> Generate Salary Slip
              </button>

              <label
                className="btn btn-outline"
                style={{
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  cursor: 'pointer',
                  borderColor: '#10b981',
                  color: '#059669',
                  fontWeight: 700,
                  margin: 0
                }}
                title="Upload Excel File with Staff Salaries"
              >
                <span>📤</span> Bulk Excel Upload
                <input
                  type="file"
                  accept=".xlsx, .xls, .csv"
                  onChange={(e) => handleExcelFileSelect(e, 'salary')}
                  style={{ display: 'none' }}
                />
              </label>

              <button
                className="btn btn-outline"
                onClick={() => {
                  const exportRows = filteredSalaries.map(s => ({
                    'Slip No': s.salarySlipNo,
                    'Staff Name': s.staffName,
                    'Staff ID': s.staffId,
                    'Staff Category': s.staffType || 'Teaching',
                    'Designation': s.designation,
                    'Department': s.department,
                    'Month': `${s.salaryMonth} ${s.salaryYear}`,
                    'Gross Salary': s.grossSalary,
                    'Total Deductions': s.totalDeductions,
                    'Net Salary': s.netSalary,
                    'Paid Amount': s.paidAmount,
                    'Pending Amount': s.pendingAmount,
                    'Payment Status': s.paymentStatus
                  }));
                  exportToExcel(exportRows, 'Staff_Salary_Register');
                }}
                style={{ borderRadius: '8px' }}
              >
                Export Excel
              </button>
            </div>
          </div>

          {/* Category Switcher Tabs: All Staff / Teaching Faculty / Non-Teaching Staff */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '8px',
            marginBottom: '16px'
          }}>
            <button
              onClick={() => { setStaffCategoryTab('ALL'); setStaffRoleFilter('ALL'); }}
              style={{
                padding: '10px 18px',
                borderRadius: '8px',
                border: 'none',
                background: staffCategoryTab === 'ALL' ? '#1e3a8a' : '#f1f5f9',
                color: staffCategoryTab === 'ALL' ? '#ffffff' : '#334155',
                fontWeight: 700,
                fontSize: '0.88rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <span>👥</span> All Staff Members ({salaries.length})
            </button>

            <button
              onClick={() => { setStaffCategoryTab('Teaching'); setStaffRoleFilter('ALL'); }}
              style={{
                padding: '10px 18px',
                borderRadius: '8px',
                border: 'none',
                background: staffCategoryTab === 'Teaching' ? '#2563eb' : '#f1f5f9',
                color: staffCategoryTab === 'Teaching' ? '#ffffff' : '#334155',
                fontWeight: 700,
                fontSize: '0.88rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <span>👩‍🏫</span> Teaching Faculty ({salaries.filter(s => s.staffType !== 'Non-Teaching' && !['Transport Driver', 'Cleaning Worker', 'Hostel Warden'].includes(s.designation)).length})
            </button>

            <button
              onClick={() => { setStaffCategoryTab('Non-Teaching'); setStaffRoleFilter('ALL'); }}
              style={{
                padding: '10px 18px',
                borderRadius: '8px',
                border: 'none',
                background: staffCategoryTab === 'Non-Teaching' ? '#0d9488' : '#f1f5f9',
                color: staffCategoryTab === 'Non-Teaching' ? '#ffffff' : '#334155',
                fontWeight: 700,
                fontSize: '0.88rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <span>🛠️</span> Non-Teaching Staff ({salaries.filter(s => s.staffType === 'Non-Teaching' || ['Transport Driver', 'Cleaning Worker', 'Hostel Warden'].includes(s.designation)).length})
            </button>
          </div>

          {/* Non-Teaching Sub-Role Filter Quick Buttons (Transport Drivers, Cleaning Workers, Hostel Wardens) */}
          {staffCategoryTab === 'Non-Teaching' && (
            <div style={{
              background: '#f0fdfa',
              border: '1px solid #ccfbf1',
              borderRadius: '8px',
              padding: '10px 14px',
              marginBottom: '16px',
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              gap: '10px'
            }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0f766e' }}>Non-Teaching Department:</span>

              {[
                { id: 'ALL', label: 'All Non-Teaching' },
                { id: 'Driver', label: '🚌 Transport Drivers' },
                { id: 'Cleaning', label: '🧹 Cleaning Workers' },
                { id: 'Hostel', label: '🏢 Hostel Wardens' }
              ].map(sub => (
                <button
                  key={sub.id}
                  onClick={() => setStaffRoleFilter(sub.id)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '6px',
                    border: '1px solid #99f6e4',
                    background: staffRoleFilter === sub.id ? '#0d9488' : '#ffffff',
                    color: staffRoleFilter === sub.id ? '#ffffff' : '#134e4a',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  {sub.label}
                </button>
              ))}
            </div>
          )}

          {/* Standardized Filter Option Bar for Staff Salary matching screenshot: ACADEMIC YEAR | MONTH | DEPARTMENT | STATUS | Refresh + Search */}
          <div style={{
            background: '#ffffff',
            border: '1px solid #cbd5e1',
            borderRadius: '10px',
            padding: '14px 18px',
            marginBottom: '16px',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '14px',
            alignItems: 'flex-end',
            boxShadow: '0 1px 4px rgba(0,0,0,0.03)'
          }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, color: '#3b82f6', textTransform: 'uppercase', marginBottom: '4px', letterSpacing: '0.3px' }}>
                ACADEMIC YEAR
              </label>
              <select
                value={salaryYearFilter}
                onChange={(e) => setSalaryYearFilter(e.target.value)}
                style={{ padding: '7px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.88rem', fontWeight: 600, color: '#0f172a', background: '#ffffff', minWidth: '130px' }}
              >
                <option value="2026">2026</option>
                <option value="2025">2025</option>
                <option value="All">All Years</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, color: '#3b82f6', textTransform: 'uppercase', marginBottom: '4px', letterSpacing: '0.3px' }}>
                MONTH
              </label>
              <select
                value={salaryMonthFilter}
                onChange={(e) => setSalaryMonthFilter(e.target.value)}
                style={{ padding: '7px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.88rem', fontWeight: 600, color: '#0f172a', background: '#ffffff', minWidth: '130px' }}
              >
                <option value="All">All Months</option>
                <option value="October">October</option>
                <option value="November">November</option>
                <option value="September">September</option>
                <option value="August">August</option>
                <option value="July">July</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, color: '#3b82f6', textTransform: 'uppercase', marginBottom: '4px', letterSpacing: '0.3px' }}>
                DEPARTMENT
              </label>
              <select
                value={salaryDepartmentFilter}
                onChange={(e) => setSalaryDepartmentFilter(e.target.value)}
                style={{ padding: '7px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.88rem', fontWeight: 600, color: '#0f172a', background: '#ffffff', minWidth: '140px' }}
              >
                <option value="All">All Departments</option>
                <option value="Mathematics">Mathematics</option>
                <option value="Science">Science</option>
                <option value="Languages">Languages</option>
                <option value="Transport">Transport</option>
                <option value="Housekeeping">Housekeeping</option>
                <option value="Hostel">Hostel</option>
              </select>
            </div>

            {/* PAID or NON-PAID BUTTONS */}
            <div>
              <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, color: '#3b82f6', textTransform: 'uppercase', marginBottom: '4px', letterSpacing: '0.3px' }}>
                SALARY STATUS
              </label>
              <div style={{ display: 'flex', gap: '6px' }}>
                <button
                  onClick={() => setSalaryPayStatusFilter('ALL')}
                  style={{
                    padding: '7px 12px',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    background: salaryPayStatusFilter === 'ALL' ? '#334155' : '#ffffff',
                    color: salaryPayStatusFilter === 'ALL' ? '#ffffff' : '#475569',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  All
                </button>

                <button
                  onClick={() => setSalaryPayStatusFilter('PAID')}
                  style={{
                    padding: '7px 12px',
                    borderRadius: '6px',
                    border: '1px solid #86efac',
                    background: salaryPayStatusFilter === 'PAID' ? '#10b981' : '#ffffff',
                    color: salaryPayStatusFilter === 'PAID' ? '#ffffff' : '#166534',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  ✅ Paid
                </button>

                <button
                  onClick={() => setSalaryPayStatusFilter('NON-PAID')}
                  style={{
                    padding: '7px 12px',
                    borderRadius: '6px',
                    border: '1px solid #fecaca',
                    background: salaryPayStatusFilter === 'NON-PAID' ? '#ef4444' : '#ffffff',
                    color: salaryPayStatusFilter === 'NON-PAID' ? '#ffffff' : '#991b1b',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  ⏳ Pending
                </button>
              </div>
            </div>

            <div>
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => {
                  setSalarySearch('');
                  setSalaryYearFilter('2026');
                  setSalaryMonthFilter('All');
                  setSalaryDepartmentFilter('All');
                  setSalaryPayStatusFilter('ALL');
                  setStaffCategoryTab('ALL');
                  setStaffRoleFilter('ALL');
                  loadStaffSalaries();
                  showToast('Refreshed', 'Staff salary list refreshed with latest records.');
                }}
                style={{
                  padding: '7px 16px',
                  borderRadius: '8px',
                  border: '2px solid #1e3a8a',
                  color: '#1e3a8a',
                  fontWeight: 800,
                  fontSize: '0.88rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: '#ffffff'
                }}
              >
                <span>🔄</span> Refresh
              </button>
            </div>

            <div style={{ flex: 1, minWidth: '220px', marginLeft: 'auto' }}>
              <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '4px' }}>
                SEARCH
              </label>
              <input
                type="text"
                placeholder="🔍 Staff name, ID, designation..."
                value={salarySearch}
                onChange={(e) => setSalarySearch(e.target.value)}
                style={{ width: '100%', padding: '7px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.88rem' }}
              />
            </div>
          </div>

          {/* ======================================================== */}
          {/* HORIZONTALLY SCROLLABLE STAFF SALARY SHEET (Left to Right Movement) */}
          {/* ======================================================== */}
          <div style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
          }}>
            <div style={{ padding: '12px 16px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: '0.84rem', fontWeight: 700, color: '#1e3a8a' }}>
                Staff Payroll Register (Scroll ⇄ Left to Right to view all fields)
              </div>
              <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                Showing {filteredSalaries.length} staff records
              </div>
            </div>

            <div style={{ overflowX: 'auto', width: '100%', WebkitOverflowScrolling: 'touch' }}>
              <table className="sa-schools-table" style={{ width: '100%', minWidth: '1300px', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#f1f5f9', borderBottom: '2px solid #cbd5e1' }}>
                    <th style={{ padding: '12px 14px', textAlign: 'left', fontSize: '0.76rem', color: '#475569', position: 'sticky', left: 0, background: '#f1f5f9', zIndex: 2 }}>STAFF NAME</th>
                    <th style={{ padding: '12px 14px', textAlign: 'left', fontSize: '0.76rem', color: '#475569' }}>CATEGORY</th>
                    <th style={{ padding: '12px 14px', textAlign: 'left', fontSize: '0.76rem', color: '#475569' }}>DESIGNATION</th>
                    <th style={{ padding: '12px 14px', textAlign: 'left', fontSize: '0.76rem', color: '#475569' }}>DEPARTMENT</th>
                    <th style={{ padding: '12px 14px', textAlign: 'left', fontSize: '0.76rem', color: '#475569' }}>MONTH</th>
                    <th style={{ padding: '12px 14px', textAlign: 'right', fontSize: '0.76rem', color: '#475569' }}>BASIC</th>
                    <th style={{ padding: '12px 14px', textAlign: 'right', fontSize: '0.76rem', color: '#475569' }}>HRA</th>
                    <th style={{ padding: '12px 14px', textAlign: 'right', fontSize: '0.76rem', color: '#475569' }}>ALLOWANCES</th>
                    <th style={{ padding: '12px 14px', textAlign: 'right', fontSize: '0.76rem', color: '#475569' }}>GROSS</th>
                    <th style={{ padding: '12px 14px', textAlign: 'right', fontSize: '0.76rem', color: '#dc2626' }}>DEDUCTIONS</th>
                    <th style={{ padding: '12px 14px', textAlign: 'right', fontSize: '0.76rem', color: '#15803d' }}>NET SALARY</th>
                    <th style={{ padding: '12px 14px', textAlign: 'right', fontSize: '0.76rem', color: '#10b981' }}>PAID</th>
                    <th style={{ padding: '12px 14px', textAlign: 'right', fontSize: '0.76rem', color: '#ef4444' }}>PENDING</th>
                    <th style={{ padding: '12px 14px', textAlign: 'center', fontSize: '0.76rem', color: '#475569' }}>STATUS</th>
                    <th style={{ padding: '12px 14px', textAlign: 'center', fontSize: '0.76rem', color: '#475569', position: 'sticky', right: 0, background: '#f1f5f9', zIndex: 2 }}>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSalaries.length === 0 ? (
                    <tr>
                      <td colSpan="15" style={{ textAlign: 'center', padding: '36px', color: '#94a3b8' }}>
                        No staff salary records found matching filters.
                      </td>
                    </tr>
                  ) : (
                    filteredSalaries.map((s) => {
                      const isNT = s.staffType === 'Non-Teaching' || ['Transport Driver', 'Cleaning Worker', 'Hostel Warden'].includes(s.designation);
                      const statusClass = s.paymentStatus === 'Paid'
                        ? 'badge-success'
                        : s.paymentStatus === 'Partially Paid'
                        ? 'badge-warning'
                        : 'badge-danger';

                      return (
                        <tr key={s._id || s.salarySlipNo} style={{ borderBottom: '1px solid #f1f5f9' }}>
                          <td style={{ padding: '12px 14px', position: 'sticky', left: 0, background: '#ffffff', zIndex: 1 }}>
                            <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.88rem' }}>{s.staffName}</div>
                            <div style={{ fontSize: '0.74rem', color: '#64748b' }}>ID: {s.staffId} • Slip: {s.salarySlipNo}</div>
                          </td>
                          <td style={{ padding: '12px 14px' }}>
                            <span style={{
                              padding: '3px 8px',
                              borderRadius: '4px',
                              fontSize: '0.72rem',
                              fontWeight: 700,
                              background: isNT ? '#ccfbf1' : '#dbeafe',
                              color: isNT ? '#0f766e' : '#1e40af'
                            }}>
                              {isNT ? 'Non-Teaching' : 'Teaching'}
                            </span>
                          </td>
                          <td style={{ padding: '12px 14px', fontSize: '0.84rem', fontWeight: 600, color: '#1e293b' }}>
                            {s.designation}
                          </td>
                          <td style={{ padding: '12px 14px', fontSize: '0.82rem', color: '#475569' }}>
                            {s.department}
                          </td>
                          <td style={{ padding: '12px 14px', fontSize: '0.84rem', fontWeight: 600 }}>
                            {s.salaryMonth} {s.salaryYear}
                          </td>
                          <td style={{ padding: '12px 14px', textAlign: 'right', fontSize: '0.84rem' }}>
                            ₹{Number(s.basicSalary || 0).toLocaleString()}
                          </td>
                          <td style={{ padding: '12px 14px', textAlign: 'right', fontSize: '0.84rem' }}>
                            ₹{Number(s.hra || 0).toLocaleString()}
                          </td>
                          <td style={{ padding: '12px 14px', textAlign: 'right', fontSize: '0.84rem' }}>
                            ₹{Number(s.allowances || 0).toLocaleString()}
                          </td>
                          <td style={{ padding: '12px 14px', textAlign: 'right', fontSize: '0.85rem', fontWeight: 600, color: '#334155' }}>
                            ₹{Number(s.grossSalary).toLocaleString()}
                          </td>
                          <td style={{ padding: '12px 14px', textAlign: 'right', fontSize: '0.85rem', color: '#dc2626' }}>
                            -₹{Number(s.totalDeductions).toLocaleString()}
                          </td>
                          <td style={{ padding: '12px 14px', textAlign: 'right', fontWeight: 800, color: '#15803d', fontSize: '0.9rem' }}>
                            ₹{Number(s.netSalary).toLocaleString()}
                          </td>
                          <td style={{ padding: '12px 14px', textAlign: 'right', fontWeight: 700, color: '#10b981', fontSize: '0.86rem' }}>
                            ₹{Number(s.paidAmount).toLocaleString()}
                          </td>
                          <td style={{ padding: '12px 14px', textAlign: 'right', fontWeight: 700, color: s.pendingAmount > 0 ? '#ef4444' : '#64748b', fontSize: '0.86rem' }}>
                            ₹{Number(s.pendingAmount).toLocaleString()}
                          </td>
                          <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                            <span className={`badge ${statusClass}`} style={{ fontSize: '0.74rem' }}>
                              {s.paymentStatus}
                            </span>
                          </td>
                          <td style={{ padding: '12px 14px', textAlign: 'center', position: 'sticky', right: 0, background: '#ffffff', zIndex: 1 }}>
                            <div style={{ display: 'inline-flex', gap: '6px' }}>
                              {s.pendingAmount > 0 && (
                                <button
                                  className="btn btn-sm btn-primary"
                                  onClick={() => handleOpenPayModal(s, 'Salary')}
                                  style={{ padding: '4px 8px', fontSize: '0.75rem', borderRadius: '4px' }}
                                  title="Disburse salary payment"
                                >
                                  Pay
                                </button>
                              )}
                              <button
                                className="btn btn-sm btn-outline"
                                onClick={() => downloadSalarySlipPDF(s)}
                                style={{ padding: '4px 8px', fontSize: '0.75rem', borderRadius: '4px' }}
                                title="Download Payslip PDF"
                              >
                                Slip
                              </button>
                              <button
                                className="btn btn-sm btn-outline"
                                onClick={() => setSelectedSalaryForView(s)}
                                style={{ padding: '4px 8px', fontSize: '0.75rem', borderRadius: '4px' }}
                                title="View Details"
                              >
                                👁️
                              </button>
                              <button
                                className="btn btn-sm btn-outline"
                                onClick={() => handleOpenSalaryModal(s)}
                                style={{ padding: '4px 8px', fontSize: '0.75rem', borderRadius: '4px' }}
                                title="Edit Salary Breakdown"
                              >
                                ✏️
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
        </div>
      )}

      {/* =================================================================== */}
      {/* 4. SCHOOL EXPENSES MANAGEMENT */}
      {/* =================================================================== */}
      {subTab === 'school-expenses' && (
        <div>
          <div style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            padding: '16px 20px',
            marginBottom: '20px',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '12px'
          }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.18rem', color: '#1e3a8a', fontWeight: 800 }}>
                Campus Expenses & Vendor Bills
              </h3>
              <div style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '2px' }}>
                Track electricity, maintenance, transport fuel, stationery, and institutional vendor payables
              </div>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              <button
                className="btn btn-primary"
                onClick={() => handleOpenExpenseModal()}
                style={{ borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <span>➕</span> Add New Expense
              </button>

              <button
                className="btn btn-outline"
                onClick={() => {
                  const exportRows = filteredExpenses.map(e => ({
                    'Expense ID': e.expenseId,
                    'Category': e.expenseCategory,
                    'Expense Name': e.expenseName,
                    'Vendor Name': e.vendorName,
                    'Invoice No': e.invoiceNumber,
                    'Expense Date': e.expenseDate,
                    'Amount': e.amount,
                    'Paid Amount': e.paidAmount,
                    'Pending Amount': e.pendingAmount,
                    'Payment Status': e.paymentStatus
                  }));
                  exportToExcel(exportRows, 'School_Expenses_Register');
                }}
                style={{ borderRadius: '8px' }}
              >
                Export Excel
              </button>
            </div>
          </div>

          {/* Filters Bar */}
          <div style={{
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            padding: '12px 16px',
            marginBottom: '16px',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '12px',
            alignItems: 'center'
          }}>
            <div style={{ flex: 1, minWidth: '220px' }}>
              <input
                type="text"
                placeholder="Search by expense, vendor name, or invoice..."
                value={expenseSearch}
                onChange={(e) => setExpenseSearch(e.target.value)}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.86rem' }}
              />
            </div>

            <div>
              <select
                value={expenseCatFilter}
                onChange={(e) => setExpenseCatFilter(e.target.value)}
                style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.86rem' }}
              >
                <option value="All">All Categories</option>
                {expenseCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>

            <div>
              <select
                value={expenseStatusFilter}
                onChange={(e) => setExpenseStatusFilter(e.target.value)}
                style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.86rem' }}
              >
                <option value="All">All Statuses</option>
                <option value="Paid">Paid</option>
                <option value="Partially Paid">Partially Paid</option>
                <option value="Pending">Pending</option>
              </select>
            </div>
          </div>

          {/* Expenses Table with Scroll */}
          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden' }}>
            <div style={{ overflowX: 'auto', width: '100%' }}>
              <table className="sa-schools-table" style={{ width: '100%', minWidth: '950px', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                    <th style={{ padding: '12px 14px', textAlign: 'left', fontSize: '0.75rem', color: '#64748b' }}>EXPENSE ID</th>
                    <th style={{ padding: '12px 14px', textAlign: 'left', fontSize: '0.75rem', color: '#64748b' }}>CATEGORY</th>
                    <th style={{ padding: '12px 14px', textAlign: 'left', fontSize: '0.75rem', color: '#64748b' }}>EXPENSE NAME & VENDOR</th>
                    <th style={{ padding: '12px 14px', textAlign: 'left', fontSize: '0.75rem', color: '#64748b' }}>DATE</th>
                    <th style={{ padding: '12px 14px', textAlign: 'right', fontSize: '0.75rem', color: '#64748b' }}>AMOUNT</th>
                    <th style={{ padding: '12px 14px', textAlign: 'right', fontSize: '0.75rem', color: '#64748b' }}>PAID</th>
                    <th style={{ padding: '12px 14px', textAlign: 'right', fontSize: '0.75rem', color: '#64748b' }}>PENDING</th>
                    <th style={{ padding: '12px 14px', textAlign: 'center', fontSize: '0.75rem', color: '#64748b' }}>STATUS</th>
                    <th style={{ padding: '12px 14px', textAlign: 'right', fontSize: '0.75rem', color: '#64748b' }}>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredExpenses.length === 0 ? (
                    <tr>
                      <td colSpan="9" style={{ textAlign: 'center', padding: '36px', color: '#94a3b8' }}>
                        No expenses found matching the selected filters.
                      </td>
                    </tr>
                  ) : (
                    filteredExpenses.map((e) => {
                      const statusClass = e.paymentStatus === 'Paid'
                        ? 'badge-success'
                        : e.paymentStatus === 'Partially Paid'
                        ? 'badge-warning'
                        : 'badge-danger';

                      return (
                        <tr key={e._id || e.expenseId} style={{ borderBottom: '1px solid #f1f5f9' }}>
                          <td style={{ padding: '12px 14px', fontWeight: 700, color: '#1e3a8a', fontSize: '0.85rem' }}>
                            {e.expenseId}
                          </td>
                          <td style={{ padding: '12px 14px', fontSize: '0.82rem', color: '#6366f1', fontWeight: 600 }}>
                            {e.expenseCategory}
                          </td>
                          <td style={{ padding: '12px 14px' }}>
                            <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.88rem' }}>{e.expenseName}</div>
                            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Vendor: {e.vendorName} • Inv: {e.invoiceNumber}</div>
                          </td>
                          <td style={{ padding: '12px 14px', fontSize: '0.84rem', color: '#475569' }}>
                            {e.expenseDate}
                          </td>
                          <td style={{ padding: '12px 14px', textAlign: 'right', fontWeight: 700, color: '#0f172a', fontSize: '0.88rem' }}>
                            ₹{Number(e.amount).toLocaleString()}
                          </td>
                          <td style={{ padding: '12px 14px', textAlign: 'right', fontWeight: 700, color: '#10b981', fontSize: '0.88rem' }}>
                            ₹{Number(e.paidAmount).toLocaleString()}
                          </td>
                          <td style={{ padding: '12px 14px', textAlign: 'right', fontWeight: 800, color: e.pendingAmount > 0 ? '#ef4444' : '#64748b', fontSize: '0.88rem' }}>
                            ₹{Number(e.pendingAmount).toLocaleString()}
                          </td>
                          <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                            <span className={`badge ${statusClass}`} style={{ fontSize: '0.74rem' }}>
                              {e.paymentStatus}
                            </span>
                          </td>
                          <td style={{ padding: '12px 14px', textAlign: 'right' }}>
                            <div style={{ display: 'inline-flex', gap: '6px' }}>
                              {e.pendingAmount > 0 && (
                                <button
                                  className="btn btn-sm btn-primary"
                                  onClick={() => handleOpenPayModal(e, 'Expense')}
                                  style={{ padding: '4px 8px', fontSize: '0.75rem', borderRadius: '4px' }}
                                  title="Record vendor payout"
                                >
                                  Settle
                                </button>
                              )}
                              <button
                                className="btn btn-sm btn-outline"
                                onClick={() => setSelectedExpenseForView(e)}
                                style={{ padding: '4px 8px', fontSize: '0.75rem', borderRadius: '4px' }}
                                title="View Expense Details"
                              >
                                👁️
                              </button>
                              <button
                                className="btn btn-sm btn-outline"
                                onClick={() => handleOpenExpenseModal(e)}
                                style={{ padding: '4px 8px', fontSize: '0.75rem', borderRadius: '4px' }}
                                title="Edit Expense"
                              >
                                ✏️
                              </button>
                              <button
                                className="btn btn-sm btn-outline"
                                onClick={() => handleDeleteExpense(e)}
                                style={{ padding: '4px 8px', fontSize: '0.75rem', borderRadius: '4px', color: '#ef4444' }}
                                title="Delete Expense"
                              >
                                🗑️
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
        </div>
      )}

      {/* =================================================================== */}
      {/* 5. FINANCE REPORTS */}
      {/* =================================================================== */}
      {subTab === 'finance-reports' && (
        <div>
          <div style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            padding: '16px 20px',
            marginBottom: '20px'
          }}>
            <h3 style={{ margin: 0, fontSize: '1.18rem', color: '#1e3a8a', fontWeight: 800 }}>
              Institutional Financial Statements & Audit Reports
            </h3>
            <div style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '2px' }}>
              Download detailed reports in PDF and Excel format with custom date, class, and status filters
            </div>

            {/* Report Selection Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '12px',
              marginTop: '16px'
            }}>
              {[
                { id: 'student-fee-collection', title: 'Student Fee Collection Report', desc: 'Detailed log of all student fee receipts and settlements' },
                { id: 'student-pending-fees', title: 'Student Pending Fees Report', desc: 'Overdue balances and unpaid fees organized by class' },
                { id: 'staff-salary-report', title: 'Staff Salary Report', desc: 'Gross salary, PF, ESI, deductions and net disbursed payroll' },
                { id: 'staff-salary-pending', title: 'Staff Salary Pending Report', desc: 'Outstanding salary liabilities awaiting monthly release' },
                { id: 'school-expense-report', title: 'School Expense Report', desc: 'Campus expenditure ledger sorted by category and vendor' },
                { id: 'monthly-income-report', title: 'Monthly Income Report', desc: 'Summary of fee collection revenue by academic month' },
                { id: 'monthly-expense-report', title: 'Monthly Expense Report', desc: 'Operating expenses and utilities statement' },
                { id: 'annual-finance-report', title: 'Annual Finance Report', desc: 'Full institutional balance overview for annual audit' },
                { id: 'payment-history-report', title: 'Payment History Report', desc: 'Centralized transaction journal across all financial entities' },
              ].map(rep => {
                const isSelected = reportType === rep.id;
                return (
                  <div
                    key={rep.id}
                    onClick={() => setReportType(rep.id)}
                    style={{
                      border: isSelected ? '2px solid #2563eb' : '1px solid #e2e8f0',
                      background: isSelected ? '#eff6ff' : '#ffffff',
                      borderRadius: '8px',
                      padding: '12px 14px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <div style={{ fontWeight: 700, fontSize: '0.86rem', color: isSelected ? '#1e3a8a' : '#0f172a' }}>
                      {rep.title}
                    </div>
                    <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '4px' }}>
                      {rep.desc}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Report Filters and Actions */}
          <div style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            padding: '18px 20px',
            marginBottom: '20px',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '16px',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Month</label>
                <select
                  value={reportMonth}
                  onChange={(e) => setReportMonth(e.target.value)}
                  style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.84rem' }}
                >
                  <option value="All">All Months</option>
                  <option value="October">October</option>
                  <option value="November">November</option>
                  <option value="September">September</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Academic Year</label>
                <select
                  value={reportYear}
                  onChange={(e) => setReportYear(e.target.value)}
                  style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.84rem' }}
                >
                  <option value="2026-2027">2026-2027</option>
                  <option value="2025-2026">2025-2026</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Class Filter</label>
                <select
                  value={reportClass}
                  onChange={(e) => setReportClass(e.target.value)}
                  style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.84rem' }}
                >
                  <option value="All">All Classes</option>
                  <option value="Grade 10">Grade 10</option>
                  <option value="Grade 9">Grade 9</option>
                  <option value="Grade 11">Grade 11</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Status</label>
                <select
                  value={reportStatus}
                  onChange={(e) => setReportStatus(e.target.value)}
                  style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.84rem' }}
                >
                  <option value="All">All Statuses</option>
                  <option value="Paid">Paid</option>
                  <option value="Pending">Pending / Unpaid</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                className="btn btn-outline"
                onClick={() => {
                  let exportData = [];
                  if (reportType.includes('student')) {
                    exportData = bills.map(b => ({
                      Invoice: b.invoiceNumber,
                      Student: b.studentName,
                      Class: b.grade,
                      Total: b.totalFees,
                      Paid: b.paidAmount,
                      Pending: b.pendingAmount,
                      Status: b.paymentStatus
                    }));
                  } else if (reportType.includes('salary')) {
                    exportData = salaries.map(s => ({
                      Slip: s.salarySlipNo,
                      Staff: s.staffName,
                      Designation: s.designation,
                      Gross: s.grossSalary,
                      Deductions: s.totalDeductions,
                      Net: s.netSalary,
                      Status: s.paymentStatus
                    }));
                  } else if (reportType.includes('expense')) {
                    exportData = expenses.map(e => ({
                      ID: e.expenseId,
                      Category: e.expenseCategory,
                      Expense: e.expenseName,
                      Vendor: e.vendorName,
                      Amount: e.amount,
                      Status: e.paymentStatus
                    }));
                  } else {
                    exportData = paymentHistory.map(p => ({
                      TxnID: p.transactionId,
                      Date: p.transactionDate,
                      Type: p.transactionType,
                      Party: p.partyName,
                      Amount: p.amount,
                      Method: p.paymentMethod
                    }));
                  }
                  exportToExcel(exportData, reportType);
                }}
                style={{ borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                Download Excel
              </button>

              <button
                className="btn btn-primary"
                onClick={() => {
                  window.print();
                }}
                style={{ borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                🖨️ Print / Save PDF
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* 6. PAYMENT HISTORY */}
      {/* =================================================================== */}
      {subTab === 'payment-history' && (
        <div>
          <div style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            padding: '16px 20px',
            marginBottom: '20px',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '12px'
          }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.18rem', color: '#1e3a8a', fontWeight: 800 }}>
                Centralized Financial Payment History & Audit Journal
              </h3>
              <div style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '2px' }}>
                Complete immutable record of all incoming student fee payments, outgoing staff salaries, and expense settlements
              </div>
            </div>

            <button
              className="btn btn-outline"
              onClick={() => exportToExcel(paymentHistory, 'Centralized_Payment_History')}
              style={{ borderRadius: '8px' }}
            >
              Export Excel
            </button>
          </div>

          {/* Filters Bar */}
          <div style={{
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            padding: '12px 16px',
            marginBottom: '16px',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '12px',
            alignItems: 'center'
          }}>
            <div style={{ flex: 1, minWidth: '220px' }}>
              <input
                type="text"
                placeholder="Search by transaction ID, invoice, or party name..."
                value={paySearch}
                onChange={(e) => setPaySearch(e.target.value)}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.86rem' }}
              />
            </div>

            <div>
              <select
                value={payTypeFilter}
                onChange={(e) => setPayTypeFilter(e.target.value)}
                style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.86rem' }}
              >
                <option value="All">All Transaction Types</option>
                <option value="Student Fee Payment">Student Fee Payment</option>
                <option value="Staff Salary Payment">Staff Salary Payment</option>
                <option value="School Expense Payment">School Expense Payment</option>
              </select>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '0.78rem', color: '#64748b' }}>From:</span>
              <input
                type="date"
                value={payStartDate}
                onChange={(e) => setPayStartDate(e.target.value)}
                style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.82rem' }}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '0.78rem', color: '#64748b' }}>To:</span>
              <input
                type="date"
                value={payEndDate}
                onChange={(e) => setPayEndDate(e.target.value)}
                style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.82rem' }}
              />
            </div>
          </div>

          {/* Transactions Table with Scroll */}
          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden' }}>
            <div style={{ overflowX: 'auto', width: '100%' }}>
              <table className="sa-schools-table" style={{ width: '100%', minWidth: '1000px', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                    <th style={{ padding: '12px 14px', textAlign: 'left', fontSize: '0.75rem', color: '#64748b' }}>TRANSACTION ID</th>
                    <th style={{ padding: '12px 14px', textAlign: 'left', fontSize: '0.75rem', color: '#64748b' }}>DATE</th>
                    <th style={{ padding: '12px 14px', textAlign: 'left', fontSize: '0.75rem', color: '#64748b' }}>TYPE</th>
                    <th style={{ padding: '12px 14px', textAlign: 'left', fontSize: '0.75rem', color: '#64748b' }}>PARTY NAME</th>
                    <th style={{ padding: '12px 14px', textAlign: 'left', fontSize: '0.75rem', color: '#64748b' }}>INVOICE / REF</th>
                    <th style={{ padding: '12px 14px', textAlign: 'right', fontSize: '0.75rem', color: '#64748b' }}>AMOUNT</th>
                    <th style={{ padding: '12px 14px', textAlign: 'left', fontSize: '0.75rem', color: '#64748b' }}>METHOD</th>
                    <th style={{ padding: '12px 14px', textAlign: 'center', fontSize: '0.75rem', color: '#64748b' }}>STATUS</th>
                    <th style={{ padding: '12px 14px', textAlign: 'left', fontSize: '0.75rem', color: '#64748b' }}>REMARKS</th>
                  </tr>
                </thead>
                <tbody>
                  {paymentHistory.length === 0 ? (
                    <tr>
                      <td colSpan="9" style={{ textAlign: 'center', padding: '36px', color: '#94a3b8' }}>
                        No payment transactions found in database.
                      </td>
                    </tr>
                  ) : (
                    paymentHistory.map((p) => {
                      const typeColor = p.transactionType === 'Student Fee Payment'
                        ? '#10b981'
                        : p.transactionType === 'Staff Salary Payment'
                        ? '#6366f1'
                        : '#f59e0b';

                      return (
                        <tr key={p._id || p.transactionId} style={{ borderBottom: '1px solid #f1f5f9' }}>
                          <td style={{ padding: '12px 14px', fontWeight: 700, color: '#1e3a8a', fontSize: '0.84rem' }}>
                            {p.transactionId}
                          </td>
                          <td style={{ padding: '12px 14px', fontSize: '0.84rem', color: '#475569' }}>
                            {p.transactionDate}
                          </td>
                          <td style={{ padding: '12px 14px' }}>
                            <span style={{
                              padding: '3px 8px',
                              borderRadius: '4px',
                              fontSize: '0.72rem',
                              fontWeight: 700,
                              background: `${typeColor}15`,
                              color: typeColor
                            }}>
                              {p.transactionType}
                            </span>
                          </td>
                          <td style={{ padding: '12px 14px', fontWeight: 700, color: '#0f172a', fontSize: '0.86rem' }}>
                            {p.partyName}
                          </td>
                          <td style={{ padding: '12px 14px', fontSize: '0.82rem', color: '#64748b' }}>
                            {p.invoiceNumber || '—'}
                          </td>
                          <td style={{ padding: '12px 14px', textAlign: 'right', fontWeight: 800, color: '#0f172a', fontSize: '0.88rem' }}>
                            ₹{Number(p.amount).toLocaleString()}
                          </td>
                          <td style={{ padding: '12px 14px', fontSize: '0.82rem', color: '#475569' }}>
                            {p.paymentMethod}
                          </td>
                          <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                            <span className="badge badge-success" style={{ fontSize: '0.72rem' }}>
                              {p.paymentStatus || 'Completed'}
                            </span>
                          </td>
                          <td style={{ padding: '12px 14px', fontSize: '0.78rem', color: '#64748b', maxWidth: '200px' }}>
                            {p.remarks || '—'}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* MODAL 1: CREATE / EDIT STUDENT BILL */}
      {/* =================================================================== */}
      {isBillModalOpen && (
        <div className="modal-overlay" style={{ display: 'flex', zIndex: 10000 }}>
          <div className="modal-content wizard-modal-lg" style={{ maxWidth: '850px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div className="modal-header">
              <h3>{editingBill ? 'Edit Student Bill' : 'Create Student Bill'}</h3>
              <button className="modal-close" onClick={() => setIsBillModalOpen(false)}>&times;</button>
            </div>

            <form onSubmit={handleSaveBill} style={{ padding: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px', marginBottom: '16px' }}>
                <div>
                  <label className="form-label">Student Name *</label>
                  <input
                    type="text"
                    required
                    className="form-control"
                    value={billForm.studentName}
                    onChange={(e) => setBillForm({ ...billForm, studentName: e.target.value })}
                    placeholder="e.g. Kavitha Selvam"
                  />
                </div>

                <div>
                  <label className="form-label">Student ID / Roll No</label>
                  <input
                    type="text"
                    className="form-control"
                    value={billForm.rollNo}
                    onChange={(e) => setBillForm({ ...billForm, rollNo: e.target.value, studentId: e.target.value })}
                    placeholder="e.g. S102"
                  />
                </div>

                <div>
                  <label className="form-label">Admission Number</label>
                  <input
                    type="text"
                    className="form-control"
                    value={billForm.admissionNumber}
                    onChange={(e) => setBillForm({ ...billForm, admissionNumber: e.target.value })}
                    placeholder="e.g. ADM-2024-102"
                  />
                </div>

                <div>
                  <label className="form-label">Grade / Class *</label>
                  <select
                    className="form-control"
                    value={billForm.grade}
                    onChange={(e) => setBillForm({ ...billForm, grade: e.target.value })}
                  >
                    <option value="Grade 10">Grade 10</option>
                    <option value="Grade 9">Grade 9</option>
                    <option value="Grade 8">Grade 8</option>
                    <option value="Grade 11">Grade 11</option>
                    <option value="Grade 12">Grade 12</option>
                  </select>
                </div>

                <div>
                  <label className="form-label">Section</label>
                  <select
                    className="form-control"
                    value={billForm.section}
                    onChange={(e) => setBillForm({ ...billForm, section: e.target.value })}
                  >
                    <option value="A">Section A</option>
                    <option value="B">Section B</option>
                    <option value="C">Section C</option>
                  </select>
                </div>

                <div>
                  <label className="form-label">Academic Year</label>
                  <input
                    type="text"
                    className="form-control"
                    value={billForm.academicYear}
                    onChange={(e) => setBillForm({ ...billForm, academicYear: e.target.value })}
                  />
                </div>

                <div>
                  <label className="form-label">Billing Month</label>
                  <select
                    className="form-control"
                    value={billForm.billingMonth}
                    onChange={(e) => setBillForm({ ...billForm, billingMonth: e.target.value })}
                  >
                    {['June', 'July', 'August', 'September', 'October', 'November', 'December', 'January', 'February', 'March'].map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="form-label">Billing Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={billForm.billingDate}
                    onChange={(e) => setBillForm({ ...billForm, billingDate: e.target.value })}
                  />
                </div>

                <div>
                  <label className="form-label">Due Date *</label>
                  <input
                    type="date"
                    required
                    className="form-control"
                    value={billForm.dueDate}
                    onChange={(e) => setBillForm({ ...billForm, dueDate: e.target.value })}
                  />
                </div>
              </div>

              {/* Itemized Fee Items Table */}
              <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '14px', marginBottom: '16px', background: '#f8fafc' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.92rem', color: '#1e3a8a' }}>
                    Fee Line Items (Allowing Standard & Custom Fee Categories)
                  </div>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline"
                    onClick={handleAddFeeItemRow}
                    style={{ fontSize: '0.78rem' }}
                  >
                    ➕ Add Fee Item
                  </button>
                </div>

                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.84rem' }}>
                    <thead>
                      <tr style={{ background: '#e2e8f0' }}>
                        <th style={{ padding: '8px', textAlign: 'left' }}>Fee Type</th>
                        <th style={{ padding: '8px', textAlign: 'left' }}>Description</th>
                        <th style={{ padding: '8px', width: '95px', textAlign: 'right' }}>Amount (₹)</th>
                        <th style={{ padding: '8px', width: '85px', textAlign: 'right' }}>Discount (₹)</th>
                        <th style={{ padding: '8px', width: '85px', textAlign: 'right' }}>Fine (₹)</th>
                        <th style={{ padding: '8px', width: '95px', textAlign: 'right' }}>Net (₹)</th>
                        <th style={{ padding: '8px', width: '120px', textAlign: 'center' }}>Payment Status</th>
                        <th style={{ padding: '8px', width: '40px' }}></th>
                      </tr>
                    </thead>
                    <tbody>
                      {billForm.feeItems.map((item, idx) => (
                        <tr key={idx} style={{ borderBottom: '1px solid #cbd5e1' }}>
                          <td style={{ padding: '6px' }}>
                            <input
                              type="text"
                              list="standard-fees"
                              className="form-control"
                              value={item.feeType}
                              onChange={(e) => handleFeeItemChange(idx, 'feeType', e.target.value)}
                              style={{ padding: '4px 8px', fontSize: '0.82rem' }}
                            />
                            <datalist id="standard-fees">
                              {standardFeeTypes.map(f => <option key={f} value={f} />)}
                            </datalist>
                          </td>
                          <td style={{ padding: '6px' }}>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Notes"
                              value={item.description}
                              onChange={(e) => handleFeeItemChange(idx, 'description', e.target.value)}
                              style={{ padding: '4px 8px', fontSize: '0.82rem' }}
                            />
                          </td>
                          <td style={{ padding: '6px' }}>
                            <input
                              type="number"
                              min="0"
                              className="form-control"
                              value={item.amount}
                              onChange={(e) => handleFeeItemChange(idx, 'amount', e.target.value)}
                              style={{ padding: '4px 8px', fontSize: '0.82rem', textAlign: 'right' }}
                            />
                          </td>
                          <td style={{ padding: '6px' }}>
                            <input
                              type="number"
                              min="0"
                              className="form-control"
                              value={item.discount}
                              onChange={(e) => handleFeeItemChange(idx, 'discount', e.target.value)}
                              style={{ padding: '4px 8px', fontSize: '0.82rem', textAlign: 'right' }}
                            />
                          </td>
                          <td style={{ padding: '6px' }}>
                            <input
                              type="number"
                              min="0"
                              className="form-control"
                              value={item.fine}
                              onChange={(e) => handleFeeItemChange(idx, 'fine', e.target.value)}
                              style={{ padding: '4px 8px', fontSize: '0.82rem', textAlign: 'right' }}
                            />
                          </td>
                          <td style={{ padding: '6px', textAlign: 'right', fontWeight: 700 }}>
                            ₹{Number(item.netAmount || 0).toLocaleString()}
                          </td>
                          <td style={{ padding: '6px', textAlign: 'center' }}>
                            <button
                              type="button"
                              onClick={() => handleToggleFeeItemStatus(idx)}
                              style={{
                                padding: '5px 12px',
                                borderRadius: '6px',
                                border: 'none',
                                fontWeight: 700,
                                fontSize: '0.78rem',
                                cursor: 'pointer',
                                transition: 'all 0.15s ease',
                                background: item.status === 'Paid' ? '#10b981' : '#ef4444',
                                color: '#ffffff',
                                boxShadow: item.status === 'Paid' ? '0 2px 6px rgba(16, 185, 129, 0.3)' : '0 2px 6px rgba(239, 68, 68, 0.3)',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px'
                              }}
                              title={item.status === 'Paid' ? 'Click to mark as Unpaid' : 'Click to mark as Paid'}
                            >
                              {item.status === 'Paid' ? '✓ Paid' : '✕ Unpaid'}
                            </button>
                          </td>
                          <td style={{ padding: '6px', textAlign: 'center' }}>
                            <button
                              type="button"
                              onClick={() => handleRemoveFeeItemRow(idx)}
                              style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '1rem' }}
                            >
                              &times;
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Calculation Summary Bar */}
                {(() => {
                  const calculatedTotal = billForm.feeItems.reduce((acc, it) => acc + (Number(it.netAmount) || 0), 0);
                  const paid = Number(billForm.paidAmount) || 0;
                  const pending = Math.max(0, calculatedTotal - paid);

                  return (
                    <div style={{
                      display: 'flex',
                      justifyContent: 'flex-end',
                      gap: '24px',
                      marginTop: '12px',
                      paddingTop: '8px',
                      borderTop: '1px solid #cbd5e1',
                      fontSize: '0.9rem'
                    }}>
                      <div>Total Fees: <strong>₹{calculatedTotal.toLocaleString()}</strong></div>
                      <div>Initial Paid: <strong>₹{paid.toLocaleString()}</strong></div>
                      <div style={{ color: pending > 0 ? '#ef4444' : '#10b981', fontWeight: 800 }}>
                        Balance Due: ₹{pending.toLocaleString()}
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* Initial Paid Amount & Method */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px', marginBottom: '16px' }}>
                <div>
                  <label className="form-label">Initial Paid Amount (₹)</label>
                  <input
                    type="number"
                    min="0"
                    className="form-control"
                    value={billForm.paidAmount}
                    onChange={(e) => setBillForm({ ...billForm, paidAmount: e.target.value })}
                  />
                </div>

                <div>
                  <label className="form-label">Payment Method</label>
                  <select
                    className="form-control"
                    value={billForm.paymentMethod}
                    onChange={(e) => setBillForm({ ...billForm, paymentMethod: e.target.value })}
                  >
                    <option value="Cash">Cash</option>
                    <option value="UPI / NetBanking">UPI / NetBanking</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="Cheque">Cheque</option>
                  </select>
                </div>

                <div>
                  <label className="form-label">Remarks / Notes</label>
                  <input
                    type="text"
                    className="form-control"
                    value={billForm.remarks}
                    onChange={(e) => setBillForm({ ...billForm, remarks: e.target.value })}
                    placeholder="e.g. Received via cheque"
                  />
                </div>
              </div>

              <div className="modal-actions" style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button type="button" className="btn btn-outline" onClick={() => setIsBillModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Saving...' : editingBill ? 'Update Bill' : 'Generate Bill'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* MODAL 2: GENERATE / EDIT STAFF SALARY */}
      {/* =================================================================== */}
      {isSalaryModalOpen && (
        <div className="modal-overlay" style={{ display: 'flex', zIndex: 10000 }}>
          <div className="modal-content wizard-modal-lg" style={{ maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div className="modal-header">
              <h3>{editingSalary ? 'Edit Staff Salary Slip' : 'Generate Staff Salary Slip'}</h3>
              <button className="modal-close" onClick={() => setIsSalaryModalOpen(false)}>&times;</button>
            </div>

            <form onSubmit={handleSaveSalary} style={{ padding: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px', marginBottom: '16px' }}>
                <div>
                  <label className="form-label">Staff Type *</label>
                  <select
                    className="form-control"
                    value={salaryForm.staffType}
                    onChange={(e) => setSalaryForm({ ...salaryForm, staffType: e.target.value })}
                  >
                    <option value="Teaching">Teaching Faculty</option>
                    <option value="Non-Teaching">Non-Teaching Staff</option>
                  </select>
                </div>

                <div>
                  <label className="form-label">Staff Name *</label>
                  <input
                    type="text"
                    required
                    className="form-control"
                    value={salaryForm.staffName}
                    onChange={(e) => setSalaryForm({ ...salaryForm, staffName: e.target.value })}
                    placeholder="e.g. Mrs. Priya Krishnan"
                  />
                </div>

                <div>
                  <label className="form-label">Staff ID</label>
                  <input
                    type="text"
                    className="form-control"
                    value={salaryForm.staffId}
                    onChange={(e) => setSalaryForm({ ...salaryForm, staffId: e.target.value })}
                    placeholder="e.g. T01 / NT-01"
                  />
                </div>

                <div>
                  <label className="form-label">Designation *</label>
                  <input
                    type="text"
                    list="designation-suggestions"
                    required
                    className="form-control"
                    value={salaryForm.designation}
                    onChange={(e) => setSalaryForm({ ...salaryForm, designation: e.target.value })}
                    placeholder="e.g. Transport Driver"
                  />
                  <datalist id="designation-suggestions">
                    <option value="Senior Teacher" />
                    <option value="Faculty" />
                    <option value="Transport Driver" />
                    <option value="Cleaning Worker" />
                    <option value="Hostel Warden" />
                    <option value="Security Officer" />
                    <option value="Lab Assistant" />
                  </datalist>
                </div>

                <div>
                  <label className="form-label">Department</label>
                  <input
                    type="text"
                    className="form-control"
                    value={salaryForm.department}
                    onChange={(e) => setSalaryForm({ ...salaryForm, department: e.target.value })}
                    placeholder="e.g. Transport / Housekeeping"
                  />
                </div>

                <div>
                  <label className="form-label">Salary Month *</label>
                  <select
                    className="form-control"
                    value={salaryForm.salaryMonth}
                    onChange={(e) => setSalaryForm({ ...salaryForm, salaryMonth: e.target.value })}
                  >
                    {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="form-label">Salary Year *</label>
                  <input
                    type="number"
                    className="form-control"
                    value={salaryForm.salaryYear}
                    onChange={(e) => setSalaryForm({ ...salaryForm, salaryYear: e.target.value })}
                  />
                </div>
              </div>

              {/* Earnings & Deductions Split */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                {/* Earnings Card */}
                <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '14px' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#1e3a8a', marginBottom: '10px' }}>
                    1. Earnings Breakdown (₹)
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div>
                      <label className="form-label">Basic Salary *</label>
                      <input
                        type="number"
                        min="0"
                        className="form-control"
                        value={salaryForm.basicSalary}
                        onChange={(e) => setSalaryForm({ ...salaryForm, basicSalary: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="form-label">HRA</label>
                      <input
                        type="number"
                        min="0"
                        className="form-control"
                        value={salaryForm.hra}
                        onChange={(e) => setSalaryForm({ ...salaryForm, hra: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="form-label">Allowances</label>
                      <input
                        type="number"
                        min="0"
                        className="form-control"
                        value={salaryForm.allowances}
                        onChange={(e) => setSalaryForm({ ...salaryForm, allowances: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="form-label">Bonus</label>
                      <input
                        type="number"
                        min="0"
                        className="form-control"
                        value={salaryForm.bonus}
                        onChange={(e) => setSalaryForm({ ...salaryForm, bonus: e.target.value })}
                      />
                    </div>
                    <div style={{ gridColumn: 'span 2' }}>
                      <label className="form-label">Incentives</label>
                      <input
                        type="number"
                        min="0"
                        className="form-control"
                        value={salaryForm.incentives}
                        onChange={(e) => setSalaryForm({ ...salaryForm, incentives: e.target.value })}
                      />
                    </div>
                  </div>

                  <div style={{ marginTop: '10px', paddingTop: '8px', borderTop: '1px solid #cbd5e1', fontWeight: 700, color: '#1e3a8a', textAlign: 'right' }}>
                    Gross Earnings: ₹{calcGross.toLocaleString()}
                  </div>
                </div>

                {/* Deductions Card */}
                <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '14px' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#dc2626', marginBottom: '10px' }}>
                    2. Deductions Breakdown (₹)
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div>
                      <label className="form-label">Provident Fund (PF)</label>
                      <input
                        type="number"
                        min="0"
                        className="form-control"
                        value={salaryForm.pf}
                        onChange={(e) => setSalaryForm({ ...salaryForm, pf: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="form-label">ESI</label>
                      <input
                        type="number"
                        min="0"
                        className="form-control"
                        value={salaryForm.esi}
                        onChange={(e) => setSalaryForm({ ...salaryForm, esi: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="form-label">Salary Advance</label>
                      <input
                        type="number"
                        min="0"
                        className="form-control"
                        value={salaryForm.salaryAdvance}
                        onChange={(e) => setSalaryForm({ ...salaryForm, salaryAdvance: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="form-label">Other Deductions</label>
                      <input
                        type="number"
                        min="0"
                        className="form-control"
                        value={salaryForm.otherDeductions}
                        onChange={(e) => setSalaryForm({ ...salaryForm, otherDeductions: e.target.value })}
                      />
                    </div>
                  </div>

                  <div style={{ marginTop: '10px', paddingTop: '8px', borderTop: '1px solid #cbd5e1', fontWeight: 700, color: '#dc2626', textAlign: 'right' }}>
                    Total Deductions: ₹{calcDeductions.toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Net Salary Computed Ribbon */}
              <div style={{ background: '#f0fdf4', border: '1px solid #86efac', borderRadius: '8px', padding: '12px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div>
                  <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#166534', textTransform: 'uppercase' }}>Computed Net Salary</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#15803d' }}>₹{calcNet.toLocaleString()}</div>
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <div>
                    <label className="form-label">Paid Amount (₹)</label>
                    <input
                      type="number"
                      min="0"
                      className="form-control"
                      value={salaryForm.paidAmount}
                      onChange={(e) => setSalaryForm({ ...salaryForm, paidAmount: e.target.value })}
                      style={{ width: '130px' }}
                    />
                  </div>

                  <div>
                    <label className="form-label">Bank Account</label>
                    <input
                      type="text"
                      className="form-control"
                      value={salaryForm.bankAccountNo}
                      onChange={(e) => setSalaryForm({ ...salaryForm, bankAccountNo: e.target.value })}
                      placeholder="e.g. HDFC-XXXX9921"
                    />
                  </div>
                </div>
              </div>

              <div className="modal-actions" style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button type="button" className="btn btn-outline" onClick={() => setIsSalaryModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Processing...' : editingSalary ? 'Update Salary' : 'Generate Salary Slip'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* MODAL 3: ADD / EDIT SCHOOL EXPENSE */}
      {/* =================================================================== */}
      {isExpenseModalOpen && (
        <div className="modal-overlay" style={{ display: 'flex', zIndex: 10000 }}>
          <div className="modal-content" style={{ maxWidth: '650px' }}>
            <div className="modal-header">
              <h3>{editingExpense ? 'Edit Campus Expense' : 'Record School Expense'}</h3>
              <button className="modal-close" onClick={() => setIsExpenseModalOpen(false)}>&times;</button>
            </div>

            <form onSubmit={handleSaveExpense} style={{ padding: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
                <div>
                  <label className="form-label">Expense Category *</label>
                  <select
                    className="form-control"
                    value={expenseForm.expenseCategory}
                    onChange={(e) => setExpenseForm({ ...expenseForm, expenseCategory: e.target.value })}
                  >
                    {expenseCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>

                <div>
                  <label className="form-label">Expense Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={expenseForm.expenseDate}
                    onChange={(e) => setExpenseForm({ ...expenseForm, expenseDate: e.target.value })}
                  />
                </div>

                <div style={{ gridColumn: 'span 2' }}>
                  <label className="form-label">Expense Item / Title *</label>
                  <input
                    type="text"
                    required
                    className="form-control"
                    value={expenseForm.expenseName}
                    onChange={(e) => setExpenseForm({ ...expenseForm, expenseName: e.target.value })}
                    placeholder="e.g. Campus Electricity HT Line Bill"
                  />
                </div>

                <div>
                  <label className="form-label">Vendor / Service Provider *</label>
                  <input
                    type="text"
                    required
                    className="form-control"
                    value={expenseForm.vendorName}
                    onChange={(e) => setExpenseForm({ ...expenseForm, vendorName: e.target.value })}
                    placeholder="e.g. Tamil Nadu Electricity Board (TNEB)"
                  />
                </div>

                <div>
                  <label className="form-label">Vendor Invoice No</label>
                  <input
                    type="text"
                    className="form-control"
                    value={expenseForm.invoiceNumber}
                    onChange={(e) => setExpenseForm({ ...expenseForm, invoiceNumber: e.target.value })}
                    placeholder="e.g. EB-2026-8812"
                  />
                </div>

                <div>
                  <label className="form-label">Total Amount (₹) *</label>
                  <input
                    type="number"
                    min="1"
                    required
                    className="form-control"
                    value={expenseForm.amount}
                    onChange={(e) => setExpenseForm({ ...expenseForm, amount: e.target.value })}
                  />
                </div>

                <div>
                  <label className="form-label">Paid Amount (₹)</label>
                  <input
                    type="number"
                    min="0"
                    className="form-control"
                    value={expenseForm.paidAmount}
                    onChange={(e) => setExpenseForm({ ...expenseForm, paidAmount: e.target.value })}
                  />
                </div>

                <div>
                  <label className="form-label">Payment Method</label>
                  <select
                    className="form-control"
                    value={expenseForm.paymentMethod}
                    onChange={(e) => setExpenseForm({ ...expenseForm, paymentMethod: e.target.value })}
                  >
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="UPI / NetBanking">UPI / NetBanking</option>
                    <option value="Cash">Cash</option>
                    <option value="Cheque">Cheque</option>
                    <option value="Credit Card">Credit Card</option>
                  </select>
                </div>

                <div>
                  <label className="form-label">Remarks</label>
                  <input
                    type="text"
                    className="form-control"
                    value={expenseForm.remarks}
                    onChange={(e) => setExpenseForm({ ...expenseForm, remarks: e.target.value })}
                    placeholder="e.g. Verified with lab meters"
                  />
                </div>
              </div>

              <div className="modal-actions" style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button type="button" className="btn btn-outline" onClick={() => setIsExpenseModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Saving...' : editingExpense ? 'Update Expense' : 'Save Expense'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* MODAL 4: RECORD PAYMENT (Partial or Full) */}
      {/* =================================================================== */}
      {isPayModalOpen && activePayingRecord && (
        <div className="modal-overlay" style={{ display: 'flex', zIndex: 10000 }}>
          <div className="modal-content" style={{ maxWidth: '500px' }}>
            <div className="modal-header">
              <h3>Record {activePayingRecord._paymentType} Payment</h3>
              <button className="modal-close" onClick={() => setIsPayModalOpen(false)}>&times;</button>
            </div>

            <form onSubmit={handleExecutePayment} style={{ padding: '16px' }}>
              <div style={{ background: '#f8fafc', padding: '12px 16px', borderRadius: '8px', marginBottom: '16px' }}>
                <div style={{ fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Account / Payee</div>
                <div style={{ fontSize: '1rem', fontWeight: 800, color: '#1e3a8a', marginTop: '2px' }}>
                  {activePayingRecord.studentName || activePayingRecord.staffName || activePayingRecord.vendorName}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: '#475569', marginTop: '6px' }}>
                  <span>Outstanding Pending:</span>
                  <strong style={{ color: '#ef4444' }}>₹{Number(activePayingRecord.pendingAmount).toLocaleString()}</strong>
                </div>
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label className="form-label">Payment Amount (₹) *</label>
                <input
                  type="number"
                  min="1"
                  max={activePayingRecord.pendingAmount}
                  required
                  className="form-control"
                  value={paymentRecordForm.amount}
                  onChange={(e) => setPaymentRecordForm({ ...paymentRecordForm, amount: e.target.value })}
                  placeholder={`Up to ₹${activePayingRecord.pendingAmount}`}
                />
                <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '4px' }}>
                  Partial payments supported. Overpayment exceeding pending balance is automatically prevented.
                </div>
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label className="form-label">Payment Method</label>
                <select
                  className="form-control"
                  value={paymentRecordForm.paymentMethod}
                  onChange={(e) => setPaymentRecordForm({ ...paymentRecordForm, paymentMethod: e.target.value })}
                >
                  <option value="Cash">Cash</option>
                  <option value="UPI / NetBanking">UPI / NetBanking</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="Cheque">Cheque</option>
                  <option value="Credit Card">Credit Card</option>
                </select>
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label className="form-label">Payment Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={paymentRecordForm.paymentDate}
                  onChange={(e) => setPaymentRecordForm({ ...paymentRecordForm, paymentDate: e.target.value })}
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label className="form-label">Remarks</label>
                <input
                  type="text"
                  className="form-control"
                  value={paymentRecordForm.remarks}
                  onChange={(e) => setPaymentRecordForm({ ...paymentRecordForm, remarks: e.target.value })}
                  placeholder="e.g. Receipt #4492 issued"
                />
              </div>

              <div className="modal-actions" style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button type="button" className="btn btn-outline" onClick={() => setIsPayModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Processing...' : 'Confirm Payment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* MODAL 5: VIEW BILL DETAILS */}
      {/* =================================================================== */}
      {selectedBillForView && (
        <div className="modal-overlay" style={{ display: 'flex', zIndex: 10000 }}>
          <div className="modal-content" style={{ maxWidth: '600px' }}>
            <div className="modal-header">
              <h3>Student Fee Invoice - {selectedBillForView.invoiceNumber}</h3>
              <button className="modal-close" onClick={() => setSelectedBillForView(null)}>&times;</button>
            </div>

            <div style={{ padding: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px' }}>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '1rem', color: '#0f172a' }}>{selectedBillForView.studentName}</div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Roll: {selectedBillForView.rollNo || selectedBillForView.studentId} • Class: {selectedBillForView.grade} ({selectedBillForView.section})</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Due Date: {selectedBillForView.dueDate}</div>
                  <span className={`badge ${selectedBillForView.paymentStatus === 'Paid' ? 'badge-success' : 'badge-danger'}`}>
                    {selectedBillForView.paymentStatus}
                  </span>
                </div>
              </div>

              <div style={{ marginBottom: '14px' }}>
                <div style={{ fontWeight: 700, fontSize: '0.84rem', color: '#1e3a8a', marginBottom: '6px' }}>Itemized Fee Details</div>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.84rem' }}>
                  <thead>
                    <tr style={{ background: '#f8fafc', borderBottom: '1px solid #cbd5e1' }}>
                      <th style={{ padding: '6px', textAlign: 'left' }}>Item</th>
                      <th style={{ padding: '6px', textAlign: 'right' }}>Amount</th>
                      <th style={{ padding: '6px', textAlign: 'right' }}>Discount</th>
                      <th style={{ padding: '6px', textAlign: 'right' }}>Fine</th>
                      <th style={{ padding: '6px', textAlign: 'right' }}>Net</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(selectedBillForView.feeItems || []).map((it, idx) => (
                      <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '6px' }}>{it.feeType}</td>
                        <td style={{ padding: '6px', textAlign: 'right' }}>₹{it.amount}</td>
                        <td style={{ padding: '6px', textAlign: 'right', color: '#16a34a' }}>-₹{it.discount}</td>
                        <td style={{ padding: '6px', textAlign: 'right', color: '#dc2626' }}>+₹{it.fine}</td>
                        <td style={{ padding: '6px', textAlign: 'right', fontWeight: 700 }}>₹{it.netAmount || it.amount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '6px', fontSize: '0.86rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span>Total Amount:</span>
                  <strong>₹{Number(selectedBillForView.totalFees).toLocaleString()}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', color: '#16a34a' }}>
                  <span>Paid:</span>
                  <strong>₹{Number(selectedBillForView.paidAmount).toLocaleString()}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#dc2626', fontWeight: 800 }}>
                  <span>Outstanding Pending:</span>
                  <span>₹{Number(selectedBillForView.pendingAmount).toLocaleString()}</span>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '16px' }}>
                <button className="btn btn-primary btn-sm" onClick={() => downloadStudentBillPDF(selectedBillForView)}>
                  Download PDF Invoice
                </button>
                <button className="btn btn-outline btn-sm" onClick={() => setSelectedBillForView(null)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* MODAL 6: VIEW SALARY DETAILS */}
      {/* =================================================================== */}
      {selectedSalaryForView && (
        <div className="modal-overlay" style={{ display: 'flex', zIndex: 10000 }}>
          <div className="modal-content" style={{ maxWidth: '580px' }}>
            <div className="modal-header">
              <h3>Salary Slip - {selectedSalaryForView.salarySlipNo}</h3>
              <button className="modal-close" onClick={() => setSelectedSalaryForView(null)}>&times;</button>
            </div>

            <div style={{ padding: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '14px', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px' }}>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '1rem', color: '#0f172a' }}>{selectedSalaryForView.staffName}</div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                    [{selectedSalaryForView.staffType || 'Teaching Staff'}] • {selectedSalaryForView.designation} • {selectedSalaryForView.department}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Month: {selectedSalaryForView.salaryMonth} {selectedSalaryForView.salaryYear}</div>
                  <span className={`badge ${selectedSalaryForView.paymentStatus === 'Paid' ? 'badge-success' : 'badge-danger'}`}>
                    {selectedSalaryForView.paymentStatus}
                  </span>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '0.82rem', marginBottom: '14px' }}>
                <div style={{ background: '#f8fafc', padding: '10px', borderRadius: '6px' }}>
                  <div style={{ fontWeight: 700, color: '#1e3a8a', marginBottom: '6px' }}>Earnings</div>
                  <div>Basic: ₹{Number(selectedSalaryForView.basicSalary || 0).toLocaleString()}</div>
                  <div>HRA: ₹{Number(selectedSalaryForView.hra || 0).toLocaleString()}</div>
                  <div>Allowances: ₹{Number(selectedSalaryForView.allowances || 0).toLocaleString()}</div>
                  <div style={{ fontWeight: 700, marginTop: '4px', borderTop: '1px solid #cbd5e1', paddingTop: '4px' }}>
                    Gross: ₹{Number(selectedSalaryForView.grossSalary || 0).toLocaleString()}
                  </div>
                </div>

                <div style={{ background: '#f8fafc', padding: '10px', borderRadius: '6px' }}>
                  <div style={{ fontWeight: 700, color: '#dc2626', marginBottom: '6px' }}>Deductions</div>
                  <div>PF: ₹{Number(selectedSalaryForView.pf || 0).toLocaleString()}</div>
                  <div>ESI: ₹{Number(selectedSalaryForView.esi || 0).toLocaleString()}</div>
                  <div>Advance: ₹{Number(selectedSalaryForView.salaryAdvance || 0).toLocaleString()}</div>
                  <div style={{ fontWeight: 700, marginTop: '4px', borderTop: '1px solid #cbd5e1', paddingTop: '4px', color: '#dc2626' }}>
                    Total Ded: ₹{Number(selectedSalaryForView.totalDeductions || 0).toLocaleString()}
                  </div>
                </div>
              </div>

              <div style={{ background: '#f0fdf4', padding: '12px', borderRadius: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 700, color: '#166534' }}>Net Payable Salary:</span>
                <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#15803d' }}>
                  ₹{Number(selectedSalaryForView.netSalary || 0).toLocaleString()}
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '16px' }}>
                <button className="btn btn-primary btn-sm" onClick={() => downloadSalarySlipPDF(selectedSalaryForView)}>
                  Download Payslip PDF
                </button>
                <button className="btn btn-outline btn-sm" onClick={() => setSelectedSalaryForView(null)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* MODAL: BULK EXCEL UPLOAD PREVIEW & IMPORT LIST MODAL */}
      {/* =================================================================== */}
      {bulkImportModal.isOpen && (
        <div className="modal-overlay" style={{ display: 'flex', zIndex: 10000 }}>
          <div className="modal-content" style={{ maxWidth: '960px', width: '95%', maxHeight: '90vh', overflowY: 'auto' }}>
            <div className="modal-header" style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '1.4rem' }}></span>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#1e3a8a', fontWeight: 800 }}>
                    Bulk Excel Upload - {bulkImportModal.type === 'student' ? 'Student Fee Billing' : 'Staff Salary Register'}
                  </h3>
                  <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '2px' }}>
                    {bulkImportModal.fileName ? `Selected File: ${bulkImportModal.fileName} (${bulkImportModal.previewData.length} rows detected)` : 'Upload and import bulk rows directly into system'}
                  </div>
                </div>
              </div>
              <button
                className="modal-close"
                onClick={() => setBulkImportModal(prev => ({ ...prev, isOpen: false, previewData: [], importedList: [] }))}
              >
                &times;
              </button>
            </div>

            <div style={{ padding: '16px 20px' }}>
              {/* Top Action Bar: Sample Template Download & File Re-selection */}
              <div style={{
                background: '#f8fafc',
                border: '1px dashed #cbd5e1',
                borderRadius: '10px',
                padding: '14px 18px',
                marginBottom: '16px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '12px'
              }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#0f172a' }}>
                    Download Standard Excel Template
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                    Pre-formatted columns ready with headers and sample values
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline"
                    onClick={() => downloadSampleTemplate(bulkImportModal.type)}
                    style={{ fontWeight: 700, borderColor: '#2563eb', color: '#1d4ed8' }}
                  >
                    Download Sample Template (.xlsx)
                  </button>

                  <label
                    className="btn btn-sm btn-primary"
                    style={{ fontWeight: 700, cursor: 'pointer', margin: 0 }}
                  >
                    📂 Choose Excel File
                    <input
                      type="file"
                      accept=".xlsx, .xls, .csv"
                      onChange={(e) => handleExcelFileSelect(e, bulkImportModal.type)}
                      style={{ display: 'none' }}
                    />
                  </label>
                </div>
              </div>

              {/* Status Message if successfully imported */}
              {bulkImportModal.importedList && bulkImportModal.importedList.length > 0 && (
                <div style={{
                  background: '#f0fdf4',
                  border: '1px solid #86efac',
                  borderRadius: '8px',
                  padding: '12px 16px',
                  marginBottom: '16px',
                  color: '#166534',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <span>✅</span> Successfully imported {bulkImportModal.importedList.length} records into the system! The live registers have been updated.
                </div>
              )}

              {/* Preview Table of Uploaded Records */}
              {bulkImportModal.previewData.length > 0 ? (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <div style={{ fontSize: '0.86rem', fontWeight: 700, color: '#1e3a8a' }}>
                      📋 Uploaded List Preview ({bulkImportModal.previewData.length} records)
                    </div>
                    <span style={{ fontSize: '0.76rem', color: '#64748b' }}>
                      Scroll left to right to preview all columns before saving
                    </span>
                  </div>

                  <div style={{
                    maxHeight: '340px',
                    overflowX: 'auto',
                    overflowY: 'auto',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px'
                  }}>
                    <table style={{ width: '100%', minWidth: '900px', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
                      <thead>
                        <tr style={{ background: '#f1f5f9', borderBottom: '2px solid #cbd5e1' }}>
                          <th style={{ padding: '8px 10px', textAlign: 'center', width: '40px' }}>#</th>
                          {bulkImportModal.type === 'student' ? (
                            <>
                              <th style={{ padding: '8px 10px', textAlign: 'left' }}>Student Name</th>
                              <th style={{ padding: '8px 10px', textAlign: 'left' }}>Roll / ID</th>
                              <th style={{ padding: '8px 10px', textAlign: 'left' }}>Class</th>
                              <th style={{ padding: '8px 10px', textAlign: 'left' }}>Month</th>
                              <th style={{ padding: '8px 10px', textAlign: 'right' }}>Monthly Fee</th>
                              <th style={{ padding: '8px 10px', textAlign: 'right' }}>Transport</th>
                              <th style={{ padding: '8px 10px', textAlign: 'right' }}>Co-curricular</th>
                              <th style={{ padding: '8px 10px', textAlign: 'right' }}>Term Fee</th>
                              <th style={{ padding: '8px 10px', textAlign: 'right' }}>Total Fee</th>
                              <th style={{ padding: '8px 10px', textAlign: 'right' }}>Paid Amt</th>
                            </>
                          ) : (
                            <>
                              <th style={{ padding: '8px 10px', textAlign: 'left' }}>Staff Name</th>
                              <th style={{ padding: '8px 10px', textAlign: 'left' }}>Staff ID</th>
                              <th style={{ padding: '8px 10px', textAlign: 'left' }}>Designation</th>
                              <th style={{ padding: '8px 10px', textAlign: 'left' }}>Department</th>
                              <th style={{ padding: '8px 10px', textAlign: 'left' }}>Month</th>
                              <th style={{ padding: '8px 10px', textAlign: 'right' }}>Basic Salary</th>
                              <th style={{ padding: '8px 10px', textAlign: 'right' }}>Gross Salary</th>
                              <th style={{ padding: '8px 10px', textAlign: 'right' }}>Deductions</th>
                              <th style={{ padding: '8px 10px', textAlign: 'right' }}>Net Salary</th>
                              <th style={{ padding: '8px 10px', textAlign: 'right' }}>Paid Amt</th>
                            </>
                          )}
                        </tr>
                      </thead>
                      <tbody>
                        {bulkImportModal.previewData.map((row, idx) => (
                          <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9', background: idx % 2 === 0 ? '#ffffff' : '#fafafa' }}>
                            <td style={{ padding: '8px 10px', textAlign: 'center', color: '#64748b' }}>{idx + 1}</td>
                            {bulkImportModal.type === 'student' ? (
                              <>
                                <td style={{ padding: '8px 10px', fontWeight: 700, color: '#1e3a8a' }}>
                                  {row['Student Name'] || row.studentName || '—'}
                                </td>
                                <td style={{ padding: '8px 10px' }}>
                                  <code>{row['Roll No'] || row.rollNo || row.studentId || '—'}</code>
                                </td>
                                <td style={{ padding: '8px 10px' }}>
                                  {row['Class'] || row.grade || 'Grade 10'} {row['Section'] || row.section ? `(${row['Section'] || row.section})` : ''}
                                </td>
                                <td style={{ padding: '8px 10px' }}>
                                  {row['Month'] || row.billingMonth || 'October'}
                                </td>
                                <td style={{ padding: '8px 10px', textAlign: 'right', fontWeight: 600 }}>
                                  ₹{Number(row['Monthly Fees'] || row.monthlyFees || 15000).toLocaleString()}
                                </td>
                                <td style={{ padding: '8px 10px', textAlign: 'right' }}>
                                  ₹{Number(row['Transport Fees'] || row.transportFees || 5000).toLocaleString()}
                                </td>
                                <td style={{ padding: '8px 10px', textAlign: 'right' }}>
                                  ₹{Number(row['Co-curricular Fees'] || row.coCurricularFees || 3000).toLocaleString()}
                                </td>
                                <td style={{ padding: '8px 10px', textAlign: 'right' }}>
                                  ₹{Number(row['Term Fees'] || row.termFees || 5000).toLocaleString()}
                                </td>
                                <td style={{ padding: '8px 10px', textAlign: 'right', fontWeight: 800, color: '#0f172a' }}>
                                  ₹{Number(row['Total Fees'] || row.totalFees || 28000).toLocaleString()}
                                </td>
                                <td style={{ padding: '8px 10px', textAlign: 'right', fontWeight: 700, color: '#10b981' }}>
                                  ₹{Number(row['Paid Amount'] || row.paidAmount || 0).toLocaleString()}
                                </td>
                              </>
                            ) : (
                              <>
                                <td style={{ padding: '8px 10px', fontWeight: 700, color: '#1e3a8a' }}>
                                  {row['Staff Name'] || row.staffName || '—'}
                                </td>
                                <td style={{ padding: '8px 10px' }}>
                                  <code>{row['Staff ID'] || row.staffId || '—'}</code>
                                </td>
                                <td style={{ padding: '8px 10px' }}>
                                  {row['Designation'] || row.designation || 'Faculty'}
                                </td>
                                <td style={{ padding: '8px 10px' }}>
                                  {row['Department'] || row.department || 'Academics'}
                                </td>
                                <td style={{ padding: '8px 10px' }}>
                                  {row['Month'] || row.salaryMonth || 'October'} {row['Year'] || row.salaryYear || 2026}
                                </td>
                                <td style={{ padding: '8px 10px', textAlign: 'right', fontWeight: 600 }}>
                                  ₹{Number(row['Basic Salary'] || row.basicSalary || 25000).toLocaleString()}
                                </td>
                                <td style={{ padding: '8px 10px', textAlign: 'right', fontWeight: 700 }}>
                                  ₹{Number(row['Gross Salary'] || row.grossSalary || 35000).toLocaleString()}
                                </td>
                                <td style={{ padding: '8px 10px', textAlign: 'right', color: '#ef4444' }}>
                                  ₹{Number(row['Deductions'] || row.totalDeductions || 2500).toLocaleString()}
                                </td>
                                <td style={{ padding: '8px 10px', textAlign: 'right', fontWeight: 800, color: '#0f172a' }}>
                                  ₹{Number(row['Net Salary'] || row.netSalary || 32500).toLocaleString()}
                                </td>
                                <td style={{ padding: '8px 10px', textAlign: 'right', fontWeight: 700, color: '#10b981' }}>
                                  ₹{Number(row['Paid Amount'] || row.paidAmount || 0).toLocaleString()}
                                </td>
                              </>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '36px', color: '#94a3b8', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                  Please select an Excel (.xlsx / .xls) file above to preview records here.
                </div>
              )}

              {/* Bottom Actions */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px', paddingTop: '12px', borderTop: '1px solid #e2e8f0' }}>
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setBulkImportModal(prev => ({ ...prev, isOpen: false, previewData: [], importedList: [] }))}
                >
                  Close
                </button>

                {bulkImportModal.previewData.length > 0 && (
                  <button
                    type="button"
                    className="btn btn-primary"
                    disabled={bulkImportModal.importing}
                    onClick={handleConfirmBulkImport}
                    style={{ fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                  >
                    <span></span> {bulkImportModal.importing ? 'Importing Records...' : `Confirm & Import ${bulkImportModal.previewData.length} Records`}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* MODAL 7: VIEW EXPENSE DETAILS */}
      {/* =================================================================== */}
      {selectedExpenseForView && (
        <div className="modal-overlay" style={{ display: 'flex', zIndex: 10000 }}>
          <div className="modal-content" style={{ maxWidth: '520px' }}>
            <div className="modal-header">
              <h3>Expense Details - {selectedExpenseForView.expenseId}</h3>
              <button className="modal-close" onClick={() => setSelectedExpenseForView(null)}>&times;</button>
            </div>
            <div style={{ padding: '16px', fontSize: '0.86rem' }}>
              <div style={{ marginBottom: '10px' }}>
                <div style={{ fontSize: '0.74rem', color: '#64748b', textTransform: 'uppercase' }}>Category</div>
                <div style={{ fontWeight: 700, color: '#6366f1' }}>{selectedExpenseForView.expenseCategory}</div>
              </div>

              <div style={{ marginBottom: '10px' }}>
                <div style={{ fontSize: '0.74rem', color: '#64748b', textTransform: 'uppercase' }}>Expense Title</div>
                <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '1rem' }}>{selectedExpenseForView.expenseName}</div>
                {selectedExpenseForView.description && (
                  <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '2px' }}>{selectedExpenseForView.description}</div>
                )}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', background: '#f8fafc', padding: '12px', borderRadius: '8px', marginBottom: '14px' }}>
                <div>Vendor: <strong>{selectedExpenseForView.vendorName}</strong></div>
                <div>Invoice: <strong>{selectedExpenseForView.invoiceNumber || '—'}</strong></div>
                <div>Expense Date: <strong>{selectedExpenseForView.expenseDate}</strong></div>
                <div>Method: <strong>{selectedExpenseForView.paymentMethod}</strong></div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: '#f0fdf4', borderRadius: '6px', fontWeight: 800, fontSize: '0.94rem' }}>
                <span>Amount: ₹{Number(selectedExpenseForView.amount).toLocaleString()}</span>
                <span style={{ color: selectedExpenseForView.pendingAmount > 0 ? '#ef4444' : '#15803d' }}>
                  {selectedExpenseForView.pendingAmount > 0 ? `Pending: ₹${selectedExpenseForView.pendingAmount.toLocaleString()}` : 'Fully Paid'}
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
                <button className="btn btn-outline btn-sm" onClick={() => setSelectedExpenseForView(null)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* MODAL 8: DRILL-DOWN CARD BREAKDOWN MODAL */}
      {/* =================================================================== */}
      {drillDownModal.isOpen && (
        <div className="modal-overlay" style={{ display: 'flex', zIndex: 10000, background: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(3px)' }}>
          <div className="modal-content" style={{ maxWidth: '980px', width: '95%', maxHeight: '90vh', display: 'flex', flexDirection: 'column', borderRadius: '14px', border: `2px solid ${drillDownModal.color}` }}>
            <div className="modal-header" style={{ borderBottom: '1px solid #e2e8f0', padding: '16px 20px', background: '#f8fafc', borderTopLeftRadius: '12px', borderTopRightRadius: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: drillDownModal.color }}></span>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#1e3a8a', fontWeight: 800 }}>
                    {drillDownModal.title}
                  </h3>
                  <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '2px' }}>
                    {drillDownModal.subtitle}
                  </div>
                </div>
              </div>
              <button
                className="modal-close"
                onClick={() => setDrillDownModal({ ...drillDownModal, isOpen: false })}
                style={{ background: 'none', border: 'none', fontSize: '1.4rem', cursor: 'pointer', color: '#64748b' }}
              >
                &times;
              </button>
            </div>

            <div style={{ padding: '20px', overflowY: 'auto', flex: 1 }}>
              {/* Drilldown Content for Student Fees (All or Pending) */}
              {(drillDownModal.type === 'student-fees-all' || drillDownModal.type === 'student-fees-pending') && (() => {
                const list = drillDownModal.type === 'student-fees-pending'
                  ? bills.filter(b => (Number(b.pendingAmount) > 0 || b.paymentStatus !== 'Paid'))
                  : bills;
                const totalAmt = list.reduce((sum, b) => sum + (Number(b.totalFees) || 0), 0);
                const totalPaid = list.reduce((sum, b) => sum + (Number(b.paidAmount) || 0), 0);
                const totalPend = list.reduce((sum, b) => sum + (Number(b.pendingAmount) || 0), 0);

                return (
                  <div>
                    {/* Summary Badges */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', marginBottom: '18px' }}>
                      <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                        <div style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Total Records</div>
                        <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#1e3a8a' }}>{list.length} Students</div>
                      </div>
                      <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                        <div style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Total Invoiced</div>
                        <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#1e3a8a' }}>₹{totalAmt.toLocaleString()}</div>
                      </div>
                      <div style={{ background: '#f0fdf4', padding: '12px', borderRadius: '8px', border: '1px solid #bbf7d0' }}>
                        <div style={{ fontSize: '0.72rem', color: '#16a34a', textTransform: 'uppercase', fontWeight: 700 }}>Total Collected</div>
                        <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#10b981' }}>₹{totalPaid.toLocaleString()}</div>
                      </div>
                      <div style={{ background: '#fef2f2', padding: '12px', borderRadius: '8px', border: '1px solid #fecaca' }}>
                        <div style={{ fontSize: '0.72rem', color: '#dc2626', textTransform: 'uppercase', fontWeight: 700 }}>Total Pending</div>
                        <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#ef4444' }}>₹{totalPend.toLocaleString()}</div>
                      </div>
                    </div>

                    {/* Table */}
                    <div style={{ overflowX: 'auto', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                        <thead>
                          <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', textAlign: 'left' }}>
                            <th style={{ padding: '10px 12px', color: '#475569' }}>Student Name</th>
                            <th style={{ padding: '10px 12px', color: '#475569' }}>Grade & Sec</th>
                            <th style={{ padding: '10px 12px', color: '#475569' }}>Month</th>
                            <th style={{ padding: '10px 12px', textAlign: 'right', color: '#1e3a8a' }}>Total Billed</th>
                            <th style={{ padding: '10px 12px', textAlign: 'right', color: '#10b981' }}>Paid</th>
                            <th style={{ padding: '10px 12px', textAlign: 'right', color: '#ef4444' }}>Pending</th>
                            <th style={{ padding: '10px 12px', textAlign: 'center', color: '#475569' }}>Status</th>
                            <th style={{ padding: '10px 12px', textAlign: 'center', color: '#475569' }}>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {list.map(b => (
                            <tr key={b._id || b.invoiceNumber} style={{ borderBottom: '1px solid #f1f5f9' }}>
                              <td style={{ padding: '10px 12px', fontWeight: 700, color: '#1e3a8a' }}>
                                {b.studentName}
                                <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Roll: {b.rollNo || b.studentId}</div>
                              </td>
                              <td style={{ padding: '10px 12px' }}>{b.grade} - {b.section}</td>
                              <td style={{ padding: '10px 12px' }}>{b.billingMonth}</td>
                              <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 700 }}>₹{Number(b.totalFees).toLocaleString()}</td>
                              <td style={{ padding: '10px 12px', textAlign: 'right', color: '#10b981', fontWeight: 700 }}>₹{Number(b.paidAmount).toLocaleString()}</td>
                              <td style={{ padding: '10px 12px', textAlign: 'right', color: Number(b.pendingAmount) > 0 ? '#ef4444' : '#64748b', fontWeight: 800 }}>
                                ₹{Number(b.pendingAmount).toLocaleString()}
                              </td>
                              <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                                <span style={{
                                  padding: '3px 8px',
                                  borderRadius: '6px',
                                  fontSize: '0.72rem',
                                  fontWeight: 700,
                                  background: b.paymentStatus === 'Paid' ? '#dcfce7' : b.paymentStatus === 'Partially Paid' ? '#fef3c7' : '#fee2e2',
                                  color: b.paymentStatus === 'Paid' ? '#15803d' : b.paymentStatus === 'Partially Paid' ? '#b45309' : '#b91c1c'
                                }}>
                                  {b.paymentStatus}
                                </span>
                              </td>
                              <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                                <button
                                  className="btn btn-sm btn-outline"
                                  onClick={() => {
                                    setDrillDownModal({ ...drillDownModal, isOpen: false });
                                    setSelectedBillForView(b);
                                  }}
                                  style={{ padding: '4px 8px', fontSize: '0.75rem', borderRadius: '4px' }}
                                >
                                  👁️ Invoice
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                );
              })()}

              {/* Drilldown Content for Fees Collected (or Income All) */}
              {(drillDownModal.type === 'fees-collected' || drillDownModal.type === 'income-all') && (() => {
                const paidBills = bills.filter(b => Number(b.paidAmount) > 0);
                const totalCollected = paidBills.reduce((sum, b) => sum + (Number(b.paidAmount) || 0), 0);

                return (
                  <div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginBottom: '18px' }}>
                      <div style={{ background: '#f0fdf4', padding: '12px', borderRadius: '8px', border: '1px solid #bbf7d0' }}>
                        <div style={{ fontSize: '0.72rem', color: '#16a34a', textTransform: 'uppercase', fontWeight: 700 }}>Total Collected Revenue</div>
                        <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#10b981' }}>₹{totalCollected.toLocaleString()}</div>
                      </div>
                      <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                        <div style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Paid Receipts Count</div>
                        <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#1e3a8a' }}>{paidBills.length} Settlements</div>
                      </div>
                    </div>

                    <div style={{ overflowX: 'auto', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                        <thead>
                          <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', textAlign: 'left' }}>
                            <th style={{ padding: '10px 12px', color: '#475569' }}>Student Name</th>
                            <th style={{ padding: '10px 12px', color: '#475569' }}>Invoice #</th>
                            <th style={{ padding: '10px 12px', color: '#475569' }}>Payment Mode</th>
                            <th style={{ padding: '10px 12px', textAlign: 'right', color: '#10b981' }}>Collected Amount</th>
                            <th style={{ padding: '10px 12px', textAlign: 'center', color: '#475569' }}>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {paidBills.map(b => (
                            <tr key={b._id || b.invoiceNumber} style={{ borderBottom: '1px solid #f1f5f9' }}>
                              <td style={{ padding: '10px 12px', fontWeight: 700, color: '#1e3a8a' }}>{b.studentName}</td>
                              <td style={{ padding: '10px 12px' }}>{b.invoiceNumber}</td>
                              <td style={{ padding: '10px 12px' }}>{b.paymentMethod || 'Online / Bank'}</td>
                              <td style={{ padding: '10px 12px', textAlign: 'right', color: '#10b981', fontWeight: 800 }}>₹{Number(b.paidAmount).toLocaleString()}</td>
                              <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                                <span style={{ padding: '3px 8px', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 700, background: '#dcfce7', color: '#15803d' }}>
                                  {b.paymentStatus}
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

              {/* Drilldown Content for Staff Salary (All, Paid, Pending) */}
              {(drillDownModal.type === 'staff-salary-all' || drillDownModal.type === 'staff-salary-paid' || drillDownModal.type === 'staff-salary-pending') && (() => {
                let list = salaries;
                if (drillDownModal.type === 'staff-salary-paid') {
                  list = salaries.filter(s => s.paymentStatus === 'Paid' || Number(s.paidAmount) > 0);
                } else if (drillDownModal.type === 'staff-salary-pending') {
                  list = salaries.filter(s => s.paymentStatus !== 'Paid' || Number(s.pendingAmount) > 0);
                }

                const totalGross = list.reduce((sum, s) => sum + (Number(s.netSalary || s.basicSalary) || 0), 0);
                const totalPaid = list.reduce((sum, s) => sum + (Number(s.paidAmount) || 0), 0);
                const totalPend = list.reduce((sum, s) => sum + (Number(s.pendingAmount) || 0), 0);

                return (
                  <div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', marginBottom: '18px' }}>
                      <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                        <div style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Staff Count</div>
                        <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#1e3a8a' }}>{list.length} Members</div>
                      </div>
                      <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                        <div style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Total Net Salary</div>
                        <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#4f46e5' }}>₹{totalGross.toLocaleString()}</div>
                      </div>
                      <div style={{ background: '#f0fdf4', padding: '12px', borderRadius: '8px', border: '1px solid #bbf7d0' }}>
                        <div style={{ fontSize: '0.72rem', color: '#16a34a', textTransform: 'uppercase', fontWeight: 700 }}>Total Disbursed</div>
                        <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0d9488' }}>₹{totalPaid.toLocaleString()}</div>
                      </div>
                      <div style={{ background: '#fffbeb', padding: '12px', borderRadius: '8px', border: '1px solid #fde68a' }}>
                        <div style={{ fontSize: '0.72rem', color: '#d97706', textTransform: 'uppercase', fontWeight: 700 }}>Total Pending</div>
                        <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#d97706' }}>₹{totalPend.toLocaleString()}</div>
                      </div>
                    </div>

                    <div style={{ overflowX: 'auto', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                        <thead>
                          <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', textAlign: 'left' }}>
                            <th style={{ padding: '10px 12px', color: '#475569' }}>Staff Member</th>
                            <th style={{ padding: '10px 12px', color: '#475569' }}>Role / Dept</th>
                            <th style={{ padding: '10px 12px', color: '#475569' }}>Month</th>
                            <th style={{ padding: '10px 12px', textAlign: 'right', color: '#4f46e5' }}>Net Salary</th>
                            <th style={{ padding: '10px 12px', textAlign: 'right', color: '#0d9488' }}>Paid</th>
                            <th style={{ padding: '10px 12px', textAlign: 'right', color: '#d97706' }}>Pending</th>
                            <th style={{ padding: '10px 12px', textAlign: 'center', color: '#475569' }}>Status</th>
                            <th style={{ padding: '10px 12px', textAlign: 'center', color: '#475569' }}>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {list.map(s => (
                            <tr key={s._id || s.salaryId} style={{ borderBottom: '1px solid #f1f5f9' }}>
                              <td style={{ padding: '10px 12px', fontWeight: 700, color: '#1e3a8a' }}>
                                {s.staffName}
                                <div style={{ fontSize: '0.72rem', color: '#64748b' }}>ID: {s.staffId}</div>
                              </td>
                              <td style={{ padding: '10px 12px' }}>
                                <div>{s.designation}</div>
                                <div style={{ fontSize: '0.72rem', color: '#64748b' }}>{s.department}</div>
                              </td>
                              <td style={{ padding: '10px 12px' }}>{s.salaryMonth} {s.salaryYear}</td>
                              <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 700 }}>₹{Number(s.netSalary || s.basicSalary).toLocaleString()}</td>
                              <td style={{ padding: '10px 12px', textAlign: 'right', color: '#0d9488', fontWeight: 700 }}>₹{Number(s.paidAmount).toLocaleString()}</td>
                              <td style={{ padding: '10px 12px', textAlign: 'right', color: Number(s.pendingAmount) > 0 ? '#d97706' : '#64748b', fontWeight: 800 }}>
                                ₹{Number(s.pendingAmount).toLocaleString()}
                              </td>
                              <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                                <span style={{
                                  padding: '3px 8px',
                                  borderRadius: '6px',
                                  fontSize: '0.72rem',
                                  fontWeight: 700,
                                  background: s.paymentStatus === 'Paid' ? '#dcfce7' : '#fef3c7',
                                  color: s.paymentStatus === 'Paid' ? '#15803d' : '#b45309'
                                }}>
                                  {s.paymentStatus}
                                </span>
                              </td>
                              <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                                <button
                                  className="btn btn-sm btn-outline"
                                  onClick={() => {
                                    setDrillDownModal({ ...drillDownModal, isOpen: false });
                                    setSelectedSalaryForView(s);
                                  }}
                                  style={{ padding: '4px 8px', fontSize: '0.75rem', borderRadius: '4px' }}
                                >
                                  👁️ Payslip
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                );
              })()}

              {/* Drilldown Content for School Expenses */}
              {drillDownModal.type === 'expenses-all' && (() => {
                const totalAmt = expenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
                const totalPaid = expenses.reduce((sum, e) => sum + (Number(e.paidAmount) || 0), 0);
                const totalPend = expenses.reduce((sum, e) => sum + (Number(e.pendingAmount) || 0), 0);

                return (
                  <div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', marginBottom: '18px' }}>
                      <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                        <div style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Total Invoices</div>
                        <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#1e3a8a' }}>{expenses.length} Vouchers</div>
                      </div>
                      <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                        <div style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Total Expense</div>
                        <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#7c3aed' }}>₹{totalAmt.toLocaleString()}</div>
                      </div>
                      <div style={{ background: '#f0fdf4', padding: '12px', borderRadius: '8px', border: '1px solid #bbf7d0' }}>
                        <div style={{ fontSize: '0.72rem', color: '#16a34a', textTransform: 'uppercase', fontWeight: 700 }}>Paid Amount</div>
                        <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#10b981' }}>₹{totalPaid.toLocaleString()}</div>
                      </div>
                      <div style={{ background: '#fef2f2', padding: '12px', borderRadius: '8px', border: '1px solid #fecaca' }}>
                        <div style={{ fontSize: '0.72rem', color: '#dc2626', textTransform: 'uppercase', fontWeight: 700 }}>Pending</div>
                        <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#ef4444' }}>₹{totalPend.toLocaleString()}</div>
                      </div>
                    </div>

                    <div style={{ overflowX: 'auto', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                        <thead>
                          <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', textAlign: 'left' }}>
                            <th style={{ padding: '10px 12px', color: '#475569' }}>Expense & Vendor</th>
                            <th style={{ padding: '10px 12px', color: '#475569' }}>Category</th>
                            <th style={{ padding: '10px 12px', color: '#475569' }}>Date</th>
                            <th style={{ padding: '10px 12px', textAlign: 'right', color: '#7c3aed' }}>Amount</th>
                            <th style={{ padding: '10px 12px', textAlign: 'right', color: '#10b981' }}>Paid</th>
                            <th style={{ padding: '10px 12px', textAlign: 'right', color: '#ef4444' }}>Pending</th>
                            <th style={{ padding: '10px 12px', textAlign: 'center', color: '#475569' }}>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {expenses.map(e => (
                            <tr key={e._id || e.expenseId} style={{ borderBottom: '1px solid #f1f5f9' }}>
                              <td style={{ padding: '10px 12px', fontWeight: 700, color: '#1e3a8a' }}>
                                {e.expenseName}
                                <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Vendor: {e.vendorName}</div>
                              </td>
                              <td style={{ padding: '10px 12px', color: '#6366f1', fontWeight: 600 }}>{e.expenseCategory}</td>
                              <td style={{ padding: '10px 12px' }}>{e.expenseDate}</td>
                              <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 700 }}>₹{Number(e.amount).toLocaleString()}</td>
                              <td style={{ padding: '10px 12px', textAlign: 'right', color: '#10b981', fontWeight: 700 }}>₹{Number(e.paidAmount).toLocaleString()}</td>
                              <td style={{ padding: '10px 12px', textAlign: 'right', color: Number(e.pendingAmount) > 0 ? '#ef4444' : '#64748b', fontWeight: 800 }}>
                                ₹{Number(e.pendingAmount).toLocaleString()}
                              </td>
                              <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                                <span style={{
                                  padding: '3px 8px',
                                  borderRadius: '6px',
                                  fontSize: '0.72rem',
                                  fontWeight: 700,
                                  background: e.paymentStatus === 'Paid' ? '#dcfce7' : '#fee2e2',
                                  color: e.paymentStatus === 'Paid' ? '#15803d' : '#b91c1c'
                                }}>
                                  {e.paymentStatus}
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

              {/* Drilldown Content for Combined Outstanding */}
              {drillDownModal.type === 'outstanding-all' && (() => {
                const pendingBills = bills.filter(b => Number(b.pendingAmount) > 0);
                const pendingSal = salaries.filter(s => Number(s.pendingAmount) > 0);
                const pendingExp = expenses.filter(e => Number(e.pendingAmount) > 0);

                const billPending = pendingBills.reduce((sum, b) => sum + (Number(b.pendingAmount) || 0), 0);
                const salPending = pendingSal.reduce((sum, s) => sum + (Number(s.pendingAmount) || 0), 0);
                const expPending = pendingExp.reduce((sum, e) => sum + (Number(e.pendingAmount) || 0), 0);

                return (
                  <div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', marginBottom: '20px' }}>
                      <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '10px', padding: '14px' }}>
                        <div style={{ fontSize: '0.74rem', color: '#dc2626', fontWeight: 700, textTransform: 'uppercase' }}>Student Fee Dues (Receivable)</div>
                        <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ef4444', marginTop: '4px' }}>₹{billPending.toLocaleString()}</div>
                        <div style={{ fontSize: '0.76rem', color: '#64748b', marginTop: '2px' }}>{pendingBills.length} students with pending dues</div>
                      </div>
                      <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '10px', padding: '14px' }}>
                        <div style={{ fontSize: '0.74rem', color: '#d97706', fontWeight: 700, textTransform: 'uppercase' }}>Staff Salary Dues (Payable)</div>
                        <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#d97706', marginTop: '4px' }}>₹{salPending.toLocaleString()}</div>
                        <div style={{ fontSize: '0.76rem', color: '#64748b', marginTop: '2px' }}>{pendingSal.length} staff awaiting payment</div>
                      </div>
                      <div style={{ background: '#f5f3ff', border: '1px solid #ddd6fe', borderRadius: '10px', padding: '14px' }}>
                        <div style={{ fontSize: '0.74rem', color: '#7c3aed', fontWeight: 700, textTransform: 'uppercase' }}>Vendor Bill Dues (Payable)</div>
                        <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#7c3aed', marginTop: '4px' }}>₹{expPending.toLocaleString()}</div>
                        <div style={{ fontSize: '0.76rem', color: '#64748b', marginTop: '2px' }}>{pendingExp.length} unpaid supplier invoices</div>
                      </div>
                    </div>

                    <h4 style={{ margin: '0 0 10px', fontSize: '0.92rem', color: '#1e3a8a' }}>Top Pending Student Balances:</h4>
                    <div style={{ overflowX: 'auto', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                        <thead>
                          <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', textAlign: 'left' }}>
                            <th style={{ padding: '8px 12px', color: '#475569' }}>Student</th>
                            <th style={{ padding: '8px 12px', color: '#475569' }}>Class</th>
                            <th style={{ padding: '8px 12px', textAlign: 'right', color: '#ef4444' }}>Pending Balance</th>
                            <th style={{ padding: '8px 12px', color: '#475569' }}>Due Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          {pendingBills.slice(0, 5).map(b => (
                            <tr key={b._id || b.invoiceNumber} style={{ borderBottom: '1px solid #f1f5f9' }}>
                              <td style={{ padding: '8px 12px', fontWeight: 700, color: '#1e3a8a' }}>{b.studentName}</td>
                              <td style={{ padding: '8px 12px' }}>{b.grade} - {b.section}</td>
                              <td style={{ padding: '8px 12px', textAlign: 'right', color: '#ef4444', fontWeight: 800 }}>₹{Number(b.pendingAmount).toLocaleString()}</td>
                              <td style={{ padding: '8px 12px' }}>{b.dueDate}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Bottom Actions */}
            <div style={{ padding: '14px 20px', borderTop: '1px solid #e2e8f0', background: '#f8fafc', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottomLeftRadius: '12px', borderBottomRightRadius: '12px' }}>
              {drillDownModal.targetTab && (
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => {
                    setSubTab(drillDownModal.targetTab);
                    setDrillDownModal({ ...drillDownModal, isOpen: false });
                  }}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: 700 }}
                >
                  <span>Go to Full Module &rarr;</span>
                </button>
              )}
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => setDrillDownModal({ ...drillDownModal, isOpen: false })}
                style={{ marginLeft: 'auto', borderRadius: '8px', fontSize: '0.86rem' }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
