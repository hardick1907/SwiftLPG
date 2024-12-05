import { useEffect } from 'react';
import { useCustomerStore } from '../../Store/useCustomerStore.js';
import { useAuthStore } from '../../Store/useAuthStore.js';
import { Link, Mail, User } from "lucide-react";
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const {
    notices,
    fetchNotices,
    bookCylinder,
  } = useCustomerStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const handleBookCylinder = (e) => {
    e.preventDefault();
    navigate("/booknow");
  };

  useEffect(() => {
    fetchNotices();
  }, [fetchNotices]);

  return (
    <div className="p-6 min-h-screen">
      <h1 className="text-4xl font-bold mb-6 text-center text-blue-700">Customer Dashboard</h1>

      {/* Notices Section */}
      <section className="border shadow-md p-4 mb-6">
        <h2 className="text-2xl font-semibold mb-4">Notices</h2>
        {notices.length > 0 ? (
          <ul className="space-y-4">
            {notices.map((notice, index) => (
              <li key={index} className="flex justify-between items-center pb-2">
                <span>{notice.title}: {notice.content}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600">No notices available.</p>
        )}
      </section>

      {/* User Profile Section */}
      <section className="border shadow-md p-4 mb-6">
        <div className="text-center mb-4">
          <h2 className="text-2xl font-semibold">This is {user.name}</h2>
          <p className="mt-2">Your profile information</p>
        </div>

        <div className="space-y-6">
          {/* Name */}
          <div className="space-y-1.5">
            <div className="text-sm text-zinc-400 flex items-center gap-2">
              <User className="w-4 h-4" />
              Name
            </div>
            <p className="px-4 py-2.5 bg-base-200 border">{user?.name}</p>
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <div className="text-sm text-zinc-400 flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Email Address
            </div>
            <p className="px-4 py-2.5 bg-base-200 border">{user?.email}</p>
          </div>

          {/* Connection ID */}
          <div className="space-y-1.5">
            <div className="text-sm text-zinc-400 flex items-center gap-2">
              <Link className="w-4 h-4" />
              Connection ID
            </div>
            <p className="px-4 py-2.5 bg-base-200 border">{user?.connectionId}</p>
          </div>
        </div>

        {/* Account Information */}
        <div className="mt-6 bg-base-300 p-6">
          <h2 className="text-lg font-medium mb-4">Account Information</h2>
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between py-2 border-b border-zinc-700">
              <span>Member Since</span>
              <span>{user.createdAt?.split("T")[0]}</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span>Account Status</span>
              <span className="text-green-500">Active</span>
            </div>
          </div>
        </div>
      </section>

      {/* Cylinder Booking Section */}
      <section className="border shadow-md p-4 mb-6">
        <h2 className="text-2xl font-semibold mb-4">Cylinder Booking</h2>
        <form onSubmit={handleBookCylinder} className="space-y-4">
          {/* Add your booking form inputs here */}
          <button onClick={handleBookCylinder} type="submit" className="bg-primary text-white px-4 py-2 hover:bg-red-900">
            Book Cylinder
          </button>
        </form>
      </section>
    </div>
  );
};

export default Dashboard;
