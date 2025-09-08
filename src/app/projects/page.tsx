import ProjectsClient from "@/components/ProjectsClient";
import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Jonas Nygaard | Projects",
  description:
    "Explore the projects and works of Jonas Nygaard, showcasing design and development skills.",
  icons: {
    icon: "/favicon.ico",
  },
};

const page = () => {
  return <ProjectsClient />;
};

export default page;
