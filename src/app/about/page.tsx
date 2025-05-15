import React from "react";
import ScrollSection from "@/components/SmoothScroll";

const page = () => {
  return (
    <ScrollSection>
      <div className="bg-[#ececec] flex justify-center min-h-screen w-full border-b border-[#161310]">
        <div className="flex flex-col-reverse mt-20 md:flex-row items-center w-full max-w-7xl">
          <div className="flex flex-col w-full md:w-1/2 px-6 md:px-10 py-10">
            <div className="mb-10">
              <h1 className="mb-3 text-3xl">The Face Behind the Code</h1>
              <p className="text-sm max-w-xl">
                I&apos;m a 28-year-old frontend developer from Oslo with a
                passion for clean design, solid code, and the space where those
                two worlds meet. I&apos;ve worked on everything from portfolio
                sites to fullstack apps — and I love bringing ideas to life on
                the web.
              </p>
            </div>

            <div className="mb-10 w-full">
              <h1 className="mb-6 text-2xl">Design / Code / Fullstack</h1>

              <div className="flex flex-col lg:flex-row divide-y lg:divide-y-0 lg:divide-x divide-[#161310] text-sm">
                <div className="flex-1 px-4 py-4">
                  <h2 className="text-lg mb-2">Design</h2>
                  <p>
                    I keep things simple and structured. I design with both
                    users and devs in mind, mostly using Figma and Adobe XD.
                  </p>
                </div>

                <div className="flex-1 px-4 py-4">
                  <h2 className="text-lg mb-2">Code</h2>
                  <p>
                    I work alot with React, Next.js, TypeScript, CSS/SASS and
                    Tailwind. I care about clean code, performance, and
                    accessibility.
                  </p>
                </div>

                <div className="flex-1 px-4 py-4">
                  <h2 className="text-lg mb-2">Fullstack</h2>
                  <p>
                    I&apos;ve built with stacks using Prisma, mongoose, MongoDB,
                    SQL, neon, relational and non relational databases, to
                    mention some. I enjoy managing the full flow — from database
                    to UI.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full md:w-1/2 h-[50vh] md:h-screen flex justify-center items-center p-4">
            <img
              alt="Image of Jonas"
              className="object-contain w-full h-full"
              src="/jonny27.jpg"
            />
          </div>
        </div>
      </div>
    </ScrollSection>
  );
};

export default page;
