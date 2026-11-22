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
      {/* Role-Specific Hero Header with Integrated Alert */}
      <div className="rounded-2xl border border-[#EAE4D9] bg-gradient-to-r from-white via-[#FAF8F5] to-[#FAF5EC] shadow-xs overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 sm:p-7">
          <div>
            <div className="flex items-center gap-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF5EC] border border-[#E5D0A6] text-xs font-semibold text-[#8C6228]">
                <span
                  className={`w-2 h-2 rounded-full ${
                    isAdmin
                      ? 'bg-[#C59B63]'
                      : isManager
                        ? 'bg-[#8C6228]'
                        : 'bg-emerald-600'
                  }`}
                />
                <span>{currentUser.role}</span>
                <span className="text-[#C59B63]/60">•</span>
                <span className="text-stone-600 font-normal">{currentUser.name}</span>
              </div>
            </div>

            <h1 className="font-poppins text-2xl sm:text-3xl font-bold tracking-tight text-[#0C141F] mt-2.5">
              {isAdmin && 'Brokerage Overview & Performance'}
              {isManager && `Sales Team Overview • ${currentAgentRecord?.department || 'Regional Sales'}`}
              {isExecutive && `Welcome back, ${currentUser.name.split(' ')[0]} 👋`}
            </h1>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <Link href="/pipeline">
              <Button
                variant="outline"
                size="sm"
                className="border-[#C59B63] text-[#0C141F] hover:bg-[#FAF5EC] text-xs font-semibold px-4 py-2 rounded-xl transition-all"
              >
                View Pipeline
              </Button>
            </Link>
            <Button
              size="sm"
              onClick={() => setIsAddLeadOpen(true)}
              className="bg-[#0C141F] hover:bg-[#16202E] text-[#C59B63] hover:text-[#D4AF77] border border-[#C59B63]/40 gap-1.5 shadow-xs text-xs font-semibold px-4 py-2 rounded-xl transition-all"
            >
              <Plus className="w-4 h-4 text-[#C59B63]" /> Add Lead
            </Button>
          </div>
        </div>

        {/* Integrated Sales Manager Alert Banner (Inside Header Card with seamless alignment) */}
        {isManager && newLeads > 0 && (
          <div className="border-t border-[#E5D0A6]/70 bg-[#FAF5EC]/70 px-6 sm:px-7 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs animate-in fade-in">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-white border border-[#E5D0A6] flex items-center justify-center shrink-0 shadow-xs">
                <AlertCircle className="w-4 h-4 text-[#C59B63]" />
              </div>
              <div>
                <strong className="font-bold text-[#543A18] text-xs sm:text-sm">
                  {newLeads} Inbound Leads are Unassigned!
                </strong>
                <p className="text-[#755220] text-xs mt-0.5">
                  New prospective buyer inquiries received. Assign them to sales executives to balance team workload.
                </p>
              </div>
            </div>
            <Link href="/assignments" className="shrink-0">
              <Button
                size="sm"
                variant="outline"
                className="border-[#C59B63] text-[#0C141F] bg-white hover:bg-[#FAF5EC] text-xs font-semibold px-4 py-2 rounded-xl shadow-xs hover:border-[#8C6228] transition-all"
              >
                Assign Leads &rarr;
              </Button>
            </Link>
          </div>
        )}
      </div>

      {/* 8 Clickable Metric Cards Grid - DYNAMIC BASED ON ROLE */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        {/* Card 1: Leads */}
        <Link href="/leads" className="block group">
          <Card className="h-full bg-white border-[#EAE4D9] hover:border-[#C59B63] hover:shadow-card-hover transition-all duration-200 cursor-pointer">
            <CardContent className="p-4 sm:p-5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-[#8C7A63] uppercase tracking-wider group-hover:text-[#0C141F] transition-colors">
                  {isExecutive ? 'My Assigned Leads' : 'Total Inquiries'}
                </span>
                <div className="flex items-center gap-1.5">
                  <ArrowUpRight className="w-3.5 h-3.5 text-stone-400 group-hover:text-[#C59B63] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                  <div className="p-2 rounded-xl bg-[#FAF5EC] text-[#C59B63] border border-[#F2E6CE]">
                    <Users2 className="w-4 h-4" />
                  </div>
                </div>
              </div>
              <div className="mt-3">
                <h3 className="font-poppins text-2xl font-bold text-[#0C141F] tracking-tight">
                  {isExecutive ? myLeads.length : totalLeads}
                </h3>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-[11px] text-stone-500 font-medium">
                    {isExecutive ? `${myActiveLeads} active inquiries` : `${newLeads} new today`}
                  </p>
                  <span className="text-[10px] text-[#C59B63] font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                    View &rarr;
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        {/* Card 2: Active / Unassigned */}
        <Link href={isManager ? '/assignments' : '/pipeline'} className="block group">
          <Card className="h-full bg-white border-[#EAE4D9] hover:border-[#C59B63] hover:shadow-card-hover transition-all duration-200 cursor-pointer">
            <CardContent className="p-4 sm:p-5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-[#8C7A63] uppercase tracking-wider group-hover:text-[#0C141F] transition-colors">
                  {isManager ? 'Unassigned Inflow' : isExecutive ? 'My Active Deals' : 'Active Pipeline'}
                </span>
                <div className="flex items-center gap-1.5">
                  <ArrowUpRight className="w-3.5 h-3.5 text-stone-400 group-hover:text-[#C59B63] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                  <div className="p-2 rounded-xl bg-[#FAF5EC] text-[#C59B63] border border-[#F2E6CE]">
                    {isManager ? <UserPlus className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                  </div>
                </div>
              </div>
              <div className="mt-3">
                <h3 className="font-poppins text-2xl font-bold text-[#0C141F] tracking-tight">
                  {isManager ? newLeads : isExecutive ? myActiveLeads : activeLeads}
                </h3>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-[11px] text-stone-500 font-medium">
                    {isManager ? 'Needs executive allocation' : 'In active negotiation'}
                  </p>
                  <span className="text-[10px] text-[#C59B63] font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                    {isManager ? 'Allocate &rarr;' : 'Pipeline &rarr;'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        {/* Card 3: Pending Follow-ups */}
        <Link href="/follow-ups" className="block group">
          <Card className="h-full bg-white border-[#EAE4D9] hover:border-[#C59B63] hover:shadow-card-hover transition-all duration-200 cursor-pointer">
            <CardContent className="p-4 sm:p-5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-[#8C7A63] uppercase tracking-wider group-hover:text-[#0C141F] transition-colors">
                  {isExecutive ? 'My Pending Calls' : 'Pending Follow-ups'}
                </span>
                <div className="flex items-center gap-1.5">
                  <ArrowUpRight className="w-3.5 h-3.5 text-stone-400 group-hover:text-[#C59B63] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                  <div className="p-2 rounded-xl bg-[#FAF5EC] text-[#C59B63] border border-[#F2E6CE]">
                    <PhoneCall className="w-4 h-4" />
                  </div>
                </div>
              </div>
              <div className="mt-3">
                <h3 className="font-poppins text-2xl font-bold text-[#0C141F] tracking-tight">
                  {isExecutive ? myPendingFollowups : pendingFollowups}
                </h3>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-[11px] text-[#8C6228] font-medium">
                    {isExecutive ? 'Due on your desk' : 'Across sales team'}
                  </p>
                  <span className="text-[10px] text-[#C59B63] font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                    Open Calls &rarr;
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        {/* Card 4: Site Visits */}
        <Link href="/site-visits" className="block group">
          <Card className="h-full bg-white border-[#EAE4D9] hover:border-[#C59B63] hover:shadow-card-hover transition-all duration-200 cursor-pointer">
            <CardContent className="p-4 sm:p-5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-[#8C7A63] uppercase tracking-wider group-hover:text-[#0C141F] transition-colors">
                  {isExecutive ? 'My Site Visits Today' : "Today's Site Visits"}
                </span>
                <div className="flex items-center gap-1.5">
                  <ArrowUpRight className="w-3.5 h-3.5 text-stone-400 group-hover:text-[#C59B63] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                  <div className="p-2 rounded-xl bg-[#FAF5EC] text-[#C59B63] border border-[#F2E6CE]">
                    <CalendarCheck2 className="w-4 h-4" />
                  </div>
                </div>
              </div>
              <div className="mt-3">
                <h3 className="font-poppins text-2xl font-bold text-[#0C141F] tracking-tight">
                  {isExecutive ? myTodayVisits : todayVisits}
                </h3>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-[11px] text-stone-500 font-medium">
                    Scheduled showing appointments
                  </p>
                  <span className="text-[10px] text-[#C59B63] font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                    Visits &rarr;
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        {/* Card 5: Closed Deals */}
        <Link href="/bookings" className="block group">
          <Card className="h-full bg-white border-[#EAE4D9] hover:border-[#C59B63] hover:shadow-card-hover transition-all duration-200 cursor-pointer">
            <CardContent className="p-4 sm:p-5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-[#8C7A63] uppercase tracking-wider group-hover:text-[#0C141F] transition-colors">
                  {isExecutive ? 'My Deals Closed' : 'Total Converted Deals'}
                </span>
                <div className="flex items-center gap-1.5">
                  <ArrowUpRight className="w-3.5 h-3.5 text-stone-400 group-hover:text-[#C59B63] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                  <div className="p-2 rounded-xl bg-[#FAF5EC] text-[#C59B63] border border-[#F2E6CE]">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                </div>
              </div>
              <div className="mt-3">
                <h3 className="font-poppins text-2xl font-bold text-[#0C141F] tracking-tight">
                  {isExecutive ? myConverted : convertedLeads}
                </h3>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-[11px] text-emerald-700 font-medium">
                    {isExecutive ? 'Deals closed by you' : 'Booked & registered'}
                  </p>
                  <span className="text-[10px] text-[#C59B63] font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                    Deals &rarr;
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        {/* Card 6: Sales Volume / Quota */}
        <Link href="/bookings" className="block group">
          <Card className="h-full bg-white border-[#EAE4D9] hover:border-[#C59B63] hover:shadow-card-hover transition-all duration-200 cursor-pointer">
            <CardContent className="p-4 sm:p-5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-[#8C7A63] uppercase tracking-wider group-hover:text-[#0C141F] transition-colors">
                  {isExecutive ? 'My Sales Volume' : 'Total Booked Value'}
                </span>
                <div className="flex items-center gap-1.5">
                  <ArrowUpRight className="w-3.5 h-3.5 text-stone-400 group-hover:text-[#C59B63] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                  <div className="p-2 rounded-xl bg-[#FAF5EC] text-[#C59B63] border border-[#F2E6CE]">
                    <Building2 className="w-4 h-4" />
                  </div>
                </div>
              </div>
              <div className="mt-3">
                <h3 className="font-poppins text-2xl font-bold text-[#0C141F] tracking-tight">
                  {isExecutive ? formatINR(myTotalSales) : formatINR(totalBookingValue)}
                </h3>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-[11px] text-stone-500 font-medium">
                    {isExecutive ? `Capacity: ${myLeads.length}/${myCapacity}` : `${totalBookings} booked agreements`}
                  </p>
                  <span className="text-[10px] text-[#C59B63] font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                    Revenue &rarr;
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        {/* Card 7: Conversion Rate */}
        <Link href="/reports" className="block group">
          <Card className="h-full bg-white border-[#EAE4D9] hover:border-[#C59B63] hover:shadow-card-hover transition-all duration-200 cursor-pointer">
            <CardContent className="p-4 sm:p-5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-[#8C7A63] uppercase tracking-wider group-hover:text-[#0C141F] transition-colors">
                  {isExecutive ? 'My Conversion Rate' : 'Team Conversion Rate'}
                </span>
                <div className="flex items-center gap-1.5">
                  <ArrowUpRight className="w-3.5 h-3.5 text-stone-400 group-hover:text-[#C59B63] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                  <div className="p-2 rounded-xl bg-[#FAF5EC] text-[#C59B63] border border-[#F2E6CE]">
                    <Trophy className="w-4 h-4" />
                  </div>
                </div>
              </div>
              <div className="mt-3">
                <h3 className="font-poppins text-2xl font-bold text-[#0C141F] tracking-tight">
                  {isExecutive ? myConversionRate : globalConversionRate}%
                </h3>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-[11px] text-[#8C6228] font-bold">
                    {isExecutive ? 'Personal closing ratio' : 'Organization benchmark'}
                  </p>
                  <span className="text-[10px] text-[#C59B63] font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                    Analytics &rarr;
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        {/* Card 8: Quota / Team Health */}
        <Link href={isExecutive ? '/reports' : '/team'} className="block group">
          <Card className="h-full bg-white border-[#EAE4D9] hover:border-[#C59B63] hover:shadow-card-hover transition-all duration-200 cursor-pointer">
            <CardContent className="p-4 sm:p-5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-[#8C7A63] uppercase tracking-wider group-hover:text-[#0C141F] transition-colors">
                  {isExecutive ? 'My Quota Fulfillment' : 'Active Sales Force'}
                </span>
                <div className="flex items-center gap-1.5">
                  <ArrowUpRight className="w-3.5 h-3.5 text-stone-400 group-hover:text-[#C59B63] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                  <div className="p-2 rounded-xl bg-[#FAF5EC] text-[#C59B63] border border-[#F2E6CE]">
                    {isExecutive ? <Target className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                  </div>
                </div>
              </div>
              <div className="mt-3">
                <h3 className="font-poppins text-2xl font-bold text-[#0C141F] tracking-tight">
                  {isExecutive ? `${Math.min(100, Math.round((myTotalSales / 500000000) * 100))}%` : `${agents.length} Agents`}
                </h3>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-[11px] text-stone-500 font-medium">
                    {isExecutive ? 'Of ₹50 Cr annual target' : 'All actively deployed'}
                  </p>
                  <span className="text-[10px] text-[#C59B63] font-bold opacity-0 group-hover:opacity-100 transition-opacity">
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
        <Card className="lg:col-span-2 border-[#EAE4D9] bg-white">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle>
                {isExecutive ? 'My Priority Customer Inquiries' : 'Recent Inquiries & Leads'}
              </CardTitle>
              <p className="text-xs text-stone-500 mt-0.5">
                {isExecutive ? `Inquiries assigned specifically to ${currentUser.name}` : 'Most recent prospect submissions across all agents'}
              </p>
            </div>

            {/* Scope toggle for Executive */}
            {isExecutive ? (
              <div className="flex items-center p-1 bg-[#F2EDE4] rounded-lg text-xs font-medium">
                <button
                  onClick={() => setLeadScope('my')}
                  className={`px-2.5 py-1 rounded-md transition-all ${leadScope === 'my' ? 'bg-[#0C141F] text-[#C59B63] font-bold shadow-xs' : 'text-stone-600 hover:text-[#0C141F]'
                    }`}
                >
                  My Leads ({myLeads.length})
                </button>
                <button
                  onClick={() => setLeadScope('all')}
                  className={`px-2.5 py-1 rounded-md transition-all ${leadScope === 'all' ? 'bg-[#0C141F] text-[#C59B63] font-bold shadow-xs' : 'text-stone-600 hover:text-[#0C141F]'
                    }`}
                >
                  All Team ({leads.length})
                </button>
              </div>
            ) : (
              <Link
                href="/leads"
                className="text-xs font-semibold text-[#8C6228] hover:text-[#C59B63] flex items-center gap-1 transition-colors"
              >
                View All Leads &rarr;
              </Link>
            )}
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-y border-[#EAE4D9] bg-[#FAF5EC]/60 text-stone-600 font-semibold text-[11px] uppercase tracking-wider">
                    <th className="py-2.5 px-4">Lead</th>
                    <th className="py-2.5 px-3">Location & Type</th>
                    <th className="py-2.5 px-3">Budget</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3">Assigned Agent</th>
                    <th className="py-2.5 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EAE4D9]/60">
                  {displayedRecentLeads.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-stone-400">
                        No leads assigned to this view.
                      </td>
                    </tr>
                  ) : (
                    displayedRecentLeads.map((lead) => (
                      <tr
                        key={lead.id}
                        className="hover:bg-[#FAF8F5] transition-colors group cursor-pointer"
                        onClick={() => setSelectedLead(lead)}
                      >
                        <td className="py-3 px-4">
                          <p className="font-semibold text-[#0C141F]">{lead.name}</p>
                          <p className="text-[11px] text-stone-400">{lead.mobile}</p>
                        </td>
                        <td className="py-3 px-3">
                          <p className="text-stone-700 font-medium truncate max-w-[150px]">
                            {lead.preferredLocation}
                          </p>
                          <span className="text-[10px] text-stone-400">{lead.propertyType}</span>
                        </td>
                        <td className="py-3 px-3 font-semibold text-[#8C6228]">
                          {formatINR(lead.budget)}
                        </td>
                        <td className="py-3 px-3">
                          <StatusBadge status={lead.status} />
                        </td>
                        <td className="py-3 px-3 text-stone-600">
                          {lead.assignedAgentName || (
                            <span className="text-stone-400 italic">Unassigned</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <span className="text-[#8C6228] font-semibold group-hover:text-[#C59B63] group-hover:underline transition-colors">
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
          <Card className="border-[#EAE4D9] bg-white">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-sm">
                {isExecutive ? 'Sales Leaderboard Rank' : 'Top Sales Leaders'}
              </CardTitle>
              <Link href="/team" className="text-xs text-[#8C6228] hover:text-[#C59B63] hover:underline font-semibold transition-colors">
                Team
              </Link>
            </CardHeader>
            <CardContent className="space-y-3 pt-0">
              {topAgents.map((ag, index) => {
                const isMe = ag.id === currentUser.id;
                return (
                  <div
                    key={ag.id}
                    className={`flex items-center justify-between text-xs p-1.5 rounded-lg transition-colors ${isMe ? 'bg-[#FAF5EC] border border-[#EAE4D9] ring-1 ring-[#C59B63]/40' : 'hover:bg-[#FAF8F5]'
                      }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="w-5 text-center font-bold text-[#8C6228] text-[11px]">
                        #{index + 1}
                      </span>
                      <img
                        src={ag.avatar}
                        alt={ag.name}
                        className="w-8 h-8 rounded-full object-cover ring-1 ring-[#EAE4D9]"
                      />
                      <div>
                        <p className="font-semibold text-[#0C141F] leading-tight">
                          {ag.name} {isMe && <span className="text-[10px] text-[#8C6228] font-bold">(You)</span>}
                        </p>
                        <p className="text-[10px] text-stone-500">{ag.convertedLeadsCount} deals closed</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-[#8C6228]">{formatINR(ag.totalSalesValue)}</span>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Upcoming Site Visits Widget */}
          <Card className="border-[#EAE4D9] bg-white">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-sm">
                {isExecutive ? 'My Scheduled Site Visits' : 'Upcoming Site Visits'}
              </CardTitle>
              <Link href="/site-visits" className="text-xs text-[#8C6228] hover:text-[#C59B63] hover:underline font-semibold transition-colors">
                Calendar
              </Link>
            </CardHeader>
            <CardContent className="space-y-2.5 pt-0">
              {upcomingVisits.length === 0 ? (
                <p className="text-center py-4 text-xs text-stone-400">
                  {isExecutive ? 'No site visits scheduled for you.' : 'No scheduled visits.'}
                </p>
              ) : (
                upcomingVisits.map((v) => (
                  <div
                    key={v.id}
                    className="p-2.5 rounded-xl bg-[#FAF8F5] border border-[#EAE4D9] text-xs flex items-start gap-2.5"
                  >
                    <div className="p-2 rounded-lg bg-[#FAF5EC] text-[#8C6228] border border-[#EAE4D9] shrink-0 mt-0.5">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-[#0C141F] truncate">{v.propertyName}</p>
                      <p className="text-[11px] text-stone-500 truncate">
                        Lead: {v.leadName} • Agent: {v.agentName}
                      </p>
                      <span className="text-[10px] text-[#8C6228] font-semibold block mt-0.5">
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
