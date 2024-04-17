import { useContext } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { AuthContext } from "../../provider/AuthProvider";



const Register = () => {
    const { createUser } = useContext(AuthContext);


    const {
      register,
      handleSubmit,
      formState: { errors },
    } = useForm();
  
    const onSubmit = async (data) => {
      try {
        const { email, password } = data;
        await createUser(email, password);
        // Redirect or show success message
      } catch (error) {
        // Handle error
      }
    };
    return (
      <div className="w-3/4 mx-auto mt-8 pb-2 bg-emerald-400 lg:p-20">
        <div className=" items-center">
          <div className="p-4">
            <h1 className="text-4xl font-bold mb-4">Create an Account</h1>
            <p className="text-base text-gray-700">
              Join the Inventory Management System .
            </p>
          </div>
          <div className="w-5/6 mx-auto bg-white p-3 my-3 rounded-md shadow-xl md:w-4/5 lg:w-full xl:w-full">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="form-control w-full">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-600"
                >
                  Email
                </label>
                <input
                  type="email"
                  {...register("email", { required: true })}
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                  placeholder="Enter your email"
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">This field is required</p>
                )}
              </div>
              <div className="form-control w-full relative">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-600"
                >
                  Password
                </label>
                <input
                  type="password"
                  {...register("password", {
                    required: true,
                  })}
                  className={`mt-1 p-2 w-full border ${
                    errors.password ? "border-red-500" : "border-gray-300"
                  } rounded-md`}
                  placeholder="Enter password"
                />
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>
              {/* {error && <p className="text-red-500 text-xs mt-1">{error}</p>} */}
              <div className="flex justify-center">
                <button
                  type="submit"
                  className="btn btn-sm sm:btn-sm md:btn-md  bg-blue-500 text-white rounded-xl mt-4"
                >
                  Sign Up
                </button>
              </div>
            </form>
            <p className="text-center mt-3">
              Already have an account?{" "}
              <Link to="/" className="text-blue-500">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    );
  };
  
  export default Register;