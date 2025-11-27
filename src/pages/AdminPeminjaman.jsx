import React, { useEffect, useState } from "react";

export default function AdminPeminjaman() {
  const [peminjaman, setPeminjaman] = useState([]);
  const [formData, setFormData] = useState({
    nama: "",
    judul: "",
    tanggalPinjam: "",
    deadline: "",
    status: "Dipinjam",
  });
  const [editIndex, setEditIndex] = useState(null);

  // Load data dari localStorage saat pertama kali masuk halaman
  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("peminjaman")) || [];
    setPeminjaman(data);
  }, []);

  // Save ke localStorage setiap peminjaman berubah
  const saveToLocalStorage = (data) => {
    localStorage.setItem("peminjaman", JSON.stringify(data));
  };

  // Handle input form
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Menambah atau mengedit data
  const handleSubmit = (e) => {
    e.preventDefault();

    let newData = [...peminjaman];

    if (editIndex === null) {
      // Tambah baru
      newData.push(formData);
    } else {
      // Edit data
      newData[editIndex] = formData;
    }

    setPeminjaman(newData);
    saveToLocalStorage(newData);

    // Reset form
    setFormData({
      nama: "",
      judul: "",
      tanggalPinjam: "",
      deadline: "",
      status: "Dipinjam",
    });
    setEditIndex(null);
  };

  // Load data ke form untuk edit
  const handleEdit = (index) => {
    setFormData(peminjaman[index]);
    setEditIndex(index);
  };

  // Hapus data
  const handleDelete = (index) => {
    const newData = peminjaman.filter((_, i) => i !== index);
    setPeminjaman(newData);
    saveToLocalStorage(newData);
  };

  return (
    <section className="w-full min-h-screen flex justify-center items-start bg-gradient-to-b from-white via-white/80 to-orange-200 pt-32 pb-20">

      <div className="bg-white shadow-xl rounded-xl p-8 w-[90%] max-w-6xl">
        <h1 className="text-3xl font-bold text-orange-600 mb-6">
          Admin - Daftar Peminjaman Buku
        </h1>

        {/* FORM TAMBAH / EDIT */}
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10"
        >
          <input
            type="text"
            name="nama"
            placeholder="Nama Peminjam"
            value={formData.nama}
            onChange={handleChange}
            className="border p-3 rounded-lg"
            required
          />
          <input
            type="text"
            name="judul"
            placeholder="Judul Buku"
            value={formData.judul}
            onChange={handleChange}
            className="border p-3 rounded-lg"
            required
          />
          <input
            type="date"
            name="tanggalPinjam"
            value={formData.tanggalPinjam}
            onChange={handleChange}
            className="border p-3 rounded-lg"
            required
          />
          <input
            type="date"
            name="deadline"
            value={formData.deadline}
            onChange={handleChange}
            className="border p-3 rounded-lg"
            required
          />

          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="border p-3 rounded-lg"
          >
            <option value="Dipinjam">Dipinjam</option>
            <option value="Dikembalikan">Dikembalikan</option>
          </select>

          <button
            type="submit"
            className="bg-orange-600 text-white py-3 px-4 rounded-lg md:col-span-2 hover:bg-orange-700 transition"
          >
            {editIndex === null ? "Tambah Peminjaman" : "Simpan Perubahan"}
          </button>
        </form>

        {/* TABLE */}
        <table className="w-full border border-orange-300 rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-orange-500 text-white">
              <th className="px-4 py-3">Nama Peminjam</th>
              <th className="px-4 py-3">Judul Buku</th>
              <th className="px-4 py-3">Tanggal Pinjam</th>
              <th className="px-4 py-3">Jatuh Tempo</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Aksi</th>
            </tr>
          </thead>

          <tbody>
            {peminjaman.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-6 text-gray-500">
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
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        item.status === "Dipinjam"
                          ? "bg-yellow-300"
                          : "bg-green-300"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>

                  {/* TOMBOL AKSI */}
                  <td className="py-3 flex justify-center gap-3">
                    <button
                      onClick={() => handleEdit(index)}
                      className="bg-blue-500 text-white px-4 py-1 rounded-lg hover:bg-blue-600"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(index)}
                      className="bg-red-500 text-white px-4 py-1 rounded-lg hover:bg-red-600"
                    >
                      Hapus
                    </button>
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
