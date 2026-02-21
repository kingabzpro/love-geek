import { ClerkProvider } from '@clerk/nextjs';
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Tinder for Geeks',
  description: 'Find your perfect co-founder in life.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className="antialiased bg-gray-50 text-gray-900 min-h-screen" suppressHydrationWarning>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
