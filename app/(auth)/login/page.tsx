'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLmsStore } from '@/store/useLmsStore';
import { defaultUserSessions } from '@/data/initialData';
import {
  Building,
  Eye,
  EyeOff,
  ShieldCheck,
  UserCheck,
  Briefcase,
  ArrowRight,
} from 'lucide-react';
import { UserSession } from '@/types';

type RoleKey = 'admin' | 'manager' | 'executive';

export default function LoginPage() {
  const router = useRouter();
  const { setCurrentUser } = useLmsStore();

  // Role & User State
  const [selectedRole, setSelectedRole] = useState<RoleKey>('admin');
  const [selectedUser, setSelectedUser] = useState<UserSession>(defaultUserSessions.admin);

  // Form Fields
  const [email, setEmail] = useState(defaultUserSessions.admin.email);
  const [password, setPassword] = useState('••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isEntering, setIsEntering] = useState(false);

  // Switch role persona
  const handleSelectRole = (key: RoleKey) => {
    setSelectedRole(key);
    const user = defaultUserSessions[key];
    setSelectedUser(user);
    setEmail(user.email);
    setPassword('••••••••');
  };

  // Form Submit / Launch Dashboard
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEntering(true);
    setCurrentUser(selectedUser);
    setTimeout(() => {
      router.push('/dashboard');
    }, 350);
  };

  return (
    <div className="min-h-screen w-full bg-[#FAF8F5] flex items-center justify-center p-4 sm:p-6 lg:p-8 text-[#0C141F] relative">
      {/* Background Subtle Luxury Ambience */}
      <div className="fixed inset-0 bg-radial from-[#FAF5EC] via-[#FAF8F5] to-[#F2EDE4] pointer-events-none" />

      {/* Main Split-Screen Luxury Card */}
      <div className="relative z-10 w-full max-w-5xl bg-white rounded-3xl overflow-hidden shadow-2xl border border-[#EAE4D9] flex flex-col lg:flex-row">
        {/* ========================================================= */}
        {/* LEFT COLUMN: KALAIVANI HERO BANNER (MATCHES BRANDING)     */}
        {/* ========================================================= */}
        <div className="relative lg:w-7/12 min-h-[380px] lg:min-h-[580px] flex flex-col justify-between p-6 sm:p-10 text-white overflow-hidden bg-[#0C141F]">
          {/* Hero Property Backdrop Image */}
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 hover:scale-105"
            style={{ backgroundImage: `url('/kalaivani-hero.jpg')` }}
          />

          {/* Gradients to match the screenshot readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0C141F]/90 via-[#0C141F]/30 to-[#0C141F]/40" />

          {/* Top-Left: Kalaivani Luxury Brand Emblem */}
          <div className="relative z-20 flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-[#0C141F] border-2 border-[#C59B63] flex items-center justify-center shadow-lg shrink-0">
              <Building className="w-5 h-5 text-[#C59B63]" />
            </div>
            <div>
              <span className="font-poppins font-bold text-lg sm:text-xl tracking-wider text-white block leading-tight">
                KALAIVANI
              </span>
              <span className="text-[10px] text-[#C59B63] font-bold tracking-[0.25em] uppercase block">
                Real Estate
              </span>
            </div>
          </div>

          {/* Bottom-Left: Signature Brand Copy from Uploaded Image */}
          <div className="relative z-20 space-y-4 max-w-lg mt-auto pt-12">
            <div>
              <h2 className="font-poppins text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight drop-shadow-md">
                Your Dream Property,<br />
                <span className="text-[#C59B63] italic">Our Commitment.</span>
              </h2>
              <p className="text-xs sm:text-sm text-stone-200 mt-3 leading-relaxed drop-shadow-sm font-normal">
                From finding the perfect property to complete construction and interiors – we provide end-to-end real estate solutions tailored to your needs.
              </p>
            </div>

            {/* Visual Action Badges from Hero Banner */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0C141F]/90 border border-[#C59B63]/60 text-[11px] font-semibold text-[#C59B63] tracking-wide shadow-sm">
                <span>RERA Approved</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-[11px] font-medium text-white tracking-wide">
                <span>Direct Developer Pricing</span>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* RIGHT COLUMN: REFINED WARM REAL ESTATE PORTAL LOGIN       */}
        {/* ========================================================= */}
        <div className="lg:w-5/12 flex flex-col justify-center p-6 sm:p-8 lg:p-10 bg-[#FAF8F5] text-[#0C141F]">
          <div className="w-full space-y-5">
            {/* Header */}
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#FAF5EC] border border-[#E5D0A6] text-[10px] font-bold text-[#8C6228] uppercase tracking-wider mb-2">
                Enterprise CRM Portal
              </div>
              <h1 className="font-poppins text-2xl sm:text-3xl font-bold text-[#0C141F] tracking-tight">
                Welcome Back
              </h1>
              <p className="text-xs text-stone-600 mt-1">
                Sign in to manage leads, site visits, and property sales
              </p>
            </div>

            {/* Role Persona Switcher Chips */}
            <div className="space-y-1.5 pt-1">
              <label className="text-[10px] font-bold text-[#8C7A63] uppercase tracking-widest block">
                Select Workspace Role
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleSelectRole('admin')}
                  className={`flex flex-col items-center justify-center py-2 px-2 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                    selectedRole === 'admin'
                      ? 'bg-[#FAF5EC] text-[#0C141F] border-2 border-[#C59B63] shadow-xs'
                      : 'bg-white text-stone-700 border-[#EAE4D9] hover:bg-[#FAF8F5] hover:border-[#C59B63]/50'
                  }`}
                >
                  <span className="flex items-center gap-1">
                    <ShieldCheck className={`w-3.5 h-3.5 ${selectedRole === 'admin' ? 'text-[#C59B63]' : 'text-stone-400'}`} />
                    <span>Admin</span>
                  </span>
                  <span className={`text-[10px] font-normal mt-0.5 ${selectedRole === 'admin' ? 'text-[#8C6228] font-bold' : 'text-stone-500'}`}>Full Access</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSelectRole('manager')}
                  className={`flex flex-col items-center justify-center py-2 px-2 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                    selectedRole === 'manager'
                      ? 'bg-[#FAF5EC] text-[#0C141F] border-2 border-[#C59B63] shadow-xs'
                      : 'bg-white text-stone-700 border-[#EAE4D9] hover:bg-[#FAF8F5] hover:border-[#C59B63]/50'
                  }`}
                >
                  <span className="flex items-center gap-1">
                    <UserCheck className={`w-3.5 h-3.5 ${selectedRole === 'manager' ? 'text-[#C59B63]' : 'text-stone-400'}`} />
                    <span>Manager</span>
                  </span>
                  <span className={`text-[10px] font-normal mt-0.5 ${selectedRole === 'manager' ? 'text-[#8C6228] font-bold' : 'text-stone-500'}`}>Team Quota</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSelectRole('executive')}
                  className={`flex flex-col items-center justify-center py-2 px-2 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                    selectedRole === 'executive'
                      ? 'bg-[#FAF5EC] text-[#0C141F] border-2 border-[#C59B63] shadow-xs'
                      : 'bg-white text-stone-700 border-[#EAE4D9] hover:bg-[#FAF8F5] hover:border-[#C59B63]/50'
                  }`}
                >
                  <span className="flex items-center gap-1">
                    <Briefcase className={`w-3.5 h-3.5 ${selectedRole === 'executive' ? 'text-[#C59B63]' : 'text-stone-400'}`} />
                    <span>Agent</span>
                  </span>
                  <span className={`text-[10px] font-normal mt-0.5 ${selectedRole === 'executive' ? 'text-[#8C6228] font-bold' : 'text-stone-500'}`}>Desk Sales</span>
                </button>
              </div>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-3.5 pt-1">
              {/* Your Email */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-stone-700 block">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@kalaivani.in"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#EAE4D9] focus:border-[#C59B63] focus:ring-2 focus:ring-[#C59B63]/20 text-xs sm:text-sm text-[#0C141F] bg-white transition-all outline-none shadow-xs"
                />
              </div>

              {/* Password */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-stone-700 block">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your passcode"
                    className="w-full px-3.5 py-2.5 pr-10 rounded-xl border border-[#EAE4D9] focus:border-[#C59B63] focus:ring-2 focus:ring-[#C59B63]/20 text-xs sm:text-sm text-[#0C141F] bg-white transition-all outline-none shadow-xs"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-[#C59B63] transition-colors p-1 cursor-pointer"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password Row */}
              <div className="flex items-center justify-between text-xs pt-0.5">
                <label className="flex items-center gap-2 cursor-pointer select-none text-stone-600 hover:text-[#0C141F] font-medium">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-[#EAE4D9] text-[#0C141F] focus:ring-[#C59B63] cursor-pointer accent-[#0C141F]"
                  />
                  <span>Remember Me</span>
                </label>

                <button
                  type="button"
                  onClick={() => setPassword('••••••••')}
                  className="text-stone-500 hover:text-[#C59B63] font-medium transition-colors cursor-pointer"
                >
                  Forgot Password?
                </button>
              </div>

              {/* Primary Luxury Brand Button - Matching "EXPLORE PROJECTS" / "ENQUIRE NOW" */}
              <button
                type="submit"
                disabled={isEntering}
                className="w-full py-3 px-5 rounded-xl bg-[#0C141F] hover:bg-[#16202E] active:scale-[0.99] text-[#C59B63] hover:text-[#D4AF77] font-bold text-xs sm:text-sm tracking-wider shadow-md border border-[#C59B63]/40 transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                {isEntering ? (
                  <span>Entering Workspace...</span>
                ) : (
                  <>
                    <span>SIGN IN TO CRM</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
