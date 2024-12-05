import { useEffect } from "react";
import { useAdminStore } from "../../Store/useAdminStore.js";
import DOMPurify from 'dompurify';

export default function AdminDashboard () {
  const {
    fetchCustomers,
    fetchNoticesAdmin,
    bookingsRequest,
    customers,
    bookings,
    noticesAdmin,
    acceptRequest,
    denyRequest,
    deleteCustomer,
    isloading,
  } = useAdminStore();

  useEffect(() => {
    fetchCustomers();
    fetchNoticesAdmin();
    bookingsRequest();
  }, [fetchCustomers, fetchNoticesAdmin, bookingsRequest]);

  const pendingBookings = bookings.filter(booking => booking.status === "Pending");

  return (
    <div className="p-6 min-h-screen">
      <h1 className="text-4xl font-bold mb-6 text-center text-blue-700">Admin Dashboard</h1>

      {isloading && (
      <p className="text-center text-gray-600">Loading...</p>
      )}

      <section className="border shadow-md p-4 mb-6" style={{ height: "300px", overflowY: "auto" }}>
        <h2 className="text-2xl font-semibold mb-4">Customers</h2>
        {customers.length > 0 ? (
        <ul className="space-y-4">
          {customers.map((customer) => (
          <li key={customer.id} className="flex justify-between items-center pb-2">
            <span>{customer.name} - {customer.connectionId}</span>
            <button onClick={()=> deleteCustomer(customer.id)}
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
              Delete
            </button>
          </li>
          ))}
        </ul>
        ) : (
        <p className="text-gray-600">No customers found.</p>
        )}
      </section>

      <section className="border shadow-md p-4 mb-6" style={{ height: "300px", overflowY: "auto" }}>
        <h2 className="text-2xl font-semibold mb-4">Booking Requests</h2>
        {pendingBookings.length > 0 ? (
        <ul className="space-y-4">
          {pendingBookings.map((booking) => (
          <li key={booking.connectionId} className="flex justify-between items-center pb-2">
            <span>{booking.name}({booking.connectionId}) requested cylinder.</span>
            <div>
              <button onClick={()=> acceptRequest(booking)}
                className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 mr-2"
                >
                Accept
              </button>
              <button onClick={()=> denyRequest(booking)}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                Deny
              </button>
            </div>
          </li>
          ))}
        </ul>
        ) : (
        <p className="text-gray-600">No pending booking requests.</p>
        )}
      </section>

      <section className="border shadow-md p-4" style={{ height: "300px", overflowY: "auto" }}>
        <h2 className="text-2xl font-semibold mb-4">Notices</h2>
        {noticesAdmin.length > 0 ? (
        <ul className="space-y-4">
          {noticesAdmin.map((notice) => (
          <li key={notice.id} className="flex justify-between items-center pb-2">
            <span>
              <p className="mt-2 text-lg text-white" dangerouslySetInnerHTML={{
                          __html: DOMPurify.sanitize(notice.content),
                        }} />
            </span>
            <small className="text-gray-500">{notice.date}</small>
          </li>
          ))}
        </ul>
        ) : (
        <p className="text-gray-600">No notices available.</p>
        )}
      </section>
    </div>
  );
};