import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const BASE = import.meta.env.VITE_API_URL || "http://localhost:3030";

const SignUp = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();

    const loadingId = toast.loading("Mendaftarkan akun...");

    try {
      const res = await fetch(`${BASE}/api/auth/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          user_email: email,
          password,
          nohp: phone,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        toast.dismiss(loadingId);
        toast.error(result.message || "Gagal mendaftar, silakan cek data Anda.");
        return;
      }

      const createdUser = result.data || null;
      if (createdUser) {
        localStorage.setItem("user", JSON.stringify(createdUser));
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("role", "user");

        toast.dismiss(loadingId);
        toast.success("Pendaftaran Berhasil! Selamat datang.");
        navigate("/berandalog");
      } else {
        toast.dismiss(loadingId);
        toast.success("Pendaftaran berhasil, silakan login.");
        navigate("/login");
      }
    } catch (error) {
      console.error("Signup error:", error);
      toast.dismiss(loadingId);
      toast.error("Terjadi kesalahan saat mendaftar.");
    }
  };

  return (
    // FIX: Dark Mode Background
    <div className="flex justify-center items-center min-h-screen bg-orange-100 dark:bg-gray-900 transition-colors duration-300 py-10">
      
      {/* FIX: Dark Mode Card */}
      <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl w-96 transition-colors duration-300">
        <h2 className="text-3xl font-bold text-center text-orange-600 dark:text-orange-500 mb-6">
          Daftar Akun
        </h2>

        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1">
              Username
            </label>
            <input
              type="text"
              className="w-full border border-orange-300 dark:border-gray-600 px-4 py-2 rounded-lg focus:ring-2 focus:ring-orange-400 focus:outline-none dark:bg-gray-700 dark:text-white transition-colors"
              placeholder="Masukkan username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1">
              No. HP
            </label>
            <input
              type="text"
              className="w-full border border-orange-300 dark:border-gray-600 px-4 py-2 rounded-lg focus:ring-2 focus:ring-orange-400 focus:outline-none dark:bg-gray-700 dark:text-white transition-colors"
              placeholder="Masukkan nomor HP"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>

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
            Daftar
          </button>
        </form>

        <p className="text-center text-sm mt-4 text-gray-700 dark:text-gray-400">
          Sudah punya akun?{" "}
          <span
            className="text-orange-600 dark:text-orange-400 font-semibold cursor-pointer hover:underline"
            onClick={() => navigate("/login")}
          >
            Login disini
          </span>
        </p>
      </div>
    </div>
  );
};

export default SignUp;