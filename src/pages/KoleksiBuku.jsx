import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

// Sample book data - based on database schema
const sampleBooks = [
  {
    book_id: 1,
    title: "Laskar Pelangi",
    author: "Andrea Hirata",
    blurb:
      "Kisah perjalanan sepuluh orang anak SD dari Belitong dalam mengenyam pendidikan.",
    genre: "Fiksi",
    status: "Tersedia",
  },
  {
    book_id: 2,
    title: "Bumi Manusia",
    author: "Pramoedya Ananta Toer",
    blurb:
      "Novel sejarah tentang perjuangan rakyat Indonesia melawan penjajahan.",
    genre: "Fiksi",
    status: "Tersedia",
  },
  {
    book_id: 3,
    title: "Negeri 5 Menara",
    author: "Ahmad Fuadi",
    blurb:
      "Petualangan dua remaja Muslim mencari ilmu di berbagai belahan dunia.",
    genre: "Fiksi",
    status: "Tersedia",
  },
  {
    book_id: 4,
    title: "Ekonomi 101",
    author: "Tim Ahli",
    blurb: "Pengantar lengkap tentang konsep dasar ekonomi modern.",
    genre: "Ekonomi",
    status: "Tersedia",
  },
  {
    book_id: 5,
    title: "Tafsir Al-Quran",
    author: "Imam Al-Qurthubi",
    blurb: "Penjelasan mendalam tentang makna dan hikmah ayat-ayat Al-Quran.",
    genre: "Agama",
    status: "Tersedia",
  },
  {
    book_id: 6,
    title: "Kamus Administrasi Publik",
    author: "Dr. Harbani Pasolong",
    blurb:
      "Referensi lengkap istilah dan konsep dalam administrasi pemerintahan.",
    genre: "Administrasi",
    status: "Tersedia",
  },
  {
    book_id: 7,
    title: "Humor dalam Seni",
    author: "Dr. Cornelis Lay",
    blurb: "Analisis mendalam tentang peran humor dalam berbagai bentuk seni.",
    genre: "Humor",
    status: "Tersedia",
  },
  {
    book_id: 8,
    title: "Ensiklopedia Indonesia",
    author: "Tim Penyusun",
    blurb: "Kumpulan pengetahuan lengkap tentang Indonesia dan budayanya.",
    genre: "Ensiklopedia",
    status: "Tersedia",
  },
];

const KoleksiBuku = () => {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("Semua");
  const [genres, setGenres] = useState(["Semua"]);

  // Load books data
  useEffect(() => {
    // In a real app, you would fetch this from an API
    setBooks(sampleBooks);
    setFilteredBooks(sampleBooks);

    // Genre options based on database schema
    const allGenres = [
      "Semua",
      "Administrasi",
      "Agama",
      "Ekonomi",
      "Ensiklopedia",
      "Fiksi",
      "Humor",
    ];
    setGenres(allGenres);
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

  const handleBorrow = (bookId) => {
    const bookToBorrow = books.find((book) => book.id === bookId);
    alert(`Meminjam buku: ${bookToBorrow.title}`);
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-white via-white/80 to-orange-200">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Koleksi Buku</h1>

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
      </div>
    </div>
  );
};

export default KoleksiBuku;
