import type { Metadata, Viewport } from 'next';
import { Poppins, PT_Sans } from 'next/font/google';
import './globals.css';
import { AppProviders } from '@/components/AppProviders';

const poppins = Poppins({
  weight: ['400', '600', '700'],
  subsets: ['latin'],
  variable: '--font-poppins',
});

const ptSans = PT_Sans({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-pt-sans',
});

export const metadata: Metadata = {
  title: 'NutriJoy | Happy Calorie Tracking',
  description: 'Swift, mobile-first food and calorie tracking for a healthier you.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'NutriJoy',
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  themeColor: '#F9F4F3',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${poppins.variable} ${ptSans.variable}`}>
      <body className="font-body antialiased selection:bg-primary/20 bg-background min-h-screen">
        <AppProviders>
          {children}
        </AppProviders>
      </body>
    </html>
  );
}