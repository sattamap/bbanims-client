import { useParams } from "react-router-dom";
import useAxiosPublic from "../../../../hooks/useAxiosPublic";
import { useEffect, useState } from "react";



const Details = () => {
  const { id } = useParams();
  const axiosPublic = useAxiosPublic();
  const [items, setItems] = useState([]);

  useEffect(() => {
    axiosPublic.get('/items').then((response) => {
        setItems(response.data);
    });
  }, [axiosPublic]);

  const itemDetails = items.find((item) => item._id === id);

  return (
    <div>
      <div className="hero min-h-screen bg-base-200">
        <div className="hero-content flex-col gap-6">
          <div className="lg:flex lg:gap-8">
            <img src={itemDetails?.image} className="w-full rounded-lg shadow-2xl" alt={itemDetails?.birdNameENG} />
            <div className="lg:w-2/3 mt-6 lg:mt-0">
              <h1 className="text-base font-medium mb-2 lg:mb-4">
                Name of the Item <span className="lg:mr-2">:</span>
                <span className="text-lg font-bold block xl:inline ">{itemDetails?.itemName}</span>
              </h1>
              <h1 className="text-base font-medium mb-2 lg:mb-4">
                Location <span className="lg:ml-16 lg:mr-2">:</span>
                <span className="text-lg font-bold block xl:inline">{itemDetails?.location}</span>
              </h1>
              <h1 className="text-base font-medium mb-2 lg:mb-4">
                Date of Receive/Installation <span className="lg:ml-24 lg:mr-2">:</span>
                <span className="text-lg font-bold block xl:inline">{itemDetails?.date}</span>
              </h1>
              <h1 className="text-base font-medium mb-2 lg:mb-4">
                Condition <span className="lg:ml-4 lg:mr-2">:</span>
                <span className="text-lg font-bold block xl:inline">{itemDetails?.condition}</span>
              </h1>
              <p className="text-justify overflow-auto max-h-64">{itemDetails?.detail}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Details;
