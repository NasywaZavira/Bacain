import { useNavigate } from "react-router-dom";
import React from "react";

const Beranda = () => {
  const navigate = useNavigate();

  return (
    <section className="w-full flex flex-col justify-center items-start h-screen bg-gradient-to-b from-white via-white/80 to-orange-200 dark:bg-none dark:bg-gray-900 transition-all duration-300">
      <div className="max-w-xl space-y-4 ml-[10vw] ">
        <h1 className="text-6xl font-medium leading-tight text-gray-900 dark:text-white transition-colors">
          Hello,
          <br />
          Selamat Datang
        </h1>

        <p className="text-xl ml-1 text-gray-700 dark:text-gray-300 transition-colors">
          di{" "}
          <span className="text-orange-500 font-semibold">
            Perpustakaan Bacain!!
          </span>{" "}
          Cari dan Jelajahi Buku terbaikmu disini.
        </p>

        <button
          onClick={() => navigate("/login")}
          className="px-6 py-3 bg-orange-400 text-white rounded-xl shadow hover:bg-orange-600 hover:scale-105 active:scale-95 transition-all duration-200"
        >
          Login Sekarang
        </button>
      </div>
      
      {/* Footer */}
      <footer className="w-full text-center py-4 text-gray-700 dark:text-gray-500 sticky bottom-0 transition-colors">
        <p className="text-sm">
          © {new Date().getFullYear()} Perpustakaan Bacain — All Rights Reserved
        </p>
      </footer>
    </section>
  );
};

export default Beranda;