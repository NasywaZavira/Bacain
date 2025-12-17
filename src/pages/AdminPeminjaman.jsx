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

  // Form states
  const [formPeminjaman, setFormPeminjaman] = useState({
    id: Date.now(),
    nama: "",
    judul: "",
    tanggalPinjam: "",
    deadline: "",
    status: "Dipinjam",
  });

  const handleLogout = () => {
    localStorage.removeItem("admin");
    localStorage.removeItem("isAdminLoggedIn");
    navigate("/");
  };

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

  // Load data from backend on component mount
  useEffect(() => {
    fetchData();
  }, []);

  // Make fetchData available for other functions
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
      // Fallback to localStorage if API fails
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

  // Handle form input changes
  const handlePeminjamanChange = (e) => {
    setFormPeminjaman({ ...formPeminjaman, [e.target.name]: e.target.value });
  };

  const handleBukuChange = (e) => {
    setFormBuku({ ...formBuku, [e.target.name]: e.target.value });
  };

  // Handle form submissions
  const handleSubmitPeminjaman = (e) => {
    e.preventDefault();

    if (editIndex === null) {
      // Add new loan
      setPeminjaman([...peminjaman, { ...formPeminjaman, id: Date.now() }]);
      toast.success("Data peminjaman berhasil ditambahkan");
    } else {
      // Update existing loan
      const updatedPeminjaman = [...peminjaman];
      updatedPeminjaman[editIndex] = formPeminjaman;
      setPeminjaman(updatedPeminjaman);
      toast.success("Data peminjaman berhasil diperbarui");
    }

    // Update book status if needed
    if (formPeminjaman.status === "Dipinjam") {
      const updatedBooks = buku.map((book) =>
        book.judul === formPeminjaman.judul
          ? { ...book, status: "Dipinjam" }
          : book
      );
      setBuku(updatedBooks);
    }

    // Reset form
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

  const handleSubmitBuku = (e) => {
    e.preventDefault();

    if (editBukuIndex === null) {
      // Add new book
      setBuku([...buku, { ...formBuku, book_id: Date.now() }]);
      toast.success("Buku berhasil ditambahkan ke koleksi");
    } else {
      // Update existing book
      const updatedBuku = [...buku];
      updatedBuku[editBukuIndex] = formBuku;
      setBuku(updatedBuku);
      toast.success("Data buku berhasil diperbarui");
    }

    // Reset form
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

  // Handle edit actions
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

  // Handle delete actions
  const handleDeletePeminjaman = async (index) => {
    if (
      !window.confirm("Apakah Anda yakin ingin menghapus data peminjaman ini?")
    ) {
      return;
    }

    const loadingId = toast.loading("Menghapus data...");

    try {
      const borrowing = peminjaman[index];
      if (borrowing && borrowing.borrow_id) {
        await deleteBorrowing(borrowing.borrow_id);
      }

      const newData = peminjaman.filter((_, i) => i !== index);
      setPeminjaman(newData);

      // Refresh data from backend to keep in sync
      fetchData();
      toast.dismiss(loadingId);
      toast.success("Data peminjaman dihapus");
    } catch (error) {
      console.error("Error deleting borrowing:", error);
      toast.dismiss(loadingId);
      toast.error("Gagal menghapus peminjaman.");
    }
  };

  const handleDeleteBuku = async (index) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus buku ini?")) {
      return;
    }

    const loadingId = toast.loading("Menghapus buku...");

    try {
      const book = buku[index];
      if (book && book.book_id) {
        await deleteBook(book.book_id);
      }

      // Hapus dari state lokal juga
      const newData = buku.filter((_, i) => i !== index);
      setBuku(newData);

      // Refresh data dari backend agar sinkron
      fetchData();
      toast.dismiss(loadingId);
      toast.success("Buku berhasil dihapus dari koleksi");
    } catch (error) {
      console.error("Error deleting book:", error);
      toast.dismiss(loadingId);
      toast.error("Gagal menghapus buku.");
    }
  };

  // Handle approve borrowing
  const handleApproveBorrowing = async (borrowing) => {
    const loadingId = toast.loading("Memproses persetujuan...");

    try {
      // Get admin ID from localStorage (assuming admin is logged in)
      const admin = JSON.parse(localStorage.getItem("admin") || "{}");

      // Update borrowing with admin approval
      const updatedBorrowing = {
        ...borrowing,
        admin_id: admin.admin_id || 1, // Default to admin_id 1 if not found
        status: "Dipinjam",
        borrow_date:
          borrowing.borrow_date || new Date().toISOString().split("T")[0], // Ensure borrow_date is not null
        return_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0], // 7 days from now
      };

      await updateBorrowing(borrowing.borrow_id, updatedBorrowing);

      // Update book status to Dipinjam
      const bookToUpdate = buku.find((book) => book.judul === borrowing.judul);
      if (bookToUpdate) {
        await updateBooks(bookToUpdate.book_id, {
          status: "Dipinjam",
        });
      }

      // Update user loans in localStorage
      const userLoans = JSON.parse(localStorage.getItem("userLoans") || "[]");
      const updatedLoans = userLoans.map((loan) =>
        loan.judul === borrowing.judul && loan.status === "Menunggu Persetujuan"
          ? {
              ...loan,
              status: "Dipinjam",
              deadline: updatedBorrowing.return_date,
            }
          : loan
      );
      localStorage.setItem("userLoans", JSON.stringify(updatedLoans));

      // Refresh data
      fetchData();
      toast.dismiss(loadingId);
      toast.success("Peminjaman disetujui!");
    } catch (error) {
      console.error("Error approving borrowing:", error);
      toast.dismiss(loadingId);
      toast.error("Gagal menyetujui peminjaman.");
    }
  };

  // Handle reject borrowing
  const handleRejectBorrowing = async (borrowing) => {
    if (
      !window.confirm(
        "Apakah Anda yakin ingin menolak pengajuan peminjaman ini?"
      )
    ) {
      return;
    }

    const loadingId = toast.loading("Menolak peminjaman...");

    try {
      await updateBorrowing(borrowing.borrow_id, {
        ...borrowing,
        status: "Ditolak",
      });

      // Update user loans in localStorage
      const userLoans = JSON.parse(localStorage.getItem("userLoans") || "[]");
      const updatedLoans = userLoans.filter(
        (loan) =>
          !(
            loan.judul === borrowing.judul &&
            loan.status === "Menunggu Persetujuan"
          )
      );
      localStorage.setItem("userLoans", JSON.stringify(updatedLoans));

      // Refresh data
      fetchData();
      toast.dismiss(loadingId);
      toast.success("Peminjaman ditolak.");
    } catch (error) {
      console.error("Error rejecting borrowing:", error);
      toast.dismiss(loadingId);
      toast.error("Gagal menolak peminjaman.");
    }
  };

  // Handle book return
  const handleKembalikanBuku = async (index) => {
    const borrowing = peminjaman[index];
    const loadingId = toast.loading("Memproses pengembalian...");

    try {
      // Update borrowing status only
      await updateBorrowing(borrowing.borrow_id, {
        status: "Dikembalikan",
      });

      // Update book status to available
      const bookToUpdate = buku.find((book) => book.judul === borrowing.judul);
      if (bookToUpdate) {
        await updateBooks(bookToUpdate.book_id, {
          status: "Tersedia",
        });
      }

      // Update user loans in localStorage
      const userLoans = JSON.parse(localStorage.getItem("userLoans") || "[]");
      const updatedLoans = userLoans.map((loan) =>
        loan.judul === borrowing.judul && loan.status === "Dipinjam"
          ? { ...loan, status: "Dikembalikan" }
          : loan
      );
      localStorage.setItem("userLoans", JSON.stringify(updatedLoans));

      // Refresh data
      fetchData();
      toast.dismiss(loadingId);
      toast.success("Buku berhasil dikembalikan");
    } catch (error) {
      console.error("Error returning book:", error);
      toast.dismiss(loadingId);
      toast.error("Gagal mengembalikan buku.");
    }
  };

  // Filter data based on search term
  const filteredPeminjaman = peminjaman.filter((item) => {
    const nama = (item.nama || "").toLowerCase();
    const judul = (item.judul || "").toLowerCase();
    const keyword = searchTerm.toLowerCase();
    return nama.includes(keyword) || judul.includes(keyword);
  });

  const filteredBuku = buku.filter((book) => {
    const judul = (book.judul || "").toLowerCase();
    const penulis = (book.penulis || "").toLowerCase();
    const genre = (book.genre || "").toLowerCase();
    const keyword = searchTerm.toLowerCase();
    return (
      judul.includes(keyword) ||
      penulis.includes(keyword) ||
      genre.includes(keyword)
    );
  });

  // --- BAGIAN TAMPILAN (Responsive Layout) ---
  return (
    <section className="w-full min-h-screen bg-linear-to-b from-white via-white/80 to-orange-200 pt-24 pb-20 px-4 md:px-6 flex justify-center">
      <div className="w-full max-w-7xl bg-white rounded-2xl shadow-xl border border-orange-100 px-4 py-5 md:px-8 md:py-6">
        
        {/* Header Responsive */}
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6 md:mb-8">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Panel Admin <span className="text-orange-600">Perpustakaan</span>
            </h1>
            <p className="text-sm md:text-base text-gray-500">
              Kelola data perpustakaan.
            </p>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="self-start md:self-auto px-4 py-2 rounded-lg bg-red-500 text-white text-sm md:text-base font-medium hover:bg-red-600 transition-colors shadow-sm"
          >
            Logout
          </button>
        </div>

        {/* Tab Navigation Responsive */}
        <div className="flex flex-wrap gap-2 border-b border-gray-200 mb-6">
          {["peminjaman", "buku", "dashboard"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-2 px-3 md:px-6 text-sm md:text-base font-medium rounded-t-md transition-colors capitalize ${
                activeTab === tab
                  ? "border-b-2 border-orange-500 text-orange-600 bg-orange-50"
                  : "text-gray-500 hover:text-orange-500"
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
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400 text-sm"
          />
        </div>

        {/* Peminjaman Tab */}
        {activeTab === "peminjaman" && (
          <div className="bg-white rounded-xl border border-gray-100 shadow-md p-4 md:p-6 space-y-6">
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">
              Kelola Peminjaman
            </h2>

            {/* Form Peminjaman Responsive (Grid 1 col di HP, 2 di Tablet, 4 di PC) */}
            <form onSubmit={handleSubmitPeminjaman} className="mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nama</label>
                  <input type="text" name="nama" value={formPeminjaman.nama} onChange={handlePeminjamanChange} className="w-full p-2.5 border rounded-lg text-sm" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Buku</label>
                  <select name="judul" value={formPeminjaman.judul} onChange={handlePeminjamanChange} className="w-full p-2.5 border rounded-lg text-sm" required>
                    <option value="">Pilih Buku</option>
                    {buku.filter((book) => book.status === "Tersedia").map((book) => (<option key={book.book_id} value={book.judul}>{book.judul}</option>))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tgl Pinjam</label>
                  <input type="date" name="tanggalPinjam" value={formPeminjaman.tanggalPinjam} onChange={handlePeminjamanChange} className="w-full p-2.5 border rounded-lg text-sm" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Jatuh Tempo</label>
                  <input type="date" name="deadline" value={formPeminjaman.deadline} onChange={handlePeminjamanChange} min={formPeminjaman.tanggalPinjam} className="w-full p-2.5 border rounded-lg text-sm" required />
                </div>
                <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                   <select name="status" value={formPeminjaman.status} onChange={handlePeminjamanChange} className="w-full p-2.5 border rounded-lg text-sm">
                    <option value="Dipinjam">Dipinjam</option>
                    <option value="Dikembalikan">Dikembalikan</option>
                  </select>
                </div>
                
                {/* Tombol Aksi Form */}
                <div className="flex items-end gap-2 lg:col-span-3">
                  <button type="submit" className="flex-1 md:flex-none bg-orange-600 text-white py-2.5 px-6 rounded-lg text-sm font-medium hover:bg-orange-700 transition-colors">
                    {editIndex === null ? "Tambah" : "Simpan"}
                  </button>
                  {editIndex !== null && (
                    <button type="button" onClick={() => { setFormPeminjaman({ id: Date.now(), nama: "", judul: "", tanggalPinjam: "", deadline: "", status: "Dipinjam" }); setEditIndex(null); toast("Batal", { icon: "❌" }); }} className="bg-gray-100 text-gray-800 py-2.5 px-4 rounded-lg text-sm hover:bg-gray-200">
                      Batal
                    </button>
                  )}
                </div>
              </div>
            </form>

            {/* Tabel Peminjaman dengan Scroll Horizontal */}
            <div className="overflow-x-auto rounded-xl border border-gray-100 bg-white">
              <table className="min-w-full text-sm whitespace-nowrap">
                <thead className="bg-orange-500 text-white">
                  <tr>
                    <th className="px-4 py-3 text-left">Nama</th>
                    <th className="px-4 py-3 text-left">Buku</th>
                    <th className="px-4 py-3 text-left">Tgl Pinjam</th>
                    <th className="px-4 py-3 text-left">Status</th>
                    <th className="px-4 py-3 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                   {filteredPeminjaman.length === 0 ? (
                    <tr><td colSpan="5" className="px-6 py-4 text-center text-gray-500">Data kosong</td></tr>
                  ) : (
                    filteredPeminjaman.map((item, index) => (
                      <tr key={index} className="hover:bg-orange-50/40">
                        <td className="px-4 py-3">{item.nama}</td>
                        <td className="px-4 py-3 max-w-[150px] truncate" title={item.judul}>{item.judul}</td>
                        <td className="px-4 py-3">{item.tanggalPinjam}</td>
                        <td className="px-4 py-3">
                           <span className={`px-2 py-1 text-xs rounded-full border ${item.status === "Dipinjam" ? "bg-yellow-100 text-yellow-800" : item.status === "Menunggu Persetujuan" ? "bg-orange-100 text-orange-800" : item.status === "Ditolak" ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"}`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center flex justify-center gap-2">
                            {/* Tombol aksi */}
                            {item.status === "Menunggu Persetujuan" && (
                              <>
                                <button onClick={() => handleApproveBorrowing(item)} title="Setujui" className="text-green-600 hover:bg-green-50 p-1 rounded">✅</button>
                                <button onClick={() => handleRejectBorrowing(item)} title="Tolak" className="text-red-600 hover:bg-red-50 p-1 rounded">❌</button>
                              </>
                            )}
                            <button onClick={() => handleEditPeminjaman(index)} title="Edit" className="text-blue-600 hover:bg-blue-50 p-1 rounded">✏️</button>
                            <button onClick={() => handleDeletePeminjaman(index)} title="Hapus" className="text-red-600 hover:bg-red-50 p-1 rounded">🗑️</button>
                            {item.status === "Dipinjam" && (
                               <button onClick={() => handleKembalikanBuku(index)} title="Kembalikan" className="text-green-600 hover:bg-green-50 p-1 rounded">↩️</button>
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
          <div className="bg-white rounded-lg shadow-lg p-4 md:p-6">
             <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-6">Daftar Buku</h2>
             <form onSubmit={handleSubmitBuku} className="mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <input type="text" name="judul" placeholder="Judul" value={formBuku.judul} onChange={handleBukuChange} className="p-2 border rounded-lg" required />
                    <input type="text" name="penulis" placeholder="Penulis" value={formBuku.penulis} onChange={handleBukuChange} className="p-2 border rounded-lg" required />
                    <input type="text" name="genre" placeholder="Genre" value={formBuku.genre} onChange={handleBukuChange} className="p-2 border rounded-lg" />
                    <select name="status" value={formBuku.status} onChange={handleBukuChange} className="p-2 border rounded-lg">
                        <option value="Tersedia">Tersedia</option>
                        <option value="Dipinjam">Dipinjam</option>
                    </select>
                    <div className="col-span-1 md:col-span-2 lg:col-span-4">
                        <textarea name="blurb" placeholder="Sinopsis" value={formBuku.blurb} onChange={handleBukuChange} rows={2} className="w-full p-2 border rounded-lg resize-none" />
                    </div>
                    <div className="col-span-1 lg:col-span-4 flex gap-2">
                         <button type="submit" className="bg-orange-600 text-white py-2 px-6 rounded-lg text-sm font-medium hover:bg-orange-700">{editBukuIndex === null ? "Tambah" : "Simpan"}</button>
                         {editBukuIndex !== null && <button type="button" onClick={() => { setFormBuku({ book_id: Date.now(), judul: "", penulis: "", genre: "", status: "Tersedia" }); setEditBukuIndex(null); }} className="bg-gray-200 px-4 rounded-lg">Batal</button>}
                    </div>
                </div>
             </form>

             <div className="overflow-x-auto rounded-xl border border-gray-100">
                <table className="min-w-full text-sm whitespace-nowrap">
                    <thead className="bg-orange-500 text-white">
                        <tr>
                            <th className="px-4 py-3 text-left">Judul</th>
                            <th className="px-4 py-3 text-left">Penulis</th>
                            <th className="px-4 py-3 text-left">Status</th>
                            <th className="px-4 py-3 text-center">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                         {filteredBuku.map((book, index) => (
                             <tr key={book.book_id} className="hover:bg-orange-50/40">
                                 <td className="px-4 py-3 max-w-[200px] truncate">{book.judul}</td>
                                 <td className="px-4 py-3">{book.penulis}</td>
                                 <td className="px-4 py-3"><span className={`px-2 py-1 text-xs rounded-full border ${book.status === "Tersedia" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>{book.status}</span></td>
                                 <td className="px-4 py-3 text-center gap-2 flex justify-center">
                                     <button onClick={() => handleEditBuku(index)} className="text-blue-600">✏️</button>
                                     <button onClick={() => handleDeleteBuku(index)} className="text-red-600">🗑️</button>
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
           <div className="bg-white rounded-lg shadow-lg p-4 md:p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                     <div className="bg-blue-50 p-6 rounded-lg text-center md:text-left"><h3 className="font-semibold text-blue-800">Total Buku</h3><p className="text-3xl font-bold text-blue-600">{buku.length}</p></div>
                     <div className="bg-yellow-50 p-6 rounded-lg text-center md:text-left"><h3 className="font-semibold text-yellow-800">Sedang Dipinjam</h3><p className="text-3xl font-bold text-yellow-600">{peminjaman.filter(i => i.status === "Dipinjam").length}</p></div>
                     <div className="bg-green-50 p-6 rounded-lg text-center md:text-left"><h3 className="font-semibold text-green-800">Total Transaksi</h3><p className="text-3xl font-bold text-green-600">{peminjaman.length}</p></div>
                </div>
           </div>
        )}

      </div>
    </section>
  );
}