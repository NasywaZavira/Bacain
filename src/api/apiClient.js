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

export async function updateBooks(id, bookData) {
  return fetchAPI(`/api/auth/books/${id}`, {
    method: "PUT",
    body: JSON.stringify(bookData),
  });
}

export async function deleteBook(id) {
  return fetchAPI(`/api/auth/books/${id}`, {
    method: "DELETE",
  });
}

// Borrowings API
export async function createBorrowing(borrowingData) {
  return fetchAPI("/api/auth/borrowings", {
    method: "POST",
    body: JSON.stringify(borrowingData),
  });
}

export async function getBorrowings() {
  return fetchAPI("/api/auth/borrowings");
}

export async function getBorrowingById(id) {
  return fetchAPI(`/api/auth/borrowings/${id}`);
}

export async function updateBorrowing(id, borrowingData) {
  return fetchAPI(`/api/auth/borrowings/${id}`, {
    method: "PUT",
    body: JSON.stringify(borrowingData),
  });
}

// Users API
export async function getUsers() {
  return fetchAPI("/api/auth/users");
}

export async function getUserById(id) {
  return fetchAPI(`/api/auth/users/${id}`);
}

export async function updateUser(id, userData) {
  return fetchAPI(`/api/auth/users/${id}`, {
    method: "PUT",
    body: JSON.stringify(userData),
  });
}

// Add more API functions as needed

export default {
  // Books
  getBooks,
  getBookById,
  updateBooks,
  deleteBook,

  // Borrowings
  createBorrowing,
  getBorrowings,
  getBorrowingById,
  updateBorrowing,

  // Users
  getUsers,
  getUserById,
  updateUser,
};
