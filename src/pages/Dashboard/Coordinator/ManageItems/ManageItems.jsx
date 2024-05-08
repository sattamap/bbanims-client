import { useEffect, useState } from "react";
import useAxiosPublic from "../../../../hooks/useAxiosPublic";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

const ManageItems = () => {
    const axiosPublic = useAxiosPublic();
    const [items, setItems] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCondition, setSelectedCondition] = useState("");
    const [currentPage, setCurrentPage] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [totalItems, setTotalItems] = useState(0);

    // Fetch items from the API
    useEffect(() => {
        const fetchItems = async () => {
            try {
                const response = await axiosPublic.get('/items');
                setItems(response.data);
            } catch (error) {
                console.error('Error fetching items:', error);
            }
        };
        fetchItems();
    }, [axiosPublic]);

    // Handle deletion of an item
    const handleDelete = async (item) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await axiosPublic.delete(`/item/${item._id}`);
                    if (response.status === 200) {
                        // Remove the deleted item from the state
                        setItems((prevItems) => prevItems.filter((i) => i._id !== item._id));
                        Swal.fire({
                            position: "top-end",
                            icon: "success",
                            title: `${item.itemName} has been deleted`,
                            showConfirmButton: false,
                            timer: 1500,
                        });
                    } else {
                        console.error("Error deleting item:", response.data);
                        Swal.fire({
                            icon: "error",
                            title: "Oops...",
                            text: "Something went wrong!",
                        });
                    }
                } catch (error) {
                    console.error("Error deleting item:", error);
                    Swal.fire({
                        icon: "error",
                        title: "Oops...",
                        text: "Something went wrong!",
                    });
                }
            }
        });
    };

    // Filter items based on search term and selected condition
    const filteredItems = items.filter((item) => {
        const matchesName = item.itemName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCondition = selectedCondition === "" || item.condition === selectedCondition;
        return matchesName && matchesCondition;
    });

    // Calculate the total number of filtered items
    const totalFilteredItems = filteredItems.length;

    // Calculate the total number of pages based on the filtered items and items per page
    const numberOfPages = Math.ceil(totalFilteredItems / itemsPerPage);

    // Calculate paginated items
    const startIndex = currentPage * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, totalFilteredItems);
    const paginatedItems = filteredItems.slice(startIndex, endIndex);

    // Update the current page when search term or selected condition changes
    useEffect(() => {
        setCurrentPage(0);
    }, [searchTerm, selectedCondition]);

    // Handle changes in items per page
    const handleItemsPerPageChange = (e) => {
        setItemsPerPage(parseInt(e.target.value));
        setCurrentPage(0); // Reset current page
    };

    // Handle page change
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    // Rendering page numbers
    const renderPageNumbers = () => {
        const pageNumbers = [];
        const range = 1;

        // Calculate the range of page numbers to display around the current page
        let startPage = Math.max(0, currentPage - range);
        let endPage = Math.min(numberOfPages - 1, currentPage + range);

        // Adjust the range if necessary
        if (endPage - startPage < range * 1) {
            startPage = Math.max(0, endPage - range * 1);
            endPage = Math.min(numberOfPages - 1, startPage + range * 1);
        }

        // Always include the first and last page
        if (startPage > 0) {
            pageNumbers.push(
                <button
                    key={0}
                    className={`btn btn-xs ${currentPage === 0 ? 'bg-teal-950 text-white' : 'btn-info text-black'}`}
                    onClick={() => handlePageChange(0)}
                >
                    1
                </button>
            );
            if (startPage > 1) {
                pageNumbers.push(<span key="dots1" className="mx-2">...</span>);
            }
        }

        // Render page buttons within the range
        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(
                <button
                    key={i}
                    className={`btn btn-xs ${currentPage === i ? 'bg-teal-950 text-white' : 'btn-info text-black'}`}
                    onClick={() => handlePageChange(i)}
                >
                    {i + 1}
                </button>
            );
        }

        // Always include the last page
        if (endPage < numberOfPages - 1) {
            if (endPage < numberOfPages - 2) {
                pageNumbers.push(<span key="dots2" className="mx-2">...</span>);
            }
            pageNumbers.push(
                <button
                    key={numberOfPages - 1}
                    className={`btn btn-xs ${currentPage === numberOfPages - 1 ? 'bg-teal-950 text-white' : 'btn-info text-black'}`}
                    onClick={() => handlePageChange(numberOfPages - 1)}
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
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 0}
                    >
                        Previous
                    </button>
                </li>
                {pageNumbers}
                <li>
                    <button
                        className="btn btn-xs btn-info mx-2"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === numberOfPages - 1}
                    >
                        Next
                    </button>
                </li>
            </ul>
        );
    };

    return (
        <div>
            {/* Search and filter section */}
            <div className="mb-4 flex justify-between">
                <input
                    type="text"
                    placeholder="Search by item name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="input input-bordered w-full mr-2"
                />

                <select
                    value={selectedCondition}
                    onChange={(e) => setSelectedCondition(e.target.value)}
                    className="input input-bordered w-36"
                >
                    <option value="">All Conditions</option>
                    <option value="Good">Good</option>
                    <option value="Bad">Bad</option>
                </select>
            </div>

            {/* Table for displaying items */}
            <div className="overflow-x-auto">
                <table className="table table-xs">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Name, Image, Model, & Origin</th>
                            <th>Quantity</th>
                            <th>Category & Date</th>
                            <th>Location & Condition</th>
                            <th>Action</th>
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
                                <td>{item?.quantity}</td>
                                <td>
                                    <div className="flex flex-col items-center">
                                        <p>{item?.category}</p>
                                        <p>{item?.date}</p>
                                    </div>
                                </td>
                                <td>
                                    <div className="flex flex-col items-center">
                                        <p>{item?.location}</p>
                                        <p
                                            className={`${
                                                item?.condition === "Good" ? "bg-green-300 p-1 rounded" : "bg-red-400 p-1 px-2 rounded"
                                            }`}
                                        >
                                            {item?.condition}
                                        </p>
                                    </div>
                                </td>
                                <td>
                                    <div className="flex gap-2 justify-center">
                                        <button
                                            className="btn btn-warning btn-xs"
                                            onClick={() => handleDelete(item)}
                                        >
                                            Delete
                                        </button>
                                        <Link to={`/dashboard/updateItem/${item._id}`}>
                                            <button className="btn btn-neutral btn-xs">Edit</button>
                                        </Link>
                                        <Link to={`/dashboard/details/${item._id}`}>
                                            <button className="btn btn-neutral btn-xs">Details</button>
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
                <nav>
                    {renderPageNumbers()}
                </nav>
            </div>
        </div>
    );
};

export default ManageItems;
