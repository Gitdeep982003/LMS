'use client';

import React, { useState, useRef } from 'react';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { useLmsStore } from '@/store/useLmsStore';
import { useToast } from '@/components/ui/toast';
import { PropertyType, LeadSource, LeadStatus, LeadPriority } from '@/types';
import { ProjectDropdown, DropdownOption } from '@/components/ui/ProjectDropdown';
import {
  UserPlus,
  FileSpreadsheet,
  UploadCloud,
  CheckCircle2,
  Info,
  FileText,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';

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
  const [activeTab, setActiveTab] = useState<'manual' | 'import'>('manual');
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setUploadedFile(file);
      success('File Selected', `"${file.name}" staged for import.`);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadedFile(file);
      success('File Selected', `"${file.name}" staged for import.`);
    }
  };

  const handleProcessSheet = () => {
    if (!uploadedFile) {
      error('No File Selected', 'Please drop or choose a spreadsheet file first.');
      return;
    }
    success(
      'Spreadsheet Staged',
      `"${uploadedFile.name}" received. Column mapping and schema validation will be connected once discussed with client.`
    );
    onClose();
  };

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
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add New Lead"
      description="Capture a new real estate buyer inquiry or import lead spreadsheets"
      maxWidth="2xl"
    >
      {/* Mode Switcher: Manual vs Spreadsheet Import */}
      <div className="flex items-center gap-1.5 p-1 bg-[#FAF8F5] border border-[#EAE4D9] rounded-xl mb-4 w-fit">
        <button
          type="button"
          onClick={() => setActiveTab('manual')}
          className={cn(
            'flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer',
            activeTab === 'manual'
              ? 'bg-[#0C141F] text-[#C59B63] shadow-xs'
              : 'text-stone-600 hover:text-[#0C141F]'
          )}
        >
          <UserPlus className="w-3.5 h-3.5" />
          <span>Single Lead Entry</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('import')}
          className={cn(
            'flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer',
            activeTab === 'import'
              ? 'bg-[#0C141F] text-[#C59B63] shadow-xs'
              : 'text-stone-600 hover:text-[#0C141F]'
          )}
        >
          <FileSpreadsheet className="w-3.5 h-3.5 text-[#C59B63]" />
          <span>Upload Spreadsheet (CSV / Excel)</span>
        </button>
      </div>

      {activeTab === 'manual' ? (
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
      ) : (
        <div className="space-y-4 animate-in fade-in">
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv, .xlsx, .xls"
            onChange={handleFileSelect}
            className="hidden"
          />

          {/* Drag & Drop Zone */}
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={cn(
              'border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-3',
              dragActive
                ? 'border-[#C59B63] bg-[#FAF5EC]'
                : uploadedFile
                ? 'border-emerald-500/60 bg-emerald-50/30'
                : 'border-[#E5D0A6] hover:border-[#C59B63] bg-[#FAF8F5] hover:bg-[#FAF5EC]/70'
            )}
          >
            {uploadedFile ? (
              <div className="flex flex-col items-center gap-2 animate-in fade-in">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shadow-xs">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-poppins font-bold text-sm text-[#0C141F]">{uploadedFile.name}</h4>
                  <p className="text-xs text-stone-500 mt-0.5">
                    {(uploadedFile.size / 1024).toFixed(1)} KB • Ready for client schema processing
                  </p>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setUploadedFile(null);
                  }}
                  className="mt-2 text-xs text-rose-600 hover:text-rose-800 font-semibold underline cursor-pointer"
                >
                  Remove & Choose Another File
                </button>
              </div>
            ) : (
              <>
                <div className="w-14 h-14 rounded-2xl bg-white border border-[#E5D0A6] text-[#C59B63] flex items-center justify-center shadow-xs">
                  <UploadCloud className="w-7 h-7" />
                </div>
                <div>
                  <h4 className="font-poppins font-bold text-sm text-[#0C141F]">
                    Drag & drop your CSV or Excel spreadsheet here
                  </h4>
                  <p className="text-xs text-stone-500 mt-1">
                    Supports Microsoft Excel (<span className="font-semibold text-[#8C6228]">.xlsx, .xls</span>) and Comma-Separated (<span className="font-semibold text-[#8C6228]">.csv</span>)
                  </p>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="px-2.5 py-1 rounded-md bg-white border border-[#EAE4D9] text-[10px] font-bold text-stone-700">.CSV</span>
                  <span className="px-2.5 py-1 rounded-md bg-white border border-[#EAE4D9] text-[10px] font-bold text-emerald-800">.XLSX</span>
                  <span className="px-2.5 py-1 rounded-md bg-white border border-[#EAE4D9] text-[10px] font-bold text-emerald-800">.XLS</span>
                </div>
                <button
                  type="button"
                  className="mt-2 px-5 py-2 rounded-xl bg-[#0C141F] hover:bg-[#16202E] text-[#C59B63] hover:text-[#D4AF77] border border-[#C59B63]/40 text-xs font-semibold shadow-xs transition-all cursor-pointer"
                >
                  Browse Files
                </button>
              </>
            )}
          </div>

          {/* Client Schema Notice Card */}
          <div className="p-3.5 bg-[#FAF5EC]/80 border border-[#E5D0A6] rounded-xl text-xs flex items-start gap-2.5">
            <Info className="w-4 h-4 text-[#C59B63] shrink-0 mt-0.5" />
            <div className="text-stone-700 leading-relaxed text-[11.5px]">
              <strong className="text-[#0C141F]">Spreadsheet Template & Data Schema:</strong>
              <p className="mt-0.5">
                The drag-and-drop design matches the Kalaivani luxury theme. The final data format, column validation, and functional mapping rules will be connected once discussed and confirmed with the client.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="button"
              disabled={!uploadedFile}
              onClick={handleProcessSheet}
              className="bg-[#0C141F] hover:bg-[#16202E] text-[#C59B63] hover:text-[#D4AF77] border border-[#C59B63]/40"
            >
              Upload & Process Sheet
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
}
