import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function AccountMenu() {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [userData, setUserData] = useState(null);
  const [activeTab, setActiveTab] = useState("peminjaman");

  // Check user role and data on component mount
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    setUserData(user);
    setIsAdmin(user.role === "admin");
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("user");
    navigate("/login");
  };

  if (!userData) return null;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-6">
      {/* Navigation Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        {isAdmin && (
          <button
            onClick={() => setActiveTab("peminjaman")}
            className={`px-6 py-3 font-medium ${
              activeTab === "peminjaman"
                ? "border-b-2 border-orange-500 text-orange-600"
                : "text-gray-500 hover:text-orange-500"
            }`}
          >
            Kelola Peminjaman
          </button>
        )}
        <button
          onClick={() => setActiveTab("akun")}
          className={`px-6 py-3 font-medium ${
            activeTab === "akun"
              ? "border-b-2 border-orange-500 text-orange-600"
              : "text-gray-500 hover:text-orange-500"
          }`}
        >
          Akun Saya
        </button>
      </div>

      {/* Content Area */}
      <div className="bg-white rounded-lg shadow-md p-6">
        {isAdmin && activeTab === "peminjaman" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Kelola Peminjaman</h2>
              <Link
                to="/admin/peminjaman"
                className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
              >
                Lihat Semua
              </Link>
            </div>
            <p className="text-gray-600">
              Kelola peminjaman buku, lihat riwayat, dan laporan di sini.
            </p>
          </div>
        )}

        {activeTab === "akun" && (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Profil Saya</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Informasi Akun</h3>
                <div className="space-y-2">
                  <p>
                    <span className="font-medium">Nama:</span>{" "}
                    {userData.name || "Belum diisi"}
                  </p>
                  <p>
                    <span className="font-medium">Email:</span> {userData.email}
                  </p>
                  <p>
                    <span className="font-medium">Role:</span>{" "}
                    {isAdmin ? "Administrator" : "Pengguna"}
                  </p>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  Aksi
                </h3>
                <div className="space-y-2">
                  <button
                    onClick={handleLogout}
                    className="flex items-center text-red-600 hover:text-red-800"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2"
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
                    Keluar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}