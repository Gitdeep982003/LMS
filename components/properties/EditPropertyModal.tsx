'use client';

import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { useLmsStore } from '@/store/useLmsStore';
import { useToast } from '@/components/ui/toast';
import { Property, PropertyType, PropertyStatus } from '@/types';

interface EditPropertyModalProps {
  isOpen: boolean;
  onClose: () => void;
  property: Property | null;
}

export function EditPropertyModal({ isOpen, onClose, property }: EditPropertyModalProps) {
  const { updateProperty } = useLmsStore();
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
    imageUrl: '',
    status: 'Available' as PropertyStatus,
    amenities: '',
    reraNumber: '',
  });

  useEffect(() => {
    if (property) {
      setFormData({
        projectName: property.projectName,
        name: property.name,
        type: property.type,
        location: property.location,
        city: property.city,
        address: property.address,
        sqft: property.sqft,
        price: property.price,
        bedrooms: property.bedrooms,
        bathrooms: property.bathrooms,
        description: property.description,
        imageUrl: property.images?.[0] || '',
        status: property.status,
        amenities: property.amenities ? property.amenities.join(', ') : '',
        reraNumber: property.reraNumber || '',
      });
    }
  }, [property]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!property) return;

    try {
      updateProperty(property.id, {
        projectName: formData.projectName.trim(),
        name: formData.name.trim(),
        type: formData.type,
        location: formData.location.trim(),
        city: formData.city.trim(),
        address: formData.address.trim(),
        sqft: Number(formData.sqft),
        price: Number(formData.price),
        bedrooms: Number(formData.bedrooms),
        bathrooms: Number(formData.bathrooms),
        description: formData.description.trim(),
        images: formData.imageUrl ? [formData.imageUrl.trim()] : property.images,
        status: formData.status,
        amenities: formData.amenities.split(',').map((a) => a.trim()).filter(Boolean),
        reraNumber: formData.reraNumber.trim() || undefined,
      });

      success('Property Updated', `${formData.name} updated successfully.`);
      onClose();
    } catch (err) {
      error('Error', 'Failed to update property');
    }
  };

  if (!property) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Edit Property: ${property.id}`}
      description="Update specifications, price, or availability status"
      maxWidth="2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Project Name</label>
            <input
              type="text"
              name="projectName"
              required
              value={formData.projectName}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:border-blue-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Property Name</label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:border-blue-500 outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Type</label>
            <select
              name="type"
              value={formData.type}
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
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">City</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:border-blue-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:border-blue-500 outline-none"
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
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:border-blue-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Sq Ft</label>
            <input
              type="number"
              name="sqft"
              value={formData.sqft}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:border-blue-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Bedrooms</label>
            <input
              type="number"
              name="bedrooms"
              value={formData.bedrooms}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:border-blue-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:border-blue-500 outline-none bg-white font-medium"
            >
              <option value="Available">Available</option>
              <option value="Under Offer">Under Offer</option>
              <option value="Booked">Booked</option>
              <option value="Sold">Sold</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Image URL</label>
          <input
            type="url"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:border-blue-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Amenities</label>
          <input
            type="text"
            name="amenities"
            value={formData.amenities}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:border-blue-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Description</label>
          <textarea
            name="description"
            rows={2}
            value={formData.description}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:border-blue-500 outline-none resize-none"
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">Save Changes</Button>
        </div>
      </form>
    </Modal>
  );
}
