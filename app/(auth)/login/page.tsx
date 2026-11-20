'use client';

import React, { useState, useEffect } from 'react';
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
import { cn } from '@/lib/utils';

type RoleKey = 'admin' | 'manager' | 'executive';

interface Slide {
  image: string;
  title: string;
  subtitle: string;
}

const slides: Slide[] = [
  {
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop',
    title: 'Find your sweet home',
    subtitle: 'Schedule visits in just a few clicks, nurture inquiries, and auto-lock inventory.',
  },
  {
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1200&auto=format&fit=crop',
    title: 'Precision Real Estate CRM',
    subtitle: 'Centralized lead pipeline with Indian Rupee (₹) formatting and RERA compliance.',
  },
  {
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1200&auto=format&fit=crop',
    title: 'Empower Your Sales Team',
    subtitle: 'Tailored workspaces for Company Admin, Sales Managers, and Field Executives.',
  },
];

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

  // Carousel Active Slide with Auto-Scroll
  const [activeSlide, setActiveSlide] = useState(0);

  // Automatic Slow & Smooth Slide Transition
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 4500); // Advances automatically every 4.5 seconds

    return () => clearInterval(interval);
  }, []);

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
    <div className="min-h-screen w-full bg-slate-950 flex items-center justify-center p-4 sm:p-6 text-slate-100 relative overflow-hidden selection:bg-[#0B132B] selection:text-white">
      {/* Background Ambience Matching Overall Kalaivani LMS Theme */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -left-32 w-80 h-80 bg-blue-600/15 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-indigo-600/15 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-blue-900/10 rounded-full blur-3xl" />
      </div>

      {/* Centered Compact Split-Screen Card */}
      <div className="relative z-10 w-full max-w-4xl bg-white rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row border border-slate-800/40">
        {/* ========================================================= */}
        {/* LEFT COLUMN: ARCHITECTURAL REAL ESTATE HERO               */}
        {/* ========================================================= */}
        <div className="relative md:w-1/2 min-h-[280px] md:min-h-[500px] flex flex-col justify-between p-6 sm:p-8 text-white overflow-hidden">
          {/* Stacked Images for Silky Smooth Crossfade & Slow Ken Burns Zoom */}
          {slides.map((slide, idx) => {
            const isActive = activeSlide === idx;
            return (
              <div
                key={idx}
                className={cn(
                  'absolute inset-0 bg-cover bg-center transition-all duration-1000 ease-in-out transform',
                  isActive
                    ? 'opacity-100 scale-100 z-0'
                    : 'opacity-0 scale-105 pointer-events-none -z-10'
                )}
                style={{ backgroundImage: `url(${slide.image})` }}
              />
            );
          })}

          {/* Gradients for Optimal Readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/40 to-slate-950/60 z-10" />
          <div className="absolute inset-0 bg-[#0B132B]/30 mix-blend-multiply pointer-events-none z-10" />

          {/* Top-Left: Brand Emblem & Name */}
          <div className="relative z-20 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-white text-[#0B132B] flex items-center justify-center shadow-md shrink-0">
              <Building className="w-4 h-4 text-[#0B132B]" />
            </div>
            <span className="font-bold text-base tracking-tight text-white drop-shadow-sm">
              Kalaivani
            </span>
          </div>

          {/* Bottom-Left: Hero Copy & Carousel Dots */}
          <div className="relative z-20 space-y-3 max-w-sm">
            {/* Smoothly Animated Slide Headlines */}
            <div className="relative min-h-[68px]">
              {slides.map((slide, idx) => {
                const isActive = activeSlide === idx;
                return (
                  <div
                    key={idx}
                    className={cn(
                      'transition-all duration-700 ease-in-out absolute inset-x-0 bottom-0',
                      isActive
                        ? 'opacity-100 translate-y-0'
                        : 'opacity-0 translate-y-2 pointer-events-none'
                    )}
                  >
                    <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white leading-tight drop-shadow-sm">
                      {slide.title}
                    </h2>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed drop-shadow-xs">
                      {slide.subtitle}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Carousel Navigation Indicators */}
            <div className="flex items-center gap-1.5 pt-1">
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveSlide(idx)}
                  className={`h-1.5 rounded-full transition-all duration-500 ease-out cursor-pointer ${
                    activeSlide === idx
                      ? 'w-6 bg-white shadow-sm'
                      : 'w-1.5 bg-white/40 hover:bg-white/70'
                  }`}
                  aria-label={`Slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* RIGHT COLUMN: DARK NAVY THEMED LOGIN PANE                 */}
        {/* ========================================================= */}
        <div className="md:w-1/2 flex flex-col justify-center p-6 sm:p-8 lg:p-9 bg-white text-slate-900">
          <div className="w-full space-y-4">
            {/* Header with Title and Dark Navy Sign in Badge */}
            <div className="flex items-start justify-between gap-3">
              <div>
                <h1 className="text-xl sm:text-2xl font-extrabold text-[#0B132B] tracking-tight">
                  Welcome Back to Kalaivani!
                </h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  Sign in to your account
                </p>
              </div>

              <div className="px-3 py-1 rounded-full bg-[#0B132B] text-white border border-[#1b2a52] text-[11px] font-semibold shadow-xs shrink-0 mt-0.5">
                Sign in
              </div>
            </div>

            {/* Role Persona Switcher Chips */}
            <div className="space-y-1.5 pt-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Select Workspace Role
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleSelectRole('admin')}
                  className={`flex flex-col items-center justify-center py-2 px-2 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                    selectedRole === 'admin'
                      ? 'bg-[#0B132B] text-white border-[#1b2a52] shadow-sm'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                  }`}
                >
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                    <span>Admin</span>
                  </span>
                  <span className="text-[10px] font-normal text-slate-300 opacity-90 mt-0.5">Full Access</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSelectRole('manager')}
                  className={`flex flex-col items-center justify-center py-2 px-2 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                    selectedRole === 'manager'
                      ? 'bg-[#0B132B] text-white border-[#1b2a52] shadow-sm'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                  }`}
                >
                  <span className="flex items-center gap-1">
                    <UserCheck className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Manager</span>
                  </span>
                  <span className="text-[10px] font-normal text-slate-300 opacity-90 mt-0.5">Team Quota</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSelectRole('executive')}
                  className={`flex flex-col items-center justify-center py-2 px-2 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                    selectedRole === 'executive'
                      ? 'bg-[#0B132B] text-white border-[#1b2a52] shadow-sm'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                  }`}
                >
                  <span className="flex items-center gap-1">
                    <Briefcase className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Agent</span>
                  </span>
                  <span className="text-[10px] font-normal text-slate-300 opacity-90 mt-0.5">Desk Sales</span>
                </button>
              </div>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-3.5 pt-1">
              {/* Your Email */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 block">
                  Your Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@kalaivani.in"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-[#0B132B] focus:ring-1 focus:ring-[#0B132B] text-xs sm:text-sm text-slate-900 bg-white shadow-xs transition-all outline-none"
                />
              </div>

              {/* Password */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 block">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your passcode"
                    className="w-full px-3.5 py-2.5 pr-10 rounded-xl border border-slate-300 focus:border-[#0B132B] focus:ring-1 focus:ring-[#0B132B] text-xs sm:text-sm text-slate-900 bg-white shadow-xs transition-all outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#0B132B] transition-colors p-1 cursor-pointer"
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
                <label className="flex items-center gap-2 cursor-pointer select-none text-slate-600 hover:text-[#0B132B] font-medium">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 text-[#0B132B] focus:ring-[#0B132B] cursor-pointer accent-[#0B132B]"
                  />
                  <span>Remember Me</span>
                </label>

                <button
                  type="button"
                  onClick={() => setPassword('••••••••')}
                  className="text-slate-500 hover:text-[#0B132B] font-medium transition-colors cursor-pointer"
                >
                  Forgot Password?
                </button>
              </div>

              {/* Dark Navy Login Button Matching Sidebar Theme */}
              <button
                type="submit"
                disabled={isEntering}
                className="w-full py-3 px-5 rounded-xl bg-[#0B132B] hover:bg-[#152244] active:scale-[0.99] text-white border border-[#1b2a52] font-semibold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                {isEntering ? (
                  <span>Entering Workspace...</span>
                ) : (
                  <>
                    <span>Login</span>
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
