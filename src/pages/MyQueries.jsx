import React from 'react';
import { AuthContext } from '../providers/AuthProvider';
import { useNavigate } from 'react-router-dom';

const MyQueries = () => {
    const [queries, setQueries] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const { user } = React.useContext(AuthContext);
    const navigate = useNavigate();

    React.useEffect(() => {
        const fetchQueries = async () => {
            try {
                const response = await fetch(`http://localhost:3000/my-queries/${user.email}`);
                const data = await response.json();
                setQueries(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching queries:', error);
                setLoading(false);
            }
        };
        fetchQueries();
    }, [user.email]);

    const handleDelete = async (id) => {
        const confirmed = window.confirm('Are you sure you want to delete this query?');
        if (confirmed) {
            try {
                const response = await fetch(`http://localhost:3000/query/${id}`, {
                    method: 'DELETE'
                });
                if (response.ok) {
                    setQueries(queries.filter(query => query._id !== id));
                }
            } catch (error) {
                console.error('Error deleting query:', error);
            }
        }
    };

    if (loading) {
        return <div className="min-h-screen flex justify-center items-center">Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Banner Section */}
            <div className="bg-navColor text-white py-12 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="flex justify-between items-center">
                        <h1 className="text-3xl font-bold">My Queries</h1>
                        <button
                            onClick={() => navigate('/add-query')}
                            className="bg-btnColor hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        >
                            Add New Query
                        </button>
                    </div>
                </div>
            </div>

            {/* Queries Section */}
            <div className="max-w-7xl mx-auto py-12 px-4">
                {queries.length === 0 ? (
                    <div className="text-center">
                        <h2 className="text-2xl font-semibold mb-4">No Queries Found</h2>
                        <button
                            onClick={() => navigate('/add-query')}
                            className="bg-btnColor hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        >
                            Add Your First Query
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {queries.map((query) => (
                            <div key={query._id} className="bg-white rounded-lg shadow-md p-6">
                                <img 
                                    src={query.productImageUrl} 
                                    alt={query.productName}
                                    className="w-full h-48 object-cover rounded-md mb-4"
                                />
                                <h3 className="text-xl font-semibold mb-2">{query.queryTitle}</h3>
                                <p className="text-gray-600 mb-2">Product: {query.productName}</p>
                                <p className="text-gray-600 mb-4">Brand: {query.productBrand}</p>
                                <div className="flex flex-wrap gap-2">
                                    <button
                                        onClick={() => navigate(`/query/${query._id}`)}
                                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                                    >
                                        View Details
                                    </button>
                                    <button
                                        onClick={() => navigate(`/update-query/${query._id}`)}
                                        className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                                    >
                                        Update
                                    </button>
                                    <button
                                        onClick={() => handleDelete(query._id)}
                                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                                    >
                                        Delete
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

export default MyQueries;