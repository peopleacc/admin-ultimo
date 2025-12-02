"use client";

import Modal from "react-modal";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { generateWorkOrderPDF } from "@/lib/generateWorkOrder";

Modal.setAppElement("body");

export default function Modalcancel({ isOpen, onClose, order, onUpdated }) {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [Teknisi, setTeknisi] = useState("");
  const [listTeknisi, setListTeknisi] = useState([]);

  // use helper generateWorkOrderPDF from lib

  useEffect(() => {
    if (isOpen) {
      fetchTeknisi();
    } else {
      setErrorMsg("");
      setLoading(false);
    }
  }, [isOpen]);

  // ⬇️ Ambil teknisi yang belum punya pesanan
  const fetchTeknisi = async () => {
    // Use a left join to bring any related t_pemesanan rows, then filter out
    // teknisi who already have an active assignment on the client side.
    const { data, error } = await supabase
      .from("m_teknisi")
      .select(`
        *,
        t_pemesanan!left(pesanan_id,teknisi_id,status_pengerjaan)
      `);

    if (error) {
      console.error(error);
      setErrorMsg(error.message);
      setListTeknisi([]);
      return;
    }

    // data may contain t_pemesanan as array (left join). Filter out technicians
    // that already have any pesanan with a non-null teknisi_id (i.e. assigned).
    const available = (data || []).filter((t) => {
      const tp = t.t_pemesanan;
      if (!tp) return true;
      // if tp is array and empty => available
      if (Array.isArray(tp) && tp.length === 0) return true;
      // if any joined pemesanan has teknisi_id set and status not canceled/completed,
      // treat teknisi as busy. We'll consider any non-null teknisi_id as busy here.
      if (Array.isArray(tp)) {
        return !tp.some((p) => p.teknisi_id !== null && p.teknisi_id !== undefined);
      }
      // if tp is object (single), check field
      return !(tp && (tp.teknisi_id !== null && tp.teknisi_id !== undefined));
    });

    setListTeknisi(available || []);
  };


  if (!order) return null;

  // ⬇️ Tombol PROSES
  const ProsesPesanan = async () => {
    try {
      setLoading(true);

      const { error } = await supabase
        .from("t_pemesanan")
        .update({
          status_pengerjaan: "proses",
          teknisi_id: Teknisi,
        })
        .eq("pesanan_id", order.pesanan_id);

      if (error) throw error;

      // insert initial progress (presentase_progress = 0)
      try {
        const { error: insErr } = await supabase.from("d_progres").insert({
          pesanan_id: order.pesanan_id,
          presentase_progress: 0,
          keterangan_status: "Order started",
        });
        if (insErr) {
          // fallback to alternative column names used elsewhere in the codebase
          const { error: insErr2 } = await supabase.from("d_progres").insert({
            id_pesanan: order.pesanan_id,
            progres: 0,
          });
          if (insErr2) console.warn("Insert d_progres fallback failed:", insErr2);
        }
      } catch (e) {
        console.warn("Error inserting initial progress:", e);
      }

        // generate work order PDF and try to upload / download
        try {
          await generateWorkOrderPDF(order);
        } catch (e) {
          console.warn('generateWorkOrderPDF error:', e);
        }

      alert(`Pesanan #${order.pesanan_id} berhasil diproses.`);
      onClose();
      if (onUpdated) onUpdated();
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ⬇️ Tombol WAITING
  const TungguPesanan = async () => {
    try {
      setLoading(true);

      const { error } = await supabase
        .from("t_pemesanan")
        .update({ status_pengerjaan: "waiting" })
        .eq("pesanan_id", order.pesanan_id);

      if (error) throw error;

      // insert progress pertama
      await supabase.from("d_progres").insert({
        id_pesanan: order.pesanan_id,
        progres: 0,
      });

      alert(`Pesanan #${order.pesanan_id} diubah ke waiting.`);
      onClose();
      if (onUpdated) onUpdated();
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="bg-white p-6 rounded-xl shadow-xl max-w-lg w-full mx-auto mt-20 outline-none"
      overlayClassName="fixed inset-0 bg-black/50 flex items-start justify-center z-50"
    >
      <h2 className="text-xl font-semibold mb-3">
        Detail Pesanan #{order.pesanan_id}
      </h2>

      <div className="space-y-2 text-sm">
        <p><b>Nama:</b> {order.m_customers?.nama || "-"}</p>
        <p><b>Layanan:</b> {order.m_product_layanan?.nama_layanan || "-"}</p>
        <p><b>Deskripsi:</b> {order.m_product_layanan?.deskripsi || "-"}</p>
        <p><b>Bahan:</b> {order.m_bahan?.nama_bahan || "-"}</p>

        {errorMsg && (
          <p className="text-red-600 text-sm">Error: {errorMsg}</p>
        )}

        {/* Dropdown Teknisi */}
        <label className="text-sm font-semibold">Pilih Teknisi</label>
        <select
          className="
            w-full px-3 py-2 border border-gray-300 rounded-lg
            focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            bg-gray-50 cursor-pointer
          "
          value={Teknisi}
          onChange={(e) => setTeknisi(e.target.value)}
        >
          <option value="" disabled className="text-gray-400">
            -- Pilih Teknisi --
          </option>

          {listTeknisi.map((t) => (
            <option
              key={t.teknisi_id}
              value={t.teknisi_id}
              className="py-2 bg-white text-black hover:bg-blue-100"
            >
              {t.nama}
            </option>
          ))}
        </select>
      </div>

      <div className="flex justify-end gap-3 mt-6">
        <button
          className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
          onClick={onClose}
          disabled={loading}
        >
          Tutup
        </button>

        <button
          className="
            px-4 py-2 bg-gray-700 text-white rounded-md
            hover:bg-gray-800
          "
          onClick={TungguPesanan}
          disabled={loading}
        >
          {loading ? "Memproses..." : "Tunggu Pesanan"}
        </button>

        <button
          className="
            px-4 py-2 bg-green-600 text-white rounded-md
            hover:bg-green-700
          "
          onClick={ProsesPesanan}
          disabled={loading}
        >
          {loading ? "Memproses..." : "Proses Pesanan"}
        </button>
      </div>
    </Modal>
  );
}
