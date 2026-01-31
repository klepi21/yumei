import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

import { Providers } from './providers';

export const metadata: Metadata = {
  title: 'YUMEI (夢映) | The Premier AI Comic & Manga Creator',
  description: 'Turn your scripts into professional manga and comics instantly with YUMEI. The world\'s most advanced AI-powered sequential art engine for creators, storytellers, and dreamers.',
  keywords: [
    'AI comic generator',
    'AI manga creator',
    'AI manga generator',
    'AI comic maker',
    'text to comic AI',
    'AI webtoon creator',
    'AI story to comic',
    'best AI manga generator 2026',
    'AI graphic novel creator',
    'AI anime art generator'
  ],
  authors: [{ name: 'YUMEI Studio' }],
  viewport: 'width=device-width, initial-scale=1',
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://yumei.ai', // Replace with actual domain if different
    title: 'YUMEI (夢映) | AI-Powered Comic Studio',
    description: 'The world\'s most advanced AI engine for manga and comic creation. Instant neural activation for your stories.',
    siteName: 'YUMEI',
    images: [
      {
        url: '/assets/og-image.png',
        width: 1200,
        height: 630,
        alt: 'YUMEI AI Comic Generator - Japanese Minimalist Studio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'YUMEI (夢映) | AI Manga Engine',
    description: 'Transform your scripts into professional comics with neural speed.',
    images: ['/assets/og-image.png'],
    creator: '@yumei_studio',
  },
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon.ico',
    apple: '/favicon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": "YUMEI",
              "operatingSystem": "Web",
              "applicationCategory": "MultimediaApplication",
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.9",
                "ratingCount": "1204"
              },
              "offers": {
                "@type": "Offer",
                "price": "0.00",
                "priceCurrency": "USD"
              }
            })
          }}
        />
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
