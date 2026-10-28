const express = require('express');
const router = express.Router();
const financeController = require('../controllers/financeController');
const { protect, authorize } = require('../middleware/authMiddleware');


router.get('/dashboard', protect, authorize('superadmin', 'schooladmin'), financeController.getDashboardSummary);



router.get('/student-bills', protect, authorize('superadmin', 'schooladmin', 'principal', 'teacher', 'student', 'parent'), financeController.getStudentBills);
router.post('/student-bills/bulk', protect, authorize('superadmin', 'schooladmin'), financeController.bulkImportStudentBills);
router.post('/student-bills', protect, authorize('superadmin', 'schooladmin'), financeController.createStudentBill);
router.put('/student-bills/:id', protect, authorize('superadmin', 'schooladmin'), financeController.updateStudentBill);
router.delete('/student-bills/:id', protect, authorize('superadmin', 'schooladmin'), financeController.deleteStudentBill);
router.post('/student-bills/:id/pay', protect, authorize('superadmin', 'schooladmin', 'parent', 'student'), financeController.recordStudentFeePayment);


router.get('/staff-salaries', protect, authorize('superadmin', 'schooladmin'), financeController.getStaffSalaries);
router.post('/staff-salaries/bulk', protect, authorize('superadmin', 'schooladmin'), financeController.bulkImportStaffSalaries);
router.post('/staff-salaries', protect, authorize('superadmin', 'schooladmin'), financeController.generateStaffSalary);
router.put('/staff-salaries/:id', protect, authorize('superadmin', 'schooladmin'), financeController.updateStaffSalary);
router.post('/staff-salaries/:id/pay', protect, authorize('superadmin', 'schooladmin'), financeController.recordStaffSalaryPayment);


router.get('/expenses', protect, authorize('superadmin', 'schooladmin'), financeController.getSchoolExpenses);
router.post('/expenses', protect, authorize('superadmin', 'schooladmin'), financeController.addSchoolExpense);
router.put('/expenses/:id', protect, authorize('superadmin', 'schooladmin'), financeController.updateSchoolExpense);
router.delete('/expenses/:id', protect, authorize('superadmin', 'schooladmin'), financeController.deleteSchoolExpense);
router.post('/expenses/:id/pay', protect, authorize('superadmin', 'schooladmin'), financeController.recordSchoolExpensePayment);


router.get('/payment-history', protect, authorize('superadmin', 'schooladmin'), financeController.getPaymentHistory);

module.exports = router;
