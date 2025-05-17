import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/db';
import Transaction from '../../../../models/Transaction';

export async function GET(request) {
    try {
        await connectDB();

        // Parse query parameters
        const url = new URL(request.url);
        const month = parseInt(url.searchParams.get('month'));
        const year = parseInt(url.searchParams.get('year'));

        let dateFilter = {};

        if (month && year) {
            // Filter by specific month and year
            const startDate = new Date(year, month - 1, 1);
            const endDate = new Date(year, month, 0);
            dateFilter = { date: { $gte: startDate, $lte: endDate } };
            console.log(`Filtering category data for ${startDate.toISOString()} to ${endDate.toISOString()}`);
        } else if (year) {
            // Filter by full year
            const startDate = new Date(year, 0, 1);
            const endDate = new Date(year, 11, 31);
            dateFilter = { date: { $gte: startDate, $lte: endDate } };
            console.log(`Filtering category data for ${startDate.toISOString()} to ${endDate.toISOString()}`);
        } else {
            console.log('No date filter applied for category data');
        }

        const transactions = await Transaction.find(dateFilter);
        console.log(`Found ${transactions.length} transactions for category distribution`);

        // If no transactions, return empty array
        if (transactions.length === 0) {
            return NextResponse.json([], { status: 200 });
        }

        // Group by category and sum the amounts
        const categoryMap = {};
        transactions.forEach(transaction => {
            const category = transaction.category || 'Other';
            categoryMap[category] = (categoryMap[category] || 0) + transaction.amount;
        });

        // Convert to array format for pie chart
        const result = Object.entries(categoryMap).map(([category, amount]) => ({
            category,
            amount,
            percentage: (amount / transactions.reduce((sum, t) => sum + t.amount, 0)) * 100
        }));

        return NextResponse.json(result, { status: 200 });
    } catch (error) {
        console.error('Category distribution API error:', error);
        return NextResponse.json({
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        }, { status: 500 });
    }
} 