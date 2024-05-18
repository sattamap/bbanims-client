import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import useAxiosPublic from "../../../../hooks/useAxiosPublic";

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
        <div className="hero-content flex-col gap-6 lg:flex-row lg:gap-8">
          {itemDetails && (
            <>
              {itemDetails.image && (
                <img src={itemDetails.image} className="w-full rounded-lg shadow-2xl lg:w-1/3 lg:max-h-full" alt={itemDetails.itemName} />
              )}
              <div className={`${itemDetails.image ? "lg:w-2/3" : "w-full"} mt-6 lg:mt-0 flex flex-col`}>
                <h1 className="text-base font-medium mb-2 lg:mb-4">
                  Name of the Item <span className="lg:ml-[124px] lg:mr-2">:</span>
                  <span className="text-lg font-bold block xl:inline">{itemDetails?.itemName}</span>
                </h1>
                <h1 className="text-base font-medium mb-2 lg:mb-4">
                  Category <span className="lg:ml-[188px] lg:mr-2">:</span>
                  <span className="text-lg font-bold block xl:inline">{itemDetails?.category}</span>
                </h1>
                <h1 className="text-base font-medium mb-2 lg:mb-4">
                  Model <span className="lg:ml-[210px] lg:mr-2">:</span>
                  <span className="text-lg font-bold block xl:inline">{itemDetails?.model}</span>
                </h1>
                <h1 className="text-base font-medium mb-2 lg:mb-4">
                  Origin <span className="lg:ml-[210px] lg:mr-2">:</span>
                  <span className="text-lg font-bold block xl:inline">{itemDetails?.origin}</span>
                </h1>
                <h1 className="text-base font-medium mb-2 lg:mb-4">
                  Location of Good Item <span className="lg:ml-[90px] lg:mr-2">:</span>
                  <span className="text-lg font-bold block xl:inline">{itemDetails?.locationGood}</span>
                </h1>
                <h1 className="text-base font-medium mb-2 lg:mb-4">
                  Location of Defective Item <span className="lg:ml-[66px] lg:mr-2">:</span>
                  <span className="text-lg font-bold block xl:inline">{itemDetails?.locationBad}</span>
                </h1>
                <h1 className="text-base font-medium mb-2 lg:mb-4">
                  Date of Receive/Installation <span className="lg:ml-[56px] lg:mr-2">:</span>
                  <span className="text-lg font-bold block xl:inline">{itemDetails?.date}</span>
                </h1>
                <h1 className="text-base font-medium mb-2 lg:mb-4">
                  Number of Good Items <span className="lg:ml-[86px] lg:mr-2">:</span>
                  <span className="text-lg font-bold block xl:inline">{itemDetails?.condition?.Good}</span>
                </h1>
                <h1 className="text-base font-medium mb-2 lg:mb-4">
                  Number of Defective Items <span className="lg:ml-[60px] lg:mr-2">:</span>
                  <span className="text-lg font-bold block xl:inline">{itemDetails?.condition?.Bad}</span>
                </h1>
                <p className="text-justify overflow-auto max-h-64">{itemDetails?.detail}</p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Details;
