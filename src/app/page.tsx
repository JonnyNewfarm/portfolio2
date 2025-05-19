"use client";

import Hero from "@/components/Hero";

import TextOnScroll from "@/components/TextOnScroll";
import ScrollSection from "@/components/SmoothScroll";
import MyProjects from "@/components/MyProjects";
import Contact from "@/components/Contact";
import { useState } from "react";

export default function Home() {
  return (
    <ScrollSection>
      <div className="border-b-[1px] border-[#161310]">
        <Hero />

        <TextOnScroll />
        <MyProjects />
        <Contact />
      </div>
    </ScrollSection>
  );
}
