const API_BASE = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? 'https://zenc0-fouder-update-1.onrender.com/api' : '/api');

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const handleResponse = async (res) => {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const errorMsg = data.message || `Request failed with status ${res.status}`;
    throw new Error(errorMsg);
  }
  return data;
};

export const api = {
  // Auth
  login: async (username, password) => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    return handleResponse(res);
  },

  getMe: async () => {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  getDemoAccounts: async () => {
    const res = await fetch(`${API_BASE}/auth/demo-accounts`);
    return handleResponse(res);
  },

  // Schools
  getSchools: async () => {
    const res = await fetch(`${API_BASE}/schools`, { headers: getAuthHeaders() });
    return handleResponse(res);
  },

  createSchool: async (schoolData) => {
    const res = await fetch(`${API_BASE}/schools`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(schoolData),
    });
    return handleResponse(res);
  },

  updateSchool: async (id, schoolData) => {
    const res = await fetch(`${API_BASE}/schools/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(schoolData),
    });
    return handleResponse(res);
  },

  deleteSchool: async (id) => {
    const res = await fetch(`${API_BASE}/schools/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  // Users
  getUsers: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/users${query ? `?${query}` : ''}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  createUser: async (userData) => {
    const res = await fetch(`${API_BASE}/users`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(userData),
    });
    return handleResponse(res);
  },

  updateUser: async (id, userData) => {
    const res = await fetch(`${API_BASE}/users/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(userData),
    });
    return handleResponse(res);
  },

  deleteUser: async (id) => {
    const res = await fetch(`${API_BASE}/users/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  // Students
  getStudents: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/students${query ? `?${query}` : ''}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  createStudent: async (studentData) => {
    const res = await fetch(`${API_BASE}/students`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(studentData),
    });
    return handleResponse(res);
  },

  linkParent: async (payload) => {
    const res = await fetch(`${API_BASE}/students/link-parent`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    return handleResponse(res);
  },

  deleteStudent: async (id) => {
    const res = await fetch(`${API_BASE}/students/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  // Teachers
  getTeachers: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/teachers${query ? `?${query}` : ''}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  createTeacher: async (teacherData) => {
    const res = await fetch(`${API_BASE}/teachers`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(teacherData),
    });
    return handleResponse(res);
  },

  deleteTeacher: async (id) => {
    const res = await fetch(`${API_BASE}/teachers/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  // Subscriptions & Plans
  getPlans: async () => {
    const res = await fetch(`${API_BASE}/subscriptions/plans`, { headers: getAuthHeaders() });
    return handleResponse(res);
  },

  createPlan: async (planData) => {
    const res = await fetch(`${API_BASE}/subscriptions/plans`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(planData),
    });
    return handleResponse(res);
  },

  getSubscriptions: async () => {
    const res = await fetch(`${API_BASE}/subscriptions`, { headers: getAuthHeaders() });
    return handleResponse(res);
  },

  createSubscription: async (subData) => {
    const res = await fetch(`${API_BASE}/subscriptions`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(subData),
    });
    return handleResponse(res);
  },

  getBills: async () => {
    const res = await fetch(`${API_BASE}/subscriptions/bills`, { headers: getAuthHeaders() });
    return handleResponse(res);
  },

  // Messaging
  sendHeartbeat: async () => {
    try {
      const res = await fetch(`${API_BASE}/messages/heartbeat`, {
        method: 'POST',
        headers: getAuthHeaders(),
      });
      return handleResponse(res);
    } catch (e) {
      return { success: false };
    }
  },

  getContacts: async () => {
    const res = await fetch(`${API_BASE}/messages/contacts`, { headers: getAuthHeaders() });
    return handleResponse(res);
  },

  getMessages: async (contactId) => {
    const res = await fetch(`${API_BASE}/messages${contactId ? `?contactId=${contactId}` : ''}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  sendMessage: async (messageData) => {
    const res = await fetch(`${API_BASE}/messages`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(messageData),
    });
    return handleResponse(res);
  },

  // Timetable
  getTimetable: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/timetable${query ? `?${query}` : ''}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  updateTimetableSlot: async (slotData) => {
    const res = await fetch(`${API_BASE}/timetable/slot`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(slotData),
    });
    return handleResponse(res);
  },

  // Contact Inquiry (Public)
  submitInquiry: async (inquiryData) => {
    const res = await fetch(`${API_BASE}/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(inquiryData),
    });
    return handleResponse(res);
  },

  // ==========================================
  // School Finance Module API Endpoints
  // ==========================================
  getFinanceDashboard: async (filters = {}) => {
    const query = new URLSearchParams(filters).toString();
    const res = await fetch(`${API_BASE}/finance/dashboard${query ? `?${query}` : ''}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  // Student Billing
  getStudentBills: async () => {
    const res = await fetch(`${API_BASE}/finance/student-bills`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  createStudentBill: async (billData) => {
    const res = await fetch(`${API_BASE}/finance/student-bills`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(billData),
    });
    return handleResponse(res);
  },

  updateStudentBill: async (id, billData) => {
    const res = await fetch(`${API_BASE}/finance/student-bills/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(billData),
    });
    return handleResponse(res);
  },

  deleteStudentBill: async (id) => {
    const res = await fetch(`${API_BASE}/finance/student-bills/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  bulkImportStudentBills: async (items) => {
    const res = await fetch(`${API_BASE}/finance/student-bills/bulk`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ items }),
    });
    return handleResponse(res);
  },

  recordStudentBillPayment: async (id, paymentData) => {
    const res = await fetch(`${API_BASE}/finance/student-bills/${id}/pay`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(paymentData),
    });
    return handleResponse(res);
  },

  // Staff Salary
  getStaffSalaries: async () => {
    const res = await fetch(`${API_BASE}/finance/staff-salaries`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  bulkImportStaffSalaries: async (items) => {
    const res = await fetch(`${API_BASE}/finance/staff-salaries/bulk`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ items }),
    });
    return handleResponse(res);
  },

  generateStaffSalary: async (salaryData) => {
    const res = await fetch(`${API_BASE}/finance/staff-salaries`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(salaryData),
    });
    return handleResponse(res);
  },

  updateStaffSalary: async (id, salaryData) => {
    const res = await fetch(`${API_BASE}/finance/staff-salaries/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(salaryData),
    });
    return handleResponse(res);
  },

  recordStaffSalaryPayment: async (id, paymentData) => {
    const res = await fetch(`${API_BASE}/finance/staff-salaries/${id}/pay`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(paymentData),
    });
    return handleResponse(res);
  },

  // School Expenses
  getSchoolExpenses: async () => {
    const res = await fetch(`${API_BASE}/finance/expenses`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  addSchoolExpense: async (expenseData) => {
    const res = await fetch(`${API_BASE}/finance/expenses`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(expenseData),
    });
    return handleResponse(res);
  },

  updateSchoolExpense: async (id, expenseData) => {
    const res = await fetch(`${API_BASE}/finance/expenses/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(expenseData),
    });
    return handleResponse(res);
  },

  deleteSchoolExpense: async (id) => {
    const res = await fetch(`${API_BASE}/finance/expenses/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  recordSchoolExpensePayment: async (id, paymentData) => {
    const res = await fetch(`${API_BASE}/finance/expenses/${id}/pay`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(paymentData),
    });
    return handleResponse(res);
  },

  // Payment History
  getPaymentHistory: async (filters = {}) => {
    const query = new URLSearchParams(filters).toString();
    const res = await fetch(`${API_BASE}/finance/payment-history${query ? `?${query}` : ''}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },
};

