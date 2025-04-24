import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-m",
  weight: ["400", "700"],
  display: "swap",
});
export const metadata: Metadata = {
  title: "JN - Portfolio",
  description: "My portfolio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={montserrat.variable}>
      <body className="font-sans">
        <div className="w-full min-h-screen">
          <Navbar />
          {children}
          <Footer />
        </div>
      </body>
    </html>
  );
}
