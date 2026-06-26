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
  title: "Autoridad Legal | Plataforma Jurídica",
  description: "Plataforma de alto rendimiento para servicios legales.",
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LegalService",
              "name": "Autoridad Legal",
              "legalName": "Autoridad Legal S.L.",
              "taxID": "B-12345678",
              "telephone": "+34 900 000 000",
              "email": "legal@autoridadlegal.com",
              "url": "https://autoridadlegal.com",
              "image": "https://autoridadlegal.com/logo.png",
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "Barcelona",
                "addressCountry": "ES"
              },
              "sameAs": [
                "https://www.linkedin.com/company/autoridad-legal",
                "https://twitter.com/autoridadlegal"
              ],
              "paymentAccepted": "Credit Card, Stripe",
              "priceRange": "900€ - 1500€",
              "openingHoursSpecification": [
                {
                  "@type": "OpeningHoursSpecification",
                  "dayOfWeek": [
                    "Monday",
                    "Tuesday",
                    "Wednesday",
                    "Thursday",
                    "Friday"
                  ],
                  "opens": "09:00",
                  "closes": "20:00"
                }
              ]
            })
          }}
        />
      </body>
    </html>
  );
}
