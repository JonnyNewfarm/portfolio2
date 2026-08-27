"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const links = [
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
];

const MENU_EASE = [0.22, 1, 0.36, 1] as const;

const BurgerMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  const menuRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setIsOpen((previous) => !previous)}
        aria-label={isOpen ? "Close menu" : "Open menu"}
        aria-expanded={isOpen}
        className={`
          relative
          z-[60]
          flex
          cursor-pointer
          items-center
          gap-3
          text-md
          font-semibold
          uppercase
          tracking-[0.2em]
          transition-colors
          duration-300
          ${isOpen ? "text-white" : "text-[#1c1a17] dark:text-stone-300"}
        `}
      >
        <motion.span
          initial={false}
          animate={{
            scale: isOpen ? 1.4 : 1,
          }}
          transition={{
            duration: 0.35,
            ease: MENU_EASE,
          }}
          className={`
            -mt-1
            h-1
            w-1
            rounded-full
            ${isOpen ? "bg-white" : "bg-black dark:bg-white"}
          `}
        />

        <span className="relative block overflow-hidden">
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={isOpen ? "close" : "menu"}
              initial={{
                y: 10,
                opacity: 0,
              }}
              animate={{
                y: 0,
                opacity: 1,
              }}
              exit={{
                y: -10,
                opacity: 0,
              }}
              transition={{
                duration: 0.3,
                ease: MENU_EASE,
              }}
              className="block"
            >
              {isOpen ? "Close" : "Menu"}
            </motion.span>
          </AnimatePresence>
        </span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              exit={{
                opacity: 0,
              }}
              transition={{
                duration: 0.3,
              }}
              className="
                fixed
                inset-0
                z-40
                bg-black/30
                backdrop-blur-sm
              "
            />

            <motion.div
              ref={menuRef}
              initial={{
                clipPath: "inset(0 0 100% 0)",
              }}
              animate={{
                clipPath: "inset(0 0 0% 0)",
              }}
              exit={{
                clipPath: "inset(0 0 100% 0)",
              }}
              transition={{
                duration: 0.65,
                ease: MENU_EASE,
              }}
              className="
                fixed
                inset-0
                z-50
                flex
                min-h-screen
                flex-col
                bg-[#141311]
                px-6
                pb-10
                pt-28
                text-stone-100
              "
            >
              <motion.div
                initial={{
                  opacity: 0,
                  y: 12,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay: 0.18,
                  duration: 0.55,
                  ease: MENU_EASE,
                }}
                className="pb-6"
              >
                <h2
                  className="
                    text-4xl
                    font-normal
                    uppercase
                    leading-[0.9]
                    tracking-[0.01em]
                  "
                >
                  Navigation
                </h2>
              </motion.div>

              <div className="flex flex-1 flex-col justify-between">
                <nav className="mt-6 border-t border-white/10">
                  {links.map((link, index) => (
                    <motion.div
                      key={link.url}
                      initial={{
                        opacity: 0,
                        y: 16,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      exit={{
                        opacity: 0,
                        y: 8,
                      }}
                      transition={{
                        delay: 0.22 + index * 0.06,
                        duration: 0.5,
                        ease: MENU_EASE,
                      }}
                    >
                      <Link
                        href={link.url}
                        onClick={() => setIsOpen(false)}
                        className="
                          group
                          flex
                          items-center
                          justify-between
                          border-b
                          border-white/10
                          py-6
                        "
                      >
                        <span
                          className="
                            text-5xl
                            uppercase
                            tracking-[0.02em]
                            transition-opacity
                            duration-300
                            group-hover:opacity-60
                          "
                        >
                          {link.label}
                        </span>

                        <span
                          className="
                            text-xs
                            uppercase
                            tracking-[0.18em]
                            text-white/35
                          "
                        >
                          {`0${index + 1}`}
                        </span>
                      </Link>
                    </motion.div>
                  ))}
                </nav>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default BurgerMenu;
