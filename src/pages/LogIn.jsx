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
        toast.success("Login Berhasil! Selamat datang Admin.");
        navigate("/admin/peminjaman");
        return;
      }

      // Jika bukan admin, cek sebagai user biasa
      const userRes = await fetch(`${BASE}/api/auth/users`);
      const userResult = await userRes.json();

      if (!userRes.ok) {
        toast.dismiss(loadingToast);
        toast.error(userResult.message || "Gagal mengambil data pengguna");
        return;
      }

      const users = userResult.data || [];
      const foundUser = users.find(
        (u) => u.user_email === email && u.password === password
      );

      if (!foundUser) {
        toast.dismiss(loadingToast);
        toast.error("Email atau password salah");
        return;
      }

      localStorage.setItem("user", JSON.stringify(foundUser));
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("role", "user");

      toast.dismiss(loadingToast);
      toast.success("Login Berhasil! Selamat membaca.");
      navigate("/berandalog");
    } catch (error) {
      console.error("Login error:", error);
      toast.dismiss(loadingToast);
      toast.error("Terjadi kesalahan koneksi saat login");
    }
  };

  return (
    <section className="min-h-screen flex justify-center items-center bg-gradient-to-b from-white via-white/70 to-orange-200 px-6">
      <div className="bg-white/80 backdrop-blur-md p-10 rounded-2xl shadow-xl w-full max-w-md border border-orange-200">
        <h2 className="text-3xl font-semibold text-orange-600 text-center mb-6">
          Masuk ke Akun
        </h2>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Email
            </label>
            <input
              type="email"
              className="w-full border border-orange-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-orange-400 focus:outline-none"
              placeholder="Masukkan email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Password
            </label>
            <input
              type="password"
              className="w-full border border-orange-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-orange-400 focus:outline-none"
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

        <p className="text-center text-sm mt-4 text-gray-700">
          Belum punya akun?{" "}
          <span
            className="text-orange-600 font-semibold cursor-pointer hover:underline"
            onClick={() => navigate("/signup")}
          >
            Daftar Sekarang
          </span>
        </p>
      </div>
    </section>
  );
};

export default LogIn;