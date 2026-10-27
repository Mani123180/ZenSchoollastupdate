const StudentBill = require('../models/StudentBill');
const StaffSalary = require('../models/StaffSalary');
const SchoolExpense = require('../models/SchoolExpense');
const PaymentHistory = require('../models/PaymentHistory');
const { getDBStatus } = require('../config/db');

// In-memory fallback stores if MongoDB is not running or disconnected
let memoryStudentBills = [
  {
    _id: 'bill_001',
    invoiceNumber: 'INV-2026-001',
    schoolId: 'SCHOOL002',
    studentId: 'S101',
    studentName: 'Aishwarya Kumar',
    admissionNumber: 'ADM-2024-101',
    rollNo: 'S101',
    grade: 'Grade 10',
    section: 'A',
    academicYear: '2026-2027',
    billingMonth: 'October',
    billingDate: '2026-10-01',
    dueDate: '2026-10-15',
    feeItems: [
      { feeType: 'Monthly Fees', description: 'Tuition Fee Oct 2026', amount: 15000, discount: 0, fine: 0, netAmount: 15000 },
      { feeType: 'Transport Fees', description: 'School Bus Route #2', amount: 5000, discount: 0, fine: 0, netAmount: 5000 },
      { feeType: 'Co-curricular Fees', description: 'Sports & Coding Club', amount: 3000, discount: 0, fine: 0, netAmount: 3000 },
      { feeType: 'Term Fees', description: 'Term 1 Exam & Library Assessment', amount: 5000, discount: 0, fine: 0, netAmount: 5000 }
    ],
    totalFees: 28000,
    paidAmount: 28000,
    pendingAmount: 0,
    paymentStatus: 'Paid',
    paymentMethod: 'UPI / NetBanking',
    parentName: 'Ramesh Kumar',
    parentPhone: '+91 98456 12301',
    remarks: 'Full term fee settled on time'
  },
  {
    _id: 'bill_002',
    invoiceNumber: 'INV-2026-002',
    schoolId: 'SCHOOL002',
    studentId: 'S102',
    studentName: 'Kavitha Selvam',
    admissionNumber: 'ADM-2024-102',
    rollNo: 'S102',
    grade: 'Grade 10',
    section: 'A',
    academicYear: '2026-2027',
    billingMonth: 'October',
    billingDate: '2026-10-01',
    dueDate: '2026-10-15',
    feeItems: [
      { feeType: 'Monthly Fees', description: 'Tuition Fee Oct 2026', amount: 15000, discount: 2000, fine: 0, netAmount: 13000 },
      { feeType: 'Transport Fees', description: 'School Bus Route #4', amount: 5000, discount: 0, fine: 0, netAmount: 5000 },
      { feeType: 'Co-curricular Fees', description: 'Music & Arts Lab', amount: 3000, discount: 0, fine: 0, netAmount: 3000 },
      { feeType: 'Term Fees', description: 'Term 1 Evaluation', amount: 5000, discount: 0, fine: 0, netAmount: 5000 }
    ],
    totalFees: 26000,
    paidAmount: 16000,
    pendingAmount: 10000,
    paymentStatus: 'Partially Paid',
    paymentMethod: 'Bank Transfer',
    parentName: 'Selvam Murugan',
    parentPhone: '+91 98456 12302',
    remarks: 'Balance promised next week'
  },
  {
    _id: 'bill_003',
    invoiceNumber: 'INV-2026-003',
    schoolId: 'SCHOOL002',
    studentId: 'S103',
    studentName: 'Sandhya Ramesh',
    admissionNumber: 'ADM-2024-103',
    rollNo: 'S103',
    grade: 'Grade 10',
    section: 'A',
    academicYear: '2026-2027',
    billingMonth: 'October',
    billingDate: '2026-10-01',
    dueDate: '2026-10-10',
    feeItems: [
      { feeType: 'Monthly Fees', description: 'Tuition Fee Oct 2026', amount: 15000, discount: 0, fine: 500, netAmount: 15500 },
      { feeType: 'Transport Fees', description: 'School Bus Route #1', amount: 5000, discount: 0, fine: 0, netAmount: 5000 },
      { feeType: 'Co-curricular Fees', description: 'Robotics Workshop', amount: 3000, discount: 0, fine: 0, netAmount: 3000 },
      { feeType: 'Term Fees', description: 'Term 1 Exam Fee', amount: 5000, discount: 0, fine: 0, netAmount: 5000 }
    ],
    totalFees: 28500,
    paidAmount: 0,
    pendingAmount: 28500,
    paymentStatus: 'Overdue',
    paymentMethod: 'Pending',
    parentName: 'Ramesh Krishnan',
    parentPhone: '+91 98456 12303',
    remarks: 'Due date lapsed; reminder SMS dispatched'
  },
  {
    _id: 'bill_004',
    invoiceNumber: 'INV-2026-004',
    schoolId: 'SCHOOL002',
    studentId: 'S104',
    studentName: 'Deepa Venkatesh',
    admissionNumber: 'ADM-2024-104',
    rollNo: 'S104',
    grade: 'Grade 10',
    section: 'A',
    academicYear: '2026-2027',
    billingMonth: 'October',
    billingDate: '2026-10-01',
    dueDate: '2026-10-20',
    feeItems: [
      { feeType: 'Monthly Fees', description: 'Tuition Fee Oct 2026', amount: 15000, discount: 0, fine: 0, netAmount: 15000 },
      { feeType: 'Transport Fees', description: 'School Bus Route #3', amount: 5000, discount: 0, fine: 0, netAmount: 5000 },
      { feeType: 'Co-curricular Fees', description: 'Chess Academy', amount: 3000, discount: 0, fine: 0, netAmount: 3000 },
      { feeType: 'Term Fees', description: 'Term 1 Exam', amount: 5000, discount: 0, fine: 0, netAmount: 5000 }
    ],
    totalFees: 28000,
    paidAmount: 28000,
    pendingAmount: 0,
    paymentStatus: 'Paid',
    paymentMethod: 'Cash',
    parentName: 'Venkatesh S.',
    parentPhone: '+91 98456 12304',
    remarks: 'Receipt #5512 generated'
  },
  {
    _id: 'bill_005',
    invoiceNumber: 'INV-2026-005',
    schoolId: 'SCHOOL002',
    studentId: 'S105',
    studentName: 'Meena Natarajan',
    admissionNumber: 'ADM-2024-105',
    rollNo: 'S105',
    grade: 'Grade 10',
    section: 'A',
    academicYear: '2026-2027',
    billingMonth: 'October',
    billingDate: '2026-10-01',
    dueDate: '2026-10-15',
    feeItems: [
      { feeType: 'Monthly Fees', description: 'Tuition Fee Oct 2026', amount: 15000, discount: 0, fine: 0, netAmount: 15000 },
      { feeType: 'Transport Fees', description: 'Self Commute', amount: 0, discount: 0, fine: 0, netAmount: 0 },
      { feeType: 'Co-curricular Fees', description: 'Athletics & Sports', amount: 3000, discount: 0, fine: 0, netAmount: 3000 },
      { feeType: 'Term Fees', description: 'Term 1 Evaluation', amount: 5000, discount: 0, fine: 0, netAmount: 5000 }
    ],
    totalFees: 23000,
    paidAmount: 11500,
    pendingAmount: 11500,
    paymentStatus: 'Partially Paid',
    paymentMethod: 'UPI / NetBanking',
    parentName: 'Natarajan M.',
    parentPhone: '+91 98456 12305',
    remarks: 'First installment cleared'
  },
  {
    _id: 'bill_006',
    invoiceNumber: 'INV-2026-006',
    schoolId: 'SCHOOL002',
    studentId: 'S106',
    studentName: 'Pooja Sundaram',
    admissionNumber: 'ADM-2024-106',
    rollNo: 'S106',
    grade: 'Grade 10',
    section: 'B',
    academicYear: '2026-2027',
    billingMonth: 'October',
    billingDate: '2026-10-01',
    dueDate: '2026-10-15',
    feeItems: [
      { feeType: 'Monthly Fees', description: 'Tuition Fee Oct 2026', amount: 15000, discount: 0, fine: 0, netAmount: 15000 },
      { feeType: 'Transport Fees', description: 'School Bus Route #5', amount: 5000, discount: 0, fine: 0, netAmount: 5000 },
      { feeType: 'Co-curricular Fees', description: 'Robotics Workshop', amount: 3000, discount: 0, fine: 0, netAmount: 3000 },
      { feeType: 'Term Fees', description: 'Term 1 Evaluation', amount: 5000, discount: 0, fine: 0, netAmount: 5000 }
    ],
    totalFees: 28000,
    paidAmount: 28000,
    pendingAmount: 0,
    paymentStatus: 'Paid',
    paymentMethod: 'Cash',
    parentName: 'Sundaram P.',
    parentPhone: '+91 98456 12306',
    remarks: 'All fees cleared'
  },
  {
    _id: 'bill_007',
    invoiceNumber: 'INV-2026-007',
    schoolId: 'SCHOOL002',
    studentId: 'S107',
    studentName: 'Swathi Rajesh',
    admissionNumber: 'ADM-2024-107',
    rollNo: 'S107',
    grade: 'Grade 10',
    section: 'B',
    academicYear: '2026-2027',
    billingMonth: 'October',
    billingDate: '2026-10-01',
    dueDate: '2026-10-15',
    feeItems: [
      { feeType: 'Monthly Fees', description: 'Tuition Fee Oct 2026', amount: 15000, discount: 0, fine: 0, netAmount: 15000 },
      { feeType: 'Transport Fees', description: 'School Bus Route #2', amount: 5000, discount: 0, fine: 0, netAmount: 5000 },
      { feeType: 'Co-curricular Fees', description: 'Dance & Arts', amount: 3000, discount: 0, fine: 0, netAmount: 3000 },
      { feeType: 'Term Fees', description: 'Term 1 Assessment', amount: 5000, discount: 0, fine: 0, netAmount: 5000 }
    ],
    totalFees: 28000,
    paidAmount: 20000,
    pendingAmount: 8000,
    paymentStatus: 'Partially Paid',
    paymentMethod: 'Bank Transfer',
    parentName: 'Rajesh K.',
    parentPhone: '+91 98456 12307',
    remarks: 'Pending ₹8,000 balance'
  },
  {
    _id: 'bill_008',
    invoiceNumber: 'INV-2026-008',
    schoolId: 'SCHOOL002',
    studentId: 'S108',
    studentName: 'Bhavani Chandran',
    admissionNumber: 'ADM-2024-108',
    rollNo: 'S108',
    grade: 'Grade 9',
    section: 'A',
    academicYear: '2026-2027',
    billingMonth: 'October',
    billingDate: '2026-10-01',
    dueDate: '2026-10-15',
    feeItems: [
      { feeType: 'Monthly Fees', description: 'Tuition Fee Oct 2026', amount: 14000, discount: 0, fine: 0, netAmount: 14000 },
      { feeType: 'Transport Fees', description: 'School Bus Route #1', amount: 4000, discount: 0, fine: 0, netAmount: 4000 },
      { feeType: 'Co-curricular Fees', description: 'Sports Club', amount: 3000, discount: 0, fine: 0, netAmount: 3000 },
      { feeType: 'Term Fees', description: 'Term 1 Exam', amount: 5000, discount: 0, fine: 0, netAmount: 5000 }
    ],
    totalFees: 26000,
    paidAmount: 26000,
    pendingAmount: 0,
    paymentStatus: 'Paid',
    paymentMethod: 'UPI / NetBanking',
    parentName: 'Chandran M.',
    parentPhone: '+91 98456 12308',
    remarks: 'Paid in full'
  }
];

let memoryStaffSalaries = [
  // Teaching Staff
  {
    _id: 'sal_001',
    salarySlipNo: 'SLIP-2026-10-01',
    schoolId: 'SCHOOL002',
    staffId: 'T01',
    staffName: 'Mrs. Priya Krishnan',
    staffType: 'Teaching',
    designation: 'Senior Mathematics Teacher',
    department: 'Mathematics',
    salaryMonth: 'October',
    salaryYear: 2026,
    basicSalary: 35000,
    hra: 12000,
    allowances: 5000,
    bonus: 2000,
    incentives: 1000,
    pf: 4200,
    esi: 1200,
    otherDeductions: 0,
    salaryAdvance: 0,
    grossSalary: 55000,
    totalDeductions: 5400,
    netSalary: 49600,
    paidAmount: 49600,
    pendingAmount: 0,
    paymentStatus: 'Paid',
    paymentDate: '2026-10-25',
    paymentMethod: 'Bank Transfer',
    bankAccountNo: 'HDFC-XXXX8921',
    remarks: 'Credited directly via NEFT'
  },
  {
    _id: 'sal_002',
    salarySlipNo: 'SLIP-2026-10-02',
    schoolId: 'SCHOOL002',
    staffId: 'T02',
    staffName: 'Dr. Anandhi Rajan',
    staffType: 'Teaching',
    designation: 'HOD Physics & STEM Lab',
    department: 'Science',
    salaryMonth: 'October',
    salaryYear: 2026,
    basicSalary: 42000,
    hra: 15000,
    allowances: 6000,
    bonus: 0,
    incentives: 2000,
    pf: 5040,
    esi: 1500,
    otherDeductions: 1000,
    salaryAdvance: 5000,
    grossSalary: 65000,
    totalDeductions: 12540,
    netSalary: 52460,
    paidAmount: 52460,
    pendingAmount: 0,
    paymentStatus: 'Paid',
    paymentDate: '2026-10-25',
    paymentMethod: 'Bank Transfer',
    bankAccountNo: 'SBI-XXXX4419',
    remarks: 'Adjusted with advance'
  },
  {
    _id: 'sal_003',
    salarySlipNo: 'SLIP-2026-10-03',
    schoolId: 'SCHOOL002',
    staffId: 'T03',
    staffName: 'Mrs. Selvi Murugan',
    staffType: 'Teaching',
    designation: 'Faculty Chemistry',
    department: 'Science',
    salaryMonth: 'October',
    salaryYear: 2026,
    basicSalary: 32000,
    hra: 10000,
    allowances: 4000,
    bonus: 0,
    incentives: 0,
    pf: 3840,
    esi: 1100,
    otherDeductions: 0,
    salaryAdvance: 0,
    grossSalary: 46000,
    totalDeductions: 4940,
    netSalary: 41060,
    paidAmount: 0,
    pendingAmount: 41060,
    paymentStatus: 'Pending',
    paymentDate: '',
    paymentMethod: 'Bank Transfer',
    bankAccountNo: 'ICICI-XXXX7821',
    remarks: 'Awaiting end of month payroll batch run'
  },

  // Non-Teaching Staff (Transport Drivers, Cleaning Workers, Hostel Wardens)
  {
    _id: 'sal_nt_001',
    salarySlipNo: 'SLIP-2026-10-04',
    schoolId: 'SCHOOL002',
    staffId: 'NT-DRV-01',
    staffName: 'Mr. Muthu Velu',
    staffType: 'Non-Teaching',
    designation: 'Transport Driver',
    department: 'Transport & Fleet',
    salaryMonth: 'October',
    salaryYear: 2026,
    basicSalary: 18000,
    hra: 4500,
    allowances: 3500,
    bonus: 1000,
    incentives: 500,
    pf: 2160,
    esi: 650,
    otherDeductions: 0,
    salaryAdvance: 0,
    grossSalary: 27500,
    totalDeductions: 2810,
    netSalary: 24690,
    paidAmount: 24690,
    pendingAmount: 0,
    paymentStatus: 'Paid',
    paymentDate: '2026-10-25',
    paymentMethod: 'Bank Transfer',
    bankAccountNo: 'IOB-XXXX3312',
    remarks: 'Bus Route 2 & 4 senior driver'
  },
  {
    _id: 'sal_nt_002',
    salarySlipNo: 'SLIP-2026-10-05',
    schoolId: 'SCHOOL002',
    staffId: 'NT-CLN-01',
    staffName: 'Mrs. Lakshmi Ammal',
    staffType: 'Non-Teaching',
    designation: 'Cleaning Worker',
    department: 'Housekeeping & Sanitation',
    salaryMonth: 'October',
    salaryYear: 2026,
    basicSalary: 14000,
    hra: 3500,
    allowances: 2000,
    bonus: 500,
    incentives: 0,
    pf: 1680,
    esi: 500,
    otherDeductions: 0,
    salaryAdvance: 0,
    grossSalary: 20000,
    totalDeductions: 2180,
    netSalary: 17820,
    paidAmount: 17820,
    pendingAmount: 0,
    paymentStatus: 'Paid',
    paymentDate: '2026-10-25',
    paymentMethod: 'Cash',
    bankAccountNo: 'Cash Disbursement',
    remarks: 'Main academic block sanitation'
  },
  {
    _id: 'sal_nt_003',
    salarySlipNo: 'SLIP-2026-10-06',
    schoolId: 'SCHOOL002',
    staffId: 'NT-WRD-01',
    staffName: 'Mrs. Jayanthi Ramanathan',
    staffType: 'Non-Teaching',
    designation: 'Hostel Warden',
    department: 'Hostel Administration',
    salaryMonth: 'October',
    salaryYear: 2026,
    basicSalary: 22000,
    hra: 6000,
    allowances: 4000,
    bonus: 1000,
    incentives: 0,
    pf: 2640,
    esi: 800,
    otherDeductions: 0,
    salaryAdvance: 2000,
    grossSalary: 33000,
    totalDeductions: 5440,
    netSalary: 27560,
    paidAmount: 0,
    pendingAmount: 27560,
    paymentStatus: 'Pending',
    paymentDate: '',
    paymentMethod: 'Bank Transfer',
    bankAccountNo: 'SBI-XXXX9920',
    remarks: 'Girls Hostel Warden in-charge'
  }
];

let memoryExpenses = [
  {
    _id: 'exp_001',
    expenseId: 'EXP-2026-001',
    schoolId: 'SCHOOL002',
    expenseCategory: 'Electricity and Utilities',
    expenseName: 'Monthly Campus Electricity Bill',
    description: 'TNEB Main School Campus & Science Labs HT Meter',
    vendorName: 'Tamil Nadu Electricity Board (TANGEDCO)',
    invoiceNumber: 'EB-OCT-88912',
    expenseDate: '2026-10-10',
    amount: 34500,
    paidAmount: 34500,
    pendingAmount: 0,
    paymentMethod: 'UPI / NetBanking',
    paymentStatus: 'Paid',
    paymentDate: '2026-10-12',
    remarks: 'Paid on official electricity portal'
  },
  {
    _id: 'exp_002',
    expenseId: 'EXP-2026-002',
    schoolId: 'SCHOOL002',
    expenseCategory: 'Transport',
    expenseName: 'School Bus Fleet Fuel',
    description: 'Diesel for Buses 1, 2, 3 and 4',
    vendorName: 'Bharat Petroleum Fuels Station',
    invoiceNumber: 'BPCL-99231',
    expenseDate: '2026-10-18',
    amount: 22000,
    paidAmount: 22000,
    pendingAmount: 0,
    paymentMethod: 'Bank Transfer',
    paymentStatus: 'Paid',
    paymentDate: '2026-10-19',
    remarks: 'Fuel slips verified with vehicle logbooks'
  },
  {
    _id: 'exp_003',
    expenseId: 'EXP-2026-003',
    schoolId: 'SCHOOL002',
    expenseCategory: 'Maintenance',
    expenseName: 'Computer Lab AC Servicing & Filter Replacement',
    description: 'Annual Maintenance Contract quarterly check for 6 AC units',
    vendorName: 'Cooltech Climate Engineers',
    invoiceNumber: 'COOL-2026-44',
    expenseDate: '2026-10-22',
    amount: 14500,
    paidAmount: 5000,
    pendingAmount: 9500,
    paymentMethod: 'Cheque',
    paymentStatus: 'Partially Paid',
    paymentDate: '2026-10-22',
    remarks: 'Advance paid; balance payable upon test certificate'
  },
  {
    _id: 'exp_004',
    expenseId: 'EXP-2026-004',
    schoolId: 'SCHOOL002',
    expenseCategory: 'Office Expenses',
    expenseName: 'Examination Answer Booklets & Printing Supplies',
    description: '5000 Answer sheets and stationery',
    vendorName: 'Sri Balaji Printers & Stationers',
    invoiceNumber: 'SBP-8812',
    expenseDate: '2026-10-24',
    amount: 18000,
    paidAmount: 0,
    pendingAmount: 18000,
    paymentMethod: 'Bank Transfer',
    paymentStatus: 'Pending',
    paymentDate: '',
    remarks: 'Invoice approved; payment due by next Friday'
  }
];

let memoryPaymentHistory = [
  {
    _id: 'pay_001',
    transactionId: 'TXN-2026-1001',
    schoolId: 'SCHOOL002',
    transactionDate: '2026-10-02',
    transactionType: 'Student Fee Payment',
    referenceId: 'bill_001',
    invoiceNumber: 'INV-2026-001',
    partyName: 'Aishwarya Kumar',
    partyRole: 'Student',
    amount: 28000,
    paymentMethod: 'UPI / NetBanking',
    paymentStatus: 'Completed',
    remarks: 'Term 1 fee full payment online',
    recordedBy: 'Finance Desk'
  },
  {
    _id: 'pay_002',
    transactionId: 'TXN-2026-1002',
    schoolId: 'SCHOOL002',
    transactionDate: '2026-10-05',
    transactionType: 'Student Fee Payment',
    referenceId: 'bill_002',
    invoiceNumber: 'INV-2026-002',
    partyName: 'Kavitha Selvam',
    partyRole: 'Student',
    amount: 18000,
    paymentMethod: 'Bank Transfer',
    paymentStatus: 'Completed',
    remarks: 'Part payment received via IMPS',
    recordedBy: 'Finance Desk'
  },
  {
    _id: 'pay_003',
    transactionId: 'TXN-2026-1003',
    schoolId: 'SCHOOL002',
    transactionDate: '2026-10-12',
    transactionType: 'School Expense Payment',
    referenceId: 'exp_001',
    invoiceNumber: 'EB-OCT-88912',
    partyName: 'Tamil Nadu Electricity Board (TANGEDCO)',
    partyRole: 'Vendor',
    amount: 34500,
    paymentMethod: 'UPI / NetBanking',
    paymentStatus: 'Completed',
    remarks: 'Electricity bill payment for Oct',
    recordedBy: 'Accounts Officer'
  },
  {
    _id: 'pay_004',
    transactionId: 'TXN-2026-1004',
    schoolId: 'SCHOOL002',
    transactionDate: '2026-10-19',
    transactionType: 'School Expense Payment',
    referenceId: 'exp_002',
    invoiceNumber: 'BPCL-99231',
    partyName: 'Bharat Petroleum Fuels Station',
    partyRole: 'Vendor',
    amount: 22000,
    paymentMethod: 'Bank Transfer',
    paymentStatus: 'Completed',
    remarks: 'Bus fleet diesel invoice settled',
    recordedBy: 'Accounts Officer'
  },
  {
    _id: 'pay_005',
    transactionId: 'TXN-2026-1005',
    schoolId: 'SCHOOL002',
    transactionDate: '2026-10-25',
    transactionType: 'Staff Salary Payment',
    referenceId: 'sal_001',
    invoiceNumber: 'SLIP-2026-10-01',
    partyName: 'Mrs. Priya Krishnan',
    partyRole: 'Staff',
    amount: 49600,
    paymentMethod: 'Bank Transfer',
    paymentStatus: 'Completed',
    remarks: 'Salary disbursement for October 2026',
    recordedBy: 'Payroll Officer'
  },
  {
    _id: 'pay_006',
    transactionId: 'TXN-2026-1006',
    schoolId: 'SCHOOL002',
    transactionDate: '2026-10-25',
    transactionType: 'Staff Salary Payment',
    referenceId: 'sal_002',
    invoiceNumber: 'SLIP-2026-10-02',
    partyName: 'Dr. Anandhi Rajan',
    partyRole: 'Staff',
    amount: 52460,
    paymentMethod: 'Bank Transfer',
    paymentStatus: 'Completed',
    remarks: 'Salary disbursement for October 2026',
    recordedBy: 'Payroll Officer'
  }
];

// Helper to determine payment status of a bill
const calculateBillStatus = (totalFees, paidAmount, dueDate) => {
  if (paidAmount >= totalFees) return 'Paid';
  if (paidAmount > 0 && paidAmount < totalFees) return 'Partially Paid';
  if (dueDate) {
    const dueTime = new Date(dueDate).getTime();
    const nowTime = new Date().getTime();
    if (!isNaN(dueTime) && nowTime > dueTime && paidAmount < totalFees) {
      return 'Overdue';
    }
  }
  return 'Unpaid';
};

// ==========================================
// 1. DASHBOARD OVERVIEW & METRICS
// ==========================================
exports.getDashboardSummary = async (req, res) => {
  try {
    const { academicYear, month, class: gradeFilter, section: secFilter } = req.query;
    const isMongo = getDBStatus();

    let studentBills = [];
    let staffSalaries = [];
    let expenses = [];
    let payments = [];

    if (isMongo) {
      studentBills = await StudentBill.find({});
      staffSalaries = await StaffSalary.find({});
      expenses = await SchoolExpense.find({});
      payments = await PaymentHistory.find({}).sort({ transactionDate: -1 });
    } else {
      studentBills = [...memoryStudentBills];
      staffSalaries = [...memoryStaffSalaries];
      expenses = [...memoryExpenses];
      payments = [...memoryPaymentHistory];
    }

    // Apply filters if passed
    if (academicYear && academicYear !== 'All') {
      studentBills = studentBills.filter(b => b.academicYear === academicYear);
    }
    if (month && month !== 'All') {
      studentBills = studentBills.filter(b => b.billingMonth === month);
      staffSalaries = staffSalaries.filter(s => s.salaryMonth === month);
    }
    if (gradeFilter && gradeFilter !== 'All') {
      studentBills = studentBills.filter(b => (b.grade || '').includes(gradeFilter));
    }
    if (secFilter && secFilter !== 'All') {
      studentBills = studentBills.filter(b => b.section === secFilter);
    }

    // Aggregations
    const totalStudentFees = studentBills.reduce((acc, b) => acc + (Number(b.totalFees) || 0), 0);
    const totalFeesCollected = studentBills.reduce((acc, b) => acc + (Number(b.paidAmount) || 0), 0);
    const totalPendingStudentFees = studentBills.reduce((acc, b) => acc + (Number(b.pendingAmount) || 0), 0);

    const totalStaffSalary = staffSalaries.reduce((acc, s) => acc + (Number(s.netSalary) || 0), 0);
    const totalSalaryPaid = staffSalaries.reduce((acc, s) => acc + (Number(s.paidAmount) || 0), 0);
    const totalSalaryPending = staffSalaries.reduce((acc, s) => acc + (Number(s.pendingAmount) || 0), 0);

    const totalSchoolExpenses = expenses.reduce((acc, e) => acc + (Number(e.amount) || 0), 0);
    const totalExpensesPaid = expenses.reduce((acc, e) => acc + (Number(e.paidAmount) || 0), 0);
    const totalExpensesPending = expenses.reduce((acc, e) => acc + (Number(e.pendingAmount) || 0), 0);

    const totalIncome = totalFeesCollected;
    const totalOutstandingPayments = totalPendingStudentFees + totalSalaryPending + totalExpensesPending;

    // Monthly Trends for Charts
    const months = ['June', 'July', 'August', 'September', 'October', 'November'];
    const monthlyIncomeData = months.map(m => {
      const matchBills = studentBills.filter(b => b.billingMonth === m);
      return { month: m, amount: matchBills.reduce((sum, b) => sum + (Number(b.paidAmount) || 0), 0) || (m === 'October' ? totalFeesCollected : 320000) };
    });

    const monthlyExpensesData = months.map(m => {
      const matchSal = staffSalaries.filter(s => s.salaryMonth === m).reduce((sum, s) => sum + (Number(s.paidAmount) || 0), 0);
      return { month: m, salary: matchSal || (m === 'October' ? totalSalaryPaid : 140000), expenses: m === 'October' ? totalExpensesPaid : 75000 };
    });

    // Expenses Breakdown By Category
    const categoryTotals = {};
    expenses.forEach(e => {
      const cat = e.expenseCategory || 'Other Expenses';
      categoryTotals[cat] = (categoryTotals[cat] || 0) + (Number(e.amount) || 0);
    });

    res.json({
      success: true,
      summary: {
        totalStudentFees,
        totalFeesCollected,
        totalPendingStudentFees,
        totalStaffSalary,
        totalSalaryPaid,
        totalSalaryPending,
        totalSchoolExpenses,
        totalExpensesPaid,
        totalExpensesPending,
        totalIncome,
        totalOutstandingPayments,
        counts: {
          billsCount: studentBills.length,
          salaryCount: staffSalaries.length,
          expenseCount: expenses.length,
          transactionsCount: payments.length
        }
      },
      charts: {
        monthlyIncomeData,
        monthlyExpensesData,
        categoryTotals
      },
      recentTransactions: payments.slice(0, 5)
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// 2. STUDENT BILLING CRUD & PAYMENT
// ==========================================
exports.getStudentBills = async (req, res) => {
  try {
    const isMongo = getDBStatus();
    let bills = isMongo ? await StudentBill.find({}).sort({ createdAt: -1 }) : memoryStudentBills;

    const userRole = req.user?.role;
    const { studentId, rollNo, grade } = req.query;

    if (studentId) {
      bills = bills.filter(b => b.studentId === studentId || b.rollNo === studentId);
    } else if (rollNo) {
      bills = bills.filter(b => b.rollNo === rollNo || b.studentId === rollNo);
    }

    if (grade && grade !== 'All') {
      bills = bills.filter(b => (b.grade || '').toLowerCase().includes(grade.toLowerCase()));
    }

    // Role-specific auto-filtering if logged in as student or parent
    if (userRole === 'student') {
      // If student user has an associated roll or studentId, filter to their own record
      const sRoll = req.user?.studentRoll || req.user?.roll || 'S101';
      bills = bills.filter(b => b.studentId === sRoll || b.rollNo === sRoll);
    } else if (userRole === 'parent') {
      // If parent has an associated studentRoll or studentName
      const sRoll = req.user?.studentRoll || 'S101';
      const sName = (req.user?.studentName || '').toLowerCase();
      bills = bills.filter(b => b.studentId === sRoll || b.rollNo === sRoll || (sName && (b.studentName || '').toLowerCase().includes(sName)));
    }

    res.json({ success: true, bills });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createStudentBill = async (req, res) => {
  try {
    const {
      studentId,
      studentName,
      admissionNumber,
      rollNo,
      grade,
      section,
      academicYear,
      billingMonth,
      billingDate,
      dueDate,
      feeItems,
      remarks
    } = req.body;

    if (!studentName || !grade || !feeItems || feeItems.length === 0) {
      return res.status(400).json({ success: false, message: 'Student Name, Grade, and at least one Fee Item are required.' });
    }

    // Calculate sum of fee items
    const parsedItems = feeItems.map(item => {
      const amt = Number(item.amount) || 0;
      const disc = Number(item.discount) || 0;
      const fine = Number(item.fine) || 0;
      const net = Math.max(0, amt - disc + fine);
      const itemStatus = item.status === 'Paid' ? 'Paid' : 'Unpaid';
      const itemPaid = itemStatus === 'Paid' ? net : (Number(item.paidAmount) || 0);
      return {
        feeType: item.feeType || 'Miscellaneous Fees',
        description: item.description || '',
        amount: amt,
        discount: disc,
        fine: fine,
        netAmount: net,
        status: itemStatus,
        paidAmount: itemPaid
      };
    });

    const totalFees = parsedItems.reduce((acc, it) => acc + it.netAmount, 0);
    const paidAmount = Number(req.body.paidAmount) || 0;
    const pendingAmount = Math.max(0, totalFees - paidAmount);
    const paymentStatus = calculateBillStatus(totalFees, paidAmount, dueDate);

    const invoiceNumber = `INV-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;

    const newBillData = {
      invoiceNumber,
      schoolId: req.user?.schoolId || 'SCHOOL002',
      studentId: studentId || `S${Math.floor(100 + Math.random() * 900)}`,
      studentName,
      admissionNumber: admissionNumber || `ADM-${Date.now().toString().slice(-4)}`,
      rollNo: rollNo || studentId || '',
      grade,
      section: section || 'A',
      academicYear: academicYear || '2026-2027',
      billingMonth: billingMonth || 'October',
      billingDate: billingDate || new Date().toISOString().split('T')[0],
      dueDate: dueDate || new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0],
      feeItems: parsedItems,
      totalFees,
      paidAmount,
      pendingAmount,
      paymentStatus,
      paymentMethod: req.body.paymentMethod || 'Cash',
      parentName: req.body.parentName || '',
      parentPhone: req.body.parentPhone || '',
      remarks: remarks || ''
    };

    let createdBill;
    if (getDBStatus()) {
      createdBill = await StudentBill.create(newBillData);
    } else {
      createdBill = { _id: `bill_${Date.now()}`, ...newBillData, createdAt: new Date() };
      memoryStudentBills.unshift(createdBill);
    }

    // If an initial payment was recorded at time of bill creation
    if (paidAmount > 0) {
      const txn = {
        transactionId: `TXN-${Date.now()}`,
        schoolId: newBillData.schoolId,
        transactionDate: newBillData.billingDate,
        transactionType: 'Student Fee Payment',
        referenceId: createdBill._id ? createdBill._id.toString() : createdBill.invoiceNumber,
        invoiceNumber: createdBill.invoiceNumber,
        partyName: newBillData.studentName,
        partyRole: 'Student',
        amount: paidAmount,
        paymentMethod: newBillData.paymentMethod,
        paymentStatus: 'Completed',
        remarks: 'Payment recorded during bill creation',
        recordedBy: req.user?.name || 'School Administrator'
      };
      if (getDBStatus()) {
        await PaymentHistory.create(txn);
      } else {
        memoryPaymentHistory.unshift({ _id: `pay_${Date.now()}`, ...txn });
      }
    }

    res.status(201).json({ success: true, message: 'Student bill created successfully', bill: createdBill });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateStudentBill = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Recalculate totals if fee items changed
    if (updateData.feeItems && Array.isArray(updateData.feeItems)) {
      let itemPaidTotal = 0;
      let hasExplicitItemStatus = false;

      updateData.feeItems = updateData.feeItems.map(item => {
        const amt = Number(item.amount) || 0;
        const disc = Number(item.discount) || 0;
        const fine = Number(item.fine) || 0;
        const net = Math.max(0, amt - disc + fine);
        const itemStatus = item.status === 'Paid' ? 'Paid' : 'Unpaid';
        const itemPaid = itemStatus === 'Paid' ? net : (Number(item.paidAmount) || 0);
        if (item.status) hasExplicitItemStatus = true;
        itemPaidTotal += itemPaid;
        return {
          ...item,
          amount: amt,
          discount: disc,
          fine: fine,
          netAmount: net,
          status: itemStatus,
          paidAmount: itemPaid
        };
      });

      const totalFees = updateData.feeItems.reduce((acc, it) => acc + it.netAmount, 0);
      const paid = hasExplicitItemStatus && updateData.paidAmount == null
        ? itemPaidTotal
        : Number(updateData.paidAmount != null ? updateData.paidAmount : itemPaidTotal);
      updateData.totalFees = totalFees;
      updateData.paidAmount = paid;
      updateData.pendingAmount = Math.max(0, totalFees - paid);
      updateData.paymentStatus = calculateBillStatus(totalFees, paid, updateData.dueDate);
    }

    if (getDBStatus()) {
      const updated = await StudentBill.findByIdAndUpdate(id, updateData, { new: true });
      return res.json({ success: true, message: 'Bill updated successfully', bill: updated });
    } else {
      const idx = memoryStudentBills.findIndex(b => b._id === id || b.invoiceNumber === id);
      if (idx === -1) return res.status(404).json({ success: false, message: 'Bill not found' });
      memoryStudentBills[idx] = { ...memoryStudentBills[idx], ...updateData };
      return res.json({ success: true, message: 'Bill updated successfully', bill: memoryStudentBills[idx] });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteStudentBill = async (req, res) => {
  try {
    const { id } = req.params;
    if (getDBStatus()) {
      await StudentBill.findByIdAndDelete(id);
    } else {
      memoryStudentBills = memoryStudentBills.filter(b => b._id !== id && b.invoiceNumber !== id);
    }
    res.json({ success: true, message: 'Bill deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.recordStudentFeePayment = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, paymentMethod, paymentDate, remarks } = req.body;
    const payAmt = Number(amount);

    if (isNaN(payAmt) || payAmt <= 0) {
      return res.status(400).json({ success: false, message: 'Payment amount must be greater than zero.' });
    }

    let bill;
    if (getDBStatus()) {
      bill = await StudentBill.findById(id);
    } else {
      bill = memoryStudentBills.find(b => b._id === id || b.invoiceNumber === id);
    }

    if (!bill) {
      return res.status(404).json({ success: false, message: 'Bill record not found' });
    }

    // Validation: prevent overpayment exceeding pending amount
    if (payAmt > bill.pendingAmount) {
      return res.status(400).json({
        success: false,
        message: `Payment amount (₹${payAmt.toLocaleString()}) cannot exceed outstanding pending amount (₹${bill.pendingAmount.toLocaleString()}).`
      });
    }

    const newPaid = (Number(bill.paidAmount) || 0) + payAmt;
    const newPending = Math.max(0, bill.totalFees - newPaid);
    const newStatus = calculateBillStatus(bill.totalFees, newPaid, bill.dueDate);

    bill.paidAmount = newPaid;
    bill.pendingAmount = newPending;
    bill.paymentStatus = newStatus;
    bill.paymentMethod = paymentMethod || bill.paymentMethod;

    if (getDBStatus()) {
      await bill.save();
    }

    // Create payment transaction history
    const txn = {
      transactionId: `TXN-${Date.now()}`,
      schoolId: bill.schoolId,
      transactionDate: paymentDate || new Date().toISOString().split('T')[0],
      transactionType: 'Student Fee Payment',
      referenceId: bill._id ? bill._id.toString() : bill.invoiceNumber,
      invoiceNumber: bill.invoiceNumber,
      partyName: bill.studentName,
      partyRole: 'Student',
      amount: payAmt,
      paymentMethod: paymentMethod || 'Cash',
      paymentStatus: 'Completed',
      remarks: remarks || `Fee payment towards ${bill.invoiceNumber}`,
      recordedBy: req.user?.name || 'School Administrator'
    };

    if (getDBStatus()) {
      await PaymentHistory.create(txn);
    } else {
      memoryPaymentHistory.unshift({ _id: `pay_${Date.now()}`, ...txn });
    }

    res.json({ success: true, message: 'Payment recorded successfully', bill, transaction: txn });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// 3. STAFF SALARY MANAGEMENT CRUD & PAYMENT
// ==========================================
exports.getStaffSalaries = async (req, res) => {
  try {
    const isMongo = getDBStatus();
    const salaries = isMongo ? await StaffSalary.find({}).sort({ salaryYear: -1, createdAt: -1 }) : memoryStaffSalaries;
    res.json({ success: true, salaries });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.generateStaffSalary = async (req, res) => {
  try {
    const {
      staffId,
      staffName,
      designation,
      department,
      salaryMonth,
      salaryYear,
      basicSalary,
      hra,
      allowances,
      bonus,
      incentives,
      pf,
      esi,
      otherDeductions,
      salaryAdvance,
      paymentMethod,
      bankAccountNo,
      remarks
    } = req.body;

    if (!staffName || !salaryMonth || !salaryYear || basicSalary == null) {
      return res.status(400).json({ success: false, message: 'Staff Name, Basic Salary, Salary Month & Year are required.' });
    }

    const yr = Number(salaryYear);
    const sid = staffId || `STF-${Date.now().toString().slice(-4)}`;

    // Duplicate check: Prevent duplicate salary generation for the same staff member in same month & year
    if (getDBStatus()) {
      const exists = await StaffSalary.findOne({ staffId: sid, salaryMonth, salaryYear: yr });
      if (exists) {
        return res.status(400).json({
          success: false,
          message: `Salary for ${staffName} has already been generated for ${salaryMonth} ${yr}.`
        });
      }
    } else {
      const exists = memoryStaffSalaries.find(s => s.staffId === sid && s.salaryMonth === salaryMonth && s.salaryYear === yr);
      if (exists) {
        return res.status(400).json({
          success: false,
          message: `Salary for ${staffName} has already been generated for ${salaryMonth} ${yr}.`
        });
      }
    }

    const b = Number(basicSalary) || 0;
    const h = Number(hra) || 0;
    const a = Number(allowances) || 0;
    const bon = Number(bonus) || 0;
    const inc = Number(incentives) || 0;

    const p = Number(pf) || 0;
    const e = Number(esi) || 0;
    const oth = Number(otherDeductions) || 0;
    const adv = Number(salaryAdvance) || 0;

    const grossSalary = b + h + a + bon + inc;
    const totalDeductions = p + e + oth + adv;
    const netSalary = Math.max(0, grossSalary - totalDeductions);
    const paidAmount = Number(req.body.paidAmount) || 0;
    const pendingAmount = Math.max(0, netSalary - paidAmount);

    let paymentStatus = 'Pending';
    if (paidAmount >= netSalary) paymentStatus = 'Paid';
    else if (paidAmount > 0) paymentStatus = 'Partially Paid';

    const salarySlipNo = `SLIP-${yr}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newSalary = {
      salarySlipNo,
      schoolId: req.user?.schoolId || 'SCHOOL002',
      staffId: sid,
      staffName,
      staffType: req.body.staffType || (designation && ['Transport Driver', 'Cleaning Worker', 'Hostel Warden', 'Security', 'Driver', 'Housekeeping'].includes(designation) ? 'Non-Teaching' : 'Teaching'),
      designation: designation || 'Faculty',
      department: department || 'Academics',
      salaryMonth,
      salaryYear: yr,
      basicSalary: b,
      hra: h,
      allowances: a,
      bonus: bon,
      incentives: inc,
      pf: p,
      esi: e,
      otherDeductions: oth,
      salaryAdvance: adv,
      grossSalary,
      totalDeductions,
      netSalary,
      paidAmount,
      pendingAmount,
      paymentStatus,
      paymentDate: req.body.paymentDate || '',
      paymentMethod: paymentMethod || 'Bank Transfer',
      bankAccountNo: bankAccountNo || '',
      remarks: remarks || ''
    };

    let savedSalary;
    if (getDBStatus()) {
      savedSalary = await StaffSalary.create(newSalary);
    } else {
      savedSalary = { _id: `sal_${Date.now()}`, ...newSalary, createdAt: new Date() };
      memoryStaffSalaries.unshift(savedSalary);
    }

    if (paidAmount > 0) {
      const txn = {
        transactionId: `TXN-${Date.now()}`,
        schoolId: newSalary.schoolId,
        transactionDate: newSalary.paymentDate || new Date().toISOString().split('T')[0],
        transactionType: 'Staff Salary Payment',
        referenceId: savedSalary._id ? savedSalary._id.toString() : savedSalary.salarySlipNo,
        invoiceNumber: savedSalary.salarySlipNo,
        partyName: newSalary.staffName,
        partyRole: 'Staff',
        amount: paidAmount,
        paymentMethod: newSalary.paymentMethod,
        paymentStatus: 'Completed',
        remarks: `Salary payment for ${newSalary.salaryMonth} ${newSalary.salaryYear}`,
        recordedBy: req.user?.name || 'School Administrator'
      };
      if (getDBStatus()) {
        await PaymentHistory.create(txn);
      } else {
        memoryPaymentHistory.unshift({ _id: `pay_${Date.now()}`, ...txn });
      }
    }

    res.status(201).json({ success: true, message: 'Staff salary generated successfully', salary: savedSalary });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateStaffSalary = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Recalculate salary
    const b = Number(updateData.basicSalary != null ? updateData.basicSalary : 0);
    const h = Number(updateData.hra || 0);
    const a = Number(updateData.allowances || 0);
    const bon = Number(updateData.bonus || 0);
    const inc = Number(updateData.incentives || 0);

    const p = Number(updateData.pf || 0);
    const e = Number(updateData.esi || 0);
    const oth = Number(updateData.otherDeductions || 0);
    const adv = Number(updateData.salaryAdvance || 0);

    const grossSalary = b + h + a + bon + inc;
    const totalDeductions = p + e + oth + adv;
    const netSalary = Math.max(0, grossSalary - totalDeductions);
    const paid = Number(updateData.paidAmount || 0);
    const pending = Math.max(0, netSalary - paid);

    let status = 'Pending';
    if (paid >= netSalary) status = 'Paid';
    else if (paid > 0) status = 'Partially Paid';

    updateData.grossSalary = grossSalary;
    updateData.totalDeductions = totalDeductions;
    updateData.netSalary = netSalary;
    updateData.pendingAmount = pending;
    updateData.paymentStatus = status;

    if (getDBStatus()) {
      const updated = await StaffSalary.findByIdAndUpdate(id, updateData, { new: true });
      return res.json({ success: true, message: 'Salary updated successfully', salary: updated });
    } else {
      const idx = memoryStaffSalaries.findIndex(s => s._id === id || s.salarySlipNo === id);
      if (idx === -1) return res.status(404).json({ success: false, message: 'Salary record not found' });
      memoryStaffSalaries[idx] = { ...memoryStaffSalaries[idx], ...updateData };
      return res.json({ success: true, message: 'Salary updated successfully', salary: memoryStaffSalaries[idx] });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.recordStaffSalaryPayment = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, paymentMethod, paymentDate, remarks } = req.body;
    const payAmt = Number(amount);

    if (isNaN(payAmt) || payAmt <= 0) {
      return res.status(400).json({ success: false, message: 'Payment amount must be greater than zero.' });
    }

    let salary;
    if (getDBStatus()) {
      salary = await StaffSalary.findById(id);
    } else {
      salary = memoryStaffSalaries.find(s => s._id === id || s.salarySlipNo === id);
    }

    if (!salary) {
      return res.status(404).json({ success: false, message: 'Salary slip not found' });
    }

    if (payAmt > salary.pendingAmount) {
      return res.status(400).json({
        success: false,
        message: `Payment amount (₹${payAmt.toLocaleString()}) cannot exceed outstanding pending salary (₹${salary.pendingAmount.toLocaleString()}).`
      });
    }

    const newPaid = (Number(salary.paidAmount) || 0) + payAmt;
    const newPending = Math.max(0, salary.netSalary - newPaid);
    salary.paidAmount = newPaid;
    salary.pendingAmount = newPending;
    salary.paymentStatus = newPaid >= salary.netSalary ? 'Paid' : 'Partially Paid';
    salary.paymentDate = paymentDate || new Date().toISOString().split('T')[0];
    salary.paymentMethod = paymentMethod || salary.paymentMethod;

    if (getDBStatus()) {
      await salary.save();
    }

    const txn = {
      transactionId: `TXN-${Date.now()}`,
      schoolId: salary.schoolId,
      transactionDate: salary.paymentDate,
      transactionType: 'Staff Salary Payment',
      referenceId: salary._id ? salary._id.toString() : salary.salarySlipNo,
      invoiceNumber: salary.salarySlipNo,
      partyName: salary.staffName,
      partyRole: 'Staff',
      amount: payAmt,
      paymentMethod: paymentMethod || 'Bank Transfer',
      paymentStatus: 'Completed',
      remarks: remarks || `Salary payout for ${salary.salaryMonth} ${salary.salaryYear}`,
      recordedBy: req.user?.name || 'School Administrator'
    };

    if (getDBStatus()) {
      await PaymentHistory.create(txn);
    } else {
      memoryPaymentHistory.unshift({ _id: `pay_${Date.now()}`, ...txn });
    }

    res.json({ success: true, message: 'Salary payment recorded successfully', salary, transaction: txn });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// 4. SCHOOL EXPENSES CRUD & PAYMENT
// ==========================================
exports.getSchoolExpenses = async (req, res) => {
  try {
    const isMongo = getDBStatus();
    const expenses = isMongo ? await SchoolExpense.find({}).sort({ expenseDate: -1 }) : memoryExpenses;
    res.json({ success: true, expenses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.addSchoolExpense = async (req, res) => {
  try {
    const {
      expenseCategory,
      expenseName,
      description,
      vendorName,
      invoiceNumber,
      expenseDate,
      amount,
      paidAmount,
      paymentMethod,
      remarks,
      attachmentUrl
    } = req.body;

    if (!expenseCategory || !expenseName || !vendorName || amount == null) {
      return res.status(400).json({ success: false, message: 'Category, Expense Name, Vendor Name, and Amount are required.' });
    }

    const amt = Number(amount) || 0;
    const paid = Number(paidAmount) || 0;
    const pending = Math.max(0, amt - paid);

    let paymentStatus = 'Pending';
    if (paid >= amt) paymentStatus = 'Paid';
    else if (paid > 0) paymentStatus = 'Partially Paid';

    const expenseId = `EXP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newExpense = {
      expenseId,
      schoolId: req.user?.schoolId || 'SCHOOL002',
      expenseCategory,
      expenseName,
      description: description || '',
      vendorName,
      invoiceNumber: invoiceNumber || `VND-${Date.now().toString().slice(-4)}`,
      expenseDate: expenseDate || new Date().toISOString().split('T')[0],
      amount: amt,
      paidAmount: paid,
      pendingAmount: pending,
      paymentMethod: paymentMethod || 'Bank Transfer',
      paymentStatus,
      paymentDate: paid > 0 ? (req.body.paymentDate || new Date().toISOString().split('T')[0]) : '',
      remarks: remarks || '',
      attachmentUrl: attachmentUrl || ''
    };

    let createdExp;
    if (getDBStatus()) {
      createdExp = await SchoolExpense.create(newExpense);
    } else {
      createdExp = { _id: `exp_${Date.now()}`, ...newExpense, createdAt: new Date() };
      memoryExpenses.unshift(createdExp);
    }

    if (paid > 0) {
      const txn = {
        transactionId: `TXN-${Date.now()}`,
        schoolId: newExpense.schoolId,
        transactionDate: newExpense.paymentDate,
        transactionType: 'School Expense Payment',
        referenceId: createdExp._id ? createdExp._id.toString() : createdExp.expenseId,
        invoiceNumber: newExpense.invoiceNumber,
        partyName: newExpense.vendorName,
        partyRole: 'Vendor',
        amount: paid,
        paymentMethod: newExpense.paymentMethod,
        paymentStatus: 'Completed',
        remarks: `Expense settlement for ${newExpense.expenseName}`,
        recordedBy: req.user?.name || 'School Administrator'
      };
      if (getDBStatus()) {
        await PaymentHistory.create(txn);
      } else {
        memoryPaymentHistory.unshift({ _id: `pay_${Date.now()}`, ...txn });
      }
    }

    res.status(201).json({ success: true, message: 'Expense added successfully', expense: createdExp });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateSchoolExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const amt = Number(updateData.amount != null ? updateData.amount : 0);
    const paid = Number(updateData.paidAmount || 0);
    const pending = Math.max(0, amt - paid);

    let status = 'Pending';
    if (paid >= amt) status = 'Paid';
    else if (paid > 0) status = 'Partially Paid';

    updateData.amount = amt;
    updateData.pendingAmount = pending;
    updateData.paymentStatus = status;

    if (getDBStatus()) {
      const updated = await SchoolExpense.findByIdAndUpdate(id, updateData, { new: true });
      return res.json({ success: true, message: 'Expense updated successfully', expense: updated });
    } else {
      const idx = memoryExpenses.findIndex(e => e._id === id || e.expenseId === id);
      if (idx === -1) return res.status(404).json({ success: false, message: 'Expense not found' });
      memoryExpenses[idx] = { ...memoryExpenses[idx], ...updateData };
      return res.json({ success: true, message: 'Expense updated successfully', expense: memoryExpenses[idx] });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteSchoolExpense = async (req, res) => {
  try {
    const { id } = req.params;
    if (getDBStatus()) {
      await SchoolExpense.findByIdAndDelete(id);
    } else {
      memoryExpenses = memoryExpenses.filter(e => e._id !== id && e.expenseId !== id);
    }
    res.json({ success: true, message: 'Expense deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.recordSchoolExpensePayment = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, paymentMethod, paymentDate, remarks } = req.body;
    const payAmt = Number(amount);

    if (isNaN(payAmt) || payAmt <= 0) {
      return res.status(400).json({ success: false, message: 'Payment amount must be greater than zero.' });
    }

    let expense;
    if (getDBStatus()) {
      expense = await SchoolExpense.findById(id);
    } else {
      expense = memoryExpenses.find(e => e._id === id || e.expenseId === id);
    }

    if (!expense) {
      return res.status(404).json({ success: false, message: 'Expense not found' });
    }

    if (payAmt > expense.pendingAmount) {
      return res.status(400).json({
        success: false,
        message: `Payment amount (₹${payAmt.toLocaleString()}) cannot exceed outstanding expense amount (₹${expense.pendingAmount.toLocaleString()}).`
      });
    }

    const newPaid = (Number(expense.paidAmount) || 0) + payAmt;
    const newPending = Math.max(0, expense.amount - newPaid);
    expense.paidAmount = newPaid;
    expense.pendingAmount = newPending;
    expense.paymentStatus = newPaid >= expense.amount ? 'Paid' : 'Partially Paid';
    expense.paymentDate = paymentDate || new Date().toISOString().split('T')[0];
    expense.paymentMethod = paymentMethod || expense.paymentMethod;

    if (getDBStatus()) {
      await expense.save();
    }

    const txn = {
      transactionId: `TXN-${Date.now()}`,
      schoolId: expense.schoolId,
      transactionDate: expense.paymentDate,
      transactionType: 'School Expense Payment',
      referenceId: expense._id ? expense._id.toString() : expense.expenseId,
      invoiceNumber: expense.invoiceNumber || expense.expenseId,
      partyName: expense.vendorName,
      partyRole: 'Vendor',
      amount: payAmt,
      paymentMethod: paymentMethod || 'Bank Transfer',
      paymentStatus: 'Completed',
      remarks: remarks || `Vendor payout for ${expense.expenseName}`,
      recordedBy: req.user?.name || 'School Administrator'
    };

    if (getDBStatus()) {
      await PaymentHistory.create(txn);
    } else {
      memoryPaymentHistory.unshift({ _id: `pay_${Date.now()}`, ...txn });
    }

    res.json({ success: true, message: 'Expense payment recorded successfully', expense, transaction: txn });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// 5. PAYMENT HISTORY & AUDIT LOGS
// ==========================================
exports.getPaymentHistory = async (req, res) => {
  try {
    const { type, search, startDate, endDate } = req.query;
    const isMongo = getDBStatus();
    let txns = isMongo ? await PaymentHistory.find({}).sort({ transactionDate: -1, createdAt: -1 }) : memoryPaymentHistory;

    if (type && type !== 'All') {
      txns = txns.filter(t => t.transactionType === type);
    }
    if (search) {
      const q = search.toLowerCase();
      txns = txns.filter(t =>
        (t.partyName && t.partyName.toLowerCase().includes(q)) ||
        (t.transactionId && t.transactionId.toLowerCase().includes(q)) ||
        (t.invoiceNumber && t.invoiceNumber.toLowerCase().includes(q))
      );
    }
    if (startDate) {
      txns = txns.filter(t => t.transactionDate >= startDate);
    }
    if (endDate) {
      txns = txns.filter(t => t.transactionDate <= endDate);
    }

    res.json({ success: true, transactions: txns });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// 6. BULK EXCEL IMPORT HANDLERS
// ==========================================
exports.bulkImportStudentBills = async (req, res) => {
  try {
    const { items } = req.body;
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: 'No student bill records provided for import.' });
    }

    const importedBills = [];
    const isMongo = getDBStatus();

    for (const raw of items) {
      const studentName = String(raw.studentName || raw['Student Name'] || '').trim();
      if (!studentName) continue;

      const studentId = String(raw.studentId || raw['Student ID'] || raw['Roll No'] || `S${Math.floor(100 + Math.random() * 900)}`).trim();
      const rollNo = String(raw.rollNo || raw['Roll No'] || studentId).trim();
      const grade = String(raw.grade || raw['Grade'] || raw['Class'] || 'Grade 10').trim();
      const section = String(raw.section || raw['Section'] || 'A').trim();
      const billingMonth = String(raw.billingMonth || raw['Month'] || raw['Billing Month'] || 'October').trim();
      const academicYear = String(raw.academicYear || raw['Academic Year'] || '2026-2027').trim();

      const monthlyFee = Number(raw.monthlyFees || raw['Monthly Fees'] || 15000) || 0;
      const transportFee = Number(raw.transportFees || raw['Transport Fees'] || 5000) || 0;
      const coCurricularFee = Number(raw.coCurricularFees || raw['Co-curricular Fees'] || raw['Co-Curricular Fees'] || 3000) || 0;
      const termFee = Number(raw.termFees || raw['Term Fees'] || 5000) || 0;

      const feeItems = [
        { feeType: 'Monthly Fees', description: 'Tuition Fee', amount: monthlyFee, discount: 0, fine: 0, netAmount: monthlyFee, status: raw.monthlyFeeStatus === 'Paid' ? 'Paid' : 'Unpaid', paidAmount: raw.monthlyFeeStatus === 'Paid' ? monthlyFee : 0 },
        { feeType: 'Transport Fees', description: 'Bus Route', amount: transportFee, discount: 0, fine: 0, netAmount: transportFee, status: raw.transportFeeStatus === 'Paid' ? 'Paid' : 'Unpaid', paidAmount: raw.transportFeeStatus === 'Paid' ? transportFee : 0 },
        { feeType: 'Co-curricular Fees', description: 'Activities & Sports', amount: coCurricularFee, discount: 0, fine: 0, netAmount: coCurricularFee, status: raw.coCurricularFeeStatus === 'Paid' ? 'Paid' : 'Unpaid', paidAmount: raw.coCurricularFeeStatus === 'Paid' ? coCurricularFee : 0 },
        { feeType: 'Term Fees', description: 'Assessment', amount: termFee, discount: 0, fine: 0, netAmount: termFee, status: raw.termFeeStatus === 'Paid' ? 'Paid' : 'Unpaid', paidAmount: raw.termFeeStatus === 'Paid' ? termFee : 0 }
      ];

      const totalFees = Number(raw.totalFees || raw['Total Fees']) || (monthlyFee + transportFee + coCurricularFee + termFee);
      const paidAmount = Number(raw.paidAmount || raw['Paid Amount']) || 0;
      const pendingAmount = Math.max(0, totalFees - paidAmount);
      const dueDate = String(raw.dueDate || raw['Due Date'] || new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0]);
      const paymentStatus = calculateBillStatus(totalFees, paidAmount, dueDate);

      const invoiceNumber = String(raw.invoiceNumber || raw['Invoice No'] || `INV-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`);

      const billRecord = {
        invoiceNumber,
        schoolId: req.user?.schoolId || 'SCHOOL002',
        studentId,
        studentName,
        admissionNumber: String(raw.admissionNumber || raw['Admission No'] || `ADM-${Date.now().toString().slice(-4)}`),
        rollNo,
        grade,
        section,
        academicYear,
        billingMonth,
        billingDate: String(raw.billingDate || new Date().toISOString().split('T')[0]),
        dueDate,
        feeItems,
        totalFees,
        paidAmount,
        pendingAmount,
        paymentStatus,
        paymentMethod: String(raw.paymentMethod || 'Cash'),
        parentName: String(raw.parentName || raw['Parent Name'] || ''),
        parentPhone: String(raw.parentPhone || raw['Parent Phone'] || ''),
        remarks: String(raw.remarks || 'Imported via Excel Bulk Upload')
      };

      if (isMongo) {
        const saved = await StudentBill.create(billRecord);
        importedBills.push(saved);
      } else {
        const memoryBill = { _id: `bill_${Date.now()}_${Math.random().toString(36).substring(7)}`, ...billRecord, createdAt: new Date() };
        memoryStudentBills.unshift(memoryBill);
        importedBills.push(memoryBill);
      }
    }

    res.status(201).json({
      success: true,
      message: `Successfully imported ${importedBills.length} student bill records from Excel!`,
      bills: importedBills
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.bulkImportStaffSalaries = async (req, res) => {
  try {
    const { items } = req.body;
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: 'No staff salary records provided for import.' });
    }

    const importedSalaries = [];
    const isMongo = getDBStatus();

    for (const raw of items) {
      const staffName = String(raw.staffName || raw['Staff Name'] || '').trim();
      if (!staffName) continue;

      const staffId = String(raw.staffId || raw['Staff ID'] || `STF-${Date.now().toString().slice(-4)}`).trim();
      const designation = String(raw.designation || raw['Designation'] || 'Faculty').trim();
      const department = String(raw.department || raw['Department'] || 'Academics').trim();
      const salaryMonth = String(raw.salaryMonth || raw['Month'] || 'October').trim();
      const salaryYear = Number(raw.salaryYear || raw['Year'] || 2026);

      const b = Number(raw.basicSalary || raw['Basic Salary'] || 25000) || 0;
      const h = Number(raw.hra || raw['HRA'] || 8000) || 0;
      const a = Number(raw.allowances || raw['Allowances'] || 2000) || 0;
      const bon = Number(raw.bonus || raw['Bonus'] || 0) || 0;
      const inc = Number(raw.incentives || raw['Incentives'] || 0) || 0;

      const p = Number(raw.pf || raw['PF'] || 1800) || 0;
      const e = Number(raw.esi || raw['ESI'] || 750) || 0;
      const oth = Number(raw.otherDeductions || raw['Other Deductions'] || 0) || 0;
      const adv = Number(raw.salaryAdvance || raw['Advance'] || 0) || 0;

      const grossSalary = b + h + a + bon + inc;
      const totalDeductions = p + e + oth + adv;
      const netSalary = Math.max(0, grossSalary - totalDeductions);
      const paidAmount = Number(raw.paidAmount || raw['Paid Amount']) || 0;
      const pendingAmount = Math.max(0, netSalary - paidAmount);

      let paymentStatus = 'Pending';
      if (paidAmount >= netSalary) paymentStatus = 'Paid';
      else if (paidAmount > 0) paymentStatus = 'Partially Paid';

      const salarySlipNo = String(raw.salarySlipNo || raw['Slip No'] || `SLIP-${salaryYear}-${Math.floor(1000 + Math.random() * 9000)}`);

      const isNonTeaching = ['Transport Driver', 'Cleaning Worker', 'Hostel Warden', 'Security', 'Driver', 'Housekeeping'].includes(designation) || raw.staffType === 'Non-Teaching';

      const salaryRecord = {
        salarySlipNo,
        schoolId: req.user?.schoolId || 'SCHOOL002',
        staffId,
        staffName,
        staffType: isNonTeaching ? 'Non-Teaching' : 'Teaching',
        designation,
        department,
        salaryMonth,
        salaryYear,
        basicSalary: b,
        hra: h,
        allowances: a,
        bonus: bon,
        incentives: inc,
        pf: p,
        esi: e,
        otherDeductions: oth,
        salaryAdvance: adv,
        grossSalary,
        totalDeductions,
        netSalary,
        paidAmount,
        pendingAmount,
        paymentStatus,
        paymentDate: String(raw.paymentDate || ''),
        paymentMethod: String(raw.paymentMethod || 'Bank Transfer'),
        bankAccountNo: String(raw.bankAccountNo || ''),
        remarks: String(raw.remarks || 'Imported via Excel Bulk Upload')
      };

      if (isMongo) {
        const saved = await StaffSalary.create(salaryRecord);
        importedSalaries.push(saved);
      } else {
        const memorySal = { _id: `sal_${Date.now()}_${Math.random().toString(36).substring(7)}`, ...salaryRecord, createdAt: new Date() };
        memoryStaffSalaries.unshift(memorySal);
        importedSalaries.push(memorySal);
      }
    }

    res.status(201).json({
      success: true,
      message: `Successfully imported ${importedSalaries.length} staff salary records from Excel!`,
      salaries: importedSalaries
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
