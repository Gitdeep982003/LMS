'use client';

import React, { useState, useMemo } from 'react';
import {
  UserCheck,
  Users2,
  AlertCircle,
  CheckCircle2,
  Filter,
  Search,
  ShieldCheck,
  TrendingUp,
  ArrowRight,
  Briefcase,
} from 'lucide-react';
import { useLmsStore } from '@/store/useLmsStore';
import { useToast } from '@/components/ui/toast';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/ui/badge';
import { formatINR, formatDate } from '@/lib/utils';
import { AssignLeadModal } from '@/components/leads/AssignLeadModal';

export default function LeadAssignmentPage() {
  const { leads, agents, assignLead } = useLmsStore();
  const { success, error } = useToast();

  const [search, setSearch] = useState('');
  const [selectedAgentFilter, setSelectedAgentFilter] = useState<string>('ALL');
  const [selectedLeadIds, setSelectedLeadIds] = useState<string[]>([]);
  const [isBulkAssignOpen, setIsBulkAssignOpen] = useState(false);

  // Tabs: 'unassigned' | 'all'
  const [activeTab, setActiveTab] = useState<'unassigned' | 'all'>('unassigned');

  // Leads filtered
  const displayedLeads = useMemo(() => {
    return leads.filter((l) => {
      const isUnassigned = !l.assignedAgentId;
      if (activeTab === 'unassigned' && !isUnassigned) return false;

      const matchesAgent =
        selectedAgentFilter === 'ALL' ||
        (selectedAgentFilter === 'UNASSIGNED' ? !l.assignedAgentId : l.assignedAgentId === selectedAgentFilter);

      const matchesSearch =
        !search ||
        l.name.toLowerCase().includes(search.toLowerCase()) ||
        l.mobile.includes(search) ||
        l.preferredLocation.toLowerCase().includes(search.toLowerCase());

      return matchesAgent && matchesSearch;
    });
  }, [leads, activeTab, selectedAgentFilter, search]);

  const unassignedCount = leads.filter((l) => !l.assignedAgentId).length;

  const handleSelectOne = (id: string) => {
    setSelectedLeadIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedLeadIds(displayedLeads.map((l) => l.id));
    } else {
      setSelectedLeadIds([]);
    }
  };

  const handleQuickReassign = (leadId: string, agentId: string) => {
    const agent = agents.find((a) => a.id === agentId);
    if (!agent) return;
    assignLead(leadId, agent.id, agent.name);
    success('Assigned', `Lead assigned to ${agent.name}`);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-poppins font-bold text-[#0C141F] tracking-tight flex items-center gap-2.5">
            <UserCheck className="w-6 h-6 text-[#C59B63]" />
            <span>Lead Assignment & Workload</span>
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
            Allocate inbound buyer inquiries across sales representatives based on pipeline capacity.
          </p>
        </div>

        {selectedLeadIds.length > 0 && (
          <Button
            size="sm"
            onClick={() => setIsBulkAssignOpen(true)}
            className="gap-1.5 shadow-sm text-xs bg-[#0C141F] text-[#C59B63] hover:bg-[#16202E] border border-[#C59B63]/30"
          >
            <UserCheck className="w-4 h-4" />
            <span>Bulk Assign ({selectedLeadIds.length})</span>
          </Button>
        )}
      </div>

      {/* Agent Workload Overview Cards */}
      <div className="space-y-2">
        <h3 className="text-xs font-poppins font-semibold text-stone-600 uppercase tracking-wider">
          Sales Team Capacity & Workload Balance
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {agents.map((ag) => {
            const usagePct = Math.min(100, Math.round((ag.activeLeadsCount / ag.maxLeadCapacity) * 100));
            const isHigh = usagePct >= 80;

            return (
              <Card
                key={ag.id}
                className={`transition-all border-[#EAE4D9] hover:border-[#C59B63]/40 ${
                  selectedAgentFilter === ag.id ? 'ring-2 ring-[#C59B63] bg-[#FAF5EC]/50 border-[#C59B63]' : 'bg-white'
                }`}
              >
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={ag.avatar}
                        alt={ag.name}
                        className="w-9 h-9 rounded-full object-cover ring-2 ring-[#EAE4D9]"
                      />
                      <div>
                        <p className="text-xs font-poppins font-bold text-[#0C141F] leading-tight">{ag.name}</p>
                        <p className="text-[10px] text-stone-500">{ag.role}</p>
                      </div>
                    </div>
                    <button
                      onClick={() =>
                        setSelectedAgentFilter(selectedAgentFilter === ag.id ? 'ALL' : ag.id)
                      }
                      className="text-[10px] font-semibold text-[#8C6228] hover:text-[#C59B63] hover:underline"
                    >
                      {selectedAgentFilter === ag.id ? 'Clear' : 'Filter'}
                    </button>
                  </div>

                  {/* Workload Progress */}
                  <div>
                    <div className="flex items-center justify-between text-[11px] font-medium text-stone-600 mb-1">
                      <span>Active Capacity</span>
                      <span className={isHigh ? 'text-rose-600 font-bold' : 'text-[#0C141F] font-semibold'}>
                        {ag.activeLeadsCount} / {ag.maxLeadCapacity} ({usagePct}%)
                      </span>
                    </div>
                    <div className="w-full h-2 bg-[#F2EDE4] rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          isHigh ? 'bg-rose-500' : usagePct > 50 ? 'bg-[#C59B63]' : 'bg-emerald-600'
                        }`}
                        style={{ width: `${usagePct}%` }}
                      />
                    </div>
                  </div>

                  {/* Deal stats */}
                  <div className="pt-2 border-t border-[#EAE4D9] flex items-center justify-between text-[11px] text-stone-500">
                    <span>Won Deals: <strong className="text-[#0C141F]">{ag.convertedLeadsCount}</strong></span>
                    <span>Volume: <strong className="text-[#8C6228] font-semibold">{formatINR(ag.totalSalesValue)}</strong></span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Tabs & Search Filter */}
      <Card className="border-[#EAE4D9] bg-white">
        <CardContent className="p-4 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#EAE4D9] pb-3">
            {/* Tabs */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setActiveTab('unassigned');
                  setSelectedLeadIds([]);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  activeTab === 'unassigned'
                    ? 'bg-[#0C141F] text-[#C59B63] border border-[#C59B63]/30 shadow-xs'
                    : 'bg-[#F2EDE4] text-stone-600 hover:text-[#0C141F]'
                }`}
              >
                <span>Unassigned Leads</span>
                <span className="px-1.5 py-0.2 rounded-full bg-[#C59B63]/20 text-[10px] text-[#C59B63]">
                  {unassignedCount}
                </span>
              </button>

              <button
                onClick={() => {
                  setActiveTab('all');
                  setSelectedLeadIds([]);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === 'all'
                    ? 'bg-[#0C141F] text-[#C59B63] border border-[#C59B63]/30 shadow-xs'
                    : 'bg-[#F2EDE4] text-stone-600 hover:text-[#0C141F]'
                }`}
              >
                All Assigned Leads
              </button>
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-400" />
              <input
                type="text"
                placeholder="Search leads..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-[#EAE4D9] focus:border-[#C59B63] focus:ring-1 focus:ring-[#C59B63] outline-none bg-[#FAF8F5]/50"
              />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[#EAE4D9] bg-[#FAF5EC]/60 text-stone-600 font-poppins font-semibold uppercase tracking-wider text-[11px]">
                  <th className="py-2.5 px-3 w-8">
                    <input
                      type="checkbox"
                      onChange={handleSelectAll}
                      checked={
                        displayedLeads.length > 0 &&
                        selectedLeadIds.length === displayedLeads.length
                      }
                      className="rounded border-[#EAE4D9] text-[#C59B63] focus:ring-[#C59B63]"
                    />
                  </th>
                  <th className="py-2.5 px-3">Lead & Location</th>
                  <th className="py-2.5 px-3">Budget</th>
                  <th className="py-2.5 px-3">Source</th>
                  <th className="py-2.5 px-3">Current Status</th>
                  <th className="py-2.5 px-3">Current Assignee</th>
                  <th className="py-2.5 px-3 text-right">Assign / Reassign To</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EAE4D9]/60">
                {displayedLeads.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-10 text-center text-stone-400">
                      {activeTab === 'unassigned'
                        ? 'Awesome! All leads are currently assigned to sales executives.'
                        : 'No leads found matching your search.'}
                    </td>
                  </tr>
                ) : (
                  displayedLeads.map((l) => {
                    const isSelected = selectedLeadIds.includes(l.id);

                    return (
                      <tr
                        key={l.id}
                        className={`hover:bg-[#FAF8F5] transition-colors ${
                          isSelected ? 'bg-[#FAF5EC]' : ''
                        }`}
                      >
                        <td className="py-3 px-3">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleSelectOne(l.id)}
                            className="rounded border-[#EAE4D9] text-[#C59B63] focus:ring-[#C59B63]"
                          />
                        </td>
                        <td className="py-3 px-3">
                          <p className="font-poppins font-bold text-[#0C141F]">{l.name}</p>
                          <p className="text-[11px] text-stone-500">
                            {l.preferredLocation} • {l.propertyType}
                          </p>
                        </td>
                        <td className="py-3 px-3 font-semibold text-[#8C6228]">
                          {formatINR(l.budget)}
                        </td>
                        <td className="py-3 px-3 text-stone-600">{l.leadSource}</td>
                        <td className="py-3 px-3">
                          <StatusBadge status={l.status} />
                        </td>
                        <td className="py-3 px-3">
                          {l.assignedAgentName ? (
                            <span className="font-medium text-stone-700">
                              {l.assignedAgentName}
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                              <AlertCircle className="w-3 h-3" /> Unassigned
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-3 text-right">
                          <select
                            value={l.assignedAgentId || ''}
                            onChange={(e) => handleQuickReassign(l.id, e.target.value)}
                            className="px-2.5 py-1 text-xs rounded-lg border border-[#EAE4D9] focus:border-[#C59B63] focus:ring-1 focus:ring-[#C59B63] outline-none bg-white font-medium text-[#0C141F]"
                          >
                            <option value="">-- Choose Agent --</option>
                            {agents.map((ag) => (
                              <option key={ag.id} value={ag.id}>
                                {ag.name} ({ag.activeLeadsCount}/{ag.maxLeadCapacity})
                              </option>
                            ))}
                          </select>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Assign Modal */}
      <AssignLeadModal
        isOpen={isBulkAssignOpen}
        onClose={() => {
          setIsBulkAssignOpen(false);
          setSelectedLeadIds([]);
        }}
        leadIds={selectedLeadIds}
      />
    </div>
  );
}
