import Image from "next/image";
import React from "react";

interface MyProjectCardProps {
  color: string;
  title: string;
  src: string;
  link: string;
}

const MyProjectCard = ({ color, title, src, link }: MyProjectCardProps) => {
  return (
    <div>
      <div className="border-b-[1px] -mt-14 relative border-b-black/50 flex flex-col justify-center">
        <a
          href={link}
          className="px-6 py-4 w-full h-full"
          style={{ background: color }}
        >
          <div className="relative max-w-[600px] mx-auto aspect-[4/3]">
            <Image
              fill
              className="object-contain"
              alt="image"
              src={`/projects/${src}`}
            />
          </div>
        </a>
        <h1 className="text-black text-xl py-4 font-semibold">{title}</h1>
      </div>

      <p className="mt-4">Design & Development</p>
    </div>
  );
};

export default MyProjectCard;
