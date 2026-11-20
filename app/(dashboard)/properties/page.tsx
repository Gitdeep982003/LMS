'use client';

import React, { useState, useMemo } from 'react';
import {
  Building2,
  Plus,
  Search,
  Filter,
  LayoutGrid,
  List,
  MapPin,
  BedDouble,
  Maximize2,
  Edit,
  Trash2,
  Eye,
  CheckCircle2,
  Calendar,
  IndianRupee,
} from 'lucide-react';
import { useLmsStore } from '@/store/useLmsStore';
import { useToast } from '@/components/ui/toast';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PropertyStatusBadge } from '@/components/ui/badge';
import { formatINR } from '@/lib/utils';
import { AddPropertyModal } from '@/components/properties/AddPropertyModal';
import { EditPropertyModal } from '@/components/properties/EditPropertyModal';
import { ScheduleSiteVisitModal } from '@/components/sitevisits/ScheduleSiteVisitModal';
import { CreateBookingModal } from '@/components/bookings/CreateBookingModal';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { Property, PropertyType, PropertyStatus } from '@/types';

export default function PropertiesPage() {
  const { properties, leads, deleteProperty, updateProperty } = useLmsStore();
  const { success, error } = useToast();

  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [cityFilter, setCityFilter] = useState<string>('ALL');

  // Modals
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [viewingProperty, setViewingProperty] = useState<Property | null>(null);
  const [deletingProperty, setDeletingProperty] = useState<Property | null>(null);
  const [siteVisitPropertyId, setSiteVisitPropertyId] = useState<string | null>(null);
  const [bookingPropertyId, setBookingPropertyId] = useState<string | null>(null);

  // Filtered properties
  const filteredProperties = useMemo(() => {
    return properties.filter((p) => {
      const matchesSearch =
        !search ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.projectName.toLowerCase().includes(search.toLowerCase()) ||
        p.location.toLowerCase().includes(search.toLowerCase()) ||
        p.city.toLowerCase().includes(search.toLowerCase());

      const matchesType = typeFilter === 'ALL' || p.type === typeFilter;
      const matchesStatus = statusFilter === 'ALL' || p.status === statusFilter;
      const matchesCity = cityFilter === 'ALL' || p.city === cityFilter;

      return matchesSearch && matchesType && matchesStatus && matchesCity;
    });
  }, [properties, search, typeFilter, statusFilter, cityFilter]);

  const cities = Array.from(new Set(properties.map((p) => p.city)));

  const handleDeleteConfirm = () => {
    if (deletingProperty) {
      deleteProperty(deletingProperty.id);
      success('Property Deleted', `${deletingProperty.name} was removed from listings.`);
      setDeletingProperty(null);
    }
  };

  const handleStatusChange = (propertyId: string, newStatus: PropertyStatus) => {
    updateProperty(propertyId, { status: newStatus });
    success('Status Updated', `Property status updated to ${newStatus}`);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Page Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-poppins text-2xl sm:text-3xl font-bold text-[#0C141F] tracking-tight flex items-center gap-2.5">
            <Building2 className="w-6 h-6 text-[#C59B63]" />
            <span>Property Inventory</span>
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
            Manage residential villas, luxury apartments, commercial floors, and plotted developments.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* View Mode Toggle */}
          <div className="flex items-center p-1 bg-[#F2EDE4] rounded-xl border border-[#EAE4D9]">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'grid' ? 'bg-white shadow-xs text-[#C59B63]' : 'text-stone-500 hover:text-stone-800'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'table' ? 'bg-white shadow-xs text-[#C59B63]' : 'text-stone-500 hover:text-stone-800'
              }`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          <Button size="sm" onClick={() => setIsAddOpen(true)} className="gap-1.5 text-xs shadow-sm">
            <Plus className="w-4 h-4" />
            <span>Add Property</span>
          </Button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {/* Search */}
            <div className="lg:col-span-2 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by project name, locality, city..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200 focus:border-[#C59B63] focus:ring-1 focus:ring-[#C59B63] outline-none"
              />
            </div>

            {/* Property Type */}
            <div>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full px-2.5 py-2 text-xs rounded-lg border border-slate-200 focus:border-[#C59B63] focus:ring-1 focus:ring-[#C59B63] outline-none bg-white font-medium"
              >
                <option value="ALL">All Types</option>
                <option value="Apartment">Apartment</option>
                <option value="Villa">Villa</option>
                <option value="Plot">Plot</option>
                <option value="Commercial">Commercial</option>
                <option value="Penthouse">Penthouse</option>
              </select>
            </div>

            {/* City */}
            <div>
              <select
                value={cityFilter}
                onChange={(e) => setCityFilter(e.target.value)}
                className="w-full px-2.5 py-2 text-xs rounded-lg border border-slate-200 focus:border-[#C59B63] focus:ring-1 focus:ring-[#C59B63] outline-none bg-white font-medium"
              >
                <option value="ALL">All Cities</option>
                {cities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>

            {/* Availability Status */}
            <div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-2.5 py-2 text-xs rounded-lg border border-slate-200 focus:border-[#C59B63] focus:ring-1 focus:ring-[#C59B63] outline-none bg-white font-medium"
              >
                <option value="ALL">All Statuses</option>
                <option value="Available">Available</option>
                <option value="Under Offer">Under Offer</option>
                <option value="Booked">Booked</option>
                <option value="Sold">Sold</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Grid View */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredProperties.length === 0 ? (
            <div className="col-span-full py-16 text-center text-slate-400 text-xs">
              No properties found matching criteria.
            </div>
          ) : (
            filteredProperties.map((property) => (
              <Card
                key={property.id}
                className="overflow-hidden hover:shadow-card-hover transition-all flex flex-col group border-slate-200/90"
              >
                {/* Image Container with Badges */}
                <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
                  <img
                    src={property.images[0] || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80'}
                    alt={property.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2.5 left-2.5">
                    <PropertyStatusBadge status={property.status} />
                  </div>
                  <div className="absolute top-2.5 right-2.5 bg-black/60 backdrop-blur-xs text-white text-[11px] font-semibold px-2 py-0.5 rounded-md">
                    {property.type}
                  </div>
                  <div className="absolute bottom-2.5 left-2.5 bg-slate-900/80 backdrop-blur-xs text-white font-bold text-sm px-2.5 py-1 rounded-lg">
                    {formatINR(property.price)}
                  </div>
                </div>

                {/* Details */}
                <CardContent className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <span className="text-[11px] font-semibold text-[#8C6228] block truncate">
                      {property.projectName}
                    </span>
                    <h3 className="font-bold text-slate-900 text-sm leading-snug truncate mt-0.5">
                      {property.name}
                    </h3>
                    <p className="text-slate-500 text-xs flex items-center gap-1 mt-1 truncate">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>
                        {property.location}, {property.city}
                      </span>
                    </p>
                  </div>

                  {/* Specs */}
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-[11px] text-slate-600">
                    <span className="flex items-center gap-1">
                      <Maximize2 className="w-3.5 h-3.5 text-slate-400" />
                      <strong>{property.sqft}</strong> sq.ft
                    </span>
                    {property.bedrooms > 0 ? (
                      <span className="flex items-center gap-1">
                        <BedDouble className="w-3.5 h-3.5 text-slate-400" />
                        <strong>{property.bedrooms}</strong> BHK
                      </span>
                    ) : (
                      <span className="text-slate-400">Commercial / Plot</span>
                    )}
                  </div>

                  {/* Quick Action Buttons */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-1">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setViewingProperty(property)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-[#C59B63] hover:bg-[#FAF5EC] transition-colors"
                        title="View Full Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setEditingProperty(property)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                        title="Edit Property"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeletingProperty(property)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Delete Property"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setSiteVisitPropertyId(property.id)}
                        className="text-[11px] px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium"
                      >
                        Visit
                      </button>
                      {property.status === 'Available' && (
                        <button
                          onClick={() => setBookingPropertyId(property.id)}
                          className="text-[11px] px-2 py-1 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
                        >
                          Book
                        </button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}

      {/* Table View */}
      {viewMode === 'table' && (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                    <th className="py-3 px-4">Property & Project</th>
                    <th className="py-3 px-3">Location & City</th>
                    <th className="py-3 px-3">Type</th>
                    <th className="py-3 px-3">Specs</th>
                    <th className="py-3 px-3">Price</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredProperties.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4">
                        <p className="font-bold text-slate-800">{p.name}</p>
                        <p className="text-[11px] text-[#8C6228] font-medium">{p.projectName}</p>
                      </td>
                      <td className="py-3 px-3">
                        <span className="font-medium text-slate-700">{p.location}</span>
                        <span className="text-[11px] text-slate-400 block">{p.city}</span>
                      </td>
                      <td className="py-3 px-3 font-medium text-slate-700">{p.type}</td>
                      <td className="py-3 px-3 text-slate-600">
                        {p.sqft} sq.ft {p.bedrooms > 0 ? `• ${p.bedrooms} BHK` : ''}
                      </td>
                      <td className="py-3 px-3 font-bold text-slate-900">{formatINR(p.price)}</td>
                      <td className="py-3 px-3">
                        <select
                          value={p.status}
                          onChange={(e) => handleStatusChange(p.id, e.target.value as PropertyStatus)}
                          className="px-2 py-0.5 rounded text-xs border border-slate-200 bg-white font-medium"
                        >
                          <option value="Available">Available</option>
                          <option value="Under Offer">Under Offer</option>
                          <option value="Booked">Booked</option>
                          <option value="Sold">Sold</option>
                        </select>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setViewingProperty(p)}
                            className="p-1 rounded text-slate-400 hover:text-[#C59B63]"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setEditingProperty(p)}
                            className="p-1 rounded text-slate-400 hover:text-slate-700"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setDeletingProperty(p)}
                            className="p-1 rounded text-slate-400 hover:text-rose-600"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Property Details Modal */}
      {viewingProperty && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col">
            <div className="relative h-56 bg-slate-900">
              <img
                src={viewingProperty.images[0]}
                alt={viewingProperty.name}
                className="w-full h-full object-cover opacity-90"
              />
              <button
                onClick={() => setViewingProperty(null)}
                className="absolute top-3 right-3 p-1.5 rounded-full bg-black/60 text-white hover:bg-black/80"
              >
                ✕
              </button>
              <div className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur-xs px-3 py-1 rounded-lg text-white font-bold text-lg">
                {formatINR(viewingProperty.price)}
              </div>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[#8C6228] font-semibold">{viewingProperty.projectName}</span>
                  <h2 className="text-lg font-bold text-slate-900">{viewingProperty.name}</h2>
                  <p className="text-slate-500 mt-0.5">{viewingProperty.address || `${viewingProperty.location}, ${viewingProperty.city}`}</p>
                </div>
                <PropertyStatusBadge status={viewingProperty.status} />
              </div>

              {/* Specs */}
              <div className="grid grid-cols-3 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200/60 text-center">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase">Property Type</span>
                  <span className="font-bold text-slate-800 text-sm">{viewingProperty.type}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase">Super Area</span>
                  <span className="font-bold text-slate-800 text-sm">{viewingProperty.sqft} sq.ft</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase">Configuration</span>
                  <span className="font-bold text-slate-800 text-sm">
                    {viewingProperty.bedrooms > 0 ? `${viewingProperty.bedrooms} BHK` : 'Commercial'}
                  </span>
                </div>
              </div>

              {/* Description */}
              {viewingProperty.description && (
                <div>
                  <h4 className="font-semibold text-slate-800 mb-1">Project Description</h4>
                  <p className="text-slate-600 leading-relaxed">{viewingProperty.description}</p>
                </div>
              )}

              {/* Amenities */}
              {viewingProperty.amenities && viewingProperty.amenities.length > 0 && (
                <div>
                  <h4 className="font-semibold text-slate-800 mb-1.5">Amenities & Highlights</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {viewingProperty.amenities.map((a, i) => (
                      <span key={i} className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium">
                        ✓ {a}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* RERA */}
              {viewingProperty.reraNumber && (
                <div className="p-2.5 rounded-lg bg-[#FAF5EC]/70 border border-[#EAE4D9]/80 text-blue-900 text-[11px]">
                  <strong>RERA Approved:</strong> {viewingProperty.reraNumber}
                </div>
              )}

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <Button variant="outline" size="sm" onClick={() => setViewingProperty(null)}>
                  Close
                </Button>
                {viewingProperty.status === 'Available' && (
                  <Button
                    size="sm"
                    variant="emerald"
                    onClick={() => {
                      const id = viewingProperty.id;
                      setViewingProperty(null);
                      setBookingPropertyId(id);
                    }}
                  >
                    Proceed with Booking
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      <AddPropertyModal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} />
      <EditPropertyModal
        isOpen={!!editingProperty}
        onClose={() => setEditingProperty(null)}
        property={editingProperty}
      />
      <ScheduleSiteVisitModal
        isOpen={!!siteVisitPropertyId}
        onClose={() => setSiteVisitPropertyId(null)}
        initialPropertyId={siteVisitPropertyId || undefined}
      />
      <CreateBookingModal
        isOpen={!!bookingPropertyId}
        onClose={() => setBookingPropertyId(null)}
        initialPropertyId={bookingPropertyId || undefined}
      />
      <ConfirmDialog
        isOpen={!!deletingProperty}
        onClose={() => setDeletingProperty(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Property?"
        message={`Are you sure you want to permanently remove "${deletingProperty?.name}" from your listings?`}
        confirmText="Delete Property"
      />
    </div>
  );
}
