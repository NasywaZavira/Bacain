import { Routes, Route, useLocation, Navigate, Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import KoleksiBuku from "./pages/KoleksiBuku";
import Tentang from "./pages/Tentang";
import LogIn from "./pages/LogIn";
import SignUp from "./pages/SignUp";
import BerandaLog from "./pages/BerandaLog";
import Beranda from "./pages/Beranda";
import AdminPeminjaman from "./pages/AdminPeminjaman";
import Akun from "./pages/Akun";

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem("isLoggedIn") === "true";
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// Layout with Navbar
const Layout = () => {
  const location = useLocation();
  const hideNavbarOn = ["/login", "/signup"];
  const showNavbar = !hideNavbarOn.includes(location.pathname);

  return (
    <div className="min-h-screen bg-gray-50">
      {showNavbar && <Navbar />}
      <main className={showNavbar ? "pt-20 pb-10" : ""}>
        <Outlet />
      </main>
    </div>
  );
};

const App = () => {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Beranda />} />
        <Route path="/berandalog" element={<BerandaLog />} />
        <Route path="/koleksibuku" element={<KoleksiBuku />} />
        <Route path="/tentang" element={<Tentang />} />
        <Route path="/login" element={<LogIn />} />
        <Route path="/signup" element={<SignUp />} />

        {/* Protected Routes */}
        <Route
          path="/akun"
          element={
            <ProtectedRoute>
              <Akun />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/peminjaman"
          element={
            <ProtectedRoute>
              <AdminPeminjaman />
            </ProtectedRoute>
          }
        />

        {/* Redirect any unknown routes to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
};

export default App;
