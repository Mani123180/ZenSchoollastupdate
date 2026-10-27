const mongoose = require('mongoose');

// Fee Item Schema (Separate items, never hardcoded single amount)
const feeItemSchema = new mongoose.Schema({
  feeType: { type: String, required: true }, // e.g. Tuition Fees, Transport Fees, Sports Fees, etc.
  description: { type: String, default: '' },
  amount: { type: Number, required: true, min: 0 },
  discount: { type: Number, default: 0, min: 0 },
  fine: { type: Number, default: 0, min: 0 },
  netAmount: { type: Number, required: true, min: 0 },
  status: { type: String, enum: ['Paid', 'Unpaid'], default: 'Unpaid' },
  paidAmount: { type: Number, default: 0, min: 0 }
});

const studentBillSchema = new mongoose.Schema(
  {
    invoiceNumber: { type: String, required: true, unique: true },
    schoolId: { type: String, required: true, default: 'SCHOOL002' },
    studentId: { type: String, required: true },
    studentName: { type: String, required: true },
    admissionNumber: { type: String, default: '' },
    rollNo: { type: String, default: '' },
    grade: { type: String, required: true },
    section: { type: String, default: 'A' },
    academicYear: { type: String, required: true, default: '2026-2027' },
    billingMonth: { type: String, required: true },
    billingDate: { type: String, required: true },
    dueDate: { type: String, required: true },

    feeItems: [feeItemSchema],

    totalFees: { type: Number, required: true, min: 0 },
    paidAmount: { type: Number, default: 0, min: 0 },
    pendingAmount: { type: Number, required: true, min: 0 },

    paymentStatus: {
      type: String,
      enum: ['Paid', 'Unpaid', 'Partially Paid', 'Overdue'],
      default: 'Unpaid'
    },
    paymentMethod: { type: String, default: 'Cash' },
    parentName: { type: String, default: '' },
    parentPhone: { type: String, default: '' },
    remarks: { type: String, default: '' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('StudentBill', studentBillSchema);
