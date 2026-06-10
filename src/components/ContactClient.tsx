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
  const [isSending, setIsSending] = useState(false);

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
    setIsSending(true);

    const errors = validateForm();
    setValidationErrors(errors);

    if (Object.keys(errors).length > 0) {
      setIsSending(false);
      return;
    }

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
    } finally {
      setIsSending(false);
    }
  };

  return (
    <SmoothScroll>
      <section className="min-h-screen w-full overflow-hidden border-b border-stone-300 bg-[#ececec] px-4 pb-12 pt-28 text-[#161310] dark:border-stone-600 dark:bg-[#2e2b2b] dark:text-stone-300 sm:px-8 md:px-10 lg:px-16 lg:pt-36">
        <div className="mx-auto w-full max-w-[1800px]">
          <motion.div
            initial={{ opacity: 0, y: 28, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{
              duration: 0.9,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="mb-16 grid grid-cols-1 gap-8 md:grid-cols-[1.2fr_0.8fr] md:items-end lg:mb-24"
          >
            <div>
              <p className="mb-6 text-xs font-black uppercase tracking-[0.28em] opacity-45">
                Contact / Availability
              </p>

              <h1 className="max-w-[1250px] text-[11vw] font-black uppercase leading-[0.78] tracking-[-0.06em] sm:text-[14vw] md:text-[10vw] lg:text-[8vw]">
                Let&apos;s build
                <br />
                something
                <br />
                useful.
              </h1>
            </div>

            <p className="max-w-[540px] text-base font-bold leading-[1.35] opacity-60 md:justify-self-end md:text-right md:text-lg">
              I design and build clean digital experiences, from visual identity
              and interface design to frontend development.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-14 lg:grid-cols-[0.72fr_1.28fr] lg:gap-16">
            <motion.aside
              initial={{ opacity: 0, y: 30, filter: "blur(6px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{
                duration: 0.85,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="order-2 lg:order-1"
            >
              <div className="grid grid-cols-1 gap-10 text-sm font-black uppercase tracking-[0.18em] opacity-75 sm:grid-cols-2 lg:sticky lg:top-28 lg:grid-cols-1">
                <div>
                  <p className="mb-3 text-xs tracking-[0.24em] opacity-40">
                    Details
                  </p>

                  <div className="flex flex-col gap-2">
                    <p>Jonas Nygaard</p>

                    <a
                      href="mailto:jonasnygaard96@gmail.com"
                      className="normal-case tracking-normal transition hover:opacity-60"
                    >
                      jonasnygaard96@gmail.com
                    </a>

                    <a
                      href="tel:+4748263011"
                      className="transition hover:opacity-60"
                    >
                      +47 48 26 30 11
                    </a>

                    <p>Oslo, Norway</p>
                  </div>
                </div>

                <div>
                  <p className="mb-3 text-xs tracking-[0.24em] opacity-40">
                    Social
                  </p>

                  <div className="flex flex-col gap-2">
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

                <div>
                  <p className="mb-3 text-xs tracking-[0.24em] opacity-40">
                    Work
                  </p>

                  <p className="max-w-[340px] text-base font-bold normal-case leading-[1.35] tracking-normal opacity-60">
                    Available for freelance work, web design, frontend builds
                    and selected collaborations.
                  </p>
                </div>
              </div>
            </motion.aside>

            <motion.form
              onSubmit={handleSubmit}
              noValidate
              initial={{ opacity: 0, y: 34, filter: "blur(7px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{
                duration: 0.95,
                delay: 0.08,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="order-1 lg:order-2"
            >
              <div className="mb-10 flex items-end justify-between gap-8 border-b border-stone-400/30 pb-5 dark:border-stone-200/20">
                <div>
                  <p className="mb-3 text-xs font-black uppercase tracking-[0.24em] opacity-40">
                    Send a message
                  </p>

                  <h2 className="text-[12vw] font-black uppercase leading-[0.84] tracking-[-0.08em] sm:text-[8vw] md:text-[5vw] lg:text-[4vw]">
                    Start here
                  </h2>
                </div>

                <p className="hidden max-w-[260px] text-right text-sm font-bold leading-[1.35] opacity-45 md:block">
                  Tell me what you need, what exists already and what the goal
                  is.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-x-10 gap-y-9 md:grid-cols-2">
                <div>
                  <label className="mb-3 block text-xs font-black uppercase tracking-[0.24em] opacity-80">
                    Name
                  </label>

                  <input
                    className="w-full border-b border-stone-700/50 bg-transparent py-5 text-lg font-bold outline-none transition placeholder:opacity-30 focus:border-stone-900 dark:border-stone-300/40 dark:focus:border-stone-100 md:text-xl"
                    placeholder="Your name"
                    name="name"
                    type="text"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />

                  {submitted && validationErrors.name && (
                    <p className="mt-3 text-sm font-bold text-red-600">
                      {validationErrors.name}
                    </p>
                  )}
                </div>

                <div>
                  <label className="mb-3 block text-xs font-black uppercase tracking-[0.24em] opacity-80">
                    Email
                  </label>

                  <input
                    className="w-full border-b border-stone-700/50 bg-transparent py-5 text-lg font-bold outline-none transition placeholder:opacity-30 focus:border-stone-900 dark:border-stone-300/40 dark:focus:border-stone-100 md:text-xl"
                    placeholder="Your email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />

                  {submitted && validationErrors.email && (
                    <p className="mt-3 text-sm font-bold text-red-600">
                      {validationErrors.email}
                    </p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="mb-3 block text-xs font-black uppercase tracking-[0.24em] opacity-80">
                    Organization
                  </label>

                  <input
                    className="w-full border-b border-stone-700/50 bg-transparent py-5 text-lg font-bold outline-none transition placeholder:opacity-30 focus:border-stone-900 dark:border-stone-300/40 dark:focus:border-stone-100 md:text-xl"
                    placeholder="Studio, company or project — optional"
                    name="organization"
                    type="text"
                    value={form.organization}
                    onChange={handleChange}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="mb-3 block text-xs font-black uppercase tracking-[0.24em] opacity-80">
                    Message
                  </label>

                  <textarea
                    className="min-h-[220px] w-full resize-none border-b border-stone-700/50 bg-transparent py-5 text-lg font-bold leading-[1.35] outline-none transition placeholder:opacity-30 focus:border-stone-900 dark:border-stone-300/40 dark:focus:border-stone-100 md:text-xl"
                    placeholder="Tell me about the project..."
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    required
                  />

                  {submitted && validationErrors.message && (
                    <p className="mt-3 text-sm font-bold text-red-600">
                      {validationErrors.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-12 flex flex-col gap-5 sm:flex-row sm:items-center">
                <button
                  type="submit"
                  disabled={isSending}
                  className="w-fit border cursor-pointer border-[#161310] px-8 py-4 text-sm font-black uppercase tracking-[0.2em] text-[#161310] transition hover:opacity-60 disabled:cursor-not-allowed disabled:opacity-40 dark:border-stone-300 dark:text-stone-300"
                >
                  {isSending ? "Sending..." : "Send message"}
                </button>

                <p className="max-w-[360px] text-sm font-bold leading-[1.35] opacity-45">
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
