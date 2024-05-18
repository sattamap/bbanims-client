import { useEffect, useState } from "react";
import useAxiosPublic from "../../../../hooks/useAxiosPublic";

const Home = () => {
    const axiosPublic = useAxiosPublic();
    const [totalItems, setTotalItems] = useState(0);
    const [totalGoodItems, setTotalGoodItems] = useState(0);
    const [totalBadItems, setTotalBadItems] = useState(0);

    useEffect(() => {
        // Fetch the list of items from the API
        const fetchItems = async () => {
            try {
                const response = await axiosPublic.get("/items");
                const items = response.data;

                // Calculate the total number of items
                const totalItemsCount = items.length;
                setTotalItems(totalItemsCount);

                // Calculate the total number of "Good" and "Bad" items
                const goodItemsCount = items.reduce((total, item) => total + (item.condition?.Good || 0), 0);
                const badItemsCount = items.reduce((total, item) => total + (item.condition?.Bad || 0), 0);

                setTotalGoodItems(goodItemsCount);
                setTotalBadItems(badItemsCount);
            } catch (error) {
                console.error("Error fetching items:", error);
            }
        };

        fetchItems();
    }, [axiosPublic]);

    return (
        <div className="container mx-auto px-4 py-8">
            <h2 className="text-3xl font-bold text-teal-600 mb-6 text-center">
                Inventory Management System of Bangladesh Betar, Bandarban
            </h2>

            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Total Items */}
                <div className="bg-gradient-to-r from-teal-500 to-teal-700 shadow-lg rounded-lg p-6 text-center hover:shadow-xl transition-shadow duration-300">
                    <h3 className="text-xl font-semibold text-white mb-2">Total Items</h3>
                    <p className="text-4xl font-bold text-white">{totalItems}</p>
                </div>

                {/* Total Good Items */}
                <div className="bg-gradient-to-r from-green-500 to-green-700 shadow-lg rounded-lg p-6 text-center hover:shadow-xl transition-shadow duration-300">
                    <h3 className="text-xl font-semibold text-white mb-2">Total Good Items</h3>
                    <p className="text-4xl font-bold text-white">{totalGoodItems}</p>
                </div>

                {/* Total Bad Items */}
                <div className="bg-gradient-to-r from-red-500 to-red-700 shadow-lg rounded-lg p-6 text-center hover:shadow-xl transition-shadow duration-300">
                    <h3 className="text-xl font-semibold text-white mb-2">Total Bad Items</h3>
                    <p className="text-4xl font-bold text-white">{totalBadItems}</p>
                </div>
            </div>

            {/* Footer with copyright information */}
            <footer className="mt-12 lg:mt-80 text-center text-gray-600 text-sm">
                &copy; {new Date().getFullYear()} Inventory Management System of Bangladesh Betar, Bandarban. All rights reserved.
                <br />Developed by Sattam.
            </footer>
        </div>
    );
};

export default Home;
