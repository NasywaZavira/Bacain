import React, { useState, useEffect } from "react";

const Profile = () => {
  const [user, setUser] = useState({
    username: "",
    fullName: "",
    email: "",
    password: "",
    phone: "",
  });

  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  // 🔹 Ambil data user dari database setelah login
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("http://localhost:5173/api/profile", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        setUser({
          username: data.username,
          fullName: data.fullName || "",
          email: data.email,
          password: data.password || "",
          phone: data.phone || "",
        });

        setLoading(false);
      } catch (error) {
        console.error("Gagal ambil data profile:", error);
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token]);

  // 🔹 Simpan perubahan ke database
  const handleSave = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/profile/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          fullName: user.fullName,
          phone: user.phone,
          password: user.password,
        }),
      });

      const result = await res.json();

      if (res.ok) {
        alert("Profil berhasil diperbarui!");
      } else {
        alert("Gagal update: " + result.message);
      }
    } catch (error) {
      console.error("Error update:", error);
    }
  };

  if (loading) {
    return <p className="text-center mt-10">Loading profil...</p>;
  }

  return (
    <section className="w-full flex flex-col justify-center items-center h-screen bg-linear-to-b from-white via-white/80 to-orange-200">
      <div className="text-white">
        <h2 className="text-3xl font-bold">{user.username}</h2>
        <p className="text-sm opacity-90">{user.email}</p>
      </div>

      <div className="p-8">
        <h3 className="text-xl font-bold text-[#7C2D12] mb-6">
          Informasi Akun
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#FFF7ED] p-5 rounded-xl border border-[#FED7AA]">
            <label className="text-sm font-semibold text-[#7C2D12]">
              Username
            </label>
            <input
              type="text"
              value={user.username}
              readOnly
              className="mt-2 w-full px-4 py-2 rounded-lg border border-[#FDBA74] bg-gray-100 cursor-not-allowed"
            />
          </div>

          <div className="bg-[#FFF7ED] p-5 rounded-xl border border-[#FED7AA]">
            <label className="text-sm font-semibold text-[#7C2D12]">
              Email
            </label>
            <input
              type="email"
              value={user.email}
              readOnly
              className="mt-2 w-full px-4 py-2 rounded-lg border border-[#FDBA74] bg-gray-100 cursor-not-allowed"
            />
          </div>

          <div className="bg-[#FFF7ED] p-5 rounded-xl border border-[#FED7AA]">
            <label className="text-sm font-semibold text-[#7C2D12]">
              Nama Lengkap
            </label>
            <input
              type="text"
              value={user.fullName}
              onChange={(e) => setUser({ ...user, fullName: e.target.value })}
              placeholder="Masukkan nama lengkap"
              className="mt-2 w-full px-4 py-2 rounded-lg border border-[#FDBA74] focus:ring-2 focus:ring-[#F97316] outline-none bg-white"
            />
          </div>

          <div className="bg-[#FFF7ED] p-5 rounded-xl border border-[#FED7AA]">
            <label className="text-sm font-semibold text-[#7C2D12]">
              Nomor Telepon
            </label>
            <input
              type="text"
              value={user.phone}
              onChange={(e) => setUser({ ...user, phone: e.target.value })}
              placeholder="Masukkan nomor telepon"
              className="mt-2 w-full px-4 py-2 rounded-lg border border-[#FDBA74] focus:ring-2 focus:ring-[#F97316] outline-none bg-white"
            />
          </div>

          <div className="bg-[#FFF7ED] p-5 rounded-xl border border-[#FED7AA]">
            <label className="text-sm font-semibold text-[#7C2D12]">
              Password
            </label>
            <input
              type="text"
              value={user.password}
              onChange={(e) => setUser({ ...user, password: e.target.value })}
              placeholder="Masukkan password baru"
              className="mt-2 w-full px-4 py-2 rounded-lg border border-[#FDBA74] focus:ring-2 focus:ring-[#F97316] outline-none bg-white"
            />
          </div>
        </div>

        <div className="flex justify-end mt-8">
          <button
            onClick={handleSave}
            className="bg-[#F97316] hover:bg-[#EA580C] text-white px-6 py-2 rounded-lg font-semibold transition"
          >
            Simpan Perubahan
          </button>
        </div>
      </div>
    </section>
  );
};

export default Profile;
