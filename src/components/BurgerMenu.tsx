"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import TextReveal from "./TextReveal";

const links: {
  label: string;
  url: string;
}[] = [
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
          initial={{
            opacity: 0,
            scale: 0,
          }}
          animate={{
            opacity: 1,
            scale: isOpen ? 1.4 : 1,
          }}
          transition={{
            opacity: {
              delay: 0.25,
              duration: 0.6,
              ease: MENU_EASE,
            },
            scale: {
              duration: 0.4,
              ease: MENU_EASE,
            },
          }}
          className={`
      -mt-1
      h-1
      w-1
      rounded-full
      ${isOpen ? "bg-white" : "bg-black dark:bg-white"}
    `}
        />

        <motion.span
          initial={{
            opacity: 0,
            y: "100%",
            filter: "blur(6px)",
          }}
          animate={{
            opacity: 1,
            y: "0%",
            filter: "blur(0px)",
          }}
          transition={{
            delay: 0.18,
            duration: 0.75,
            ease: MENU_EASE,
          }}
          className="relative block overflow-hidden"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={isOpen ? "close" : "menu"}
              initial={{
                y: "110%",
                opacity: 0,
                filter: "blur(5px)",
              }}
              animate={{
                y: "0%",
                opacity: 1,
                filter: "blur(0px)",
              }}
              exit={{
                y: "-110%",
                opacity: 0,
                filter: "blur(5px)",
              }}
              transition={{
                duration: 0.45,
                ease: MENU_EASE,
              }}
              className="block"
            >
              {isOpen ? "Close" : "Menu"}
            </motion.span>
          </AnimatePresence>
        </motion.span>
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
                ease: MENU_EASE,
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
              <div className="pb-6">
                <TextReveal
                  as="p"
                  mode="words"
                  viewport={false}
                  delay={0.2}
                  stagger={0.04}
                  duration={0.75}
                  className="
                    mb-3
                    text-[10px]
                    uppercase
                    tracking-[0.28em]
                    text-white/35
                  "
                >
                  Navigation
                </TextReveal>

                <TextReveal
                  as="h2"
                  mode="chars"
                  viewport={false}
                  delay={0.25}
                  stagger={0.035}
                  duration={0.7}
                  className="
                    text-4xl
                    font-black
                    uppercase
                    leading-[0.9]
                    tracking-[0.01em]
                  "
                >
                  Menu
                </TextReveal>
              </div>

              <div className="flex flex-1 flex-col justify-between">
                <nav className="mt-6 border-t border-white/10">
                  {links.map((link, index) => (
                    <motion.div
                      key={link.url}
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
                        delay: 0.3 + index * 0.08,
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
                          overflow-hidden
                          border-b
                          border-white/10
                          py-6
                        "
                      >
                        <TextReveal
                          as="span"
                          mode="words"
                          viewport={false}
                          delay={0.33 + index * 0.08}
                          stagger={0.045}
                          duration={0.8}
                          className="
                            text-2xl
                            uppercase
                            tracking-[0.02em]
                            transition-opacity
                            duration-300
                            group-hover:opacity-60
                          "
                        >
                          {link.label}
                        </TextReveal>

                        <TextReveal
                          as="span"
                          mode="chars"
                          viewport={false}
                          delay={0.42 + index * 0.08}
                          stagger={0.03}
                          duration={0.6}
                          className="
                            text-xs
                            uppercase
                            tracking-[0.18em]
                            text-white/35
                          "
                        >
                          {`0${index + 1}`}
                        </TextReveal>
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
