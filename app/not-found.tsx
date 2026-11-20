import React from 'react';
import Link from 'next/link';
import { Home, AlertTriangle } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-[#FAF5EC] text-[#8C6228] flex items-center justify-center mb-4">
        <AlertTriangle className="w-8 h-8" />
      </div>
      <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">404 - Page Not Found</h1>
      <p className="text-sm text-slate-500 max-w-md mt-2 mb-6">
        The real estate property, page, or dashboard resource you requested does not exist or has been relocated.
      </p>
      <Link href="/dashboard" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#0C141F] text-[#C59B63] font-medium text-sm hover:bg-[#16202E] border border-[#C59B63]/30 transition-colors">
        <Home className="w-4 h-4" />
        Return to Dashboard
      </Link>
    </div>
  );
}
