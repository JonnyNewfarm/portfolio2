import type { Metadata } from "next";
import { Anton } from "next/font/google";
import "./globals.css";

import Navbar from "@/components/Navbar";
import { Toaster } from "react-hot-toast";
import Footer from "@/components/Footer";
import { ThemeProvider } from "@/components/ThemeProvider";

const anton = Anton({
  subsets: ["latin"],
  variable: "--font-anton",
  weight: "400",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Jonas Nygaard | Portfolio",
  description: "My portfolio",
  icons: {
    icon: "/favicon.ico?v=2",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`
          font-satoshi ${anton.variable}
          bg-[#fbfafa] text-[#161310]
          dark:bg-[#2e2b2b] dark:text-stone-300
        `}
      >
        <ThemeProvider>
          <div className="w-full min-h-screen">
            <Navbar />
            {children}
            <Footer />
          </div>
        </ThemeProvider>

        <Toaster
          toastOptions={{
            style: {
              background: "#1c1a17",
              color: "#ececec",
              border: "1px solid #ececec",
              fontFamily: "Satoshi, sans-serif",
            },
            success: {
              iconTheme: {
                primary: "#4ade80",
                secondary: "#1c1a17",
              },
            },
            error: {
              iconTheme: {
                primary: "#f87171",
                secondary: "#1c1a17",
              },
            },
          }}
        />
      </body>
    </html>
  );
}
