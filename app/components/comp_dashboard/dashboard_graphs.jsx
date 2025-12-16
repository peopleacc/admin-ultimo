"use client";

import { useState, useEffect } from "react";
import dynamic from 'next/dynamic';

// Dynamic import ApexCharts untuk menghindari SSR issues
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

export default function DashboardGraphs() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const response = await fetch('/api/dashboard_stats');
            const result = await response.json();
            if (result.success) {
                setData(result.data);
            }
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 p-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 h-80 animate-pulse">
                        <div className="h-6 bg-gray-200 rounded w-2/3 mb-4"></div>
                        <div className="h-48 bg-gray-100 rounded"></div>
                    </div>
                ))}
            </div>
        );
    }

    // Chart configurations
    const chartBaseOptions = {
        chart: {
            toolbar: { show: false },
            fontFamily: 'Inter, sans-serif',
        },
        stroke: {
            curve: 'smooth'
        },
        grid: {
            borderColor: '#e7e7e7',
        },
    };

    // 1. Revenue Per Month (Area Chart)
    const revenueChartOptions = {
        ...chartBaseOptions,
        chart: {
            ...chartBaseOptions.chart,
            type: 'area',
        },
        colors: ['#6366f1'],
        fill: {
            type: 'gradient',
            gradient: {
                shadeIntensity: 1,
                opacityFrom: 0.7,
                opacityTo: 0.2,
                stops: [0, 100]
            }
        },
        xaxis: {
            categories: data?.revenuePerMonth?.map(d => d.month) || [],
            labels: { style: { colors: '#64748b' } }
        },
        yaxis: {
            labels: {
                formatter: (val) => `Rp ${(val / 1000000).toFixed(1)}jt`,
                style: { colors: '#64748b' }
            }
        },
        tooltip: {
            y: {
                formatter: (val) => `Rp ${val?.toLocaleString('id-ID')}`
            }
        },
        dataLabels: { enabled: false }
    };
    const revenueSeries = [{
        name: 'Revenue',
        data: data?.revenuePerMonth?.map(d => d.value) || []
    }];

    // 2. Orders Per Month (Bar Chart)
    const ordersChartOptions = {
        ...chartBaseOptions,
        chart: {
            ...chartBaseOptions.chart,
            type: 'bar',
        },
        colors: ['#10b981'],
        plotOptions: {
            bar: {
                borderRadius: 8,
                columnWidth: '60%',
            }
        },
        xaxis: {
            categories: data?.ordersPerMonth?.map(d => d.month) || [],
            labels: { style: { colors: '#64748b' } }
        },
        yaxis: {
            labels: { style: { colors: '#64748b' } }
        },
        dataLabels: { enabled: false }
    };
    const ordersSeries = [{
        name: 'Orders',
        data: data?.ordersPerMonth?.map(d => d.value) || []
    }];

    // 3. Customer Growth (Line Chart)
    const customerChartOptions = {
        ...chartBaseOptions,
        chart: {
            ...chartBaseOptions.chart,
            type: 'line',
        },
        colors: ['#f59e0b'],
        stroke: {
            curve: 'smooth',
            width: 4
        },
        markers: {
            size: 6,
            colors: ['#f59e0b'],
            strokeColors: '#fff',
            strokeWidth: 2
        },
        xaxis: {
            categories: data?.customerGrowth?.map(d => d.month) || [],
            labels: { style: { colors: '#64748b' } }
        },
        yaxis: {
            labels: { style: { colors: '#64748b' } }
        },
        dataLabels: { enabled: false }
    };
    const customerSeries = [{
        name: 'New Customers',
        data: data?.customerGrowth?.map(d => d.value) || []
    }];

    // 4. Order Status Breakdown (Donut Chart)
    const statusChartOptions = {
        ...chartBaseOptions,
        chart: {
            ...chartBaseOptions.chart,
            type: 'donut',
        },
        colors: ['#fbbf24', '#f97316', '#3b82f6', '#22c55e', '#ef4444'],
        labels: ['Pending', 'Waiting', 'In Progress', 'Completed', 'Cancelled'],
        legend: {
            position: 'bottom',
            labels: { colors: '#64748b' }
        },
        plotOptions: {
            pie: {
                donut: {
                    size: '65%',
                    labels: {
                        show: true,
                        total: {
                            show: true,
                            label: 'Total',
                            color: '#64748b',
                            formatter: () => data?.summary?.totalOrders || 0
                        }
                    }
                }
            }
        },
        dataLabels: { enabled: false }
    };
    const statusSeries = data?.orderStatusBreakdown
        ? [
            data.orderStatusBreakdown.pending,
            data.orderStatusBreakdown.waiting,
            data.orderStatusBreakdown.proses,
            data.orderStatusBreakdown.selesai,
            data.orderStatusBreakdown.cancel
        ]
        : [];

    // 5. Service Preferences (Polar Area Chart)
    const preferencesChartOptions = {
        ...chartBaseOptions,
        chart: {
            ...chartBaseOptions.chart,
            type: 'polarArea',
        },
        colors: ['#8b5cf6', '#ec4899', '#06b6d4', '#84cc16', '#f43f5e'],
        labels: data?.servicePreferences?.map(d => d.name) || [],
        legend: {
            position: 'bottom',
            labels: { colors: '#64748b' }
        },
        plotOptions: {
            polarArea: {
                rings: { strokeWidth: 1, strokeColor: '#e7e7e7' },
                spokes: { strokeWidth: 1, strokeColor: '#e7e7e7' }
            }
        },
        stroke: { width: 1 },
        fill: { opacity: 0.8 }
    };
    const preferencesSeries = data?.servicePreferences?.map(d => d.value) || [];

    // 6. Payment Status (Radial Bar Chart)
    const totalPayments = (data?.paymentStatus?.paid || 0) + (data?.paymentStatus?.unpaid || 0);
    const paidPercentage = totalPayments > 0
        ? Math.round((data.paymentStatus.paid / totalPayments) * 100)
        : 0;

    const paymentChartOptions = {
        ...chartBaseOptions,
        chart: {
            ...chartBaseOptions.chart,
            type: 'radialBar',
        },
        colors: ['#22c55e', '#ef4444'],
        plotOptions: {
            radialBar: {
                hollow: {
                    size: '50%',
                },
                track: {
                    background: '#f1f5f9'
                },
                dataLabels: {
                    name: {
                        fontSize: '16px',
                        color: '#64748b'
                    },
                    value: {
                        fontSize: '24px',
                        fontWeight: 700,
                        color: '#1f2937'
                    },
                    total: {
                        show: true,
                        label: 'Paid',
                        formatter: () => `${paidPercentage}%`
                    }
                }
            }
        },
        labels: ['Paid', 'Unpaid']
    };
    const paymentSeries = [paidPercentage, 100 - paidPercentage];

    return (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden" style={{ height: 'calc(100vh - 14rem)' }}>
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-purple-50">
                <div>
                    <h2 className="text-xl font-bold text-gray-800">📊 Dashboard Analytics</h2>
                    <p className="text-sm text-gray-600">Business performance overview with interactive charts</p>
                </div>
                <div className="flex gap-4 text-sm">
                    <div className="px-4 py-2 bg-white rounded-lg shadow-sm border">
                        <span className="text-gray-500">Total Revenue</span>
                        <p className="font-bold text-indigo-600">Rp {data?.summary?.totalRevenue?.toLocaleString('id-ID')}</p>
                    </div>
                    <div className="px-4 py-2 bg-white rounded-lg shadow-sm border">
                        <span className="text-gray-500">Total Orders</span>
                        <p className="font-bold text-green-600">{data?.summary?.totalOrders}</p>
                    </div>
                    <div className="px-4 py-2 bg-white rounded-lg shadow-sm border">
                        <span className="text-gray-500">Total Customers</span>
                        <p className="font-bold text-amber-600">{data?.summary?.totalCustomers}</p>
                    </div>
                </div>
            </div>

            {/* Chart Grid */}
            <div className="overflow-y-auto p-6" style={{ height: 'calc(100% - 100px)' }}>
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">

                    {/* 1. Revenue Per Month */}
                    <div className="bg-gradient-to-br from-indigo-50 to-white rounded-2xl p-5 shadow-md border border-indigo-100 hover:shadow-lg transition-all">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-indigo-500 flex items-center justify-center">
                                <i className="bi bi-graph-up-arrow text-white text-lg"></i>
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-800">Revenue Per Month</h3>
                                <p className="text-xs text-gray-500">Last 6 months trend</p>
                            </div>
                        </div>
                        <Chart options={revenueChartOptions} series={revenueSeries} type="area" height={220} />
                    </div>

                    {/* 2. Orders Per Month */}
                    <div className="bg-gradient-to-br from-emerald-50 to-white rounded-2xl p-5 shadow-md border border-emerald-100 hover:shadow-lg transition-all">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center">
                                <i className="bi bi-bag-check text-white text-lg"></i>
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-800">Orders Per Month</h3>
                                <p className="text-xs text-gray-500">Monthly order volume</p>
                            </div>
                        </div>
                        <Chart options={ordersChartOptions} series={ordersSeries} type="bar" height={220} />
                    </div>

                    {/* 3. Customer Growth */}
                    <div className="bg-gradient-to-br from-amber-50 to-white rounded-2xl p-5 shadow-md border border-amber-100 hover:shadow-lg transition-all">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center">
                                <i className="bi bi-people text-white text-lg"></i>
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-800">Customer Growth</h3>
                                <p className="text-xs text-gray-500">New customers per month</p>
                            </div>
                        </div>
                        <Chart options={customerChartOptions} series={customerSeries} type="line" height={220} />
                    </div>

                    {/* 4. Order Status Breakdown */}
                    <div className="bg-gradient-to-br from-blue-50 to-white rounded-2xl p-5 shadow-md border border-blue-100 hover:shadow-lg transition-all">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center">
                                <i className="bi bi-pie-chart text-white text-lg"></i>
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-800">Order Status</h3>
                                <p className="text-xs text-gray-500">Status distribution</p>
                            </div>
                        </div>
                        <Chart options={statusChartOptions} series={statusSeries} type="donut" height={220} />
                    </div>

                    {/* 5. Service Preferences */}
                    <div className="bg-gradient-to-br from-purple-50 to-white rounded-2xl p-5 shadow-md border border-purple-100 hover:shadow-lg transition-all">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-purple-500 flex items-center justify-center">
                                <i className="bi bi-stars text-white text-lg"></i>
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-800">Service Preferences</h3>
                                <p className="text-xs text-gray-500">Customer service choices</p>
                            </div>
                        </div>
                        {preferencesSeries.length > 0 ? (
                            <Chart options={preferencesChartOptions} series={preferencesSeries} type="polarArea" height={220} />
                        ) : (
                            <div className="h-56 flex items-center justify-center text-gray-400">
                                <span>No preference data available</span>
                            </div>
                        )}
                    </div>

                    {/* 6. Payment Status */}
                    <div className="bg-gradient-to-br from-rose-50 to-white rounded-2xl p-5 shadow-md border border-rose-100 hover:shadow-lg transition-all">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-rose-500 flex items-center justify-center">
                                <i className="bi bi-credit-card text-white text-lg"></i>
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-800">Payment Status</h3>
                                <p className="text-xs text-gray-500">Paid vs Unpaid orders</p>
                            </div>
                        </div>
                        <Chart options={paymentChartOptions} series={paymentSeries} type="radialBar" height={220} />
                        <div className="flex justify-center gap-6 mt-2">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                <span className="text-sm text-gray-600">Paid: {data?.paymentStatus?.paid || 0}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                <span className="text-sm text-gray-600">Unpaid: {data?.paymentStatus?.unpaid || 0}</span>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
