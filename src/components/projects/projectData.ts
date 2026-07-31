import type { Project } from "./projectsTypes";

export const projects: Project[] = [
  {
    title: "Kerimov Designs",
    year: "2026",
    category: "Web Design & Branding",
    link: "https://kerimovdesigns.com",
    about:
      "Portfolio website for graphic designer Rustam Kerimov.",
    stack:
      "React, Next.js, Prisma, GSAP, Motion, TailwindCSS, MongoDB, Uploadthing, NextAuth.",
    role: "Design, frontend and backend.",
    images: [
      "rustam-01.jpg",
      "rustam-03.jpg",
      "rustam-02.jpg",
      "rustam-04.jpg",
    ],
  },
  {
    title: "Calero Studio",
    year: "2026",
    category: "E-commerce",
    link: "https://www.calero.studio/",
    about:
      "E-commerce product page with visual direction, product storytelling and smooth motion.",
    stack:
      "React, Prisma, Three.js, GSAP, TailwindCSS, Neon, Stripe.",
    role:
      "Design, frontend, backend, Stripe and motion.",
    images: [
      "calero-studio-1.jpg",
      "calero-studio-02.jpg",
      "calero-studio-03.jpg",
      "calero-studio-04.jpg",
    ],
  },
];