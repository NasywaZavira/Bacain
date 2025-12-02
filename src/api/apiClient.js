// API client configuration
const BASE = import.meta.env.VITE_API_URL || "http://localhost:3030";

// Helper function for making API requests
async function fetchAPI(endpoint, options = {}) {
  const url = `${BASE}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    credentials: "include",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Something went wrong");
  }

  return response.json();
}

// Books API
export async function getBooks() {
  return fetchAPI("/api/auth/books");
}

export async function getBookById(id) {
  return fetchAPI(`/api/auth/books/${id}`);
}

// Users API
export async function getUsers() {
  return fetchAPI("/api/auth/users");
}

export async function getUserById(id) {
  return fetchAPI(`/api/auth/users/${id}`);
}

// Add more API functions as needed

export default {
  // Books
  getBooks,
  getBookById,

  // Users
  getUsers,
  getUserById,
};
