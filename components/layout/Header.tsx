'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Menu,
  Bell,
  User,
  LogOut,
  Calendar,
  PhoneCall,
  ChevronDown,
  Sparkles,
} from 'lucide-react';
import { useLmsStore } from '@/store/useLmsStore';
import { useToast } from '@/components/ui/toast';

export function Header({ onMenuClick }: { onMenuClick: () => void }) {
  const { currentUser, followUps, siteVisits } = useLmsStore();
  const { success } = useToast();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // Notifications calculation
  const todayStr = new Date().toISOString().split('T')[0];
  const todayFollowUps = followUps.filter((f) => f.scheduledDate <= todayStr && f.status !== 'Completed');
  const todayVisits = siteVisits.filter((v) => v.visitDate === todayStr && v.status === 'Scheduled');
  const totalNotifications = todayFollowUps.length + todayVisits.length;

  return (
    <>
      <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 sm:px-6 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#EAE4D9] shadow-xs">
        {/* Left Section: Mobile Menu & Mobile Logo */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-xl text-stone-600 hover:bg-[#F2EDE4] focus:outline-none"
            aria-label="Open Navigation"
          >
            <Menu className="w-5 h-5" />
          </button>

          <Link href="/dashboard" className="lg:hidden shrink-0 flex items-center gap-2">
            <img
              src="/kalaivani-emblem.png"
              alt="Kalaivani Emblem"
              className="w-9 h-9 rounded-full object-contain"
            />
            <div className="flex flex-col min-w-0">
              <span className="font-poppins font-extrabold text-sm tracking-[0.06em] text-[#0C141F] leading-tight">
                KALAIVANI
              </span>
              <span className="font-poppins font-bold text-[8px] text-[#C59B63] tracking-[0.2em] uppercase leading-tight">
                REAL ESTATE
              </span>
            </div>
          </Link>
        </div>

        {/* Right Section: Notifications & Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Notifications Bell */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative w-10 h-10 rounded-xl text-stone-600 hover:bg-[#F2EDE4] hover:text-[#0C141F] flex items-center justify-center transition-colors"
              title="Notifications"
              aria-label="View Notifications"
            >
              <Bell className="w-6 h-6 stroke-[1.8]" />
              {totalNotifications > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-[#C59B63] text-[10px] font-bold text-white shadow-xs ring-2 ring-[#FAF8F5]">
                  {totalNotifications}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white shadow-xl border border-[#EAE4D9] z-50 p-4 animate-in fade-in zoom-in-95">
                <div className="flex items-center justify-between pb-3 border-b border-[#EAE4D9]">
                  <div className="flex items-center gap-2">
                    <span className="font-poppins font-bold text-sm text-[#0C141F]">Notifications</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-[#FAF5EC] text-[#8C6228] font-semibold border border-[#E5D0A6]">
                      {totalNotifications} New
                    </span>
                  </div>
                  <button
                    onClick={() => setShowNotifications(false)}
                    className="text-xs text-[#C59B63] hover:underline font-medium"
                  >
                    Close
                  </button>
                </div>

                <div className="py-2 max-h-72 overflow-y-auto space-y-2">
                  {totalNotifications === 0 ? (
                    <div className="text-center py-6 text-xs text-stone-500">
                      No pending follow-ups or visits for today.
                    </div>
                  ) : (
                    <>
                      {todayFollowUps.slice(0, 4).map((f) => (
                        <Link
                          key={f.id}
                          href="/follow-ups"
                          onClick={() => setShowNotifications(false)}
                          className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-[#FAF8F5] transition-colors border border-transparent hover:border-[#EAE4D9]"
                        >
                          <div className="p-2 rounded-lg bg-[#FAF5EC] text-[#C59B63] shrink-0 border border-[#F2E6CE]">
                            <PhoneCall className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-stone-900 truncate">
                              Follow-up: {f.leadName}
                            </p>
                            <p className="text-[11px] text-stone-500 truncate">{f.notes}</p>
                            <span className="text-[10px] text-[#8C6228] font-medium">
                              Due: {f.scheduledTime}
                            </span>
                          </div>
                        </Link>
                      ))}

                      {todayVisits.slice(0, 3).map((v) => (
                        <Link
                          key={v.id}
                          href="/site-visits"
                          onClick={() => setShowNotifications(false)}
                          className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-[#FAF8F5] transition-colors border border-transparent hover:border-[#EAE4D9]"
                        >
                          <div className="p-2 rounded-lg bg-[#FAF5EC] text-[#C59B63] shrink-0 border border-[#F2E6CE]">
                            <Calendar className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-stone-900 truncate">
                              Site Visit: {v.propertyName}
                            </p>
                            <p className="text-[11px] text-stone-500 truncate">With {v.leadName}</p>
                            <span className="text-[10px] text-[#8C6228] font-medium">
                              Time: {v.visitTime}
                            </span>
                          </div>
                        </Link>
                      ))}
                    </>
                  )}
                </div>

                <div className="pt-2 border-t border-[#EAE4D9] text-center">
                  <Link
                    href="/follow-ups"
                    onClick={() => setShowNotifications(false)}
                    className="text-xs font-semibold text-[#8C6228] hover:text-[#C59B63]"
                  >
                    View All Follow-ups & Calendar &rarr;
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* User Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-[#F2EDE4] transition-colors"
            >
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-8 h-8 rounded-full object-cover ring-2 ring-[#E5D0A6]"
              />
              <div className="hidden xl:flex flex-col text-left">
                <span className="text-xs font-semibold text-[#0C141F] leading-tight">
                  {currentUser.name}
                </span>
                <span className="text-[10px] text-[#8C6228] font-medium">{currentUser.role}</span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-stone-400 hidden xl:block" />
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white shadow-xl border border-[#EAE4D9] z-50 p-2 animate-in fade-in zoom-in-95">
                <div className="p-2.5 border-b border-[#EAE4D9]">
                  <p className="text-xs font-bold text-[#0C141F]">{currentUser.name}</p>
                  <p className="text-[11px] text-stone-500 truncate">{currentUser.email}</p>
                  <div className="mt-1 inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#FAF5EC] text-[#8C6228] text-[10px] font-semibold border border-[#E5D0A6]">
                    Role: {currentUser.role}
                  </div>
                </div>

                <div className="py-1">
                  <Link
                    href="/team"
                    onClick={() => setShowProfileMenu(false)}
                    className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-stone-700 hover:bg-[#FAF8F5] rounded-lg"
                  >
                    <User className="w-4 h-4 text-stone-400" />
                    <span>Team Management</span>
                  </Link>
                  <Link
                    href="/settings"
                    onClick={() => setShowProfileMenu(false)}
                    className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-stone-700 hover:bg-[#FAF8F5] rounded-lg"
                  >
                    <Sparkles className="w-4 h-4 text-stone-400" />
                    <span>System Settings & Demo</span>
                  </Link>
                </div>

                <div className="pt-1 border-t border-[#EAE4D9]">
                  <Link
                    href="/login"
                    onClick={() => setShowProfileMenu(false)}
                    className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 rounded-lg"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Switch Role / Logout</span>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>
    </>
  );
}
