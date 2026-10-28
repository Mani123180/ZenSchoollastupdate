const mongoose = require('mongoose');

const paymentHistorySchema = new mongoose.Schema(
  {
    transactionId: { type: String, required: true, unique: true },
    schoolId: { type: String, required: true, default: 'SCHOOL002' },
    transactionDate: { type: String, required: true },
    transactionType: {
      type: String,
      required: true,
      enum: ['Student Fee Payment', 'Staff Salary Payment', 'School Expense Payment']
    },
    referenceId: { type: String, default: '' }, 
    invoiceNumber: { type: String, default: '' },
    partyName: { type: String, required: true }, 
    partyRole: { type: String, default: '' }, 
    amount: { type: Number, required: true, min: 0.01 },
    paymentMethod: {
      type: String,
      default: 'Cash',
      enum: ['Cash', 'Bank Transfer', 'UPI / NetBanking', 'Cheque', 'Credit Card', 'Online Portal']
    },
    paymentStatus: {
      type: String,
      enum: ['Completed', 'Pending', 'Failed', 'Reversed'],
      default: 'Completed'
    },
    remarks: { type: String, default: '' },
    recordedBy: { type: String, default: 'School Admin' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('PaymentHistory', paymentHistorySchema);
