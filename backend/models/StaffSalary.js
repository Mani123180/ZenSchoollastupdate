const mongoose = require('mongoose');

const staffSalarySchema = new mongoose.Schema(
  {
    salarySlipNo: { type: String, required: true, unique: true },
    schoolId: { type: String, required: true, default: 'SCHOOL002' },
    staffId: { type: String, required: true },
    staffName: { type: String, required: true },
    staffType: { type: String, enum: ['Teaching', 'Non-Teaching'], default: 'Teaching' },
    designation: { type: String, required: true }, // e.g. Senior Teacher, Transport Driver, Cleaning Worker, Hostel Warden
    department: { type: String, required: true }, // e.g. Mathematics, Transport, Housekeeping, Hostel
    salaryMonth: { type: String, required: true }, // e.g. October
    salaryYear: { type: Number, required: true }, // e.g. 2026

    // Earnings
    basicSalary: { type: Number, required: true, default: 0, min: 0 },
    hra: { type: Number, default: 0, min: 0 },
    allowances: { type: Number, default: 0, min: 0 },
    bonus: { type: Number, default: 0, min: 0 },
    incentives: { type: Number, default: 0, min: 0 },

    // Deductions
    pf: { type: Number, default: 0, min: 0 },
    esi: { type: Number, default: 0, min: 0 },
    otherDeductions: { type: Number, default: 0, min: 0 },
    salaryAdvance: { type: Number, default: 0, min: 0 },

    // Computed Totals
    grossSalary: { type: Number, required: true, min: 0 },
    totalDeductions: { type: Number, required: true, min: 0 },
    netSalary: { type: Number, required: true, min: 0 },
    paidAmount: { type: Number, default: 0, min: 0 },
    pendingAmount: { type: Number, required: true, min: 0 },

    paymentStatus: {
      type: String,
      enum: ['Paid', 'Pending', 'Partially Paid'],
      default: 'Pending'
    },
    paymentDate: { type: String, default: '' },
    paymentMethod: { type: String, default: 'Bank Transfer' },
    bankAccountNo: { type: String, default: '' },
    remarks: { type: String, default: '' }
  },
  { timestamps: true }
);

// Prevent duplicate salary generation for the same staff member in the same month and year
staffSalarySchema.index({ schoolId: 1, staffId: 1, salaryMonth: 1, salaryYear: 1 }, { unique: true });

module.exports = mongoose.model('StaffSalary', staffSalarySchema);
