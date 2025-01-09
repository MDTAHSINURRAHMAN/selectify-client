import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../providers/AuthProvider";

const Queries = () => {
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchQueries = async () => {
      try {
        const response = await fetch(`http://localhost:3000/all-queries`);
        const data = await response.json();
        // Sort queries in descending order by timestamp
        const sortedQueries = data.sort(
          (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
        );
        setQueries(sortedQueries);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching queries:", error);
        setLoading(false);
      }
    };

    if (user?.email) {
      fetchQueries();
    }
  }, [user]);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Banner Section */}
      <div className="bg-blue-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-6">My Queries</h1>
          <button
            onClick={() => navigate("/add-query")}
            className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition duration-300"
          >
            Add New Query
          </button>
        </div>
      </div>

      {/* Queries Section */}
      <div className="container mx-auto px-4 py-12">
        {loading ? (
          <div className="text-center">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : queries.length === 0 ? (
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-4">No Queries Found</h2>
            <button
              onClick={() => navigate("/add-query")}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-300"
            >
              Add Your First Query
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {queries.map((query) => (
              <div
                key={query._id}
                className="bg-white rounded-lg shadow-md p-6"
              >
                <img
                  src={query.productImageUrl}
                  alt={query.productName}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
                <h3 className="text-xl font-semibold mb-2">
                  {query.queryTitle}
                </h3>
                <p className="text-gray-600 mb-2">
                  Brand: {query.productBrand}
                </p>
                <p className="text-gray-600 mb-4">
                  Product: {query.productName}
                </p>
                <div className="flex justify-between items-center mb-4">
                  <p className="text-gray-600 text-sm">
                    {query.recommendationCount} Recommendations
                  </p>
                  <button
                    onClick={() => navigate(`/query/${query._id}`)}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  >
                    Recommend
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Queries;
