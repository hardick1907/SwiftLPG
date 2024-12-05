import { useEffect, useState } from "react";
import { Mail, MapPin, Phone, User,Link2 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useAdminStore } from "../Store/useAdminStore";

export default function EditCustomer() {
    const navigate = useNavigate();
    const { customerId } = useParams(); 
    const { fetchCustomerDetails, updateCustomer, isLoading, details: customerDetails } = useAdminStore();

    const [formData, setFormData] = useState({
        connectionId: "",
        name: "",
        email: "",
        phoneNumber: "",
        address: "",
    });

    useEffect(() => {
    fetchCustomerDetails(customerId);
    }, [customerId, fetchCustomerDetails]);

    useEffect(() => {
    if (customerDetails) {
        setFormData({
            connectionId: customerDetails.connectionId || "",
            name: customerDetails.name || "",
            email: customerDetails.email || "",
            phoneNumber: customerDetails.phoneNumber || "",
            address: customerDetails.address || "",
        });
    }
    }, [customerDetails]);

    const validateForm = () => {
        if (!formData.connectionId.trim()) return toast.error("Connection ID is required");
        if (!formData.name.trim()) return toast.error("Name is required");
        if (!formData.email.trim()) return toast.error("Email is required");
        if (!/\S+@\S+\.\S+/.test(formData.email)) return toast.error("Invalid email format");
        if (!formData.phoneNumber.trim() || !/^[6-9][0-9]{9}$/.test(formData.phoneNumber))
        return toast.error("Invalid phone number");
        if (!formData.address.trim()) return toast.error("Address is required");
        return true;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
        try {
            await updateCustomer(customerId, formData);
            navigate("/manageusers");
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update customer");
        }
    }
    };

    if (isLoading) return <div className="flex items-center justify-center h-screen">Loading...</div>;

    return (
        <div className="min-h-screen pt-16">
            <div className="flex flex-col justify-center items-center p-6 sm:p-12">
                <div className="w-full max-w-md space-y-8">
                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-bold mt-2">Edit Customer</h1>
                        <p className="text-gray-600">Edit your customer details below</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {[
                        { name: "connectionId", placeholder: "Connection ID", icon: Link2, type: "text" },
                        { name: "name", placeholder: "Full Name", icon: User, type: "text" },
                        { name: "email", placeholder: "Email", icon: Mail, type: "email" },
                        { name: "phoneNumber", placeholder: "Phone Number", icon: Phone, type: "text" },
                        { name: "address", placeholder: "Address", icon: MapPin, type: "text" },
                        ].map(({ name, placeholder, icon: Icon, type }) => (
                        <div key={name} className="form-control">
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Icon className="size-5 text-gray-400" />
                                </div>
                                <input type={type} className="input input-bordered w-full pl-10" placeholder={placeholder}
                                    name={name} value={formData[name]} onChange={handleInputChange} />
                            </div>
                        </div>
                        ))}

                        <button type="submit" className={`btn btn-primary w-full ${isLoading ? "loading" : "" }`}
                            disabled={isLoading}>
                            {isLoading ? "Updating..." : "Update"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}