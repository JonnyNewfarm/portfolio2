"use client";

import Hero from "@/components/Hero";

import ScrollSection from "@/components/SmoothScroll";
import ThemeWrapper from "@/components/ThemeWrapper";

export default function Home() {
  return (
    <ScrollSection>
      <div className=" relative">
        <ThemeWrapper>
          <Hero />
        </ThemeWrapper>
      </div>
    </ScrollSection>
  );
}
