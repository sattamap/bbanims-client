import { useForm } from "react-hook-form";
import { useLoaderData } from "react-router-dom";
import useAxiosPublic from "../../../../hooks/useAxiosPublic";
import Swal from "sweetalert2";
import { useEffect, useState } from "react";

const image_hosting_key = import.meta.env.VITE_IMAGE_HOSTING_KEY;
const image_hosting_api = `https://api.imgbb.com/1/upload?key=${image_hosting_key}`;

const UpdateItems = () => {
  const {
    itemName,
    category,
    model,
    origin,
    condition,
    locationGood,
    locationBad,
    date,
    detail,
    _id,
    image,
  } = useLoaderData();
  const axiosPublic = useAxiosPublic();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  
  // Initialize state variables
  const [userSelectedCategory, setUserSelectedCategory] = useState(
    category === "Equipment" || category === "SpareParts" ? category : "Others"
  );
  const [specificCategory, setSpecificCategory] = useState(category);

  // Monitor the selected category using the watch function
  const selectedCategory = watch("category");

  // Initialize state variables for good and bad quantities
  const [goodQuantity, setGoodQuantity] = useState(condition?.Good || 0);
  const [badQuantity, setBadQuantity] = useState(condition?.Bad || 0);

  // State for the current image URL
  const [currentImageUrl, setCurrentImageUrl] = useState(image);

  // Event handler for increasing the "Good" quantity with permission alert
  const handleIncreaseGood = () => {
    Swal.fire({
      title: "Would you like to increase the Good quantity?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    }).then((result) => {
      if (result.isConfirmed) {
        setGoodQuantity((prevGoodQuantity) => prevGoodQuantity + 1);
      }
    });
  };

  // Event handler for decreasing the "Good" quantity with permission alert
  const handleDecreaseGood = () => {
    if (goodQuantity > 0) {
      Swal.fire({
        title: "Would you like to decrease the Good quantity?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Yes",
        cancelButtonText: "No",
      }).then((result) => {
        if (result.isConfirmed) {
          setGoodQuantity((prevGoodQuantity) => prevGoodQuantity - 1);
          // Increase the "Bad" quantity by one when decreasing "Good" quantity
          setBadQuantity((prevBadQuantity) => prevBadQuantity + 1);
        }
      });
    }
  };

  useEffect(() => {
    // Update the userSelectedCategory state variable when the selected category changes
    setUserSelectedCategory(selectedCategory);
  }, [selectedCategory]);

  const onSubmit = async (data) => {
    let imageUrl = "";

    if (data.image && data.image[0]) {
      const formData = new FormData();
      formData.append("image", data.image[0]);

      try {
        const res = await axiosPublic.post(image_hosting_api, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        if (res.data.success) {
          imageUrl = res.data.data.display_url;
          setCurrentImageUrl(imageUrl); // Update the current image URL state
        } else {
          console.error("Image upload failed:", res.data);
        }
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    } else {
      // No new image selected, use the existing imageUrl from the state
      imageUrl = currentImageUrl || ""; // Use the existing image URL or an empty string if not present
    }

    const condition = {
      Good: goodQuantity,
      Bad: badQuantity,
    };
    const totalQuantity = condition.Good + condition.Bad;

    const item = {
      itemName: data.itemName,
      category: data.category === "Others" ? specificCategory : data.category,
      model: data.model,
      origin: data.origin,
      condition,
      locationGood: data.locationGood,
      locationBad: data.locationBad,
      totalQuantity,
      date: data.date,
      detail: data.detail,
      image: imageUrl || undefined, // Set to undefined if imageUrl is empty
    };

    try {
      const itemResult = await axiosPublic.patch(`/items/${_id}`, item);
      if (itemResult.data.modifiedCount > 0) {
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: `${data.itemName} has been updated.`,
          showConfirmButton: false,
          timer: 1500,
        });
      }
    } catch (error) {
      console.error("Error updating item:", error);
    }
  };

  return (
    <div className="w-full mx-auto bg-white p-4 my-10 rounded-md shadow-xl md:w-4/5 lg:w-full xl:w-full">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col lg:flex-row gap-6 mb-6">
          <div className="form-control w-full ">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              <span className="label-text">Name of the Item</span>
              <span className="text-red-500 text-lg ml-2">*</span>{" "}
              {/* Red star for required field */}
            </label>
            <input
              type="text"
              defaultValue={itemName}
              placeholder="e.g. Module"
              {...register("itemName", { required: true })}
              className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-sm md:text-base"
            />
            {errors.itemName && (
              <p className="text-red-500 text-xs font-semibold mt-1">
                This field is required
              </p>
            )}
          </div>
          <div className="form-control w-full ">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              <span className="label-text">Category</span>
              <span className="text-red-500 text-lg ml-2">*</span>
            </label>
            <select
              {...register("category", { required: true })}
              defaultValue={category}
              value={userSelectedCategory}
              onChange={(e) => {
                const selectedValue = e.target.value;
                setUserSelectedCategory(selectedValue);
                // Clear specific category when user selects a different category
                if (selectedValue !== "Others") {
                  setSpecificCategory("");
                }
              }}
              className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-sm md:text-base"
            >
              <option value="SpareParts">Spare Parts</option>
              <option value="Equipment">Equipment</option>
              <option value="Furniture">Furniture</option>
              <option value="Others">Others</option>
            </select>

            {/* Conditionally render specific category input based on selection */}
            {userSelectedCategory === "Others" && (
              <div className="mt-2">
                <input
                  type="text"
                  {...register("specificCategory", { required: true })}
                  defaultValue={category}
                  placeholder="Specify the category"
                  value={specificCategory}
                  onChange={(e) => setSpecificCategory(e.target.value)}
                  className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-sm md:text-base"
                />
                {errors.specificCategory && (
                  <p className="text-red-500 text-xs font-semibold mt-1">
                    This field is required
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col lg:flex-row gap-6 mb-6">
          <div className="form-control w-full ">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              <span className="label-text">Model Name</span>
              <span className="text-red-500 text-lg ml-2">*</span>
            </label>
            <input
              type="text"
              defaultValue={model}
              placeholder="e.g. AM-10A"
              {...register("model")}
              disabled
              className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-sm md:text-base"
            />
          </div>
          <div className="form-control w-full ">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              <span className="label-text">Country Origin</span>
              <span className="text-red-500 text-lg ml-2">*</span>
            </label>
            <input
              type="text"
              defaultValue={origin}
              placeholder="e.g. USA"
              {...register("origin")}
              className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-sm md:text-base"
            />
          </div>
        </div>
        <div className="flex flex-col lg:flex-row gap-6 mb-6">
          <div className="form-control w-full ">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              <span className="label-text">Good Condition</span>
              <span className="text-red-500 text-lg ml-2">*</span>
            </label>
            <div className="flex items-center">
              <button
                type="button"
                onClick={handleDecreaseGood}
                className="border border-gray-300 bg-gray-100 px-2 py-2 rounded-l"
              >
                -
              </button>
              <input
                type="number"
                value={goodQuantity}
                readOnly
                className="border-t border-b border-gray-300 w-full text-center py-2"
              />
              <button
                type="button"
                onClick={handleIncreaseGood}
                className="border border-gray-300 bg-gray-100 px-2 py-2 rounded-r"
              >
                +
              </button>
            </div>
          </div>
          <div className="form-control w-full ">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              <span className="label-text">Bad Condition</span>
              <span className="text-red-500 text-lg ml-2">*</span>
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                value={badQuantity}
                readOnly
                {...register("badQuantity", { required: true })}
                className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-sm md:text-base"
              />
            </div>
          </div>
        </div>
        <div className="flex flex-col lg:flex-row gap-6 mb-6">
          <div className="form-control w-full ">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              <span className="label-text">Location (Good)</span>
              <span className="text-red-500 text-lg ml-2">*</span>
            </label>
            <input
              type="text"
              defaultValue={locationGood}
              placeholder="Location of good condition items"
              {...register("locationGood", { required: true })}
              className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-sm md:text-base"
            />
            {errors.locationGood && (
              <p className="text-red-500 text-xs font-semibold mt-1">
                This field is required
              </p>
            )}
          </div>
          <div className="form-control w-full ">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              <span className="label-text">Location (Bad)</span>
              <span className="text-red-500 text-lg ml-2">*</span>
            </label>
            <input
              type="text"
              defaultValue={locationBad}
              placeholder="Location of bad condition items"
              {...register("locationBad", { required: true })}
              className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-sm md:text-base"
            />
            {errors.locationBad && (
              <p className="text-red-500 text-xs font-semibold mt-1">
                This field is required
              </p>
            )}
          </div>
        </div>
        <div className="flex flex-col lg:flex-row gap-6 mb-6">
          <div className="form-control w-full ">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              <span className="label-text">Date</span>
              <span className="text-red-500 text-lg ml-2">*</span>
            </label>
            <input
              type="date"
              defaultValue={date}
              {...register("date", { required: true })}
              className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-sm md:text-base"
            />
            {errors.date && (
              <p className="text-red-500 text-xs font-semibold mt-1">
                This field is required
              </p>
            )}
          </div>
          <div className="form-control w-full ">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              <span className="label-text">Detail</span>
            </label>
            <textarea
              defaultValue={detail}
              placeholder="Additional details about the item"
              {...register("detail")}
              className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-sm md:text-base"
            ></textarea>
          </div>
        </div>
        <div className="form-control w-full mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            <span className="label-text">Upload Image</span>
          </label>
          <input
            type="file"
            {...register("image")}
            className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-sm md:text-base"
          />
        </div>
        <div className="form-control w-full mb-6">
          {currentImageUrl && (
            <img src={currentImageUrl} alt="Current" className="w-32 h-32" />
          )}
        </div>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Update Item
        </button>
      </form>
    </div>
  );
};

export default UpdateItems;
