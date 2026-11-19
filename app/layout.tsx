import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Kalaivani | Real Estate Lead Management System (LMS)',
  description: 'Enterprise Real Estate CRM and Lead Management Platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-slate-50 text-slate-900 selection:bg-blue-600 selection:text-white" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
