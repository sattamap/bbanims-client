
import { useForm } from "react-hook-form";
import { useLoaderData } from "react-router-dom";



const UpdateItems = () => {
    const { register } = useForm()
    const {itemName,condition,quantity,date,detail} = useLoaderData();

  return (
    <div className="w-full mx-auto bg-white p-4 my-10 rounded-md shadow-xl md:w-4/5 lg:w-full xl:w-full">
      <form>
        <div className="flex flex-col lg:flex-row gap-6 mb-6">
          <div className="form-control w-full ">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              <span className="label-text">Name of the Item</span>
            </label>
            <input type="text" defaultValue={itemName} placeholder="e.g. Module" {...register("itemName", { required: true })} required
              className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-sm md:text-base"
            />

          </div>
          <div className="form-control w-full ">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              <span className="label-text">Condition of Item</span>
            </label>
            <input type="text" defaultValue={condition} placeholder="e.g. Good/Bad " {...register("condition", { required: true })} required
              className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-sm md:text-base"
            />

          </div>

        </div>
        <div className="flex flex-col lg:flex-row gap-6 mb-6">
          <div className="form-control w-full ">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              <span className="label-text">Quantity</span>
            </label>
            <input type="number" defaultValue={quantity} placeholder="e.g. 4" {...register("quantity", { required: true })} required
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

export default UpdateItems;
