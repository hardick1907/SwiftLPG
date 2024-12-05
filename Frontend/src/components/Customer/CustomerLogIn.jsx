import { useState } from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff, Loader2, Lock, Mail} from "lucide-react";
import { useAuthStore } from "../../Store/useAuthStore";

export default function CustomerLogIn() {
  
  const {customerLogin,isLoggingIn} = useAuthStore();  
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await customerLogin(formData);
  };

  return (
  <div className="min-h-screen pt-16">
    <div className="flex flex-col justify-center items-center p-6 sm:p-12">
      <div className="w-full max-w-md space-y-8">

        <div className="text-center mb-8">
          <div className="flex flex-col items-center gap-2 group">
            <h1 className="text-2xl font-bold mt-2">Customer</h1>
            <p className="text-base-content/60">Login to your account</p>
          </div>
        </div>


        <form className="space-y-5" onSubmit={handleSubmit}>

          <div className="form-control">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-base-content/40" />
              </div>
              <input type="email" className="input input-bordered w-full pl-10" placeholder="Email"
                value={formData.email} onChange={(e)=>
              setFormData({ ...formData, email: e.target.value })
              }
              required
              />
            </div>
          </div>


          <div className="form-control">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="size-5 text-base-content/40" />
              </div>
              <input type={showPassword ? "text" : "password" } className="input input-bordered w-full pl-10"
                placeholder="Password" value={formData.password} onChange={(e)=>
              setFormData({ ...formData, password: e.target.value })
              }
              required
              />
              <button type="button" className="absolute inset-y-0 right-0 pr-3 flex items-center" onClick={(e)=> {
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

          <button type="submit" className={`btn btn-primary w-full ${isLoggingIn ? "loading" : "" }`}
            disabled={isLoggingIn}>
            {isLoggingIn ? (
            <Loader2 className="animate-spin h-5 w-5" />
            ) : (
            "Sign in"
            )}
          </button>
        </form>

        <div className="text-center">
          <p className="text-base-content/60">
            Don&apos;t have an account?{" "}
            <Link to="/customersignup" className="link link-primary">
            Create account
            </Link>
          </p>
        </div>
      </div>
    </div>
  </div>
  );
};