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
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
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
      <section className="min-h-screen w-full border-b border-stone-300 bg-[#ececec] text-[#161310] dark:border-stone-600 dark:bg-[#2e2b2b] dark:text-stone-300">
        <div className="mx-auto grid min-h-screen w-full max-w-[1800px] grid-cols-1 px-6 pb-16 pt-28 sm:px-10 lg:grid-cols-12 lg:gap-10 lg:px-16 xl:px-20">
          {/* Left side */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="flex flex-col justify-between border-b border-stone-400/20 pb-12 dark:border-stone-200/20 lg:col-span-5 lg:min-h-[calc(100vh-7rem)] lg:border-b-0 lg:border-r lg:pr-10 xl:col-span-4"
          >
            <div>
              <p className="mb-6 text-[10px] uppercase tracking-[0.3em] opacity-45">
                Contact / Start a project
              </p>

              <div className="max-w-[560px]">
                <h1 className="text-5xl uppercase leading-[0.88] tracking-[-0.06em] sm:text-6xl xl:text-7xl">
                  Let&apos;s turn
                </h1>
                <h1 className="text-5xl uppercase leading-[0.88] tracking-[-0.06em] sm:ml-8 sm:text-6xl xl:ml-12 xl:text-7xl">
                  your vision
                </h1>
                <h1 className="text-5xl uppercase leading-[0.88] tracking-[-0.06em] sm:ml-16 sm:text-6xl xl:ml-24 xl:text-7xl">
                  into reality
                </h1>
              </div>

              <p className="mt-8 max-w-[470px] text-sm leading-relaxed opacity-70 sm:text-base">
                Got an idea, brand or product in mind? Reach out and let&apos;s
                build something thoughtful, sharp and visually strong together.
              </p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
              className="mt-12 border-t border-stone-400/20 pt-6 dark:border-stone-200/20 lg:mt-16"
            >
              <p className="mb-4 text-[10px] uppercase tracking-[0.24em] opacity-45">
                Contact Details
              </p>

              <div className="flex flex-col gap-2 text-sm sm:text-base">
                <p>Jonas Nygaard</p>
                <a
                  href="mailto:jonasnygaard96@gmail.com"
                  className="transition-opacity duration-300 hover:opacity-60"
                >
                  jonasnygaard96@gmail.com
                </a>
                <a
                  href="tel:+4748263011"
                  className="transition-opacity duration-300 hover:opacity-60"
                >
                  +47 48 26 30 11
                </a>
                <p>Oslo, Norway</p>
                <a
                  className="mt-2 text-sm uppercase tracking-[0.18em] opacity-70 transition-opacity duration-300 hover:opacity-100"
                  href="https://www.linkedin.com/in/jonas-nygaard-0aa767366/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  LinkedIn
                </a>
              </div>
            </motion.div>
          </motion.div>

          {/* Right side */}
          <div className="pt-12 lg:col-span-7 lg:flex lg:min-h-[calc(100vh-7rem)] lg:items-center lg:pt-0 xl:col-span-8">
            <motion.form
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, ease: "easeOut", delay: 0.08 }}
              onSubmit={handleSubmit}
              noValidate
              className="w-full max-w-[920px] lg:ml-auto"
            >
              <div className="mb-10 border-b border-stone-400/20 pb-5 dark:border-stone-200/20">
                <p className="mb-2 text-[10px] uppercase tracking-[0.25em] opacity-40">
                  Send a message
                </p>
                <h2 className="text-3xl uppercase leading-none tracking-[-0.04em] sm:text-5xl">
                  Let&apos;s talk
                </h2>
              </div>

              <div className="grid grid-cols-1 gap-x-10 gap-y-8 md:grid-cols-2">
                <div>
                  <label className="mb-3 block text-[10px] uppercase tracking-[0.24em] ">
                    Name
                  </label>
                  <input
                    className="w-full border-b border-stone-700/70 bg-transparent px-0 py-4 text-base outline-none placeholder:opacity-30 dark:border-stone-300/70"
                    placeholder="Your name"
                    name="name"
                    type="text"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                  {submitted && validationErrors.name && (
                    <p className="mt-2 text-sm text-red-600">
                      {validationErrors.name}
                    </p>
                  )}
                </div>

                <div>
                  <label className="mb-3 block text-[10px] uppercase tracking-[0.24em] ">
                    Email
                  </label>
                  <input
                    className="w-full border-b border-stone-700/70 bg-transparent px-0 py-4 text-base outline-none placeholder:opacity-30 dark:border-stone-300/70"
                    placeholder="Your email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                  {submitted && validationErrors.email && (
                    <p className="mt-2 text-sm text-red-600">
                      {validationErrors.email}
                    </p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="mb-3 block text-[10px] uppercase tracking-[0.24em]">
                    Organization
                  </label>
                  <input
                    className="w-full border-b border-stone-700/70 bg-transparent px-0 py-4 text-base outline-none placeholder:opacity-30 dark:border-stone-300/70"
                    placeholder="Studio, company or brand (optional)"
                    name="organization"
                    type="text"
                    value={form.organization}
                    onChange={handleChange}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="mb-3 block text-[10px] uppercase tracking-[0.24em] ">
                    Message
                  </label>
                  <textarea
                    className="min-h-[180px] w-full resize-none border-b border-stone-700/70 bg-transparent px-0 py-4 text-base outline-none placeholder:opacity-30 dark:border-stone-300/70"
                    placeholder="Tell me about your idea, project goals or what you want to create..."
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    required
                  />
                  {submitted && validationErrors.message && (
                    <p className="mt-2 text-sm text-red-600">
                      {validationErrors.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-10 flex items-center gap-6">
                <button
                  type="submit"
                  className="cursor-pointer border border-stone-700 px-7 py-3 text-xs font-medium uppercase tracking-[0.18em] transition-opacity duration-300 hover:opacity-65 dark:border-stone-300"
                >
                  Send Message
                </button>

                <p className="text-sm opacity-45">
                  Open for freelance and selected collaborations.
                </p>
              </div>
            </motion.form>
          </div>
        </div>
      </section>
    </SmoothScroll>
  );
};

export default ContactClient;
