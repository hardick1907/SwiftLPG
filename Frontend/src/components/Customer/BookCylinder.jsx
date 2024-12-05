import { Mail, MapPin, Phone, User, Lock, Calendar } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useState } from 'react';
import {QRCodeSVG} from 'qrcode.react';
import { useCustomerStore } from "../../Store/useCustomerStore";

export default function BookCylinder() {

  const navigate = useNavigate();
  const { bookCylinder } = useCustomerStore();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    address: "",
    deliveryDate: "",
    paymentMethod: "COD",
    transactionId: "",
  });

  const today = new Date();
  const minDate = new Date(today);
  minDate.setDate(today.getDate() + 3);
  const minDateString = minDate.toISOString().split('T')[0];

  const validateForm = () => {
    if (!formData.name.trim()) return toast.error("Name is required");
    if (!formData.email.trim()) return toast.error("Email is required");
    if (!/\S+@\S+\.\S+/.test(formData.email)) return toast.error("Invalid email format");
    if (!formData.phoneNumber.trim()) return toast.error("Phone number is required");
    if (!formData.address.trim()) return toast.error("Address is required");
    if (!formData.deliveryDate.trim()) return toast.error("Delivery date is required");
    if (formData.paymentMethod === "Paytm" && !formData.transactionId.trim())
    return toast.error("Transaction ID is required for Paytm payment");
    return true;
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const success = validateForm();
    if (success === true) {
      console.log("Form data:", formData);
      bookCylinder(formData);
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen pt-16">
      <div className="flex flex-col justify-center items-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8">

          <div className="text-center mb-8">
            <div className="flex flex-col items-center gap-2 group">
              <h1 className="text-2xl font-bold mt-2">Booking Form</h1>
              <p className="text-base-content/60">Book your cylinder here</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="form-control">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="size-5 text-base-content/40" />
                </div>
                <input type="text" className="input input-bordered w-full pl-10" placeholder="Full Name" name="name"
                  value={formData.name} onChange={handleInputChange} />
              </div>
            </div>

            <div className="form-control">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="size-5 text-base-content/40" />
                </div>
                <input type="email" className="input input-bordered w-full pl-10" placeholder="Email" name="email"
                  value={formData.email} onChange={handleInputChange} />
              </div>
            </div>

            <div className="form-control">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="size-5 text-base-content/40" />
                </div>
                <input type="phone" className="input input-bordered w-full pl-10" placeholder="Phone Number"
                  name="phoneNumber" value={formData.phoneNumber} onChange={handleInputChange} pattern="[6-9][0-9]{9}" />
              </div>
            </div>

            <div className="form-control">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPin className="size-5 text-base-content/40" />
                </div>
                <input type="text" className="input input-bordered w-full pl-10" placeholder="Address" name="address"
                  value={formData.address} onChange={handleInputChange} />
              </div>
            </div>


            <div className="form-control">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar className="size-5 text-base-content/40" />
                </div>
                <input type="date" className="input input-bordered w-full pl-10" name="deliveryDate"
                  value={formData.deliveryDate} onChange={handleInputChange} min={minDateString} />
              </div>
            </div>

            <div className="form-control">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="size-5 text-base-content/40" />
                </div>
                <select name="paymentMethod" value={formData.paymentMethod} onChange={handleInputChange}
                  className="input input-bordered w-full pl-10">
                  <option value="COD">COD</option>
                  <option value="Paytm">Paytm</option>
                </select>
              </div>
            </div>

            {formData.paymentMethod === "Paytm" && (
            <>
              <div className="form-control text-center flex flex-col justify-center items-center">
                <QRCodeSVG value={`paytm://pay?amount=100&txnId=uniqueTransactionId`} />
                <p className="mt-2 text-sm text-gray-500">Scan the QR code to pay via Paytm.</p>
              </div>

              <div className="form-control">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="size-5 text-base-content/40" />
                  </div>
                  <input type="text" className="input input-bordered w-full pl-10" placeholder="Enter Transaction ID"
                    name="transactionId" pattern="[0-9]{12}" value={formData.transactionId} onChange={handleInputChange} />
                </div>
              </div>
            </>
            )}

            <button type="submit" className="btn btn-primary w-full">Book Now</button>
          </form>
        </div>
      </div>
    </div>
  );
};