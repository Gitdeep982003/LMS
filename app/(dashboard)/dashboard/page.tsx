'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Users2,
  UserPlus,
  Clock,
  CalendarCheck2,
  Trophy,
  CheckCircle2,
  TrendingUp,
  ArrowUpRight,
  PhoneCall,
  MapPin,
  ChevronRight,
  Building2,
  Plus,
  AlertCircle,
  Briefcase,
  ShieldCheck,
  Target,
  UserCheck,
} from 'lucide-react';
import { useLmsStore } from '@/store/useLmsStore';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { StatusBadge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatINR, formatDate } from '@/lib/utils';
import { DashboardCharts } from '@/components/dashboard/DashboardCharts';
import { LeadDetailsDrawer } from '@/components/leads/LeadDetailsDrawer';
import { AddLeadModal } from '@/components/leads/AddLeadModal';
import { Lead } from '@/types';

export default function DashboardPage() {
  const { leads, followUps, siteVisits, bookings, agents, currentUser } = useLmsStore();
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isAddLeadOpen, setIsAddLeadOpen] = useState(false);

  // Role detection
  const isExecutive = currentUser.role === 'Sales Executive';
  const isManager = currentUser.role === 'Sales Manager';
  const isAdmin = currentUser.role === 'Admin';

  // State for Executive toggle between "My Leads" and "All Leads"
  const [leadScope, setLeadScope] = useState<'my' | 'all'>(isExecutive ? 'my' : 'all');

  React.useEffect(() => {
    setLeadScope(isExecutive ? 'my' : 'all');
  }, [isExecutive]);

  const todayStr = new Date().toISOString().split('T')[0];

  // Global calculations
  const totalLeads = leads.length;
  const newLeads = leads.filter((l) => l.status === 'New').length;
  const activeLeads = leads.filter((l) => l.status !== 'Converted' && l.status !== 'Lost').length;
  const pendingFollowups = followUps.filter((f) => f.status === 'Pending' || f.status === 'Overdue').length;
  const todayVisits = siteVisits.filter((v) => v.visitDate === todayStr && v.status === 'Scheduled').length;
  const convertedLeads = leads.filter((l) => l.status === 'Converted' || l.status === 'Booked').length;
  const totalBookings = bookings.length;
  const globalConversionRate = totalLeads > 0 ? ((convertedLeads / totalLeads) * 100).toFixed(1) : '0';
  const totalBookingValue = bookings.reduce((sum, b) => sum + (b.propertyPrice || 0), 0);

  // Executive-specific calculations
  const myLeads = leads.filter((l) => l.assignedAgentId === currentUser.id);
  const myActiveLeads = myLeads.filter((l) => l.status !== 'Converted' && l.status !== 'Lost').length;
  const myPendingFollowups = followUps.filter(
    (f) => f.agentId === currentUser.id && (f.status === 'Pending' || f.status === 'Overdue')
  ).length;
  const myTodayVisits = siteVisits.filter(
    (v) => v.agentId === currentUser.id && v.visitDate === todayStr && v.status === 'Scheduled'
  ).length;
  const myConverted = myLeads.filter((l) => l.status === 'Converted' || l.status === 'Booked').length;
  const myConversionRate = myLeads.length > 0 ? ((myConverted / myLeads.length) * 100).toFixed(1) : '0';

  const currentAgentRecord = agents.find((a) => a.id === currentUser.id);
  const myTotalSales = currentAgentRecord?.totalSalesValue || 0;
  const myCapacity = currentAgentRecord?.maxLeadCapacity || 25;

  // Leads list depending on role/scope
  const displayedRecentLeads = (leadScope === 'my' && isExecutive ? myLeads : leads).slice(0, 6);

  // Upcoming Visits & Follow-ups (Personalized if Executive)
  const upcomingVisits = siteVisits
    .filter((v) => v.status === 'Scheduled' && (!isExecutive || v.agentId === currentUser.id))
    .slice(0, 4);

  const pendingFollowupTasks = followUps
    .filter(
      (f) =>
        (f.status === 'Pending' || f.status === 'Overdue') &&
        (!isExecutive || f.agentId === currentUser.id)
    )
    .slice(0, 4);

  const topAgents = [...agents]
    .sort((a, b) => b.totalSalesValue - a.totalSalesValue)
    .slice(0, 4);

  return (
    <div className="space-y-6 pb-12">
      {/* Role-Specific Hero Header */}
      <div className="relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-5 bg-gradient-to-r from-slate-900 via-slate-900 to-slate-800 p-6 rounded-2xl text-white border border-slate-800 shadow-md">
        {/* Subtle ambient lighting to retain color without harshness */}
        <div className="absolute -right-8 -top-8 w-56 h-56 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-1/3 -bottom-10 w-48 h-48 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center gap-2">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700/60 text-xs font-medium text-slate-300">
              <span
                className={`w-2 h-2 rounded-full ${isAdmin
                    ? 'bg-blue-400'
                    : isManager
                      ? 'bg-indigo-400'
                      : 'bg-emerald-400'
                  }`}
              />
              <span>{currentUser.role} Workspace</span>
              <span className="text-slate-500">•</span>
              <span className="text-slate-400 font-normal">{currentUser.name}</span>
            </div>
          </div>

          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white mt-2.5">
            {isAdmin && 'Brokerage Overview & Performance'}
            {isManager && `Sales Team Overview • ${currentAgentRecord?.department || 'Regional Sales'}`}
            {isExecutive && `Welcome back, ${currentUser.name.split(' ')[0]} 👋`}
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
            {isAdmin && 'Real-time overview of brokerage sales, active pipeline valuation, and executive quota targets.'}
            {isManager && `Supervising ${agents.length} sales executives. Monitor unassigned inquiries, team capacity, and booking agreements.`}
            {isExecutive && (
              <>
                You have <strong className="text-white font-semibold">{myActiveLeads} active leads</strong> in your pipeline and <strong className="text-amber-300 font-semibold">{myPendingFollowups} follow-up calls</strong> pending today.
              </>
            )}
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-3 shrink-0">
          <Link href="/pipeline">
            <Button
              variant="secondary"
              size="sm"
              className="bg-slate-800/90 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700/80 text-xs font-medium px-3.5 py-2 rounded-xl transition-all shadow-xs"
            >
              View Pipeline
            </Button>
          </Link>
          <Button
            size="sm"
            onClick={() => setIsAddLeadOpen(true)}
            className="bg-blue-600 hover:bg-blue-500 text-white gap-1.5 shadow-sm text-xs font-medium px-4 py-2 rounded-xl transition-all"
          >
            <Plus className="w-4 h-4" /> Add Lead
          </Button>
        </div>
      </div>

      {/* Sales Manager Alert Banner (if unassigned leads exist) */}
      {isManager && newLeads > 0 && (
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-900 flex items-center justify-between gap-3 text-xs animate-in fade-in">
          <div className="flex items-center gap-2.5">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
            <div>
              <strong className="font-bold text-amber-800">{newLeads} Inbound Leads are Unassigned!</strong>
              <p className="text-amber-700/90 mt-0.5">
                New buyer inquiries arrived through digital portals. Assign them to team members to balance agent workload.
              </p>
            </div>
          </div>
          <Link href="/assignments">
            <Button size="sm" className="bg-amber-600 hover:bg-amber-700 text-white text-xs shrink-0">
              Assign Leads &rarr;
            </Button>
          </Link>
        </div>
      )}

      {/* 8 Clickable Metric Cards Grid - DYNAMIC BASED ON ROLE */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        {/* Card 1: Leads */}
        <Link href="/leads" className="block group">
          <Card className="h-full bg-blue-50/60 bg-gradient-to-br from-blue-100/70 via-blue-50/50 to-blue-50/30 border-blue-200/90 hover:bg-blue-100/60 hover:from-blue-100/95 hover:via-blue-100/70 hover:to-blue-50/60 hover:border-blue-400 hover:shadow-lg hover:shadow-blue-500/15 hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-200 cursor-pointer relative overflow-hidden">
            <CardContent className="p-4 sm:p-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-600 group-hover:text-blue-700 transition-colors">
                  {isExecutive ? 'My Assigned Leads' : 'Total Inquiries'}
                </span>
                <div className="flex items-center gap-1.5">
                  <ArrowUpRight className="w-3.5 h-3.5 text-blue-400/80 group-hover:text-blue-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                  <div className="p-2 rounded-xl bg-blue-100 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors shadow-xs">
                    <Users2 className="w-4 h-4" />
                  </div>
                </div>
              </div>
              <div className="mt-3">
                <h3 className="text-2xl font-bold text-slate-900 tracking-tight group-hover:text-blue-700 transition-colors">
                  {isExecutive ? myLeads.length : totalLeads}
                </h3>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-[11px] text-slate-600 font-medium">
                    {isExecutive ? `${myActiveLeads} active inquiries` : `${newLeads} new today`}
                  </p>
                  <span className="text-[10px] text-blue-600 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                    View &rarr;
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        {/* Card 2: Active / Unassigned */}
        <Link href={isManager ? '/assignments' : '/pipeline'} className="block group">
          <Card className="h-full bg-indigo-50/60 bg-gradient-to-br from-indigo-100/70 via-indigo-50/50 to-indigo-50/30 border-indigo-200/90 hover:bg-indigo-100/60 hover:from-indigo-100/95 hover:via-indigo-100/70 hover:to-indigo-50/60 hover:border-indigo-400 hover:shadow-lg hover:shadow-indigo-500/15 hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-200 cursor-pointer relative overflow-hidden">
            <CardContent className="p-4 sm:p-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-600 group-hover:text-indigo-700 transition-colors">
                  {isManager ? 'Unassigned Inflow' : isExecutive ? 'My Active Deals' : 'Active Pipeline'}
                </span>
                <div className="flex items-center gap-1.5">
                  <ArrowUpRight className="w-3.5 h-3.5 text-indigo-400/80 group-hover:text-indigo-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                  <div className="p-2 rounded-xl bg-indigo-100 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors shadow-xs">
                    {isManager ? <UserPlus className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                  </div>
                </div>
              </div>
              <div className="mt-3">
                <h3 className="text-2xl font-bold text-slate-900 tracking-tight group-hover:text-indigo-700 transition-colors">
                  {isManager ? newLeads : isExecutive ? myActiveLeads : activeLeads}
                </h3>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-[11px] text-slate-600 font-medium">
                    {isManager ? 'Needs executive allocation' : 'In active negotiation'}
                  </p>
                  <span className="text-[10px] text-indigo-600 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                    {isManager ? 'Allocate &rarr;' : 'Pipeline &rarr;'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        {/* Card 3: Pending Follow-ups */}
        <Link href="/follow-ups" className="block group">
          <Card className="h-full bg-amber-50/60 bg-gradient-to-br from-amber-100/70 via-amber-50/50 to-amber-50/30 border-amber-200/90 hover:bg-amber-100/60 hover:from-amber-100/95 hover:via-amber-100/70 hover:to-amber-50/60 hover:border-amber-400 hover:shadow-lg hover:shadow-amber-500/15 hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-200 cursor-pointer relative overflow-hidden">
            <CardContent className="p-4 sm:p-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-600 group-hover:text-amber-800 transition-colors">
                  {isExecutive ? 'My Pending Calls' : 'Pending Follow-ups'}
                </span>
                <div className="flex items-center gap-1.5">
                  <ArrowUpRight className="w-3.5 h-3.5 text-amber-500/80 group-hover:text-amber-700 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                  <div className="p-2 rounded-xl bg-amber-100 text-amber-700 group-hover:bg-amber-600 group-hover:text-white transition-colors shadow-xs">
                    <PhoneCall className="w-4 h-4" />
                  </div>
                </div>
              </div>
              <div className="mt-3">
                <h3 className="text-2xl font-bold text-slate-900 tracking-tight group-hover:text-amber-800 transition-colors">
                  {isExecutive ? myPendingFollowups : pendingFollowups}
                </h3>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-[11px] text-amber-800 font-medium">
                    {isExecutive ? 'Due on your desk' : 'Across sales team'}
                  </p>
                  <span className="text-[10px] text-amber-700 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                    Open Calls &rarr;
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        {/* Card 4: Site Visits */}
        <Link href="/site-visits" className="block group">
          <Card className="h-full bg-purple-50/60 bg-gradient-to-br from-purple-100/70 via-purple-50/50 to-purple-50/30 border-purple-200/90 hover:bg-purple-100/60 hover:from-purple-100/95 hover:via-purple-100/70 hover:to-purple-50/60 hover:border-purple-400 hover:shadow-lg hover:shadow-purple-500/15 hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-200 cursor-pointer relative overflow-hidden">
            <CardContent className="p-4 sm:p-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-600 group-hover:text-purple-700 transition-colors">
                  {isExecutive ? 'My Site Visits Today' : "Today's Site Visits"}
                </span>
                <div className="flex items-center gap-1.5">
                  <ArrowUpRight className="w-3.5 h-3.5 text-purple-400/80 group-hover:text-purple-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                  <div className="p-2 rounded-xl bg-purple-100 text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors shadow-xs">
                    <CalendarCheck2 className="w-4 h-4" />
                  </div>
                </div>
              </div>
              <div className="mt-3">
                <h3 className="text-2xl font-bold text-slate-900 tracking-tight group-hover:text-purple-700 transition-colors">
                  {isExecutive ? myTodayVisits : todayVisits}
                </h3>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-[11px] text-purple-800 font-medium">
                    Scheduled showing appointments
                  </p>
                  <span className="text-[10px] text-purple-700 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                    Visits &rarr;
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        {/* Card 5: Closed Deals */}
        <Link href="/bookings" className="block group">
          <Card className="h-full bg-emerald-50/60 bg-gradient-to-br from-emerald-100/70 via-emerald-50/50 to-emerald-50/30 border-emerald-200/90 hover:bg-emerald-100/60 hover:from-emerald-100/95 hover:via-emerald-100/70 hover:to-emerald-50/60 hover:border-emerald-400 hover:shadow-lg hover:shadow-emerald-500/15 hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-200 cursor-pointer relative overflow-hidden">
            <CardContent className="p-4 sm:p-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-600 group-hover:text-emerald-700 transition-colors">
                  {isExecutive ? 'My Deals Closed' : 'Total Converted Deals'}
                </span>
                <div className="flex items-center gap-1.5">
                  <ArrowUpRight className="w-3.5 h-3.5 text-emerald-500/80 group-hover:text-emerald-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                  <div className="p-2 rounded-xl bg-emerald-100 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors shadow-xs">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                </div>
              </div>
              <div className="mt-3">
                <h3 className="text-2xl font-bold text-slate-900 tracking-tight group-hover:text-emerald-700 transition-colors">
                  {isExecutive ? myConverted : convertedLeads}
                </h3>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-[11px] text-emerald-700 font-medium">
                    {isExecutive ? 'Deals closed by you' : 'Booked & registered'}
                  </p>
                  <span className="text-[10px] text-emerald-600 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                    Deals &rarr;
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        {/* Card 6: Sales Volume / Quota */}
        <Link href="/bookings" className="block group">
          <Card className="h-full bg-green-50/60 bg-gradient-to-br from-green-100/70 via-green-50/50 to-green-50/30 border-green-200/90 hover:bg-green-100/60 hover:from-green-100/95 hover:via-green-100/70 hover:to-green-50/60 hover:border-green-400 hover:shadow-lg hover:shadow-green-500/15 hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-200 cursor-pointer relative overflow-hidden">
            <CardContent className="p-4 sm:p-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-600 group-hover:text-green-700 transition-colors">
                  {isExecutive ? 'My Sales Volume' : 'Total Booked Value'}
                </span>
                <div className="flex items-center gap-1.5">
                  <ArrowUpRight className="w-3.5 h-3.5 text-green-500/80 group-hover:text-green-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                  <div className="p-2 rounded-xl bg-green-100 text-green-600 group-hover:bg-green-600 group-hover:text-white transition-colors shadow-xs">
                    <Building2 className="w-4 h-4" />
                  </div>
                </div>
              </div>
              <div className="mt-3">
                <h3 className="text-2xl font-bold text-slate-900 tracking-tight group-hover:text-green-700 transition-colors">
                  {isExecutive ? formatINR(myTotalSales) : formatINR(totalBookingValue)}
                </h3>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-[11px] text-slate-600 font-medium">
                    {isExecutive ? `Capacity: ${myLeads.length}/${myCapacity}` : `${totalBookings} booked agreements`}
                  </p>
                  <span className="text-[10px] text-green-600 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                    Revenue &rarr;
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        {/* Card 7: Conversion Rate */}
        <Link href="/reports" className="block group">
          <Card className="h-full bg-rose-50/60 bg-gradient-to-br from-rose-100/70 via-rose-50/50 to-rose-50/30 border-rose-200/90 hover:bg-rose-100/60 hover:from-rose-100/95 hover:via-rose-100/70 hover:to-rose-50/60 hover:border-rose-400 hover:shadow-lg hover:shadow-rose-500/15 hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-200 cursor-pointer relative overflow-hidden">
            <CardContent className="p-4 sm:p-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-600 group-hover:text-rose-700 transition-colors">
                  {isExecutive ? 'My Conversion Rate' : 'Team Conversion Rate'}
                </span>
                <div className="flex items-center gap-1.5">
                  <ArrowUpRight className="w-3.5 h-3.5 text-rose-400/80 group-hover:text-rose-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                  <div className="p-2 rounded-xl bg-rose-100 text-rose-600 group-hover:bg-rose-600 group-hover:text-white transition-colors shadow-xs">
                    <Trophy className="w-4 h-4" />
                  </div>
                </div>
              </div>
              <div className="mt-3">
                <h3 className="text-2xl font-bold text-slate-900 tracking-tight group-hover:text-rose-700 transition-colors">
                  {isExecutive ? myConversionRate : globalConversionRate}%
                </h3>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-[11px] text-emerald-700 font-semibold">
                    {isExecutive ? 'Personal closing ratio' : 'Organization benchmark'}
                  </p>
                  <span className="text-[10px] text-rose-600 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                    Analytics &rarr;
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        {/* Card 8: Quota / Team Health */}
        <Link href={isExecutive ? '/reports' : '/team'} className="block group">
          <Card className="h-full bg-teal-50/60 bg-gradient-to-br from-teal-100/70 via-teal-50/50 to-teal-50/30 border-teal-200/90 hover:bg-teal-100/60 hover:from-teal-100/95 hover:via-teal-100/70 hover:to-teal-50/60 hover:border-teal-400 hover:shadow-lg hover:shadow-teal-500/15 hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-200 cursor-pointer relative overflow-hidden">
            <CardContent className="p-4 sm:p-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-600 group-hover:text-teal-700 transition-colors">
                  {isExecutive ? 'My Quota Fulfillment' : 'Active Sales Force'}
                </span>
                <div className="flex items-center gap-1.5">
                  <ArrowUpRight className="w-3.5 h-3.5 text-teal-400/80 group-hover:text-teal-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                  <div className="p-2 rounded-xl bg-teal-100 text-teal-600 group-hover:bg-teal-600 group-hover:text-white transition-colors shadow-xs">
                    {isExecutive ? <Target className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                  </div>
                </div>
              </div>
              <div className="mt-3">
                <h3 className="text-2xl font-bold text-slate-900 tracking-tight group-hover:text-teal-700 transition-colors">
                  {isExecutive ? `${Math.min(100, Math.round((myTotalSales / 500000000) * 100))}%` : `${agents.length} Agents`}
                </h3>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-[11px] text-slate-600 font-medium">
                    {isExecutive ? 'Of ₹50 Cr annual target' : 'All actively deployed'}
                  </p>
                  <span className="text-[10px] text-teal-600 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                    {isExecutive ? 'Targets &rarr;' : 'Team &rarr;'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Analytics Charts */}
      <DashboardCharts />

      {/* Tables and Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Leads Table (Spans 2 cols) */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle>
                {isExecutive ? 'My Priority Customer Inquiries' : 'Recent Inquiries & Leads'}
              </CardTitle>
              <p className="text-xs text-slate-500 mt-0.5">
                {isExecutive ? `Inquiries assigned specifically to ${currentUser.name}` : 'Most recent prospect submissions across all agents'}
              </p>
            </div>

            {/* Scope toggle for Executive */}
            {isExecutive ? (
              <div className="flex items-center p-1 bg-slate-100 rounded-lg text-xs font-medium">
                <button
                  onClick={() => setLeadScope('my')}
                  className={`px-2.5 py-1 rounded-md transition-all ${leadScope === 'my' ? 'bg-white shadow-xs font-bold text-blue-600' : 'text-slate-600'
                    }`}
                >
                  My Leads ({myLeads.length})
                </button>
                <button
                  onClick={() => setLeadScope('all')}
                  className={`px-2.5 py-1 rounded-md transition-all ${leadScope === 'all' ? 'bg-white shadow-xs font-bold text-blue-600' : 'text-slate-600'
                    }`}
                >
                  All Team ({leads.length})
                </button>
              </div>
            ) : (
              <Link
                href="/leads"
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                View All Leads &rarr;
              </Link>
            )}
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-y border-slate-200/80 bg-slate-50/70 text-slate-500 font-medium">
                    <th className="py-2.5 px-4">Lead</th>
                    <th className="py-2.5 px-3">Location & Type</th>
                    <th className="py-2.5 px-3">Budget</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3">Assigned Agent</th>
                    <th className="py-2.5 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {displayedRecentLeads.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-400">
                        No leads assigned to this view.
                      </td>
                    </tr>
                  ) : (
                    displayedRecentLeads.map((lead) => (
                      <tr
                        key={lead.id}
                        className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                        onClick={() => setSelectedLead(lead)}
                      >
                        <td className="py-3 px-4">
                          <p className="font-semibold text-slate-800">{lead.name}</p>
                          <p className="text-[11px] text-slate-400">{lead.mobile}</p>
                        </td>
                        <td className="py-3 px-3">
                          <p className="text-slate-700 font-medium truncate max-w-[150px]">
                            {lead.preferredLocation}
                          </p>
                          <span className="text-[10px] text-slate-400">{lead.propertyType}</span>
                        </td>
                        <td className="py-3 px-3 font-semibold text-slate-800">
                          {formatINR(lead.budget)}
                        </td>
                        <td className="py-3 px-3">
                          <StatusBadge status={lead.status} />
                        </td>
                        <td className="py-3 px-3 text-slate-600">
                          {lead.assignedAgentName || (
                            <span className="text-slate-400 italic">Unassigned</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <span className="text-blue-600 font-medium group-hover:underline">
                            Details
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Right Sidebar Widgets: Top Performers & Upcoming Visits */}
        <div className="space-y-6">
          {/* Top Performing Agents Leaderboard */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-sm">
                {isExecutive ? 'Sales Leaderboard Rank' : 'Top Sales Leaders'}
              </CardTitle>
              <Link href="/team" className="text-xs text-blue-600 hover:underline">
                Team
              </Link>
            </CardHeader>
            <CardContent className="space-y-3 pt-0">
              {topAgents.map((ag, index) => {
                const isMe = ag.id === currentUser.id;
                return (
                  <div
                    key={ag.id}
                    className={`flex items-center justify-between text-xs p-1.5 rounded-lg ${isMe ? 'bg-blue-50 border border-blue-200' : ''
                      }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="w-5 text-center font-bold text-slate-400 text-[11px]">
                        #{index + 1}
                      </span>
                      <img
                        src={ag.avatar}
                        alt={ag.name}
                        className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-200"
                      />
                      <div>
                        <p className="font-semibold text-slate-800 leading-tight">
                          {ag.name} {isMe && <span className="text-[10px] text-blue-600 font-bold">(You)</span>}
                        </p>
                        <p className="text-[10px] text-slate-500">{ag.convertedLeadsCount} deals closed</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-emerald-600">{formatINR(ag.totalSalesValue)}</span>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Upcoming Site Visits Widget */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-sm">
                {isExecutive ? 'My Scheduled Site Visits' : 'Upcoming Site Visits'}
              </CardTitle>
              <Link href="/site-visits" className="text-xs text-blue-600 hover:underline">
                Calendar
              </Link>
            </CardHeader>
            <CardContent className="space-y-2.5 pt-0">
              {upcomingVisits.length === 0 ? (
                <p className="text-center py-4 text-xs text-slate-400">
                  {isExecutive ? 'No site visits scheduled for you.' : 'No scheduled visits.'}
                </p>
              ) : (
                upcomingVisits.map((v) => (
                  <div
                    key={v.id}
                    className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70 text-xs flex items-start gap-2.5"
                  >
                    <div className="p-2 rounded-lg bg-purple-50 text-purple-600 shrink-0 mt-0.5">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-slate-800 truncate">{v.propertyName}</p>
                      <p className="text-[11px] text-slate-500 truncate">
                        Lead: {v.leadName} • Agent: {v.agentName}
                      </p>
                      <span className="text-[10px] text-purple-700 font-semibold block mt-0.5">
                        {formatDate(v.visitDate)} at {v.visitTime}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modals & Slide-out Drawer */}
      <LeadDetailsDrawer
        isOpen={!!selectedLead}
        onClose={() => setSelectedLead(null)}
        lead={selectedLead}
      />
      <AddLeadModal isOpen={isAddLeadOpen} onClose={() => setIsAddLeadOpen(false)} />
    </div>
  );
}
