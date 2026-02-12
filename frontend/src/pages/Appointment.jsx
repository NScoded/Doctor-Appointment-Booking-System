import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import logo from "../assets/images/horilogo.png";

const Header = () => {
  const navigate = useNavigate();

  const isLoggedIn = sessionStorage.getItem("isLoggedIn") === "true";
  const user = isLoggedIn ? JSON.parse(sessionStorage.getItem("user")) : null;

  const handleLogoClick = () => {
    if (!isLoggedIn) {
      navigate("/login");
    } else if (user?.role === "admin") {
      navigate("/admin");
    } else if (user?.role === "doctor") {
      navigate("/doctor-profile");
    } else if (user?.role === "patient") {
      navigate("/patient-profile");
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="flex h-20 w-full items-center px-10 bg-[#3F8EFC]">
      <div className="flex-1 flex items-center">
        <img
          src={logo}
          alt="Samadhan Logo"
          className="w-40 border-white border-2 cursor-pointer"
          onClick={handleLogoClick}
        />
      </div>

      <nav className="flex-1 flex justify-end">
        <ul className="flex space-x-6 items-center">
          <li>
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive
                  ? "text-lg text-white font-bold border-b-2 border-white"
                  : "text-lg text-white/80 hover:text-white font-semibold"
              }
            >
              Home
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/FindADoctor"
              className={({ isActive }) =>
                isActive
                  ? "text-lg text-white font-bold border-b-2 border-white"
                  : "text-lg text-white/80 hover:text-white font-semibold"
              }
            >
              FindaDoctor
            </NavLink>
          </li>
          <li>
            <NavLink
              to={
                !isLoggedIn
                  ? "/login"
                  : user?.role === "admin"
                  ? "/admin"
                  : user?.role === "doctor"
                  ? "/doctor-profile"
                  : "/patient-profile"
              }
              className={({ isActive }) =>
                isActive ? "text-white" : "text-white/80 hover:text-white"
              }
            >
              <i className="fa-regular text-3xl fa-circle-user"></i>
            </NavLink>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Header;
