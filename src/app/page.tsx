import Hero from "@/components/Hero";

import TextOnScroll from "@/components/TextOnScroll";
import ScrollSection from "@/components/SmoothScroll";
import MyProjects from "@/components/MyProjects";
import Contact from "@/components/Contact";

export default function Home() {
  return (
    <ScrollSection>
      <Hero />

      <TextOnScroll />
      <Contact />

      <MyProjects />
    </ScrollSection>
  );
}
