'use client';

import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { useLmsStore } from '@/store/useLmsStore';
import { useToast } from '@/components/ui/toast';
import { Lead, PropertyType, LeadSource, LeadStatus, LeadPriority } from '@/types';

interface EditLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  lead: Lead | null;
}

export function EditLeadModal({ isOpen, onClose, lead }: EditLeadModalProps) {
  const { updateLead, properties, agents } = useLmsStore();
  const { success, error } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    email: '',
    interestedPropertyId: '',
    preferredLocation: '',
    budget: 5000000,
    propertyType: 'Apartment' as PropertyType,
    leadSource: 'Website' as LeadSource,
    status: 'New' as LeadStatus,
    priority: 'Medium' as LeadPriority,
    assignedAgentId: '',
    followUpDate: '',
    remarks: '',
  });

  useEffect(() => {
    if (lead) {
      setFormData({
        name: lead.name,
        mobile: lead.mobile,
        email: lead.email,
        interestedPropertyId: lead.interestedPropertyId || '',
        preferredLocation: lead.preferredLocation || '',
        budget: lead.budget,
        propertyType: lead.propertyType,
        leadSource: lead.leadSource,
        status: lead.status,
        priority: lead.priority,
        assignedAgentId: lead.assignedAgentId || '',
        followUpDate: lead.followUpDate || '',
        remarks: lead.remarks || '',
      });
    }
  }, [lead]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lead) return;

    if (!formData.name.trim()) {
      error('Validation Error', 'Customer name is required');
      return;
    }

    try {
      const selectedProp = properties.find((p) => p.id === formData.interestedPropertyId);
      const selectedAgent = agents.find((a) => a.id === formData.assignedAgentId);

      updateLead(lead.id, {
        name: formData.name.trim(),
        mobile: formData.mobile.trim(),
        email: formData.email.trim(),
        interestedPropertyId: selectedProp?.id,
        interestedPropertyName: selectedProp?.name || lead.interestedPropertyName,
        preferredLocation: formData.preferredLocation.trim(),
        budget: Number(formData.budget),
        propertyType: formData.propertyType,
        leadSource: formData.leadSource,
        status: formData.status,
        priority: formData.priority,
        assignedAgentId: selectedAgent?.id,
        assignedAgentName: selectedAgent?.name,
        followUpDate: formData.followUpDate || undefined,
        remarks: formData.remarks.trim(),
      });

      success('Lead Updated', `Details for ${formData.name} updated successfully.`);
      onClose();
    } catch (err) {
      error('Error', 'Failed to update lead');
    }
  };

  if (!lead) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Edit Lead: ${lead.id}`}
      description="Update customer information, pipeline status, or assignment"
      maxWidth="2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Customer Name</label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:border-blue-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Mobile Number</label>
            <input
              type="tel"
              name="mobile"
              required
              value={formData.mobile}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:border-blue-500 outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:border-blue-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Preferred Location</label>
            <input
              type="text"
              name="preferredLocation"
              value={formData.preferredLocation}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:border-blue-500 outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Interested Property</label>
            <select
              name="interestedPropertyId"
              value={formData.interestedPropertyId}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:border-blue-500 outline-none bg-white"
            >
              <option value="">-- None / General Inquiry --</option>
              {properties.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.city})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Property Type</label>
            <select
              name="propertyType"
              value={formData.propertyType}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:border-blue-500 outline-none bg-white"
            >
              <option value="Apartment">Apartment</option>
              <option value="Villa">Villa</option>
              <option value="Plot">Plot</option>
              <option value="Commercial">Commercial</option>
              <option value="Penthouse">Penthouse</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Budget (INR)</label>
            <input
              type="number"
              name="budget"
              step="100000"
              value={formData.budget}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:border-blue-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Lead Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:border-blue-500 outline-none bg-white font-medium"
            >
              <option value="New">New</option>
              <option value="Assigned">Assigned</option>
              <option value="Contacted">Contacted</option>
              <option value="Interested">Interested</option>
              <option value="Follow-up">Follow-up</option>
              <option value="Site Visit Scheduled">Site Visit Scheduled</option>
              <option value="Site Visited">Site Visited</option>
              <option value="Negotiation">Negotiation</option>
              <option value="Booked">Booked</option>
              <option value="Converted">Converted</option>
              <option value="Lost">Lost</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Priority</label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:border-blue-500 outline-none bg-white"
            >
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Assigned Agent</label>
            <select
              name="assignedAgentId"
              value={formData.assignedAgentId}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:border-blue-500 outline-none bg-white"
            >
              <option value="">-- Unassigned --</option>
              {agents.map((ag) => (
                <option key={ag.id} value={ag.id}>
                  {ag.name} ({ag.role})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Follow-up Date</label>
            <input
              type="date"
              name="followUpDate"
              value={formData.followUpDate}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:border-blue-500 outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Remarks</label>
          <textarea
            name="remarks"
            rows={2}
            value={formData.remarks}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:border-blue-500 outline-none resize-none"
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">Update Lead</Button>
        </div>
      </form>
    </Modal>
  );
}
