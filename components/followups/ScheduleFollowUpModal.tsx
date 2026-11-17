'use client';

import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { useLmsStore } from '@/store/useLmsStore';
import { useToast } from '@/components/ui/toast';
import { FollowUpType } from '@/types';

interface ScheduleFollowUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialLeadId?: string;
}

export function ScheduleFollowUpModal({ isOpen, onClose, initialLeadId }: ScheduleFollowUpModalProps) {
  const { leads, agents, addFollowUp } = useLmsStore();
  const { success, error } = useToast();

  const [leadId, setLeadId] = useState(initialLeadId || '');
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('11:00 AM');
  const [type, setType] = useState<FollowUpType>('Call');
  const [agentId, setAgentId] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (initialLeadId) {
      setLeadId(initialLeadId);
      const lead = leads.find((l) => l.id === initialLeadId);
      if (lead?.assignedAgentId) setAgentId(lead.assignedAgentId);
    }
  }, [initialLeadId, leads]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadId) {
      error('Validation', 'Please select a lead');
      return;
    }
    if (!scheduledDate) {
      error('Validation', 'Please select a follow-up date');
      return;
    }

    const lead = leads.find((l) => l.id === leadId);
    const agent = agents.find((a) => a.id === agentId) || agents[0];

    addFollowUp({
      leadId,
      leadName: lead?.name || 'Customer',
      propertyName: lead?.interestedPropertyName,
      agentId: agent.id,
      agentName: agent.name,
      scheduledDate,
      scheduledTime,
      type,
      status: 'Pending',
      notes: notes.trim() || `Follow-up ${type} with customer`,
    });

    success('Follow-up Scheduled', `Follow-up arranged with ${lead?.name} for ${scheduledDate}`);
    onClose();
    setNotes('');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Schedule Follow-up" description="Plan next interaction with buyer or investor" maxWidth="md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Select Lead</label>
          <select
            value={leadId}
            onChange={(e) => {
              setLeadId(e.target.value);
              const lead = leads.find((l) => l.id === e.target.value);
              if (lead?.assignedAgentId) setAgentId(lead.assignedAgentId);
            }}
            required
            className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:border-blue-500 outline-none bg-white"
          >
            <option value="">-- Choose Lead --</option>
            {leads.map((l) => (
              <option key={l.id} value={l.id}>
                {l.name} ({l.id} - {l.preferredLocation})
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Follow-up Date</label>
            <input
              type="date"
              required
              value={scheduledDate}
              onChange={(e) => setScheduledDate(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:border-blue-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Time</label>
            <select
              value={scheduledTime}
              onChange={(e) => setScheduledTime(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:border-blue-500 outline-none bg-white"
            >
              <option value="10:00 AM">10:00 AM</option>
              <option value="11:30 AM">11:30 AM</option>
              <option value="02:00 PM">02:00 PM</option>
              <option value="03:30 PM">03:30 PM</option>
              <option value="05:00 PM">05:00 PM</option>
              <option value="06:30 PM">06:30 PM</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Activity Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as FollowUpType)}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:border-blue-500 outline-none bg-white"
            >
              <option value="Call">Phone Call</option>
              <option value="WhatsApp">WhatsApp Chat</option>
              <option value="Meeting">Office Meeting</option>
              <option value="Site Visit">Site Visit</option>
              <option value="Email">Email Follow-up</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Assigned Executive</label>
            <select
              value={agentId}
              onChange={(e) => setAgentId(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:border-blue-500 outline-none bg-white"
            >
              {agents.map((ag) => (
                <option key={ag.id} value={ag.id}>
                  {ag.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Discussion Agenda / Notes</label>
          <textarea
            rows={2}
            placeholder="e.g. Discuss floor plans, price negotiation, bank loan documentation..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:border-blue-500 outline-none resize-none"
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">Schedule</Button>
        </div>
      </form>
    </Modal>
  );
}
