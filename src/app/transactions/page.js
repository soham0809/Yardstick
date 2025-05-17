"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import Button from '../../components/ui/button';
import Input from '../../components/ui/input';
import Select from '../../components/ui/select';

export default function TransactionsPage() {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Form state
    const [formData, setFormData] = useState({
        amount: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
        category: 'Other'
    });

    // Edit state
    const [editMode, setEditMode] = useState(false);
    const [editId, setEditId] = useState(null);

    // Form validation
    const [formErrors, setFormErrors] = useState({});

    const categoryOptions = [
        { value: 'Food', label: 'Food' },
        { value: 'Transportation', label: 'Transportation' },
        { value: 'Housing', label: 'Housing' },
        { value: 'Utilities', label: 'Utilities' },
        { value: 'Entertainment', label: 'Entertainment' },
        { value: 'Healthcare', label: 'Healthcare' },
        { value: 'Shopping', label: 'Shopping' },
        { value: 'Personal', label: 'Personal' },
        { value: 'Education', label: 'Education' },
        { value: 'Travel', label: 'Travel' },
        { value: 'Other', label: 'Other' }
    ];

    // Fetch all transactions
    const fetchTransactions = async () => {
        try {
            setLoading(true);
            const res = await fetch('/api/transactions');
            const data = await res.json();
            setTransactions(data);
            setLoading(false);
        } catch (err) {
            setError('Failed to load transactions');
            setLoading(false);
            console.error(err);
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, []);

    // Handle form input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        // Clear error for this field
        if (formErrors[name]) {
            setFormErrors({ ...formErrors, [name]: null });
        }
    };

    // Validate form
    const validateForm = () => {
        const errors = {};

        if (!formData.amount || isNaN(formData.amount) || parseFloat(formData.amount) <= 0) {
            errors.amount = 'Please enter a valid amount';
        }

        if (!formData.description.trim()) {
            errors.description = 'Description is required';
        }

        if (!formData.date) {
            errors.date = 'Date is required';
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        const transactionData = {
            ...formData,
            amount: parseFloat(formData.amount)
        };

        try {
            if (editMode) {
                // Update existing transaction
                const res = await fetch(`/api/transactions/${editId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(transactionData)
                });

                if (!res.ok) throw new Error('Failed to update transaction');
            } else {
                // Create new transaction
                const res = await fetch('/api/transactions', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(transactionData)
                });

                if (!res.ok) throw new Error('Failed to create transaction');
            }

            // Reset form and refresh transactions
            resetForm();
            fetchTransactions();
        } catch (err) {
            setError(err.message);
            console.error(err);
        }
    };

    // Delete a transaction
    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this transaction?')) {
            return;
        }

        try {
            const res = await fetch(`/api/transactions/${id}`, {
                method: 'DELETE'
            });

            if (!res.ok) throw new Error('Failed to delete transaction');

            fetchTransactions();
        } catch (err) {
            setError(err.message);
            console.error(err);
        }
    };

    // Edit a transaction
    const handleEdit = (transaction) => {
        setFormData({
            amount: transaction.amount.toString(),
            description: transaction.description,
            date: new Date(transaction.date).toISOString().split('T')[0],
            category: transaction.category || 'Other'
        });

        setEditMode(true);
        setEditId(transaction._id);
    };

    // Reset form
    const resetForm = () => {
        setFormData({
            amount: '',
            description: '',
            date: new Date().toISOString().split('T')[0],
            category: 'Other'
        });

        setEditMode(false);
        setEditId(null);
        setFormErrors({});
    };

    if (loading && transactions.length === 0) {
        return <div className="text-center py-10">Loading transactions...</div>;
    }

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">Transactions</h1>

            {/* Add/Edit Transaction Form */}
            <Card>
                <CardHeader>
                    <CardTitle>{editMode ? 'Edit Transaction' : 'Add New Transaction'}</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
                                    Amount
                                </label>
                                <Input
                                    id="amount"
                                    name="amount"
                                    type="number"
                                    step="0.01"
                                    value={formData.amount}
                                    onChange={handleChange}
                                    placeholder="Enter amount"
                                    error={formErrors.amount}
                                />
                            </div>

                            <div>
                                <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                                    Date
                                </label>
                                <Input
                                    id="date"
                                    name="date"
                                    type="date"
                                    value={formData.date}
                                    onChange={handleChange}
                                    error={formErrors.date}
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                                Description
                            </label>
                            <Input
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Enter description"
                                error={formErrors.description}
                            />
                        </div>

                        <div>
                            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                                Category
                            </label>
                            <Select
                                id="category"
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                options={categoryOptions}
                            />
                        </div>

                        <div className="flex gap-2">
                            <Button type="submit" variant="primary">
                                {editMode ? 'Update Transaction' : 'Add Transaction'}
                            </Button>

                            {editMode && (
                                <Button type="button" variant="secondary" onClick={resetForm}>
                                    Cancel
                                </Button>
                            )}
                        </div>
                    </form>
                </CardContent>
            </Card>

            {/* Transaction List */}
            <Card>
                <CardHeader>
                    <CardTitle>Transaction History</CardTitle>
                </CardHeader>
                <CardContent>
                    {error && <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">{error}</div>}

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {transactions.length > 0 ? (
                                    transactions.map((transaction) => (
                                        <tr key={transaction._id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {new Date(transaction.date).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {transaction.description}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {transaction.category || 'Other'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                ${transaction.amount.toFixed(2)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                <div className="flex gap-2">
                                                    <Button
                                                        variant="secondary"
                                                        size="small"
                                                        onClick={() => handleEdit(transaction)}
                                                    >
                                                        Edit
                                                    </Button>
                                                    <Button
                                                        variant="danger"
                                                        size="small"
                                                        onClick={() => handleDelete(transaction._id)}
                                                    >
                                                        Delete
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                                            No transactions found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
} 