import Hero from "@/components/Hero";

import TextOnScroll from "@/components/TextOnScroll";
import MyProjects from "@/components/MyProjects";
import Contact from "@/components/Contact";

export default function Home() {
  return (
    <div>
      <Hero />

      <TextOnScroll />
      <Contact />

      <MyProjects />

      <div className="h-screen bg-[#ecebeb]"></div>
    </div>
  );
}
