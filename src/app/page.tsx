"use client";

import Hero from "@/components/Hero";

import TextOnScroll from "@/components/TextOnScroll";
import ScrollSection from "@/components/SmoothScroll";
import MyProjects from "@/components/MyProjects";
import Contact from "@/components/Contact";
import { useState } from "react";
import PreLoadingShow from "@/components/PreLoadingShow";
import { AnimatePresence } from "framer-motion";

export default function Home() {
  const [loading, setLoading] = useState(true);

  setTimeout(() => {
    setLoading(false);
    document.body.style.cursor = "default";
    window.scrollTo(0, 0);
  }, 2000);
  return (
    <ScrollSection>
      <div className="border-b-[1px] border-[#161310]">
        <AnimatePresence mode="wait">
          {loading && <PreLoadingShow />}
        </AnimatePresence>
        <Hero />

        <TextOnScroll />
        <MyProjects />
        <Contact />
      </div>
    </ScrollSection>
  );
}
