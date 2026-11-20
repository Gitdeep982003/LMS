'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { useLmsStore } from '@/store/useLmsStore';
import { useToast } from '@/components/ui/toast';
import { PropertyType, PropertyStatus } from '@/types';
import { formatINR } from '@/lib/utils';

interface AddPropertyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddPropertyModal({ isOpen, onClose }: AddPropertyModalProps) {
  const { addProperty } = useLmsStore();
  const { success, error } = useToast();

  const [formData, setFormData] = useState({
    projectName: '',
    name: '',
    type: 'Apartment' as PropertyType,
    location: '',
    city: 'Bengaluru',
    address: '',
    sqft: 1450,
    price: 12500000,
    bedrooms: 3,
    bathrooms: 3,
    description: '',
    imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80',
    status: 'Available' as PropertyStatus,
    amenities: 'Swimming Pool, Gymnasium, 24/7 Security, Clubhouse',
    reraNumber: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.projectName.trim()) {
      error('Validation', 'Project and unit name are required');
      return;
    }

    try {
      addProperty({
        projectName: formData.projectName.trim(),
        name: formData.name.trim(),
        type: formData.type,
        location: formData.location.trim() || 'Whitefield',
        city: formData.city.trim(),
        address: formData.address.trim(),
        sqft: Number(formData.sqft),
        price: Number(formData.price),
        bedrooms: Number(formData.bedrooms),
        bathrooms: Number(formData.bathrooms),
        description: formData.description.trim(),
        images: [formData.imageUrl.trim()],
        status: formData.status,
        amenities: formData.amenities.split(',').map((a) => a.trim()).filter(Boolean),
        reraNumber: formData.reraNumber.trim() || undefined,
      });

      success('Property Added', `${formData.name} was successfully listed.`);
      onClose();
    } catch (err) {
      error('Error', 'Failed to add property');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add New Real Estate Property"
      description="Add residential or commercial listing to inventory"
      maxWidth="2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Project Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              name="projectName"
              required
              placeholder="e.g. Prestige Boulevard"
              value={formData.projectName}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:border-[#C59B63] focus:ring-1 focus:ring-[#C59B63] outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Unit / Property Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              required
              placeholder="e.g. Tower B - 3BHK Premium Suite"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:border-[#C59B63] focus:ring-1 focus:ring-[#C59B63] outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Property Type</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:border-[#C59B63] focus:ring-1 focus:ring-[#C59B63] outline-none bg-white"
            >
              <option value="Apartment">Apartment</option>
              <option value="Villa">Villa</option>
              <option value="Plot">Plot</option>
              <option value="Commercial">Commercial</option>
              <option value="Penthouse">Penthouse</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">City</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:border-[#C59B63] focus:ring-1 focus:ring-[#C59B63] outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Locality / Area</label>
            <input
              type="text"
              name="location"
              placeholder="e.g. Whitefield"
              value={formData.location}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:border-[#C59B63] focus:ring-1 focus:ring-[#C59B63] outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Price (INR)</label>
            <input
              type="number"
              name="price"
              step="500000"
              value={formData.price}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:border-[#C59B63] focus:ring-1 focus:ring-[#C59B63] outline-none"
            />
            <span className="text-[11px] text-slate-500 mt-1 block">
              {formatINR(Number(formData.price))}
            </span>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Area (Sq Ft)</label>
            <input
              type="number"
              name="sqft"
              value={formData.sqft}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:border-[#C59B63] focus:ring-1 focus:ring-[#C59B63] outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Bedrooms</label>
            <input
              type="number"
              name="bedrooms"
              value={formData.bedrooms}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:border-[#C59B63] focus:ring-1 focus:ring-[#C59B63] outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Availability Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:border-[#C59B63] focus:ring-1 focus:ring-[#C59B63] outline-none bg-white font-medium"
            >
              <option value="Available">Available</option>
              <option value="Under Offer">Under Offer</option>
              <option value="Booked">Booked</option>
              <option value="Sold">Sold</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Image URL</label>
            <input
              type="url"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:border-[#C59B63] focus:ring-1 focus:ring-[#C59B63] outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">RERA Registration #</label>
            <input
              type="text"
              name="reraNumber"
              placeholder="e.g. PRM/KA/RERA/..."
              value={formData.reraNumber}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:border-[#C59B63] focus:ring-1 focus:ring-[#C59B63] outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Amenities (Comma separated)</label>
          <input
            type="text"
            name="amenities"
            value={formData.amenities}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:border-[#C59B63] focus:ring-1 focus:ring-[#C59B63] outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Description</label>
          <textarea
            name="description"
            rows={2}
            value={formData.description}
            onChange={handleChange}
            placeholder="Key highlights, specifications, furnishing status..."
            className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:border-[#C59B63] focus:ring-1 focus:ring-[#C59B63] outline-none resize-none"
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">Publish Property</Button>
        </div>
      </form>
    </Modal>
  );
}
