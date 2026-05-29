import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL('https://jazguide.com'),
  title: "JAZ | دليل الأعمال والوظائف في جازان",
  description: "منصتك الذكية للعثور على الشركات والوظائف والفرص في جازان",
  icons: {
    icon: '/icon.png',
  },
  openGraph: {
    title: "JAZ | دليل الأعمال والوظائف في جازان",
    description: "منصتك الذكية للعثور على الشركات والوظائف والفرص في جازان",
    url: 'https://jazguide.com',
    siteName: 'JAZ',
    images: [
      {
        url: 'https://gpnkutppljklfwzmzhag.supabase.co/storage/v1/object/public/company-logos/logo.jpg',
        width: 800,
        height: 800,
        alt: 'JAZ - دليل جازان',
      },
    ],
    locale: 'ar_SA',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "JAZ | دليل الأعمال والوظائف في جازان",
    description: "منصتك الذكية للعثور على الشركات والوظائف والفرص في جازان",
    images: ['https://gpnkutppljklfwzmzhag.supabase.co/storage/v1/object/public/company-logos/logo.jpg'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <body>{children}</body>
    </html>
  );
}