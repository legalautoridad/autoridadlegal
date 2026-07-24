import type { Metadata } from "next";
import { Geist, Geist_Mono, Montserrat, Inter, Source_Serif_4 } from "next/font/google";
import "./globals.css";
import { Suspense } from "react";
import { ChatWidget } from "@/components/chat/ChatWidget";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const sourceSerif4 = Source_Serif_4({
  variable: "--font-source-serif-4",
  subsets: ["latin"],
  weight: ["400", "600"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.autoridad.legal"),
  title: "Autoridad Legal | Plataforma Jurídica",
  description: "Plataforma de alto rendimiento para servicios legales de alta especialización.",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", type: "image/png", sizes: "512x512" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${montserrat.variable} ${inter.variable} ${sourceSerif4.variable} antialiased`}
        suppressHydrationWarning={true}
      >
        <Header />
        {children}
        <Suspense fallback={null}>
          <ChatWidget />
        </Suspense>
        <Footer />
      </body>
    </html>
  );
}
