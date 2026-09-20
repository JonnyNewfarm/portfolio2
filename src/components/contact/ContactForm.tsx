import { useState, type ChangeEvent, type FormEvent } from "react";
import { toast } from "react-hot-toast";

import ContactFormField from "./ContactFormField";
import ContactTextReveal from "./ContactTextReveal";
import { FadeIn } from "./ContactMotion";

import type { ContactFormData, ContactValidationErrors } from "./contactTypes";

import { EMPTY_CONTACT_FORM, validateContactForm } from "./contactUtils";

export default function ContactForm() {
  const [form, setForm] = useState<ContactFormData>(EMPTY_CONTACT_FORM);

  const [validationErrors, setValidationErrors] =
    useState<ContactValidationErrors>({});

  const [submitted, setSubmitted] = useState(false);

  const [isSending, setIsSending] = useState(false);

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.currentTarget;

    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));

    const fieldName = name as keyof ContactValidationErrors;

    if (validationErrors[fieldName]) {
      setValidationErrors((currentErrors) => ({
        ...currentErrors,
        [fieldName]: undefined,
      }));
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setSubmitted(true);

    const errors = validateContactForm(form);

    setValidationErrors(errors);

    if (Object.keys(errors).length > 0) {
      return;
    }

    setIsSending(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(form),
      });

      const data: {
        success?: boolean;
      } = await response.json();

      if (!response.ok || !data.success) {
        toast.error("Something went wrong. Please try again.");

        return;
      }

      setForm(EMPTY_CONTACT_FORM);
      setValidationErrors({});
      setSubmitted(false);

      toast.success("Message sent successfully!");
    } catch {
      toast.error("Network error. Please try again later.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="order-1 lg:order-2">
      <div
        className="
          mb-10
          flex
          items-end
          justify-between
          gap-8
          border-b
          border-stone-400/30
          pb-5
          dark:border-stone-200/20
        "
      >
        <div>
          <ContactTextReveal
            as="h2"
            mode="lines"
            delay={0.05}
            className="
              text-[8.5vw]
              font-semibold
              uppercase
              leading-[0.9]
              tracking-[0.01em]
              sm:text-[7vw]
              md:text-[4vw]
              lg:text-[2vw]
            "
          >
            Start here
          </ContactTextReveal>
        </div>
        <ContactTextReveal
          as="p"
          mode="words"
          delay={0.16}
          className="
            hidden
            max-w-[260px]
            text-right
            text-2xl
            leading-[1.35]
            md:block
          "
        >
          Tell me what you need, what exists already and what the goal is.
        </ContactTextReveal>
      </div>

      <div
        className="
          grid
          grid-cols-1
          gap-x-10
          gap-y-9
          md:grid-cols-2
        "
      >
        <ContactFormField
          id="name"
          name="name"
          label="Name"
          placeholder="Your name"
          value={form.name}
          delay={0.02}
          error={validationErrors.name}
          submitted={submitted}
          required
          onChangeAction={handleChange}
        />

        <ContactFormField
          id="email"
          name="email"
          label="Email"
          placeholder="Your email"
          value={form.email}
          delay={0.08}
          error={validationErrors.email}
          submitted={submitted}
          type="email"
          required
          onChangeAction={handleChange}
        />

        <ContactFormField
          id="organization"
          name="organization"
          label="Organization"
          placeholder="Studio, company or project — optional"
          value={form.organization}
          delay={0.14}
          submitted={submitted}
          className="md:col-span-2"
          onChangeAction={handleChange}
        />

        <ContactFormField
          id="message"
          name="message"
          label="Message"
          placeholder="Tell me about the project..."
          value={form.message}
          delay={0.2}
          error={validationErrors.message}
          submitted={submitted}
          textarea
          required
          className="md:col-span-2"
          onChangeAction={handleChange}
        />
      </div>

      <FadeIn
        delay={0.18}
        y={24}
        className="
          mt-12
          flex
          flex-col
          gap-5
          sm:flex-row
          sm:items-center
        "
      >
        <button
          type="submit"
          disabled={isSending}
          className="
            group
            relative
            w-fit
            cursor-pointer
            overflow-hidden
            border-2
            border-[#161310]
            px-6
            py-3
            text-lg
            sm:text-xl
            font-bold
            uppercase
            tracking-[0.2em]
            text-[#161310]
            transition-colors
            duration-500
            ease-[cubic-bezier(0.76,0,0.24,1)]
            hover:text-[#fbfafa]
            disabled:cursor-not-allowed
            disabled:opacity-40
            dark:border-stone-300
            dark:text-stone-300
            dark:hover:text-[#1e1c1c]
          "
        >
          <span
            className="
              absolute
              inset-0
              origin-bottom
              scale-y-0
              bg-[#161310]
              transition-transform
              duration-500
              ease-[cubic-bezier(0.76,0,0.24,1)]
              group-hover:scale-y-100
              dark:bg-stone-300
            "
          />

          <span className="relative z-10">
            {isSending ? "Sending..." : "Send message"}
          </span>
        </button>

        <p
          className="
            max-w-[360px]
            text-3xl
            font-normal
            leading-[1.35]
          "
        >
          Open for collaborations.
        </p>
      </FadeIn>
    </form>
  );
}
