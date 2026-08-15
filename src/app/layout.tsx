import type { Metadata } from "next";
import { Noto_Sans_Georgian } from "next/font/google";
import Script from "next/script";
import { ThemeProvider } from "@/shared/theme/ThemeProvider";
import { THEME_INIT_SCRIPT } from "@/shared/theme/themeStorage";
import "./globals.css";

const notoSansGeorgian = Noto_Sans_Georgian({
  subsets: ["georgian", "latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const metadata: Metadata = {
  title: "უძრავი ქონება",
  description: "უძრავი ქონების CRM სისტემა",
};

function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ka" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body className={notoSansGeorgian.className}>
        <Script
          src="https://accounts.google.com/gsi/client"
          async
          defer
          strategy="beforeInteractive"
        />
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}

export { metadata };
export default RootLayout;
