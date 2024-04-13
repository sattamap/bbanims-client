import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";


const Login = () => {
    const { register} = useForm();
    return (
        <div className="min-h-screen flex items-center justify-center bg-emerald-400">
        <div className="max-w-xl mx-auto p-6 bg-white shadow-md rounded-md">
          <div className=' flex items-center justify-center text-xl font-bold bg-purple-300 rounded-xl mb-5'>
            <div>
              <img className='w-20'  alt="" />
            </div>
            <h2>Inventory Management System of Engineering Section of Bangladesh Betar, Bandarban</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="text-center md:text-left mb-8">
              <h4 className="text-4xl font-bold mb-4 text-emerald-800">Welcome Back!</h4>
              <p className="text-base">
                Log in to manage and  access operations.
              </p>
            </div>
            <div>
              <form >
                <div className="space-y-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      {...register('email', { required: true })}
                      className="mt-1 p-2 w-full border rounded-md"
                      placeholder="Enter email"
                    />
                  </div>
                  <div className="relative">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                    <input
                      type='password'
                      id="password"
                      name="password"
                      {...register('password', { required: true })}
                      className="mt-1 p-2 w-full border rounded-md"
                      placeholder="Enter password"
                    />

                  </div>
                  <div>
                    <button
                      type="submit"
                      className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-700"
                    >
                      Login
                    </button>
                  </div>
                </div>
              </form>
              <p className="text-center mt-3 text-sm">
              New here? <Link to='/register' className="text-blue-500">Create an account</Link>
            </p>
            </div>
          </div>
   
        </div>
  

      </div>
    );
};

export default Login;