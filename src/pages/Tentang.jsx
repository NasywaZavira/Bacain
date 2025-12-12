import React from "react";

const Tentang = () => {
  return (
    <section className="min-h-screen pt-28 pb-20 bg-linear-to-b from-white via-white/90 to-orange-100">
      {/* Container Konten Utama */}
      <div className="max-w-6xl mx-auto px-6">
        {/* Header Bagian Tentang Kami */}
        <header className="text-center mb-16">
          <h1 className="text-6xl font-extrabold text-gray-800">
            Tentang <span className="text-orange-500">Bacain.</span>
          </h1>
          <p className="text-xl text-gray-500 mt-3">
            Jelajahi, Baca, dan Kelola Koleksi Buku Anda.
          </p>
        </header>

        {/* Bagian Dua Kolom: Deskripsi dan Fokus Kami */}
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* KOLOM KIRI: Mengenal Perpustakaan Bacain (Deskripsi) */}
          <div className="lg:w-3/5 w-full p-10 bg-white rounded-2xl shadow-xl border-t-8 border-orange-200">
            {" "}
            {/* Border-top yang tebal */}
            <h2 className="text-3xl font-bold text-orange-600 mb-5">
              Mengenal Perpustakaan Bacain
            </h2>
            {/* Paragraf 1 (Teks sudah dibersihkan dari markdown) */}
            <p className="text-lg text-gray-700 leading-relaxed font-semibold mb-6">
              Perpustakaan Bacain didirikan dengan visi untuk mempermudah akses
              literasi di era digital. Platform ini memungkinkan pengguna
              mencari dan menjelajahi buku berdasarkan judul, pengarang, ISBN,
              atau genre dengan mudah.
            </p>
            {/* Paragraf 2 (Teks sudah dibersihkan dari markdown) */}
            <p className="text-lg text-gray-700 leading-relaxed">
              Kami berkomitmen menyediakan pengalaman membaca online yang mulus
              (via PDF/ePub viewer) sekaligus menawarkan fitur manajemen koleksi
              pribadi, mulai dari Read Later, status membaca, riwayat
              peminjaman, hingga pemberian ulasan dan rating. Kami percaya, buku
              harus mudah dijangkau oleh semua orang, kapan pun dan di mana pun.
            </p>
          </div>

          {/* KOLOM KANAN: Fokus Kami (Highlight) */}
          <div className="lg:w-2/5 w-full p-10 bg-orange-500 rounded-2xl shadow-xl text-white">
            <h2 className="text-3xl font-bold mb-6">Fokus Kami</h2>
            <ul className="space-y-4">
              {/* Menggunakan karakter Bintang Unicode ★ (lebih estetik) */}
              <li className="flex items-center">
                <span className="text-yellow-300 text-xl mr-3">★</span>
                <span className="text-lg font-medium">
                  Pencarian Fleksibel & Cepat
                </span>
              </li>
              <li className="flex items-center">
                <span className="text-yellow-300 text-xl mr-3">★</span>
                <span className="text-lg font-medium">
                  Akses Buku Digital Aman
                </span>
              </li>
              <li className="flex items-center">
                <span className="text-yellow-300 text-xl mr-3">★</span>
                <span className="text-lg font-medium">
                  Manajemen Koleksi Pribadi
                </span>
              </li>
              <li className="flex items-center">
                <span className="text-yellow-300 text-xl mr-3">★</span>
                <span className="text-lg font-medium">
                  Integrasi Login Modern
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <footer className="mt-20 py-6 text-center text-gray-700">
        <p className="text-sm">
          © {new Date().getFullYear()} Perpustakaan Bacain — All Rights Reserved
        </p>
      </footer>
    </section>
  );
};

export default Tentang;
