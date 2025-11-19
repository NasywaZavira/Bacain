import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = (e) => {
    e.preventDefault();

    // Simpan akun ke localStorage (sederhana)
    const userData = { username, email };
    localStorage.setItem("userData", JSON.stringify(userData));
    localStorage.setItem("username", username);
    localStorage.setItem("isLoggedIn", "true");

    // Arahkan ke halaman beranda login
    navigate("/berandalog");
  };

  return (
    <section className="min-h-screen flex justify-center items-center bg-gradient-to-b from-white via-white/70 to-orange-200 px-6">
      <div className="bg-white/80 backdrop-blur-md p-10 rounded-2xl shadow-xl w-full max-w-md border border-orange-200">
        <h2 className="text-3xl font-semibold text-orange-600 text-center mb-6">
          Buat Akun Baru
        </h2>

        <form onSubmit={handleSignup} className="space-y-5">
          {/* Username */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Username
            </label>
            <input
              type="text"
              className="w-full border border-orange-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-orange-400 focus:outline-none"
              placeholder="Masukkan username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          {/* Email */}
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

          {/* Password */}
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

          {/* Tombol Daftar */}
          <button
            type="submit"
            className="w-full bg-orange-500 text-white py-3 rounded-lg text-lg font-medium shadow hover:bg-orange-600 transition"
          >
            Daftar
          </button>
        </form>

        {/* Redirect ke Login */}
        <p className="text-center text-sm mt-4 text-gray-700">
          Sudah punya akun?{" "}
          <span
            className="text-orange-600 font-semibold cursor-pointer hover:underline"
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </p>
      </div>
    </section>
  );
};

export default SignUp;
