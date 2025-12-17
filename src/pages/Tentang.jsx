import React from "react";

const Tentang = () => {
  return (
    // KEMBALI KE WARNA ASLI: Gradient Putih ke Orange (Tanpa Dark Mode)
    <section className="min-h-screen pt-28 pb-20 bg-gradient-to-b from-white via-white/90 to-orange-100">
      {/* Container Konten Utama */}
      <div className="max-w-6xl mx-auto px-6">
        {/* Header Bagian Tentang Kami */}
        <header className="text-center mb-16">
          <h1 className="text-6xl font-extrabold text-gray-800">
            Tentang <span className="text-orange-500">Bacain.</span>
          </h1>
          <p className="text-xl text-gray-500 mt-3">
            Cari, Pinjam, dan Kelola Aktivitas Membaca Anda.
          </p>
        </header>

        {/* Bagian Dua Kolom */}
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* KOLOM KIRI: Deskripsi (Background Putih Bersih) */}
          <div className="lg:w-3/5 w-full p-10 bg-white rounded-2xl shadow-xl border-t-8 border-orange-200">
            <h2 className="text-3xl font-bold text-orange-600 mb-5">
              Mengenal Perpustakaan Bacain
            </h2>
            
            {/* Paragraf 1 */}
            <p className="text-lg text-gray-700 leading-relaxed font-semibold mb-6">
              Perpustakaan Bacain hadir untuk mempermudah akses informasi buku di
              perpustakaan kami. Platform ini memungkinkan Anda mencari ketersediaan
              buku fisik berdasarkan judul, pengarang, atau genre sebelum datang
              langsung ke lokasi.
            </p>

            {/* Paragraf 2 (Fokus Peminjaman Fisik) */}
            <p className="text-lg text-gray-700 leading-relaxed">
              Kami berkomitmen menyediakan sistem sirkulasi yang transparan dan
              efisien. Melalui website ini, anggota dapat mengajukan peminjaman
              buku secara online, memantau status persetujuan, serta melihat
              tenggat waktu pengembalian dengan mudah melalui dasbor pribadi.
              Kami percaya, manajemen perpustakaan yang baik akan meningkatkan
              minat baca masyarakat.
            </p>
          </div>

          {/* KOLOM KANAN: Fokus Kami (Background Orange Asli) */}
          <div className="lg:w-2/5 w-full p-10 bg-orange-500 rounded-2xl shadow-xl text-white">
            <h2 className="text-3xl font-bold mb-6">Fokus Kami</h2>
            <ul className="space-y-4">
              <li className="flex items-center">
                <span className="text-yellow-300 text-xl mr-3">★</span>
                <span className="text-lg font-medium">
                  Pencarian Katalog Cepat
                </span>
              </li>
              <li className="flex items-center">
                <span className="text-yellow-300 text-xl mr-3">★</span>
                <span className="text-lg font-medium">
                  Proses Peminjaman Praktis
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