import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { LogOut, MessageSquare, Settings, User } from "lucide-react";

const Navbar = () => {
  const { logout, authUser } = useAuthStore();

  return (
    <header
      className="bg-base-100 border-b border-base-300 fixed w-full top-0 z-40 
    backdrop-blur-lg bg-base-100/80"
    >
      <div className="container mx-auto px-4 h-16">
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center justify-center gap-2.5 hover:opacity-80 transition-all">
              <div className="size-9 rounded-full bg-primary/10 flex items-center justify-center">
                <img
                  src="https://w0.peakpx.com/wallpaper/1014/777/HD-wallpaper-avengers-2-age-of-ultron-black-widow-captain-america-hulk-iron-man-marvel-thor-war-thumbnail.jpg"
                  alt="Avengers Logo"
                  className="w-full h-full"
                />
              </div>

              <h1 className="text-lg font-bold">Avengers Ke Sath Baat-Cheet App </h1>
              
            </Link>
          </div>

          <div className="flex items-center gap-2">


            {authUser && (
              <>
                <Link to={"/profile"} className={`btn btn-sm gap-2`}>
                  <User className="size-5" />
                  <span className="hidden sm:inline">Profile</span>
                </Link>

                <button className="flex gap-2 items-center" onClick={logout}>
                  <LogOut className="size-5" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
export default Navbar;
