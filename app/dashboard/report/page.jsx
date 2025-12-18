import { supabase } from "@/lib/supabaseClient";
import {
  RevenueTrendChart,
  StatusDonutChart,
} from "@/app/components/report/charts";
import Link from "next/link";

const currency = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  minimumFractionDigits: 0,
});

const monthFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
});

function buildMonthlyTrend(orders = []) {
  const buckets = new Map();

  orders.forEach((order) => {
    if (!order?.create_at) return;
    const date = new Date(order.create_at);
    const bucketKey = `${date.getFullYear()}-${date.getMonth()}`;
    const previous = buckets.get(bucketKey) || {
      date,
      total: 0,
      label: `${monthFormatter.format(date)} ${date.getFullYear()}`,
    };

    previous.total += Number(order?.total_estimasi_harga) || 0;
    buckets.set(bucketKey, previous);
  });

  const sorted = [...buckets.values()].sort(
    (a, b) => a.date.getTime() - b.date.getTime()
  );

  const lastSix = sorted.slice(-6);

  return {
    categories: lastSix.map((item) => item.label),
    data: lastSix.map((item) => item.total),
  };
}

function buildStatusBreakdown(orders = []) {
  const statusMap = orders.reduce((acc, order) => {
    const label = order?.status_pengerjaan?.trim() || "Unknown";
    acc[label] = (acc[label] || 0) + 1;
    return acc;
  }, {});

  const labels = Object.keys(statusMap);
  const data = labels.map((label) => statusMap[label]);

  return { labels, data };
}

export default async function ReportPage({ searchParams }) {
  const filter = (await searchParams)?.filter || "overview";

  const { data: orders, error } = await supabase
    .from("t_pemesanan")
    .select("pesanan_id, status_pengerjaan, status_pembayaran, total_estimasi_harga, create_at, m_customers(nama)")
    .order("create_at", { ascending: false });

  if (error) {
    return (
      <div className="glass-panel p-6 text-red-600">
        Failed to load report: {error.message}
      </div>
    );
  }

  // Filter orders based on type
  const pendingOrders = orders.filter(
    (order) => ['pending', 'waiting'].includes(order?.status_pengerjaan?.toLowerCase())
  );
  const completedOrders = orders.filter(
    (order) => order?.status_pengerjaan?.toLowerCase() === "selesai"
  );

  const totalOrders = orders.length;
  const totalRevenue = orders.reduce(
    (sum, order) => sum + (Number(order.total_estimasi_harga) || 0),
    0
  );
  const completionRate = totalOrders
    ? Math.round((completedOrders.length / totalOrders) * 100)
    : 0;
  const avgTicket = totalOrders ? totalRevenue / totalOrders : 0;

  const monthlyTrend = buildMonthlyTrend(orders);
  const statusBreakdown = buildStatusBreakdown(orders);

  // Determine which data to show in table
  let tableData = orders;
  let tableTitle = "All Orders";

  if (filter === "pending") {
    tableData = pendingOrders;
    tableTitle = "Pending Orders";
  } else if (filter === "completed") {
    tableData = completedOrders;
    tableTitle = "Completed Orders";
  } else if (filter === "revenue") {
    tableData = completedOrders;
    tableTitle = "Revenue Details";
  }

  const tabs = [
    { id: "overview", label: "Overview", icon: "bi-grid" },
    { id: "all", label: "All Orders", icon: "bi-box-seam" },
    { id: "pending", label: "Pending", icon: "bi-clock" },
    { id: "completed", label: "Completed", icon: "bi-check-circle" },
    { id: "revenue", label: "Revenue", icon: "bi-wallet2" },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden" style={{ height: 'calc(100vh - 14rem)' }}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Report & Analytics</h2>
          <p className="text-sm text-gray-600">View detailed business reports</p>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex gap-2 p-3 border-b border-gray-200 bg-gray-50 overflow-x-auto">
        {tabs.map((tab) => (
          <Link
            key={tab.id}
            href={`/dashboard/report?filter=${tab.id}`}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${filter === tab.id
                ? "bg-indigo-600 text-white shadow-md"
                : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
              }`}
          >
            <i className={`bi ${tab.icon}`}></i>
            {tab.label}
          </Link>
        ))}
      </div>

      {/* Scrollable Content */}
      <div className="overflow-y-auto p-4" style={{ height: 'calc(100% - 140px)' }}>
        {filter === "overview" ? (
          <section className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
              <SummaryCard label="Total Revenue" value={currency.format(totalRevenue)} />
              <SummaryCard label="Total Order" value={totalOrders} />
              <SummaryCard label="Completion Rate" value={`${completionRate}%`} />
              <SummaryCard label="Average Ticket" value={currency.format(avgTicket)} />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              <div className="glass-panel p-6 xl:col-span-2">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-sm uppercase tracking-[0.3em] text-[#2D336B]/60">
                      Trend
                    </p>
                    <h2 className="text-2xl font-semibold text-[#2D336B]">
                      Revenue Last 6 Months
                    </h2>
                  </div>
                </div>
                {monthlyTrend.data.length ? (
                  <RevenueTrendChart {...monthlyTrend} />
                ) : (
                  <EmptyState message="No revenue data yet" />
                )}
              </div>

              <div className="glass-panel p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-sm uppercase tracking-[0.3em] text-[#2D336B]/60">
                      Status
                    </p>
                    <h2 className="text-2xl font-semibold text-[#2D336B]">
                      Order Distribution
                    </h2>
                  </div>
                </div>
                {statusBreakdown.data.length ? (
                  <StatusDonutChart {...statusBreakdown} />
                ) : (
                  <EmptyState message="No orders recorded yet" />
                )}
              </div>
            </div>
          </section>
        ) : (
          <section className="space-y-4">
            {/* Table Section */}
            <div className="glass-panel p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-[#2D336B]/60">
                    Data Table
                  </p>
                  <h2 className="text-2xl font-semibold text-[#2D336B]">
                    {tableTitle} ({tableData.length})
                  </h2>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-[#2D336B]/10">
                  <thead className="bg-gray-50">
                    <tr>
                      {["ID", "Customer", "Date", "Status", "Payment", "Total"].map((head) => (
                        <th
                          key={head}
                          className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#2D336B]/70"
                        >
                          {head}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#2D336B]/10 bg-white">
                    {tableData.length ? (
                      tableData.map((order) => (
                        <tr key={order.pesanan_id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-3 font-semibold text-[#2D336B]">
                            #{order.pesanan_id}
                          </td>
                          <td className="px-4 py-3 text-[#2D336B]/80">
                            {order.m_customers?.nama || "-"}
                          </td>
                          <td className="px-4 py-3 text-[#2D336B]/80">
                            {order.create_at
                              ? new Date(order.create_at).toLocaleDateString("id-ID", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              })
                              : "-"}
                          </td>
                          <td className="px-4 py-3">
                            <StatusBadge status={order.status_pengerjaan} />
                          </td>
                          <td className="px-4 py-3">
                            <PaymentBadge status={order.status_pembayaran} />
                          </td>
                          <td className="px-4 py-3 font-semibold text-[#2D336B]">
                            {currency.format(Number(order.total_estimasi_harga) || 0)}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          className="px-4 py-6 text-center text-[#2D336B]/60"
                          colSpan={6}
                        >
                          No data found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Revenue Summary for Revenue Tab */}
              {filter === "revenue" && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-[#2D336B]">Total Revenue (Completed Orders)</span>
                    <span className="text-2xl font-bold text-green-600">
                      {currency.format(completedOrders.reduce((sum, o) => sum + (Number(o.total_estimasi_harga) || 0), 0))}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

function SummaryCard({ label, value }) {
  return (
    <div className="glass-panel p-5 flex flex-col gap-2">
      <p className="text-xs uppercase tracking-[0.3em] text-[#2D336B]/60">
        {label}
      </p>
      <p className="text-2xl font-semibold text-[#2D336B]">{value}</p>
    </div>
  );
}

function StatusBadge({ status }) {
  const statusLower = status?.toLowerCase() || "";
  let bgColor = "bg-gray-100 text-gray-600";

  if (statusLower === "pending" || statusLower === "waiting") {
    bgColor = "bg-amber-100 text-amber-700";
  } else if (statusLower === "proses" || statusLower === "progress") {
    bgColor = "bg-blue-100 text-blue-700";
  } else if (statusLower === "selesai" || statusLower === "completed") {
    bgColor = "bg-green-100 text-green-700";
  } else if (statusLower === "cancel" || statusLower === "cancelled") {
    bgColor = "bg-red-100 text-red-700";
  }

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${bgColor}`}>
      {status || "Unknown"}
    </span>
  );
}

function PaymentBadge({ status }) {
  const statusLower = status?.toLowerCase() || "";
  let bgColor = "bg-gray-100 text-gray-600";

  if (statusLower === "paid" || statusLower === "lunas" || statusLower === "terbayar") {
    bgColor = "bg-green-100 text-green-700";
  } else if (statusLower === "unpaid" || statusLower === "belum bayar") {
    bgColor = "bg-red-100 text-red-700";
  } else if (statusLower === "dp" || statusLower === "partial") {
    bgColor = "bg-yellow-100 text-yellow-700";
  }

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${bgColor}`}>
      {status || "-"}
    </span>
  );
}

function EmptyState({ message }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center text-[#2D336B]/60">
      <i className="bi bi-activity text-4xl mb-3"></i>
      {message}
    </div>
  );
}


