import type { Metadata } from 'next';
import { Inter, Cinzel } from 'next/font/google';
import './globals.css';
import AppProviders from '@/components/providers/AppProviders';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
});

const cinzel = Cinzel({
  variable: '--font-cinzel',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'A Cosmic Love & Birthday Journey',
  description: 'An interactive 3D birthday experience built with React Three Fiber, GSAP, and Next.js',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${cinzel.variable} h-full antialiased dark`}>
      <body className="min-h-full h-full w-full overflow-hidden bg-black text-white" suppressHydrationWarning>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
