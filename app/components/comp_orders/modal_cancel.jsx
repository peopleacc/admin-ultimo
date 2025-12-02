"use client";

import Modal from "react-modal";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

// wajib! untuk menghindari warning aksesibility:
Modal.setAppElement("body");

export default function Modalcancel({ isOpen, onClose, order }) {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (!isOpen) {
      setErrorMsg("");
      setLoading(false);
    }
  }, [isOpen]);

  if (!order) return null;

  const handleUpdateStatus = async () => {
    try {
      setLoading(true);
      setErrorMsg("");

      const { error } = await supabase
        .from("t_pemesanan")
        .update({ status_pengerjaan: "proses" })
        .eq("pesanan_id", order.pesanan_id);

      if (error) throw error;

      alert(`Pesanan #${order.pesanan_id} berhasil diubah!`);
      onClose();
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

      <div className="space-y-2">
        <p><b>Nama:</b> {order.users?.nama || "-"}</p>

        {errorMsg && (
          <p className="text-red-600 text-sm">Error: {errorMsg}</p>
        )}
      </div>

      <div className="flex justify-end gap-3 mt-6">
        <button
          className="px-4 py-2 bg-gray-200 rounded-md"
          onClick={onClose}
          disabled={loading}
        >
          Tutup
        </button>

        <button
          className="px-4 py-2 bg-blue-600 text-white rounded-md"
          onClick={handleUpdateStatus}
          disabled={loading}
        >
          {loading ? "Memproses..." : "Proses Pesanan"}
        </button>
        
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded-md"
          onClick={handleUpdateStatus}
          disabled={loading}
        >
          {loading ? "Memproses..." : "Proses Pesanan"}
        </button>
      </div>
    </Modal>
  );
}
