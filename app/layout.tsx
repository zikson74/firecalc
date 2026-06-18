import type { Metadata } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://firecalc.pl"),
  title: "FireCalc.pl — Kalkulator Wolności Finansowej i Symulatora FIRE",
  description:
    "Oblicz, kiedy osiągniesz wolność finansową dzięki procentowi składanemu i regule 4%. Bezpłatny kalkulator FIRE, symulacja dywidend i rentierstwa.",
  keywords: [
    "kalkulator FIRE",
    "wolność finansowa kalkulator",
    "procent składany kalkulator",
    "rentierstwo symulacja",
    "emerytura dywidendowa",
    "reguła 4 procent",
    "kalkulator inwestycji",
    "niezależność finansowa",
    "symulator FIRE Polska",
  ],
  openGraph: {
    title: "FireCalc.pl — Zaprojektuj swoją wolność finansową",
    description:
      "Interaktywny symulator FIRE. Oblicz datę wolności finansowej na podstawie swoich oszczędności i inwestycji.",
    url: "https://firecalc.pl",
    siteName: "FireCalc.pl",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
    locale: "pl_PL",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "FireCalc.pl — Kalkulator Wolności Finansowej",
    description: "Oblicz swoją datę wolności finansowej. Bezpłatny symulator FIRE.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl" className={`${inter.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#0B0F19] text-[#F9FAFB]">{children}</body>
    </html>
  );
}
