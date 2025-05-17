import mongoose from 'mongoose';

const TransactionSchema = new mongoose.Schema({
    amount: {
        type: Number,
        required: [true, 'Please add an amount'],
    },
    description: {
        type: String,
        required: [true, 'Please add a description'],
        trim: true,
    },
    date: {
        type: Date,
        required: [true, 'Please add a date'],
        default: Date.now,
    },
    category: {
        type: String,
        required: false,
        enum: ['Food', 'Transportation', 'Housing', 'Utilities', 'Entertainment', 'Healthcare', 'Shopping', 'Personal', 'Education', 'Travel', 'Other'],
        default: 'Other',
    },
}, {
    timestamps: true,
});

export default mongoose.models.Transaction || mongoose.model('Transaction', TransactionSchema); 