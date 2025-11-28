import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// Sample book data - replace with your actual data source
const sampleBooks = [
  {
    id: 1,
    title: 'Laskar Pelangi',
    author: 'Andrea Hirata',
    genre: 'Novel',
    year: 2005,
    stock: 5
  },
  {
    id: 2,
    title: 'Bumi Manusia',
    author: 'Pramoedya Ananta Toer',
    genre: 'Fiksi Sejarah',
    year: 1980,
    stock: 3
  },
  // Add more sample books as needed
];

const KoleksiBuku = () => {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('Semua');
  const [genres, setGenres] = useState(['Semua']);

  // Load books data
  useEffect(() => {
    // In a real app, you would fetch this from an API
    setBooks(sampleBooks);
    setFilteredBooks(sampleBooks);
    
    // Extract unique genres
    const allGenres = ['Semua', ...new Set(sampleBooks.map(book => book.genre))];
    setGenres(allGenres);
  }, []);

  // Filter books based on search and genre
  useEffect(() => {
    let result = [...books];
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        book =>
          book.title.toLowerCase().includes(query) ||
          book.author.toLowerCase().includes(query)
      );
    }
    
    // Filter by genre
    if (selectedGenre !== 'Semua') {
      result = result.filter(book => book.genre === selectedGenre);
    }
    
    setFilteredBooks(result);
  }, [searchQuery, selectedGenre, books]);

  const handleBorrow = (bookId) => {
    const bookToBorrow = books.find(book => book.id === bookId);
    alert(`Meminjam buku: ${bookToBorrow.title}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-white/80 to-orange-200">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Koleksi Buku</h1>
        
        {/* Search and Filter Section */}
        <div className="mb-8 bg-white p-6 rounded-lg shadow-md">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
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
              <label htmlFor="genre" className="block text-sm font-medium text-gray-700 mb-1">
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
              <div key={book.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 p-6 h-full">
                <div className="flex flex-col h-full">
                  <div className="flex-grow">
                    <h3 className="font-semibold text-lg mb-2" title={book.title}>
                      {book.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3">Oleh: {book.author}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="px-3 py-1 bg-orange-100 text-orange-800 text-xs font-medium rounded-full">
                        {book.genre}
                      </span>
                      <span className="px-3 py-1 bg-gray-100 text-gray-800 text-xs font-medium rounded-full">
                        {book.year}
                      </span>
                    </div>
                    <div className="text-sm text-gray-700">
                      <p>Stok Tersedia: <span className="font-medium">{book.stock} buku</span></p>
                    </div>
                  </div>
                  <button 
                    className="w-full bg-orange-500 text-white py-2 rounded-md hover:bg-orange-600 transition-colors mt-4"
                    onClick={() => handleBorrow(book.id)}
                  >
                    Pinjam Buku
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
                setSearchQuery('');
                setSelectedGenre('Semua');
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