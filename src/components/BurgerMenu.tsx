"use client";

import { useState } from "react";
import Burger from "./Burger";

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
      {isOpen && <Burger />}
    </>
  );
};

export default BurgerMenu;
