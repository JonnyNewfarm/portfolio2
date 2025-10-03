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
    <div className="bg-[#ececec] font-extrabold text-[16px] text-[#1c1a17] px-20 py-3 flex items-center sticky top-0 z-50 w-full justify-between">
      <div className="flex gap-x-1 text-[#1c1a17] m-0 leading-tight"></div>

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
            <h1 className="text-[#1c1a17] opacity-70 m-0 leading-none">
              Brand:
            </h1>
            <p className="text-[#1c1a17] m-0 leading-tight">Newfarm Studio</p>
          </div>

          <div className="tracking-tighter">
            <h1 className="text-[#1c1a17] opacity-70 m-0 leading-none">
              Name:
            </h1>
            <p className="text-[#1c1a17] m-0 leading-tight">Jonas Nygaard</p>
          </div>

          <div className="tracking-tighter">
            <h1 className="text-[#1c1a17] opacity-70 m-0 leading-none">
              Occupation:
            </h1>
            <p className="text-[#1c1a17] m-0 leading-tight">
              Designer & Developer
            </p>
          </div>

          <div className="tracking-tighter">
            <h1 className="text-[#1c1a17] opacity-70 m-0 leading-none">
              Navigation:
            </h1>
            <div className="flex gap-x-1 text-[#1c1a17] m-0 leading-tight">
              {routes.map((route) => (
                <li style={{ listStyle: "none" }} key={route.label}>
                  <Link
                    href={route.url}
                    onClick={(e) => {
                      e.preventDefault();

                      if (document.startViewTransition) {
                        // ✅ TS knows startViewTransition returns a ViewTransition
                        document.startViewTransition(() => {
                          router.push(route.url);
                        });
                      } else {
                        router.push(route.url);
                      }
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
