import { NextResponse } from 'next/server';
import connectDB from '../../../lib/db';
import Budget from '../../../models/Budget';

export async function GET(request) {
    try {
        await connectDB();

        // Parse query parameters
        const url = new URL(request.url);
        const month = url.searchParams.get('month');
        const year = url.searchParams.get('year');

        let query = {};

        if (month && year) {
            query = { month: parseInt(month), year: parseInt(year) };
        }

        const budgets = await Budget.find(query);

        return NextResponse.json(budgets, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const body = await request.json();
        await connectDB();

        // Check if budget for this category/month/year already exists
        const existingBudget = await Budget.findOne({
            category: body.category,
            month: body.month,
            year: body.year
        });

        let budget;

        if (existingBudget) {
            // Update existing budget
            existingBudget.amount = body.amount;
            budget = await existingBudget.save();
        } else {
            // Create new budget
            budget = await Budget.create(body);
        }

        return NextResponse.json(budget, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
} 