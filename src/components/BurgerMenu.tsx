"use client";

import { useState } from "react";
import Link from "next/link";

const BurgerMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className=" right-0 mr-5 absolute top-[19px] flex items-center justify-center lg:hidden cursor-pointer z-50"
      >
        <span
          className={`text-lg font-normal px-2 py-2 rounded flex items-center gap-2 ${
            isOpen ? "text-white" : "text-[#1c1a17]"
          }`}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-black inline-block" />
          {isOpen ? "Close" : "Menu"}
        </span>
      </div>
      {isOpen && (
        <div className="z-40 fixed right-0 top-0 h-[100vh] p-20 bg-[#1c1a17] text-white">
          <div className="flex justify-center items-center h-full">
            <div className="flex flex-col text-2xl text-white gap-3">
              <div className="flex gap-y-6 flex-col">
                <h1 className="text-3xl font-semibold">Navigation</h1>
                <Link
                  onClick={() => setIsOpen(false)}
                  className="hover-underline"
                  href={"/"}
                >
                  Home
                </Link>
                <Link
                  onClick={() => setIsOpen(false)}
                  className="hover-underline"
                  href={"/projects"}
                >
                  My work
                </Link>

                <Link
                  onClick={() => setIsOpen(false)}
                  className="hover-underline"
                  href={"/contact"}
                >
                  Contact
                </Link>
                <Link onClick={() => setIsOpen(false)} href={"/about"}>
                  About
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BurgerMenu;
