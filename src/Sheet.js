import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DataTable = () => {
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        // Fetch data
        axios
            .get('https://excel-api-ob9u.onrender.com/functions')
            .then((response) => {
                setData(response.data);
                setFilteredData(response.data); // Initialize filtered data with all data
                setLoading(false);
            })
            .catch((error) => {
                setError(error);
                setLoading(false);
            });

        // Apply theme based on isDarkMode state
        if (isDarkMode) {
            document.body.classList.add('dark');
        } else {
            document.body.classList.remove('dark');
        }
    }, [isDarkMode]);

    useEffect(() => {
        // Filter the data whenever the search query changes
        if (searchQuery === '') {
            setFilteredData(data); // Show all data if no search query
        } else {
            const lowerCaseQuery = searchQuery.toLowerCase();
            setFilteredData(
                data.filter((item) => {
                    return Object.values(item)
                        .some((value) =>
                            value && value.toString().toLowerCase().includes(lowerCaseQuery)
                        );
                })
            );
        }
    }, [searchQuery, data]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-lg ml-4">Loading data...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                    <p>Error: {error.message}</p>
                    <button
                        onClick={() => {
                            setLoading(true);
                            setError(null);
                            // Retry logic
                            axios
                                .get('https://excel-api-ob9u.onrender.com/functions')
                                .then((response) => {
                                    setData(response.data);
                                    setFilteredData(response.data);
                                    setLoading(false);
                                })
                                .catch((error) => {
                                    setError(error);
                                    setLoading(false);
                                });
                        }}
                        className="mt-2 text-blue-500 hover:underline"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="relative overflow-x-auto shadow-lg sm:rounded-lg max-w-7xl mx-auto">
            <div className="flex justify-between items-center py-4">
                <img src="data:image/png;base64,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" className="h-10" alt="Logo" />
                <div className="flex items-center space-x-4">
                    {/* Search input */}
                    <div className="relative w-1/3">
                        <input
                            type="text"
                            id="search-navbar"
                            className="block w-full p-2 pl-10 text-sm border text-white bg-gray-800 rounded-lg"
                            placeholder="Search..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                            </svg>
                        </div>
                    </div>

                    {/* Theme toggle button */}
                    <button
                        onClick={() => setIsDarkMode(!isDarkMode)}
                        className="p-2 rounded-lg text-white bg-blue-500 hover:bg-blue-600"
                    >
                        {isDarkMode ? '🌞 Light Mode' : '🌙 Dark Mode'}
                    </button>
                </div>
            </div>

            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-white uppercase bg-gradient-to-r from-green-800 to-green-500 sticky top-0">
                    <tr>
                        <th scope="col" className="px-6 py-3">Name</th>
                        <th scope="col" className="px-6 py-3">Use Case</th>
                        <th scope="col" className="px-6 py-3">Syntax</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredData.length > 0 ? (
                        filteredData.map((user) => (
                            <tr key={user.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all">
                                <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{user.name}</td>
                                <td className="px-6 py-4">{user.usecase}</td>
                                <td className="px-6 py-4">{user.syntax}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="3" className="text-center py-4">No results found</td>
                        </tr>
                    )}
                </tbody>
            </table>

            <p className="text-sm text-gray-600 text-center py-4">
                Showing {filteredData.length} results
            </p>
        </div>
    );
};

export default DataTable;
