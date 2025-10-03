"use client";
import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const Footer = () => {
  const [time, setTime] = useState("");
  const pathname = usePathname();

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString());
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  // hide footer on homepage
  if (pathname === "/") {
    return null;
  }

  return (
    <div
      style={{ clipPath: "polygon(0% 0, 100% 0%, 100% 100%, 0 100%)" }}
      className="relative h-[420px]"
    >
      <div className="relative h-[calc(100vh+420px)] -top-[100vh] bg-[#ececec] flex-col justify-start">
        <div className="h-[420px] text-[#161310] p-14 sticky top-[calc(100vh-420px)]">
          <div className="h-full w-full flex justify-between pt-10">
            <div>
              <h1 className="opacity-75 font-semibold">Socials:</h1>
              <h1>
                <a href="https://github.com/JonnyNewfarm">Github</a>
              </h1>
              <h1>
                <a href="https://www.linkedin.com/in/jonas-nygaard-0aa767366/">
                  LinkedIn
                </a>
              </h1>

              <h1 className="opacity-75 mt-4 font-semibold">Contact:</h1>
              <h1>jonasnygaard96@gmail.com</h1>
              <h1>+47 48 26 30 11</h1>
            </div>
          </div>

          <div className="flex justify-between w-full">
            <div>
              <h1 className="opacity-75 font-semibold">Code by:</h1>
              <h1>Newfarm Studio</h1>
            </div>

            <div className="hidden md:block">
              <h1 className="opacity-75 font-semibold">Design by:</h1>
              <h1>Newfarm Studio</h1>
            </div>

            <div>
              <h1 className="opacity-75 font-semibold">My time:</h1>
              <h1>{time}</h1>
            </div>

            <div className="hidden md:block">
              <h1 className="opacity-75 font-semibold">Location:</h1>
              <h1>Oslo, Norway</h1>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
