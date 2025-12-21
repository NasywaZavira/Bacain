import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
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
      // 1. Cek apakah yang login adalah ADMIN
      const adminRes = await fetch(`${BASE}/api/auth/admins`);
      const adminResult = await adminRes.json();

      if (adminRes.ok) {
        const admins = adminResult.data || [];
        const foundAdmin = admins.find(
          (a) => a.admin_email === email && a.password === password
        );

        if (foundAdmin) {
          localStorage.setItem("admin", JSON.stringify(foundAdmin));
          localStorage.setItem("isLoggedIn", "true");
          localStorage.setItem("role", "admin");
          localStorage.setItem("isAdminLoggedIn", "true"); // Flag khusus admin

          toast.dismiss(loadingToast);
          toast.success("Login Berhasil sebagai Admin!");
          navigate("/admin/peminjaman"); 
          return;
        }
      }

      // 2. Jika bukan Admin, Cek apakah USER biasa
      const userRes = await fetch(`${BASE}/api/auth/users`);
      const userResult = await userRes.json();

      if (!userRes.ok) {
        throw new Error(userResult.message || "Gagal mengambil data user");
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
        toast.success(`Selamat datang, ${foundUser.username}!`);
        navigate("/berandalog"); 
      } else {
        toast.dismiss(loadingToast);
        toast.error("Email atau Password salah!");
      }
    } catch (error) {
      console.error("Login Error:", error);
      toast.dismiss(loadingToast);
      toast.error("Terjadi kesalahan saat login.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white via-white/80 to-orange-200 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 transition-colors duration-300 px-4">
      
      <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl w-full max-w-md border border-orange-100 dark:border-gray-700">
        
        <div className="text-center mb-8">
          {/* PERUBAHAN DISINI: text-gray-900 menjadi text-orange-600 */}
          <h1 className="text-3xl font-bold text-orange-600 dark:text-orange-500 mb-2">
            Login
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Masuk untuk mulai meminjam buku
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1">
              Email
            </label>
            <input
              type="email"
              className="w-full border border-gray-300 dark:border-gray-600 px-4 py-3 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-transparent outline-none dark:bg-gray-700 dark:text-white transition-all"
              placeholder="nama@email.com"
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
              className="w-full border border-gray-300 dark:border-gray-600 px-4 py-3 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-transparent outline-none dark:bg-gray-700 dark:text-white transition-all"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-orange-500 text-white py-3 rounded-xl text-lg font-bold shadow-lg hover:bg-orange-600 hover:shadow-orange-500/30 hover:scale-[1.02] active:scale-95 transition-all duration-300"
          >
            Masuk Sekarang
          </button>
        </form>

        {/* Footer Link */}
        <p className="text-center text-sm mt-6 text-gray-600 dark:text-gray-400">
          Belum punya akun?{" "}
          <span
            onClick={() => navigate("/signup")}
            className="text-orange-600 dark:text-orange-400 font-semibold cursor-pointer hover:underline"
          >
            Daftar disini
          </span>
        </p>
      </div>
    </div>
  );
};

export default LogIn;