'use client';

import React, { useState, useMemo } from 'react';
import {
  MapPin,
  Plus,
  Search,
  Filter,
  Calendar,
  Clock,
  User,
  Building,
  CheckCircle2,
  XCircle,
  Star,
  Table as TableIcon,
  CalendarDays,
  Trash2,
} from 'lucide-react';
import { useLmsStore } from '@/store/useLmsStore';
import { useToast } from '@/components/ui/toast';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/utils';
import { ScheduleSiteVisitModal } from '@/components/sitevisits/ScheduleSiteVisitModal';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { Modal } from '@/components/ui/modal';
import { SiteVisit, SiteVisitStatus } from '@/types';

export default function SiteVisitsPage() {
  const { siteVisits, updateSiteVisit, deleteSiteVisit, properties, agents } = useLmsStore();
  const { success, error } = useToast();

  const [activeTab, setActiveTab] = useState<'all' | 'scheduled' | 'completed' | 'cancelled'>('all');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [search, setSearch] = useState('');
  const [propertyFilter, setPropertyFilter] = useState('ALL');

  // Modals
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [completingVisit, setCompletingVisit] = useState<SiteVisit | null>(null);
  const [feedback, setFeedback] = useState('');
  const [rating, setRating] = useState(5);
  const [reschedulingVisit, setReschedulingVisit] = useState<SiteVisit | null>(null);
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('11:30 AM');
  const [deletingVisit, setDeletingVisit] = useState<SiteVisit | null>(null);

  const filteredVisits = useMemo(() => {
    return siteVisits.filter((v) => {
      if (activeTab === 'scheduled' && v.status !== 'Scheduled') return false;
      if (activeTab === 'completed' && v.status !== 'Completed') return false;
      if (activeTab === 'cancelled' && v.status !== 'Cancelled') return false;

      if (propertyFilter !== 'ALL' && v.propertyId !== propertyFilter) return false;

      if (search) {
        const query = search.toLowerCase();
        return (
          v.leadName.toLowerCase().includes(query) ||
          v.propertyName.toLowerCase().includes(query) ||
          v.agentName.toLowerCase().includes(query)
        );
      }

      return true;
    });
  }, [siteVisits, activeTab, propertyFilter, search]);

  const handleCompleteSubmit = () => {
    if (completingVisit) {
      updateSiteVisit(completingVisit.id, {
        status: 'Completed',
        customerFeedback: feedback.trim() || 'Tour completed smoothly.',
        rating: Number(rating),
      });
      success('Site Visit Completed', `Marked completed with customer rating ${rating}/5.`);
      setCompletingVisit(null);
      setFeedback('');
    }
  };

  const handleRescheduleSubmit = () => {
    if (reschedulingVisit && newDate) {
      updateSiteVisit(reschedulingVisit.id, {
        visitDate: newDate,
        visitTime: newTime,
        status: 'Scheduled',
      });
      success('Visit Rescheduled', `Rescheduled for ${formatDate(newDate)} at ${newTime}`);
      setReschedulingVisit(null);
    }
  };

  const handleCancelVisit = (visit: SiteVisit) => {
    updateSiteVisit(visit.id, { status: 'Cancelled' });
    success('Visit Cancelled', `Site visit for ${visit.leadName} cancelled.`);
  };

  const handleDeleteConfirm = () => {
    if (deletingVisit) {
      deleteSiteVisit(deletingVisit.id);
      success('Deleted', 'Visit record removed.');
      setDeletingVisit(null);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <MapPin className="w-6 h-6 text-purple-600" />
            <span>Site Visit Management</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Coordinate on-ground property tours, sample flat inspections, and client feedback.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="flex items-center p-1 bg-slate-200/60 rounded-xl border border-slate-200">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'table' ? 'bg-white shadow-xs text-blue-600' : 'text-slate-500'
              }`}
              title="Table View"
            >
              <TableIcon className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('cards')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'cards' ? 'bg-white shadow-xs text-blue-600' : 'text-slate-500'
              }`}
              title="Cards View"
            >
              <CalendarDays className="w-4 h-4" />
            </button>
          </div>

          <Button size="sm" onClick={() => setIsAddOpen(true)} className="gap-1.5 text-xs shadow-sm bg-purple-600 hover:bg-purple-700">
            <Plus className="w-4 h-4" />
            <span>Schedule Site Visit</span>
          </Button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
            activeTab === 'all' ? 'bg-slate-900 text-white' : 'bg-white border text-slate-600'
          }`}
        >
          All Visits ({siteVisits.length})
        </button>
        <button
          onClick={() => setActiveTab('scheduled')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
            activeTab === 'scheduled' ? 'bg-purple-600 text-white' : 'bg-white border text-slate-600'
          }`}
        >
          Scheduled ({siteVisits.filter((v) => v.status === 'Scheduled').length})
        </button>
        <button
          onClick={() => setActiveTab('completed')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
            activeTab === 'completed' ? 'bg-emerald-600 text-white' : 'bg-white border text-slate-600'
          }`}
        >
          Completed ({siteVisits.filter((v) => v.status === 'Completed').length})
        </button>
        <button
          onClick={() => setActiveTab('cancelled')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
            activeTab === 'cancelled' ? 'bg-rose-600 text-white' : 'bg-white border text-slate-600'
          }`}
        >
          Cancelled
        </button>
      </div>

      {/* Search and Project Filter */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by customer, property, or agent..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200 focus:border-blue-500 outline-none"
              />
            </div>
            <div>
              <select
                value={propertyFilter}
                onChange={(e) => setPropertyFilter(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:border-blue-500 outline-none bg-white font-medium"
              >
                <option value="ALL">All Properties</option>
                {properties.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.city})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table Mode */}
      {viewMode === 'table' && (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                    <th className="py-3 px-4">Visit ID & Schedule</th>
                    <th className="py-3 px-3">Lead Name</th>
                    <th className="py-3 px-3">Property Project</th>
                    <th className="py-3 px-3">Accompanying Agent</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3">Feedback & Rating</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredVisits.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-slate-400">
                        No site visits match the criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredVisits.map((v) => (
                      <tr key={v.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3 px-4">
                          <span className="font-bold text-slate-900 block">{formatDate(v.visitDate)}</span>
                          <span className="text-[11px] text-purple-700 font-semibold">
                            {v.visitTime} • {v.id}
                          </span>
                        </td>
                        <td className="py-3 px-3 font-semibold text-slate-800">{v.leadName}</td>
                        <td className="py-3 px-3 text-slate-700 font-medium">{v.propertyName}</td>
                        <td className="py-3 px-3 text-slate-600">{v.agentName}</td>
                        <td className="py-3 px-3">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                              v.status === 'Completed'
                                ? 'bg-emerald-50 text-emerald-700'
                                : v.status === 'Cancelled'
                                ? 'bg-rose-50 text-rose-700'
                                : 'bg-purple-50 text-purple-700'
                            }`}
                          >
                            {v.status}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-slate-600 max-w-[200px]">
                          {v.rating && (
                            <div className="flex items-center gap-0.5 text-amber-500 mb-0.5">
                              {Array.from({ length: v.rating }).map((_, i) => (
                                <Star key={i} className="w-3 h-3 fill-current" />
                              ))}
                            </div>
                          )}
                          <p className="truncate text-[11px]">{v.customerFeedback || v.remarks || '-'}</p>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {v.status === 'Scheduled' && (
                              <>
                                <button
                                  onClick={() => setCompletingVisit(v)}
                                  className="px-2 py-1 rounded bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-semibold text-[11px]"
                                >
                                  Complete
                                </button>
                                <button
                                  onClick={() => {
                                    setReschedulingVisit(v);
                                    setNewDate(v.visitDate);
                                    setNewTime(v.visitTime);
                                  }}
                                  className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-[11px]"
                                >
                                  Reschedule
                                </button>
                                <button
                                  onClick={() => handleCancelVisit(v)}
                                  className="p-1 rounded text-slate-400 hover:text-rose-600"
                                  title="Cancel Visit"
                                >
                                  <XCircle className="w-3.5 h-3.5" />
                                </button>
                              </>
                            )}
                            <button
                              onClick={() => setDeletingVisit(v)}
                              className="p-1 rounded text-slate-400 hover:text-rose-600"
                              title="Delete Record"
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

      {/* Cards View Mode */}
      {viewMode === 'cards' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredVisits.map((v) => (
            <Card key={v.id} className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-purple-700 bg-purple-50 px-2.5 py-1 rounded-lg">
                  {formatDate(v.visitDate)} at {v.visitTime}
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    v.status === 'Completed'
                      ? 'bg-emerald-50 text-emerald-700'
                      : v.status === 'Cancelled'
                      ? 'bg-rose-50 text-rose-700'
                      : 'bg-purple-50 text-purple-700'
                  }`}
                >
                  {v.status}
                </span>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 text-sm">{v.propertyName}</h4>
                <p className="text-xs text-slate-600 mt-0.5">Customer: <strong>{v.leadName}</strong></p>
                <p className="text-xs text-slate-500">Sales Agent: {v.agentName}</p>
              </div>

              {v.customerFeedback && (
                <div className="p-2.5 bg-emerald-50/60 rounded-lg text-xs text-emerald-900">
                  <div className="flex items-center gap-1 text-amber-500 mb-1">
                    {Array.from({ length: v.rating || 5 }).map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-current" />
                    ))}
                  </div>
                  <p>&ldquo;{v.customerFeedback}&rdquo;</p>
                </div>
              )}

              {v.status === 'Scheduled' && (
                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                  <Button size="sm" variant="outline" onClick={() => setReschedulingVisit(v)} className="h-7 text-xs">
                    Reschedule
                  </Button>
                  <Button size="sm" variant="emerald" onClick={() => setCompletingVisit(v)} className="h-7 text-xs">
                    Mark Done
                  </Button>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* Complete Visit Modal */}
      {completingVisit && (
        <Modal
          isOpen={!!completingVisit}
          onClose={() => setCompletingVisit(null)}
          title="Complete Site Visit"
          description={`Log customer satisfaction and reaction for ${completingVisit.propertyName}`}
          maxWidth="md"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Client Rating (1 to 5 Stars)
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1 text-2xl transition-transform hover:scale-110"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        star <= rating ? 'text-amber-400 fill-amber-400' : 'text-slate-300'
                      }`}
                    />
                  </button>
                ))}
                <span className="text-xs font-bold text-slate-700 ml-2">{rating} / 5 Stars</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Customer Feedback & Reactions
              </label>
              <textarea
                rows={3}
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="e.g. Loved the master bedroom view and clubhouse amenities. Requested a quote for 4th floor unit..."
                className="w-full p-2.5 text-xs rounded-lg border border-slate-200 focus:border-blue-500 outline-none resize-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <Button variant="outline" size="sm" onClick={() => setCompletingVisit(null)}>
                Cancel
              </Button>
              <Button size="sm" variant="emerald" onClick={handleCompleteSubmit}>
                Confirm Completed
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Reschedule Visit Modal */}
      {reschedulingVisit && (
        <Modal
          isOpen={!!reschedulingVisit}
          onClose={() => setReschedulingVisit(null)}
          title="Reschedule Site Visit"
          description={`Select new date and time slot for ${reschedulingVisit.leadName}`}
          maxWidth="sm"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">New Visit Date</label>
              <input
                type="date"
                required
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:border-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">New Time Slot</label>
              <select
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:border-blue-500 outline-none bg-white font-medium"
              >
                <option value="10:00 AM">10:00 AM</option>
                <option value="11:30 AM">11:30 AM</option>
                <option value="02:00 PM">02:00 PM</option>
                <option value="03:30 PM">03:30 PM</option>
                <option value="05:00 PM">05:00 PM</option>
              </select>
            </div>
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <Button variant="outline" size="sm" onClick={() => setReschedulingVisit(null)}>
                Cancel
              </Button>
              <Button size="sm" onClick={handleRescheduleSubmit}>
                Update Schedule
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Modals */}
      <ScheduleSiteVisitModal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} />
      <ConfirmDialog
        isOpen={!!deletingVisit}
        onClose={() => setDeletingVisit(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Visit Record?"
        message="Are you sure you want to remove this site visit record?"
        confirmText="Delete"
      />
    </div>
  );
}
