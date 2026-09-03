import type { Metadata } from "next";
import { Inter, Poppins, Source_Serif_4 } from "next/font/google";
import "./globals.css";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import ImageLightbox from "@/components/ImageLightbox";
import HashScroll from "@/components/HashScroll";

// The site runs the typography of tides.ethanyanxu.com, where the paper lives:
// Source Serif 4 carries every display line, Inter the body copy and labels.
const sourceSerif = Source_Serif_4({
  variable: "--font-source-serif",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

// Stands in for Lulo Clean, the licensed caps-only face used by the wordmark
// this design references. Poppins is the nearest free geometric equivalent:
// circular bowls, even stroke, and it holds up set in all caps.
const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Ethan Yan Xu",
  description: "Ethan's portfolio website for showcasing his software projects",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Scroll reveals are JS-driven; without JS the content must not stay hidden. */}
        <noscript>
          <style>{`.reveal{opacity:1 !important;transform:none !important}`}</style>
        </noscript>
      </head>
      <body
        className={`${sourceSerif.variable} ${inter.variable} ${poppins.variable} antialiased flex min-h-screen flex-col bg-[var(--cream)] text-[var(--ink)]`}
      >
        <Navbar />
        <main className="flex-grow">{children}</main>
        <Footer />
        {/* One delegated listener enlarges any image on the site. */}
        <ImageLightbox />
        {/* Anchors land correctly even before the pictures above them load. */}
        <HashScroll />
      </body>
    </html>
  );
}
