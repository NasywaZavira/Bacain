import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";

const BerandaLog = () => {
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    phone: "",
    role: "user",
  });
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    setIsLoggedIn(loggedIn);

    if (loggedIn) {
      // Get user email from localStorage to identify the user
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          const loggedUser = JSON.parse(storedUser);
          const userEmail = loggedUser.user_email;

          // Fetch fresh user data from database
          fetchUserData(userEmail);
        } catch (error) {
          console.error("Error parsing stored user data:", error);
          // If localStorage is corrupted, clear it and redirect to login
          localStorage.removeItem("user");
          localStorage.removeItem("isLoggedIn");
          navigate("/login");
        }
      }
    }
  }, [navigate]);

  const fetchUserData = async (userEmail) => {
    try {
      const response = await fetch(
        "https://bacain-backend.vercel.app/api/auth/users"
      );
      const result = await response.json();

      if (!response.ok) {
        console.error("Failed to fetch users:", result.message);
        return;
      }

      const users = result.data || [];
      const currentUser = users.find((u) => u.user_email === userEmail);

      if (currentUser) {
        setUserData({
          username: currentUser.username || "",
          email: currentUser.user_email || "",
          phone: currentUser.nohp || "",
          role: currentUser.role || "user",
        });

        // Update localStorage with fresh data
        localStorage.setItem("user", JSON.stringify(currentUser));
      } else {
        console.error("User not found in database");
        localStorage.removeItem("user");
        localStorage.removeItem("isLoggedIn");
        navigate("/login");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-linear-to-b from-white via-white/80 to-orange-200">
      {/* Content */}
      <section className="flex-1 w-full flex flex-col justify-center items-start">
        <div className="max-w-xl space-y-4 ml-[10vw]">
          <h1 className="text-6xl font-medium leading-tight">
            Hello,{" "}
            {userData.username ? (
              <span className="text-orange-500 font-medium">
                {userData.username}
              </span>
            ) : (
              ""
            )}
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

          {!isLoggedIn && (
            <button
              onClick={() => navigate("/login")}
              className="px-6 py-3 bg-orange-400 text-white rounded-xl shadow hover:bg-orange-600 transition"
            >
              Login Sekarang
            </button>
          )}
        </div>
      </section>

      {/* Footer Sticky */}
      <footer className="w-full text-center py-4 text-gray-700 sticky bottom-0">
        <p className="text-sm text-gray-700">
          © {new Date().getFullYear()} Perpustakaan Bacain — All Rights Reserved
        </p>
      </footer>
    </div>
  );
};

export default BerandaLog;