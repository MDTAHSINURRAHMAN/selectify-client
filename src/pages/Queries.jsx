import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../providers/AuthProvider";
import Logo from "../components/shared/logo";
import Navbar from "../components/shared/Navbar";
import { motion } from "framer-motion";
import Footer from "../components/shared/Footer";
import { FaSearch, FaThLarge, FaThList, FaTh } from "react-icons/fa";
import { Helmet } from "react-helmet-async";
import toast from 'react-hot-toast';

const Queries = () => {
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [layout, setLayout] = useState("grid-3"); // Add layout state
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchQueries = async () => {
      try {
        const response = await fetch(`https://selectify-server-mu.vercel.app/all-queries`);
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

  // Filter queries based on search text
  const filteredQueries = queries.filter((query) =>
    query.productName.toLowerCase().includes(searchText.toLowerCase())
  );

  // Get grid class based on selected layout
  const getGridClass = () => {
    switch(layout) {
      case 'grid-1':
        return "grid grid-cols-1 gap-8";
      case 'grid-2':
        return "grid grid-cols-1 md:grid-cols-2 gap-8";
      default:
        return "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8";
    }
  };

  return (
    <div>
      <Helmet>
        <title>All Queries | Selectify</title>
        <meta name="description" content="Browse and search through all product queries and recommendations" />
      </Helmet>
      <Logo></Logo>
      <Navbar></Navbar>
      <div>
        <div className="relative bg-banner-title text-white py-16 overflow-hidden">
          <motion.div
            className="container mx-auto px-4 text-center"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {/* Section Heading */}
            <motion.h1
              className="text-5xl font-extrabold mb-6 tracking-wide drop-shadow-md"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              All Queries
            </motion.h1>

            {/* Decorative Line */}
            <motion.div
              className="w-20 h-1 bg-white mx-auto mb-6"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
            ></motion.div>

            {/* Call-to-Action Button */}
            <motion.button
              onClick={() => navigate("/add-query")}
              className="bg-white text-banner-title px-8 py-3 rounded-none font-semibold shadow-md hover:bg-hover-color hover:text-white hover:shadow-lg transition-all duration-300 transform hover:scale-105"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5, ease: "easeOut" }}
            >
              Add New Query
            </motion.button>
          </motion.div>
        </div>

        {/* Search Bar and Layout Toggle */}
        <div className="container mx-auto px-4 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Search Bar */}
            <div className="relative max-w-md w-full">
              <input
                type="text"
                placeholder="Search by product name..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-banner-title"
              />
              <FaSearch className="absolute right-3 top-3 text-gray-400" />
            </div>

            {/* Layout Toggle Buttons */}
            <div className="flex gap-2">
              <button
                onClick={() => setLayout("grid-1")}
                className={`p-2 rounded-lg ${
                  layout === "grid-1"
                    ? "bg-banner-title text-white"
                    : "bg-gray-200 text-gray-600"
                } transition-colors duration-200`}
                title="Single Column"
              >
                <FaThList className="text-xl" />
              </button>
              <button
                onClick={() => setLayout("grid-2")}
                className={`p-2 rounded-lg ${
                  layout === "grid-2"
                    ? "bg-banner-title text-white"
                    : "bg-gray-200 text-gray-600"
                } transition-colors duration-200`}
                title="Two Columns"
              >
                <FaTh className="text-xl" />
              </button>
              <button
                onClick={() => setLayout("grid-3")}
                className={`p-2 rounded-lg ${
                  layout === "grid-3"
                    ? "bg-banner-title text-white"
                    : "bg-gray-200 text-gray-600"
                } transition-colors duration-200`}
                title="Three Columns"
              >
                <FaThLarge className="text-xl" />
              </button>
            </div>
          </div>
        </div>

        {/* Queries Section */}
        <div className="container mx-auto px-4 py-12">
          {loading ? (
            <div className="text-center">
              <span className="loading loading-spinner loading-lg"></span>
            </div>
          ) : filteredQueries.length === 0 ? (
            <div className="text-center">
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">
                {searchText ? "No matching queries found" : "No Queries Found"}
              </h2>
              <button
                onClick={() => navigate("/add-query")}
                className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition duration-300"
              >
                Add Your First Query
              </button>
            </div>
          ) : (
            <div className={getGridClass()}>
              {filteredQueries.map((query) => (
                <div
                  key={query._id}
                  className="bg-white rounded-none shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden"
                >
                  <div className={layout === "grid-1" ? "flex" : "block"}>
                    {/* Product Image */}
                    <img
                      src={query.productImageUrl}
                      alt={query.productName}
                      className={`object-cover ${
                        layout === "grid-1"
                          ? "w-1/3 h-auto"
                          : "w-full h-48"
                      }`}
                    />

                    {/* Card Content */}
                    <div className="p-6 flex-1">
                      <h3 className="text-lg font-bold text-gray-800 mb-2 truncate">
                        {query.queryTitle}
                      </h3>
                      <p className="text-gray-600 mb-1">
                        <span className="font-semibold">Brand:</span>{" "}
                        {query.productBrand}
                      </p>
                      <p className="text-gray-600 mb-4">
                        <span className="font-semibold">Product:</span>{" "}
                        {query.productName}
                      </p>
                      <div className="flex flex-wrap justify-between items-center gap-2">
                        <p className="text-sm text-gray-500 flex-grow">
                          <span className="font-semibold">
                            {query.recommendationCount}
                          </span>{" "}
                          Recommendations
                        </p>
                        <button
                          onClick={() => navigate(`/query/${query._id}`)}
                          className="bg-banner-title text-white px-4 py-2 rounded-none shadow-md hover:bg-hover-color hover:shadow-lg transition duration-300"
                        >
                          Recommend
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer></Footer>
    </div>
  );
};

export default Queries;