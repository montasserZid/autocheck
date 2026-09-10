import type { Metadata } from "next";
import "./globals.css";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";

export const metadata: Metadata = {
  title: {
    default: "AutoCheck QC - Used-Car Pre-Screening in Montreal",
    template: "%s | AutoCheck QC"
  },
  icons: {
    icon: "/favicon.svg"
  },
  description:
    "AI-assisted used-car pre-screening and mobile inspection booking for Montreal and Quebec buyers."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-CA">
      <body>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
