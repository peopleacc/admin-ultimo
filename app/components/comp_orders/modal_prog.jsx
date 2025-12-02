"use client";

import Modal from "react-modal";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

Modal.setAppElement("body");

export default function Modalprog({ isOpen, onClose, order, onUpdated }) {
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    useEffect(() => {
        if (!isOpen) {
            setErrorMsg("");
            setLoading(false);
        }
    }, [isOpen]);

    if (!order) return null;
    const SelesaiPesanan = async () => {
        try {
            setLoading(true);
            setErrorMsg("");

            // 1️⃣ Update status pesanan
            const { error: updateError } = await supabase
                .from("t_pemesanan")
                .update({ status_pengerjaan: "Menunggu Pembayaran" })
                .eq("pesanan_id", order.t_pemesanan?.pesanan_id);

            if (updateError) throw updateError;

            // 2️⃣ Hapus semua progress berdasarkan pesanan_id

            alert(`Pesanan #${order.t_pemesanan?.pesanan_id} berhasil diubah!`);
            onClose();
            if (onUpdated) onUpdated();
        } catch (err) {
            setErrorMsg(err.message);
        } finally {
            setLoading(false);
        }
    };

    const ProgresLanjut = async () => {
        try {
            setLoading(true);
            setErrorMsg("");

            const current = order.presentase_progress ?? 0;
            let next = 0;
            let ket = "";

            if (current === 0) {
                next = 20;
                ket = "Order confirmed";
            } else if (current === 20) {
                next = 40;
                ket = "Material preparation";
            } else if (current === 40) {
                next = 60;
                ket = "Installation in progress";
            } else if (current === 60) {
                next = 80;
                ket = "Quality check";
            } else if (current === 80) {
                next = 100;
                ket = "Ready for pick up";
            } else {
                alert("Progress sudah mencapai 100%");
                return;
            }

            // jika progress belum ada → buat baru
            if (!order.d_progres) {
                const { error } = await supabase
                    .from("d_progres")
                    .insert({
                        pesanan_id: order.t_pemesanan?.pesanan_id,
                        presentase_progress: next,
                        keterangan_status: ket
                    });

                if (error) throw error;
            } else {
                // jika sudah ada → update
                const { error } = await supabase
                    .from("d_progres")
                    .update({
                        presentase_progress: next,
                        keterangan_status: ket
                    })
                    .eq("pesanan_id", order.t_pemesanan?.pesanan_id);

                if (error) throw error;
            }

            alert(`Progress berhasil ditingkatkan menjadi ${next}%`);
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
                Detail Pesanan #{order.t_pemesanan?.pesanan_id}
            </h2>

            <div className="space-y-2">
                <p><b>Nama:</b> {order.t_pemesanan?.m_customers?.nama || "-"}</p>
                <p><b>Teknisi:</b> {order.t_pemesanan?.m_teknisi?.nama || "-"}</p>
                <p><b>Layanan:</b> {order.t_pemesanan?.m_product_layanan?.nama_layanan || "-"}</p>

                {errorMsg && (
                    <p className="text-red-600 text-sm">Error: {errorMsg}</p>
                )}

                {/* Progress bar */}
                <div className="w-full bg-gray-200 rounded-full h-2 my-2">
                    <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: `${order.presentase_progress || 0}%` }}
                    ></div>
                </div>

                <p className="text-sm text-gray-600 mt-1">
                    Progress: {order.presentase_progress || 0}%
                </p>
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
                    className="px-4 py-2 bg-gray-600 text-white rounded-md"
                    onClick={ProgresLanjut}
                    disabled={loading}
                >
                    {loading ? "Memproses..." : "Lanjutkan Progress"}
                </button>

                <button
                    className="px-4 py-2 bg-green-600 text-white rounded-md"
                    onClick={SelesaiPesanan}
                    disabled={loading}
                >
                    {loading ? "Memproses..." : "Selesaikan Pesanan"}
                </button>
            </div>
        </Modal>
    );
}
