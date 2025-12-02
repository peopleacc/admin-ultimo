"use client";
import React, { useState } from "react";
import { BellFill, ChevronDown } from "react-bootstrap-icons";
import LinkMenu from "./link";

export default function Header({ onToggleSidebar }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <header className="m-4 rounded-3xl shadow-xl bg-gradient-to-r from-[#2D336B] to-[#4f5aa6] text-white px-6 py-5 border border-white/10">
      {/* ========================== BAGIAN ATAS HEADER ========================== */}
      <div className="flex items-center justify-between px-6">
        {/* Kiri: Tombol + Judul */}
        <div className="flex items-center space-x-4">
          {/* Tombol Toggle Sidebar → tampil di mobile */}
          <button
            onClick={onToggleSidebar}
            className="bg-white/20 hover:bg-white/30 p-2 rounded-xl focus:outline-none lg:hidden transition"
            aria-label="Toggle sidebar"
          >
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              viewBox="0 0 24 24"
            >
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>

          {/* Judul Halaman */}
          <h1 className="text-2xl font-semibold tracking-wide hidden lg:block">
            Dashboard
          </h1>
        </div>

        {/* Link Header → hanya tampil di HP / tablet */}
        <div className="flex lg:hidden">
          <LinkMenu />
        </div>

        {/* Kanan: Menu User */}
        <div className="relative flex items-center bg-white/15 backdrop-blur-lg rounded-2xl px-4 py-2 mr-2 border border-white/20">
          <button className="text-white mr-3 pr-3 border-r border-white/30">
            <BellFill size={18} />
          </button>

          <button
            onClick={toggleDropdown}
            className="flex items-center text-white focus:outline-none"
          >
            <span className="text-md font-semibold mr-2">USER</span>
            <img
              src="/asset/R.png"
              className="w-8 h-8 rounded-full mr-1"
              alt="User"
            />
            <ChevronDown size={16} />
          </button>

          {/* Dropdown */}
          {isDropdownOpen && (
            <div className="absolute right-0 top-14 w-44 bg-white border border-[#2D336B]/10 rounded-2xl shadow-2xl z-10 overflow-hidden">
              <a
                href="#"
                className="block px-4 py-2 text-sm text-[#2D336B] hover:bg-[#FFF2F2]"
              >
                Setting
              </a>
              <a
                href="/login"
                className="block px-4 py-2 text-sm text-[#2D336B] hover:bg-[#FFF2F2]"
              >
                Logout
              </a>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
