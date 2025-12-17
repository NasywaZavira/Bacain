import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  // Check login status on component mount and route change
  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    const user = JSON.parse(localStorage.getItem("user") || "null");

    setIsLoggedIn(loggedIn);
    setUserData(user);
  }, [location.pathname]);

  // Logika Ganti Tema
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
    setIsLoggedIn(false);
    setUserData(null);
    navigate("/");
  };

  return (
    <header className="pt-0">
      <nav className="w-full">
        {/* Tambahkan dark:bg-gray-900 agar navbar ikut gelap */}
        <div className="w-full flex items-center justify-between py-4 px-5 bg-white dark:bg-gray-900 shadow-sm hover:shadow-md transition-all duration-300 fixed top-0 left-0 z-50 border-b border-transparent dark:border-gray-800">
          
          {/* Left Side - Logo & Menu */}
          <div className="flex items-center space-x-10 ml-10">
            {/* LOGO ANIMATION */}
            <div 
              onClick={handleHomeClick}
              className="bg-gradient-to-r from-orange-500 to-yellow-400 text-transparent bg-clip-text font-semibold text-3xl cursor-pointer hover:scale-105 transition-transform duration-300"
            >
              Bacain.
            </div>

            <div className="flex items-center space-x-12">
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

          {/* Right Side - Login / Account / Dark Mode Toggle */}
          <div className="flex items-center gap-4 mr-10">
            
            {/* TOMBOL GANTI TEMA (Matahari/Bulan) */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              title={theme === "dark" ? "Ganti ke Mode Terang" : "Ganti ke Mode Gelap"}
            >
              {theme === "dark" ? "☀️" : "🌙"}
            </button>

            {isLoggedIn ? (
              <div className="flex items-center gap-4">
                {/* ACCOUNT BUTTON */}
                <Link
                  to="/akun"
                  className="bg-orange-500 text-white px-5 py-2 rounded-full hover:bg-orange-600 hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-300 font-medium"
                >
                  {userData?.name || "Akun"}
                </Link>

                {/* LOGOUT ICON */}
                <button
                  onClick={handleLogout}
                  className="text-gray-600 dark:text-gray-400 hover:text-red-500 hover:rotate-12 transition-all duration-300 p-1"
                  title="Logout"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                </button>
              </div>
            ) : (
              // LOGIN BUTTON
              <Link
                to="/login"
                className="bg-orange-500 text-white px-6 py-2 rounded-full hover:bg-orange-600 hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-300 font-medium"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;