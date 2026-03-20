"use client";

import BurgerMenu from "./BurgerMenu";
import { FaRegCopyright } from "react-icons/fa";
import Link from "next/link";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const router = useRouter();

  const routes: { label: string; url: string }[] = [
    { label: "Home", url: "/" },
    { label: "My Work", url: "/projects" },
    { label: "Contact", url: "/contact" },
    { label: "About", url: "/about" },
  ];

  const handleRouteTransition = async (
    e: React.MouseEvent<HTMLAnchorElement>,
    url: string,
  ) => {
    e.preventDefault();

    const isDarkMode = document.documentElement.classList.contains("dark");
    const transitionColor = isDarkMode ? "#1c1a17" : "#f5f5f5";

    const overlay = document.createElement("div");
    overlay.style.position = "fixed";
    overlay.style.inset = "0";
    overlay.style.background = transitionColor;
    overlay.style.zIndex = "99999";
    overlay.style.opacity = "0";
    overlay.style.pointerEvents = "none";
    overlay.style.transition = "opacity 0.4s ease";
    document.body.appendChild(overlay);

    requestAnimationFrame(() => {
      overlay.style.opacity = "1";
    });

    await new Promise((resolve) => setTimeout(resolve, 400));

    router.push(url);

    await new Promise((resolve) => setTimeout(resolve, 300));

    overlay.style.opacity = "0";
    setTimeout(() => overlay.remove(), 300);
  };

  return (
    <header className="fixed top-0 z-50 w-full bg-transparent px-6 py-5 text-[#1c1a17] dark:text-stone-300 lg:px-12 xl:px-16">
      <div className="flex items-center justify-between">
        {/* Mobile logo */}
        <Link
          href="/"
          className="flex items-center gap-x-2 text-xs uppercase tracking-[0.18em] lg:hidden"
        >
          <FaRegCopyright size={13} />
          <span>Newfarm Studio</span>
        </Link>

        {/* Mobile menu */}
        <div className="lg:hidden">
          <BurgerMenu />
        </div>

        {/* Desktop navbar */}
        <div className="hidden w-full lg:block">
          <div className="grid grid-cols-4 items-start gap-8 pb-4 dark:border-stone-300/10">
            <div>
              <p className="mb-1 text-[10px] uppercase tracking-[0.22em] opacity-45">
                Studio
              </p>
              <div className="flex items-center font-semibold gap-2 text-sm uppercase tracking-[0.08em]">
                <FaRegCopyright size={12} />
                <span>Newfarm Studio</span>
              </div>
            </div>

            <div>
              <p className="mb-1 text-[10px] uppercase tracking-[0.22em] opacity-45">
                Name
              </p>
              <p className="text-sm uppercase font-semibold tracking-[0.08em]">
                Jonas Nygaard
              </p>
            </div>

            <div>
              <p className="mb-1 text-[10px] uppercase tracking-[0.22em] opacity-45">
                Occupation
              </p>
              <p className="text-sm uppercase font-semibold tracking-[0.08em]">
                Designer & Developer
              </p>
            </div>

            <div>
              <p className="mb-1 text-[10px] uppercase tracking-[0.22em] opacity-45">
                Navigation
              </p>
              <nav className="flex flex-wrap gap-x-4 gap-y-1 text-sm uppercase tracking-[0.08em]">
                {routes.map((route, index) => (
                  <Link
                    key={route.label}
                    href={route.url}
                    onClick={(e) => handleRouteTransition(e, route.url)}
                    className=" font-semibold hover:scale-105 transition-transform ease-in-out"
                  >
                    {route.label}
                    {index < routes.length - 1 ? "," : ""}
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
