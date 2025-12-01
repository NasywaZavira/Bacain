import { useState, useEffect } from "react";
import { getBooks, getUsers } from "../api/apiClient";

const TestConnection = () => {
  const [books, setBooks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch both books and users
        const [booksData, usersData] = await Promise.all([
          getBooks(),
          getUsers(),
        ]);

        setBooks(booksData);
        setUsers(usersData);
        setError(null);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="p-4">Loading data from backend...</div>;
  if (error) return <div className="p-4 text-red-600">Error: {error}</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Backend Connection Test</h1>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-3">Books</h2>
        <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto">
          {JSON.stringify(books, null, 2)}
        </pre>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-3">Users</h2>
        <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto">
          {JSON.stringify(users, null, 2)}
        </pre>
      </div>
    </div>
  );
};

export default TestConnection;
