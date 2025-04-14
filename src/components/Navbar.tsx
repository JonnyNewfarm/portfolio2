import Link from "next/link";
import React from "react";
import BurgerMenu from "./BurgerMenu";

const Navbar = () => {
  return (
    <div className="bg-[#ecebeb]  font-extrabold text-[16px] text-[#161310] px-20 py-3 flex items-center sticky top-0 z-50 w-full justify-between">
      <BurgerMenu />
      <div className="w-full h-full hidden lg:block">
        <div className="flex items-center justify-between">
          <div className="tracking-tighter">
            <h1 className="text-[#161310] opacity-70 m-0 leading-none">
              Name:
            </h1>
            <p className="text-[#161310] m-0 leading-tight">Jonas Nygaard</p>
          </div>
          <div className="tracking-tighter">
            <h1 className="text-[#161310] opacity-70 m-0 leading-none">
              Occupation:
            </h1>
            <p className="text-[#161310] m-0 leading-tight">
              Designer & Developer
            </p>
          </div>
          <div className="tracking-tighter">
            <h1 className="text-[#161310] opacity-70 m-0 leading-none">
              Location:
            </h1>
            <p className="text-[#161310] m-0 leading-tight">Oslo, Norway</p>
          </div>
          <div className="tracking-tighter">
            <h1 className="text-[#161310] opacity-70 m-0 leading-none">
              Naviation:
            </h1>
            <div className="flex gap-x-1 text-[#161310] m-0 leading-tight">
              <Link href={""}>Home,</Link>
              <Link href={""}>My work,</Link>
              <Link href={""}>Contact</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
