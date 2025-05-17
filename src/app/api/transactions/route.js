import { NextResponse } from 'next/server';
import connectDB from '../../../lib/db';
import Transaction from '../../../models/Transaction';

export async function GET() {
    try {
        await connectDB();
        const transactions = await Transaction.find({}).sort({ date: -1 });

        return NextResponse.json(transactions, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const body = await request.json();
        await connectDB();

        const transaction = await Transaction.create(body);

        return NextResponse.json(transaction, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
} 