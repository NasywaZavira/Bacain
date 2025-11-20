import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function AccountMenu() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      {/* Tombol Akun */}
      <button
        onClick={() => setOpen(!open)}
        className="bg-orange-500 text-white px-4 py-2 rounded-full hover:bg-orange-600"
      >
        Akun
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg overflow-hidden z-50 border">
          <Link
            to="/profile"
            className="block px-4 py-2 hover:bg-orange-100"
          >
            Profil
          </Link>

          <Link
            to="/riwayat"
            className="block px-4 py-2 hover:bg-orange-100"
          >
            Riwayat Peminjaman
          </Link>

          {/* Admin Panel ditampilkan untuk semua user */}
          <Link
            to="/admin/peminjaman"
            className="block px-4 py-2 hover:bg-orange-100 text-orange-600 font-semibold"
          >
            Admin Panel
          </Link>

          <button
            onClick={() => {
              localStorage.clear();
              window.location.href = "/";
            }}
            className="block w-full text-left px-4 py-2 hover:bg-red-100 text-red-600"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
