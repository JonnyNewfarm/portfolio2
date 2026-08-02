"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import BurgerMenu from "./BurgerMenu";
import TextReveal from "./TextReveal";

const routes = [
  {
    label: "Index",
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
];

const Navbar = () => {
  const pathname = usePathname();
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const updateThemeState = () => {
      setIsDark(document.documentElement.classList.contains("dark"));
    };

    updateThemeState();

    const observer = new MutationObserver(updateThemeState);

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => {
      observer.disconnect();
    };
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
    <header
      className="
        fixed
        top-0
        z-50
        w-full
        bg-transparent
        px-6
        py-5
        text-[#211f1e]
        dark:text-[#e7e3dd]
        lg:px-12
        xl:px-16
      "
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-x-5 lg:hidden">
          <Link
            href="/"
            className="text-md font-semibold uppercase tracking-[0.09em]"
          >
            <TextReveal
              as="span"
              mode="words"
              viewport={false}
              delay={0.08}
              stagger={0.04}
              duration={0.8}
            >
              Newfarm Studio
            </TextReveal>
          </Link>

          <TextReveal
            as="div"
            mode="words"
            viewport={false}
            delay={0.16}
            stagger={0.04}
            duration={0.8}
            className="
              flex
              items-center
              gap-x-1
              text-md
              font-semibold
              uppercase
              tracking-[0.08em]
            "
          >
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
          </TextReveal>
        </div>

        <div className="lg:hidden">
          <BurgerMenu />
        </div>

        <div className="hidden w-full lg:block">
          <div className="flex w-full items-start justify-between">
            <div className="flex items-start gap-x-14 xl:gap-x-34">
              <TextReveal
                as="p"
                mode="words"
                viewport={false}
                delay={0.08}
                stagger={0.035}
                duration={0.85}
                className="
                  text-lg
                  font-semibold
                  uppercase
                  tracking-[0.04em]
                  xl:text-xl
                "
              >
                name / Jonas Nygaard
              </TextReveal>

              <TextReveal
                as="p"
                mode="words"
                viewport={false}
                delay={0.16}
                stagger={0.035}
                duration={0.85}
                className="
                  text-lg
                  font-semibold
                  uppercase
                  tracking-[0.04em]
                  xl:text-xl
                "
              >
                designer / developer
              </TextReveal>

              <TextReveal
                as="div"
                mode="words"
                viewport={false}
                delay={0.24}
                stagger={0.035}
                duration={0.85}
                className="
                  flex
                  items-center
                  gap-x-1
                  text-lg
                  font-semibold
                  uppercase
                  tracking-[0.04em]
                  xl:text-xl
                "
              >
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
              </TextReveal>
            </div>

            <nav
              className="
                flex
                flex-wrap
                justify-end
                gap-x-12
                gap-y-1
                text-right
                text-2xl
                uppercase
                tracking-[0.04em]
                xl:text-3xl
              "
            >
              {routes.map((route, index) => {
                const isActive = isRouteActive(route.url);

                return (
                  <Link
                    key={route.label}
                    href={route.url}
                    aria-current={isActive ? "page" : undefined}
                    className={`group relative flex items-center font-semibold transition-opacity duration-200 ${
                      isActive ? "opacity-100" : "opacity-65 hover:opacity-100"
                    }`}
                  >
                    <TextReveal
                      as="span"
                      mode="words"
                      viewport={false}
                      delay={0.3 + index * 0.08}
                      stagger={0.04}
                      duration={0.9}
                    >
                      {route.label}
                    </TextReveal>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
