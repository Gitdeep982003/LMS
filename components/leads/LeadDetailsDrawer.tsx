'use client';

import React, { useState } from 'react';
import { Drawer } from '@/components/ui/drawer';
import { StatusBadge, PriorityBadge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useLmsStore } from '@/store/useLmsStore';
import { useToast } from '@/components/ui/toast';
import { formatINR, formatDate, formatDateTime } from '@/lib/utils';
import {
  Phone,
  Mail,
  MapPin,
  Calendar,
  Building,
  User,
  Clock,
  Send,
  MessageSquare,
  History,
  CheckCircle2,
  CalendarPlus,
  Compass,
} from 'lucide-react';
import { Lead } from '@/types';

interface LeadDetailsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  lead: Lead | null;
  onEdit?: (lead: Lead) => void;
  onScheduleVisit?: (lead: Lead) => void;
  onScheduleFollowUp?: (lead: Lead) => void;
  onCreateBooking?: (lead: Lead) => void;
}

export function LeadDetailsDrawer({
  isOpen,
  onClose,
  lead,
  onEdit,
  onScheduleVisit,
  onScheduleFollowUp,
  onCreateBooking,
}: LeadDetailsDrawerProps) {
  const { addLeadNote, updateLeadStatus } = useLmsStore();
  const { success } = useToast();
  const [newNote, setNewNote] = useState('');
  const [activeTab, setActiveTab] = useState<'details' | 'notes' | 'activities'>('details');

  if (!lead) return null;

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    addLeadNote(lead.id, newNote.trim());
    setNewNote('');
    success('Note Added', 'Follow-up note logged successfully.');
  };

  const handleStatusChange = (newStatus: any) => {
    updateLeadStatus(lead.id, newStatus);
    success('Status Updated', `Lead status updated to ${newStatus}`);
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={lead.name}
      subtitle={`Lead ID: ${lead.id} • Created ${formatDate(lead.createdAt)}`}
      width="xl"
    >
      {/* Top Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200/80">
        <div className="flex items-center gap-2">
          <StatusBadge status={lead.status} />
          <PriorityBadge priority={lead.priority} />
        </div>

        <div className="flex items-center gap-1.5">
          <a
            href={`tel:${lead.mobile}`}
            className="p-2 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors"
            title="Call Lead"
          >
            <Phone className="w-4 h-4" />
          </a>
          <a
            href={`https://wa.me/${lead.mobile.replace(/[^0-9]/g, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg bg-green-50 text-green-700 hover:bg-green-100 transition-colors"
            title="WhatsApp Lead"
          >
            <MessageSquare className="w-4 h-4" />
          </a>
          <a
            href={`mailto:${lead.email}`}
            className="p-2 rounded-lg bg-[#FAF5EC] text-[#0C141F] hover:bg-blue-100 transition-colors"
            title="Email Lead"
          >
            <Mail className="w-4 h-4" />
          </a>
          {onEdit && (
            <Button size="sm" variant="outline" onClick={() => onEdit(lead)} className="text-xs h-8">
              Edit
            </Button>
          )}
        </div>
      </div>

      {/* Quick Stage Progression Buttons */}
      <div className="space-y-1.5">
        <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
          Quick Actions & Conversion
        </span>
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => onScheduleFollowUp?.(lead)}
            className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-medium text-slate-700 shadow-xs"
          >
            <Clock className="w-3.5 h-3.5 text-amber-500" />
            <span>Follow-up</span>
          </button>
          <button
            onClick={() => onScheduleVisit?.(lead)}
            className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-medium text-slate-700 shadow-xs"
          >
            <Compass className="w-3.5 h-3.5 text-purple-500" />
            <span>Site Visit</span>
          </button>
          <button
            onClick={() => onCreateBooking?.(lead)}
            className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-xs font-medium text-emerald-800 shadow-xs"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Book Unit</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 text-xs font-medium">
        <button
          onClick={() => setActiveTab('details')}
          className={`pb-2.5 px-3 border-b-2 font-semibold transition-colors ${
            activeTab === 'details'
              ? 'border-blue-600 text-[#8C6228]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Overview & Info
        </button>
        <button
          onClick={() => setActiveTab('notes')}
          className={`pb-2.5 px-3 border-b-2 font-semibold transition-colors flex items-center gap-1.5 ${
            activeTab === 'notes'
              ? 'border-blue-600 text-[#8C6228]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <span>Notes</span>
          <span className="px-1.5 py-0.2 rounded-full bg-slate-100 text-[10px]">
            {lead.notes?.length || 0}
          </span>
        </button>
        <button
          onClick={() => setActiveTab('activities')}
          className={`pb-2.5 px-3 border-b-2 font-semibold transition-colors flex items-center gap-1.5 ${
            activeTab === 'activities'
              ? 'border-blue-600 text-[#8C6228]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <span>Activity Timeline</span>
          <span className="px-1.5 py-0.2 rounded-full bg-slate-100 text-[10px]">
            {lead.activities?.length || 0}
          </span>
        </button>
      </div>

      {/* Tab 1: Overview */}
      {activeTab === 'details' && (
        <div className="space-y-4 text-xs">
          {/* Key Metric Cards */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/60">
              <span className="text-[11px] text-slate-500 block mb-0.5">Estimated Budget</span>
              <span className="text-base font-bold text-slate-900">{formatINR(lead.budget)}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/60">
              <span className="text-[11px] text-slate-500 block mb-0.5">Property Type</span>
              <span className="text-base font-bold text-slate-900">{lead.propertyType}</span>
            </div>
          </div>

          {/* Details List */}
          <div className="rounded-xl border border-slate-200/80 divide-y divide-slate-100 bg-white">
            <div className="flex items-center justify-between p-3">
              <span className="text-slate-500 flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-slate-400" /> Mobile
              </span>
              <span className="font-semibold text-slate-800">{lead.mobile}</span>
            </div>
            <div className="flex items-center justify-between p-3">
              <span className="text-slate-500 flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-slate-400" /> Email
              </span>
              <span className="font-semibold text-slate-800 truncate max-w-[200px]">{lead.email}</span>
            </div>
            <div className="flex items-center justify-between p-3">
              <span className="text-slate-500 flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-slate-400" /> Preferred Location
              </span>
              <span className="font-semibold text-slate-800">{lead.preferredLocation}</span>
            </div>
            <div className="flex items-center justify-between p-3">
              <span className="text-slate-500 flex items-center gap-2">
                <Building className="w-3.5 h-3.5 text-slate-400" /> Interested Project
              </span>
              <span className="font-semibold text-slate-800 truncate max-w-[200px]">
                {lead.interestedPropertyName || 'General Inquiry'}
              </span>
            </div>
            <div className="flex items-center justify-between p-3">
              <span className="text-slate-500 flex items-center gap-2">
                <User className="w-3.5 h-3.5 text-slate-400" /> Assigned Executive
              </span>
              <span className="font-semibold text-[#0C141F]">
                {lead.assignedAgentName || 'Unassigned'}
              </span>
            </div>
            <div className="flex items-center justify-between p-3">
              <span className="text-slate-500 flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-slate-400" /> Next Follow-up
              </span>
              <span className="font-semibold text-amber-700">
                {formatDate(lead.followUpDate)}
              </span>
            </div>
            <div className="flex items-center justify-between p-3">
              <span className="text-slate-500">Lead Source</span>
              <span className="font-semibold text-slate-800">{lead.leadSource}</span>
            </div>
          </div>

          {/* Remarks */}
          {lead.remarks && (
            <div className="p-3 bg-amber-50/50 rounded-xl border border-amber-200/50">
              <span className="text-[11px] font-semibold text-amber-800 block mb-1">
                Client Remarks & Preferences
              </span>
              <p className="text-slate-700 leading-relaxed">{lead.remarks}</p>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Follow-up Notes */}
      {activeTab === 'notes' && (
        <div className="space-y-4">
          {/* Note Input */}
          <form onSubmit={handleAddNote} className="space-y-2">
            <textarea
              rows={2}
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="Log follow-up discussion, client feedback, or negotiation points..."
              className="w-full p-3 text-xs rounded-xl border border-slate-200 focus:border-[#C59B63] focus:ring-1 focus:ring-[#C59B63] focus:ring-2 focus:ring-blue-500/20 outline-none resize-none"
            />
            <div className="flex justify-end">
              <Button size="sm" type="submit" disabled={!newNote.trim()} className="text-xs">
                <Send className="w-3 h-3 mr-1" /> Add Note
              </Button>
            </div>
          </form>

          {/* Notes list */}
          <div className="space-y-2.5">
            {lead.notes && lead.notes.length > 0 ? (
              lead.notes.map((n) => (
                <div key={n.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 text-xs">
                  <div className="flex items-center justify-between text-slate-500 mb-1">
                    <span className="font-semibold text-slate-800">{n.authorName}</span>
                    <span className="text-[10px]">{formatDateTime(n.createdAt)}</span>
                  </div>
                  <p className="text-slate-700 leading-relaxed">{n.text}</p>
                  {n.stage && (
                    <span className="inline-block mt-1 text-[10px] font-medium text-[#8C6228] bg-[#FAF5EC] px-1.5 py-0.5 rounded">
                      Stage: {n.stage}
                    </span>
                  )}
                </div>
              ))
            ) : (
              <p className="text-center py-6 text-xs text-slate-400">No notes recorded yet.</p>
            )}
          </div>
        </div>
      )}

      {/* Tab 3: Activities Timeline */}
      {activeTab === 'activities' && (
        <div className="space-y-3">
          {lead.activities && lead.activities.length > 0 ? (
            <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
              {lead.activities.map((act) => (
                <div key={act.id} className="relative">
                  <span className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-blue-500 ring-4 ring-white" />
                  <div className="text-xs">
                    <p className="font-medium text-slate-800">{act.description}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      By {act.userName} • {formatDateTime(act.timestamp)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center py-6 text-xs text-slate-400">No activity history logged yet.</p>
          )}
        </div>
      )}
    </Drawer>
  );
}
