import React, { useEffect, useState } from "react";
import {
  getBorrowings,
  updateBorrowing,
  getBooks,
  updateBooks,
  deleteBook,
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

  const [formBuku, setFormBuku] = useState({
    book_id: Date.now(),
    judul: "",
    penulis: "",
    status: "Tersedia",
  });

  const [editIndex, setEditIndex] = useState(null);
  const [editBukuIndex, setEditBukuIndex] = useState(null);

  // Load data from backend on component mount
  useEffect(() => {
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
    } else {
      // Update existing loan
      const updatedPeminjaman = [...peminjaman];
      updatedPeminjaman[editIndex] = formPeminjaman;
      setPeminjaman(updatedPeminjaman);
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
    } else {
      // Update existing book
      const updatedBuku = [...buku];
      updatedBuku[editBukuIndex] = formBuku;
      setBuku(updatedBuku);
    }

    // Reset form
    setFormBuku({
      book_id: Date.now(),
      judul: "",
      penulis: "",
      status: "Tersedia",
    });
    setEditBukuIndex(null);
  };

  // Handle edit actions
  const handleEditPeminjaman = (index) => {
    setFormPeminjaman(peminjaman[index]);
    setEditIndex(index);
  };

  const handleEditBuku = (index) => {
    setFormBuku(buku[index]);
    setEditBukuIndex(index);
  };

  // Handle delete actions
  const handleDeletePeminjaman = (index) => {
    if (
      window.confirm("Apakah Anda yakin ingin menghapus data peminjaman ini?")
    ) {
      const newData = peminjaman.filter((_, i) => i !== index);
      setPeminjaman(newData);
    }
  };

  const handleDeleteBuku = async (index) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus buku ini?")) {
      return;
    }

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
    } catch (error) {
      console.error("Error deleting book:", error);
      alert("Gagal menghapus buku. Silakan coba lagi.");
    }
  };

  // Handle approve borrowing
  const handleApproveBorrowing = async (borrowing) => {
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
      alert("Peminjaman telah disetujui!");
    } catch (error) {
      console.error("Error approving borrowing:", error);
      alert("Gagal menyetujui peminjaman. Silakan coba lagi.");
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
      alert("Peminjaman telah ditolak!");
    } catch (error) {
      console.error("Error rejecting borrowing:", error);
      alert("Gagal menolak peminjaman. Silakan coba lagi.");
    }
  };

  // Handle book return
  const handleKembalikanBuku = async (index) => {
    const borrowing = peminjaman[index];

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
      alert("Buku telah dikembalikan!");
    } catch (error) {
      console.error("Error returning book:", error);
      alert("Gagal mengembalikan buku. Silakan coba lagi.");
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
    const keyword = searchTerm.toLowerCase();
    return judul.includes(keyword) || penulis.includes(keyword);
  });

  return (
    <section className="w-full min-h-screen bg-linear-to-b from-white via-white/80 to-orange-200 pt-28 pb-20 px-4 flex justify-center">
      <div className="w-full max-w-7xl border-4 border-orange-500 rounded-lg p-6 bg-white">
        <h1 className="text-3xl font-bold text-orange-600 mb-6">
          Panel Admin Perpustakaan
        </h1>

        {/* Tab Navigation */}
        <div className="flex border-b mb-6">
          <button
            onClick={() => setActiveTab("peminjaman")}
            className={`py-2 px-6 font-medium ${
              activeTab === "peminjaman"
                ? "border-b-2 border-orange-500 text-orange-600"
                : "text-gray-500"
            }`}
          >
            Peminjaman
          </button>
          <button
            onClick={() => setActiveTab("buku")}
            className={`py-2 px-6 font-medium ${
              activeTab === "buku"
                ? "border-b-2 border-orange-500 text-orange-600"
                : "text-gray-500"
            }`}
          >
            Daftar Buku
          </button>
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`py-2 px-6 font-medium ${
              activeTab === "dashboard"
                ? "border-b-2 border-orange-500 text-orange-600"
                : "text-gray-500"
            }`}
          >
            Dashboard
          </button>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Cari..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
        </div>

        {/* Peminjaman Tab */}
        {activeTab === "peminjaman" && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Kelola Peminjaman
            </h2>

            {/* Add/Edit Peminjaman Form */}
            <form onSubmit={handleSubmitPeminjaman} className="mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nama Peminjam
                  </label>
                  <input
                    type="text"
                    name="nama"
                    value={formPeminjaman.nama}
                    onChange={handlePeminjamanChange}
                    className="w-full p-2 border rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Judul Buku
                  </label>
                  <select
                    name="judul"
                    value={formPeminjaman.judul}
                    onChange={handlePeminjamanChange}
                    className="w-full p-2 border rounded-lg"
                    required
                  >
                    <option key="placeholder" value="">
                      Pilih Buku
                    </option>
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tanggal Pinjam
                  </label>
                  <input
                    type="date"
                    name="tanggalPinjam"
                    value={formPeminjaman.tanggalPinjam}
                    onChange={handlePeminjamanChange}
                    className="w-full p-2 border rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Jatuh Tempo
                  </label>
                  <input
                    type="date"
                    name="deadline"
                    value={formPeminjaman.deadline}
                    onChange={handlePeminjamanChange}
                    min={formPeminjaman.tanggalPinjam}
                    className="w-full p-2 border rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    name="status"
                    value={formPeminjaman.status}
                    onChange={handlePeminjamanChange}
                    className="w-full p-2 border rounded-lg"
                  >
                    <option key="dipinjam" value="Dipinjam">
                      Dipinjam
                    </option>
                    <option key="dikembalikan" value="Dikembalikan">
                      Dikembalikan
                    </option>
                  </select>
                </div>
                <div className="flex items-end">
                  <button
                    type="submit"
                    className="bg-orange-600 text-white py-2 px-6 rounded-lg hover:bg-orange-700 transition"
                  >
                    {editIndex === null
                      ? "Tambah Peminjaman"
                      : "Simpan Perubahan"}
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
                      }}
                      className="ml-2 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition"
                    >
                      Batal
                    </button>
                  )}
                </div>
              </div>
            </form>

            {/* Peminjaman Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
                <thead className="bg-orange-500 text-white">
                  <tr>
                    <th className="px-6 py-3 text-left">Nama Peminjam</th>
                    <th className="px-6 py-3 text-left">Judul Buku</th>
                    <th className="px-6 py-3 text-left">Tanggal Pinjam</th>
                    <th className="px-6 py-3 text-left">Jatuh Tempo</th>
                    <th className="px-6 py-3 text-left">Status</th>
                    <th className="px-6 py-3 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredPeminjaman.length === 0 ? (
                    <tr>
                      <td
                        colSpan="6"
                        className="px-6 py-4 text-center text-gray-500"
                      >
                        Tidak ada data peminjaman
                      </td>
                    </tr>
                  ) : (
                    filteredPeminjaman.map((item, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4">{item.nama}</td>
                        <td className="px-6 py-4">{item.judul}</td>
                        <td className="px-6 py-4">{item.tanggalPinjam}</td>
                        <td className="px-6 py-4">{item.deadline}</td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
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
                        <td className="px-6 py-4 text-center">
                          <div className="flex justify-center space-x-2">
                            {item.status === "Menunggu Persetujuan" && (
                              <>
                                <button
                                  onClick={() => handleApproveBorrowing(item)}
                                  className="text-green-600 hover:text-green-900"
                                >
                                  Setujui
                                </button>
                                <button
                                  onClick={() => handleRejectBorrowing(item)}
                                  className="text-red-600 hover:text-red-900"
                                >
                                  Tolak
                                </button>
                              </>
                            )}
                            <button
                              onClick={() => handleEditPeminjaman(index)}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeletePeminjaman(index)}
                              className="text-red-600 hover:text-red-900 ml-2"
                            >
                              Hapus
                            </button>
                            {item.status === "Dipinjam" && (
                              <button
                                onClick={() => handleKembalikanBuku(index)}
                                className="text-green-600 hover:text-green-900 ml-2"
                              >
                                Kembalikan
                              </button>
                            )}
                          </div>
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
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Daftar Buku
            </h2>

            {/* Add/Edit Buku Form */}
            <form onSubmit={handleSubmitBuku} className="mb-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Judul Buku
                  </label>
                  <input
                    type="text"
                    name="judul"
                    value={formBuku.judul}
                    onChange={handleBukuChange}
                    className="w-full p-2 border rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Penulis
                  </label>
                  <input
                    type="text"
                    name="penulis"
                    value={formBuku.penulis}
                    onChange={handleBukuChange}
                    className="w-full p-2 border rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    name="status"
                    value={formBuku.status}
                    onChange={handleBukuChange}
                    className="w-full p-2 border rounded-lg"
                  >
                    <option key="tersedia" value="Tersedia">
                      Tersedia
                    </option>
                    <option key="dipinjam" value="Dipinjam">
                      Dipinjam
                    </option>
                  </select>
                </div>
                <div className="flex items-end">
                  <button
                    type="submit"
                    className="bg-orange-600 text-white py-2 px-6 rounded-lg hover:bg-orange-700 transition"
                  >
                    {editBukuIndex === null
                      ? "Tambah Buku"
                      : "Simpan Perubahan"}
                  </button>
                  {editBukuIndex !== null && (
                    <button
                      type="button"
                      onClick={() => {
                        setFormBuku({
                          book_id: Date.now(),
                          judul: "",
                          penulis: "",
                          status: "Tersedia",
                        });
                        setEditBukuIndex(null);
                      }}
                      className="ml-2 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition"
                    >
                      Batal
                    </button>
                  )}
                </div>
              </div>
            </form>

            {/* Buku Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
                <thead className="bg-orange-500 text-white">
                  <tr>
                    <th className="px-6 py-3 text-left">Judul Buku</th>
                    <th className="px-6 py-3 text-left">Penulis</th>
                    <th className="px-6 py-3 text-left">Status</th>
                    <th className="px-6 py-3 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredBuku.length === 0 ? (
                    <tr>
                      <td
                        colSpan="4"
                        className="px-6 py-4 text-center text-gray-500"
                      >
                        Tidak ada data buku
                      </td>
                    </tr>
                  ) : (
                    filteredBuku.map((book, index) => (
                      <tr key={book.book_id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">{book.judul}</td>
                        <td className="px-6 py-4">{book.penulis}</td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              book.status === "Tersedia"
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {book.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex justify-center space-x-2">
                            <button
                              onClick={() => handleEditBuku(index)}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteBuku(index)}
                              className="text-red-600 hover:text-red-900 ml-2"
                            >
                              Hapus
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Dashboard Tab */}
        {activeTab === "dashboard" && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-800 mb-2">
                  Total Buku
                </h3>
                <p className="text-3xl font-bold text-blue-600">
                  {buku.length}
                </p>
              </div>
              <div className="bg-yellow-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-yellow-800 mb-2">
                  Buku Dipinjam
                </h3>
                <p className="text-3xl font-bold text-yellow-600">
                  {
                    peminjaman.filter((item) => item.status === "Dipinjam")
                      .length
                  }
                </p>
              </div>
              <div className="bg-green-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-green-800 mb-2">
                  Total Peminjaman
                </h3>
                <p className="text-3xl font-bold text-green-600">
                  {peminjaman.length}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Peminjaman Terbaru
                </h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  {peminjaman.length === 0 ? (
                    <p className="text-gray-500">Belum ada data peminjaman</p>
                  ) : (
                    <ul className="space-y-2">
                      {peminjaman
                        .sort(
                          (a, b) =>
                            new Date(b.tanggalPinjam) -
                            new Date(a.tanggalPinjam)
                        )
                        .slice(0, 5)
                        .map((item, index) => (
                          <li
                            key={index}
                            className="flex justify-between items-center p-2 hover:bg-gray-100 rounded"
                          >
                            <div>
                              <p className="font-medium">{item.judul}</p>
                              <p className="text-sm text-gray-600">
                                {item.nama}
                              </p>
                            </div>
                            <span
                              className={`px-2 py-1 text-xs rounded-full ${
                                item.status === "Dipinjam"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-green-100 text-green-800"
                              }`}
                            >
                              {item.status}
                            </span>
                          </li>
                        ))}
                    </ul>
                  )}
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Ketersediaan Buku
                </h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  {buku.length === 0 ? (
                    <p className="text-gray-500">Belum ada data buku</p>
                  ) : (
                    <ul className="space-y-2">
                      {buku
                        .sort((a, b) => a.status.localeCompare(b.status))
                        .slice(0, 5)
                        .map((book, index) => (
                          <li
                            key={index}
                            className="flex justify-between items-center p-2 hover:bg-gray-100 rounded"
                          >
                            <p className="font-medium">{book.judul}</p>
                            <span
                              className={`px-2 py-1 text-xs rounded-full ${
                                book.status === "Tersedia"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {book.status}
                            </span>
                          </li>
                        ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
