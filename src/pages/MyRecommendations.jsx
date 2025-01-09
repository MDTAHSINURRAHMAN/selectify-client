import React from "react";
import { AuthContext } from "../providers/AuthProvider";
import { useState, useEffect, useContext } from "react";
import { toast } from "react-toastify";

const MyRecommendations = () => {
  const [recommendations, setRecommendations] = useState([]);
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyRecommendations = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/my-recommendations/${user?.email}`
        );
        const data = await response.json();
        setRecommendations(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching recommendations:", error);
        setLoading(false);
      }
    };

    if (user?.email) {
      fetchMyRecommendations();
    }
  }, [user]);

  const handleDelete = async (id, queryId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this recommendation?"
    );

    if (confirmed) {
      try {
        // Delete the recommendation
        const deleteResponse = await fetch(
          `http://localhost:3000/recommendations/${id}`,
          {
            method: "DELETE",
          }
        );

        if (deleteResponse.ok) {
          // Decrease recommendation count for the query
          await fetch(
            `http://localhost:3000/query/${queryId}/decrement-recommendations`,
            {
              method: "PATCH",
            }
          );

          // Update local state
          setRecommendations((prev) => prev.filter((rec) => rec._id !== id));
          toast.success("Recommendation deleted successfully");
        }
      } catch (error) {
        console.error("Error deleting recommendation:", error);
        toast.error("Failed to delete recommendation");
      }
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">My Recommendations</h1>

      {loading ? (
        <div className="text-center">
          <p className="text-lg">Loading recommendations...</p>
        </div>
      ) : recommendations.length === 0 ? (
        <div className="text-center">
          <p className="text-lg">No recommendations found.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="table-auto w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-4 py-2">
                  Product Name
                </th>
                <th className="border border-gray-300 px-4 py-2">
                  Query Title
                </th>
                <th className="border border-gray-300 px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {recommendations.map((rec) => (
                <tr key={rec._id} className="text-center">
                  <td className="border border-gray-300 px-4 py-2">
                    {rec.productName}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {rec.queryTitle}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <button
                      onClick={() => handleDelete(rec._id, rec.queryId)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MyRecommendations;
