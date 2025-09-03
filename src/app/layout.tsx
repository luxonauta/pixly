import "./globals.css";

import localFont from "next/font/local";
import Script from "next/script";

const departureMono = localFont({
  display: "swap",
  preload: true,
  src: "../../public/fonts/departure-mono/departure-mono.woff2",
  variable: "--font-departure-mono",
  weight: "400"
});

export const metadata = {
  metadataBase: new URL("https://www.pixly.art"),
  title: {
    default: "Pixly",
    template: "%s • Pixly"
  },
  description: "Free and open tools for effortless pixel assets creation.",
  applicationName: "Pixly",
  category: "Technology",
  author: {
    name: "Lucas de França",
    url: "https://www.luxonauta.com"
  },
  icons: {
    icon: "/favicon.ico"
  },
  alternates: {
    canonical: "/"
  },
  robots: {
    index: true,
    follow: true
  }
};

export const viewport = {
  themeColor: "#222"
};

const RootLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => (
  <html
    lang="en"
    suppressHydrationWarning={true}
    className={departureMono.variable}
  >
    <body>
      {children}
      <Script
        defer
        data-domain="pixly.art"
        src="https://plausible.io/js/script.js"
      />
    </body>
  </html>
);

export default RootLayout;
