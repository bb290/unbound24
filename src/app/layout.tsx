import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.unbound24.com"),
  title: "Own Your 24 | A free course for home service owners",
  description:
    "A free, simple course for plumbers, electricians, HVAC techs and roofers. Write down how your business runs, one short lesson at a time, with Claude doing the writing.",
  // Every page gets a feature image for link previews (and later SEO); pages with their own card override this.
  openGraph: { siteName: "Unbound24", type: "website", images: [{ url: "/og/home.png", width: 1200, height: 630, alt: "Own Your 24: free courses for home service owners" }] },
  twitter: { card: "summary_large_image", images: ["/og/home.png"] },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${nunito.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
