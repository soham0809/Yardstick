"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import Select from '../../components/ui/select';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    LineChart,
    Line
} from 'recharts';

export default function AnalyticsPage() {
    const [monthlyData, setMonthlyData] = useState([]);
    const [categoryData, setCategoryData] = useState([]);
    const [budgetVsActual, setBudgetVsActual] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Filter state
    const [filters, setFilters] = useState({
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear()
    });

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82ca9d', '#ffc658', '#8dd1e1', '#a4de6c', '#d0ed57'];

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

    // Generate year options (current year and 5 years in past)
    const currentYear = new Date().getFullYear();
    const yearOptions = Array.from({ length: 6 }, (_, i) => ({
        value: currentYear - i,
        label: (currentYear - i).toString()
    }));

    // Handle filter changes
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters({ ...filters, [name]: value });
    };

    // Fetch data
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                // Fetch monthly expenses
                const monthlyRes = await fetch(`/api/analysis/monthly-expenses?year=${filters.year}`);
                if (!monthlyRes.ok) {
                    console.error('Monthly expenses API error:', await monthlyRes.text());
                    setMonthlyData([]);
                } else {
                    const monthlyData = await monthlyRes.json();
                    setMonthlyData(Array.isArray(monthlyData) ? monthlyData : []);
                }

                // Fetch category distribution
                const categoryRes = await fetch(`/api/analysis/category-distribution?month=${filters.month}&year=${filters.year}`);
                if (!categoryRes.ok) {
                    console.error('Category distribution API error:', await categoryRes.text());
                    setCategoryData([]);
                } else {
                    const categoryData = await categoryRes.json();
                    setCategoryData(Array.isArray(categoryData) ? categoryData : []);
                }

                // Fetch budget vs actual
                const budgetRes = await fetch(`/api/analysis/budget-vs-actual?month=${filters.month}&year=${filters.year}`);
                if (!budgetRes.ok) {
                    console.error('Budget vs actual API error:', await budgetRes.text());
                    setBudgetVsActual([]);
                } else {
                    const budgetData = await budgetRes.json();
                    setBudgetVsActual(Array.isArray(budgetData) ? budgetData : []);
                }

                setLoading(false);
            } catch (err) {
                setError('Failed to load analytics data: ' + err.message);
                setLoading(false);
                console.error(err);
            }
        };

        fetchData();
    }, [filters]);

    if (loading) {
        return <div className="text-center py-10">Loading analytics data...</div>;
    }

    if (error) {
        return <div className="text-center py-10 text-red-500">{error}</div>;
    }

    // Calculate spending trends
    const calculateSpendingInsights = () => {
        if (!Array.isArray(monthlyData) || monthlyData.length === 0) return null;

        try {
            const totalSpending = monthlyData.reduce((sum, month) => sum + (month.amount || 0), 0);
            const nonZeroMonths = monthlyData.filter(m => m.amount > 0);
            const avgMonthlySpending = nonZeroMonths.length ? totalSpending / nonZeroMonths.length : 0;

            // Find highest spending month
            const highestMonth = nonZeroMonths.length ?
                nonZeroMonths.reduce((prev, current) => (prev.amount > current.amount) ? prev : current, { amount: 0 }) :
                { monthName: 'None', amount: 0 };

            // Find lowest spending month (excluding zero amounts)
            const lowestMonth = nonZeroMonths.length ?
                nonZeroMonths.reduce((prev, current) => (prev.amount < current.amount) ? prev : current, { amount: Infinity }) :
                { monthName: 'None', amount: 0 };

            return {
                totalSpending,
                avgMonthlySpending,
                highestMonth,
                lowestMonth
            };
        } catch (err) {
            console.error('Error calculating insights:', err);
            return null;
        }
    };

    const insights = calculateSpendingInsights();

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">Financial Analytics</h1>

            {/* Filters */}
            <Card>
                <CardHeader>
                    <CardTitle>Filter Analytics</CardTitle>
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
                                value={filters.month}
                                onChange={handleFilterChange}
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
                                value={filters.year}
                                onChange={handleFilterChange}
                                options={yearOptions}
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Insights */}
            {insights && (
                <Card>
                    <CardHeader>
                        <CardTitle>Spending Insights</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-gray-50 p-4 rounded">
                                <h3 className="text-sm font-medium text-gray-500">Total Annual Spending</h3>
                                <p className="mt-1 text-lg font-semibold">${insights.totalSpending.toFixed(2)}</p>
                            </div>

                            <div className="bg-gray-50 p-4 rounded">
                                <h3 className="text-sm font-medium text-gray-500">Average Monthly Spending</h3>
                                <p className="mt-1 text-lg font-semibold">${insights.avgMonthlySpending.toFixed(2)}</p>
                            </div>

                            <div className="bg-gray-50 p-4 rounded">
                                <h3 className="text-sm font-medium text-gray-500">Highest Spending Month</h3>
                                <p className="mt-1 text-lg font-semibold">
                                    {insights.highestMonth.monthName}: ${insights.highestMonth.amount.toFixed(2)}
                                </p>
                            </div>

                            <div className="bg-gray-50 p-4 rounded">
                                <h3 className="text-sm font-medium text-gray-500">Lowest Spending Month</h3>
                                <p className="mt-1 text-lg font-semibold">
                                    {insights.lowestMonth.monthName}: ${insights.lowestMonth.amount.toFixed(2)}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Monthly Expenses */}
                <Card>
                    <CardHeader>
                        <CardTitle>Monthly Expenses ({filters.year})</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={monthlyData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="monthName" />
                                    <YAxis />
                                    <Tooltip formatter={(value) => [`$${value}`, 'Amount']} />
                                    <Bar dataKey="amount" fill="#3b82f6" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Category Distribution */}
                <Card>
                    <CardHeader>
                        <CardTitle>
                            Spending by Category ({monthOptions.find(m => m.value === filters.month)?.label} {filters.year})
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={categoryData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="amount"
                                        nameKey="category"
                                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                    >
                                        {categoryData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={(value) => [`$${value}`, 'Amount']} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Budget vs Actual */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>
                            Budget vs Actual ({monthOptions.find(m => m.value === filters.month)?.label} {filters.year})
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    data={budgetVsActual}
                                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="category" />
                                    <YAxis />
                                    <Tooltip formatter={(value) => [`$${value}`, 'Amount']} />
                                    <Legend />
                                    <Bar dataKey="budget" fill="#8884d8" name="Budget" />
                                    <Bar dataKey="actual" fill="#82ca9d" name="Actual" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
} 