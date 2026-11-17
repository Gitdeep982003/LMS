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
  CheckCircle2,
  ChevronDown,
  Sparkles,
} from 'lucide-react';
import { useLmsStore } from '@/store/useLmsStore';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/utils';
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
      <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 sm:px-6 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
        {/* Left Section: Mobile Menu + Search */}
        <div className="flex items-center gap-3 lg:gap-4 flex-1 max-w-xl">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100 focus:outline-none"
          >
            <Menu className="w-5 h-5" />
          </button>

          <form onSubmit={handleSearchSubmit} className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search leads, phone numbers, properties..."
              className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </form>
        </div>

        {/* Right Section: Quick Add, Notifications, Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Add Lead Button */}
          <Button
            size="sm"
            onClick={() => setIsAddLeadOpen(true)}
            className="hidden sm:inline-flex items-center gap-1.5 shadow-sm"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Lead</span>
          </Button>

          {/* Notifications Bell */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
              {totalNotifications > 0 && (
                <span className="absolute top-1.5 right-1.5 flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow-xs">
                  {totalNotifications}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white shadow-xl border border-slate-100 z-50 p-4 animate-in fade-in zoom-in-95">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-900">Notifications</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-semibold">
                      {totalNotifications} New
                    </span>
                  </div>
                  <button
                    onClick={() => setShowNotifications(false)}
                    className="text-xs text-blue-600 hover:underline"
                  >
                    Close
                  </button>
                </div>

                <div className="py-2 max-h-72 overflow-y-auto space-y-2">
                  {totalNotifications === 0 ? (
                    <div className="text-center py-6 text-xs text-slate-500">
                      No pending follow-ups or visits for today.
                    </div>
                  ) : (
                    <>
                      {todayFollowUps.slice(0, 4).map((f) => (
                        <Link
                          key={f.id}
                          href="/follow-ups"
                          onClick={() => setShowNotifications(false)}
                          className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100"
                        >
                          <div className="p-2 rounded-lg bg-amber-50 text-amber-600 shrink-0">
                            <PhoneCall className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-slate-800 truncate">
                              Follow-up: {f.leadName}
                            </p>
                            <p className="text-[11px] text-slate-500 truncate">{f.notes}</p>
                            <span className="text-[10px] text-amber-600 font-medium">
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
                          className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100"
                        >
                          <div className="p-2 rounded-lg bg-purple-50 text-purple-600 shrink-0">
                            <Calendar className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-slate-800 truncate">
                              Site Visit: {v.propertyName}
                            </p>
                            <p className="text-[11px] text-slate-500 truncate">With {v.leadName}</p>
                            <span className="text-[10px] text-purple-600 font-medium">
                              Time: {v.visitTime}
                            </span>
                          </div>
                        </Link>
                      ))}
                    </>
                  )}
                </div>

                <div className="pt-2 border-t border-slate-100 text-center">
                  <Link
                    href="/follow-ups"
                    onClick={() => setShowNotifications(false)}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-700"
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
              className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 transition-colors"
            >
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-8 h-8 rounded-full object-cover ring-2 ring-slate-200"
              />
              <div className="hidden xl:flex flex-col text-left">
                <span className="text-xs font-semibold text-slate-800 leading-tight">
                  {currentUser.name}
                </span>
                <span className="text-[10px] text-slate-500">{currentUser.role}</span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden xl:block" />
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white shadow-xl border border-slate-100 z-50 p-2 animate-in fade-in zoom-in-95">
                <div className="p-2.5 border-b border-slate-100">
                  <p className="text-xs font-bold text-slate-900">{currentUser.name}</p>
                  <p className="text-[11px] text-slate-500 truncate">{currentUser.email}</p>
                  <div className="mt-1 inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 text-[10px] font-semibold">
                    Role: {currentUser.role}
                  </div>
                </div>

                <div className="py-1">
                  <Link
                    href="/team"
                    onClick={() => setShowProfileMenu(false)}
                    className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 rounded-lg"
                  >
                    <User className="w-4 h-4 text-slate-400" />
                    <span>Team Management</span>
                  </Link>
                  <Link
                    href="/settings"
                    onClick={() => setShowProfileMenu(false)}
                    className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 rounded-lg"
                  >
                    <Sparkles className="w-4 h-4 text-slate-400" />
                    <span>System Settings & Demo</span>
                  </Link>
                </div>

                <div className="pt-1 border-t border-slate-100">
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
