import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getBooks, createBorrowing } from "../api/apiClient";
import toast from "react-hot-toast";

const KoleksiBuku = () => {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("Semua");
  const [genres, setGenres] = useState(["Semua"]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load books data from database
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        const booksData = await getBooks();
        setBooks(booksData.data || []);
        setFilteredBooks(booksData.data || []);

        // Extract unique genres from database
        const uniqueGenres = ["Semua"];
        const allGenres =
          booksData.data?.map((book) => book.genre).filter(Boolean) || [];
        const distinctGenres = [...new Set(allGenres)];
        setGenres([...uniqueGenres, ...distinctGenres]);
      } catch (err) {
        setError("Gagal memuat data buku. Silakan coba lagi.");
        console.error("Error fetching books:", err);
        toast.error("Gagal memuat data buku.");
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  // Filter books based on search and genre
  useEffect(() => {
    let result = [...books];

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (book) =>
          book.title.toLowerCase().includes(query) ||
          book.author.toLowerCase().includes(query)
      );
    }

    // Filter by genre
    if (selectedGenre !== "Semua") {
      result = result.filter((book) => book.genre === selectedGenre);
    }

    setFilteredBooks(result);
  }, [searchQuery, selectedGenre, books]);

  const handleBorrow = async (bookId) => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (!user || !localStorage.getItem("isLoggedIn")) {
      toast.error("Silakan login terlebih dahulu untuk meminjam buku");
      return;
    }

    const bookToBorrow = books.find((book) => book.book_id === bookId);
    if (!bookToBorrow) {
      toast.error("Buku tidak ditemukan");
      return;
    }

    if (bookToBorrow.status !== "Tersedia") {
      toast.error("Buku tidak tersedia untuk dipinjam saat ini");
      return;
    }

    // Tampilkan loading saat proses peminjaman
    const loadingId = toast.loading("Memproses peminjaman...");

    try {
      const borrowingData = {
        book_id: bookId,
        user_id: user.user_id,
        admin_id: null, // Will be set by admin when approving
        borrow_date: new Date().toISOString().split("T")[0],
        return_date: null, // Will be set by admin when approving
        status: "Menunggu Persetujuan", // Now valid with updated constraint
      };

      const result = await createBorrowing(borrowingData);

      // Update book status in local state
      const updatedBooks = books.map((book) =>
        book.book_id === bookId
          ? { ...book, status: "Menunggu Persetujuan" }
          : book
      );
      setBooks(updatedBooks);
      setFilteredBooks(updatedBooks);

      // Save to localStorage for user account view
      const currentLoans = JSON.parse(
        localStorage.getItem("userLoans") || "[]"
      );
      const newLoan = {
        judul: bookToBorrow.title,
        tanggalPinjam: borrowingData.borrow_date,
        deadline: null,
        status: "Menunggu Persetujuan",
        borrow_id: Date.now(), // Temporary ID
      };
      localStorage.setItem(
        "userLoans",
        JSON.stringify([...currentLoans, newLoan])
      );

      toast.dismiss(loadingId);
      toast.success(`Permintaan pinjam "${bookToBorrow.title}" berhasil dikirim!`, {
        duration: 4000,
        icon: '📚',
      });

    } catch (error) {
      console.error("Error creating borrowing:", error);
      toast.dismiss(loadingId);
      toast.error("Gagal mengajukan peminjaman. Silakan coba lagi.");
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-white via-white/80 to-orange-200">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Loading State */}
        {loading && (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-500">Memuat data buku...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-red-500 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600"
            >
              Coba Lagi
            </button>
          </div>
        )}

        {/* Main Content */}
        {!loading && !error && (
          <>
            {/* Search and Filter Section */}
            <div className="mb-8 bg-white p-6 rounded-lg shadow-md">
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <label
                    htmlFor="search"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Cari Buku
                  </label>
                  <input
                    type="text"
                    id="search"
                    placeholder="Cari judul atau penulis..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <div className="w-full md:w-64">
                  <label
                    htmlFor="genre"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Filter Genre
                  </label>
                  <select
                    id="genre"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                    value={selectedGenre}
                    onChange={(e) => setSelectedGenre(e.target.value)}
                  >
                    {genres.map((genre) => (
                      <option key={genre} value={genre}>
                        {genre}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <p className="text-sm text-gray-500">
                Menampilkan {filteredBooks.length} dari {books.length} buku
              </p>
            </div>

            {/* Books Grid */}
            {filteredBooks.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredBooks.map((book) => (
                  <div
                    key={book.book_id}
                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 p-6 h-full"
                  >
                    <div className="flex flex-col h-full">
                      <div className="grow">
                        <h3
                          className="font-semibold text-lg mb-2"
                          title={book.title}
                        >
                          {book.title}
                        </h3>
                        <p className="text-gray-600 text-sm mb-3">
                          Oleh: {book.author}
                        </p>
                        <div className="flex flex-wrap gap-2 mb-4">
                          <span className="px-3 py-1 bg-orange-100 text-orange-800 text-xs font-medium rounded-full">
                            {book.genre}
                          </span>
                          <span
                            className={`px-3 py-1 text-xs font-medium rounded-full ${
                              book.status === "Tersedia"
                                ? "bg-green-100 text-green-800"
                                : book.status === "Menunggu Persetujuan"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {book.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 line-clamp-3">
                          {book.blurb}
                        </p>
                      </div>
                      <button
                        className={`w-full py-2 rounded-md transition-colors mt-4 ${
                          book.status === "Tersedia"
                            ? "bg-orange-500 text-white hover:bg-orange-600"
                            : "bg-gray-300 text-gray-500 cursor-not-allowed"
                        }`}
                        onClick={() => handleBorrow(book.book_id)}
                        disabled={book.status !== "Tersedia"}
                      >
                        {book.status === "Tersedia"
                          ? "Pinjam Buku"
                          : book.status === "Menunggu Persetujuan"
                          ? "Menunggu Persetujuan"
                          : "Tidak Tersedia"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-lg shadow">
                <p className="text-gray-500">Tidak ada buku yang ditemukan.</p>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedGenre("Semua");
                  }}
                  className="mt-4 text-orange-600 hover:text-orange-800"
                >
                  Reset filter
                </button>
              </div>
            )}
          </>
        )}
      </div>
      {/* ✅ Footer */}
      <footer className="w-full text-center py-4 text-gray-700 mt-6">
        <p className="text-sm">
          © {new Date().getFullYear()} Perpustakaan Bacain — All Rights
          Reserved
        </p>
      </footer>
    </div>
  );
};

export default KoleksiBuku;