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
          as="h1"
          mode="lines"
          delay={0.12}
          className="
            max-w-[1250px]
            text-[11vw]
            font-semibold
            uppercase
            leading-[0.86]
            tracking-[0.0em]
            sm:text-[14vw]
            md:text-[10vw]
            lg:text-[7vw]
          "
        >
          {"Let's build\nsomething useful."}
        </ContactTextReveal>
      </div>
    </div>
  );
}
