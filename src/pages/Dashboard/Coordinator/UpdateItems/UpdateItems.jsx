
import { useForm } from "react-hook-form";
import { useLoaderData } from "react-router-dom";
import useAxiosPublic from "../../../../hooks/useAxiosPublic";
import Swal from "sweetalert2";
import { useEffect, useState } from "react";


const image_hosting_key = import.meta.env.VITE_IMAGE_HOSTING_KEY;
const image_hosting_api = `https://api.imgbb.com/1/upload?key=${image_hosting_key}`;

const UpdateItems = () => {
    const { itemName, category, model, origin, condition, location, quantity, date, detail, _id } = useLoaderData();

    const axiosPublic = useAxiosPublic();
    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    // Initialize state variables
    const [userSelectedCategory, setUserSelectedCategory] = useState(category === "Equipment" || category === "SpareParts" ? category : "Others");
    const [specificCategory, setSpecificCategory] = useState(category);

    // Monitor the selected category using the watch function
    const selectedCategory = watch("category");


    useEffect(() => {
        // Update the userSelectedCategory state variable when the selected category changes
        setUserSelectedCategory(selectedCategory);
    }, [selectedCategory]);


    const onSubmit = async (data) => {
        console.log(data);
        let imageUrl = ""; // Initialize the image URL as an empty string

        // Check if an image file is provided before attempting to upload
        if (data.image && data.image[0]) {
            // Create a FormData object and append the image file
            const formData = new FormData();
            formData.append("image", data.image[0]);

            try {
                // Make a POST request to upload the image
                const res = await axiosPublic.post(image_hosting_api, formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });

                // Check if the image upload was successful
                if (res.data.success) {
                    // Get the image URL from the response data
                    imageUrl = res.data.data.display_url;
                } else {
                    console.error("Image upload failed:", res.data);
                    // Handle image upload failure (e.g., show a notification)
                }
            } catch (error) {
                console.error("Error uploading image:", error);
                // Handle error (e.g., show a notification)
            }
        } else {
            console.log("No image file selected.");
            // Handle the case where no image is selected
        }

        // Create the item object
        const item = {
            itemName: data.itemName,
            category: userSelectedCategory === "Others" ? specificCategory : userSelectedCategory,
            model: data.model,
            origin: data.origin,
            condition: data.condition,
            location: data.location,
            quantity: data.quantity,
            date: data.date,
            detail: data.detail,
            // If an image URL was successfully obtained, use it; otherwise, retain the existing image URL
            image: imageUrl || undefined, // Set to undefined if imageUrl is empty
        };

        // Make a PATCH request to update the item in the database
        const itemResult = await axiosPublic.patch(`/items/${_id}`, item);
        if (itemResult.data.modifiedCount > 0) {
            // Show success popup
            Swal.fire({
                position: "top-end",
                icon: "success",
                title: `${data.itemName} has been updated.`,
                showConfirmButton: false,
                timer: 1500,
            });
        }
    };



    return (
        <div className="w-full mx-auto bg-white p-4 my-10 rounded-md shadow-xl md:w-4/5 lg:w-full xl:w-full">
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="flex flex-col lg:flex-row gap-6 mb-6">
                    <div className="form-control w-full ">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            <span className="label-text">Name of the Item</span>
                            <span className="text-red-500 text-lg ml-2">*</span> {/* Red star for required field */}
                        </label>
                        <input type="text" defaultValue={itemName} placeholder="e.g. Module" {...register("itemName", { required: true })}
                            className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-sm md:text-base"
                        />
                        {errors.itemName && (
                            <p className="text-red-500 text-xs font-semibold mt-1">This field is required</p>
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
                            <p className="text-red-500 text-xs font-semibold mt-1">This field is required</p>
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
                            placeholder="e.g. USA "
                            {...register("origin", { required: true })}
                            className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-sm md:text-base"
                        />
                        {errors.origin && (
                            <p className="text-red-500 text-xs font-semibold mt-1">This field is required</p>
                        )}
                    </div>
                </div>
                <div className="flex flex-col lg:flex-row gap-6 mb-6">
                    <div className="form-control w-full ">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            <span className="label-text">Condition of Item</span>
                            <span className="text-red-500 text-lg ml-2">*</span>
                        </label>
                        <select
                            {...register("condition", { required: true })}
                            defaultValue={condition}
                            className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-sm md:text-base"
                        >
                            {errors.condition && (
                                <p className="text-red-500 text-xs font-semibold mt-1">This field is required</p>
                            )}
                            <option value="Good">Good</option>
                            <option value="Bad">Bad</option>
                        </select>
                    </div>
                    <div className="form-control w-full ">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            <span className="label-text">Current Location</span>
                            <span className="text-red-500 text-lg ml-2">*</span>
                        </label>
                        <input
                            type="text"
                            defaultValue={location}
                            placeholder="e.g. At Store/FM Room "
                            {...register("location", { required: true })}
                            className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-sm md:text-base"
                        />
                        {errors.location && (
                            <p className="text-red-500 text-xs font-semibold mt-1">This field is required</p>
                        )}
                    </div>
                </div>
                <div className="flex flex-col lg:flex-row gap-6 mb-6">
                    <div className="form-control w-full ">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            <span className="label-text">Quantity</span>
                            <span className="text-red-500 text-lg ml-2">*</span>
                        </label>
                        <input type="number" defaultValue={quantity} placeholder="e.g. 4" {...register("quantity", { required: true })}
                            className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-sm md:text-base"
                        />
                        {errors.quantity && (
                            <p className="text-red-500 text-xs font-semibold mt-1">This field is required</p>
                        )}

                    </div>
                    <div className="form-control w-full ">
                        <label htmlFor="deadline" className="block text-gray-700 text-sm font-bold mb-2">
                            Date of Receive
                        </label>
                        <input
                            type="date"
                            id="receive"
                            defaultValue={date}
                            {...register('date')}
                            className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-sm md:text-base"
                        />

                    </div>
                </div>
                <div className="flex gap-6 mb-6">
                    <div className="form-control w-full ">
                        <label htmlFor="detail" className="block text-gray-700 text-sm font-bold mb-2">
                            Detail About the Item
                        </label>
                        <textarea
                            id="detail"
                            defaultValue={detail}
                            placeholder="Write about specs, model name, country origin etc of the item . . . . ."
                            {...register('detail')}
                            className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>

                </div>

                <div className="flex flex-col lg:flex-row gap-6">

                    <div className="form-control w-full">
                        <label htmlFor="image" className="block text-gray-700 text-sm font-bold mb-2">
                            Image of the Item
                        </label>
                        <input
                            type="file"
                            id="image"
                            {...register('image')}
                            className="border rounded w-full py-[6px] px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>
                </div>
                <div className="flex justify-center">
                    <button className="btn w-1/2 mt-10 bg-emerald-700 text-white hover:bg-emerald-950 hover:text-white ">
                        Update Item
                    </button>
                </div>
            </form>
        </div>
    );
};

export default UpdateItems;
