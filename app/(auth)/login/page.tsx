'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLmsStore } from '@/store/useLmsStore';
import { defaultUserSessions } from '@/data/initialData';
import { Button } from '@/components/ui/button';
import {
  Building2,
  ShieldCheck,
  UserCheck,
  Briefcase,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Lock,
  Sparkles,
  Check,
  Phone,
  Mail,
  Zap,
  Building,
} from 'lucide-react';
import { UserSession } from '@/types';

type RoleKey = 'admin' | 'manager' | 'executive';

export default function LoginPage() {
  const router = useRouter();
  const { setCurrentUser } = useLmsStore();

  // 3 Simple & Intuitive Steps: 1. Role -> 2. User -> 3. Launch
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  // Selected Role
  const [selectedRole, setSelectedRole] = useState<RoleKey>('admin');

  // Selected User Session
  const [selectedUser, setSelectedUser] = useState<UserSession>(defaultUserSessions.admin);

  // Simple Demo PIN
  const [pin, setPin] = useState('1234');

  // Launching state
  const [isEntering, setIsEntering] = useState(false);

  // Role details with simple client-friendly descriptions
  const rolesInfo = [
    {
      key: 'admin' as RoleKey,
      title: 'Company Admin / Owner',
      badge: 'Full Access',
      badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      icon: ShieldCheck,
      iconColor: 'text-blue-400',
      bgColor: 'hover:border-blue-500/50',
      activeColor: 'bg-blue-600/15 border-blue-500 ring-2 ring-blue-500/40',
      summary: 'Complete overview of all 50 leads, ₹68 Cr+ sales revenue, team reports, and system settings.',
      defaultUser: defaultUserSessions.admin,
      bullets: ['View all company leads & bookings', 'Monitor 8 sales agents leaderboard', 'Manage property inventory & settings'],
    },
    {
      key: 'manager' as RoleKey,
      title: 'Sales Manager',
      badge: 'Team Lead',
      badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
      icon: UserCheck,
      iconColor: 'text-indigo-400',
      bgColor: 'hover:border-indigo-500/50',
      activeColor: 'bg-indigo-600/15 border-indigo-500 ring-2 ring-indigo-500/40',
      summary: 'Lead distribution hub: assign leads to agents, balance workloads, and track team conversion.',
      defaultUser: defaultUserSessions.manager,
      bullets: ['1-Click lead allocation to agents', 'Track daily site visits & follow-ups', 'Monitor individual agent quotas'],
    },
    {
      key: 'executive' as RoleKey,
      title: 'Sales Executive (Agent)',
      badge: 'Field Agent',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      icon: Briefcase,
      iconColor: 'text-emerald-400',
      bgColor: 'hover:border-emerald-500/50',
      activeColor: 'bg-emerald-600/15 border-emerald-500 ring-2 ring-emerald-500/40',
      summary: 'Personalized agent workspace: work on your 14 assigned leads, make calls, and book site visits.',
      defaultUser: defaultUserSessions.executive,
      bullets: ['Personal assigned leads & follow-ups', 'Schedule customer site visits', 'Record deals & customer feedback'],
    },
  ];

  // When role changes, sync user
  const handleSelectRole = (key: RoleKey) => {
    setSelectedRole(key);
    setSelectedUser(defaultUserSessions[key]);
  };

  // 1-Click Direct Demo Launch (Fast Bypass)
  const handleFastDemoLogin = (key: RoleKey) => {
    setSelectedRole(key);
    setCurrentUser(defaultUserSessions[key]);
    router.push('/dashboard');
  };

  // Launch dashboard
  const handleLaunchDashboard = () => {
    setIsEntering(true);
    setCurrentUser(selectedUser);
    setTimeout(() => {
      router.push('/dashboard');
    }, 400);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4 sm:p-6 text-slate-100 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -left-32 w-80 h-80 bg-blue-600/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-emerald-600/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-xl z-10 space-y-5 my-6">
        {/* Brand Header */}
        <div className="text-center space-y-1.5">
          <div className="inline-flex items-center justify-center w-13 h-13 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 shadow-lg shadow-blue-500/20 p-3 mb-1">
            <Building2 className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center justify-center gap-2">
            KALAIVANI <span className="text-blue-500 font-extrabold">LMS</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Real Estate CRM & Lead Management Portal
          </p>
        </div>

        {/* Client Fast-Track Bar: 1-Click Demo Buttons */}
        <div className="flex items-center justify-between p-2.5 px-4 rounded-xl bg-slate-900/90 border border-slate-800 backdrop-blur-md shadow-md text-xs">
          <span className="text-slate-400 flex items-center gap-1.5 font-medium">
            <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span className="hidden sm:inline">1-Click Demo:</span>
          </span>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => handleFastDemoLogin('admin')}
              className="px-2.5 py-1 rounded-lg font-semibold bg-blue-500/15 text-blue-300 hover:bg-blue-500/25 border border-blue-500/30 transition-all text-[11px]"
            >
              👑 Admin
            </button>
            <button
              onClick={() => handleFastDemoLogin('manager')}
              className="px-2.5 py-1 rounded-lg font-semibold bg-indigo-500/15 text-indigo-300 hover:bg-indigo-500/25 border border-indigo-500/30 transition-all text-[11px]"
            >
              👔 Manager
            </button>
            <button
              onClick={() => handleFastDemoLogin('executive')}
              className="px-2.5 py-1 rounded-lg font-semibold bg-emerald-500/15 text-emerald-300 hover:bg-emerald-500/25 border border-emerald-500/30 transition-all text-[11px]"
            >
              💼 Agent
            </button>
          </div>
        </div>

        {/* Simple 3-Step Breadcrumb Bar */}
        <div className="grid grid-cols-3 gap-2 text-center text-xs">
          <div
            onClick={() => setCurrentStep(1)}
            className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
              currentStep === 1
                ? 'bg-blue-600/20 border-blue-500 text-white font-bold ring-1 ring-blue-500/50'
                : currentStep > 1
                ? 'bg-slate-900/80 border-emerald-500/50 text-emerald-400 font-medium'
                : 'bg-slate-900/40 border-slate-800 text-slate-500'
            }`}
          >
            <div className="flex items-center justify-center gap-1.5">
              {currentStep > 1 ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <span className="w-4 h-4 rounded-full bg-blue-500 text-[10px] text-white flex items-center justify-center font-bold">1</span>
              )}
              <span>Select Role</span>
            </div>
          </div>

          <div
            onClick={() => currentStep >= 2 && setCurrentStep(2)}
            className={`p-2.5 rounded-xl border transition-all ${
              currentStep >= 2 ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'
            } ${
              currentStep === 2
                ? 'bg-blue-600/20 border-blue-500 text-white font-bold ring-1 ring-blue-500/50'
                : currentStep > 2
                ? 'bg-slate-900/80 border-emerald-500/50 text-emerald-400 font-medium'
                : 'bg-slate-900/40 border-slate-800 text-slate-500'
            }`}
          >
            <div className="flex items-center justify-center gap-1.5">
              {currentStep > 2 ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <span className="w-4 h-4 rounded-full bg-slate-700 text-[10px] text-slate-300 flex items-center justify-center font-bold">2</span>
              )}
              <span>Verify User</span>
            </div>
          </div>

          <div
            onClick={() => currentStep === 3 && setCurrentStep(3)}
            className={`p-2.5 rounded-xl border transition-all ${
              currentStep === 3
                ? 'bg-emerald-600/20 border-emerald-500 text-white font-bold ring-1 ring-emerald-500/50'
                : 'bg-slate-900/40 border-slate-800 text-slate-500 cursor-not-allowed opacity-60'
            }`}
          >
            <div className="flex items-center justify-center gap-1.5">
              <span className="w-4 h-4 rounded-full bg-slate-700 text-[10px] text-slate-300 flex items-center justify-center font-bold">3</span>
              <span>Launch</span>
            </div>
          </div>
        </div>

        {/* Step Card Container */}
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-2xl backdrop-blur-xl">
          {/* ========================================================= */}
          {/* STEP 1: CHOOSE ROLE                                       */}
          {/* ========================================================= */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="border-b border-slate-800 pb-3">
                <span className="text-[11px] font-bold text-blue-400 uppercase tracking-wider">Step 1 of 3</span>
                <h3 className="text-lg font-bold text-white mt-0.5">Who is logging in today?</h3>
                <p className="text-xs text-slate-400">
                  Select your role to view the tailored dashboard and permissions.
                </p>
              </div>

              {/* 3 Simple Role Cards */}
              <div className="space-y-2.5">
                {rolesInfo.map((r) => {
                  const isSelected = selectedRole === r.key;
                  const Icon = r.icon;

                  return (
                    <div
                      key={r.key}
                      onClick={() => handleSelectRole(r.key)}
                      className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-start gap-3.5 ${
                        isSelected
                          ? r.activeColor
                          : `bg-slate-950/60 border-slate-800/80 ${r.bgColor} hover:bg-slate-950`
                      }`}
                    >
                      <div
                        className={`p-2.5 rounded-xl shrink-0 mt-0.5 ${
                          isSelected ? 'bg-white/10 text-white' : 'bg-slate-800/80 ' + r.iconColor
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-sm text-white">{r.title}</h4>
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${r.badgeColor}`}>
                              {r.badge}
                            </span>
                          </div>
                          {isSelected && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}
                        </div>

                        <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                          {r.summary}
                        </p>

                        <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-400">
                          <span className="font-medium text-slate-300">Default Demo: {r.defaultUser.name}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Next Step Button */}
              <div className="pt-3 border-t border-slate-800 flex justify-end">
                <Button
                  onClick={() => setCurrentStep(2)}
                  className="bg-blue-600 hover:bg-blue-500 text-white font-semibold gap-2 shadow-lg shadow-blue-600/30 px-6 text-xs sm:text-sm"
                >
                  <span>Continue to Step 2: Verify Profile</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* STEP 2: USER PROFILE & PIN VERIFICATION                   */}
          {/* ========================================================= */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="border-b border-slate-800 pb-3">
                <span className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider">Step 2 of 3</span>
                <h3 className="text-lg font-bold text-white mt-0.5">Confirm Identity & Passcode</h3>
                <p className="text-xs text-slate-400">
                  Signing in under <span className="text-white font-bold capitalize">{selectedRole}</span> access.
                </p>
              </div>

              {/* Persona Profile Card */}
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center gap-3.5">
                <img
                  src={selectedUser.avatar}
                  alt={selectedUser.name}
                  className="w-13 h-13 rounded-xl object-cover ring-2 ring-blue-500 shadow-md shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-white text-base truncate">{selectedUser.name}</h4>
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30 shrink-0">
                      {selectedUser.role}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 truncate mt-0.5">{selectedUser.email}</p>
                  <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1.5">
                    <Phone className="w-3 h-3 text-emerald-400" />
                    <span>{selectedUser.phone}</span>
                  </p>
                </div>
              </div>

              {/* Simple Demo PIN Box */}
              <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800/80 space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-blue-400" />
                    <span>Security PIN (Demo Default: 1234)</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setPin('1234')}
                    className="text-[11px] text-blue-400 hover:text-blue-300 font-semibold"
                  >
                    Auto-fill 1234
                  </button>
                </div>

                <input
                  type="password"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  placeholder="Enter 4-digit PIN"
                  className="w-full px-3.5 py-2 text-sm bg-slate-900 border border-slate-700 rounded-lg text-white font-mono tracking-widest text-center text-lg focus:outline-none focus:border-blue-500"
                />
                <p className="text-[11px] text-slate-500 text-center">
                  Press Continue to view your customized workspace overview.
                </p>
              </div>

              {/* Buttons */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep(1)}
                  className="border-slate-700 text-slate-300 hover:bg-slate-800 gap-1.5 text-xs sm:text-sm"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </Button>

                <Button
                  onClick={() => setCurrentStep(3)}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold gap-2 shadow-lg shadow-indigo-600/30 px-6 text-xs sm:text-sm"
                >
                  <span>Continue to Step 3: Launch</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* STEP 3: WORKSPACE SUMMARY & ENTER DASHBOARD               */}
          {/* ========================================================= */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div className="border-b border-slate-800 pb-3">
                <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">Step 3 of 3</span>
                <h3 className="text-lg font-bold text-white mt-0.5">Ready to Enter Workspace!</h3>
                <p className="text-xs text-slate-400">
                  Your customized real estate CRM is primed and ready.
                </p>
              </div>

              {/* Ready Summary Banner */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-blue-900/30 to-emerald-900/30 border border-emerald-500/30 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">
                      Welcome, {selectedUser.name}!
                    </h4>
                    <p className="text-xs text-emerald-300/90">
                      Logged in as <span className="font-bold">{selectedUser.role}</span>
                    </p>
                  </div>
                </div>

                {/* 3 Quick highlights */}
                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800/80 text-center text-xs">
                  <div className="p-2 rounded-lg bg-slate-900/60">
                    <span className="text-[10px] text-slate-400 block">Total Leads</span>
                    <span className="font-bold text-white text-sm">50 Leads</span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-900/60">
                    <span className="text-[10px] text-slate-400 block">Properties</span>
                    <span className="font-bold text-white text-sm">20 Units</span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-900/60">
                    <span className="text-[10px] text-slate-400 block">Sales Value</span>
                    <span className="font-bold text-emerald-400 text-sm">₹68 Cr+</span>
                  </div>
                </div>
              </div>

              {/* Bullet checklist */}
              <div className="space-y-1.5 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Interactive Kanban pipeline & site visits scheduled</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Indian Rupee (INR ₹) formatting and RERA project catalog</span>
                </div>
              </div>

              {/* Launch Button */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep(2)}
                  className="border-slate-700 text-slate-300 hover:bg-slate-800 gap-1.5 text-xs sm:text-sm"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </Button>

                <Button
                  onClick={handleLaunchDashboard}
                  disabled={isEntering}
                  size="lg"
                  className="bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-500 hover:to-blue-500 text-white font-bold gap-2 shadow-xl shadow-emerald-600/30 px-7 text-xs sm:text-sm"
                >
                  {isEntering ? (
                    <span>Opening Workspace...</span>
                  ) : (
                    <>
                      <span>Enter {selectedUser.role.split(' ')[0]} Dashboard</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-slate-500">
          Kalaivani LMS • Real Estate SaaS CRM
        </div>
      </div>
    </div>
  );
}
