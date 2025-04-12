import Hero from "@/components/Hero";
import ScrollText from "@/components/ScrollText";
import Image from "next/image";
import TextOnScroll from "@/components/TextOnScroll";
import ScrollSection from "@/components/SmoothScroll";
import BgImg from "@/components/BgImg";
import MyProjects from "@/components/MyProjects";
import Contact from "@/components/Contact";

export default function Home() {
  return (
    <ScrollSection>
      <Hero />

      <TextOnScroll />
      <Contact />

      <MyProjects />
      <BgImg />

      <div className="h-screen bg-[#ecebeb]"></div>
    </ScrollSection>
  );
}
