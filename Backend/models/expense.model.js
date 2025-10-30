import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema({
    title:{type: String, required: true, trim: true, maxlength: 100},
    amount: { type: Number, required: true, min: 0.01 },
    description: { type: String, required: true, trim: true },
    date: { type: Date, required: true },
    category: { type: String, required: true, enum: ['Food', 'Transport','Shopping', 'Bills','Utilities', 'Entertainment', 'Health', 'Other'] },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

export const Expense = mongoose.model('Expense', expenseSchema);

