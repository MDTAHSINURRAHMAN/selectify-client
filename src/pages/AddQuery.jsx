import React from 'react';
import { AuthContext } from '../providers/AuthProvider';
import { useNavigate } from 'react-router-dom';

const AddQuery = () => {
    const [formData, setFormData] = React.useState({
        productName: '',
        productBrand: '',
        productImageUrl: '',
        queryTitle: '',
        boycottReason: ''
    });
    const { user } = React.useContext(AuthContext);
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const queryData = {
            ...formData,
            userEmail: user.email,
            userName: user.displayName,
            userImage: user.photoURL,
            timestamp: new Date(),
            recommendationCount: 0
        };

        try {
            const response = await fetch('http://localhost:3000/add-query', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(queryData)
            });

            if (response.ok) {
                navigate('/my-queries');
            }
        } catch (error) {
            console.error('Error adding query:', error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
                <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">Add New Query</h2>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Product Name</label>
                        <input
                            type="text"
                            name="productName"
                            value={formData.productName}
                            onChange={handleInputChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Product Brand</label>
                        <input
                            type="text"
                            name="productBrand"
                            value={formData.productBrand}
                            onChange={handleInputChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Product Image URL</label>
                        <input
                            type="url"
                            name="productImageUrl"
                            value={formData.productImageUrl}
                            onChange={handleInputChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Query Title</label>
                        <input
                            type="text"
                            name="queryTitle"
                            value={formData.queryTitle}
                            onChange={handleInputChange}
                            placeholder="Is there any better product that gives me the same quality?"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Boycotting Reason</label>
                        <textarea
                            name="boycottReason"
                            value={formData.boycottReason}
                            onChange={handleInputChange}
                            rows={4}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Add Query
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddQuery;