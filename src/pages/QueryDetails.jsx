import React from 'react';
import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../providers/AuthProvider';

const QueryDetails = () => {
    const [query, setQuery] = useState(null);
    const [loading, setLoading] = useState(true);
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
            <div className="bg-white rounded-lg shadow-md p-6">
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
        </div>
    );
};

export default QueryDetails;