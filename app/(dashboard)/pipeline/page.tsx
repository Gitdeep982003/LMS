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
import { Lead, LeadStatus } from '@/types';

interface PipelineColumn {
  id: LeadStatus;
  label: string;
  color: string;
  bgColor: string;
  borderColor: string;
}

const PIPELINE_COLUMNS: PipelineColumn[] = [
  { id: 'New', label: 'New Lead', color: 'text-[#8C6228]', bgColor: 'bg-[#FAF5EC]', borderColor: 'border-[#E5D0A6]' },
  { id: 'Contacted', label: 'Contacted', color: 'text-cyan-700', bgColor: 'bg-cyan-50/60', borderColor: 'border-cyan-200' },
  { id: 'Interested', label: 'Interested', color: 'text-teal-700', bgColor: 'bg-teal-50/60', borderColor: 'border-teal-200' },
  { id: 'Site Visit Scheduled', label: 'Site Visit', color: 'text-purple-700', bgColor: 'bg-purple-50/60', borderColor: 'border-purple-200' },
  { id: 'Negotiation', label: 'Negotiation', color: 'text-orange-700', bgColor: 'bg-orange-50/60', borderColor: 'border-orange-200' },
  { id: 'Booked', label: 'Booked', color: 'text-emerald-700', bgColor: 'bg-emerald-50/60', borderColor: 'border-emerald-200' },
  { id: 'Converted', label: 'Converted', color: 'text-green-800', bgColor: 'bg-green-100/60', borderColor: 'border-green-300' },
];

export default function PipelinePage() {
  const { leads, updateLeadStatus, agents } = useLmsStore();
  const { success } = useToast();

  const [search, setSearch] = useState('');
  const [selectedAgent, setSelectedAgent] = useState('ALL');
  const [draggedLeadId, setDraggedLeadId] = useState<string | null>(null);
  const [dragOverCol, setDragOverCol] = useState<LeadStatus | null>(null);

  // Modals
  const [viewingLead, setViewingLead] = useState<Lead | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);

  // Filter leads
  const filteredLeads = useMemo(() => {
    return leads.filter((l) => {
      if (selectedAgent !== 'ALL' && l.assignedAgentId !== selectedAgent) return false;
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
  }, [leads, selectedAgent, search]);

  // Group by stage
  const stageGroups = useMemo(() => {
    const groups: Record<LeadStatus, Lead[]> = {
      New: [],
      Assigned: [],
      Contacted: [],
      Interested: [],
      'Follow-up': [],
      'Site Visit Scheduled': [],
      'Site Visited': [],
      Negotiation: [],
      Booked: [],
      Converted: [],
      Lost: [],
    };

    filteredLeads.forEach((l) => {
      if (groups[l.status]) {
        groups[l.status].push(l);
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
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Kanban className="w-6 h-6 text-[#8C6228]" />
            <span>Sales Pipeline Kanban</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Drag and drop buyer deals across progression stages from initial inquiry to final registration.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Agent Filter */}
          <select
            value={selectedAgent}
            onChange={(e) => setSelectedAgent(e.target.value)}
            className="px-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:border-[#C59B63] focus:ring-1 focus:ring-[#C59B63] outline-none bg-white font-medium"
          >
            <option value="ALL">All Executives</option>
            {agents.map((ag) => (
              <option key={ag.id} value={ag.id}>
                {ag.name}
              </option>
            ))}
          </select>

          {/* Search */}
          <div className="relative w-48">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-2.5 py-1.5 text-xs rounded-lg border border-slate-200 focus:border-[#C59B63] focus:ring-1 focus:ring-[#C59B63] outline-none"
            />
          </div>

          <Button size="sm" onClick={() => setIsAddOpen(true)} className="gap-1.5 text-xs shadow-sm">
            <Plus className="w-4 h-4" />
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

            return (
              <div
                key={col.id}
                onDragOver={(e) => handleDragOver(e, col.id)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, col.id)}
                className={`w-72 shrink-0 flex flex-col h-full rounded-2xl border transition-all duration-200 bg-slate-100/70 ${
                  isTarget ? 'ring-2 ring-[#C59B63] border-[#C59B63] bg-[#FAF5EC]/50' : 'border-slate-200'
                }`}
              >
                {/* Column Header */}
                <div className={`p-3.5 rounded-t-2xl border-b ${col.borderColor} ${col.bgColor} flex items-center justify-between`}>
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${col.id === 'Booked' || col.id === 'Converted' ? 'bg-emerald-500' : 'bg-[#C59B63]'}`} />
                    <h3 className={`font-bold text-xs uppercase tracking-wider ${col.color}`}>
                      {col.label}
                    </h3>
                  </div>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-white/80 text-slate-700 shadow-2xs">
                    {colLeads.length}
                  </span>
                </div>

                {/* Column Sub-Header Value */}
                <div className="px-3.5 py-1.5 bg-white/60 border-b border-slate-200/50 text-[11px] text-slate-500 flex justify-between items-center">
                  <span>Deal Volume:</span>
                  <strong className="text-slate-800">{formatINR(colTotalValue)}</strong>
                </div>

                {/* Cards Container */}
                <div className="flex-1 overflow-y-auto p-2.5 space-y-2.5 scrollbar-thin">
                  {colLeads.length === 0 ? (
                    <div className="h-32 flex items-center justify-center border-2 border-dashed border-slate-200/80 rounded-xl text-[11px] text-slate-400">
                      Drop leads here
                    </div>
                  ) : (
                    colLeads.map((lead) => (
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
