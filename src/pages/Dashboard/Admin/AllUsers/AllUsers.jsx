
import { useQuery } from "@tanstack/react-query";
import {  FaTrash } from "react-icons/fa";
import useAxiosPublic from "../../../../hooks/useAxiosPublic";




const AllUsers = () => {
  const axiosPublic = useAxiosPublic();
 

  const { data: users = [], isLoading} = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await axiosPublic.get("/users");
      return res.data;
    }
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

 
  return (
    <div>
      <div className="flex justify-evenly bg-emerald-800 p-10 rounded-xl">
        <h2 className="text-2xl text-slate-100 font-extrabold">All Users</h2>
        <h2 className="text-2xl text-slate-100 font-extrabold">Total users: {users.length}</h2>
      </div>
      <div className="overflow-x-auto px-20">
        <table className="table table-xs table-zebra mt-10 ">
          <thead>
            <tr>
              <th></th>
              <th>Name</th>
              <th>Email</th>
              <th>Status</th>
              <th>User Info</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={user._id}>
                <th>{index + 1}</th>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
 role
</td>

  
                <td>
                  <button
                    className="btn btn-ghost btn-xs"
                  >
                    See Info
                  </button>
                </td>
                <th>
                  <button
                    className="btn btn-ghost btn-xs"
                  >
                    <FaTrash></FaTrash>
                  </button>
                </th>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllUsers;
