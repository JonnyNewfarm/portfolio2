"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import BurgerMenu from "./BurgerMenu";
import WaveLinkText from "./WaveLinkText";

const Navbar = () => {
  const pathname = usePathname();
  const [isDark, setIsDark] = useState(false);

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

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  const setTheme = (theme: "light" | "dark") => {
    const shouldBeDark = theme === "dark";

    document.documentElement.classList.toggle("dark", shouldBeDark);
    setIsDark(shouldBeDark);
  };

  const isRouteActive = (url: string) => {
    if (url === "/") {
      return pathname === "/";
    }

    if (url === "/projects") {
      return (
        pathname === "/projects" ||
        pathname.startsWith("/projects/") ||
        pathname.startsWith("/project/")
      );
    }

    return pathname === url || pathname.startsWith(`${url}/`);
  };

  return (
    <header className="fixed top-0 z-50 w-full bg-transparent px-6 py-5 text-[#1c1a17] dark:text-stone-300 lg:px-12 xl:px-16">
      <div className="flex items-center justify-between">
        {/* Mobile logo + theme */}
        <div className="flex items-center gap-x-5 lg:hidden">
          <Link
            href="/"
            className="text-[10px] font-black uppercase tracking-[0.09em]"
          >
            Newfarm Studio
          </Link>

          <div className="flex items-center gap-x-1 text-[10px] font-black uppercase tracking-[0.08em]">
            <button
              type="button"
              onClick={() => setTheme("light")}
              aria-pressed={!isDark}
              className={`cursor-pointer uppercase transition-opacity duration-200 ${
                !isDark ? "opacity-100" : "opacity-50 hover:opacity-100"
              }`}
            >
              Light
            </button>

            <span className="opacity-50">/</span>

            <button
              type="button"
              onClick={() => setTheme("dark")}
              aria-pressed={isDark}
              className={`cursor-pointer uppercase transition-opacity duration-200 ${
                isDark ? "opacity-100" : "opacity-50 hover:opacity-100"
              }`}
            >
              Dark
            </button>
          </div>
        </div>

        {/* Mobile burger */}
        <div className="lg:hidden">
          <BurgerMenu />
        </div>

        {/* Desktop navbar */}
        <div className="hidden w-full lg:block">
          <div className="flex w-full items-start justify-between">
            {/* Name + theme – left */}
            <div className="flex items-start gap-x-18">
              <div>
                <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.22em] opacity-80">
                  Name:
                </p>

                <p className="text-sm font-black uppercase tracking-[0.08em]">
                  Jonas Nygaard
                </p>
              </div>

              <div>
                <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.22em] opacity-80">
                  Theme:
                </p>

                <div className="flex items-center gap-x-1 text-sm font-black uppercase tracking-[0.08em]">
                  <button
                    type="button"
                    onClick={() => setTheme("light")}
                    aria-pressed={!isDark}
                    className={`cursor-pointer uppercase transition-opacity duration-200 ${
                      !isDark ? "opacity-100" : "opacity-65 hover:opacity-100"
                    }`}
                  >
                    Light
                  </button>

                  <span>/</span>

                  <button
                    type="button"
                    onClick={() => setTheme("dark")}
                    aria-pressed={isDark}
                    className={`cursor-pointer uppercase transition-opacity duration-200 ${
                      isDark ? "opacity-100" : "opacity-65 hover:opacity-100"
                    }`}
                  >
                    Dark
                  </button>
                </div>
              </div>
            </div>

            {/* Navigation – right */}
            <div className="text-right">
              <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.22em] opacity-80">
                Navigation:
              </p>

              <nav className="flex flex-wrap justify-end gap-x-3 gap-y-1 text-xl uppercase tracking-[0.08em]">
                {routes.map((route) => {
                  const isActive = isRouteActive(route.url);

                  return (
                    <Link
                      key={route.label}
                      href={route.url}
                      aria-current={isActive ? "page" : undefined}
                      className={`group relative flex items-center font-black transition-opacity duration-200 ${
                        isActive
                          ? "opacity-100"
                          : "opacity-65 hover:opacity-100"
                      }`}
                    >
                      <WaveLinkText text={route.label} />
                    </Link>
                  );
                })}
              </nav>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
