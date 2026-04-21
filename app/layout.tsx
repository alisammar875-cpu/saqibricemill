
import { ThemeProvider } from '@/components/providers/ThemeProvider'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'sonner'
import React from 'react'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  metadataBase: new URL('https://saqibricemills.com'),
  title: { default: 'Saqib Rice Mills | Pakistan\'s Finest Premium Rice', template: '%s | Saqib Rice Mills' },
  description: 'Buy premium basmati, super basmati, and specialty rice direct from Saqib Rice Mills factory, Gujranwala. ISO 9001 certified, halal, shipped across Pakistan and exported to 42 countries.',
  keywords: ['basmati rice', '1121 basmati', 'Pakistani rice', 'buy rice online', 'saqib rice mills', 'premium rice Pakistan'],
  openGraph: {
    type: 'website',
    siteName: 'Saqib Rice Mills',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Saqib Rice Mills Premium Rice' }],
  },
  twitter: { card: 'summary_large_image', site: '@saqibricemills' },
  robots: { index: true, follow: true },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} antialiased font-sans bg-warm text-charcoal`}>
        <ThemeProvider>
          {children}
          <Toaster position="bottom-right" richColors />
        </ThemeProvider>
      </body>
    </html>
  )
}
