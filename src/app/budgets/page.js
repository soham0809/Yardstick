"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import Button from '../../components/ui/button';
import Input from '../../components/ui/input';
import Select from '../../components/ui/select';

export default function BudgetsPage() {
    const [budgets, setBudgets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Form state
    const [formData, setFormData] = useState({
        category: '',
        amount: '',
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear()
    });

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

    const monthOptions = [
        { value: 1, label: 'January' },
        { value: 2, label: 'February' },
        { value: 3, label: 'March' },
        { value: 4, label: 'April' },
        { value: 5, label: 'May' },
        { value: 6, label: 'June' },
        { value: 7, label: 'July' },
        { value: 8, label: 'August' },
        { value: 9, label: 'September' },
        { value: 10, label: 'October' },
        { value: 11, label: 'November' },
        { value: 12, label: 'December' }
    ];

    // Generate year options (current year and 5 years in future/past)
    const currentYear = new Date().getFullYear();
    const yearOptions = Array.from({ length: 11 }, (_, i) => ({
        value: currentYear - 5 + i,
        label: (currentYear - 5 + i).toString()
    }));

    // Fetch all budgets for current month/year
    const fetchBudgets = async () => {
        try {
            setLoading(true);
            const res = await fetch(`/api/budgets?month=${formData.month}&year=${formData.year}`);
            const data = await res.json();
            setBudgets(data);
            setLoading(false);
        } catch (err) {
            setError('Failed to load budgets');
            setLoading(false);
            console.error(err);
        }
    };

    useEffect(() => {
        fetchBudgets();
    }, [formData.month, formData.year]);

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

        if (!formData.category) {
            errors.category = 'Please select a category';
        }

        if (!formData.amount || isNaN(formData.amount) || parseFloat(formData.amount) <= 0) {
            errors.amount = 'Please enter a valid amount';
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

        const budgetData = {
            ...formData,
            amount: parseFloat(formData.amount),
            month: parseInt(formData.month),
            year: parseInt(formData.year)
        };

        try {
            const res = await fetch('/api/budgets', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(budgetData)
            });

            if (!res.ok) throw new Error('Failed to save budget');

            // Reset form and refresh budgets
            setFormData({
                ...formData,
                category: '',
                amount: ''
            });

            fetchBudgets();
        } catch (err) {
            setError(err.message);
            console.error(err);
        }
    };

    // Get budget vs actual data
    const [budgetVsActual, setBudgetVsActual] = useState([]);

    const fetchBudgetVsActual = async () => {
        try {
            const res = await fetch(`/api/analysis/budget-vs-actual?month=${formData.month}&year=${formData.year}`);
            const data = await res.json();
            setBudgetVsActual(data);
        } catch (err) {
            console.error('Failed to load budget comparison data', err);
        }
    };

    useEffect(() => {
        fetchBudgetVsActual();
    }, [budgets, formData.month, formData.year]);

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">Budget Management</h1>

            {/* Month/Year Selection */}
            <Card>
                <CardHeader>
                    <CardTitle>Select Period</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="month" className="block text-sm font-medium text-gray-700 mb-1">
                                Month
                            </label>
                            <Select
                                id="month"
                                name="month"
                                value={formData.month}
                                onChange={handleChange}
                                options={monthOptions}
                            />
                        </div>

                        <div>
                            <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-1">
                                Year
                            </label>
                            <Select
                                id="year"
                                name="year"
                                value={formData.year}
                                onChange={handleChange}
                                options={yearOptions}
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Add Budget Form */}
            <Card>
                <CardHeader>
                    <CardTitle>Set Category Budget</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                                    placeholder="Select a category"
                                    error={formErrors.category}
                                />
                            </div>

                            <div>
                                <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
                                    Budget Amount
                                </label>
                                <Input
                                    id="amount"
                                    name="amount"
                                    type="number"
                                    step="0.01"
                                    value={formData.amount}
                                    onChange={handleChange}
                                    placeholder="Enter budget amount"
                                    error={formErrors.amount}
                                />
                            </div>
                        </div>

                        <Button type="submit" variant="primary">
                            Save Budget
                        </Button>
                    </form>
                </CardContent>
            </Card>

            {/* Budget vs Actual */}
            <Card>
                <CardHeader>
                    <CardTitle>Budget vs Actual Spending</CardTitle>
                </CardHeader>
                <CardContent>
                    {error && <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">{error}</div>}

                    {loading ? (
                        <div className="text-center py-4">Loading budget data...</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Budget</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Spent</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Remaining</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {budgetVsActual.length > 0 ? (
                                        budgetVsActual.map((item) => (
                                            <tr key={item.category}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {item.category}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    ${item.budget.toFixed(2)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    ${item.actual.toFixed(2)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    ${item.remaining.toFixed(2)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                    {item.remaining >= 0 ? (
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                            Within Budget
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                            Over Budget
                                                        </span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                                                No budget data found
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
} 