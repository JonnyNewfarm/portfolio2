import React from "react";
import BurgerMenu from "./BurgerMenu";
import { FaRegCopyright } from "react-icons/fa";

const Navbar = () => {
  return (
    <div className="bg-[#ececec]   font-extrabold text-[16px] text-[#1c1a17] px-20 py-3 flex items-center sticky top-0 z-50 w-full justify-between">
      <div>
        <a
          href="#home"
          className=" lg:hidden flex items-center gap-x-1 font-normal text-xl fixed left-6 top-7"
        >
          <FaRegCopyright />
          Code by Jonas
        </a>
      </div>
      <BurgerMenu />
      <div className="w-full h-full hidden lg:block">
        <div className="flex items-center justify-between">
          <div className="tracking-tighter">
            <h1 className="text-[#1c1a17] opacity-70 m-0 leading-none">
              Name:
            </h1>
            <p className="text-[#1c1a17] m-0 leading-tight">Jonas Nygaard</p>
          </div>
          <div className="tracking-tighter">
            <h1 className="text-[#1c1a17] opacity-70 m-0 leading-none">
              Occupation:
            </h1>
            <p className="text-[#1c1a17] m-0 leading-tight">
              Designer & Developer
            </p>
          </div>
          <div className="tracking-tighter">
            <h1 className="text-[#1c1a17] opacity-70 m-0 leading-none">
              Location:
            </h1>
            <p className="text-[#1c1a17] m-0 leading-tight">Oslo, Norway</p>
          </div>
          <div className="tracking-tighter">
            <h1 className="text-[#1c1a17] opacity-70 m-0 leading-none">
              Navigation:
            </h1>
            <div className="flex gap-x-1 text-[#1c1a17] m-0 leading-tight">
              <a href={"#home"}>Home,</a>
              <a href={"#my-work"}>My work,</a>
              <a href={"#contact"}>Contact</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
