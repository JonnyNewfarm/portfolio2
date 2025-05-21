import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Toaster } from "react-hot-toast";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-m",
  weight: ["400", "700"],
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
          <Toaster
            toastOptions={{
              style: {
                background: "#1c1a17",
                color: "#ececec",
                border: "1px solid #ececec",
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
        </div>
      </body>
    </html>
  );
}
