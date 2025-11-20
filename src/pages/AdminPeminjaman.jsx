import React, { useEffect, useState } from "react";

export default function AdminPeminjaman() {
  const [peminjaman, setPeminjaman] = useState([]);

  useEffect(() => {
    // Ambil data dari localStorage (sementara)
    const data = JSON.parse(localStorage.getItem("peminjaman")) || [];
    setPeminjaman(data);
  }, []);

  return (
    <section className="w-full h-screen flex justify-center items-start bg-gradient-to-b from-white via-white/80 to-orange-200 pt-32">
      <div className="bg-white shadow-xl rounded-xl p-8 w-[90%] max-w-5xl">
        <h1 className="text-3xl font-bold text-orange-600 mb-6">Admin - Daftar Peminjaman Buku</h1>

        {/* TABLE */}
        <table className="w-full border border-orange-300 rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-orange-500 text-white">
              <th className="px-4 py-3">Nama Peminjam</th>
              <th className="px-4 py-3">Judul Buku</th>
              <th className="px-4 py-3">Tanggal Pinjam</th>
              <th className="px-4 py-3">Jatuh Tempo</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>

          <tbody>
            {peminjaman.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-6 text-gray-500">
                  Belum ada data peminjaman
                </td>
              </tr>
            ) : (
              peminjaman.map((item, index) => (
                <tr
                  key={index}
                  className="text-center border-b hover:bg-orange-100 transition"
                >
                  <td className="py-3">{item.nama}</td>
                  <td className="py-3">{item.judul}</td>
                  <td className="py-3">{item.tanggalPinjam}</td>
                  <td className="py-3">{item.deadline}</td>
                  <td className="py-3">
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      item.status === "Dipinjam"
                        ? "bg-yellow-300"
                        : "bg-green-300"
                    }`}>
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
