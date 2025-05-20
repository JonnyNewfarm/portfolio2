"use client";

import React, { useState } from "react";
import SmoothScroll from "@/components/SmoothScroll";
import { motion } from "framer-motion";

const Page = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    organization: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/contact", {
      method: "POST",
      body: JSON.stringify(form),
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();
    if (data.success) {
      alert("Message sent!");
      setForm({ name: "", email: "", organization: "", message: "" });
    } else {
      alert("Something went wrong.");
    }
  };

  return (
    <SmoothScroll>
      <div className="min-h-screen w-full border-b border-black bg-[#ececec] text-[#1c1a17] flex flex-col lg:flex-row">
        {/* Left Side */}
        <div className="flex flex-col justify-between w-full lg:w-1/2 p-10 lg:p-20 border-b border-[#1c1a17] lg:border-b-0 lg:border-r">
          <div className="flex flex-col gap-y-6">
            <motion.h1
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{
                scale: [0, 1],
                opacity: [0, 1, 1],
              }}
              transition={{
                delay: 0.1,
                duration: 0.7,
                times: [0, 0.4, 1],
                ease: "easeInOut",
              }}
              className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl mt-10 leading-tight"
            >
              Let&apos;s turn your <br /> vision into reality
            </motion.h1>
            <motion.p
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{
                scale: [0, 1],
                opacity: [0, 1, 1],
              }}
              transition={{
                delay: 0.2,
                duration: 0.7,
                times: [0, 0.4, 1],
                ease: "easeInOut",
              }}
              className="text-lg max-w-md mt-4"
            >
              Got an idea or project in mind? Don&apos;t hesitate to reach out.
              I&apos;m always open to building something great together.
            </motion.p>
          </div>

          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{
              scale: [0, 1],
              opacity: [0, 1, 1],
            }}
            transition={{
              delay: 0.3,
              duration: 0.7,
              times: [0, 0.4, 1],
              ease: "easeInOut",
            }}
            className="flex flex-col gap-y-2 mt-4 lg:mt-4"
          >
            <h2 className="opacity-70 text-sm uppercase tracking-wide mb-1">
              Contact details
            </h2>
            <p>Jonas Nygaard</p>
            <p>jonasnygaard96@gmail.com</p>
            <p>+47 48 26 30 11</p>
            <p>Oslo, Norway</p>
            <a
              className="underline"
              href="https://www.linkedin.com/in/jonas-nygaard-0aa767366/"
            >
              LinkedIn
            </a>
          </motion.div>
        </div>

        {/* Right Side */}
        <div className="w-full lg:w-1/2 p-10 lg:p-20 flex items-center justify-center">
          <motion.form
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{
              scale: [0, 1],
              opacity: [0, 1, 1],
            }}
            transition={{
              delay: 0.4,
              duration: 0.7,
              times: [0, 0.4, 1],
              ease: "easeInOut",
            }}
            onSubmit={handleSubmit}
            className="w-full max-w-xl flex flex-col gap-6"
          >
            <input
              className="border-b border-[#1c1a17] px-4 py-4 bg-transparent outline-none"
              placeholder="Name"
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              required
            />
            <input
              className="border-b border-[#1c1a17] px-4 py-4 bg-transparent outline-none"
              placeholder="Email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
            />
            <input
              className="border-b border-[#1c1a17] px-4 py-4 bg-transparent outline-none"
              placeholder="Organization (optional)"
              name="organization"
              type="text"
              value={form.organization}
              onChange={handleChange}
            />
            <textarea
              className="border-b border-[#1c1a17] px-4 py-4 bg-transparent min-h-[150px] resize-none outline-none"
              placeholder="Message"
              name="message"
              value={form.message}
              onChange={handleChange}
              required
            />
            <button
              type="submit"
              className="self-start mt-4 border border-[#1c1a17] px-6 py-2 hover:bg-[#1c1a17] hover:text-[#ececec] transition-colors"
            >
              Send
            </button>
          </motion.form>
        </div>
      </div>
    </SmoothScroll>
  );
};

export default Page;
