"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import "bootstrap-icons/font/bootstrap-icons.css";

/**
 * Komponen umum untuk menampilkan total statistik
 */
function StatCard({ icon, title, table = "users", accent = "#2D336B" }) {
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchTotal = async () => {
      const { count, error } = await supabase
        .from(table)
        .select("*", { count: "exact", head: true });

      if (error) {
        console.error(`❌ Error mengambil data ${title}:`, error.message);
        return;
      }

      setTotal(count ?? 0);
    };

    fetchTotal();
  }, [table]);

  return (
    <div className="glass-panel relative overflow-hidden p-5 sm:p-6 w-full max-w-[280px] mx-auto transition-transform hover:-translate-y-1">
      <div
        className="absolute inset-0 opacity-10"
        style={{ background: `radial-gradient(circle at top, ${accent}, transparent 70%)` }}
      ></div>
      <div className="relative flex items-center justify-between">
        <div
          className="text-white p-3 sm:p-4 rounded-2xl flex items-center justify-center shadow-lg"
          style={{ background: accent }}
        >
          <i className={`bi ${icon} text-xl sm:text-2xl md:text-3xl`}></i>
        </div>
        <div className="text-right ml-3">
          <h2 className="text-sm sm:text-base font-semibold text-[#2D336B]/80">
            {title}
          </h2>
          <p className="text-lg sm:text-xl md:text-3xl font-bold text-[#2D336B]">
            {total}
          </p>
        </div>
      </div>
    </div>
  );
}

/**
 * Komponen spesifik untuk tiap kategori
 */
export function TotalOrder() {
  return <StatCard icon="bi-box-seam" title="Total Order" table="orders" accent="#2D336B" />;
}

export function Pending() {
  return <StatCard icon="bi-clock" title="Pending" accent="#F4A261" />;
}

export function BookingComplete() {
  return <StatCard icon="bi-check" title="Completed" accent="#2A9D8F" />;
}

export function Revenue() {
  return <StatCard icon="bi-currency-dollar" title="Revenue" accent="#C77DFF" />;
}
