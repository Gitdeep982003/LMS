import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import './globals.css';

const poppins = Poppins({
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-poppins',
});

export const metadata: Metadata = {
  title: 'Kalaivani Real Estate | Lead Management System (LMS)',
  description: 'Your Dream Property, Our Commitment. Real Estate CRM & Brokerage Platform',
  icons: {
    icon: '/kalaivani-logo.png',
    shortcut: '/kalaivani-logo.png',
    apple: '/kalaivani-logo.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={poppins.variable} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`${poppins.className} min-h-screen bg-[#FAF8F5] text-[#0C141F] selection:bg-[#C59B63] selection:text-white font-sans`} suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
