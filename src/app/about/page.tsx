import AboutClient from "@/components/AboutClient";
import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Jonas Nygaard | About",
  description:
    "Learn more about Jonas Nygaard, a designer and developer passionate about creating engaging digital experiences.",
  icons: {
    icon: "/favicon.ico",
  },
};

const page = () => {
  return <AboutClient />;
};

export default page;
