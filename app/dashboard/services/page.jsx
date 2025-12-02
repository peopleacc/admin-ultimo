"use client";

import Card_serv from "../../components/comp_service/card_serv";
import Modal_tambah from "../../components/comp_service/modal_tambah";
import { useState } from "react";

export default function ServicesPage() {
  const [isTambahOpen, setIsTambahOpen] = useState(false);

  // jika kamu ingin refresh list setelah insert
  const fetchOrders = () => {
    console.log("Refresh data...");
    // TODO: isi fungsi fetch data
  };

  return (
    <div>
      <div className="flex">
        <h1 className="text-2xl mt-2 font-bold mb-4">Services</h1>

        <button
          className="m-2 px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          onClick={() => setIsTambahOpen(true)}
        >
          <i className="bi bi-plus-lg"></i>
        </button>
      </div>

        <Card_serv />

      {/* Modal */}
      <Modal_tambah
        isOpen={isTambahOpen}
        onClose={() => setIsTambahOpen(false)}
        onUpdated={fetchOrders}  // refresh data setelah insert
      />
    </div>
  );
}
