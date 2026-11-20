'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Menu,
  Search,
  Bell,
  PlusCircle,
  User,
  LogOut,
  Calendar,
  PhoneCall,
  ChevronDown,
  Sparkles,
} from 'lucide-react';
import { useLmsStore } from '@/store/useLmsStore';
import { Button } from '@/components/ui/button';
import { AddLeadModal } from '@/components/leads/AddLeadModal';
import { useToast } from '@/components/ui/toast';

export function Header({ onMenuClick }: { onMenuClick: () => void }) {
  const router = useRouter();
  const { currentUser, followUps, siteVisits, searchQuery, setSearchQuery } = useLmsStore();
  const { success } = useToast();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isAddLeadOpen, setIsAddLeadOpen] = useState(false);

  // Notifications calculation
  const todayStr = new Date().toISOString().split('T')[0];
  const todayFollowUps = followUps.filter((f) => f.scheduledDate <= todayStr && f.status !== 'Completed');
  const todayVisits = siteVisits.filter((v) => v.visitDate === todayStr && v.status === 'Scheduled');
  const totalNotifications = todayFollowUps.length + todayVisits.length;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/leads?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 sm:px-6 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#EAE4D9] shadow-xs">
        {/* Left Section: Mobile Menu + Search */}
        <div className="flex items-center gap-3 lg:gap-4 flex-1 max-w-xl">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-xl text-stone-600 hover:bg-[#F2EDE4] focus:outline-none"
          >
            <Menu className="w-5 h-5" />
          </button>

          <form onSubmit={handleSearchSubmit} className="relative w-full max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search leads, phone numbers, properties..."
              className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-white hover:border-[#C59B63]/60 focus:bg-white border border-[#EAE4D9] rounded-xl text-[#0C141F] placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#C59B63]/20 focus:border-[#C59B63] transition-all shadow-xs"
            />
          </form>
        </div>

        {/* Right Section: Quick Add, Notifications, Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Add Lead Button - Matching "ENQUIRE NOW" luxury button */}
          <Button
            size="sm"
            onClick={() => setIsAddLeadOpen(true)}
            className="hidden sm:inline-flex items-center gap-1.5 shadow-xs"
          >
            <PlusCircle className="w-4 h-4 text-[#C59B63]" />
            <span>Add Lead</span>
          </Button>

          {/* Notifications Bell */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-xl text-stone-600 hover:bg-[#F2EDE4] hover:text-[#0C141F] transition-colors"
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
              {totalNotifications > 0 && (
                <span className="absolute top-1.5 right-1.5 flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-[#C59B63] text-[10px] font-bold text-white shadow-xs">
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

      {/* Quick Add Lead Modal */}
      <AddLeadModal isOpen={isAddLeadOpen} onClose={() => setIsAddLeadOpen(false)} />
    </>
  );
}
