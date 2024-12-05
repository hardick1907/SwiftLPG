import React, { useEffect, useState } from 'react';
import { useCustomerStore } from '../../Store/useCustomerStore';

export default function BookingHistory () {
  const { bookings = [], fetchBookingHistory, isloading } = useCustomerStore();
  const [filterStatus, setFilterStatus] = useState("All");

  useEffect(() => {
    fetchBookingHistory();  
  }, [fetchBookingHistory]);

  const filteredBookings = bookings.filter((booking) => {
    if (filterStatus === "All") return true;
      return booking.status === filterStatus;
    }
  );

  if (isloading) {
    return (
      <div className="pt-20 px-6">
        <p className="text-center text-white">Loading...</p>
      </div>
    );
  }

  return (
    <div className="pt-20 px-6">
      <div className="mb-4 text-center space-y-2 sm:space-y-0 sm:flex sm:gap-2 sm:justify-center">
        <button onClick={()=> setFilterStatus("All")}
          className={`px-4 py-2 mx-2 ${filterStatus === "All" ? "bg-orange-900" : "bg-gray-500"}`}
          >
          All
        </button>
        <button onClick={()=> setFilterStatus("Pending")}
          className={`px-4 py-2 mx-2 ${filterStatus === "Pending" ? "bg-orange-900" : "bg-gray-500"}`}
          >
          Pending
        </button>
        <button onClick={()=> setFilterStatus("Accepted")}
          className={`px-4 py-2 mx-2 ${filterStatus === "Accepted" ? "bg-orange-900" : "bg-gray-500"}`}
          >
          Accepted
        </button>
        <button onClick={()=> setFilterStatus("Denied")}
          className={`px-4 py-2 mx-2 ${filterStatus === "Denied" ? "bg-orange-900" : "bg-gray-500"}`}
          >
          Denied
        </button>
      </div>

      <div className="overflow-x-auto shadow-md">
        <table className="w-full text-sm text-left bg-secondary">
          <thead className="text-base uppercase text-white">
            <tr>
              <th className="px-6 py-3">Request ID</th>
              <th className="px-6 py-3">Connection ID</th>
              <th className="px-6 py-3">Payment Method</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3 text-center">Booking ID</th>
            </tr>
          </thead>
          <tbody>
            {filteredBookings.length === 0 ? (
            <tr>
              <td colSpan="4" className="text-center py-4 text-white">No bookings found</td>
            </tr>
            ) : (
            filteredBookings.map((booking) => (
            <tr key={booking.requestId} className="bg-black border-b">
              <td className="px-6 py-4">{booking.requestId}</td>
              <td className="px-6 py-4">{booking.connectionId}</td>
              <td className="px-6 py-4">{booking.paymentMethod}</td>
              <td className="px-6 py-4">
                <span className={`px-2 py-1 text-xs font-medium rounded ${ booking.status==="Accepted"
                  ? "bg-green-100 text-green-800" : booking.status==="Denied" ? "bg-red-100 text-red-800"
                  : "bg-yellow-100 text-yellow-800" }`}>
                  {booking.status}
                </span>
              </td>
              <td className="px-6 py-4 text-center">{booking.bookingId || "N/A"}</td>
            </tr>
            ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};