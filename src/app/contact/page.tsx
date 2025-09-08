import React from "react";
import ContactClient from "@/components/ContactClient";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Jonas Nygaard | Contact",
  description:
    "Get in touch with Jonas Nygaard for collaborations, projects, or inquiries.",
  icons: {
    icon: "/favicon.ico",
  },
};

const page = () => {
  return <ContactClient />;
};

export default page;
