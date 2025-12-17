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
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          const loggedUser = JSON.parse(storedUser);
          const userEmail = loggedUser.user_email;
          fetchUserData(userEmail);
        } catch (error) {
          console.error("Error parsing stored user data:", error);
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
        localStorage.setItem("user", JSON.stringify(currentUser));
      } else {
        localStorage.removeItem("user");
        localStorage.removeItem("isLoggedIn");
        navigate("/login");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-white via-white/80 to-orange-200 dark:bg-none dark:bg-gray-900 transition-all duration-300">
      {/* Content */}
      <section className="flex-1 w-full flex flex-col justify-center items-center md:items-start">
        <div className="max-w-xl space-y-4 px-6 md:ml-[10vw] md:px-0 text-center md:text-left">
          <h1 className="text-4xl md:text-6xl font-medium leading-tight text-gray-900 dark:text-white transition-colors">
            Hello,{" "}
            {userData.username ? (
              <span className="text-orange-500 font-medium block md:inline">
                {userData.username}
              </span>
            ) : (
              ""
            )}
            <br className="hidden md:block"/>
            Selamat Datang
          </h1>

          <p className="text-lg md:text-xl md:ml-1 text-gray-700 dark:text-gray-300 transition-colors">
            di{" "}
            <span className="text-orange-500 font-semibold">
              Perpustakaan Bacain!!
            </span>{" "}
            Cari dan Jelajahi Buku terbaikmu disini.
          </p>

          {!isLoggedIn && (
            <div className="pt-4 md:pt-0">
                <button
                onClick={() => navigate("/login")}
                className="px-6 py-3 bg-orange-400 text-white rounded-xl shadow hover:bg-orange-600 transition"
                >
                Login Sekarang
                </button>
            </div>
          )}
        </div>
      </section>

      {/* Footer Sticky */}
      <footer className="w-full text-center py-4 text-gray-700 dark:text-gray-500 sticky bottom-0 transition-colors">
        <p className="text-sm">
          © {new Date().getFullYear()} Perpustakaan Bacain — All Rights Reserved
        </p>
      </footer>
    </div>
  );
};

export default BerandaLog;