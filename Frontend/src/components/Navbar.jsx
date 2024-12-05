import { Bell, ClipboardList, History, House, LayoutDashboard,LogOut, Mail, Menu, ScrollText, SquarePlus, Users } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../Store/useAuthStore";
import { useState } from "react";


export default function Navbar() {
  const navigate = useNavigate();
  const { logout, user, admin, adminLogout } = useAuthStore();

  const [isMenuOpen, setIsMenuOpen] = useState(false); 

  const handleLogout = async (e) => {
    e.preventDefault();
    await logout();
    navigate("/");
  };

  const handleAdminLogout = async (e) => {
    e.preventDefault();
    await adminLogout();
    navigate("/");
  };

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };
  
  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className=" border-b border-base-300 fixed w-full top-0 z-40 backdrop-blur-lg bg-base-100/80">
      <div className="container mx-auto px-4 h-16">
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2.5 hover:opacity-80 transition-all">
            <div className="size-9 flex items-center justify-center">
              <img src="./logo.png" alt="" />
            </div>
            <h1 className="text-lg font-bold">Swift LPG</h1>
            </Link>
          </div>

          <div className="block lg:hidden">
            <button onClick={toggleMenu} className="p-2 rounded-md">
              <Menu />
              <div className="w-6 h-0.5 bg-black mb-1"></div>
              <div className="w-6 h-0.5 bg-black mb-1"></div>
              <div className="w-6 h-0.5 bg-black"></div>
            </button>
          </div>

          <div className={`hidden lg:flex items-center gap-8`}>
            <Link to={"/"} className="btn btn-sm bg-transparent border-none hover:bg-primary">
            <House className="w-4 h-4" />
            <span className="hidden sm:inline">Home</span>
            </Link>

            {!user && !admin && (
            <Link to={"/signin"} className="btn btn-sm bg-transparent border-none hover:bg-primary">
            <SquarePlus className="w-4 h-4" />
            <span className="hidden sm:inline">Sign In</span>
            </Link>
            )}

            {user && (
            <>
              <Link to={"/dashboard"} className="btn btn-sm bg-transparent border-none hover:bg-primary">
              <LayoutDashboard className="size-5" />
              <span className="hidden sm:inline">DashBoard</span>
              </Link>

              <Link to={"/customerinbox"} className="btn btn-sm bg-transparent border-none hover:bg-primary">
              <Mail className="size-5" />
              <span className="hidden sm:inline">Inbox</span>
              </Link>

              <Link to={"/booknow"} className="btn btn-sm bg-transparent border-none hover:bg-primary">
              <LayoutDashboard className="size-5" />
              <span className="hidden sm:inline">Book Now</span>
              </Link>

              <Link to={"/bookinghistory"} className="btn btn-sm bg-transparent border-none hover:bg-primary">
              <History className="size-5" />
              <span className="hidden sm:inline">History</span>
              </Link>

              <button className="flex gap-2 items-center" onClick={handleLogout}>
                <LogOut className="size-5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </>
            )}

            {admin && (
            <>
              <Link to={"/admindashboard"} className="btn btn-sm bg-transparent border-none hover:bg-primary">
              <LayoutDashboard className="size-5" />
              <span className="hidden sm:inline">DashBoard</span>
              </Link>

              <Link to={"/manageusers"} className="btn btn-sm bg-transparent border-none hover:bg-primary">
              <Users className="size-5" />
              <span className="hidden sm:inline">Customers</span>
              </Link>

              <Link to={"/bookingsrequest"} className="btn btn-sm bg-transparent border-none hover:bg-primary">
              <Bell className="size-5" />
              <span className="hidden sm:inline">Request</span>
              </Link>

              <Link to={"/notices"} className="btn btn-sm bg-transparent border-none hover:bg-primary">
              <ClipboardList className="size-5" />
              <span className="hidden sm:inline">Notices</span>
              </Link>

              <button className="flex gap-2 items-center" onClick={handleAdminLogout}>
                <LogOut className="size-5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </>
            )}
          </div>

          <div className={`lg:hidden ${isMenuOpen ? "block" : "hidden" } absolute top-16 left-0 w-full bg-base-100
            shadow-lg`}>
            <div className="flex flex-col items-center">
              <Link to="/" onClick={closeMenu} className="btn btn-sm bg-transparent border-none hover:bg-primary py-2">
              <House className="w-4 h-4" />
              <span>Home</span>
              </Link>

              {!user && !admin && (
              <Link to="/signin" onClick={closeMenu} className="btn btn-sm bg-transparent border-none hover:bg-primary py-2">
              <SquarePlus className="w-4 h-4" />
              <span>Sign In</span>
              </Link>
              )}

              {user && (
              <>
                <Link to="/dashboard" onClick={closeMenu} className="btn btn-sm bg-transparent border-none hover:bg-primary py-2">
                <LayoutDashboard className="size-5" />
                <span>Dashboard</span>
                </Link>

                <Link to="/customerinbox" onClick={closeMenu} className="btn btn-sm bg-transparent border-none hover:bg-primary py-2">
                <Mail className="size-5" />
                <span>Inbox</span>
                </Link>

                <Link to="/booknow" onClick={closeMenu} className="btn btn-sm bg-transparent border-none hover:bg-primary py-2">
                <LayoutDashboard className="size-5" />
                <span>Book Now</span>
                </Link>

                <button className="flex gap-2 items-center py-2" onClick={(e) => { handleLogout(e); closeMenu(); }} >
                  <LogOut className="size-5" />
                  <span>Logout</span>
                </button>
              </>
              )}

              {admin && (
              <>
                <Link to="/admindashboard" onClick={closeMenu} className="btn btn-sm bg-transparent border-none hover:bg-primary py-2">
                <LayoutDashboard className="size-5" />
                <span>Dashboard</span>
                </Link>

                <Link to="/manageusers" onClick={closeMenu} className="btn btn-sm bg-transparent border-none hover:bg-primary py-2">
                <Users className="size-5" />
                <span>Customers</span>
                </Link>

                <Link to="/bookingsrequest" onClick={closeMenu} className="btn btn-sm bg-transparent border-none hover:bg-primary py-2">
                <Bell className="size-5" />
                <span>Request</span>
                </Link>

                <Link to="/notices" onClick={closeMenu} className="btn btn-sm bg-transparent border-none hover:bg-primary py-2">
                <ClipboardList className="size-5" />
                <span>Notices</span>
                </Link>

                <button className="flex gap-2 items-center py-2"onClick={(e) => { handleAdminLogout(e); closeMenu(); }}>
                  <LogOut className="size-5" />
                  <span>Logout</span>
                </button>
              </>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}