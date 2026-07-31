import ContactTextReveal from "./ContactTextReveal";

export default function ContactHeader() {
  return (
    <div
      className="
        mb-16
        grid
        grid-cols-1
        gap-8
        md:grid-cols-[1.2fr_0.8fr]
        md:items-end
        lg:mb-24
      "
    >
      <div>
        <ContactTextReveal
          as="p"
          mode="words"
          delay={0.05}
          className="
            mb-2
            text-xs
            uppercase
            tracking-[0.28em]
            opacity-80
          "
        >
          Contact / Availability
        </ContactTextReveal>

        <ContactTextReveal
          as="h1"
          mode="lines"
          delay={0.12}
          className="
            max-w-[1250px]
            text-[11vw]
            font-black
            uppercase
            leading-[0.86]
            tracking-[-0.045em]
            sm:text-[14vw]
            md:text-[10vw]
            lg:text-[8vw]
          "
        >
          {"Let's build\nsomething\nuseful."}
        </ContactTextReveal>
      </div>
    </div>
  );
}
