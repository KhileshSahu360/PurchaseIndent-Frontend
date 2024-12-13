import React from "react";
import logo from "../assets/logo.png";
import { NavLink } from "react-router-dom";

const Header = () => {
  return (
    <div className="flex justify-between items-center md:px-8 lg:px-6 px-4 py-4 border shadow-sm">
      <div>
        <img src={logo} alt="" className="h-11 w-25" />
      </div>
      <nav>
        <ul className="flex gap-10">
          <li>
            <NavLink to={'/'} className={({isActive}) => `${isActive? ' text-red-400' : 'text-black'}`}>Add Product</NavLink>
          </li>
          <li>
            <NavLink to={'/displayProduct'} className={({isActive}) => `${isActive? ' text-red-400' : 'text-black'}`}>Display Product</NavLink>
          </li>
          <li>
            <NavLink to={'/addPredefine'} className={({isActive}) => `${isActive? ' text-red-400' : 'text-black'}`}>Admin</NavLink>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Header;
