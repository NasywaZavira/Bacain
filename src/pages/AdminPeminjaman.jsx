import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import {
  getBorrowings,
  updateBorrowing,
  getBooks,
  updateBooks,
  deleteBook,
  deleteBorrowing,
  createBook,
} from "../api/apiClient";

const BASE = import.meta.env.VITE_API_URL || "http://localhost:3030";

// Initial books data
const initialBooks = [
  {
    book_id: 1,
    title: "Laskar Pelangi",
    author: "Andrea Hirata",
    blurb:
      "Kisah perjalanan sepuluh orang anak SD dari Belitong dalam mengenyam pendidikan.",
    genre: "Fiksi",
    status: "Tersedia",
  },
];

export default function AdminPeminjaman() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("peminjaman");

  const [peminjaman, setPeminjaman] = useState([]);
  const [buku, setBuku] = useState(initialBooks);
  const [searchTerm, setSearchTerm] = useState("");

  // State untuk Tema
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  // Form states
  const [formPeminjaman, setFormPeminjaman] = useState({
    id: Date.now(),
    nama: "",
    judul: "",
    tanggalPinjam: "",
    deadline: "",
    status: "Dipinjam",
  });

  const [formBuku, setFormBuku] = useState({
    book_id: Date.now(),
    judul: "",
    penulis: "",
    blurb: "",
    genre: "",
    status: "Tersedia",
  });

  const [editIndex, setEditIndex] = useState(null);
  const [editBukuIndex, setEditBukuIndex] = useState(null);

  // Efek untuk menerapkan Tema (Dark/Light)
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const handleLogout = () => {
    localStorage.removeItem("admin");
    localStorage.removeItem("isAdminLoggedIn");
    navigate("/");
  };

  // Load data from backend on component mount
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [borrowRes, booksRes] = await Promise.all([
        getBorrowings(),
        getBooks(),
      ]);

      const borrowings = (borrowRes.data || []).map((b) => ({
        borrow_id: b.borrow_id,
        nama: b.user_name || "",
        judul: b.book_title || "",
        tanggalPinjam: b.borrow_date ? b.borrow_date.slice(0, 10) : "",
        deadline: b.return_date ? b.return_date.slice(0, 10) : "",
        status: b.status || "Menunggu Persetujuan",
        admin_id: b.admin_id,
        book_id: b.book_id,
        user_id: b.user_id,
      }));

      const books = (booksRes.data || []).map((bk) => ({
        book_id: bk.book_id,
        judul: bk.title || "",
        penulis: bk.author || "",
        blurb: bk.blurb || "",
        genre: bk.genre || "",
        status: bk.status || "Tersedia",
      }));

      setPeminjaman(borrowings);
      setBuku(books);
    } catch (error) {
      console.error("Gagal mengambil data dari backend:", error);
      const storedPeminjaman = JSON.parse(
        localStorage.getItem("peminjaman") || "[]"
      );
      const storedBuku = JSON.parse(localStorage.getItem("buku") || "[]");
      setPeminjaman(storedPeminjaman);
      setBuku(storedBuku);
    }
  };

  // Save to localStorage when data changes
  useEffect(() => {
    localStorage.setItem("peminjaman", JSON.stringify(peminjaman));
  }, [peminjaman]);

  useEffect(() => {
    localStorage.setItem("buku", JSON.stringify(buku));
  }, [buku]);

  const handlePeminjamanChange = (e) => {
    setFormPeminjaman({ ...formPeminjaman, [e.target.name]: e.target.value });
  };

  const handleBukuChange = (e) => {
    setFormBuku({ ...formBuku, [e.target.name]: e.target.value });
  };

  const handleSubmitPeminjaman = (e) => {
    e.preventDefault();
    if (editIndex === null) {
      setPeminjaman([...peminjaman, { ...formPeminjaman, id: Date.now() }]);
      toast.success("Data peminjaman berhasil ditambahkan");
    } else {
      const updatedPeminjaman = [...peminjaman];
      updatedPeminjaman[editIndex] = formPeminjaman;
      setPeminjaman(updatedPeminjaman);
      toast.success("Data peminjaman berhasil diperbarui");
    }
    if (formPeminjaman.status === "Dipinjam") {
      const updatedBooks = buku.map((book) =>
        book.judul === formPeminjaman.judul
          ? { ...book, status: "Dipinjam" }
          : book
      );
      setBuku(updatedBooks);
    }
    setFormPeminjaman({
      id: Date.now(),
      nama: "",
      judul: "",
      tanggalPinjam: "",
      deadline: "",
      status: "Dipinjam",
    });
    setEditIndex(null);
  };

  const handleSubmitBuku = async (e) => {
    e.preventDefault();

    try {
      if (editBukuIndex === null) {
        const loadingId = toast.loading("Menambahkan buku...");
        const payload = {
          title: formBuku.judul,
          author: formBuku.penulis,
          blurb: formBuku.blurb,
          genre: formBuku.genre,
          status: formBuku.status,
        };

        await createBook(payload);
        await fetchData();
        toast.dismiss(loadingId);
        toast.success("Buku berhasil ditambahkan ke koleksi");
      } else {
        const updatedBuku = [...buku];
        updatedBuku[editBukuIndex] = formBuku;
        setBuku(updatedBuku);
        toast.success("Data buku berhasil diperbarui");
      }
    } catch (error) {
      console.error("Gagal menyimpan buku:", error);
      toast.error("Gagal menyimpan buku.");
    }

    setFormBuku({
      book_id: Date.now(),
      judul: "",
      penulis: "",
      blurb: "",
      genre: "",
      status: "Tersedia",
    });
    setEditBukuIndex(null);
  };

  const handleEditPeminjaman = (index) => {
    setFormPeminjaman(peminjaman[index]);
    setEditIndex(index);
    toast("Mode edit aktif", { icon: "✏️" });
  };

  const handleEditBuku = (index) => {
    setFormBuku(buku[index]);
    setEditBukuIndex(index);
    toast("Mode edit buku aktif", { icon: "✏️" });
  };

  const handleDeletePeminjaman = async (index) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus data ini?")) return;
    const loadingId = toast.loading("Menghapus data...");
    try {
      const borrowing = peminjaman[index];
      if (borrowing && borrowing.borrow_id) {
        await deleteBorrowing(borrowing.borrow_id);
      }
      const newData = peminjaman.filter((_, i) => i !== index);
      setPeminjaman(newData);
      fetchData();
      toast.dismiss(loadingId);
      toast.success("Data dihapus");
    } catch (error) {
      toast.dismiss(loadingId);
      toast.error("Gagal menghapus.");
    }
  };

  const handleDeleteBuku = async (index) => {
    if (!window.confirm("Hapus buku ini?")) return;
    const loadingId = toast.loading("Menghapus buku...");
    try {
      const book = buku[index];
      if (book && book.book_id) {
        await deleteBook(book.book_id);
      }
      const newData = buku.filter((_, i) => i !== index);
      setBuku(newData);
      fetchData();
      toast.dismiss(loadingId);
      toast.success("Buku dihapus");
    } catch (error) {
      toast.dismiss(loadingId);
      toast.error("Gagal menghapus.");
    }
  };

  const handleApproveBorrowing = async (borrowing) => {
    const loadingId = toast.loading("Memproses...");
    try {
      const admin = JSON.parse(localStorage.getItem("admin") || "{}");
      const updatedBorrowing = {
        ...borrowing,
        admin_id: admin.admin_id || 1,
        status: "Dipinjam",
        borrow_date:
          borrowing.borrow_date || new Date().toISOString().split("T")[0],
        return_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
      };
      await updateBorrowing(borrowing.borrow_id, updatedBorrowing);
      const bookToUpdate = buku.find((book) => book.judul === borrowing.judul);
      if (bookToUpdate) {
        await updateBooks(bookToUpdate.book_id, { status: "Dipinjam" });
      }
      fetchData();
      toast.dismiss(loadingId);
      toast.success("Disetujui!");
    } catch (error) {
      toast.dismiss(loadingId);
      toast.error("Gagal memproses.");
    }
  };

  const handleRejectBorrowing = async (borrowing) => {
    if (!window.confirm("Tolak peminjaman ini?")) return;
    const loadingId = toast.loading("Menolak...");
    try {
      await updateBorrowing(borrowing.borrow_id, {
        ...borrowing,
        status: "Ditolak",
      });
      fetchData();
      toast.dismiss(loadingId);
      toast.success("Ditolak.");
    } catch (error) {
      toast.dismiss(loadingId);
      toast.error("Gagal menolak.");
    }
  };

  const handleKembalikanBuku = async (index) => {
    const borrowing = peminjaman[index];
    const loadingId = toast.loading("Memproses...");
    try {
      await updateBorrowing(borrowing.borrow_id, { status: "Dikembalikan" });
      const bookToUpdate = buku.find((book) => book.judul === borrowing.judul);
      if (bookToUpdate) {
        await updateBooks(bookToUpdate.book_id, { status: "Tersedia" });
      }
      fetchData();
      toast.dismiss(loadingId);
      toast.success("Buku dikembalikan");
    } catch (error) {
      toast.dismiss(loadingId);
      toast.error("Gagal mengembalikan.");
    }
  };

  const filteredPeminjaman = peminjaman.filter((item) => {
    const nama = (item.nama || "").toLowerCase();
    const judul = (item.judul || "").toLowerCase();
    return (
      nama.includes(searchTerm.toLowerCase()) ||
      judul.includes(searchTerm.toLowerCase())
    );
  });

  const filteredBuku = buku.filter((book) => {
    const judul = (book.judul || "").toLowerCase();
    const penulis = (book.penulis || "").toLowerCase();
    return (
      judul.includes(searchTerm.toLowerCase()) ||
      penulis.includes(searchTerm.toLowerCase())
    );
  });

  // --- TAMPILAN (Support Dark Mode) ---
  return (
    <section className="w-full min-h-screen bg-gradient-to-b from-white via-white/80 to-orange-200 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900 transition-colors duration-300 pt-24 pb-20 px-4 md:px-6 flex justify-center">
      {/* Kartu Utama: support dark mode bg & text */}
      <div className="w-full max-w-7xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-2xl shadow-xl border border-orange-100 dark:border-gray-700 px-4 py-5 md:px-8 md:py-6 transition-colors duration-300">
        {/* Header Responsive */}
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6 md:mb-8">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl md:text-3xl font-bold">
              Panel Admin{" "}
              <span className="text-orange-600 dark:text-orange-400">
                Perpustakaan
              </span>
            </h1>
            <p className="text-sm md:text-base text-gray-500 dark:text-gray-400">
              Kelola data perpustakaan.
            </p>
          </div>

          {/* Tombol Tema & Logout */}
          <div className="flex items-center gap-3 self-start md:self-auto">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              title="Ganti Tema"
            >
              {theme === "dark" ? "☀️" : "🌙"}
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="px-4 py-2 rounded-lg bg-red-500 text-white text-sm md:text-base font-medium hover:bg-red-600 transition-colors shadow-sm"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 border-b border-gray-200 dark:border-gray-700 mb-6">
          {["peminjaman", "buku", "dashboard"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-2 px-3 md:px-6 text-sm md:text-base font-medium rounded-t-md transition-colors capitalize ${
                activeTab === tab
                  ? "border-b-2 border-orange-500 text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-gray-700"
                  : "text-gray-500 dark:text-gray-400 hover:text-orange-500 dark:hover:text-orange-400 hover:bg-gray-50 dark:hover:bg-gray-700/50"
              }`}
            >
              {tab === "buku" ? "Daftar Buku" : tab}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Cari data..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
          />
        </div>

        {/* Peminjaman Tab */}
        {activeTab === "peminjaman" && (
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-md p-4 md:p-6 space-y-6">
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white mb-4">
              Kelola Peminjaman
            </h2>

            {/* Form Peminjaman */}
            <form onSubmit={handleSubmitPeminjaman} className="mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Nama
                  </label>
                  <input
                    type="text"
                    name="nama"
                    value={formPeminjaman.nama}
                    onChange={handlePeminjamanChange}
                    className="w-full p-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-400 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Buku
                  </label>
                  <select
                    name="judul"
                    value={formPeminjaman.judul}
                    onChange={handlePeminjamanChange}
                    className="w-full p-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-400 outline-none"
                    required
                  >
                    <option value="">Pilih Buku</option>
                    {buku
                      .filter((book) => book.status === "Tersedia")
                      .map((book) => (
                        <option key={book.book_id} value={book.judul}>
                          {book.judul}
                        </option>
                      ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Tanggal Pinjam
                  </label>
                  <input
                    type="date"
                    name="tanggalPinjam"
                    value={formPeminjaman.tanggalPinjam}
                    onChange={handlePeminjamanChange}
                    className="w-full p-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-400 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Tanggal Pengembalian
                  </label>
                  <input
                    type="date"
                    name="deadline"
                    value={formPeminjaman.deadline}
                    min={formPeminjaman.tanggalPinjam}
                    className="w-full p-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-400 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Status
                  </label>
                  <select
                    name="status"
                    value={formPeminjaman.status}
                    onChange={handlePeminjamanChange}
                    className="w-full p-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-400 outline-none"
                  >
                    <option value="Dipinjam">Dipinjam</option>
                    <option value="Dikembalikan">Dikembalikan</option>
                  </select>
                </div>

                <div className="flex items-end gap-2 lg:col-span-3">
                  <button
                    type="submit"
                    className="flex-1 md:flex-none bg-orange-600 text-white py-2.5 px-6 rounded-lg text-sm font-medium hover:bg-orange-700 transition-colors"
                  >
                    {editIndex === null ? "Tambah" : "Simpan"}
                  </button>
                  {editIndex !== null && (
                    <button
                      type="button"
                      onClick={() => {
                        setFormPeminjaman({
                          id: Date.now(),
                          nama: "",
                          judul: "",
                          tanggalPinjam: "",
                          deadline: "",
                          status: "Dipinjam",
                        });
                        setEditIndex(null);
                        toast("Batal", { icon: "❌" });
                      }}
                      className="bg-gray-100 dark:bg-gray-600 text-gray-800 dark:text-white py-2.5 px-4 rounded-lg text-sm hover:bg-gray-200 dark:hover:bg-gray-500"
                    >
                      Batal
                    </button>
                  )}
                </div>
              </div>
            </form>

            {/* Tabel Peminjaman */}
            <div className="overflow-x-auto rounded-xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800">
              <table className="min-w-full text-sm whitespace-nowrap text-gray-900 dark:text-white">
                <thead className="bg-orange-500 text-white">
                  <tr>
                    <th className="px-4 py-3 text-left">Nama</th>
                    <th className="px-4 py-3 text-left">Buku</th>
                    <th className="px-4 py-3 text-left">Tanggal Pinjam</th>
                    <th className="px-4 py-3 text-left">
                      Tanggal Pengembalian
                    </th>
                    <th className="px-4 py-3 text-left">Status</th>
                    <th className="px-4 py-3 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                  {filteredPeminjaman.length === 0 ? (
                    <tr>
                      <td
                        colSpan="6"
                        className="px-6 py-4 text-center text-gray-500 dark:text-gray-400"
                      >
                        Data kosong
                      </td>
                    </tr>
                  ) : (
                    filteredPeminjaman.map((item, index) => (
                      <tr
                        key={index}
                        className="hover:bg-orange-50/40 dark:hover:bg-gray-700/50 transition-colors"
                      >
                        <td className="px-4 py-3">{item.nama}</td>
                        <td
                          className="px-4 py-3 max-w-[150px] truncate"
                          title={item.judul}
                        >
                          {item.judul}
                        </td>
                        <td className="px-4 py-3">{item.tanggalPinjam}</td>
                        <td className="px-4 py-3">{item.deadline}</td>
                        <td className="px-4 py-3">
                          <span
                            className={`px-2 py-1 text-xs rounded-full border ${
                              item.status === "Dipinjam"
                                ? "bg-yellow-100 text-yellow-800"
                                : item.status === "Menunggu Persetujuan"
                                ? "bg-orange-100 text-orange-800"
                                : item.status === "Ditolak"
                                ? "bg-red-100 text-red-800"
                                : "bg-green-100 text-green-800"
                            }`}
                          >
                            {item.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center flex justify-center gap-2">
                          {item.status === "Menunggu Persetujuan" && (
                            <>
                              <button
                                onClick={() => handleApproveBorrowing(item)}
                                title="Setujui"
                                className="text-green-600 hover:bg-green-50 dark:hover:bg-green-900/30 p-1 rounded"
                              >
                                ✅
                              </button>
                              <button
                                onClick={() => handleRejectBorrowing(item)}
                                title="Tolak"
                                className="text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 p-1 rounded"
                              >
                                ❌
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => handleEditPeminjaman(index)}
                            title="Edit"
                            className="text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 p-1 rounded"
                          >
                            ✏️
                          </button>
                          <button
                            onClick={() => handleDeletePeminjaman(index)}
                            title="Hapus"
                            className="text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 p-1 rounded"
                          >
                            🗑️
                          </button>
                          {item.status === "Dipinjam" && (
                            <button
                              onClick={() => handleKembalikanBuku(index)}
                              title="Kembalikan"
                              className="text-green-600 hover:bg-green-50 dark:hover:bg-green-900/30 p-1 rounded"
                            >
                              ↩️
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Buku Tab */}
        {activeTab === "buku" && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 md:p-6">
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white mb-6">
              Daftar Buku
            </h2>
            <form onSubmit={handleSubmitBuku} className="mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <input
                  type="text"
                  name="judul"
                  placeholder="Judul"
                  value={formBuku.judul}
                  onChange={handleBukuChange}
                  className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-400 outline-none"
                  required
                />
                <input
                  type="text"
                  name="penulis"
                  placeholder="Penulis"
                  value={formBuku.penulis}
                  onChange={handleBukuChange}
                  className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-400 outline-none"
                  required
                />
                <select
                  name="genre"
                  value={formBuku.genre}
                  onChange={handleBukuChange}
                  className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-400 outline-none"
                  required
                >
                  <option value="">Pilih Genre</option>
                  <option value="Administrasi">Administrasi</option>
                  <option value="Agama">Agama</option>
                  <option value="Ekonomi">Ekonomi</option>
                  <option value="Ensiklopedia">Ensiklopedia</option>
                  <option value="Fiksi">Fiksi</option>
                  <option value="Humor">Humor</option>
                </select>
                <select
                  name="status"
                  value={formBuku.status}
                  onChange={handleBukuChange}
                  className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-400 outline-none"
                  required
                >
                  <option value="Tersedia">Tersedia</option>
                  <option value="Tidak Tersedia">Tidak Tersedia</option>
                </select>
                <div className="col-span-1 md:col-span-2 lg:col-span-4">
                  <textarea
                    name="blurb"
                    placeholder="Sinopsis"
                    value={formBuku.blurb}
                    onChange={handleBukuChange}
                    rows={2}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg resize-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-400 outline-none"
                  />
                </div>
                <div className="col-span-1 lg:col-span-4 flex gap-2">
                  <button
                    type="submit"
                    className="bg-orange-600 text-white py-2 px-6 rounded-lg text-sm font-medium hover:bg-orange-700"
                  >
                    {editBukuIndex === null ? "Tambah" : "Simpan"}
                  </button>
                  {editBukuIndex !== null && (
                    <button
                      type="button"
                      onClick={() => {
                        setFormBuku({
                          book_id: Date.now(),
                          judul: "",
                          penulis: "",
                          genre: "",
                          status: "Tersedia",
                        });
                        setEditBukuIndex(null);
                      }}
                      className="bg-gray-200 dark:bg-gray-600 dark:text-white px-4 rounded-lg"
                    >
                      Batal
                    </button>
                  )}
                </div>
              </div>
            </form>

            <div className="overflow-x-auto rounded-xl border border-gray-100 dark:border-gray-700">
              <table className="min-w-full text-sm whitespace-nowrap text-gray-900 dark:text-white">
                <thead className="bg-orange-500 text-white">
                  <tr>
                    <th className="px-4 py-3 text-left">Judul</th>
                    <th className="px-4 py-3 text-left">Penulis</th>
                    <th className="px-4 py-3 text-left">Status</th>
                    <th className="px-4 py-3 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                  {filteredBuku.map((book, index) => (
                    <tr
                      key={book.book_id}
                      className="hover:bg-orange-50/40 dark:hover:bg-gray-700/50"
                    >
                      <td className="px-4 py-3 max-w-[200px] truncate">
                        {book.judul}
                      </td>
                      <td className="px-4 py-3">{book.penulis}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-1 text-xs rounded-full border ${
                            book.status === "Tersedia"
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {book.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center gap-2 flex justify-center">
                        <button
                          onClick={() => handleEditBuku(index)}
                          className="text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 p-1 rounded"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleDeleteBuku(index)}
                          className="text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 p-1 rounded"
                        >
                          🗑️
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Dashboard Tab */}
        {activeTab === "dashboard" && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 md:p-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
              Dashboard
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-blue-50 dark:bg-blue-900/30 p-6 rounded-lg text-center md:text-left">
                <h3 className="font-semibold text-blue-800 dark:text-blue-200">
                  Total Buku
                </h3>
                <p className="text-3xl font-bold text-blue-600 dark:text-blue-300">
                  {buku.length}
                </p>
              </div>
              <div className="bg-yellow-50 dark:bg-yellow-900/30 p-6 rounded-lg text-center md:text-left">
                <h3 className="font-semibold text-yellow-800 dark:text-yellow-200">
                  Sedang Dipinjam
                </h3>
                <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-300">
                  {peminjaman.filter((i) => i.status === "Dipinjam").length}
                </p>
              </div>

              <div className="bg-green-50 dark:bg-green-900/30 p-6 rounded-lg text-center md:text-left">
                <h3 className="font-semibold text-green-800 dark:text-green-200">
                  Total Peminjaman
                </h3>
                <p className="text-3xl font-bold text-green-600 dark:text-green-300">
                  {peminjaman.length}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="border border-gray-100 dark:border-gray-700 rounded-xl overflow-hidden bg-white dark:bg-gray-800">
                <div className="bg-yellow-500/10 dark:bg-yellow-900/40 px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                  <h3 className="font-semibold text-yellow-800 dark:text-yellow-200 text-sm md:text-base">
                    Sedang Dipinjam
                  </h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-xs md:text-sm whitespace-nowrap text-gray-900 dark:text-white">
                    <thead className="bg-yellow-500 text-white">
                      <tr>
                        <th className="px-3 py-2 text-left">Nama</th>
                        <th className="px-3 py-2 text-left">Buku</th>
                        <th className="px-3 py-2 text-left">Tgl Pinjam</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                      {filteredPeminjaman.filter((i) => i.status === "Dipinjam")
                        .length === 0 ? (
                        <tr>
                          <td
                            colSpan="3"
                            className="px-4 py-3 text-center text-gray-500 dark:text-gray-400"
                          >
                            Tidak ada data
                          </td>
                        </tr>
                      ) : (
                        filteredPeminjaman
                          .filter((i) => i.status === "Dipinjam")
                          .map((item, idx) => (
                            <tr
                              key={idx}
                              className="hover:bg-yellow-50/40 dark:hover:bg-gray-700/50 transition-colors"
                            >
                              <td className="px-3 py-2">{item.nama}</td>
                              <td
                                className="px-3 py-2 max-w-[140px] truncate"
                                title={item.judul}
                              >
                                {item.judul}
                              </td>
                              <td className="px-3 py-2">
                                {item.tanggalPinjam}
                              </td>
                            </tr>
                          ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="border border-gray-100 dark:border-gray-700 rounded-xl overflow-hidden bg-white dark:bg-gray-800">
                <div className="bg-orange-500/10 dark:bg-orange-900/40 px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                  <h3 className="font-semibold text-orange-800 dark:text-orange-200 text-sm md:text-base">
                    Menunggu Persetujuan
                  </h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-xs md:text-sm whitespace-nowrap text-gray-900 dark:text-white">
                    <thead className="bg-orange-500 text-white">
                      <tr>
                        <th className="px-3 py-2 text-left">Nama</th>
                        <th className="px-3 py-2 text-left">Buku</th>
                        <th className="px-3 py-2 text-left">Tgl Ajukan</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                      {filteredPeminjaman.filter(
                        (i) => i.status === "Menunggu Persetujuan"
                      ).length === 0 ? (
                        <tr>
                          <td
                            colSpan="3"
                            className="px-4 py-3 text-center text-gray-500 dark:text-gray-400"
                          >
                            Tidak ada data
                          </td>
                        </tr>
                      ) : (
                        filteredPeminjaman
                          .filter((i) => i.status === "Menunggu Persetujuan")
                          .map((item, idx) => (
                            <tr
                              key={idx}
                              className="hover:bg-orange-50/40 dark:hover:bg-gray-700/50 transition-colors"
                            >
                              <td className="px-3 py-2">{item.nama}</td>
                              <td
                                className="px-3 py-2 max-w-[140px] truncate"
                                title={item.judul}
                              >
                                {item.judul}
                              </td>
                              <td className="px-3 py-2">
                                {item.tanggalPinjam}
                              </td>
                            </tr>
                          ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="border border-gray-100 dark:border-gray-700 rounded-xl overflow-hidden bg-white dark:bg-gray-800">
                <div className="bg-green-500/10 dark:bg-green-900/40 px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                  <h3 className="font-semibold text-green-800 dark:text-green-200 text-sm md:text-base">
                    Sudah Dikembalikan
                  </h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-xs md:text-sm whitespace-nowrap text-gray-900 dark:text-white">
                    <thead className="bg-green-500 text-white">
                      <tr>
                        <th className="px-3 py-2 text-left">Nama</th>
                        <th className="px-3 py-2 text-left">Buku</th>
                        <th className="px-3 py-2 text-left">Tgl Pinjam</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                      {filteredPeminjaman.filter(
                        (i) => i.status === "Dikembalikan"
                      ).length === 0 ? (
                        <tr>
                          <td
                            colSpan="3"
                            className="px-4 py-3 text-center text-gray-500 dark:text-gray-400"
                          >
                            Tidak ada data
                          </td>
                        </tr>
                      ) : (
                        filteredPeminjaman
                          .filter((i) => i.status === "Dikembalikan")
                          .map((item, idx) => (
                            <tr
                              key={idx}
                              className="hover:bg-green-50/40 dark:hover:bg-gray-700/50 transition-colors"
                            >
                              <td className="px-3 py-2">{item.nama}</td>
                              <td
                                className="px-3 py-2 max-w-[140px] truncate"
                                title={item.judul}
                              >
                                {item.judul}
                              </td>
                              <td className="px-3 py-2">
                                {item.tanggalPinjam}
                              </td>
                            </tr>
                          ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
