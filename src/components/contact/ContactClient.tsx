"use client";

import SmoothScroll from "@/components/SmoothScroll";

import ContactDetails from "./ContactDetails";
import ContactForm from "./ContactForm";
import ContactHeader from "./ContactHeader";

export default function ContactClient() {
  return (
    <SmoothScroll>
      <section
        className="
          min-h-screen
          w-full
          overflow-hidden
          px-4
          pb-12
          pt-28
          bg-[#ececec] 
text-[#211f1e]
dark:bg-[#1e1c1a]
dark:text-[#e7e3dd]
          sm:px-8
          md:px-10
          lg:px-16
          lg:pt-36
        "
      >
        <div
          className="
            mx-auto
            w-full
            max-w-[1800px]
          "
        >
          <ContactHeader />

          <div
            className="
              grid
              grid-cols-1
              gap-14
              lg:grid-cols-[0.72fr_1.28fr]
              lg:gap-16
            "
          >
            <ContactDetails />

            <ContactForm />
          </div>
        </div>
      </section>
    </SmoothScroll>
  );
}
