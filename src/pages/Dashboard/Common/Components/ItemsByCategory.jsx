import React, { useEffect, useState } from 'react';
import useAxiosPublic from '../../../../hooks/useAxiosPublic';
import { Link } from 'react-router-dom';

// Custom Pagination component
const Pagination = ({ currentPage, numberOfPages, onPageChange }) => {
    const range = 1; // Number of pages to show around the current page
    const startPage = Math.max(0, currentPage - range);
    const endPage = Math.min(numberOfPages - 1, currentPage + range);

    const renderPageNumbers = () => {
        const pageNumbers = [];

        if (startPage > 0) {
            pageNumbers.push(
                <button
                    key={0}
                    className={`btn btn-xs ${currentPage === 0 ? 'bg-teal-950 text-white' : 'btn-info text-black'}`}
                    onClick={() => onPageChange(0)}
                >
                    1
                </button>
            );
            if (startPage > 1) {
                pageNumbers.push(<span key="dots1" className="mx-2">...</span>);
            }
        }

        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(
                <button
                    key={i}
                    className={`btn btn-xs ${currentPage === i ? 'bg-teal-950 text-white' : 'btn-info text-black'}`}
                    onClick={() => onPageChange(i)}
                >
                    {i + 1}
                </button>
            );
        }

        if (endPage < numberOfPages - 1) {
            if (endPage < numberOfPages - 2) {
                pageNumbers.push(<span key="dots2" className="mx-2">...</span>);
            }
            pageNumbers.push(
                <button
                    key={numberOfPages - 1}
                    className={`btn btn-xs ${currentPage === numberOfPages - 1 ? 'bg-teal-950 text-white' : 'btn-info text-black'}`}
                    onClick={() => onPageChange(numberOfPages - 1)}
                >
                    {numberOfPages}
                </button>
            );
        }

        return (
            <ul className="flex justify-center items-center space-x-2">
                <li>
                    <button
                        className="btn btn-xs btn-info mx-2"
                        onClick={() => onPageChange(currentPage - 1)}
                        disabled={currentPage === 0}
                    >
                        Previous
                    </button>
                </li>
                {pageNumbers}
                <li>
                    <button
                        className="btn btn-xs btn-info mx-2"
                        onClick={() => onPageChange(currentPage + 1)}
                        disabled={currentPage === numberOfPages - 1}
                    >
                        Next
                    </button>
                </li>
            </ul>
        );
    };

    return <>{renderPageNumbers()}</>;
};

const ItemsByCategory = () => {
    const axiosPublic = useAxiosPublic();
    const [items, setItems] = useState([]);
    const [category, setCategory] = useState(''); // State variable for selected category
    const [allCategories, setAllCategories] = useState([]); // State variable to store all available categories
    const [selectedCondition, setSelectedCondition] = useState(''); // State variable for selected condition
    const [currentPage, setCurrentPage] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [totalItems, setTotalItems] = useState(0);
    const [error, setError] = useState(null); // State variable for handling errors

    useEffect(() => {
      const fetchItems = async () => {
          try {
              // Fetch all items from the API
              const response = await axiosPublic.get('/items');
  
              // Get all available categories from the items
              const categories = [...new Set(response.data.map(item => item.category))];
              setAllCategories(categories);
  
              // Filter the items based on selected category and condition
              const filteredItems = response.data.filter(item =>
                  (category === '' || item.category === category) &&
                  (selectedCondition === '' || item.condition === selectedCondition)
              );
  
              // Update state with filtered items and total count
              setItems(filteredItems);
              setTotalItems(filteredItems.length);
  
              // Check if the current page is out of bounds after filtering
              const newTotalPages = Math.ceil(filteredItems.length / itemsPerPage);
              if (currentPage >= newTotalPages) {
                  setCurrentPage(0); // Reset to the first page if the current page is out of bounds
              }
  
              setError(null); // Reset error state if successful
          } catch (error) {
              console.error('Error fetching items:', error);
              setError('Failed to fetch items. Please try again later.');
          }
      };
  
      fetchItems();
  }, [axiosPublic, category, selectedCondition, itemsPerPage, currentPage]);
  
    // Calculate paginated items
    const startIndex = currentPage * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedItems = items.slice(startIndex, endIndex);

    // Handle changes in items per page
    const handleItemsPerPageChange = (e) => {
        setItemsPerPage(parseInt(e.target.value, 10));
        setCurrentPage(0); // Reset current page when changing items per page
    };

    // Handle page change
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    // Calculate the total number of pages
    const numberOfPages = Math.ceil(totalItems / itemsPerPage);

    return (
        <div>
            {/* Category and Condition dropdowns */}
            <div className="mb-4">
                <label htmlFor="category" className="block text-gray-700 text-sm font-bold mb-2">Select Category:</label>
                <select
                    id="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                >
                    <option value="">All</option>
                    {allCategories.map((categoryOption) => (
                        <option key={categoryOption} value={categoryOption}>{categoryOption}</option>
                    ))}
                </select>

                <label htmlFor="condition" className="block text-gray-700 text-sm font-bold mb-2">Select Condition:</label>
                <select
                    id="condition"
                    value={selectedCondition}
                    onChange={(e) => setSelectedCondition(e.target.value)}
                    className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                >
                    <option value="">All Conditions</option>
                    <option value="Good">Good</option>
                    <option value="Bad">Bad</option>
                </select>
            </div>

            {/* Error Handling */}
            {error && (
                <div className="alert alert-error my-4">
                    {error}
                </div>
            )}

            {/* Items table */}
            <div className="overflow-x-auto">
                <table className="table table-xs">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th><p className=''>Name, Image, Model, & Origin</p></th>
                            <th><p className='text-center'>Quantity</p></th>
                            <th><p className='text-center'>Category & Date</p></th>
                            <th><p className='text-center'>Location & Condition</p></th>
                            <th><p className='text-center'>Action</p></th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedItems.map((item, index) => (
                            <tr key={item._id}>
                                <td>{startIndex + index + 1}.</td>
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
                                <td><p className='text-center'>{item?.quantity}</p></td>
                                <td>
                                    <div className="text-center">
                                        <p>{item?.category}</p>
                                        <p>{item?.date}</p>
                                    </div>
                                </td>
                                <td>
                                    <div className="flex flex-col gap-2 items-center">
                                        <p>{item?.location}</p>
                                        <p
                                            className={`${
                                                item?.condition === 'Good' ? 'bg-green-300 p-1 rounded' : 'bg-red-400 p-1 px-2 rounded'
                                            }`}
                                        >
                                            {item?.condition}
                                        </p>
                                    </div>
                                </td>
                                <td>
                                    <div className="flex gap-2 justify-center">
                                        <Link to={`/dashboard/details/${item._id}`}>
                                            <button className="btn btn-neutral btn-xs">Detail</button>
                                        </Link>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination controls */}
            <div className="flex flex-col lg:flex-row items-center justify-center mt-4">
                <div className="mb-4 lg:mb-0 lg:mr-4">
                    <select
                        value={itemsPerPage}
                        onChange={handleItemsPerPageChange}
                        className="p-2 border border-teal-400 rounded-lg"
                    >
                        <option value={5}>5 per page</option>
                        <option value={10}>10 per page</option>
                        <option value={20}>20 per page</option>
                    </select>
                </div>
                <Pagination
                    currentPage={currentPage}
                    numberOfPages={numberOfPages}
                    onPageChange={handlePageChange}
                />
            </div>
        </div>
    );
};

export default ItemsByCategory;
