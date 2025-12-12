import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getBorrowings, updateUser } from "../api/apiClient";
import toast from "react-hot-toast";

const Akun = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    phone: "",
    role: "user",
  });
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formProfile, setFormProfile] = useState({
    username: "",
    email: "",
    phone: "",
  });
  const [userId, setUserId] = useState(null);
  const [userPassword, setUserPassword] = useState("");

  // Load user data and loans from backend
  useEffect(() => {
    const fetchData = async () => {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      if (!user || !localStorage.getItem("isLoggedIn")) {
        navigate("/login");
        return;
      }

      setUserData({
        username: user.username || "",
        email: user.user_email || "",
        phone: user.nohp || "",
        role: "user",
      });

      setUserId(user.user_id || null);
      setUserPassword(user.password || "");
      setFormProfile({
        username: user.username || "",
        email: user.user_email || "",
        phone: user.nohp || "",
      });

      try {
        const borrowRes = await getBorrowings();
        const allBorrowings = borrowRes.data || [];

        // Filter hanya peminjaman milik user yang sedang login
        const userBorrowings = allBorrowings.filter(
          (b) => b.user_id === user.user_id
        );

        // Map ke struktur yang dipakai komponen Akun
        const mappedLoans = userBorrowings.map((b) => ({
          judul: b.book_title || "",
          tanggalPinjam: b.borrow_date
            ? b.borrow_date.toString().slice(0, 10)
            : "",
          deadline: b.return_date ? b.return_date.toString().slice(0, 10) : "",
          tanggalKembali: b.return_date
            ? b.return_date.toString().slice(0, 10)
            : "",
          status: b.status || "Menunggu Persetujuan",
        }));

        setLoans(mappedLoans);
      } catch (error) {
        console.error("Gagal memuat data peminjaman pengguna:", error);
        // Fallback: tetap coba baca dari localStorage jika ada
        const userLoans = JSON.parse(localStorage.getItem("userLoans") || "[]");
        setLoans(userLoans);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [navigate]);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setFormProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async () => {
    if (!userId) return;
    setSaving(true);
    const loadingId = toast.loading("Menyimpan perubahan...");

    try {
      const payload = {
        username: formProfile.username,
        user_email: formProfile.email,
        password: userPassword,
        nohp: formProfile.phone,
      };

      const res = await updateUser(userId, payload);
      const updatedUser = res.data || res;

      const storedUser = {
        ...(updatedUser || {}),
        password: userPassword,
      };
      localStorage.setItem("user", JSON.stringify(storedUser));

      setUserData({
        username: storedUser.username || "",
        email: storedUser.user_email || "",
        phone: storedUser.nohp || "",
        role: "user",
      });

      setIsEditing(false);
      toast.dismiss(loadingId);
      toast.success("Profil berhasil diperbarui!");
    } catch (error) {
      console.error("Gagal mengupdate profil:", error);
      toast.dismiss(loadingId);
      toast.error("Gagal mengupdate profil. Silakan coba lagi.");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("user");
    toast.success("Berhasil logout!");
    navigate("/login");
  };

  const activeLoans = loans.filter((loan) => loan.status === "Dipinjam");
  const pendingLoans = loans.filter(
    (loan) => loan.status === "Menunggu Persetujuan"
  );
  const loanHistory = loans.filter((loan) => loan.status === "Dikembalikan");

  return (
    <div className="min-h-screen bg-linear-to-b from-white via-white/80 to-orange-200">
      <div className="w-full max-w-7xl mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="space-y-8">
            {/* Profile Section */}
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Profil Saya
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-4">
                    Informasi Akun
                  </h3>
                  <div className="space-y-4">
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
                  <h3 className="text-lg font-semibold text-gray-700 mb-4">
                    Ubah Profil
                  </h3>
                  {isEditing ? (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm text-gray-500 mb-1">
                          Username
                        </label>
                        <input
                          type="text"
                          name="username"
                          value={formProfile.username}
                          onChange={handleProfileChange}
                          className="w-full px-3 py-2 border rounded-md"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-500 mb-1">
                          Email
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formProfile.email}
                          onChange={handleProfileChange}
                          className="w-full px-3 py-2 border rounded-md"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-500 mb-1">
                          Nomor Telepon
                        </label>
                        <input
                          type="text"
                          name="phone"
                          value={formProfile.phone}
                          onChange={handleProfileChange}
                          className="w-full px-3 py-2 border rounded-md"
                        />
                      </div>
                      <div className="flex gap-3">
                        <button
                          type="button"
                          onClick={handleSaveProfile}
                          disabled={saving}
                          className="px-4 py-2 rounded-md bg-orange-500 text-white hover:bg-orange-600 disabled:opacity-60"
                        >
                          {saving ? "Menyimpan..." : "Simpan"}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setIsEditing(false);
                            setFormProfile({
                              username: userData.username,
                              email: userData.email,
                              phone: userData.phone,
                            });
                          }}
                          className="px-4 py-2 rounded-md bg-gray-200 text-gray-800 hover:bg-gray-300"
                        >
                          Batal
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setIsEditing(true)}
                      className="text-orange-600 hover:text-orange-700 font-medium"
                    >
                      Edit Profil
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Pending Loans Section */}
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Menunggu Persetujuan
              </h3>
              {loading ? (
                <p>Memuat data menunggu persetujuan...</p>
              ) : pendingLoans.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white border border-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Judul Buku
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tanggal Pengajuan
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {pendingLoans.map((loan, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {loan.judul}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {loan.tanggalPinjam}
                          </td>
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
                <p className="text-gray-500">
                  Tidak ada pengajuan peminjaman yang menunggu persetujuan.
                </p>
              )}
            </div>

            {/* Active Loans Section */}
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Buku yang Dipinjam
              </h3>
              {loading ? (
                <p>Memuat data peminjaman...</p>
              ) : activeLoans.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white border border-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Judul Buku
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tanggal Pinjam
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tenggat Kembali
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {activeLoans.map((loan, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {loan.judul}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {loan.tanggalPinjam}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {loan.deadline}
                          </td>
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
                <p className="text-gray-500">
                  Tidak ada buku yang sedang dipinjam.
                </p>
              )}
            </div>

            {/* Loan History Section */}
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Riwayat Peminjaman
              </h3>
              {loading ? (
                <p>Memuat riwayat peminjaman...</p>
              ) : loanHistory.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white border border-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Judul Buku
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tanggal Pinjam
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tanggal Kembali
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {loanHistory.map((loan, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {loan.judul}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {loan.tanggalPinjam}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {loan.tanggalKembali || "-"}
                          </td>
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