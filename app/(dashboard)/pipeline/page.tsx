'use client';

import React, { useState, useMemo } from 'react';
import {
  Kanban,
  Search,
  Filter,
  Plus,
  User,
  Building,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  GripVertical,
} from 'lucide-react';
import { useLmsStore } from '@/store/useLmsStore';
import { useToast } from '@/components/ui/toast';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PriorityBadge } from '@/components/ui/badge';
import { formatINR } from '@/lib/utils';
import { LeadDetailsDrawer } from '@/components/leads/LeadDetailsDrawer';
import { AddLeadModal } from '@/components/leads/AddLeadModal';
import { DateRangeFilter, DateRangeValue } from '@/components/ui/DateRangeFilter';
import { PipelineFieldFilter } from '@/components/pipeline/PipelineFieldFilter';
import { ProjectDropdown } from '@/components/ui/ProjectDropdown';
import { Lead, LeadStatus } from '@/types';

interface PipelineColumn {
  id: LeadStatus;
  label: string;
  color: string;
  bgColor: string;
  borderColor: string;
}

const PIPELINE_COLUMNS: PipelineColumn[] = [
  { id: 'New', label: 'New', color: 'text-[#8C6228]', bgColor: 'bg-[#FAF5EC]', borderColor: 'border-[#E5D0A6]' },
  { id: 'Contacted', label: 'Contacted', color: 'text-sky-800', bgColor: 'bg-sky-50/70', borderColor: 'border-sky-200' },
  { id: 'Qualified', label: 'Qualified', color: 'text-indigo-800', bgColor: 'bg-indigo-50/70', borderColor: 'border-indigo-200' },
  { id: 'Site Visit', label: 'Site Visit', color: 'text-purple-800', bgColor: 'bg-purple-50/70', borderColor: 'border-purple-200' },
  { id: 'Negotiation', label: 'Negotiation', color: 'text-amber-800', bgColor: 'bg-amber-50/70', borderColor: 'border-amber-300' },
  { id: 'Won', label: 'Won', color: 'text-emerald-800', bgColor: 'bg-emerald-50/70', borderColor: 'border-emerald-300' },
  { id: 'Lost', label: 'Lost', color: 'text-rose-800', bgColor: 'bg-rose-50/70', borderColor: 'border-rose-200' },
];

export default function PipelinePage() {
  const { leads, updateLeadStatus, agents } = useLmsStore();
  const { success } = useToast();

  const [search, setSearch] = useState('');
  const [selectedAgent, setSelectedAgent] = useState('ALL');
  const [selectedStage, setSelectedStage] = useState('ALL');
  const [selectedPriority, setSelectedPriority] = useState('ALL');
  const [dateFilter, setDateFilter] = useState<DateRangeValue>({ preset: 'all' });
  const [draggedLeadId, setDraggedLeadId] = useState<string | null>(null);
  const [dragOverCol, setDragOverCol] = useState<LeadStatus | null>(null);

  // Pagination for every stage column
  const STAGE_PAGE_SIZE = 4;
  const [stagePages, setStagePages] = useState<Record<string, number>>({
    New: 1,
    Contacted: 1,
    Qualified: 1,
    'Site Visit': 1,
    Negotiation: 1,
    Won: 1,
    Lost: 1,
  });

  // Modals
  const [viewingLead, setViewingLead] = useState<Lead | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);

  // Filter leads
  const filteredLeads = useMemo(() => {
    return leads.filter((l) => {
      if (selectedAgent !== 'ALL' && l.assignedAgentId !== selectedAgent) return false;
      if (selectedStage !== 'ALL' && l.status !== selectedStage) return false;
      if (selectedPriority !== 'ALL' && l.priority !== selectedPriority) return false;
      const leadDate = l.createdAt ? l.createdAt.split('T')[0] : '';
      if (dateFilter.startDate && leadDate < dateFilter.startDate) return false;
      if (dateFilter.endDate && leadDate > dateFilter.endDate) return false;
      if (search) {
        const query = search.toLowerCase();
        return (
          l.name.toLowerCase().includes(query) ||
          l.preferredLocation.toLowerCase().includes(query) ||
          (l.interestedPropertyName && l.interestedPropertyName.toLowerCase().includes(query))
        );
      }
      return true;
    });
  }, [leads, selectedAgent, selectedStage, selectedPriority, search, dateFilter]);

  // Group by stage
  const stageGroups = useMemo(() => {
    const groups: Record<LeadStatus, Lead[]> = {
      New: [],
      Contacted: [],
      Qualified: [],
      'Site Visit': [],
      Negotiation: [],
      Won: [],
      Lost: [],
    };

    filteredLeads.forEach((l) => {
      let targetStatus: LeadStatus = l.status;
      const raw = l.status as string;
      if (raw === 'Assigned') targetStatus = 'New';
      else if (raw === 'Interested') targetStatus = 'Qualified';
      else if (raw === 'Follow-up') targetStatus = 'Contacted';
      else if (raw === 'Site Visit Scheduled' || raw === 'Site Visited') targetStatus = 'Site Visit';
      else if (raw === 'Booked' || raw === 'Converted') targetStatus = 'Won';

      if (groups[targetStatus]) {
        groups[targetStatus].push(l);
      } else {
        groups.New.push(l);
      }
    });

    return groups;
  }, [filteredLeads]);

  // Drag and Drop handlers
  const handleDragStart = (e: React.DragEvent, leadId: string) => {
    setDraggedLeadId(leadId);
    e.dataTransfer.setData('text/plain', leadId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, colId: LeadStatus) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverCol !== colId) {
      setDragOverCol(colId);
    }
  };

  const handleDragLeave = () => {
    setDragOverCol(null);
  };

  const handleDrop = (e: React.DragEvent, targetStatus: LeadStatus) => {
    e.preventDefault();
    setDragOverCol(null);
    const leadId = e.dataTransfer.getData('text/plain') || draggedLeadId;
    if (leadId) {
      const lead = leads.find((l) => l.id === leadId);
      if (lead && lead.status !== targetStatus) {
        updateLeadStatus(leadId, targetStatus);
        success('Stage Updated', `Moved "${lead.name}" to ${targetStatus}`);
      }
    }
    setDraggedLeadId(null);
  };

  return (
    <div className="space-y-6 pb-12 flex flex-col h-[calc(100vh-6.5rem)]">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-[#FAF5EC] border border-[#E5D0A6] flex items-center justify-center shrink-0 text-[#C59B63] shadow-2xs">
            <Kanban className="w-5 h-5 text-[#C59B63]" />
          </div>
          <div>
            <h1 className="font-poppins text-2xl font-bold text-[#0C141F] tracking-tight">
              Sales Pipeline
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 flex-wrap sm:flex-nowrap">
          <DateRangeFilter
            value={dateFilter}
            onChange={setDateFilter}
            matchingCount={filteredLeads.length}
            matchingLabel="deals"
            align="right"
          />

          {/* Two-Column Field Filter: Stage & Priority */}
          <PipelineFieldFilter
            selectedStage={selectedStage}
            onStageChange={setSelectedStage}
            selectedPriority={selectedPriority}
            onPriorityChange={setSelectedPriority}
            matchingCount={filteredLeads.length}
          />

          {/* Agent Filter with Custom Project Dropdown */}
          <div className="w-40 sm:w-44 shrink-0">
            <ProjectDropdown
              value={selectedAgent}
              onChange={setSelectedAgent}
              options={[
                { value: 'ALL', label: 'All Executives', dotColor: 'bg-stone-400' },
                ...agents.map((ag) => ({
                  value: ag.id,
                  label: ag.name,
                  dotColor: 'bg-[#C59B63]',
                })),
              ]}
              placeholder="All Executives"
              align="right"
            />
          </div>

          {/* Search */}
          <div className="relative w-40 sm:w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-400" />
            <input
              type="text"
              placeholder="Search buyer..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-9 pl-9 pr-3 text-xs rounded-xl border border-[#EAE4D9] focus:border-[#C59B63] focus:ring-1 focus:ring-[#C59B63] outline-none bg-white text-[#0C141F] shadow-xs placeholder:text-stone-400"
            />
          </div>

          <Button
            size="sm"
            onClick={() => setIsAddOpen(true)}
            className="h-9 px-4 gap-1.5 text-xs shadow-xs bg-[#0C141F] hover:bg-[#16202E] text-[#C59B63] hover:text-[#D4AF77] border border-[#C59B63]/40 rounded-xl whitespace-nowrap shrink-0"
          >
            <Plus className="w-4 h-4 text-[#C59B63]" />
            <span>Add Lead</span>
          </Button>
        </div>
      </div>

      {/* Kanban Board Horizontal Scroll Container */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden pb-4">
        <div className="flex items-start gap-4 min-w-[1550px] h-full">
          {PIPELINE_COLUMNS.map((col) => {
            const colLeads = stageGroups[col.id] || [];
            const colTotalValue = colLeads.reduce((sum, l) => sum + (l.budget || 0), 0);
            const isTarget = dragOverCol === col.id;

            const totalColumnPages = Math.max(1, Math.ceil(colLeads.length / STAGE_PAGE_SIZE));
            const currentPage = Math.min(stagePages[col.id] || 1, totalColumnPages);
            const paginatedColLeads = colLeads.slice(
              (currentPage - 1) * STAGE_PAGE_SIZE,
              currentPage * STAGE_PAGE_SIZE
            );

            return (
              <div
                key={col.id}
                onDragOver={(e) => handleDragOver(e, col.id)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, col.id)}
                className={`w-72 shrink-0 flex flex-col h-full rounded-2xl border transition-all duration-200 bg-slate-100/70 overflow-hidden ${
                  isTarget
                    ? 'ring-2 ring-[#C59B63] border-[#C59B63] bg-[#FAF5EC]/50'
                    : 'border-slate-200'
                }`}
              >
                {/* Column Header */}
                <div
                  className={`p-3.5 border-b ${col.borderColor} ${col.bgColor} flex items-center justify-between shrink-0`}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2.5 h-2.5 rounded-full ${
                        col.id === 'Won'
                          ? 'bg-emerald-500'
                          : col.id === 'Lost'
                          ? 'bg-rose-500'
                          : 'bg-[#C59B63]'
                      }`}
                    />
                    <h3 className={`font-bold text-xs uppercase tracking-wider ${col.color}`}>
                      {col.label}
                    </h3>
                  </div>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-white/80 text-slate-700 shadow-2xs">
                    {colLeads.length}
                  </span>
                </div>

                {/* Column Sub-Header Value */}
                <div className="px-3.5 py-1.5 bg-white/60 border-b border-slate-200/50 text-[11px] text-slate-500 flex justify-between items-center shrink-0">
                  <span>Deal Volume:</span>
                  <strong className="text-slate-800">{formatINR(colTotalValue)}</strong>
                </div>

                {/* Cards Container */}
                <div className="flex-1 overflow-y-auto p-2.5 space-y-2.5 scrollbar-thin">
                  {colLeads.length === 0 ? (
                    <div className="h-32 flex items-center justify-center border-2 border-dashed border-[#EAE4D9] rounded-xl text-[11px] text-stone-400">
                      No deals in this stage
                    </div>
                  ) : (
                    paginatedColLeads.map((lead) => (
                      <div
                        key={lead.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, lead.id)}
                        onClick={() => setViewingLead(lead)}
                        className={`p-3 rounded-xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-all cursor-grab active:cursor-grabbing select-none group relative ${
                          draggedLeadId === lead.id ? 'opacity-40 scale-95' : ''
                        }`}
                      >
                        {/* Drag Handle & Priority */}
                        <div className="flex items-center justify-between mb-1.5">
                          <PriorityBadge priority={lead.priority} />
                          <GripVertical className="w-3.5 h-3.5 text-slate-300 group-hover:text-slate-500" />
                        </div>

                        {/* Customer & Project */}
                        <h4 className="font-bold text-slate-900 text-xs group-hover:text-[#C59B63] transition-colors">
                          {lead.name}
                        </h4>
                        <p className="text-[11px] text-slate-500 truncate mt-0.5">
                          {lead.interestedPropertyName || lead.preferredLocation}
                        </p>

                        {/* Price & Agent Footer */}
                        <div className="flex items-center justify-between pt-2 mt-2 border-t border-slate-100 text-[11px]">
                          <span className="font-extrabold text-slate-800">
                            {formatINR(lead.budget)}
                          </span>
                          <span className="text-[10px] text-[#8C6228] font-medium truncate max-w-[100px]">
                            {lead.assignedAgentName || 'Unassigned'}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Column Pagination Footer */}
                <div className="p-2.5 bg-white border-t border-[#EAE4D9] flex items-center justify-between text-xs text-stone-600 shrink-0">
                  <button
                    type="button"
                    disabled={currentPage <= 1}
                    onClick={() =>
                      setStagePages((prev) => ({
                        ...prev,
                        [col.id]: Math.max(1, currentPage - 1),
                      }))
                    }
                    className="p-1 rounded-lg border border-[#EAE4D9] hover:bg-[#FAF5EC] disabled:opacity-30 disabled:cursor-not-allowed text-[#0C141F] transition-colors cursor-pointer"
                    title="Previous Page"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                  <div className="flex items-center gap-1 text-[11px] font-medium text-stone-600">
                    <span>Page</span>
                    <strong className="text-[#0C141F] font-bold">{currentPage}</strong>
                    <span>of</span>
                    <strong className="text-[#0C141F] font-bold">{totalColumnPages}</strong>
                    <span className="text-stone-400 ml-1">({colLeads.length})</span>
                  </div>
                  <button
                    type="button"
                    disabled={currentPage >= totalColumnPages}
                    onClick={() =>
                      setStagePages((prev) => ({
                        ...prev,
                        [col.id]: Math.min(totalColumnPages, currentPage + 1),
                      }))
                    }
                    className="p-1 rounded-lg border border-[#EAE4D9] hover:bg-[#FAF5EC] disabled:opacity-30 disabled:cursor-not-allowed text-[#0C141F] transition-colors cursor-pointer"
                    title="Next Page"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modals */}
      <LeadDetailsDrawer
        isOpen={!!viewingLead}
        onClose={() => setViewingLead(null)}
        lead={viewingLead}
      />
      <AddLeadModal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} />
    </div>
  );
}
