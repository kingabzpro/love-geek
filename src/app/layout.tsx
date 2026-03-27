import { ClerkProvider } from '@clerk/nextjs';
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { clerkAppearance } from '@/lib/clerk-appearance';
import './globals.css';

const geistSans = Geist({ subsets: ['latin'], variable: '--font-geist-sans' });
const geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-geist-mono' });

export const metadata: Metadata = {
  title: 'GeekMatch — Find Your Player 2',
  description: 'The dark-mode-first dating app for geeks.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider appearance={clerkAppearance}>
      <html lang="en" suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable}`}>
        <body className="antialiased bg-background text-text min-h-screen" suppressHydrationWarning>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
