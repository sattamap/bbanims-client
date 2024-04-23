
import { useQuery } from "@tanstack/react-query";
import {  FaTrash } from "react-icons/fa";
import useAxiosPublic from "../../../../hooks/useAxiosPublic";
import Swal from "sweetalert2";




const AllUsers = () => {
  const axiosPublic = useAxiosPublic();
 

  const { data: users = [], isLoading, refetch} = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await axiosPublic.get("/users");
      return res.data;
    }
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }


  const handleToggleRole = (user) => {
    Swal.fire({
      title: `Select the new role for ${user.name}:`,
      input: 'select',
      inputOptions: {
        admin: 'Admin',
        monitor: 'Monitor',
        coordinator: 'Coordinator',
        none: 'No Role', // Add 'none' option for "No Role"
      },
      inputPlaceholder: 'Select a role',
      showCancelButton: true,
      confirmButtonText: 'Change',
    }).then((result) => {
      if (result.isConfirmed) {
        const newRole = result.value === 'none' ? 'none' : result.value;
        axiosPublic.patch(`/users/status/${user._id}`, { status: newRole }).then((res) => {
          if (res.data.modifiedCount > 0) {
            refetch();
            const roleMessage =
              newRole === "admin" ? "Admin" : newRole === "monitor" ? "Monitor" : newRole === "coordinator" ? "Coordinator" : "No Role";
            Swal.fire({
              position: "top-end",
              icon: "success",
              title: `${user.name}'s role has been changed to ${roleMessage}`,
              showConfirmButton: false,
              timer: 1500,
            });
          }
        });
      }
    });
  };
  

 
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
                <button
    onClick={() => handleToggleRole(user)}
    className={`btn btn-ghost btn-xs ${
      user.status === "admin"
        ? "text-blue-500"
        : user.status === "monitor"
        ? "text-yellow-500"
        : user.status === "coordinator"
        ? "text-red-500"
        : "text-gray-500" // Use gray color for "No Role"
    }`}
  >
    {user.status === "admin"
      ? "Admin"
      : user.status === "monitor"
      ? "Monitor"
      : user.status === "coordinator"
      ? "Coordinator"
      : "No Role"}
  </button>
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
