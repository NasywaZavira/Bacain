import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    const user = JSON.parse(localStorage.getItem("user") || "null");

    setIsLoggedIn(loggedIn);
    setUserData(user);
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

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

  const handleHomeClick = () => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    navigate(isLoggedIn === "true" ? "/berandalog" : "/");
  };

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    setIsLoggedIn(false);
    setUserData(null);
    navigate("/");
  };

  return (
    <header className="pt-0">
      <nav className="w-full">
        {/* Navbar Container */}
        <div className="w-full flex items-center justify-between py-4 px-5 bg-white dark:bg-gray-900 shadow-sm hover:shadow-md transition-all duration-300 fixed top-0 left-0 z-50 border-b border-transparent dark:border-gray-800">
          
          {/* =========================================
              BAGIAN KIRI: GABUNGAN LOGO & MENU DESKTOP
             ========================================= */}
          <div className="flex items-center md:gap-10">
            
            {/* 1. LOGO */}
            <div 
              onClick={handleHomeClick}
              className="bg-gradient-to-r from-orange-500 to-yellow-400 text-transparent bg-clip-text font-semibold text-2xl md:text-3xl cursor-pointer md:ml-10"
            >
              Bacain.
            </div>

            {/* 2. MENU DESKTOP (Hanya muncul di Layar Besar, nempel di kiri sebelah logo) */}
            <div className="hidden md:flex items-center space-x-8">
              <button
                onClick={handleHomeClick}
                className="text-base text-gray-700 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400 hover:-translate-y-0.5 transition-all duration-200 font-medium"
              >
                Beranda
              </button>

              <Link
                to="/tentang"
                className="text-base text-gray-700 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400 hover:-translate-y-0.5 transition-all duration-200 font-medium"
              >
                Tentang
              </Link>

              <Link
                to="/koleksibuku"
                className="text-base text-gray-700 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400 hover:-translate-y-0.5 transition-all duration-200 font-medium"
              >
                Koleksi Buku
              </Link>
            </div>
          </div>

          {/* =========================================
              BAGIAN KANAN: AKUN / TEMA / HAMBURGER
             ========================================= */}
          <div className="flex items-center gap-4 mr-2 md:mr-10">
            
            {/* Theme Toggle (Desktop & Mobile) */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              {theme === "dark" ? "☀️" : "🌙"}
            </button>

            {/* Desktop Auth Buttons (Hidden on Mobile) */}
            <div className="hidden md:flex items-center gap-4">
              {isLoggedIn ? (
                <>
                  <Link
                    to="/akun"
                    className="bg-orange-500 text-white px-5 py-2 rounded-full hover:bg-orange-600 hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-300 font-medium"
                  >
                    {userData?.username || userData?.name || "Akun"}
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-gray-600 dark:text-gray-400 hover:text-red-500 p-1"
                    title="Logout"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="bg-orange-500 text-white px-6 py-2 rounded-full hover:bg-orange-600 hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-300 font-medium"
                >
                  Login
                </Link>
              )}
            </div>

            {/* Mobile Hamburger Button (Hidden on Desktop) */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden text-gray-600 dark:text-gray-300 focus:outline-none p-2"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown (Hanya muncul saat Hamburger diklik) */}
        {isMobileMenuOpen && (
          <div className="md:hidden fixed top-[70px] left-0 w-full bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-lg py-4 px-6 flex flex-col space-y-4 z-40 animate-fadeIn">
            <button
              onClick={handleHomeClick}
              className="text-left text-gray-700 dark:text-gray-300 hover:text-orange-500 font-medium py-2"
            >
              Beranda
            </button>
            <Link
              to="/tentang"
              className="text-gray-700 dark:text-gray-300 hover:text-orange-500 font-medium py-2"
            >
              Tentang
            </Link>
            <Link
              to="/koleksibuku"
              className="text-gray-700 dark:text-gray-300 hover:text-orange-500 font-medium py-2"
            >
              Koleksi Buku
            </Link>
            
            <hr className="border-gray-200 dark:border-gray-700" />

            {isLoggedIn ? (
              <div className="flex flex-col gap-3 pt-2">
                 <div className="flex items-center justify-between">
                    <span className="text-gray-500 dark:text-gray-400 text-sm">Masuk sebagai:</span>
                    <span className="font-semibold text-gray-800 dark:text-white">{userData?.username || "User"}</span>
                 </div>
                <Link
                  to="/akun"
                  className="bg-orange-500 text-center text-white px-5 py-2 rounded-lg hover:bg-orange-600"
                >
                  Akun Saya
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-red-500 text-center py-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="bg-orange-500 text-center text-white px-6 py-2 rounded-lg hover:bg-orange-600 font-medium"
              >
                Login
              </Link>
            )}
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;