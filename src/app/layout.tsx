import "./globals.css";

import Script from "next/script";

export const metadata = {
  title: "Pixly",
  description: "Free and open tools for effortless pixel assets creation."
};

const RootLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => (
  <html lang="en" suppressHydrationWarning>
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
