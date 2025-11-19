import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const [openDropdown, setOpenDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Tutup dropdown jika klik di luar
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Cek login ketika klik Beranda
  const handleHomeClick = () => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");

    if (isLoggedIn === "true") {
      navigate("/berandalog");
    } else {
      navigate("/");
    }
  };

  return (
    <header className="pt-0">
      <nav className="w-full">
        <div className="w-full flex items-center justify-between py-4 px-5 bg-white shadow-sm fixed top-0 left-0 z-50">
          {/* Kiri */}
          <div className="flex items-center space-x-10 ml-10">
            <div className="bg-gradient-to-r from-orange-500 to-yellow-400 text-transparent bg-clip-text font-semibold text-3xl">
              Bacain.
            </div>

            <div className="flex items-center space-x-12 relative">
              {/* Beranda → otomatis cek login */}
              <button
                onClick={handleHomeClick}
                className="text-base text-gray-700 hover:text-orange-500"
              >
                Beranda
              </button>

              <Link
                to="/tentang"
                className="text-base text-gray-700 hover:text-orange-500"
              >
                Tentang
              </Link>

              {/* Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setOpenDropdown(!openDropdown)}
                  className="text-base text-gray-700 hover:text-orange-500 flex items-center gap-1"
                >
                  Koleksi Buku
                  <span className="transition-transform duration-200">
                    {openDropdown ? "▴" : "▾"}
                  </span>
                </button>

                {openDropdown && (
                  <div className="absolute left-0 mt-2 w-48 bg-white border border-orange-300 rounded-lg shadow-lg py-2 z-50">
                    <Link
                      to="/koleksibuku?genre=novel"
                      className="block px-4 py-2 text-gray-700 hover:bg-orange-100"
                    >
                      Novel
                    </Link>
                    <Link
                      to="/koleksibuku?genre=fantasi"
                      className="block px-4 py-2 text-gray-700 hover:bg-orange-100"
                    >
                      Fantasi
                    </Link>
                    <Link
                      to="/koleksibuku?genre=horor"
                      className="block px-4 py-2 text-gray-700 hover:bg-orange-100"
                    >
                      Horor
                    </Link>
                    <Link
                      to="/koleksibuku?genre=romantis"
                      className="block px-4 py-2 text-gray-700 hover:bg-orange-100"
                    >
                      Romantis
                    </Link>
                    <Link
                      to="/koleksibuku?genre=sejarah"
                      className="block px-4 py-2 text-gray-700 hover:bg-orange-100"
                    >
                      Sejarah
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Kanan */}
          <div className="flex items-center space-x-12 mr-10">
            <div className="relative">
              <input
                type="text"
                placeholder="Cari Judul Buku, Kategori Buku, Penulis Buku"
                className="border border-orange-300 rounded-full px-4 py-2 text-base w-96 placeholder:text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>

            <button className="bg-orange-500 text-white text-sm px-4 py-2 rounded-full hover:bg-orange-600 transition">
              Akun
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
