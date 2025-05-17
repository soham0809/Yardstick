import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/db';
import Transaction from '../../../../models/Transaction';

export async function GET(request) {
    try {
        // Connect to the database
        await connectDB();

        // Parse query parameters
        const url = new URL(request.url);
        const year = parseInt(url.searchParams.get('year')) || new Date().getFullYear();

        // Get all transactions for the selected year
        const startDate = new Date(year, 0, 1);
        const endDate = new Date(year, 11, 31);

        console.log(`Fetching transactions for year: ${year} (${startDate.toISOString()} to ${endDate.toISOString()})`);

        const transactions = await Transaction.find({
            date: { $gte: startDate, $lte: endDate }
        });

        console.log(`Found ${transactions.length} transactions for year ${year}`);

        // Initialize monthly expenses array
        const monthlyExpenses = Array(12).fill(0);

        // Sum expenses by month
        transactions.forEach(transaction => {
            const month = new Date(transaction.date).getMonth();
            monthlyExpenses[month] += transaction.amount;
        });

        // Format the result
        const result = monthlyExpenses.map((amount, index) => ({
            month: index + 1,
            monthName: new Date(year, index, 1).toLocaleString('default', { month: 'long' }),
            amount
        }));

        return NextResponse.json(result, { status: 200 });
    } catch (error) {
        console.error('Monthly expenses API error:', error);
        return NextResponse.json({
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        }, { status: 500 });
    }
} 