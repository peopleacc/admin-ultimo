"use client";

const RECENT_ORDERS = [
  {
    id: "#IN-20251",
    title: "Join Premium",
    desc: "Membership upgrade package",
    amount: "Rp 3.000",
    date: "Nov 8, 2025",
  },
  {
    id: "#IN-20252",
    title: "Laundry Express",
    desc: "Same day service",
    amount: "Rp 180.000",
    date: "Nov 7, 2025",
  },
  {
    id: "#IN-20253",
    title: "Pickup Service",
    desc: "New customer onboarding",
    amount: "Rp 45.000",
    date: "Nov 6, 2025",
  },
];

export default function OrderRecent() {
  return (
    <>
      <div className="glass-panel p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-[#2D336B]/60">
              Insight
            </p>
            <h2 className="text-2xl font-semibold text-[#2D336B]">
              Recent Orders
            </h2>
          </div>
          <button className="px-4 py-2 text-sm font-semibold text-[#2D336B] bg-[#FFF2F2] border border-[#2D336B]/15 rounded-full shadow-sm hover:-translate-y-0.5 transition">
            View all
          </button>
        </div>

        <div className="space-y-4">
          {RECENT_ORDERS.map((order) => (
            <div
              key={order.id}
              className="flex justify-between items-center border border-[#2D336B]/10 rounded-2xl p-4 hover:border-[#2D336B]/40 transition bg-white/70"
            >
              {/* Bagian kiri */}
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="accent-chip">Order</span>
                  <span className="text-[#2D336B]/60 text-sm">{order.id}</span>
                </div>

                <h3 className="text-[#2D336B] font-semibold">{order.title}</h3>
                <p className="text-[#2D336B]/70 text-sm">{order.desc}</p>
              </div>

              {/* Bagian kanan */}
              <div className="text-right">
                <h2 className="text-lg font-bold text-[#2D336B]">
                  {order.amount}
                </h2>
                <p className="text-[#2D336B]/60 text-sm">{order.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

