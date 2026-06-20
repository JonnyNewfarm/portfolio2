"use client";

import React, { useState } from "react";
import SmoothScroll from "@/components/SmoothScroll";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import WaveLinkText from "./WaveLinkText";

const ease = [0.22, 1, 0.36, 1] as const;

type TextRevealProps = {
  children: string;
  as?: "p" | "h1" | "h2" | "h3" | "span" | "label";
  className?: string;
  delay?: number;
  once?: boolean;
  mode?: "words" | "lines";
  htmlFor?: string;
};

function TextReveal({
  children,
  as = "p",
  className = "",
  delay = 0,
  once = true,
  mode = "words",
  htmlFor,
}: TextRevealProps) {
  const MotionTag = motion[as] as any;

  const items =
    mode === "lines"
      ? children.split("\n").filter((line) => line.trim().length > 0)
      : children.split(" ");

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        delayChildren: delay,
        staggerChildren: mode === "lines" ? 0.11 : 0.028,
      },
    },
  };

  const itemVariants = {
    hidden: {
      y: "115%",
      opacity: 0,
      rotate: 0,
      filter: "blur(10px)",
    },
    visible: {
      y: "0%",
      opacity: 1,
      rotate: 0,
      filter: "blur(0px)",
      transition: {
        duration: mode === "lines" ? 1 : 0.75,
        ease,
      },
    },
  };

  return (
    <MotionTag
      htmlFor={htmlFor}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount: 0.35 }}
      className={className}
    >
      {items.map((item, index) => (
        <span
          key={`${item}-${index}`}
          className={
            mode === "lines"
              ? "block overflow-hidden py-[0.08em] -my-[0.08em]"
              : "inline-block overflow-hidden py-[0.04em] -my-[0.04em] align-top"
          }
        >
          <motion.span
            variants={itemVariants}
            className="inline-block will-change-transform"
          >
            {item}
            {mode === "words" && index !== items.length - 1 ? "\u00A0" : null}
          </motion.span>
        </span>
      ))}
    </MotionTag>
  );
}

type FadeInProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  amount?: number;
};

function FadeIn({
  children,
  className = "",
  delay = 0,
  y = 28,
  amount = 0.25,
}: FadeInProps) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y,
        filter: "blur(8px)",
      }}
      whileInView={{
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
      }}
      viewport={{ once: true, amount }}
      transition={{
        duration: 0.9,
        delay,
        ease,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

type AnimatedFieldProps = {
  children: React.ReactNode;
  delay?: number;
  className?: string;
};

function AnimatedField({
  children,
  delay = 0,
  className = "",
}: AnimatedFieldProps) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 26,
        filter: "blur(8px)",
      }}
      whileInView={{
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
      }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{
        duration: 0.85,
        delay,
        ease,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

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
      <section className="min-h-screen w-full overflow-hidden bg-[#fbfafa] px-4 pb-12 pt-28 text-[#161310] dark:bg-[#1e1c1c] dark:text-stone-300 sm:px-8 md:px-10 lg:px-16 lg:pt-36">
        <div className="mx-auto w-full max-w-[1800px]">
          {/* HERO */}
          <div className="mb-16 grid grid-cols-1 gap-8 md:grid-cols-[1.2fr_0.8fr] md:items-end lg:mb-24">
            <div>
              <TextReveal
                as="p"
                mode="words"
                delay={0.05}
                className="mb-6 text-xs font-black uppercase tracking-[0.28em] opacity-45"
              >
                Contact / Availability
              </TextReveal>

              <TextReveal
                as="h1"
                mode="lines"
                delay={0.12}
                className="max-w-[1250px] text-[11vw] font-black uppercase leading-[0.86] tracking-[-0.045em] sm:text-[14vw] md:text-[10vw] lg:text-[8vw]"
              >
                {`Let's build
something
useful.`}
              </TextReveal>
            </div>

            <TextReveal
              as="p"
              mode="words"
              delay={0.35}
              className="max-w-[540px] text-base font-bold leading-[1.35] opacity-85 md:justify-self-end md:text-right md:text-lg"
            >
              I design and build clean digital experiences, from visual identity
              and interface design to frontend development.
            </TextReveal>
          </div>

          <div className="grid grid-cols-1 gap-14 lg:grid-cols-[0.72fr_1.28fr] lg:gap-16">
            {/* DETAILS */}
            <aside className="order-2 lg:order-1">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.25 }}
                variants={{
                  hidden: {},
                  visible: {
                    transition: {
                      staggerChildren: 0.08,
                    },
                  },
                }}
                className="grid grid-cols-1 gap-10 text-sm font-black uppercase tracking-[0.18em] opacity-75 sm:grid-cols-2 lg:sticky lg:top-28 lg:grid-cols-1"
              >
                <motion.div
                  variants={{
                    hidden: {
                      opacity: 0,
                      y: 30,
                      filter: "blur(8px)",
                    },
                    visible: {
                      opacity: 1,
                      y: 0,
                      filter: "blur(0px)",
                      transition: {
                        duration: 0.85,
                        ease,
                      },
                    },
                  }}
                >
                  <p className="mb-3 text-xs tracking-[0.24em] opacity-40">
                    Details
                  </p>

                  <div className="flex flex-col items-start gap-2">
                    <a
                      href="https://www.jonasnygaard.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-fit transition duration-500 hover:opacity-60"
                    >
                      <WaveLinkText text="Jonas Nygaard" />
                    </a>

                    <a
                      href="mailto:jonasnygaard96@gmail.com"
                      className="w-fit normal-case tracking-normal transition duration-500 hover:opacity-60"
                    >
                      <WaveLinkText text="jonasnygaard96@gmail.com" />
                    </a>

                    <a
                      href="tel:+4748263011"
                      className="w-fit transition duration-500 hover:opacity-60"
                    >
                      <WaveLinkText text="+47 48 26 30 11" />
                    </a>

                    <p>Oslo, Norway</p>
                  </div>
                </motion.div>

                <motion.div
                  variants={{
                    hidden: {
                      opacity: 0,
                      y: 30,
                      filter: "blur(8px)",
                    },
                    visible: {
                      opacity: 1,
                      y: 0,
                      filter: "blur(0px)",
                      transition: {
                        duration: 0.85,
                        ease,
                      },
                    },
                  }}
                >
                  <p className="mb-3 text-xs tracking-[0.24em] opacity-40">
                    Social
                  </p>

                  <div className="flex flex-col items-start gap-2">
                    <a
                      href="https://www.linkedin.com/in/jonas-nygaard-0aa767366/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-fit transition duration-500 hover:opacity-60"
                    >
                      <WaveLinkText text="LinkedIn" />
                    </a>

                    <a
                      href="https://www.jonasnygaard.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-fit transition duration-500 hover:opacity-60"
                    >
                      <WaveLinkText text="Portfolio" />
                    </a>
                  </div>
                </motion.div>

                <motion.div
                  variants={{
                    hidden: {
                      opacity: 0,
                      y: 30,
                      filter: "blur(8px)",
                    },
                    visible: {
                      opacity: 1,
                      y: 0,
                      filter: "blur(0px)",
                      transition: {
                        duration: 0.85,
                        ease,
                      },
                    },
                  }}
                >
                  <p className="mb-3 text-xs tracking-[0.24em] opacity-40">
                    Work
                  </p>

                  <p className="max-w-[340px] text-base font-bold normal-case leading-[1.35] tracking-normal opacity-85">
                    Available for freelance work, web design, frontend builds
                    and selected collaborations.
                  </p>
                </motion.div>
              </motion.div>
            </aside>

            {/* FORM */}
            <form
              onSubmit={handleSubmit}
              noValidate
              className="order-1 lg:order-2"
            >
              <div className="mb-10 flex items-end justify-between gap-8 border-b border-stone-400/30 pb-5 dark:border-stone-200/20">
                <div>
                  <TextReveal
                    as="p"
                    mode="words"
                    className="mb-3 text-xs font-black uppercase tracking-[0.24em] opacity-40"
                  >
                    Send a message
                  </TextReveal>

                  <TextReveal
                    as="h2"
                    mode="lines"
                    delay={0.05}
                    className="text-[12vw] font-black uppercase leading-[0.9] tracking-[-0.045em] sm:text-[8vw] md:text-[5vw] lg:text-[4vw]"
                  >
                    Start here
                  </TextReveal>
                </div>

                <TextReveal
                  as="p"
                  mode="words"
                  delay={0.16}
                  className="hidden max-w-[260px] text-right text-sm leading-[1.35] md:block"
                >
                  Tell me what you need, what exists already and what the goal
                  is.
                </TextReveal>
              </div>

              <div className="grid grid-cols-1 gap-x-10 gap-y-9 md:grid-cols-2">
                <AnimatedField delay={0.02}>
                  <TextReveal
                    as="label"
                    htmlFor="name"
                    mode="words"
                    className="mb-3 block text-xs font-black uppercase tracking-[0.24em] opacity-80"
                  >
                    Name
                  </TextReveal>

                  <input
                    id="name"
                    className="w-full border-b border-stone-700/50 bg-transparent py-5 text-lg font-bold outline-none transition duration-500 placeholder:opacity-30 focus:border-stone-900 dark:border-stone-300/40 dark:focus:border-stone-100 md:text-xl"
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
                </AnimatedField>

                <AnimatedField delay={0.08}>
                  <TextReveal
                    as="label"
                    htmlFor="email"
                    mode="words"
                    className="mb-3 block text-xs font-black uppercase tracking-[0.24em] opacity-80"
                  >
                    Email
                  </TextReveal>

                  <input
                    id="email"
                    className="w-full border-b border-stone-700/50 bg-transparent py-5 text-lg font-bold outline-none transition duration-500 placeholder:opacity-30 focus:border-stone-900 dark:border-stone-300/40 dark:focus:border-stone-100 md:text-xl"
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
                </AnimatedField>

                <AnimatedField delay={0.14} className="md:col-span-2">
                  <TextReveal
                    as="label"
                    htmlFor="organization"
                    mode="words"
                    className="mb-3 block text-xs font-black uppercase tracking-[0.24em] opacity-80"
                  >
                    Organization
                  </TextReveal>

                  <input
                    id="organization"
                    className="w-full border-b border-stone-700/50 bg-transparent py-5 text-lg font-bold outline-none transition duration-500 placeholder:opacity-30 focus:border-stone-900 dark:border-stone-300/40 dark:focus:border-stone-100 md:text-xl"
                    placeholder="Studio, company or project — optional"
                    name="organization"
                    type="text"
                    value={form.organization}
                    onChange={handleChange}
                  />
                </AnimatedField>

                <AnimatedField delay={0.2} className="md:col-span-2">
                  <TextReveal
                    as="label"
                    htmlFor="message"
                    mode="words"
                    className="mb-3 block text-xs font-black uppercase tracking-[0.24em] opacity-80"
                  >
                    Message
                  </TextReveal>

                  <textarea
                    id="message"
                    className="min-h-[220px] w-full resize-none border-b border-stone-700/50 bg-transparent py-5 text-lg font-bold leading-[1.35] outline-none transition duration-500 placeholder:opacity-30 focus:border-stone-900 dark:border-stone-300/40 dark:focus:border-stone-100 md:text-xl"
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
                </AnimatedField>
              </div>

              <FadeIn
                delay={0.18}
                y={24}
                className="mt-12 flex flex-col gap-5 sm:flex-row sm:items-center"
              >
                <button
                  type="submit"
                  disabled={isSending}
                  className="relative w-fit cursor-pointer overflow-hidden border border-[#161310] px-8 py-4 text-sm font-black uppercase tracking-[0.2em] text-[#161310] transition disabled:cursor-not-allowed disabled:opacity-40 dark:border-stone-300 dark:text-stone-300"
                >
                  <WaveLinkText
                    text={isSending ? "Sending..." : "Send message"}
                  />
                </button>

                <p className="max-w-[360px] text-sm font-bold leading-[1.35] opacity-45">
                  Open for freelance and selected collaborations.
                </p>
              </FadeIn>
            </form>
          </div>
        </div>
      </section>
    </SmoothScroll>
  );
};

export default ContactClient;
