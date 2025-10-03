"use client";

import Hero from "@/components/Hero";

import ScrollSection from "@/components/SmoothScroll";

export default function Home() {
  return (
    <ScrollSection>
      <div className=" relative">
        <Hero />
      </div>
    </ScrollSection>
  );
}
