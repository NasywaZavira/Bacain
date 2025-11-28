import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Akun = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    name: "",
    username: "",
    email: "",
    phone: "",
    role: "user"
  });
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load user data and loans
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (!user || !localStorage.getItem("isLoggedIn")) {
      navigate("/login");
      return;
    }

    setUserData({
      name: user.name || "",
      username: user.username || "",
      email: user.email || "",
      phone: user.phone || "",
      role: user.role || "user"
    });

    const userLoans = JSON.parse(localStorage.getItem("userLoans") || "[]");
    setLoans(userLoans);
    setLoading(false);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const activeLoans = loans.filter(loan => loan.status === "Dipinjam");
  const loanHistory = loans.filter(loan => loan.status === "Dikembalikan");

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-white/80 to-orange-200">
      <div className="w-full max-w-7xl mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="space-y-8">
            {/* Profile Section */}
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Profil Saya</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-4">Informasi Akun</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-500">Nama Lengkap</p>
                      <p className="font-medium">{userData.name || "Belum diisi"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Username</p>
                      <p className="font-medium">{userData.username || "-"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium">{userData.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Nomor Telepon</p>
                      <p className="font-medium">{userData.phone || "-"}</p>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-4">Ubah Profil</h3>
                  <button className="text-orange-600 hover:text-orange-700 font-medium">
                    Edit Profil
                  </button>
                </div>
              </div>
            </div>

            {/* Active Loans Section */}
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Buku yang Dipinjam</h3>
              {loading ? (
                <p>Memuat data peminjaman...</p>
              ) : activeLoans.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white border border-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Judul Buku</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal Pinjam</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tenggat Kembali</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {activeLoans.map((loan, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap">{loan.judul}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{loan.tanggalPinjam}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{loan.deadline}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                              {loan.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-500">Tidak ada buku yang sedang dipinjam.</p>
              )}
            </div>

            {/* Loan History Section */}
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Riwayat Peminjaman</h3>
              {loading ? (
                <p>Memuat riwayat peminjaman...</p>
              ) : loanHistory.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white border border-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Judul Buku</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal Pinjam</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal Kembali</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {loanHistory.map((loan, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap">{loan.judul}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{loan.tanggalPinjam}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{loan.tanggalKembali || "-"}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              {loan.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-500">Belum ada riwayat peminjaman.</p>
              )}
            </div>

            {/* Logout Button */}
            <div className="pt-6 border-t border-gray-200">
              <button
                onClick={handleLogout}
                className="flex items-center justify-center w-full md:w-auto px-6 py-2 border border-transparent text-base font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
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
    </div>
  );
};

export default Akun;