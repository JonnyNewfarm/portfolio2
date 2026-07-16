"use client";

import BurgerMenu from "./BurgerMenu";
import { FaRegCopyright } from "react-icons/fa";
import WaveLinkText from "./WaveLinkText";
import VerticalTransitionLink from "./TransitionLink";

const Navbar = () => {
  const routes = [
    {
      label: "Home",
      url: "/",
      linkLabel: "Home",
      LinkToLabel: "Page",
    },
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
    {
      label: "About",
      url: "/about",
      linkLabel: "About",
      LinkToLabel: "Jonas",
    },
  ];

  return (
    <header className="fixed top-0 z-50 w-full bg-transparent px-6 py-5 text-[#1c1a17] dark:text-stone-300 lg:px-12 xl:px-16">
      <div className="flex items-center justify-between">
        {/* Mobile logo */}
        <VerticalTransitionLink
          href="/"
          transitionLabel="Home"
          className="flex items-center gap-x-2 text-xs font-black uppercase tracking-[0.09em] lg:hidden"
        >
          <FaRegCopyright size={13} />
          <span>Newfarm Studio</span>
        </VerticalTransitionLink>

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
                  <VerticalTransitionLink
                    key={route.label}
                    href={route.url}
                    transitionLabel={route.linkLabel}
                    transitionToLabel={route.LinkToLabel}
                    className="font-black"
                  >
                    <WaveLinkText text={route.label} />

                    {index < routes.length - 1 && (
                      <span aria-hidden="true">,</span>
                    )}
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
