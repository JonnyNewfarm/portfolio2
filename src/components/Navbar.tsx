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

  return (
    <div className="bg-transparent text-[#1c1a17] dark:text-stone-300 font-extrabold text-[16px]  px-20 py-3 flex items-center fixed top-0 z-50 w-full justify-between">
      <div>
        <Link
          href="/"
          className="lg:hidden flex items-center gap-x-1 font-normal text-xl fixed left-6 top-7"
        >
          <FaRegCopyright />
          Newfarm Studio
        </Link>
      </div>

      <BurgerMenu />

      <div className="w-full h-full hidden lg:block">
        <div className="flex items-center justify-between">
          <div className="tracking-tighter">
            <h1 className=" opacity-70 m-0 leading-none">Brand:</h1>
            <p className=" m-0 leading-tight">Newfarm Studio</p>
          </div>

          <div className="tracking-tighter">
            <h1 className=" opacity-70 m-0 leading-none">Name:</h1>
            <p className=" m-0 leading-tight">Jonas Nygaard</p>
          </div>

          <div className="tracking-tighter">
            <h1 className=" opacity-70 m-0 leading-none">Occupation:</h1>
            <p className=" m-0 leading-tight">Designer & Developer</p>
          </div>

          <div className="tracking-tighter">
            <h1 className=" opacity-70 m-0 leading-none">Navigation:</h1>
            <div className="flex gap-x-1 m-0 leading-tight">
              {routes.map((route) => (
                <li style={{ listStyle: "none" }} key={route.label}>
                  <Link
                    href={route.url}
                    onClick={async (e) => {
                      e.preventDefault();

                      const isDarkMode =
                        document.documentElement.classList.contains("dark");
                      const transitionColor = isDarkMode
                        ? "#1c1a17"
                        : "#f5f5f5";

                      const overlay = document.createElement("div");
                      overlay.style.position = "fixed";
                      overlay.style.inset = "0";
                      overlay.style.background = transitionColor;
                      overlay.style.zIndex = "99999";
                      overlay.style.opacity = "0";
                      overlay.style.transition = "opacity 0.4s ease";
                      document.body.appendChild(overlay);

                      requestAnimationFrame(() => {
                        overlay.style.opacity = "1";
                      });

                      await new Promise((resolve) => setTimeout(resolve, 400));

                      router.push(route.url);

                      await new Promise((resolve) => setTimeout(resolve, 300));

                      overlay.style.opacity = "0";
                      setTimeout(() => overlay.remove(), 300);
                    }}
                  >
                    {route.label} {route.label === "About" ? "" : ","}
                  </Link>
                </li>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
