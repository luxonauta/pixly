import "@/styles/reset.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

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
    <body className="flex min-h-[100vh] items-center justify-center bg-[#C03440] font-sans text-sm antialiased">
      <main className="m-6 aspect-video max-w-[calc(100%-1.5rem)] rounded-3xl bg-[#EBEBE6] p-3 text-[#171717] shadow-xl md:w-[64rem]">
        {children}
      </main>
    </body>
  </html>
);

export default RootLayout;
