import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../providers/AuthProvider';

const QueryDetails = () => {
    const [query, setQuery] = useState(null);
    const [loading, setLoading] = useState(true);
    const [recommendations, setRecommendations] = useState([]);
    const { id } = useParams();
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const [recommendation, setRecommendation] = useState({
        recommendationTitle: '',
        recommendedProductName: '',
        recommendedProductImage: '',
        recommendationReason: ''
    });

    useEffect(() => {
        const fetchQueryDetails = async () => {
            try {
                const response = await fetch(`http://localhost:3000/query/${id}`);
                const data = await response.json();
                setQuery(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching query:', error);
                setLoading(false);
            }
        };

        fetchQueryDetails();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setRecommendation(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const recommendationData = {
            ...recommendation,
            queryId: query._id,
            queryTitle: query.queryTitle,
            productName: query.productName,
            userEmail: query.userEmail,
            userName: query.userName,
            recommenderEmail: user.email,
            recommenderName: user.displayName,
            timestamp: new Date()
        };

        try {
            const response = await fetch('http://localhost:3000/recommendations', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(recommendationData)
            });

            if (response.ok) {
                // Update recommendation count
                await fetch(`http://localhost:3000/query/${id}/increment-recommendations`, {
                    method: 'PATCH'
                });
                
                alert('Recommendation added successfully!');
                setRecommendation({
                    recommendationTitle: '',
                    recommendedProductName: '',
                    recommendedProductImage: '',
                    recommendationReason: ''
                });
            }
        } catch (error) {
            console.error('Error adding recommendation:', error);
            alert('Failed to add recommendation');
        }
    };

    // Fetch recommendations for this query
    useEffect(() => {
        const fetchRecommendations = async () => {
            try {
                const response = await fetch(`http://localhost:3000/recommendations/${id}`);
                const data = await response.json();
                // Sort recommendations by timestamp descending
                const sortedRecommendations = data.sort(
                    (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
                );
                setRecommendations(sortedRecommendations);
            } catch (error) {
                console.error('Error fetching recommendations:', error);
            }
        };

        if (id) {
            fetchRecommendations();
        }
    }, [id]);

    // Render recommendations
    const renderRecommendations = () => {
        if (recommendations.length === 0) {
            return (
                <div className="text-center py-8 text-gray-500">
                    No recommendations yet. Be the first to recommend!
                </div>
            );
        }

        return recommendations.map((rec) => (
            <div key={rec._id} className="bg-white rounded-lg shadow-md p-6 mb-4">
                <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                        <img
                            src={rec.recommenderImage || 'https://i.ibb.co/VqWBk8J/slider1.jpg'} 
                            alt={rec.recommenderName}
                            className="w-12 h-12 rounded-full"
                        />
                    </div>
                    <div className="flex-grow">
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="text-lg font-semibold text-blue-600">
                                {rec.recommendationTitle}
                            </h3>
                            <span className="text-sm text-gray-500">
                                {new Date(rec.timestamp).toLocaleDateString()}
                            </span>
                        </div>
                        <p className="text-sm font-medium text-gray-600 mb-2">
                            By {rec.recommenderName}
                        </p>
                        <div className="mb-4">
                            <img
                                src={rec.recommendedProductImage}
                                alt={rec.recommendedProductName}
                                className="w-full h-48 object-cover rounded-lg"
                            />
                        </div>
                        <p className="text-gray-700 mb-2">
                            Recommended Product: {rec.recommendedProductName}
                        </p>
                        <p className="text-gray-600">
                            {rec.recommendationReason}
                        </p>
                    </div>
                </div>
            </div>
        ));
    };

    if (loading) {
        return <div className="text-center mt-8">Loading...</div>;
    }

    if (!query) {
        return <div className="text-center mt-8">Query not found</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Query Creator Information */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <h2 className="text-2xl font-bold mb-4">Query Creator</h2>
                <div className="flex items-center gap-4">
                    <img 
                        src={query.userImage} 
                        alt={query.userName}
                        className="w-16 h-16 rounded-full"
                    />
                    <div>
                        <h3 className="text-xl font-semibold">{query.userName}</h3>
                        <p className="text-gray-600">{query.userEmail}</p>
                    </div>
                </div>
            </div>

            {/* Add Recommendation Form */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <h2 className="text-2xl font-bold mb-6">Add a Recommendation</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-700 mb-2">Recommendation Title</label>
                        <input
                            type="text"
                            name="recommendationTitle"
                            value={recommendation.recommendationTitle}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>
                    
                    <div>
                        <label className="block text-gray-700 mb-2">Recommended Product Name</label>
                        <input
                            type="text"
                            name="recommendedProductName"
                            value={recommendation.recommendedProductName}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 mb-2">Recommended Product Image</label>
                        <input
                            type="url"
                            name="recommendedProductImage"
                            value={recommendation.recommendedProductImage}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 mb-2">Recommendation Reason</label>
                        <textarea
                            name="recommendationReason"
                            value={recommendation.recommendationReason}
                            onChange={handleChange}
                            className="w-full p-2 border rounded h-32"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition duration-300"
                    >
                        Add Recommendation
                    </button>
                </form>
            </div>

            {/* Recommendations List */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold mb-6">Recommendations</h2>
                {renderRecommendations()}
            </div>
        </div>
    );
};

export default QueryDetails;
