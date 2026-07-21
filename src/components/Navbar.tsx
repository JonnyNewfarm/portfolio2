"use client";

import Link from "next/link";
import { FaRegCopyright } from "react-icons/fa";

import BurgerMenu from "./BurgerMenu";
import WaveLinkText from "./WaveLinkText";

const Navbar = () => {
  const routes = [
    {
      label: "Home",
      url: "/",
    },
    {
      label: "My Work",
      url: "/projects",
    },
    {
      label: "Contact",
      url: "/contact",
    },
    {
      label: "About",
      url: "/about",
    },
  ];

  return (
    <header className="fixed top-0 z-50 w-full bg-transparent px-6 py-5 text-[#1c1a17] dark:text-stone-300 lg:px-12 xl:px-16">
      <div className="flex items-center justify-between">
        {/* Mobile logo */}
        <Link
          href="/"
          className="flex items-center gap-x-2 text-xs font-black uppercase tracking-[0.09em] lg:hidden"
        >
          <FaRegCopyright size={13} />
          <span>Newfarm Studio</span>
        </Link>

        {/* Mobile burger */}
        <div className="lg:hidden">
          <BurgerMenu />
        </div>

        {/* Desktop navbar */}
        <div className="hidden w-full lg:block">
          <div className="flex w-full items-start justify-between">
            {/* Name – left */}
            <div>
              <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.22em] opacity-80">
                Name:
              </p>

              <p className="text-sm font-black uppercase tracking-[0.08em]">
                Jonas Nygaard
              </p>
            </div>

            {/* Navigation – right */}
            <div className="text-right">
              <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.22em] opacity-80">
                Navigation:
              </p>

              <nav className="flex flex-wrap justify-end gap-x-3 gap-y-1 text-xl uppercase tracking-[0.08em]">
                {routes.map((route, index) => (
                  <Link
                    key={route.label}
                    href={route.url}
                    className="font-black"
                  >
                    <WaveLinkText text={route.label} />

                    {index < routes.length - 1 && (
                      <span aria-hidden="true">,</span>
                    )}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
