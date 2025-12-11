import { useNavigate } from "react-router-dom";
import React from "react";

const Beranda = () => {
  const navigate = useNavigate();

  return (
    <section className="w-full flex flex-col justify-center items-start h-screen bg-linear-to-b from-white via-white/80 to-orange-200">
      <div className="max-w-xl space-y-4 ml-[10vw] ">
        <h1 className="text-6xl font-medium leading-tight">
          Hello,
          <br />
          Selamat Datang
        </h1>

        <p className="text-xl ml-1">
          di{" "}
          <span className="text-orange-500 font-semibold">
            Perpustakaan Bacain!!
          </span>{" "}
          Cari dan Jelajahi Buku terbaikmu disini.
        </p>

        <button
          onClick={() => navigate("/login")}
          className="px-6 py-3 bg-orange-400 text-white rounded-xl shadow hover:bg-orange-600 transition"
        >
          Login Sekarang
        </button>
      </div>
    </section>
  );
};

export default Beranda;
