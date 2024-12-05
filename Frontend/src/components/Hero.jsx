import { useAuthStore } from "../Store/useAuthStore.js"
import { useNavigate } from "react-router-dom";

export default function Hero() {

const { user,admin } = useAuthStore();
const navigate = useNavigate();

const handleClick = (e) => {
  e.preventDefault();
  if(user){
    navigate("/booknow");
  }else if(admin){
    navigate("/bookingsrequest")
  }else{
    navigate("/signin")
  }
}

  return (
    <div className="flex flex-col md:flex-row items-center justify-between h-screen pt-16 px-6 md:px-20">
    <div className="flex flex-col gap-5 md:gap-8 max-w-lg text-center md:text-left">
      <h1 className="text-4xl md:text-5xl font-bold leading-tight">
        Reliable Gas Services, <br />
        Delivered to Your Doorstep!
      </h1>
      <p className="text-gray-600 text-lg">
        Experience hassle-free gas cylinder delivery with just a click. Book now and enjoy fast, reliable service.
      </p>
      <button
        onClick={handleClick}
        className="bg-primary hover:bg-secondary text-white font-bold py-3 px-6 shadow-md"
      >
        Book Now
      </button>
    </div>
    <div className="w-full md:w-1/2 flex justify-center mt-10 md:mt-0">
      <img
        src="./gas-cylinder.png"
        alt="Gas Cylinder"
        className="w-80 md:w-full max-w-lg object-contain drop-shadow-lg"
      />
    </div>
  </div>
  );
}