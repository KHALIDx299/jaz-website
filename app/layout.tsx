import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'JAZ | دليل الأعمال والوظائف في جازان',
  description: 'منصة JAZ - الدليل الأول للشركات والوظائف والفرص الاستثمارية في منطقة جازان. اكتشف +35 شركة في مختلف القطاعات.',
  keywords: ['جازان', 'دليل جازان', 'شركات جازان', 'وظائف جازان', 'JAZ', 'jazguide'],

  openGraph: {
    title: 'JAZ | دليل الأعمال والوظائف في جازان',
    description: 'منصتك الذكية للعثور على الشركات والوظائف والفرص في جازان',
    url: 'https://jazguide.com',
    siteName: 'JAZ - دليل جازان',
    images: [
      {
        url: 'https://jazguide.com/logo.png',
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
    title: 'JAZ | دليل الأعمال والوظائف في جازان',
    description: 'منصتك الذكية للعثور على الشركات والوظائف والفرص في جازان',
    images: ['https://jazguide.com/logo.png'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ar" dir="rtl">
      <body>{children}</body>
    </html>
  )
}