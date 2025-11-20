import { Routes, Route, useLocation } from "react-router-dom";
import React from "react";

import Navbar from "./components/Navbar";
import Akun from "./pages/Akun";
import KoleksiBuku from "./pages/KoleksiBuku";
import Tentang from "./pages/Tentang";
import LogIn from "./pages/LogIn";
import SignUp from "./pages/SignUp";
import BerandaLog from "./pages/BerandaLog";
import Beranda from "./pages/Beranda";

const App = () => {
  const location = useLocation();

  // Halaman yang tidak perlu navbar
  const hideNavbarOn = ["/login", "/signup"];

  return (
    <>
      {!hideNavbarOn.includes(location.pathname) && <Navbar />}

      <Routes>
        <Route path="/" element={<Beranda />} />
        <Route path="/akun" element={<Akun />} />
        <Route path="/berandalog" element={<BerandaLog />} />
        <Route path="/koleksibuku" element={<KoleksiBuku />} />
        <Route path="/login" element={<LogIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/tentang" element={<Tentang />} />
      </Routes>
    </>
  );
};

export default App;
