'use client';

import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { useLmsStore } from '@/store/useLmsStore';
import { useToast } from '@/components/ui/toast';
import { formatINR } from '@/lib/utils';
import { PaymentStatus, BookingStatus } from '@/types';
import { AlertCircle } from 'lucide-react';

interface CreateBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialLeadId?: string;
  initialPropertyId?: string;
}

export function CreateBookingModal({
  isOpen,
  onClose,
  initialLeadId,
  initialPropertyId,
}: CreateBookingModalProps) {
  const { leads, properties, agents, addBooking } = useLmsStore();
  const { success, error } = useToast();

  const [leadId, setLeadId] = useState(initialLeadId || '');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [propertyId, setPropertyId] = useState(initialPropertyId || '');
  const [propertyPrice, setPropertyPrice] = useState(10000000);
  const [bookingAmount, setBookingAmount] = useState(500000);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('Completed');
  const [paymentMethod, setPaymentMethod] = useState<'Bank Transfer' | 'Cheque' | 'UPI' | 'Demand Draft'>('Bank Transfer');
  const [agentId, setAgentId] = useState('');
  const [bookingDate, setBookingDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (initialLeadId) {
      setLeadId(initialLeadId);
      const lead = leads.find((l) => l.id === initialLeadId);
      if (lead) {
        setCustomerName(lead.name);
        setCustomerPhone(lead.mobile);
        setCustomerEmail(lead.email);
        if (lead.interestedPropertyId) setPropertyId(lead.interestedPropertyId);
        if (lead.assignedAgentId) setAgentId(lead.assignedAgentId);
      }
    }
  }, [initialLeadId, leads]);

  useEffect(() => {
    if (initialPropertyId) {
      setPropertyId(initialPropertyId);
      const prop = properties.find((p) => p.id === initialPropertyId);
      if (prop) {
        setPropertyPrice(prop.price);
        setBookingAmount(Math.round(prop.price * 0.05));
      }
    }
  }, [initialPropertyId, properties]);

  const handleLeadSelect = (selectedId: string) => {
    setLeadId(selectedId);
    const lead = leads.find((l) => l.id === selectedId);
    if (lead) {
      setCustomerName(lead.name);
      setCustomerPhone(lead.mobile);
      setCustomerEmail(lead.email);
      if (lead.interestedPropertyId) {
        setPropertyId(lead.interestedPropertyId);
        const prop = properties.find((p) => p.id === lead.interestedPropertyId);
        if (prop) {
          setPropertyPrice(prop.price);
          setBookingAmount(Math.round(prop.price * 0.05));
        }
      }
      if (lead.assignedAgentId) setAgentId(lead.assignedAgentId);
    }
  };

  const handlePropertySelect = (selectedPropId: string) => {
    setPropertyId(selectedPropId);
    const prop = properties.find((p) => p.id === selectedPropId);
    if (prop) {
      setPropertyPrice(prop.price);
      setBookingAmount(Math.round(prop.price * 0.05));
    }
  };

  const selectedProperty = properties.find((p) => p.id === propertyId);
  const isPropertyUnavailable = selectedProperty && (selectedProperty.status === 'Booked' || selectedProperty.status === 'Sold');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !customerPhone.trim()) {
      error('Validation', 'Customer name and phone are required');
      return;
    }
    if (!propertyId) {
      error('Validation', 'Please select a property');
      return;
    }

    if (isPropertyUnavailable) {
      error('Unavailable Property', `This property is already ${selectedProperty?.status}. Please select an available unit.`);
      return;
    }

    const agent = agents.find((a) => a.id === agentId) || agents[0];

    addBooking({
      leadId: leadId || undefined,
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      customerEmail: customerEmail.trim() || `${customerName.toLowerCase().replace(/\s+/g, '')}@gmail.com`,
      propertyId,
      propertyName: selectedProperty?.name || 'Property',
      propertyPrice,
      bookingAmount,
      paymentStatus,
      paymentMethod,
      agentId: agent.id,
      agentName: agent.name,
      bookingDate,
      status: 'Confirmed' as BookingStatus,
      notes: notes.trim(),
    });

    success(
      'Booking Created!',
      `Booking confirmed for ${selectedProperty?.name}. Property availability updated to Booked.`
    );
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create Property Booking"
      description="Record a token advance or booking agreement for a property unit"
      maxWidth="2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Lead Selection */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Link to Lead (Optional)</label>
          <select
            value={leadId}
            onChange={(e) => handleLeadSelect(e.target.value)}
            className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:border-blue-500 outline-none bg-white"
          >
            <option value="">-- Direct Booking / New Customer --</option>
            {leads.map((l) => (
              <option key={l.id} value={l.id}>
                {l.name} ({l.mobile} - Budget: {formatINR(l.budget)})
              </option>
            ))}
          </select>
        </div>

        {/* Customer Details */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Customer Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:border-blue-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Mobile Number <span className="text-rose-500">*</span>
            </label>
            <input
              type="tel"
              required
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:border-blue-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
            <input
              type="email"
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:border-blue-500 outline-none"
            />
          </div>
        </div>

        {/* Property Selection */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-semibold text-slate-700">
              Select Property <span className="text-rose-500">*</span>
            </label>
            {selectedProperty && (
              <span
                className={`text-xs font-semibold px-2 py-0.5 rounded ${
                  selectedProperty.status === 'Available'
                    ? 'bg-emerald-50 text-emerald-700'
                    : selectedProperty.status === 'Booked'
                    ? 'bg-amber-50 text-amber-700'
                    : 'bg-rose-50 text-rose-700'
                }`}
              >
                Status: {selectedProperty.status}
              </span>
            )}
          </div>
          <select
            value={propertyId}
            onChange={(e) => handlePropertySelect(e.target.value)}
            required
            className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:border-blue-500 outline-none bg-white"
          >
            <option value="">-- Choose Unit --</option>
            {properties.map((p) => (
              <option key={p.id} value={p.id} disabled={p.status === 'Sold' || p.status === 'Booked'}>
                {p.name} - {formatINR(p.price)} [{p.status}]
              </option>
            ))}
          </select>
        </div>

        {/* Warning if unavailable */}
        {isPropertyUnavailable && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>
              This property is currently <strong>{selectedProperty?.status}</strong>. Please select an available unit or cancel the prior booking in Bookings.
            </span>
          </div>
        )}

        {/* Financials: Price & Token */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Total Unit Price (INR)</label>
            <input
              type="number"
              required
              value={propertyPrice}
              onChange={(e) => setPropertyPrice(Number(e.target.value))}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:border-blue-500 outline-none"
            />
            <span className="text-[11px] text-slate-500 mt-1 block">Formatted: {formatINR(propertyPrice)}</span>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Booking Advance / Token (INR)</label>
            <input
              type="number"
              required
              value={bookingAmount}
              onChange={(e) => setBookingAmount(Number(e.target.value))}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:border-blue-500 outline-none"
            />
            <span className="text-[11px] text-slate-500 mt-1 block">Formatted: {formatINR(bookingAmount)}</span>
          </div>
        </div>

        {/* Payment Status & Method */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Payment Status</label>
            <select
              value={paymentStatus}
              onChange={(e) => setPaymentStatus(e.target.value as PaymentStatus)}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:border-blue-500 outline-none bg-white"
            >
              <option value="Completed">Completed</option>
              <option value="Partial">Partial</option>
              <option value="Pending">Pending</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Payment Mode</label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value as any)}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:border-blue-500 outline-none bg-white"
            >
              <option value="Bank Transfer">Bank Transfer (NEFT/RTGS)</option>
              <option value="Cheque">Cheque</option>
              <option value="UPI">UPI Payment</option>
              <option value="Demand Draft">Demand Draft</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Sales Executive</label>
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

        {/* Notes */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Booking Notes / Terms</label>
          <textarea
            rows={2}
            placeholder="Special conditions, installment milestones, parking slot number..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:border-blue-500 outline-none resize-none"
          />
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={isPropertyUnavailable} variant="emerald">
            Confirm Booking
          </Button>
        </div>
      </form>
    </Modal>
  );
}
