"use client";

import Hero from "@/components/Hero";
import HeroSectionWithLoader from "@/components/HeroWrapper";

import ScrollSection from "@/components/SmoothScroll";

export default function Home() {
  return (
    <ScrollSection>
      <div className=" relative">
        <HeroSectionWithLoader />
      </div>
    </ScrollSection>
  );
}
