import mongoose from 'mongoose';

const BudgetSchema = new mongoose.Schema({
    category: {
        type: String,
        required: [true, 'Please add a category'],
        enum: ['Food', 'Transportation', 'Housing', 'Utilities', 'Entertainment', 'Healthcare', 'Shopping', 'Personal', 'Education', 'Travel', 'Other'],
    },
    amount: {
        type: Number,
        required: [true, 'Please add a budget amount'],
    },
    month: {
        type: Number,
        required: [true, 'Please add a month'],
        min: 1,
        max: 12,
    },
    year: {
        type: Number,
        required: [true, 'Please add a year'],
    },
}, {
    timestamps: true,
});

// Compound index to ensure there's only one budget per category per month
BudgetSchema.index({ category: 1, month: 1, year: 1 }, { unique: true });

export default mongoose.models.Budget || mongoose.model('Budget', BudgetSchema); 