"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";

const Footer = () => {
  const pathname = usePathname();

  const [time, setTime] = useState("");

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString());
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);
  if (pathname === "/") return null;

  return (
    <div
      style={{ clipPath: "polygon(0% 0, 100% 0%, 100% 100%, 0 100%)" }}
      className=" relative h-[420px] bg-[#ececec] text-stone-800 "
    >
      <div className="relative h-[calc(100vh+420px)] -top-[100vh] flex-col justify-start">
        <div className="h-[420px]  p-14 sticky top-[calc(100vh-420px)] flex flex-col justify-between">
          <div className="w-full h-full flex flex-col justify-between">
            <div className="flex  justify-between">
              <div className="">
                <div className="flex gap-x-10">
                  <div className="">
                    <div className="flex flex-col justify-start text-2xl font-light">
                      <h1 className="opacity-70">Navigation</h1>
                      <Link href={"/"}>Home</Link>
                      <Link href={"/projects"}>My Work</Link>
                      <Link href={"/contact"}>Contact</Link>
                      <Link href={"/about"}>About</Link>
                    </div>
                  </div>
                  <div></div>
                </div>
              </div>
            </div>

            <div className="flex justify-between">
              <div>
                <h1 className="opacity-65">Created by:</h1>
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex underline items-center gap-x-1"
                  href="https://www.jonasnygaard.com/"
                >
                  Newfarm Studio
                </a>
              </div>

              <div className="hidden md:block">
                <h1 className="opacity-65">Email:</h1>
                <h1>jonasnygaard96@gmail.com</h1>
              </div>

              <div className="hidden md:block">
                <h1 className="opacity-65">My time:</h1>
                <h1>{time}</h1>
              </div>

              <div>
                <h1 className="opacity-65">Location:</h1>
                <h1>Oslo, Norway</h1>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
