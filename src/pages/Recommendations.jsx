import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../providers/AuthProvider";

const Recommendations = () => {
  const [recommendations, setRecommendations] = useState([]);
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/recommendations-for-my-queries/${user?.email}`
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
      fetchRecommendations();
    }
  }, [user]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 text-center">
        Recommendations for My Queries
      </h1>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <p className="text-lg">Loading recommendations...</p>
        </div>
      ) : recommendations.length === 0 ? (
        <div className="flex justify-center items-center h-40">
          <p className="text-lg text-gray-600">
            No recommendations found for your queries.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="table-auto w-full border-collapse border border-gray-300 shadow-lg">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-4 py-2 text-left">
                  Product Name
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left">
                  Query Title
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left">
                  Recommendation Count
                </th>
              </tr>
            </thead>
            <tbody>
              {recommendations.map((rec) => (
                <tr key={rec._id} className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2">
                    {rec.productName}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {rec.queryTitle}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {rec.recommendationCount}
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

export default Recommendations;
