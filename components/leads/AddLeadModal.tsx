'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { useLmsStore } from '@/store/useLmsStore';
import { useToast } from '@/components/ui/toast';
import { PropertyType, LeadSource, LeadStatus, LeadPriority } from '@/types';
import { ProjectDropdown, DropdownOption } from '@/components/ui/ProjectDropdown';

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

  const propertyOptions: DropdownOption[] = [
    { value: '', label: '-- Select Property (Optional) --', dotColor: 'bg-stone-300' },
    ...properties.map((p) => ({
      value: p.id,
      label: `${p.name} (${p.city} - ₹${(p.price / 100000).toFixed(0)}L)`,
      dotColor: 'bg-[#C59B63]',
    })),
  ];

  const propertyTypeOptions: DropdownOption[] = [
    { value: 'Apartment', label: 'Apartment', dotColor: 'bg-[#C59B63]' },
    { value: 'Villa', label: 'Villa', dotColor: 'bg-[#8C6228]' },
    { value: 'Plot', label: 'Plot', dotColor: 'bg-emerald-600' },
    { value: 'Commercial', label: 'Commercial', dotColor: 'bg-amber-600' },
    { value: 'Penthouse', label: 'Penthouse', dotColor: 'bg-purple-600' },
  ];

  const leadSourceOptions: DropdownOption[] = [
    { value: 'Website', label: 'Website', dotColor: 'bg-[#C59B63]' },
    { value: 'MagicBricks', label: 'MagicBricks', dotColor: 'bg-rose-500' },
    { value: '99acres', label: '99acres', dotColor: 'bg-amber-600' },
    { value: 'Housing.com', label: 'Housing.com', dotColor: 'bg-red-500' },
    { value: 'Referral', label: 'Referral', dotColor: 'bg-emerald-600' },
    { value: 'Google Ads', label: 'Google Ads', dotColor: 'bg-sky-500' },
    { value: 'Walk-in', label: 'Walk-in', dotColor: 'bg-[#0C141F]' },
    { value: 'Facebook Ads', label: 'Facebook Ads', dotColor: 'bg-indigo-600' },
  ];

  const statusOptions: DropdownOption[] = [
    { value: 'New', label: 'New', dotColor: 'bg-[#C59B63]' },
    { value: 'Contacted', label: 'Contacted', dotColor: 'bg-sky-500' },
    { value: 'Qualified', label: 'Qualified', dotColor: 'bg-indigo-500' },
    { value: 'Site Visit', label: 'Site Visit', dotColor: 'bg-purple-500' },
    { value: 'Negotiation', label: 'Negotiation', dotColor: 'bg-amber-500' },
    { value: 'Won', label: 'Won', dotColor: 'bg-emerald-500' },
    { value: 'Lost', label: 'Lost', dotColor: 'bg-rose-500' },
  ];

  const priorityOptions: DropdownOption[] = [
    { value: 'High', label: 'High Priority', dotColor: 'bg-rose-500' },
    { value: 'Medium', label: 'Medium Priority', dotColor: 'bg-amber-500' },
    { value: 'Low', label: 'Normal / Low Priority', dotColor: 'bg-stone-500' },
  ];

  const agentOptions: DropdownOption[] = [
    { value: '', label: '-- Unassigned --', dotColor: 'bg-stone-300' },
    ...agents.map((ag) => ({
      value: ag.id,
      label: `${ag.name} (${ag.role})`,
      dotColor: 'bg-[#C59B63]',
    })),
  ];

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
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:border-[#C59B63] focus:ring-1 focus:ring-[#C59B63] outline-none"
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
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:border-[#C59B63] focus:ring-1 focus:ring-[#C59B63] outline-none"
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
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:border-[#C59B63] focus:ring-1 focus:ring-[#C59B63] outline-none"
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
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:border-[#C59B63] focus:ring-1 focus:ring-[#C59B63] outline-none"
            />
          </div>
        </div>

        {/* Row 3: Interested Property & Property Type */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Interested Property</label>
            <ProjectDropdown
              value={formData.interestedPropertyId}
              onChange={(val) => setFormData((prev) => ({ ...prev, interestedPropertyId: val }))}
              options={propertyOptions}
              placeholder="Select Property (Optional)"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Property Type</label>
            <ProjectDropdown
              value={formData.propertyType}
              onChange={(val) => setFormData((prev) => ({ ...prev, propertyType: val as PropertyType }))}
              options={propertyTypeOptions}
            />
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
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:border-[#C59B63] focus:ring-1 focus:ring-[#C59B63] outline-none"
            />
            <span className="text-[11px] text-slate-500 mt-1 block">
              Formatted: ₹{(Number(formData.budget) / 100000 || 0).toFixed(1)} Lakhs
            </span>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Lead Source</label>
            <ProjectDropdown
              value={formData.leadSource}
              onChange={(val) => setFormData((prev) => ({ ...prev, leadSource: val as LeadSource }))}
              options={leadSourceOptions}
            />
          </div>
        </div>

        {/* Row 5: Initial Status & Assigned Agent */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Status (Stage)</label>
            <ProjectDropdown
              value={formData.status}
              onChange={(val) => setFormData((prev) => ({ ...prev, status: val as LeadStatus }))}
              options={statusOptions}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Priority</label>
            <ProjectDropdown
              value={formData.priority}
              onChange={(val) => setFormData((prev) => ({ ...prev, priority: val as LeadPriority }))}
              options={priorityOptions}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Assign Sales Executive</label>
            <ProjectDropdown
              value={formData.assignedAgentId}
              onChange={(val) => setFormData((prev) => ({ ...prev, assignedAgentId: val }))}
              options={agentOptions}
              placeholder="Unassigned"
            />
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
            className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:border-[#C59B63] focus:ring-1 focus:ring-[#C59B63] outline-none"
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
            className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:border-[#C59B63] focus:ring-1 focus:ring-[#C59B63] outline-none resize-none"
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
