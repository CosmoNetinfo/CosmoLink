import type { Metadata } from "next";
import { Outfit, DM_Sans, Syne, Playfair_Display, Space_Mono, Nunito } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  display: "swap",
});

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "CosmoLink — Il tuo universo di link",
  description:
    "CosmoLink è la piattaforma link-in-bio definitiva: personalizza la tua pagina, traccia le visite, condividi i tuoi link in stile cosmico.",
  keywords: ["link in bio", "linktree alternative", "cosmolink", "link aggregator"],
  icons: {
    icon: '/mascot-favicon.png',
    apple: '/mascot-favicon.png',
    shortcut: '/mascot-favicon.png',
  },
  openGraph: {
    title: "CosmoLink — Il tuo universo di link",
    description:
      "CosmoLink è la piattaforma link-in-bio definitiva: personalizza la tua pagina, traccia le visite, condividi i tuoi link in stile cosmico.",
    url: "https://cosmo-link.vercel.app",
    siteName: "CosmoLink",
    images: [
      {
        url: "/mascot-favicon.png",
        width: 711,
        height: 721,
        alt: "CosmoLink Mascot",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "CosmoLink — Il tuo universo di link",
    description:
      "CosmoLink è la piattaforma link-in-bio definitiva: personalizza la tua pagina, traccia le visite, condividi i tuoi link in stile cosmico.",
    images: ["/mascot-favicon.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const fontVars = [
    outfit.variable,
    dmSans.variable,
    syne.variable,
    playfair.variable,
    spaceMono.variable,
    nunito.variable,
  ].join(" ");

  return (
    <html lang="it" className={`${fontVars} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
