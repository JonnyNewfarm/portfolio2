import Link from "next/link";
import React from "react";

const Burger = () => {
  return (
    <div className="z-40 fixed right-0 top-0 h-[100vh] p-20 bg-[#1c1a17] text-white">
      <div className="flex justify-center items-center h-full">
        <div className="flex flex-col text-2xl text-white gap-3">
          <div className="flex gap-y-6 flex-col">
            <h1 className="text-3xl font-semibold">Navigation</h1>
            <Link className="hover-underline" href={"/"}>
              Home
            </Link>
            <Link className="hover-underline" href={"/projects"}>
              My work
            </Link>

            <Link className="hover-underline" href={"/contact"}>
              Contact
            </Link>
            <Link href={"/about"}>About</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Burger;
