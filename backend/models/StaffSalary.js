const mongoose = require('mongoose');

const staffSalarySchema = new mongoose.Schema(
  {
    salarySlipNo: { type: String, required: true, unique: true },
    schoolId: { type: String, required: true, default: 'SCHOOL002' },
    staffId: { type: String, required: true },
    staffName: { type: String, required: true },
    staffType: { type: String, enum: ['Teaching', 'Non-Teaching'], default: 'Teaching' },
    designation: { type: String, required: true }, 
    department: { type: String, required: true }, 
    salaryMonth: { type: String, required: true }, 
    salaryYear: { type: Number, required: true }, 

    
    basicSalary: { type: Number, required: true, default: 0, min: 0 },
    hra: { type: Number, default: 0, min: 0 },
    allowances: { type: Number, default: 0, min: 0 },
    bonus: { type: Number, default: 0, min: 0 },
    incentives: { type: Number, default: 0, min: 0 },

    
    pf: { type: Number, default: 0, min: 0 },
    esi: { type: Number, default: 0, min: 0 },
    otherDeductions: { type: Number, default: 0, min: 0 },
    salaryAdvance: { type: Number, default: 0, min: 0 },

    
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


staffSalarySchema.index({ schoolId: 1, staffId: 1, salaryMonth: 1, salaryYear: 1 }, { unique: true });

module.exports = mongoose.model('StaffSalary', staffSalarySchema);
