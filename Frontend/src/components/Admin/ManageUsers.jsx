import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useAdminStore } from "../../Store/useAdminStore.js";

export default function ManageUsers() {
  const { customers, fetchCustomers, isloading, deleteCustomer } = useAdminStore();

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const handleDelete = (customerId) => {
    if (window.confirm("Are you sure you want to delete this customer?")) {
      deleteCustomer(customerId);
    }
  };

  return (
    <div className="pt-20 px-6">
      <div className="overflow-x-auto shadow-md">
        <table className="w-full text-sm text-left bg-secondary">
          <thead className="text-base uppercase text-white">
            <tr>
              <th className="px-6 py-3">Connection ID</th>
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">Email</th>
              <th className="px-6 py-3">Phone</th>
              <th className="px-6 py-3">Address</th>
              <th className="px-6 py-3">Cylinders</th>
              <th className="px-6 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isloading ? (
            <tr>
              <td colSpan="7" className="text-center py-6 text-white">Loading...</td>
            </tr>
            ) : customers.length > 0 ? (
            customers.map((customer) => (
            <tr key={customer.id} className="bg-black border-b">
              <td className="px-6 py-4">{customer.connectionId || "N/A"}</td>
              <td className="px-6 py-4">{customer.name || "N/A"}</td>
              <td className="px-6 py-4">{customer.email || "N/A"}</td>
              <td className="px-6 py-4">{customer.phoneNumber || "N/A"}</td>
              <td className="px-6 py-4">{customer.address || "N/A"}</td>
              <td className="px-6 py-4">{customer.cylinderAllocation?.total || 0}</td>
              <td className="px-6 py-6 flex justify-center items-center space-x-2">
                <Link to={`/editcustomer/${customer.id}`}
                  className="bg-yellow-500 hover:bg-yellow-600 text-black px-3 py-1 text-xs">
                Edit
                </Link>
                <button onClick={()=> handleDelete(customer.id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 text-xs"
                  >
                  Delete
                </button>
              </td>
            </tr>
            ))
            ) : (
            <tr>
              <td colSpan="7" className="text-center py-6 text-white">No customers found</td>
            </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};