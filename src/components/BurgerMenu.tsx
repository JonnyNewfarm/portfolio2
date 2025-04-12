"use client";

import { useState } from "react";
import Burger from "./Burger";

const BurgerMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="fixed text-white right-0 mr-5  flex items-center justify-center lg:hidden cursor-pointer z-50"
      >
        <div className="flex flex-col justify-between items-center w-6 h-6">
          <span
            className={`block w-8 h-1 bg-white transition-transform duration-300 ${
              isOpen ? "rotate-45 absolute " : ""
            }`}
          />

          <span
            className={`block w-8 h-1 bg-white transition-transform duration-300 ${
              isOpen ? "-rotate-45 absolute " : ""
            }`}
          />
        </div>
      </div>
      {isOpen && <Burger />}
    </>
  );
};

export default BurgerMenu;
