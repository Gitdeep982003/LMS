'use client';

import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { useLmsStore } from '@/store/useLmsStore';
import { useToast } from '@/components/ui/toast';

interface ScheduleSiteVisitModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialLeadId?: string;
  initialPropertyId?: string;
}

export function ScheduleSiteVisitModal({
  isOpen,
  onClose,
  initialLeadId,
  initialPropertyId,
}: ScheduleSiteVisitModalProps) {
  const { leads, properties, agents, addSiteVisit } = useLmsStore();
  const { success, error } = useToast();

  const [leadId, setLeadId] = useState(initialLeadId || '');
  const [propertyId, setPropertyId] = useState(initialPropertyId || '');
  const [visitDate, setVisitDate] = useState('');
  const [visitTime, setVisitTime] = useState('11:30 AM');
  const [agentId, setAgentId] = useState('');
  const [remarks, setRemarks] = useState('');

  useEffect(() => {
    if (initialLeadId) {
      setLeadId(initialLeadId);
      const lead = leads.find((l) => l.id === initialLeadId);
      if (lead?.interestedPropertyId) setPropertyId(lead.interestedPropertyId);
      if (lead?.assignedAgentId) setAgentId(lead.assignedAgentId);
    }
  }, [initialLeadId, leads]);

  useEffect(() => {
    if (initialPropertyId) setPropertyId(initialPropertyId);
  }, [initialPropertyId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadId) {
      error('Validation', 'Please select a lead');
      return;
    }
    if (!propertyId) {
      error('Validation', 'Please select a property project');
      return;
    }
    if (!visitDate) {
      error('Validation', 'Please pick a site visit date');
      return;
    }

    const lead = leads.find((l) => l.id === leadId);
    const property = properties.find((p) => p.id === propertyId);
    const agent = agents.find((a) => a.id === agentId) || agents[0];

    addSiteVisit({
      leadId,
      leadName: lead?.name || 'Customer',
      propertyId,
      propertyName: property?.name || 'Property',
      agentId: agent.id,
      agentName: agent.name,
      visitDate,
      visitTime,
      status: 'Scheduled',
      remarks: remarks.trim() || 'Site inspection scheduled with customer',
    });

    success('Site Visit Scheduled', `Visit confirmed for ${lead?.name} at ${property?.name}`);
    onClose();
    setRemarks('');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Schedule Site Visit" description="Arrange property showing with customer and sales agent" maxWidth="md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Select Customer Lead</label>
          <select
            value={leadId}
            onChange={(e) => {
              setLeadId(e.target.value);
              const lead = leads.find((l) => l.id === e.target.value);
              if (lead?.interestedPropertyId) setPropertyId(lead.interestedPropertyId);
              if (lead?.assignedAgentId) setAgentId(lead.assignedAgentId);
            }}
            required
            className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:border-[#C59B63] focus:ring-1 focus:ring-[#C59B63] outline-none bg-white"
          >
            <option value="">-- Choose Lead --</option>
            {leads.map((l) => (
              <option key={l.id} value={l.id}>
                {l.name} ({l.mobile})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Property Project</label>
          <select
            value={propertyId}
            onChange={(e) => setPropertyId(e.target.value)}
            required
            className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:border-[#C59B63] focus:ring-1 focus:ring-[#C59B63] outline-none bg-white"
          >
            <option value="">-- Choose Property --</option>
            {properties.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} - {p.city} (Status: {p.status})
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Visit Date</label>
            <input
              type="date"
              required
              value={visitDate}
              onChange={(e) => setVisitDate(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:border-[#C59B63] focus:ring-1 focus:ring-[#C59B63] outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Time Slot</label>
            <select
              value={visitTime}
              onChange={(e) => setVisitTime(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:border-[#C59B63] focus:ring-1 focus:ring-[#C59B63] outline-none bg-white"
            >
              <option value="10:00 AM">10:00 AM</option>
              <option value="11:30 AM">11:30 AM</option>
              <option value="02:00 PM">02:00 PM</option>
              <option value="03:30 PM">03:30 PM</option>
              <option value="05:00 PM">05:00 PM</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Accompanying Agent</label>
          <select
            value={agentId}
            onChange={(e) => setAgentId(e.target.value)}
            className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:border-[#C59B63] focus:ring-1 focus:ring-[#C59B63] outline-none bg-white"
          >
            {agents.map((ag) => (
              <option key={ag.id} value={ag.id}>
                {ag.name} ({ag.role})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Notes / Instructions</label>
          <textarea
            rows={2}
            placeholder="e.g. Client bringing parents, keep sample flat key ready, arrange buggy car..."
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:border-[#C59B63] focus:ring-1 focus:ring-[#C59B63] outline-none resize-none"
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">Schedule Visit</Button>
        </div>
      </form>
    </Modal>
  );
}
