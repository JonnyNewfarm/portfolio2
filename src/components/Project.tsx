import Link from "next/link";
import React from "react";

interface ProjectProps {
  index: number; // Assuming index is a number
  title: string; // Assuming title is a string
  setModal: (modalState: { active: boolean; index: number }) => void; // Assuming setModal is a function
  link: string; // Assuming link is a string
}

const Project = ({ index, title, setModal, link }: ProjectProps) => {
  return (
    <Link
      href={link}
      onMouseEnter={() => {
        setModal({ active: true, index: index });
      }}
      onMouseLeave={() => {
        setModal({ active: false, index: index });
      }}
      id="hover-div"
      className="flex w-full transition-all py ease-in-out px-10 sm:py-16 hover:opacity-[0.4] cursor-pointer items-center justify-between border-t-[1px] border-black/50"
    >
      <h1 className="text-xl text-nowrap font-semibold transition-all ease-in-out">
        {title}
      </h1>
      <p className="transition-all text-nowrap ease-in-out">
        Design & Development
      </p>
    </Link>
  );
};

export default Project;
