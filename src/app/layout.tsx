import "@/styles/reset.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter"
});

export const metadata: Metadata = {
  title: "Pixly",
  description: "Simple and intuitive web-based pixel art editor."
};

const RootLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => (
  <html lang="en" className={inter.variable}>
    <body className="flex min-h-[100vh] items-center justify-center bg-[#171717] font-sans text-xs leading-relaxed antialiased">
      <main className="m-6 max-w-[calc(100%-1.5rem)] rounded-xl bg-[#EBEBE6] p-3 text-[#171717] shadow-xl md:w-[64rem] lg:aspect-video">
        {children}
      </main>
      <Script
        defer
        data-domain="pixly.art"
        src="https://plausible.io/js/script.js"
      />
    </body>
  </html>
);

export default RootLayout;
