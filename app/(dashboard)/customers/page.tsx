'use client';

import React, { useState, useMemo } from 'react';
import {
  Contact2,
  Search,
  Filter,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Building,
  CheckCircle2,
  Clock,
  Sparkles,
  ChevronRight,
  Shield,
  Star,
} from 'lucide-react';
import { useLmsStore } from '@/store/useLmsStore';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatINR, formatDate } from '@/lib/utils';
import { Drawer } from '@/components/ui/drawer';
import { Lead } from '@/types';

interface ConsolidatedCustomer {
  key: string;
  name: string;
  phone: string;
  email: string;
  location: string;
  status: 'VIP' | 'Active' | 'Prospect';
  leads: Lead[];
  bookingsCount: number;
  totalSpent: number;
  firstDate: string;
}

export default function CustomersPage() {
  const { leads, bookings, followUps, siteVisits } = useLmsStore();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedCustomer, setSelectedCustomer] = useState<ConsolidatedCustomer | null>(null);

  // Consolidate customers by phone or name
  const customers = useMemo(() => {
    const map = new Map<string, ConsolidatedCustomer>();

    leads.forEach((l) => {
      const key = l.mobile.trim() || l.name.toLowerCase();
      if (!map.has(key)) {
        map.set(key, {
          key,
          name: l.name,
          phone: l.mobile,
          email: l.email,
          location: l.preferredLocation,
          status: 'Prospect',
          leads: [],
          bookingsCount: 0,
          totalSpent: 0,
          firstDate: l.createdAt,
        });
      }
      const cust = map.get(key)!;
      cust.leads.push(l);
      if (new Date(l.createdAt) < new Date(cust.firstDate)) {
        cust.firstDate = l.createdAt;
      }
    });

    // Check bookings
    bookings.forEach((b) => {
      const key = b.customerPhone.trim() || b.customerName.toLowerCase();
      if (map.has(key)) {
        const cust = map.get(key)!;
        cust.bookingsCount++;
        cust.totalSpent += b.propertyPrice || 0;
        cust.status = cust.totalSpent >= 50000000 ? 'VIP' : 'Active';
      }
    });

    return Array.from(map.values());
  }, [leads, bookings]);

  const filteredCustomers = useMemo(() => {
    return customers.filter((c) => {
      if (statusFilter !== 'ALL' && c.status !== statusFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          c.name.toLowerCase().includes(q) ||
          c.phone.includes(q) ||
          c.email.toLowerCase().includes(q) ||
          c.location.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [customers, statusFilter, search]);

  // Customer history lookups
  const customerFollowUps = useMemo(() => {
    if (!selectedCustomer) return [];
    return followUps.filter((f) => f.leadName.toLowerCase() === selectedCustomer.name.toLowerCase());
  }, [followUps, selectedCustomer]);

  const customerVisits = useMemo(() => {
    if (!selectedCustomer) return [];
    return siteVisits.filter((v) => v.leadName.toLowerCase() === selectedCustomer.name.toLowerCase());
  }, [siteVisits, selectedCustomer]);

  const customerBookings = useMemo(() => {
    if (!selectedCustomer) return [];
    return bookings.filter(
      (b) =>
        b.customerPhone === selectedCustomer.phone ||
        b.customerName.toLowerCase() === selectedCustomer.name.toLowerCase()
    );
  }, [bookings, selectedCustomer]);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Contact2 className="w-6 h-6 text-blue-600" />
            <span>Customer Profiles & Accounts</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Consolidated 360-degree client profiles with cross-project inquiries, bookings, and site visit logs.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 sm:p-5">
            <span className="text-xs text-slate-500 font-medium">Total Individual Clients</span>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">{customers.length} Profiles</h3>
            <p className="text-[11px] text-blue-600 mt-0.5">Consolidated from lead inquiries</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 sm:p-5">
            <span className="text-xs text-slate-500 font-medium">VIP & High Net-Worth Buyers</span>
            <h3 className="text-2xl font-bold text-purple-600 mt-1">
              {customers.filter((c) => c.status === 'VIP').length} VIP Clients
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">Portfolio value &gt; ₹5 Crores</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 sm:p-5">
            <span className="text-xs text-slate-500 font-medium">Active Buyers</span>
            <h3 className="text-2xl font-bold text-emerald-600 mt-1">
              {customers.filter((c) => c.status === 'Active').length} Active Contract Holders
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">Under active purchase agreements</p>
          </CardContent>
        </Card>
      </div>

      {/* Filter and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search customers by name, phone, or location..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200 focus:border-blue-500 outline-none"
              />
            </div>

            <div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:border-blue-500 outline-none bg-white font-medium"
              >
                <option value="ALL">All Client Tiers</option>
                <option value="VIP">VIP Portfolio Tier</option>
                <option value="Active">Active Property Owner</option>
                <option value="Prospect">Prospective Buyer</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Customers Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4">Client Name</th>
                  <th className="py-3 px-3">Contact</th>
                  <th className="py-3 px-3">Location</th>
                  <th className="py-3 px-3">Tier</th>
                  <th className="py-3 px-3">Inquiries</th>
                  <th className="py-3 px-3">Bookings</th>
                  <th className="py-3 px-3">Total Value</th>
                  <th className="py-3 px-4 text-right">360 View</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredCustomers.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-400">
                      No customer profiles found.
                    </td>
                  </tr>
                ) : (
                  filteredCustomers.map((cust) => (
                    <tr
                      key={cust.key}
                      onClick={() => setSelectedCustomer(cust)}
                      className="hover:bg-slate-50 transition-colors cursor-pointer group"
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 group-hover:text-blue-600">
                            {cust.name}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400">
                          Since {formatDate(cust.firstDate)}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-slate-700">
                        <p>{cust.phone}</p>
                        <p className="text-[11px] text-slate-400 truncate max-w-[150px]">{cust.email}</p>
                      </td>
                      <td className="py-3 px-3 font-medium text-slate-700">{cust.location}</td>
                      <td className="py-3 px-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                            cust.status === 'VIP'
                              ? 'bg-purple-50 text-purple-700 border border-purple-200'
                              : cust.status === 'Active'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {cust.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-semibold text-slate-800">{cust.leads.length}</td>
                      <td className="py-3 px-3 font-semibold text-slate-800">{cust.bookingsCount}</td>
                      <td className="py-3 px-3 font-bold text-slate-900">
                        {cust.totalSpent > 0 ? formatINR(cust.totalSpent) : '-'}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className="text-blue-600 font-semibold group-hover:underline flex items-center justify-end gap-1">
                          Profile &rarr;
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

      {/* Customer 360-Degree Profile Drawer */}
      <Drawer
        isOpen={!!selectedCustomer}
        onClose={() => setSelectedCustomer(null)}
        title={selectedCustomer?.name || 'Customer Profile'}
        subtitle={`Phone: ${selectedCustomer?.phone} • Email: ${selectedCustomer?.email}`}
        width="xl"
      >
        {selectedCustomer && (
          <div className="space-y-6 text-xs">
            {/* Tier banner */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-slate-900 to-blue-900 text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-blue-300">
                  Client Tier Classification
                </span>
                <h3 className="text-lg font-bold mt-0.5">{selectedCustomer.status} Client</h3>
                <p className="text-xs text-slate-300 mt-0.5">
                  Total Bookings: {selectedCustomer.bookingsCount} • Portfolio: {formatINR(selectedCustomer.totalSpent)}
                </p>
              </div>
              <div className="p-2.5 rounded-xl bg-white/10 text-white">
                <Star className="w-6 h-6 fill-current text-amber-400" />
              </div>
            </div>

            {/* Inquiries / Leads History */}
            <div className="space-y-2">
              <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
                Inquiry & Lead History ({selectedCustomer.leads.length})
              </h4>
              <div className="space-y-2">
                {selectedCustomer.leads.map((l) => (
                  <div key={l.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200/70 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">{l.id}</span>
                      <span className="text-[10px] text-slate-500">{formatDate(l.createdAt)}</span>
                    </div>
                    <p className="font-medium text-slate-800">
                      {l.interestedPropertyName || 'General Inquiry'} • Budget: {formatINR(l.budget)}
                    </p>
                    <p className="text-slate-500 text-[11px]">
                      Agent: {l.assignedAgentName || 'Unassigned'} • Status: {l.status}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Bookings History */}
            <div className="space-y-2">
              <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
                Property Bookings & Contracts ({customerBookings.length})
              </h4>
              {customerBookings.length === 0 ? (
                <p className="text-slate-400 py-2">No booked contracts yet.</p>
              ) : (
                customerBookings.map((b) => (
                  <div key={b.id} className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-200/80 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">{b.propertyName}</span>
                      <span className="font-bold text-emerald-700">{formatINR(b.propertyPrice)}</span>
                    </div>
                    <p className="text-[11px] text-slate-600">
                      Agreement #{b.agreementNumber} • Advance: {formatINR(b.bookingAmount)} ({b.paymentStatus})
                    </p>
                  </div>
                ))
              )}
            </div>

            {/* Site Visits History */}
            <div className="space-y-2">
              <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
                Site Visits & Tours ({customerVisits.length})
              </h4>
              {customerVisits.length === 0 ? (
                <p className="text-slate-400 py-2">No site visits scheduled.</p>
              ) : (
                customerVisits.map((v) => (
                  <div key={v.id} className="p-3 bg-purple-50/60 rounded-xl border border-purple-200/80 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-900">{v.propertyName}</span>
                      <span className="text-[10px] text-purple-700 font-bold">{v.status}</span>
                    </div>
                    <p className="text-[11px] text-slate-600">
                      {formatDate(v.visitDate)} at {v.visitTime} with {v.agentName}
                    </p>
                    {v.customerFeedback && (
                      <p className="text-[11px] text-slate-700 italic">
                        &ldquo;{v.customerFeedback}&rdquo;
                      </p>
                    )}
                  </div>
                ))
              )}
            </div>

            {/* Follow-up Notes History */}
            <div className="space-y-2">
              <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
                Follow-ups & Communication Logs ({customerFollowUps.length})
              </h4>
              {customerFollowUps.length === 0 ? (
                <p className="text-slate-400 py-2">No follow-ups recorded.</p>
              ) : (
                customerFollowUps.map((f) => (
                  <div key={f.id} className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-[11px]">
                    <div className="flex items-center justify-between text-slate-500 mb-0.5">
                      <span>{f.type} • {formatDate(f.scheduledDate)}</span>
                      <span className="font-semibold text-slate-700">{f.status}</span>
                    </div>
                    <p className="text-slate-800">{f.notes}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}
