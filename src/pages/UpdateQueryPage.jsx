import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const UpdateQueryPage = () => {
  const { id } = useParams(); // Get the query ID from the URL
  const navigate = useNavigate();
  const [query, setQuery] = useState({
    productName: "",
    productBrand: "",
    productImageUrl: "",
    queryTitle: "",
    boycottReason: "",
  });

  useEffect(() => {
    // Fetch the existing query details from the backend
    fetch(`http://localhost:3000/my-queries/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setQuery(data);
      })
      .catch((error) => {
        console.error("Error fetching query data:", error);
      });
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setQuery((prevQuery) => ({
      ...prevQuery,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  
    // Send the updated data to the backend using fetch
    fetch(`http://localhost:3000/query/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(query),  // Ensure query data is correctly formatted
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to update query");
        }
        return response.json();
      })
      .then((data) => {
        alert(data.message || "Query updated successfully");
        navigate("/queries"); // Redirect to the queries list page
      })
      .catch((error) => {
        console.error("Error updating query:", error);
        alert("Error updating query");
      });
  };
  

  return (
    <div className="container">
      <h1 className="text-xl mb-4">Update Query</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="productName" className="block">
            Product Name
          </label>
          <input
            type="text"
            id="productName"
            name="productName"
            value={query.productName}
            onChange={handleChange}
            className="input"
            required
          />
        </div>
        <div>
          <label htmlFor="productBrand" className="block">
            Product Brand
          </label>
          <input
            type="text"
            id="productBrand"
            name="productBrand"
            value={query.productBrand}
            onChange={handleChange}
            className="input"
            required
          />
        </div>
        <div>
          <label htmlFor="productImageUrl" className="block">
            Product Image URL
          </label>
          <input
            type="text"
            id="productImageUrl"
            name="productImageUrl"
            value={query.productImageUrl}
            onChange={handleChange}
            className="input"
            required
          />
        </div>
        <div>
          <label htmlFor="queryTitle" className="block">
            Query Title
          </label>
          <input
            type="text"
            id="queryTitle"
            name="queryTitle"
            value={query.queryTitle}
            onChange={handleChange}
            className="input"
            required
          />
        </div>
        <div>
          <label htmlFor="boycottReason" className="block">
            Boycott Reason
          </label>
          <textarea
            id="boycottReason"
            name="boycottReason"
            value={query.boycottReason}
            onChange={handleChange}
            className="input"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          Update Query
        </button>
      </form>
    </div>
  );
};

export default UpdateQueryPage;
