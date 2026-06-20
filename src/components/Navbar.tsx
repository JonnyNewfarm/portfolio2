"use client";

import BurgerMenu from "./BurgerMenu";
import { FaRegCopyright } from "react-icons/fa";
import Link from "next/link";
import WaveLinkText from "./WaveLinkText";
import VerticalTransitionLink from "./TransitionLink";

const Navbar = () => {
  const routes: {
    label: string;
    url: string;
    linkLabel: string;
    LinkToLabel: string;
  }[] = [
    { label: "Home", url: "/", linkLabel: "Home", LinkToLabel: "Page" },
    {
      label: "My Work",
      url: "/projects",
      linkLabel: "Project",
      LinkToLabel: "Gallery",
    },
    {
      label: "Contact",
      url: "/contact",
      linkLabel: "Contact",
      LinkToLabel: "Details",
    },
    { label: "About", url: "/about", linkLabel: "About", LinkToLabel: "Jonas" },
  ];

  return (
    <header className="fixed top-0 z-50 w-full bg-transparent px-6 py-5 text-[#1c1a17] dark:text-stone-300 lg:px-12 xl:px-16">
      <div className="flex items-center justify-between">
        <VerticalTransitionLink
          href="/"
          transitionLabel="Home"
          className="flex items-center font-black gap-x-2 text-xs uppercase tracking-[0.09em] lg:hidden"
        >
          <FaRegCopyright size={13} />
          <span>Newfarm Studio</span>
        </VerticalTransitionLink>

        <div className="lg:hidden">
          <BurgerMenu />
        </div>

        <div className="hidden w-full lg:block">
          <div className="grid grid-cols-4 items-start gap-8 pb-4 dark:border-stone-300/10">
            <div>
              <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.22em] opacity-80">
                Studio:
              </p>

              <VerticalTransitionLink
                href="/"
                transitionLabel="Home"
                className="flex items-center font-black gap-2 text-sm uppercase tracking-[0.08em]"
              >
                <FaRegCopyright size={12} />
                <span>Newfarm Studio</span>
              </VerticalTransitionLink>
            </div>

            <div>
              <p className="mb-1 text-[10px] uppercase font-semibold tracking-[0.22em] opacity-80">
                Name:
              </p>
              <p className="text-sm uppercase font-black tracking-[0.08em]">
                Jonas Nygaard
              </p>
            </div>

            <div>
              <p className="mb-1 text-[10px] uppercase font-semibold tracking-[0.22em] opacity-80">
                Occupation:
              </p>
              <p className="text-sm uppercase font-black tracking-[0.08em]">
                Designer & Developer
              </p>
            </div>

            <div>
              <p className="mb-1 text-[10px] uppercase font-semibold tracking-[0.22em] opacity-80">
                Navigation:
              </p>

              <nav className="flex flex-wrap gap-x-2 gap-y-1 text-sm uppercase tracking-[0.08em]">
                {routes.map((route, index) => (
                  <VerticalTransitionLink
                    key={route.label}
                    href={route.url}
                    transitionLabel={route.linkLabel}
                    transitionToLabel={route.LinkToLabel}
                    className="font-black"
                  >
                    <WaveLinkText text={route.label} />
                    {index < routes.length - 1 ? "," : ""}
                  </VerticalTransitionLink>
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
