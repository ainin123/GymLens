import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

/* ── Font ──────────────────────────────────────────────────────────────────── */
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

/* ── Metadata ──────────────────────────────────────────────────────────────── */
export const metadata: Metadata = {
  metadataBase: new URL("https://gymlens.ai"),
  title: {
    default: "GymLens AI – Find Your Perfect Gym",
    template: "%s | GymLens AI",
  },
  description:
    "AI-powered gym discovery platform. Get instant AI scores, personalised recommendations, and transparent insights to find the perfect gym in your city.",
  keywords: [
    "gym finder",
    "gym discovery",
    "AI gym recommendations",
    "best gym Pakistan",
    "gym Karachi",
    "gym Lahore",
    "gym Islamabad",
    "fitness centre",
    "GymLens",
  ],
  authors: [{ name: "GymLens AI" }],
  creator: "GymLens AI",
  openGraph: {
    type: "website",
    locale: "en_PK",
    url: "https://gymlens.ai",
    siteName: "GymLens AI",
    title: "GymLens AI – Find Your Perfect Gym",
    description:
      "AI-powered gym discovery platform for Pakistan. Compare gyms, read AI summaries, and book the perfect membership.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "GymLens AI – Find Your Perfect Gym",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "GymLens AI – Find Your Perfect Gym",
    description:
      "AI-powered gym discovery for Pakistan. Smart scores, personalised picks, zero guesswork.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico",   sizes: "any" },
      { url: "/icon.svg",      type: "image/svg+xml" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  manifest: "/site.webmanifest",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)",  color: "#030712" },
    { media: "(prefers-color-scheme: light)", color: "#030712" },
  ],
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

/* ── Root Layout ───────────────────────────────────────────────────────────── */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} h-full`}
      suppressHydrationWarning
    >
      <body
        className={`
          ${inter.className}
          min-h-full
          bg-gray-950
          text-white
          antialiased
          selection:bg-violet-600/30
          selection:text-white
        `}
      >
        {/* Global background decorations */}
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
        >
          {/* Top-left radial glow */}
          <div
            className="absolute -top-40 -left-40 h-[600px] w-[600px] rounded-full
                        bg-violet-600/10 blur-[120px]"
          />
          {/* Bottom-right radial glow */}
          <div
            className="absolute -bottom-40 -right-40 h-[600px] w-[600px] rounded-full
                        bg-indigo-600/10 blur-[120px]"
          />
          {/* Subtle grid overlay */}
          <div className="absolute inset-0 bg-grid-pattern opacity-40" />
        </div>

        {/* Page content */}
        <div className="relative flex min-h-dvh flex-col">
          {children}
        </div>
      </body>
    </html>
  );
}
