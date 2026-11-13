import type { Metadata } from "next";
import { DM_Mono, Figtree, Rubik } from "next/font/google";
import "./globals.css";

const rubik = Rubik({ variable: "--font-rubik", subsets: ["latin"], weight: ["700", "800"] });
const figtree = Figtree({ variable: "--font-figtree", subsets: ["latin"] });
const dmMono = DM_Mono({ variable: "--font-dm-mono", subsets: ["latin"], weight: ["400", "500"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://www.unbound24.com"),
  title: "Unbound24 | Marketing for local service businesses",
  description:
    "We help local service business owners connect with the people they can help the most: a website that books jobs, a steady presence every week, and reviews on repeat.",
  // Every page gets a feature image for link previews (and later SEO); pages with their own card override this.
  openGraph: { siteName: "Unbound24", type: "website", images: [{ url: "/og/home.png", width: 1200, height: 630, alt: "Unbound24" }] },
  twitter: { card: "summary_large_image", images: ["/og/home.png"] },
};

// Sets the saved theme before first paint so the page never flashes the wrong one.
const THEME_INIT = `try{var t=localStorage.getItem("ub-theme");if(t==="light"||t==="dark")document.documentElement.dataset.theme=t}catch(e){}`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${rubik.variable} ${figtree.variable} ${dmMono.variable} h-full antialiased`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT }} />
      </head>
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
