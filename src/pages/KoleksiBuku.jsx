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
        admin_id: null,
        borrow_date: new Date().toISOString().split("T")[0],
        return_date: null,
        status: "Menunggu Persetujuan",
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

      // Save to localStorage
      const currentLoans = JSON.parse(
        localStorage.getItem("userLoans") || "[]"
      );
      const newLoan = {
        judul: bookToBorrow.title,
        tanggalPinjam: borrowingData.borrow_date,
        deadline: null,
        status: "Menunggu Persetujuan",
        borrow_id: Date.now(),
      };
      localStorage.setItem(
        "userLoans",
        JSON.stringify([...currentLoans, newLoan])
      );

      toast.dismiss(loadingId);
      toast.success(
        `Permintaan pinjam "${bookToBorrow.title}" berhasil dikirim!`,
        {
          duration: 4000,
          icon: "📚",
        }
      );
    } catch (error) {
      console.error("Error creating borrowing:", error);
      toast.dismiss(loadingId);
      toast.error("Gagal mengajukan peminjaman. Silakan coba lagi.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-white/80 to-orange-200 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Loading State */}
        {loading && (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow animate-pulse">
            <p className="text-gray-500 dark:text-gray-300 font-medium">Sedang memuat data...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow">
            <p className="text-red-500 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors"
            >
              Coba Lagi
            </button>
          </div>
        )}

        {/* Main Content */}
        {!loading && !error && (
          <>
            {/* Search and Filter Section */}
            <div className="mb-8 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg">
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <label
                    htmlFor="search"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Cari Buku
                  </label>
                  <input
                    type="text"
                    id="search"
                    placeholder="Cari judul atau penulis..."
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:text-white transition-colors"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <div className="w-full md:w-64">
                  <label
                    htmlFor="genre"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Filter Genre
                  </label>
                  <select
                    id="genre"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none cursor-pointer dark:bg-gray-700 dark:text-white transition-colors"
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

              <p className="text-sm text-gray-500 dark:text-gray-400">
                Menampilkan {filteredBooks.length} dari {books.length} buku
              </p>
            </div>

            {/* Books Grid */}
            {filteredBooks.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredBooks.map((book) => (
                  <div
                    key={book.book_id}
                    // FITUR UPDATE: Dark Mode + Hover Effect (Melayang & Bayangan)
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden p-6 h-full flex flex-col border border-transparent 
                               hover:border-orange-200 dark:hover:border-orange-700 hover:-translate-y-2 hover:shadow-2xl 
                               transition-all duration-300 ease-in-out group"
                  >
                    <div className="grow">
                      <h3
                        className="font-semibold text-lg mb-2 text-gray-800 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors"
                        title={book.title}
                      >
                        {book.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                        Oleh: {book.author}
                      </p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        <span className="px-3 py-1 bg-orange-100 dark:bg-orange-900/40 text-orange-800 dark:text-orange-200 text-xs font-medium rounded-full">
                          {book.genre}
                        </span>
                        <span
                          className={`px-3 py-1 text-xs font-medium rounded-full ${
                            book.status === "Tersedia"
                              ? "bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-200"
                              : book.status === "Menunggu Persetujuan"
                              ? "bg-yellow-100 dark:bg-yellow-900/40 text-yellow-800 dark:text-yellow-200"
                              : "bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-200"
                          }`}
                        >
                          {book.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
                        {book.blurb}
                      </p>
                    </div>
                    
                    {/* FITUR UPDATE: Tombol dengan efek tekan (Active Scale) & Dark Mode */}
                    <button
                      className={`w-full py-2 rounded-lg transition-all duration-200 mt-4 font-medium active:scale-95 ${
                        book.status === "Tersedia"
                          ? "bg-orange-500 text-white hover:bg-orange-600 shadow-md hover:shadow-lg"
                          : "bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
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
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow transition-colors">
                <p className="text-gray-500 dark:text-gray-400">Tidak ada buku yang ditemukan.</p>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedGenre("Semua");
                  }}
                  className="mt-4 text-orange-600 dark:text-orange-400 hover:text-orange-800 hover:underline"
                >
                  Reset filter
                </button>
              </div>
            )}
          </>
        )}
      </div>
      {/* Footer */}
      <footer className="w-full text-center py-4 text-gray-700 dark:text-gray-500 mt-6 transition-colors">
        <p className="text-sm">
          © {new Date().getFullYear()} Perpustakaan Bacain — All Rights
          Reserved
        </p>
      </footer>
    </div>
  );
};

export default KoleksiBuku;