'use client';

import React, { useState, useMemo } from 'react';
import {
  CalendarClock,
  Plus,
  Search,
  Filter,
  Phone,
  MessageSquare,
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle,
  User,
  Edit,
  Trash2,
  Send,
  CalendarDays,
  Table as TableIcon,
} from 'lucide-react';
import { useLmsStore } from '@/store/useLmsStore';
import { useToast } from '@/components/ui/toast';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/utils';
import { ScheduleFollowUpModal } from '@/components/followups/ScheduleFollowUpModal';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { Modal } from '@/components/ui/modal';
import { FollowUp, FollowUpStatus, FollowUpType } from '@/types';

export default function FollowUpsPage() {
  const { followUps, agents, updateFollowUp, deleteFollowUp } = useLmsStore();
  const { success, error } = useToast();

  const [activeTab, setActiveTab] = useState<'today' | 'overdue' | 'upcoming' | 'all'>('today');
  const [viewMode, setViewMode] = useState<'table' | 'calendar'>('table');
  const [search, setSearch] = useState('');
  const [agentFilter, setAgentFilter] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');

  // Modals
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [completingFollowUp, setCompletingFollowUp] = useState<FollowUp | null>(null);
  const [completionFeedback, setCompletionFeedback] = useState('');
  const [deletingFollowUp, setDeletingFollowUp] = useState<FollowUp | null>(null);

  const todayStr = new Date().toISOString().split('T')[0];

  // Counts
  const todayCount = followUps.filter((f) => f.scheduledDate === todayStr && f.status !== 'Completed').length;
  const overdueCount = followUps.filter((f) => f.scheduledDate < todayStr && f.status !== 'Completed').length;
  const upcomingCount = followUps.filter((f) => f.scheduledDate > todayStr && f.status !== 'Completed').length;

  const filteredFollowUps = useMemo(() => {
    return followUps.filter((f) => {
      // Tab filter
      if (activeTab === 'today') {
        if (f.scheduledDate !== todayStr) return false;
      } else if (activeTab === 'overdue') {
        if (!(f.scheduledDate < todayStr && f.status !== 'Completed')) return false;
      } else if (activeTab === 'upcoming') {
        if (!(f.scheduledDate > todayStr && f.status !== 'Completed')) return false;
      }

      // Agent filter
      if (agentFilter !== 'ALL' && f.agentId !== agentFilter) return false;

      // Type filter
      if (typeFilter !== 'ALL' && f.type !== typeFilter) return false;

      // Search
      if (search) {
        const query = search.toLowerCase();
        const matches =
          f.leadName.toLowerCase().includes(query) ||
          f.agentName.toLowerCase().includes(query) ||
          (f.propertyName && f.propertyName.toLowerCase().includes(query)) ||
          f.notes.toLowerCase().includes(query);
        if (!matches) return false;
      }

      return true;
    });
  }, [followUps, activeTab, agentFilter, typeFilter, search, todayStr]);

  const handleMarkCompleted = () => {
    if (completingFollowUp) {
      updateFollowUp(completingFollowUp.id, {
        status: 'Completed',
        feedback: completionFeedback.trim() || 'Completed as scheduled.',
      });
      success('Follow-up Completed', `Marked done for ${completingFollowUp.leadName}`);
      setCompletingFollowUp(null);
      setCompletionFeedback('');
    }
  };

  const handleDeleteConfirm = () => {
    if (deletingFollowUp) {
      deleteFollowUp(deletingFollowUp.id);
      success('Deleted', 'Follow-up removed.');
      setDeletingFollowUp(null);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-poppins font-bold text-[#0C141F] tracking-tight flex items-center gap-2.5">
            <CalendarClock className="w-6 h-6 text-[#C59B63]" />
            <span>Sales Follow-up Tracker</span>
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
            Log client calls, meetings, WhatsApp follow-ups, and negotiation updates.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="flex items-center p-1 bg-[#F2EDE4] rounded-xl border border-[#EAE4D9]">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'table' ? 'bg-white shadow-xs text-[#8C6228]' : 'text-stone-500'
              }`}
              title="Table View"
            >
              <TableIcon className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'calendar' ? 'bg-white shadow-xs text-[#8C6228]' : 'text-stone-500'
              }`}
              title="Calendar Grouping"
            >
              <CalendarDays className="w-4 h-4" />
            </button>
          </div>

          <Button size="sm" onClick={() => setIsAddOpen(true)} className="gap-1.5 text-xs shadow-sm bg-[#0C141F] text-[#C59B63] hover:bg-[#16202E] border border-[#C59B63]/30">
            <Plus className="w-4 h-4" />
            <span>Schedule Follow-up</span>
          </Button>
        </div>
      </div>

      {/* Tabs and Quick Counters */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => setActiveTab('today')}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
            activeTab === 'today'
              ? 'bg-[#0C141F] text-[#C59B63] border border-[#C59B63]/30 shadow-sm'
              : 'bg-white border border-[#EAE4D9] text-stone-600 hover:bg-[#FAF8F5]'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Today&apos;s Follow-ups</span>
          <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${activeTab === 'today' ? 'bg-[#C59B63]/20 text-[#C59B63]' : 'bg-[#FAF5EC] text-stone-700'}`}>
            {todayCount}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('overdue')}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
            activeTab === 'overdue'
              ? 'bg-rose-700 text-white shadow-sm'
              : 'bg-white border border-[#EAE4D9] text-stone-600 hover:bg-[#FAF8F5]'
          }`}
        >
          <AlertCircle className="w-3.5 h-3.5" />
          <span>Overdue Tasks</span>
          <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${activeTab === 'overdue' ? 'bg-white/20' : 'bg-rose-100 text-rose-700'}`}>
            {overdueCount}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('upcoming')}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
            activeTab === 'upcoming'
              ? 'bg-[#8C6228] text-white shadow-sm'
              : 'bg-white border border-[#EAE4D9] text-stone-600 hover:bg-[#FAF8F5]'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>Upcoming Schedule</span>
          <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${activeTab === 'upcoming' ? 'bg-white/20' : 'bg-[#FAF5EC] text-stone-700'}`}>
            {upcomingCount}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('all')}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
            activeTab === 'all'
              ? 'bg-[#16202E] text-[#C59B63] border border-[#C59B63]/30 shadow-xs'
              : 'bg-white border border-[#EAE4D9] text-stone-600 hover:bg-[#FAF8F5]'
          }`}
        >
          <span>All Records ({followUps.length})</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <Card className="border-[#EAE4D9] bg-white">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              <input
                type="text"
                placeholder="Search by customer, agent, property..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-[#EAE4D9] focus:border-[#C59B63] focus:ring-1 focus:ring-[#C59B63] outline-none bg-[#FAF8F5]/50"
              />
            </div>

            <div>
              <select
                value={agentFilter}
                onChange={(e) => setAgentFilter(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-[#EAE4D9] focus:border-[#C59B63] focus:ring-1 focus:ring-[#C59B63] outline-none bg-white font-medium text-[#0C141F]"
              >
                <option value="ALL">All Executives</option>
                {agents.map((ag) => (
                  <option key={ag.id} value={ag.id}>
                    {ag.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-[#EAE4D9] focus:border-[#C59B63] focus:ring-1 focus:ring-[#C59B63] outline-none bg-white font-medium text-[#0C141F]"
              >
                <option value="ALL">All Interaction Types</option>
                <option value="Call">Phone Call</option>
                <option value="Meeting">Meeting</option>
                <option value="WhatsApp">WhatsApp</option>
                <option value="Site Visit">Site Visit</option>
                <option value="Email">Email</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table Mode */}
      {viewMode === 'table' && (
        <Card className="border-[#EAE4D9] bg-white">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-[#EAE4D9] bg-[#FAF5EC]/60 text-stone-600 font-poppins font-semibold uppercase tracking-wider text-[11px]">
                    <th className="py-3 px-4">Scheduled Date & Time</th>
                    <th className="py-3 px-3">Customer Lead</th>
                    <th className="py-3 px-3">Type</th>
                    <th className="py-3 px-3">Discussion Notes</th>
                    <th className="py-3 px-3">Assigned Agent</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EAE4D9]/60">
                  {filteredFollowUps.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-stone-400">
                        No follow-ups found in this view.
                      </td>
                    </tr>
                  ) : (
                    filteredFollowUps.map((f) => (
                      <tr key={f.id} className="hover:bg-[#FAF8F5] transition-colors">
                        <td className="py-3 px-4">
                          <span className="font-bold text-[#0C141F] block">
                            {formatDate(f.scheduledDate)}
                          </span>
                          <span className="text-[11px] text-[#8C6228] font-medium">{f.scheduledTime}</span>
                        </td>
                        <td className="py-3 px-3">
                          <p className="font-poppins font-semibold text-[#0C141F]">{f.leadName}</p>
                          <p className="text-[11px] text-[#8C6228] truncate max-w-[180px]">
                            {f.propertyName || 'Inquiry'}
                          </p>
                        </td>
                        <td className="py-3 px-3">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#FAF5EC] text-stone-700 border border-[#EAE4D9] font-medium text-[11px]">
                            {f.type === 'Call' && <Phone className="w-3 h-3 text-emerald-600" />}
                            {f.type === 'WhatsApp' && <MessageSquare className="w-3 h-3 text-green-600" />}
                            {f.type === 'Meeting' && <User className="w-3 h-3 text-[#C59B63]" />}
                            {f.type === 'Site Visit' && <Calendar className="w-3 h-3 text-[#8C6228]" />}
                            <span>{f.type}</span>
                          </span>
                        </td>
                        <td className="py-3 px-3 text-stone-700 max-w-[220px]">
                          <p className="truncate font-medium">{f.notes}</p>
                          {f.feedback && (
                            <p className="text-[11px] text-emerald-700 truncate">
                              ✓ {f.feedback}
                            </p>
                          )}
                        </td>
                        <td className="py-3 px-3 text-stone-700 font-medium">{f.agentName}</td>
                        <td className="py-3 px-3">
                          <span
                            className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                              f.status === 'Completed'
                                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                : f.status === 'Overdue'
                                ? 'bg-rose-50 text-rose-700 border border-rose-200'
                                : 'bg-[#FAF5EC] text-[#8C6228] border border-[#EAE4D9]'
                            }`}
                          >
                            {f.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {f.status !== 'Completed' && (
                              <button
                                onClick={() => setCompletingFollowUp(f)}
                                className="px-2 py-1 rounded bg-[#FAF5EC] text-[#8C6228] hover:bg-[#F2EDE4] border border-[#EAE4D9] font-semibold text-[11px]"
                              >
                                Mark Done
                              </button>
                            )}
                            <button
                              onClick={() => setDeletingFollowUp(f)}
                              className="p-1 rounded text-stone-400 hover:text-rose-600"
                              title="Delete"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Calendar View Mode */}
      {viewMode === 'calendar' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredFollowUps.map((f) => (
            <Card key={f.id} className="p-4 space-y-3 border-[#EAE4D9] bg-white hover:border-[#C59B63]/40">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-xs text-[#8C6228] bg-[#FAF5EC] border border-[#EAE4D9] px-2 py-0.5 rounded">
                  {formatDate(f.scheduledDate)} at {f.scheduledTime}
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    f.status === 'Completed'
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : f.status === 'Overdue'
                      ? 'bg-rose-50 text-rose-700 border border-rose-200'
                      : 'bg-[#FAF5EC] text-[#8C6228] border border-[#EAE4D9]'
                  }`}
                >
                  {f.status}
                </span>
              </div>

              <div>
                <h4 className="font-poppins font-bold text-[#0C141F] text-sm">{f.leadName}</h4>
                <p className="text-xs text-stone-500">{f.propertyName || 'General Inquiry'}</p>
              </div>

              <p className="text-xs text-stone-700 bg-[#FAF8F5] p-2.5 rounded-lg border border-[#EAE4D9]">
                {f.notes}
              </p>

              <div className="flex items-center justify-between pt-2 border-t border-[#EAE4D9] text-xs">
                <span className="text-stone-500">Agent: <strong>{f.agentName}</strong></span>
                {f.status !== 'Completed' && (
                  <button
                    onClick={() => setCompletingFollowUp(f)}
                    className="text-[#8C6228] font-semibold hover:text-[#C59B63] hover:underline"
                  >
                    Complete &rarr;
                  </button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Complete Follow-up Modal */}
      {completingFollowUp && (
        <Modal
          isOpen={!!completingFollowUp}
          onClose={() => setCompletingFollowUp(null)}
          title={`Log Outcome: ${completingFollowUp.leadName}`}
          description="Record customer reaction, discussion details, or next steps"
          maxWidth="md"
        >
          <div className="space-y-4">
            <div className="p-3 bg-slate-50 rounded-lg text-xs space-y-1">
              <p><strong>Scheduled Task:</strong> {completingFollowUp.notes}</p>
              <p><strong>Executive:</strong> {completingFollowUp.agentName}</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Customer Feedback & Next Action
              </label>
              <textarea
                rows={3}
                required
                value={completionFeedback}
                onChange={(e) => setCompletionFeedback(e.target.value)}
                placeholder="e.g. Client agreed on floor plan, requested Saturday site visit with architect..."
                className="w-full p-2.5 text-xs rounded-lg border border-slate-200 focus:border-[#C59B63] focus:ring-1 focus:ring-[#C59B63] outline-none resize-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <Button variant="outline" size="sm" onClick={() => setCompletingFollowUp(null)}>
                Cancel
              </Button>
              <Button size="sm" variant="emerald" onClick={handleMarkCompleted}>
                Save & Mark Completed
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Modals */}
      <ScheduleFollowUpModal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} />
      <ConfirmDialog
        isOpen={!!deletingFollowUp}
        onClose={() => setDeletingFollowUp(null)}
        onConfirm={handleDeleteConfirm}
        title="Remove Follow-up Task?"
        message="Are you sure you want to remove this scheduled follow-up?"
        confirmText="Delete"
      />
    </div>
  );
}
