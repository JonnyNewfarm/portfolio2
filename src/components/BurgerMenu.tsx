"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const links = [
  { label: "Home", href: "/" },
  { label: "My Work", href: "/projects" },
  { label: "Contact", href: "/contact" },
  { label: "About", href: "/about" },
];

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
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "";
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
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={isOpen ? "Close menu" : "Open menu"}
        className={`relative z-[60] flex items-center gap-3 text-xs uppercase tracking-[0.2em] transition-colors duration-300 ${
          isOpen ? "text-white" : "text-[#1c1a17] dark:text-stone-300"
        }`}
      >
        <span
          className={`inline-block h-1.5 w-1.5 rounded-full transition-transform duration-300 ${
            isOpen
              ? "scale-150 bg-white"
              : "scale-100 bg-[#1c1a17] dark:bg-stone-300"
          }`}
        />
        <span>{isOpen ? "Close" : "Menu"}</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
            />

            <motion.div
              ref={menuRef}
              initial={{ clipPath: "inset(0 0 100% 0)", opacity: 0 }}
              animate={{ clipPath: "inset(0 0 0% 0)", opacity: 1 }}
              exit={{ clipPath: "inset(0 0 100% 0)", opacity: 0 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="fixed inset-0 z-50 flex min-h-screen flex-col bg-[#141311] px-6 pb-10 pt-28 text-stone-100"
            >
              <div className="border-b border-white/10 pb-6">
                <p className="mb-3 text-[10px] uppercase tracking-[0.28em] text-white/35">
                  Navigation
                </p>
                <h2 className="text-4xl uppercase leading-[0.9] tracking-[-0.05em]">
                  Menu
                </h2>
              </div>

              <div className="flex flex-1 flex-col justify-between">
                <nav className="mt-6 border-t border-white/10">
                  {links.map((link, index) => (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        delay: 0.08 + index * 0.05,
                        duration: 0.35,
                        ease: "easeOut",
                      }}
                    >
                      <Link
                        onClick={() => setIsOpen(false)}
                        href={link.href}
                        className="flex items-center justify-between border-b border-white/10 py-6"
                      >
                        <span className="text-2xl uppercase tracking-[-0.04em]">
                          {link.label}
                        </span>
                        <span className="text-xs uppercase tracking-[0.18em] text-white/35">
                          0{index + 1}
                        </span>
                      </Link>
                    </motion.div>
                  ))}
                </nav>

                <motion.div
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.22, duration: 0.35, ease: "easeOut" }}
                  className="mt-12 border-t border-white/10 pt-6"
                >
                  <p className="mb-2 text-[10px] uppercase tracking-[0.24em] text-white/35">
                    Studio
                  </p>
                  <p className="max-w-[260px] text-sm leading-relaxed text-white/65">
                    Design and development
                  </p>
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default BurgerMenu;
