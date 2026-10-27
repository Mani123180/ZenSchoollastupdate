const mongoose = require('mongoose');

const schoolExpenseSchema = new mongoose.Schema(
  {
    expenseId: { type: String, required: true, unique: true },
    schoolId: { type: String, required: true, default: 'SCHOOL002' },
    expenseCategory: {
      type: String,
      required: true,
      enum: [
        'Electricity and Utilities',
        'Maintenance',
        'Transport',
        'Office Expenses',
        'Cleaning and Security',
        'Academic and Activities',
        'Other Expenses'
      ]
    },
    expenseName: { type: String, required: true },
    description: { type: String, default: '' },
    vendorName: { type: String, required: true },
    invoiceNumber: { type: String, default: '' },
    expenseDate: { type: String, required: true },
    amount: { type: Number, required: true, min: 0 },
    paidAmount: { type: Number, default: 0, min: 0 },
    pendingAmount: { type: Number, required: true, min: 0 },

    paymentMethod: {
      type: String,
      enum: ['Cash', 'Bank Transfer', 'UPI / NetBanking', 'Cheque', 'Credit Card'],
      default: 'Bank Transfer'
    },
    paymentStatus: {
      type: String,
      enum: ['Paid', 'Pending', 'Partially Paid'],
      default: 'Pending'
    },
    paymentDate: { type: String, default: '' },
    remarks: { type: String, default: '' },
    attachmentUrl: { type: String, default: '' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('SchoolExpense', schoolExpenseSchema);
