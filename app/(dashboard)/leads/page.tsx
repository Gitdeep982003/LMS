'use client';

import React, { useState, useMemo, useRef } from 'react';
import {
  Users2,
  Plus,
  Search,
  Filter,
  Download,
  Upload,
  UserCheck,
  Edit,
  Trash2,
  Eye,
  Calendar,
  Phone,
  Mail,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
} from 'lucide-react';
import { useLmsStore } from '@/store/useLmsStore';
import { useToast } from '@/components/ui/toast';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge, PriorityBadge } from '@/components/ui/badge';
import { formatINR, formatDate } from '@/lib/utils';
import { exportLeadsToCSV, parseLeadsCSV } from '@/lib/csv';
import { AddLeadModal } from '@/components/leads/AddLeadModal';
import { EditLeadModal } from '@/components/leads/EditLeadModal';
import { LeadDetailsDrawer } from '@/components/leads/LeadDetailsDrawer';
import { AssignLeadModal } from '@/components/leads/AssignLeadModal';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { ScheduleFollowUpModal } from '@/components/followups/ScheduleFollowUpModal';
import { ScheduleSiteVisitModal } from '@/components/sitevisits/ScheduleSiteVisitModal';
import { CreateBookingModal } from '@/components/bookings/CreateBookingModal';
import { DateRangeFilter, DateRangeValue } from '@/components/ui/DateRangeFilter';
import { Lead, LeadStatus, LeadSource, PropertyType } from '@/types';

export default function LeadsPage() {
  const { leads, agents, deleteLead, importLeads } = useLmsStore();
  const { success, error, info } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Modals state
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [viewingLead, setViewingLead] = useState<Lead | null>(null);
  const [deletingLead, setDeletingLead] = useState<Lead | null>(null);
  const [assigningLeadIds, setAssigningLeadIds] = useState<string[]>([]);
  const [followUpLeadId, setFollowUpLeadId] = useState<string | null>(null);
  const [visitLeadId, setVisitLeadId] = useState<string | null>(null);
  const [bookingLeadId, setBookingLeadId] = useState<string | null>(null);

  // Search & Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [agentFilter, setAgentFilter] = useState<string>('ALL');
  const [sourceFilter, setSourceFilter] = useState<string>('ALL');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [dateFilter, setDateFilter] = useState<DateRangeValue>({ preset: 'all' });
  const [sortBy, setSortBy] = useState<'createdAt' | 'budget' | 'name'>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Multi-select for bulk assign
  const [selectedLeadIds, setSelectedLeadIds] = useState<string[]>([]);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;

  // Filtered and Sorted Leads
  const filteredLeads = useMemo(() => {
    return leads
      .filter((l) => {
        const matchesSearch =
          !search ||
          l.name.toLowerCase().includes(search.toLowerCase()) ||
          l.mobile.includes(search) ||
          l.email.toLowerCase().includes(search.toLowerCase()) ||
          l.id.toLowerCase().includes(search.toLowerCase()) ||
          l.preferredLocation.toLowerCase().includes(search.toLowerCase()) ||
          (l.interestedPropertyName && l.interestedPropertyName.toLowerCase().includes(search.toLowerCase()));

        const matchesStatus = statusFilter === 'ALL' || l.status === statusFilter;
        const matchesAgent =
          agentFilter === 'ALL' ||
          (agentFilter === 'UNASSIGNED' ? !l.assignedAgentId : l.assignedAgentId === agentFilter);
        const matchesSource = sourceFilter === 'ALL' || l.leadSource === sourceFilter;
        const matchesType = typeFilter === 'ALL' || l.propertyType === typeFilter;

        const leadDate = l.createdAt ? l.createdAt.split('T')[0] : '';
        const matchesStartDate = !dateFilter.startDate || leadDate >= dateFilter.startDate;
        const matchesEndDate = !dateFilter.endDate || leadDate <= dateFilter.endDate;
        const matchesDate = matchesStartDate && matchesEndDate;

        return matchesSearch && matchesStatus && matchesAgent && matchesSource && matchesType && matchesDate;
      })
      .sort((a, b) => {
        let comp = 0;
        if (sortBy === 'createdAt') comp = new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        if (sortBy === 'budget') comp = b.budget - a.budget;
        if (sortBy === 'name') comp = a.name.localeCompare(b.name);
        return sortOrder === 'asc' ? -comp : comp;
      });
  }, [leads, search, statusFilter, agentFilter, sourceFilter, typeFilter, dateFilter, sortBy, sortOrder]);

  const totalPages = Math.max(1, Math.ceil(filteredLeads.length / pageSize));
  const paginatedLeads = filteredLeads.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // Multi-select helpers
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedLeadIds(paginatedLeads.map((l) => l.id));
    } else {
      setSelectedLeadIds([]);
    }
  };

  const handleSelectOne = (id: string) => {
    setSelectedLeadIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  // CSV Export & Import
  const handleExportCSV = () => {
    exportLeadsToCSV(filteredLeads, `estatify-leads-${new Date().toISOString().split('T')[0]}.csv`);
    success('Export Complete', `${filteredLeads.length} leads exported to CSV.`);
  };

  const handleImportFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const parsed = parseLeadsCSV(text);
        if (parsed.length === 0) {
          error('Import Failed', 'No valid rows found in CSV.');
          return;
        }
        const count = importLeads(parsed);
        success('Import Successful', `${count} leads were added from CSV.`);
      } catch (err) {
        error('Import Error', 'Failed to parse CSV file.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleDeleteConfirm = () => {
    if (deletingLead) {
      deleteLead(deletingLead.id);
      success('Lead Deleted', `${deletingLead.name} was removed.`);
      setDeletingLead(null);
    }
  };

  const resetFilters = () => {
    setSearch('');
    setStatusFilter('ALL');
    setAgentFilter('ALL');
    setSourceFilter('ALL');
    setTypeFilter('ALL');
    setDateFilter({ preset: 'all' });
    setCurrentPage(1);
    info('Filters Cleared', 'Displaying all records.');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Page Title & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-poppins text-2xl sm:text-3xl font-bold text-[#0C141F] tracking-tight flex items-center gap-2.5">
            <Users2 className="w-6 h-6 text-[#C59B63]" />
            <span>All Customers</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            View, filter, qualify, and assign prospective real estate buyers and investors.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <DateRangeFilter
            value={dateFilter}
            onChange={(val) => {
              setDateFilter(val);
              setCurrentPage(1);
            }}
            matchingCount={filteredLeads.length}
            matchingLabel="leads"
            align="right"
          />

          {/* CSV Import Hidden Input */}
          <input
            type="file"
            ref={fileInputRef}
            accept=".csv"
            onChange={handleImportFileChange}
            className="hidden"
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            className="gap-1.5 text-xs"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Import CSV</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCSV}
            className="gap-1.5 text-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </Button>

          <Button
            size="sm"
            onClick={() => setIsAddOpen(true)}
            className="gap-1.5 shadow-sm text-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Lead</span>
          </Button>
        </div>
      </div>

      {/* Filter and Search Bar Card */}
      <Card>
        <CardContent className="p-4 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
            {/* Search Input */}
            <div className="sm:col-span-2 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by name, phone, email, project..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200 focus:border-[#C59B63] focus:ring-1 focus:ring-[#C59B63] outline-none"
              />
            </div>

            {/* Status Filter */}
            <div>
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-2.5 py-2 text-xs rounded-lg border border-slate-200 focus:border-[#C59B63] focus:ring-1 focus:ring-[#C59B63] outline-none bg-white font-medium"
              >
                <option value="ALL">Status: All</option>
                <option value="New">New</option>
                <option value="Contacted">Contacted</option>
                <option value="Qualified">Qualified</option>
                <option value="Site Visit">Site Visit</option>
                <option value="Negotiation">Negotiation</option>
                <option value="Won">Won</option>
                <option value="Lost">Lost</option>
              </select>
            </div>

            {/* Agent Filter */}
            <div>
              <select
                value={agentFilter}
                onChange={(e) => {
                  setAgentFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-2.5 py-2 text-xs rounded-lg border border-slate-200 focus:border-[#C59B63] focus:ring-1 focus:ring-[#C59B63] outline-none bg-white font-medium"
              >
                <option value="ALL">Executive: All</option>
                <option value="UNASSIGNED">Unassigned Only</option>
                {agents.map((ag) => (
                  <option key={ag.id} value={ag.id}>
                    {ag.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Source Filter */}
            <div>
              <select
                value={sourceFilter}
                onChange={(e) => {
                  setSourceFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-2.5 py-2 text-xs rounded-lg border border-slate-200 focus:border-[#C59B63] focus:ring-1 focus:ring-[#C59B63] outline-none bg-white font-medium"
              >
                <option value="ALL">Source: All</option>
                <option value="Website">Website</option>
                <option value="MagicBricks">MagicBricks</option>
                <option value="99acres">99acres</option>
                <option value="Housing.com">Housing.com</option>
                <option value="Referral">Referral</option>
                <option value="Google Ads">Google Ads</option>
                <option value="Walk-in">Walk-in</option>
                <option value="Facebook Ads">Facebook Ads</option>
              </select>
            </div>

            {/* Sort & Reset */}
            <div className="flex items-center gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full px-2.5 py-2 text-xs rounded-lg border border-slate-200 focus:border-[#C59B63] focus:ring-1 focus:ring-[#C59B63] outline-none bg-white"
              >
                <option value="createdAt">Sort: Recent</option>
                <option value="budget">Sort: Budget</option>
                <option value="name">Sort: Name</option>
              </select>
              <button
                onClick={resetFilters}
                className="p-2 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-500"
                title="Reset Filters"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Bulk Action Bar */}
          {selectedLeadIds.length > 0 && (
            <div className="flex items-center justify-between p-2.5 bg-[#FAF5EC]/80 border border-[#EAE4D9] rounded-lg text-xs animate-in fade-in">
              <span className="font-semibold text-[#0C141F]">
                {selectedLeadIds.length} leads selected
              </span>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  onClick={() => setAssigningLeadIds(selectedLeadIds)}
                  className="text-xs h-7 gap-1"
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>Assign Selected</span>
                </Button>
                <button
                  onClick={() => setSelectedLeadIds([])}
                  className="text-slate-500 hover:text-slate-800 text-xs px-2"
                >
                  Deselect All
                </button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Leads Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4 w-10">
                    <input
                      type="checkbox"
                      onChange={handleSelectAll}
                      checked={
                        paginatedLeads.length > 0 &&
                        selectedLeadIds.length === paginatedLeads.length
                      }
                      className="rounded border-slate-300 text-[#8C6228] focus:ring-blue-500"
                    />
                  </th>
                  <th className="py-3 px-3">Lead ID & Name</th>
                  <th className="py-3 px-3">Contact</th>
                  <th className="py-3 px-3">Interested Property & Area</th>
                  <th className="py-3 px-3">Budget</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3">Assigned Agent</th>
                  <th className="py-3 px-3">Source</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginatedLeads.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-12 text-center text-slate-400">
                      No leads match the selected filters or search query.
                    </td>
                  </tr>
                ) : (
                  paginatedLeads.map((lead) => {
                    const isSelected = selectedLeadIds.includes(lead.id);

                    return (
                      <tr
                        key={lead.id}
                        className={`hover:bg-slate-50 transition-colors group ${
                          isSelected ? 'bg-[#FAF5EC]/40' : ''
                        }`}
                      >
                        <td className="py-3 px-4">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleSelectOne(lead.id)}
                            className="rounded border-slate-300 text-[#8C6228] focus:ring-blue-500"
                          />
                        </td>
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-800 hover:text-[#C59B63] cursor-pointer" onClick={() => setViewingLead(lead)}>
                              {lead.name}
                            </span>
                            <PriorityBadge priority={lead.priority} />
                          </div>
                          <span className="text-[10px] text-slate-400 font-mono block mt-0.5">
                            {lead.id} • {formatDate(lead.createdAt)}
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-1.5 text-slate-700">
                            <Phone className="w-3 h-3 text-slate-400 shrink-0" />
                            <span>{lead.mobile}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-slate-400 text-[11px] truncate max-w-[140px] mt-0.5">
                            <Mail className="w-3 h-3 text-slate-300 shrink-0" />
                            <span>{lead.email}</span>
                          </div>
                        </td>
                        <td className="py-3 px-3">
                          <span className="font-medium text-slate-800 block truncate max-w-[180px]">
                            {lead.interestedPropertyName || 'General Inquiry'}
                          </span>
                          <span className="text-[10px] text-slate-500">
                            {lead.preferredLocation} • {lead.propertyType}
                          </span>
                        </td>
                        <td className="py-3 px-3 font-semibold text-slate-800">
                          {formatINR(lead.budget)}
                        </td>
                        <td className="py-3 px-3">
                          <StatusBadge status={lead.status} />
                        </td>
                        <td className="py-3 px-3">
                          {lead.assignedAgentName ? (
                            <span className="font-medium text-slate-700">
                              {lead.assignedAgentName}
                            </span>
                          ) : (
                            <button
                              onClick={() => setAssigningLeadIds([lead.id])}
                              className="text-[11px] text-[#8C6228] hover:underline font-semibold"
                            >
                              + Assign Agent
                            </button>
                          )}
                        </td>
                        <td className="py-3 px-3 text-slate-500 text-[11px]">
                          {lead.leadSource}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => setViewingLead(lead)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-[#C59B63] hover:bg-[#FAF5EC] transition-colors"
                              title="View Lead Details"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setEditingLead(lead)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                              title="Edit Lead"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setDeletingLead(lead)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                              title="Delete Lead"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          <div className="flex items-center justify-between px-4 py-3 border-t border-slate-200 text-xs text-slate-600">
            <div>
              Showing{' '}
              <strong className="text-slate-900">
                {filteredLeads.length > 0 ? (currentPage - 1) * pageSize + 1 : 0}
              </strong>{' '}
              to{' '}
              <strong className="text-slate-900">
                {Math.min(currentPage * pageSize, filteredLeads.length)}
              </strong>{' '}
              of <strong className="text-slate-900">{filteredLeads.length}</strong> leads
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="h-8 px-2.5 text-xs"
              >
                <ChevronLeft className="w-3.5 h-3.5" /> Previous
              </Button>
              <span className="font-medium text-slate-800 px-1">
                {currentPage} / {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="h-8 px-2.5 text-xs"
              >
                Next <ChevronRight className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modals & Slide-out Drawers */}
      <AddLeadModal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} />
      <EditLeadModal
        isOpen={!!editingLead}
        onClose={() => setEditingLead(null)}
        lead={editingLead}
      />
      <LeadDetailsDrawer
        isOpen={!!viewingLead}
        onClose={() => setViewingLead(null)}
        lead={viewingLead}
        onEdit={(lead) => {
          setViewingLead(null);
          setEditingLead(lead);
        }}
        onScheduleFollowUp={(lead) => {
          setViewingLead(null);
          setFollowUpLeadId(lead.id);
        }}
        onScheduleVisit={(lead) => {
          setViewingLead(null);
          setVisitLeadId(lead.id);
        }}
        onCreateBooking={(lead) => {
          setViewingLead(null);
          setBookingLeadId(lead.id);
        }}
      />
      <AssignLeadModal
        isOpen={assigningLeadIds.length > 0}
        onClose={() => setAssigningLeadIds([])}
        leadIds={assigningLeadIds}
      />
      <ScheduleFollowUpModal
        isOpen={!!followUpLeadId}
        onClose={() => setFollowUpLeadId(null)}
        initialLeadId={followUpLeadId || undefined}
      />
      <ScheduleSiteVisitModal
        isOpen={!!visitLeadId}
        onClose={() => setVisitLeadId(null)}
        initialLeadId={visitLeadId || undefined}
      />
      <CreateBookingModal
        isOpen={!!bookingLeadId}
        onClose={() => setBookingLeadId(null)}
        initialLeadId={bookingLeadId || undefined}
      />
      <ConfirmDialog
        isOpen={!!deletingLead}
        onClose={() => setDeletingLead(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Customer Lead?"
        message={`Are you sure you want to permanently delete "${deletingLead?.name}" (${deletingLead?.id})? This will also remove any scheduled follow-ups and site visits linked to this lead.`}
        confirmText="Delete Lead"
      />
    </div>
  );
}
