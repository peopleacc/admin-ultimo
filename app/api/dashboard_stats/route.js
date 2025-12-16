import { supabase } from "@/lib/supabaseClient";
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        // 1. Get monthly revenue data
        const { data: orders, error: ordersError } = await supabase
            .from('t_pemesanan')
            .select('total_estimasi_harga, created_at, status_pengerjaan, status_pembayaran');

        if (ordersError) throw ordersError;

        // 2. Get all customers
        const { data: customers, error: customersError } = await supabase
            .from('m_customers')
            .select('user_id, create_at, preferensi_layanan');

        if (customersError) throw customersError;

        // Process monthly revenue
        const monthlyRevenue = {};
        const monthlyOrders = {};
        const statusCount = { pending: 0, waiting: 0, proses: 0, selesai: 0, cancel: 0 };

        orders?.forEach(order => {
            const date = new Date(order.created_at);
            const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

            // Revenue per month
            monthlyRevenue[monthKey] = (monthlyRevenue[monthKey] || 0) + (order.total_estimasi_harga || 0);

            // Orders per month
            monthlyOrders[monthKey] = (monthlyOrders[monthKey] || 0) + 1;

            // Status count
            const status = order.status_pengerjaan?.toLowerCase();
            if (status === 'pending') statusCount.pending++;
            else if (status === 'waiting') statusCount.waiting++;
            else if (status === 'proses' || status === 'progress') statusCount.proses++;
            else if (status === 'selesai' || status === 'completed') statusCount.selesai++;
            else if (status === 'cancel' || status === 'cancelled') statusCount.cancel++;
        });

        // Process monthly customer growth
        const monthlyCustomers = {};
        customers?.forEach(customer => {
            const date = new Date(customer.create_at);
            const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            monthlyCustomers[monthKey] = (monthlyCustomers[monthKey] || 0) + 1;
        });

        // Get last 6 months
        const months = [];
        const now = new Date();
        for (let i = 5; i >= 0; i--) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
            const monthName = d.toLocaleDateString('id-ID', { month: 'short', year: 'numeric' });
            months.push({ key, name: monthName });
        }

        // Format data for charts
        const revenueData = months.map(m => ({
            month: m.name,
            value: monthlyRevenue[m.key] || 0
        }));

        const ordersData = months.map(m => ({
            month: m.name,
            value: monthlyOrders[m.key] || 0
        }));

        const customerGrowthData = months.map(m => ({
            month: m.name,
            value: monthlyCustomers[m.key] || 0
        }));

        // Service preference distribution
        const servicePreferences = {};
        customers?.forEach(c => {
            if (c.preferensi_layanan) {
                servicePreferences[c.preferensi_layanan] = (servicePreferences[c.preferensi_layanan] || 0) + 1;
            }
        });

        const preferenceData = Object.entries(servicePreferences).map(([name, value]) => ({
            name,
            value
        }));

        // Payment status
        const paymentStatus = { paid: 0, unpaid: 0 };
        orders?.forEach(order => {
            const payment = order.status_pembayaran?.toLowerCase();
            if (payment === 'paid' || payment === 'lunas' || payment === 'terbayar') {
                paymentStatus.paid++;
            } else {
                paymentStatus.unpaid++;
            }
        });

        return NextResponse.json({
            success: true,
            data: {
                revenuePerMonth: revenueData,
                ordersPerMonth: ordersData,
                customerGrowth: customerGrowthData,
                orderStatusBreakdown: statusCount,
                servicePreferences: preferenceData,
                paymentStatus,
                summary: {
                    totalRevenue: orders?.reduce((sum, o) => sum + (o.total_estimasi_harga || 0), 0) || 0,
                    totalOrders: orders?.length || 0,
                    totalCustomers: customers?.length || 0
                }
            }
        });

    } catch (error) {
        console.error('Dashboard stats error:', error);
        return NextResponse.json({
            success: false,
            error: error.message
        }, { status: 500 });
    }
}
