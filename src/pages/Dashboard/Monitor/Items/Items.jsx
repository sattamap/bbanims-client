import { useEffect, useState } from "react";
import useAxiosPublic from "../../../../hooks/useAxiosPublic";




const Items = () => {
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

  


  return (
    <div>
      <div className="overflow-x-auto">
        <table className="table table-xs">
          {/* head */}
          <thead>
            <tr>
              <th></th>
              <th>Name, Image, Model <br/>& Country Origin</th>
              <th>Quantity</th>
              <th>Date of Receive</th>
              <th>Detail</th>
              <th>Location & Condition</th>
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
                <td>
                  {item?.quantity}
                </td>
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

export default Items;
