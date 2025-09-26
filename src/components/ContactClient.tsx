"use client";

import React, { useState } from "react";
import SmoothScroll from "@/components/SmoothScroll";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";

const ContactClient = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    organization: "",
    message: "",
  });

  const [validationErrors, setValidationErrors] = useState<{
    name?: string;
    email?: string;
    message?: string;
  }>({});

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });

    if (validationErrors[e.target.name as keyof typeof validationErrors]) {
      setValidationErrors((prev) => ({
        ...prev,
        [e.target.name]: undefined,
      }));
    }
  };

  const validateForm = () => {
    const errors: typeof validationErrors = {};
    if (!form.name.trim()) errors.name = "Name is required.";
    if (!form.email.trim()) {
      errors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errors.email = "Email must be valid.";
    }
    if (!form.message.trim()) {
      errors.message = "Message is required.";
    } else if (form.message.length < 10) {
      errors.message = "Message must be at least 10 characters.";
    }
    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    const errors = validateForm();
    setValidationErrors(errors);

    if (Object.keys(errors).length > 0) return;

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        body: JSON.stringify(form),
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();
      if (data.success) {
        setForm({ name: "", email: "", organization: "", message: "" });
        setValidationErrors({});
        setSubmitted(false);
        toast.success("Message sent successfully!");
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } catch {
      toast.error("Network error. Please try again later.");
    }
  };

  return (
    <SmoothScroll>
      <div className="min-h-screen w-full border-b border-stone-500 bg-[#ececec] text-[#1c1a17] flex flex-col lg:flex-row">
        <div className="flex flex-col justify-between w-full lg:w-1/2 p-10 lg:p-20 border-b border-stone-400/20 lg:border-b-0 lg:border-r lg:border-stone-400/20">
          <div className="flex flex-col gap-y-6">
            <motion.h1
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: [0, 1], opacity: [0, 1, 1] }}
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
              animate={{ scale: [0, 1], opacity: [0, 1, 1] }}
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
            animate={{ scale: [0, 1], opacity: [0, 1, 1] }}
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

        <div className="w-full lg:w-1/2 p-10 lg:p-20 flex items-center justify-center">
          <motion.form
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: [0, 1], opacity: [0, 1, 1] }}
            transition={{
              delay: 0.4,
              duration: 0.7,
              times: [0, 0.4, 1],
              ease: "easeInOut",
            }}
            onSubmit={handleSubmit}
            className="w-full max-w-xl flex flex-col gap-6"
            noValidate
          >
            <div>
              <input
                className="border-b border-stone-700 px-4 py-4 bg-transparent outline-none w-full"
                placeholder="Name"
                name="name"
                type="text"
                value={form.name}
                onChange={handleChange}
                required
              />
              {submitted && validationErrors.name && (
                <p className="text-red-600 text-sm mt-1">
                  {validationErrors.name}
                </p>
              )}
            </div>

            <div>
              <input
                className="border-b border-stone-700 px-4 py-4 bg-transparent outline-none w-full"
                placeholder="Email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
              />
              {submitted && validationErrors.email && (
                <p className="text-red-600 text-sm mt-1">
                  {validationErrors.email}
                </p>
              )}
            </div>

            <div>
              <input
                className="border-b border-stone-700 px-4 py-4 bg-transparent outline-none w-full"
                placeholder="Organization (optional)"
                name="organization"
                type="text"
                value={form.organization}
                onChange={handleChange}
              />
            </div>

            <div>
              <textarea
                className="border-b border-stone-700 px-4 py-4 bg-transparent min-h-[150px] resize-none outline-none w-full"
                placeholder="Message"
                name="message"
                value={form.message}
                onChange={handleChange}
                required
              />
              {submitted && validationErrors.message && (
                <p className="text-red-600 text-sm mt-1">
                  {validationErrors.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="self-start cursor-pointer mt-4 border-2 font-semibold rounded-[2px] text-stone-700 border-stone-700 px-6 py-2 hover:scale-103 transition-transform ease-in-out"
            >
              Send
            </button>
          </motion.form>
        </div>
      </div>
    </SmoothScroll>
  );
};

export default ContactClient;
