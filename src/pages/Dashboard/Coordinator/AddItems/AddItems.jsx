
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import useAxiosPublic from "../../../../hooks/useAxiosPublic";




const image_hosting_key = import.meta.env.VITE_IMAGE_HOSTING_KEY;
const image_hosting_api = `https://api.imgbb.com/1/upload?key=${image_hosting_key}`;


const AddItems = () => {
  const axiosPublic = useAxiosPublic();
  const { register, handleSubmit, reset } = useForm()
  const onSubmit = async (data) => {
    console.log(data);
    const imageFile = { image: data.image[0] }
    const res = await axiosPublic.post(image_hosting_api, imageFile, {
      headers: {
        'content-type': 'multipart/form-data'
      }
    });

    if (res.data.success) {
      const item = {

        itemName: data.itemName,
        condition: data.condition,
        quantity: data.quantity,
        date: data.date,
        detail: data.detail,
        image: res.data.data.display_url,
      }
      // 
      const result = await axiosPublic.post('/item', item);
      console.log(result.data)
      if (result.data.insertedId) {
        // show success popup
        reset();
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: `${data.birdNameENG} is added to the menu.`,
          showConfirmButton: false,
          timer: 1500
        });
      }
    }
  };

  return (
    <div className="w-full mx-auto bg-white p-4 my-10 rounded-md shadow-xl md:w-4/5 lg:w-full xl:w-full">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col lg:flex-row gap-6 mb-6">
          <div className="form-control w-full ">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              <span className="label-text">Name of the Item</span>
            </label>
            <input type="text" placeholder="e.g. Module" {...register("itemName", { required: true })} required
              className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-sm md:text-base"
            />

          </div>
          <div className="form-control w-full ">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              <span className="label-text">Condition of Item</span>
            </label>
            <input type="text" placeholder="e.g. Good/Bad " {...register("condition", { required: true })} required
              className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-sm md:text-base"
            />

          </div>

        </div>
        <div className="flex flex-col lg:flex-row gap-6 mb-6">
          <div className="form-control w-full ">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              <span className="label-text">Quantity</span>
            </label>
            <input type="number" placeholder="e.g. 4" {...register("quantity", { required: true })} required
              className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-sm md:text-base"
            />

          </div>
          <div className="form-control w-full ">
            <label htmlFor="deadline" className="block text-gray-700 text-sm font-bold mb-2">
              Date of Receive
            </label>
            <input
              type="date"
              id="receive"
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
              {...register('image', { required: true })}
              className="border rounded w-full py-[6px] px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
        </div>
        <div className="flex justify-center">
          <button className="btn w-1/2 mt-10 bg-emerald-700 text-white hover:bg-emerald-950 hover:text-white ">
            Add Item
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddItems;
