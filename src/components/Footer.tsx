"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";

const Footer = () => {
  const pathname = usePathname();
  const [time, setTime] = useState("");

  useEffect(() => {
    const update = () =>
      setTime(
        new Date().toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
      );

    update();

    const interval = setInterval(update, 1000);

    return () => clearInterval(interval);
  }, []);

  if (pathname === "/") return null;

  return (
    <footer className="relative overflow-hidden bg-[#ececec] px-4 py-10 text-[#161310] dark:bg-[#2e2b2b] dark:text-stone-300 md:px-10 lg:px-16">
      <div className="mx-auto flex min-h-[520px] w-full max-w-[1800px] flex-col justify-between  pt-8 ">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-[1.2fr_0.8fr] md:items-start">
          <div>
            <p className="mb-6 text-xs font-black uppercase tracking-[0.24em] opacity-45 md:text-sm">
              Contact / Availability
            </p>

            <h2 className="max-w-[1200px] text-[13vw] font-black uppercase leading-[0.78] tracking-[-0.075em] md:text-[10vw] lg:text-[7.6vw]">
              Let&apos;s build
              <br />
              something
              <br />
              useful.
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-8 md:grid-cols-1 md:justify-self-end md:text-right">
            <div>
              <p className="mb-3 text-xs font-black uppercase tracking-[0.22em] opacity-40">
                Navigation
              </p>

              <div className="flex flex-col gap-1 text-xl font-black uppercase leading-[1.05] tracking-[-0.04em] opacity-80 md:text-3xl">
                <Link href="/" className="transition hover:opacity-60">
                  Home
                </Link>

                <Link href="/projects" className="transition hover:opacity-60">
                  My Work
                </Link>

                <Link href="/about" className="transition hover:opacity-60">
                  About
                </Link>

                <Link href="/contact" className="transition hover:opacity-60">
                  Contact
                </Link>
              </div>
            </div>

            <div>
              <p className="mb-3 text-xs font-black uppercase tracking-[0.22em] opacity-40">
                Social
              </p>

              <div className="flex flex-col gap-1 text-xl font-black uppercase leading-[1.05] tracking-[-0.04em] opacity-80 md:text-3xl">
                <a
                  href="https://www.linkedin.com/in/jonas-nygaard-0aa767366/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition hover:opacity-60"
                >
                  LinkedIn
                </a>

                <a
                  href="https://www.jonasnygaard.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition hover:opacity-60"
                >
                  Portfolio
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-20 grid grid-cols-1 gap-6 border-t border-stone-400/30 pt-6 text-sm font-black uppercase tracking-[0.14em] opacity-75 dark:border-stone-200/20 md:grid-cols-4">
          <div>
            <p className="mb-1 opacity-35">Created by</p>
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://www.jonasnygaard.com/"
              className="transition hover:opacity-60"
            >
              Newfarm Studio
            </a>
          </div>

          <div>
            <p className="mb-1 opacity-35">Email</p>
            <a
              href="mailto:jonasnygaard96@gmail.com"
              className="normal-case tracking-normal transition hover:opacity-60"
            >
              jonasnygaard96@gmail.com
            </a>
          </div>

          <div>
            <p className="mb-1 opacity-35">Local time</p>
            <p>{time}</p>
          </div>

          <div className="md:text-right">
            <p className="mb-1 opacity-35">Location</p>
            <p>Oslo, Norway</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
