// import { Link } from "react-router-dom";

// const Home = () => {
//     return (
//         <div className="flex flex-row gap-10">
//            <Link to='/dashboard/equipmentList'><button className="btn p-16 btn-lg btn-accent">Equipment</button></Link>
//            <Link to='/dashboard/spareParts'><button className="btn p-16 btn-lg btn-accent">Spare Parts</button></Link>
          
//         </div>
//     );
// };

// export default Home;

import { useEffect, useState } from "react";
import useAxiosPublic from "../../../../hooks/useAxiosPublic";

const Home = () => {
    const axiosPublic = useAxiosPublic();
    const [items, setItems] = useState([]);
    const [category, setCategory] = useState(""); // State variable for selected category
    const [allCategories, setAllCategories] = useState([]); // State variable to store all available categories

    useEffect(() => {
        const fetchItems = async () => {
            try {
                // Fetch all items from the API
                const response = await axiosPublic.get('/items');

                // Get all available categories from the items
                const categories = [...new Set(response.data.map(item => item.category))];

                // Update the state with the available categories
                setAllCategories(categories);

                // If a category is selected, filter items based on the selected category
                const filteredItems = response.data.filter(item => category === "" || item.category === category);

                // Update the state with the filtered items
                setItems(filteredItems);
            } catch (error) {
                console.error('Error fetching items:', error);
            }
        };

        fetchItems();
    }, [axiosPublic, category]); // Re-run the effect whenever the category changes

    return (
        <div>
            {/* Dropdown menu for selecting a category */}
            <div className="mb-4">
                <label htmlFor="category" className="block text-gray-700 text-sm font-bold mb-2">Select Category:</label>
                <select
                    id="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                >
                    <option value="">All</option> {/* Option to select all items */}
                    {allCategories.map((categoryOption) => (
                        <option key={categoryOption} value={categoryOption}>{categoryOption}</option>
                    ))}
                </select>
            </div>

            {/* Items table */}
            <div className="overflow-x-auto">
                <table className="table table-xs">
                    {/* Table header */}
                    <thead>
                        <tr>
                            <th></th>
                            <th>Name, Image, Model <br />& Country Origin</th>
                            <th>Quantity</th>
                            <th>Date of Receive</th>
                            <th>Detail</th>
                            <th>Location & Condition</th>
                        </tr>
                    </thead>
                    {/* Table body */}
                    <tbody>
                        {items.map((item, index) => (
                            <tr key={item._id}>
                                <td>{index + 1}.</td>
                                <td>
                                    <div className="flex items-center gap-3">
                                        <div className="avatar">
                                            <div className="mask mask-squircle w-12 h-12">
                                                <img src={item?.image} alt={item?.itemName} />
                                            </div>
                                        </div>
                                        <div>
                                            <div className="font-bold">{item?.itemName}</div>
                                            <div className="text-sm opacity-50">{item?.model}</div>
                                            <div className="text-sm opacity-50">{item?.origin}</div>
                                        </div>
                                    </div>
                                </td>
                                <td>{item?.quantity}</td>
                                <td>{item?.date}</td>
                                <td>
                                    <p className="">{item?.detail}</p>
                                </td>
                                <td>
                                    <div className="flex flex-col items-center justify-center">
                                        <p className="">{item?.location}</p>
                                        <p className="">{item?.condition}</p>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Home;
