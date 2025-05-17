import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/db';
import Transaction from '../../../../models/Transaction';

export async function GET(request, { params }) {
    try {
        await connectDB();
        const transaction = await Transaction.findById(params.id);

        if (!transaction) {
            return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
        }

        return NextResponse.json(transaction, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PUT(request, { params }) {
    try {
        const body = await request.json();
        await connectDB();

        const transaction = await Transaction.findByIdAndUpdate(
            params.id,
            body,
            { new: true, runValidators: true }
        );

        if (!transaction) {
            return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
        }

        return NextResponse.json(transaction, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(request, { params }) {
    try {
        await connectDB();
        const transaction = await Transaction.findByIdAndDelete(params.id);

        if (!transaction) {
            return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Transaction deleted successfully' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
} 