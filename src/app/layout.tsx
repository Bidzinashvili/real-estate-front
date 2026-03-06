import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";


const inter = Inter({ subsets: ["latin"] });

const metadata: Metadata = {
  title: "Real Estate App",
  description: "Real estate application built with Next.js and FSD architecture",
};

function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Script
          src="https://accounts.google.com/gsi/client"
          async
          defer
          strategy="beforeInteractive"
        />
        {children}
      </body>
    </html>
  );
}

export { metadata };
export default RootLayout;
