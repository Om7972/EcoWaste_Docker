const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  organization: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization', required: true },
  category: { type: String, enum: ['fuel', 'maintenance', 'salary', 'equipment', 'other'], required: true },
  amount: { type: Number, required: true },
  description: { type: String },
  date: { type: Date, default: Date.now },
  vehicle: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle' },
  loggedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Expense', expenseSchema);
