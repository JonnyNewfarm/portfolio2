import React from "react";

const Footer = () => {
  return (
    <div
      style={{ clipPath: "polygon(0% 0, 100% 0%, 100% 100%, 0 100%)" }}
      className=" text-white relative h-[420px]    bg-[#161310]"
    >
      <div className="relative  h-[calc(100vh+420px)] -top-[100vh] bg-[#161310]  flex-col justify-start">
        <div className="h-[420px] text-[#ecebeb] p-14 sticky top-[calc(100vh-420px)]">
          <div className="w-full h-[270px] text-2xl px-5  sm:text-6xl md:text-8xl lg:text-9xl flex flex-col justify-center items-center  font-semibold text-nowrap">
            <h1 className="whitespace-normal opacity-75">Jonas Nygaard,</h1>
            <h1 className="whitespace-nowrap opacity-75">
              Designer & Developer
            </h1>
          </div>

          <div>
            <div>
              <h1 className="opacity-65">Created by:</h1>
              <h1>Jonas Nygaard</h1>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
