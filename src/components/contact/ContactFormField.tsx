import type { ChangeEventHandler } from "react";

import ContactTextReveal from "./ContactTextReveal";
import { AnimatedField } from "./ContactMotion";

type ContactFormFieldProps = {
  id: string;
  name: string;
  label: string;
  placeholder: string;
  value: string;
  delay: number;
  error?: string;
  submitted: boolean;
  type?: "text" | "email";
  textarea?: boolean;
  required?: boolean;
  className?: string;
  onChangeAction: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
};

export default function ContactFormField({
  id,
  name,
  label,
  placeholder,
  value,
  delay,
  error,
  submitted,
  type = "text",
  textarea = false,
  required = false,
  className = "",
  onChangeAction,
}: ContactFormFieldProps) {
  return (
    <AnimatedField delay={delay} className={className}>
      <ContactTextReveal
        as="label"
        htmlFor={id}
        mode="words"
        className="
          mb-3
          block
          text-lg
          font-black
          uppercase
          tracking-[0.24em]
          opacity-80
        "
      >
        {label}
      </ContactTextReveal>

      {textarea ? (
        <textarea
          id={id}
          name={name}
          value={value}
          onChange={onChangeAction}
          placeholder={placeholder}
          required={required}
          aria-invalid={submitted && Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          className="
            min-h-[220px]
            w-full
            resize-none
            border-b
            border-stone-700/50
            bg-transparent
            py-5
            text-lg
            tracking-[0.05em]
            font-bold
            leading-[1.35]
            outline-none
            transition
            duration-500
            placeholder:opacity-90
            focus:border-stone-900
            dark:border-stone-300/40
            dark:focus:border-stone-100
            md:text-xl
          "
        />
      ) : (
        <input
          id={id}
          name={name}
          type={type}
          value={value}
          onChange={onChangeAction}
          placeholder={placeholder}
          required={required}
          aria-invalid={submitted && Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          className="
            w-full
            border-b
            border-stone-700/50
            bg-transparent
            py-5
            text-lg
            tracking-[0.05em]
            font-bold
            outline-none
            transition
            duration-500
            placeholder:opacity-90
            focus:border-stone-900
            dark:border-stone-300/40
            dark:focus:border-stone-100
            md:text-xl
          "
        />
      )}

      {submitted && error ? (
        <p
          id={`${id}-error`}
          className="
            mt-3
            text-sm
            font-bold
            text-red-600
          "
        >
          {error}
        </p>
      ) : null}
    </AnimatedField>
  );
}
