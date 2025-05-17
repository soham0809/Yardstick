import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/db';
import Transaction from '../../../../models/Transaction';
import Budget from '../../../../models/Budget';

export async function GET(request) {
    try {
        await connectDB();

        // Parse query parameters
        const url = new URL(request.url);
        const month = parseInt(url.searchParams.get('month')) || new Date().getMonth() + 1;
        const year = parseInt(url.searchParams.get('year')) || new Date().getFullYear();

        console.log(`Budget vs Actual analysis for month: ${month}, year: ${year}`);

        // Get all budgets for the selected month/year
        const budgets = await Budget.find({ month, year });
        console.log(`Found ${budgets.length} budget entries`);

        // Create a map of budget amounts by category
        const budgetsByCategory = {};
        budgets.forEach(budget => {
            budgetsByCategory[budget.category] = budget.amount;
        });

        // Get all transactions for the selected month/year
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0);

        console.log(`Filtering transactions from ${startDate.toISOString()} to ${endDate.toISOString()}`);

        const transactions = await Transaction.find({
            date: { $gte: startDate, $lte: endDate }
        });

        console.log(`Found ${transactions.length} transactions for period`);

        // Calculate total spending by category
        const spendingByCategory = {};
        transactions.forEach(transaction => {
            const category = transaction.category || 'Other';
            spendingByCategory[category] = (spendingByCategory[category] || 0) + transaction.amount;
        });

        // Combine budget and actual data
        const categories = [...new Set([
            ...Object.keys(budgetsByCategory),
            ...Object.keys(spendingByCategory)
        ])];

        // If no categories found, return empty array
        if (categories.length === 0) {
            return NextResponse.json([], { status: 200 });
        }

        const result = categories.map(category => ({
            category,
            budget: budgetsByCategory[category] || 0,
            actual: spendingByCategory[category] || 0,
            remaining: (budgetsByCategory[category] || 0) - (spendingByCategory[category] || 0)
        }));

        return NextResponse.json(result, { status: 200 });
    } catch (error) {
        console.error('Budget vs Actual API error:', error);
        return NextResponse.json({
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        }, { status: 500 });
    }
} 