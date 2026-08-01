"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import WaveLinkText from "./WaveLinkText";

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

  const isProjectsPage = pathname === "/projects";

  return (
    <footer
      className={`relative overflow-hidden  px-4 py-10 bg-[#ececec] 
text-[#211f1e]
dark:bg-[#1e1c1a]
dark:text-[#e7e3dd] md:px-10 lg:px-16 ${isProjectsPage ? "md:hidden" : ""}`}
    >
      <div className="mx-auto flex min-h-[520px] w-full max-w-[1800px] flex-col justify-between pt-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-[1.2fr_0.8fr] md:items-start">
          <div>
            <p className="mb-6 text-xs font-normal uppercase tracking-[0.24em]  md:text-sm">
              Contact / Availability
            </p>

            <h2 className="max-w-[1200px] text-[13vw] font-bold uppercase leading-[0.92] tracking-[0.04em] md:text-[10vw] lg:text-[7.6vw]">
              Let&apos;s build
              <br />
              something
              <br />
              useful.
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-8 md:grid-cols-1 md:justify-self-end md:text-right">
            <div>
              <p className="mb-3 text-lg font-normal uppercase tracking-[0.22em] ">
                Navigation
              </p>

              <div className="flex flex-col items-start gap-1 text-xl font-semibold uppercase leading-[1.05] tracking-[0.02em] opacity-80 md:items-end md:text-4xl">
                <Link href="/" className="w-fit transition hover:opacity-60">
                  <WaveLinkText text="Home" />
                </Link>

                <Link
                  href="/projects"
                  className="w-fit transition hover:opacity-60"
                >
                  <WaveLinkText text="My Work" />
                </Link>

                <Link
                  href="/contact"
                  className="w-fit transition hover:opacity-60"
                >
                  <WaveLinkText text="Contact" />
                </Link>
              </div>
            </div>

            <div>
              <p className="mb-3 text-lg font-normal uppercase tracking-[0.22em] ">
                Social
              </p>

              <div className="flex flex-col items-start gap-1 text-xl font-semibold uppercase leading-[1.05] tracking-[0.02em] opacity-80 md:items-end md:text-4xl">
                <a
                  href="https://www.linkedin.com/in/jonas-nygaard-0aa767366/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-fit transition hover:opacity-60"
                >
                  <WaveLinkText text="LinkedIn" />
                </a>

                <a
                  href="https://www.jonasnygaard.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-fit transition hover:opacity-60"
                >
                  <WaveLinkText text="Portfolio" />
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-20 grid grid-cols-1 gap-6 border-t border-stone-400/30 pt-6 text-lg font-normal uppercase tracking-[0.14em] opacity-75 dark:border-stone-200/20 md:grid-cols-4">
          <div>
            <p className="mb-1 text-sm ">Created by</p>
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://www.jonasnygaard.com/"
              className="inline-block w-fit font-semibold transition hover:opacity-60"
            >
              <WaveLinkText text="Newfarm Studio" />
            </a>
          </div>

          <div>
            <p className="mb-1 text-sm ">Email</p>
            <a
              href="mailto:jonasnygaard96@gmail.com"
              className="inline-block font-semibold w-fit normal-case tracking-[0.1] transition hover:opacity-60"
            >
              <WaveLinkText text="jonasnygaard96@gmail.com" />
            </a>
          </div>

          <div>
            <p className="mb-1 text-sm ">Local time</p>
            <p className="font-semibold">{time}</p>
          </div>

          <div className="md:text-right">
            <p className="mb-1 text-sm ">Location</p>
            <p className="font-semibold">Oslo, Norway</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
