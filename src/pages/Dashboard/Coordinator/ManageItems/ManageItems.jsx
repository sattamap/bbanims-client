import { useEffect, useState } from "react";
import useAxiosPublic from "../../../../hooks/useAxiosPublic";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";



const ManageItems = () => {
  const axiosPublic = useAxiosPublic();
  const [items, setItems] = useState([]);


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
          const res = await axiosPublic.delete(`/item/${item._id}`);
          console.log(res.data);

          if (res.status === 200) {
            // refetch to update the ui
            const updatedItems = items.filter((i) => i._id !== item._id);
            setItems(updatedItems);
            Swal.fire({
              position: "top-end",
              icon: "success",
              title: `${item.itemName} has been deleted`,
              showConfirmButton: false,
              timer: 1500,
            });
          } else {
            // Handle the case where the bird was not deleted
            console.error("Error deleting bird:", res.data);
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "Something went wrong!",
            });
          }
        } catch (error) {
          console.error("Error deleting bird:", error);
          // Handle the case where an error occurred during deletion
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Something went wrong!",
          });
        }
      }
    });
  };

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="table table-xs">
          {/* head */}
          <thead>
            <tr>
              <th></th>
              <th><p className="text-center">Name, Image, Model <br/>& Country Origin</p></th>
              <th><p className="text-center">Quantity</p></th>
              <th><p className="text-center">Category <br /> & Date of Receive</p></th>
              <th><p className="text-center">Location <br /> & Condition</p></th>
              <th><p className="text-center">Action</p></th>
            </tr>
          </thead>
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
                <td className="flex flex-col items-center justify-center">
                  {item?.quantity}
                </td>
                <td>
                 <div className="flex flex-col items-center">
                <p className="">{item?.category}</p>
                <p>{item?.date}</p>
                 </div>
                </td>
                <td>
                <div className="flex flex-col gap-2 items-center">
    <p>{item?.location}</p>
    <p
        className={`${
            item?.condition === "Good" ? "bg-green-300 p-1" : "bg-red-400 p-1 px-2"
        } p-2 rounded`}
    >
        {item?.condition}
    </p>
</div>

                </td>
                <th>
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
                      <button className="btn btn-neutral btn-xs">Detail</button>
                    </Link>
                  </div>
                </th>
              </tr>
            ))}
          </tbody>
        </table>
      </div>


    </div>
  );
};

export default ManageItems;
