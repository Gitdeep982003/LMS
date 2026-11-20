'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { useLmsStore } from '@/store/useLmsStore';
import { useToast } from '@/components/ui/toast';
import { PropertyType, LeadSource, LeadStatus, LeadPriority } from '@/types';

interface AddLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddLeadModal({ isOpen, onClose }: AddLeadModalProps) {
  const { addLead, properties, agents } = useLmsStore();
  const { success, error } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    email: '',
    interestedPropertyId: '',
    preferredLocation: '',
    budget: '5000000',
    propertyType: 'Apartment' as PropertyType,
    leadSource: 'Website' as LeadSource,
    status: 'New' as LeadStatus,
    priority: 'Medium' as LeadPriority,
    assignedAgentId: '',
    followUpDate: '',
    remarks: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      error('Validation Error', 'Customer name is required');
      return;
    }
    if (!formData.mobile.trim()) {
      error('Validation Error', 'Mobile number is required');
      return;
    }

    setIsSubmitting(true);

    try {
      const selectedProp = properties.find((p) => p.id === formData.interestedPropertyId);
      const selectedAgent = agents.find((a) => a.id === formData.assignedAgentId);

      addLead({
        name: formData.name.trim(),
        mobile: formData.mobile.trim(),
        email: formData.email.trim() || `${formData.name.toLowerCase().replace(/\s+/g, '')}@gmail.com`,
        interestedPropertyId: selectedProp?.id,
        interestedPropertyName: selectedProp?.name,
        preferredLocation: formData.preferredLocation.trim() || selectedProp?.location || 'Bengaluru',
        budget: Number(formData.budget) || 5000000,
        propertyType: formData.propertyType,
        leadSource: formData.leadSource,
        status: formData.status,
        priority: formData.priority,
        assignedAgentId: selectedAgent?.id,
        assignedAgentName: selectedAgent?.name,
        followUpDate: formData.followUpDate || undefined,
        remarks: formData.remarks.trim(),
      });

      success('Lead Created', `Lead for ${formData.name} was added successfully.`);
      onClose();
      // Reset form
      setFormData({
        name: '',
        mobile: '',
        email: '',
        interestedPropertyId: '',
        preferredLocation: '',
        budget: '5000000',
        propertyType: 'Apartment',
        leadSource: 'Website',
        status: 'New',
        priority: 'Medium',
        assignedAgentId: '',
        followUpDate: '',
        remarks: '',
      });
    } catch (err) {
      error('Error', 'Failed to create lead');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Lead" description="Capture a new real estate buyer or investor inquiry" maxWidth="2xl">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Row 1: Name & Mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Customer Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              required
              placeholder="e.g. Rahul Deshmukh"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:border-[#C59B63] focus:ring-1 focus:ring-[#C59B63] focus:ring-2 focus:ring-blue-500/20 outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Mobile Number <span className="text-rose-500">*</span>
            </label>
            <input
              type="tel"
              name="mobile"
              required
              placeholder="e.g. +91 98765 43210"
              value={formData.mobile}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:border-[#C59B63] focus:ring-1 focus:ring-[#C59B63] focus:ring-2 focus:ring-blue-500/20 outline-none"
            />
          </div>
        </div>

        {/* Row 2: Email & Preferred Location */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="e.g. rahul@example.com"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:border-[#C59B63] focus:ring-1 focus:ring-[#C59B63] focus:ring-2 focus:ring-blue-500/20 outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Preferred Location</label>
            <input
              type="text"
              name="preferredLocation"
              placeholder="e.g. Whitefield, Bengaluru"
              value={formData.preferredLocation}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:border-[#C59B63] focus:ring-1 focus:ring-[#C59B63] focus:ring-2 focus:ring-blue-500/20 outline-none"
            />
          </div>
        </div>

        {/* Row 3: Interested Property & Property Type */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Interested Property</label>
            <select
              name="interestedPropertyId"
              value={formData.interestedPropertyId}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:border-[#C59B63] focus:ring-1 focus:ring-[#C59B63] focus:ring-2 focus:ring-blue-500/20 outline-none bg-white"
            >
              <option value="">-- Select Property (Optional) --</option>
              {properties.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.city} - ₹{(p.price / 100000).toFixed(0)}L)
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
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:border-[#C59B63] focus:ring-1 focus:ring-[#C59B63] focus:ring-2 focus:ring-blue-500/20 outline-none bg-white"
            >
              <option value="Apartment">Apartment</option>
              <option value="Villa">Villa</option>
              <option value="Plot">Plot</option>
              <option value="Commercial">Commercial</option>
              <option value="Penthouse">Penthouse</option>
            </select>
          </div>
        </div>

        {/* Row 4: Budget (INR) & Lead Source */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Budget (in INR)</label>
            <input
              type="number"
              name="budget"
              step="500000"
              placeholder="e.g. 8500000"
              value={formData.budget}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:border-[#C59B63] focus:ring-1 focus:ring-[#C59B63] focus:ring-2 focus:ring-blue-500/20 outline-none"
            />
            <span className="text-[11px] text-slate-500 mt-1 block">
              Formatted: ₹{(Number(formData.budget) / 100000 || 0).toFixed(1)} Lakhs
            </span>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Lead Source</label>
            <select
              name="leadSource"
              value={formData.leadSource}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:border-[#C59B63] focus:ring-1 focus:ring-[#C59B63] focus:ring-2 focus:ring-blue-500/20 outline-none bg-white"
            >
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
        </div>

        {/* Row 5: Initial Status & Assigned Agent */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:border-[#C59B63] focus:ring-1 focus:ring-[#C59B63] focus:ring-2 focus:ring-blue-500/20 outline-none bg-white"
            >
              <option value="New">New</option>
              <option value="Assigned">Assigned</option>
              <option value="Contacted">Contacted</option>
              <option value="Interested">Interested</option>
              <option value="Follow-up">Follow-up</option>
              <option value="Site Visit Scheduled">Site Visit Scheduled</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Priority</label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:border-[#C59B63] focus:ring-1 focus:ring-[#C59B63] focus:ring-2 focus:ring-blue-500/20 outline-none bg-white"
            >
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Assign Sales Executive</label>
            <select
              name="assignedAgentId"
              value={formData.assignedAgentId}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:border-[#C59B63] focus:ring-1 focus:ring-[#C59B63] focus:ring-2 focus:ring-blue-500/20 outline-none bg-white"
            >
              <option value="">-- Unassigned --</option>
              {agents.map((ag) => (
                <option key={ag.id} value={ag.id}>
                  {ag.name} ({ag.role})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Row 6: Follow-up Date */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Next Follow-up Date</label>
          <input
            type="date"
            name="followUpDate"
            value={formData.followUpDate}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:border-[#C59B63] focus:ring-1 focus:ring-[#C59B63] focus:ring-2 focus:ring-blue-500/20 outline-none"
          />
        </div>

        {/* Row 7: Remarks */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Client Remarks & Requirements</label>
          <textarea
            name="remarks"
            rows={2}
            placeholder="Add initial notes, customer preferences, or key requirements..."
            value={formData.remarks}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:border-[#C59B63] focus:ring-1 focus:ring-[#C59B63] focus:ring-2 focus:ring-blue-500/20 outline-none resize-none"
          />
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isSubmitting}>
            Save Lead
          </Button>
        </div>
      </form>
    </Modal>
  );
}
