import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const BASE = import.meta.env.VITE_API_URL || "http://localhost:3030";

const LogIn = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    // Tampilkan loading toast
    const loadingToast = toast.loading("Sedang memproses login...");

    try {
      // Cek apakah akun adalah admin
      const adminRes = await fetch(`${BASE}/api/auth/admins`);
      const adminResult = await adminRes.json();

      if (!adminRes.ok) {
        toast.dismiss(loadingToast);
        toast.error(adminResult.message || "Gagal mengambil data admin");
        return;
      }

      const admins = adminResult.data || [];
      const foundAdmin = admins.find(
        (a) => a.admin_email === email && a.password === password
      );

      if (foundAdmin) {
        localStorage.setItem("user", JSON.stringify(foundAdmin));
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("role", "admin");

        toast.dismiss(loadingToast);
        toast.success("Login Berhasil sebagai Admin!");
        navigate("/admin/peminjaman"); // Redirect ke dashboard admin
        return;
      }

      // Jika bukan admin, cek user biasa
      const userRes = await fetch(`${BASE}/api/auth/users`);
      const userResult = await userRes.json();

      if (!userRes.ok) {
        toast.dismiss(loadingToast);
        toast.error(userResult.message || "Gagal mengambil data user");
        return;
      }

      const users = userResult.data || [];
      const foundUser = users.find(
        (u) => u.user_email === email && u.password === password
      );

      if (foundUser) {
        localStorage.setItem("user", JSON.stringify(foundUser));
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("role", "user");

        toast.dismiss(loadingToast);
        toast.success("Login Berhasil!");
        navigate("/berandalog"); // Redirect ke beranda user
      } else {
        toast.dismiss(loadingToast);
        toast.error("Email atau password salah!");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.dismiss(loadingToast);
      toast.error("Terjadi kesalahan koneksi ke server.");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-orange-100 dark:bg-gray-900 transition-colors duration-300">
      
      {/* Kartu Login: Support Dark Mode */}
      <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl w-96 transition-colors duration-300">
        <h2 className="text-3xl font-bold text-center text-orange-600 dark:text-orange-500 mb-6">
          Login
        </h2>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1">
              Email
            </label>
            <input
              type="email"
              className="w-full border border-orange-300 dark:border-gray-600 px-4 py-2 rounded-lg focus:ring-2 focus:ring-orange-400 focus:outline-none dark:bg-gray-700 dark:text-white transition-colors"
              placeholder="Masukkan email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1">
              Password
            </label>
            <input
              type="password"
              className="w-full border border-orange-300 dark:border-gray-600 px-4 py-2 rounded-lg focus:ring-2 focus:ring-orange-400 focus:outline-none dark:bg-gray-700 dark:text-white transition-colors"
              placeholder="Masukkan password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-orange-500 text-white py-3 rounded-lg text-lg font-medium shadow hover:bg-orange-600 transition"
          >
            Login
          </button>
        </form>

        <p className="text-center text-sm mt-4 text-gray-700 dark:text-gray-400">
          Belum punya akun?{" "}
          <span
            className="text-orange-600 dark:text-orange-400 font-semibold cursor-pointer hover:underline"
            onClick={() => navigate("/signup")}
          >
            Daftar Sekarang
          </span>
        </p>
      </div>
    </div>
  );
};

export default LogIn;