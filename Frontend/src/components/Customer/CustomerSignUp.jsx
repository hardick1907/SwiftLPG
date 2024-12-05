import { useState } from "react";
import { Eye, EyeOff, Mail, MapPin, Phone, User,Lock } from "lucide-react";
import {Link, useNavigate} from 'react-router-dom';
import {toast} from 'react-toastify';
import { useAuthStore } from "../../Store/useAuthStore";

export default function CustomerSignUp() {

    const navigate = useNavigate();
    const {customerSignup,isSigningUp} = useAuthStore();
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phoneNumber: "",
        address: "",
        password: "",
        confirmPassword: "",
    });

    const validateForm = () => {
        if (!formData.name.trim()) return toast.error("Name is required");
        if (!formData.email.trim()) return toast.error("Email is required");
        if (!/\S+@\S+\.\S+/.test(formData.email)) return toast.error("Invalid email format");
        if (!formData.phoneNumber.trim()) return toast.error("Phone number is required");
        if (!formData.address.trim()) return toast.error("Address is required");
        if (!formData.password.trim()) return toast.error("Password is required");
        if (formData.password.length < 7) return toast.error("Password must be at least 7 characters"); 
        if (formData.password!==formData.confirmPassword) {return toast.error("Passwords do not match");} 
        return true; 
    }; 
    const
    handleInputChange=(e)=> {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
    e.preventDefault();

    const success = validateForm();
        if (success === true) {
            customerSignup(formData);
            navigate("/bookcylinder");
        }
    };

    return (
        <div className="min-h-screen pt-16">
            <div className="flex flex-col justify-center items-center p-6 sm:p-12">
                <div className="w-full max-w-md space-y-8">

                    <div className="text-center mb-8">
                        <div className="flex flex-col items-center gap-2 group">
                            <h1 className="text-2xl font-bold mt-2">Create Account</h1>
                            <p className="text-base-content/60">Get started with your free account</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="form-control">
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <User className="size-5 text-base-content/40" />
                                </div>
                                <input type="text" className="input input-bordered w-full pl-10" placeholder="Full Name"
                                    name="name" value={formData.name} onChange={handleInputChange} />
                            </div>
                        </div>

                        <div className="form-control">
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="size-5 text-base-content/40" />
                                </div>
                                <input type="email" className="input input-bordered w-full pl-10" placeholder="Email"
                                    name="email" value={formData.email} onChange={handleInputChange} />
                            </div>
                        </div>

                        <div className="form-control">
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Phone className="size-5 text-base-content/40" />
                                </div>
                                <input type="phone" className="input input-bordered w-full pl-10" placeholder="Phone Nubmer"
                                    name="phoneNumber" value={formData.phoneNumber} onChange={handleInputChange}
                                    pattern="[6-9][0-9]{9}" />
                            </div>
                        </div>

                        <div className="form-control">
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <MapPin className="size-5 text-base-content/40" />
                                </div>
                                <input type="address" className="input input-bordered w-full pl-10" placeholder="Address"
                                    name="address" value={formData.address} onChange={handleInputChange} />
                            </div>
                        </div>

                        <div className="form-control">
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="size-5 text-base-content/40" />
                                </div>
                                <input type={showPassword ? "text" : "password" }
                                    className="input input-bordered w-full pl-10" placeholder="Password" name="password"
                                    value={formData.password} onChange={handleInputChange} />
                                <button type="button" className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    onClick={(e)=> {
                                    e.preventDefault();
                                    setShowPassword(!showPassword);
                                    }}
                                    >
                                    {showPassword ? (
                                    <EyeOff className="size-5 text-base-content/40" />
                                    ) : (
                                    <Eye className="size-5 text-base-content/40" />
                                    )}
                                </button>
                            </div>
                        </div>

                        <div className="form-control">
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="size-5 text-base-content/40" />
                                </div>
                                <input type={showPassword ? "text" : "password" }
                                    className="input input-bordered w-full pl-10" placeholder="Confirm Password"
                                    name="confirmPassword" value={formData.confirmPassword} onChange={handleInputChange} />
                                <button type="button" className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    onClick={(e)=> {
                                    e.preventDefault();
                                    setShowPassword(!showPassword);
                                    }}
                                    >
                                    {showPassword ? (
                                    <EyeOff className="size-5 text-base-content/40" />
                                    ) : (
                                    <Eye className="size-5 text-base-content/40" />
                                    )}
                                </button>
                            </div>
                        </div>

                        <button type="submit" className={`btn btn-primary w-full ${isSigningUp ? "loading" : "" }`}
                            disabled={isSigningUp}>
                            {isSigningUp ? (
                            <Loader2 className="animate-spin h-5 w-5" />
                            ) : (
                            "Sign Up"
                            )}
                        </button>

                    </form>

                    <div className="text-center">
                        <p className="text-base-content/60">
                            Already have an account?{" "}
                            <Link to="/customerlogin" className="link link-primary">
                            Sign in
                            </Link>
                        </p>
                    </div>

                    <div className="text-center">
                        <p className="text-base-content/60">
                            I am an{" "}
                            <Link to="/adminlogin" className="link link-primary">
                            Admin
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};