import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { logoutUser, setUser } from "@/redux/authSlice";
import { LogOut, User2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { CiSearch } from "react-icons/ci";
import { FiMenu } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

const Navbar = () => {
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const [menuOpen, setMenuOpen] = useState(false);

  const logoutHandler = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('auth_token');
    dispatch(logoutUser());
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      dispatch(setUser(JSON.parse(storedUser)));
    }
  }, [dispatch]);

  return (
    <div className="flex items-center justify-between h-20 shadow-md px-6 bg-white z-50">
      {/* Logo Section */}
      <div className="flex items-center">
        <Link to="/"><h1 className="text-2xl font-bold font-serif text-pink-600 mx-10">Dribbble</h1></Link>
      </div>

      {/* Hamburger Menu */}
      <div className="block md:hidden">
        <FiMenu
          className="text-2xl cursor-pointer"
          onClick={() => setMenuOpen(!menuOpen)}
        />
      </div>

      {/* Menu on Small Devices */}
      <div
        className={`absolute top-20 left-0 w-full bg-white ${menuOpen ? "block" : "hidden"} md:hidden`}
      >
        <ul className="flex flex-col items-center gap-4 font-sans font-medium py-4">
          <li className="text-md cursor-pointer hover:text-rose-400">Explore</li>
          <li className="text-md cursor-pointer hover:text-rose-400">About</li>
          <li className="text-md cursor-pointer hover:text-rose-400">Blog</li>
          <li className="text-md cursor-pointer hover:text-rose-400">Contact</li>
          {/* If user is logged in, show View Profile and Logout */}
          {user && (
            <>
              <li>
                <Link to={`/profile/${user.id}`} className="flex items-center gap-1 text-black">
                  <User2 /> View Profile
                </Link>
              </li>
              <li>
                <button
                  onClick={logoutHandler}
                  className="flex items-center gap-1 text-black outline-none"
                  aria-label="Logout"
                >
                  <LogOut /> Logout
                </button>
              </li>
            </>
          )}
          {/* If user is logged out, show Sign Up and Login */}
          {!user && (
            <>
              <li>
                <Link to="/signup" className="text-black">Sign Up</Link>
              </li>
              <li>
                <Link to="/login" className="text-black">Login</Link>
              </li>
            </>
          )}
        </ul>
      </div>

      {/* Navigation Links for Large Devices */}
      <div className="hidden md:flex items-center gap-6">
        <ul className="flex gap-6 font-sans font-medium">
          <li className="text-md cursor-pointer hover:text-rose-400">Explore</li>
          <li className="text-md cursor-pointer hover:text-rose-400">About</li>
          <li className="text-md cursor-pointer hover:text-rose-400">Blog</li>
          <li className="text-md cursor-pointer hover:text-rose-400">Contact</li>
        </ul>
      </div>

      {/* Search Bar for Large Devices */}
      <div className="hidden md:flex items-center bg-gray-100 rounded-3xl p-2 px-4 border border-rose-200 w-[300px]">
        <input
          type="text"
          placeholder="Search on Dribbble"
          className="bg-gray-100 outline-none px-3 py-1 text-sm w-full placeholder-gray-500"
        />
        <CiSearch className="text-xl font-bold cursor-pointer text-gray-500" />
      </div>

      {/* Authentication Buttons for Large Devices */}
      <div className="hidden md:flex items-center gap-3">
        {!user ? (
          <>
            <Link to="/signup">
              <button className="font-medium text-md p-2 px-4 hover:bg-gray-100 rounded-3xl">
                Sign up
              </button>
            </Link>
            <Link to="/login">
              <button className="bg-black p-2 text-white px-4 rounded-3xl hover:bg-white hover:text-black">
                Login
              </button>
            </Link>
          </>
        ) : (
          <div>
            <Popover>
              <PopoverTrigger asChild>
                <Avatar className="cursor-pointer w-12 h-12">
                  <AvatarImage src={user.avatar} alt="User Avatar" />
                </Avatar>
              </PopoverTrigger>
              <PopoverContent className="w-72">
                <div className="flex items-center gap-5">
                  <Avatar>
                    <AvatarImage src={user.avatar} alt="User Avatar" />
                  </Avatar>
                  <div>
                    <p className="text-black font-semibold">{user.username}</p>
                    <p className="text-gray-800 text-sm">{user.email}</p>
                  </div>
                </div>
                <div className="flex gap-5 mt-4">
                  <Link to={`/profile/${user.id}`} className="flex items-center gap-1 text-black">
                    <User2 />
                    View Profile
                  </Link>
                  <button
                    onClick={logoutHandler}
                    className="flex items-center gap-1 text-black outline-none"
                    aria-label="Logout"
                  >
                    <LogOut />
                    Logout
                  </button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
