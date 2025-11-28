import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);

  // Check login status on component mount and route change
  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    const user = JSON.parse(localStorage.getItem("user") || "null");

    setIsLoggedIn(loggedIn);
    setUserData(user);
  }, [location.pathname]);

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
        <div className="w-full flex items-center justify-between py-4 px-5 bg-white shadow-sm fixed top-0 left-0 z-50">
          
          {/* Left Side */}
          <div className="flex items-center space-x-10 ml-10">
            <div className="bg-gradient-to-r from-orange-500 to-yellow-400 text-transparent bg-clip-text font-semibold text-3xl">
              Bacain.
            </div>

            <div className="flex items-center space-x-12">
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

              {/* ✅ Koleksi Buku jadi langsung ke page */}
              <Link
                to="/koleksibuku"
                className="text-base text-gray-700 hover:text-orange-500"
              >
                Koleksi Buku
              </Link>
            </div>
          </div>

          {/* Right Side - Login / Account */}
          <div className="flex items-center gap-4 mr-10">
            {isLoggedIn ? (
              <div className="flex items-center gap-4">
                <Link
                  to="/akun"
                  className="bg-orange-500 text-white px-4 py-2 rounded-full hover:bg-orange-600 transition-colors"
                >
                  {userData?.name || "Akun"}
                </Link>

                <button
                  onClick={handleLogout}
                  className="text-gray-600 hover:text-orange-500 transition-colors"
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
              <Link
                to="/login"
                className="bg-orange-500 text-white px-4 py-2 rounded-full hover:bg-orange-600 transition-colors"
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
