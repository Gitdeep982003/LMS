'use client';

import React, { useState, useMemo } from 'react';
import {
  CheckCircle,
  Plus,
  Search,
  Filter,
  Download,
  IndianRupee,
  Building2,
  Calendar,
  User,
  ShieldCheck,
  CreditCard,
  Trash2,
  Eye,
  FileText,
} from 'lucide-react';
import { useLmsStore } from '@/store/useLmsStore';
import { useToast } from '@/components/ui/toast';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatINR, formatDate } from '@/lib/utils';
import { exportDataToCSV } from '@/lib/csv';
import { CreateBookingModal } from '@/components/bookings/CreateBookingModal';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { Booking, BookingStatus, PaymentStatus } from '@/types';

export default function BookingsPage() {
  const { bookings, updateBooking, deleteBooking } = useLmsStore();
  const { success, error } = useToast();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [paymentFilter, setPaymentFilter] = useState('ALL');

  // Modals
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [viewingBooking, setViewingBooking] = useState<Booking | null>(null);
  const [deletingBooking, setDeletingBooking] = useState<Booking | null>(null);

  // Financial statistics
  const totalSalesValue = bookings.reduce((sum, b) => sum + (b.propertyPrice || 0), 0);
  const totalAdvanceCollected = bookings.reduce((sum, b) => sum + (b.bookingAmount || 0), 0);
  const confirmedCount = bookings.filter((b) => b.status === 'Confirmed').length;

  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      if (statusFilter !== 'ALL' && b.status !== statusFilter) return false;
      if (paymentFilter !== 'ALL' && b.paymentStatus !== paymentFilter) return false;

      if (search) {
        const query = search.toLowerCase();
        return (
          b.customerName.toLowerCase().includes(query) ||
          b.propertyName.toLowerCase().includes(query) ||
          b.id.toLowerCase().includes(query) ||
          b.agreementNumber.toLowerCase().includes(query)
        );
      }

      return true;
    });
  }, [bookings, statusFilter, paymentFilter, search]);

  const handleStatusChange = (bookingId: string, newStatus: BookingStatus) => {
    updateBooking(bookingId, { status: newStatus });
    success('Booking Updated', `Status changed to ${newStatus}. Property availability adjusted.`);
  };

  const handleExportCSV = () => {
    const headers = [
      'Booking ID',
      'Customer Name',
      'Mobile',
      'Property Name',
      'Property Price (INR)',
      'Booking Amount (INR)',
      'Payment Status',
      'Payment Method',
      'Executive',
      'Booking Date',
      'Status',
      'Agreement #'
    ];
    const rows = filteredBookings.map((b) => [
      b.id,
      b.customerName,
      b.customerPhone,
      b.propertyName,
      b.propertyPrice,
      b.bookingAmount,
      b.paymentStatus,
      b.paymentMethod,
      b.agentName,
      b.bookingDate,
      b.status,
      b.agreementNumber
    ]);
    exportDataToCSV(headers, rows, `estatify-bookings-${new Date().toISOString().split('T')[0]}.csv`);
    success('Exported', `${filteredBookings.length} booking records exported to CSV.`);
  };

  const handleDeleteConfirm = () => {
    if (deletingBooking) {
      deleteBooking(deletingBooking.id);
      success('Booking Removed', 'Property availability restored to Available.');
      setDeletingBooking(null);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <CheckCircle className="w-6 h-6 text-emerald-600" />
            <span>Property Bookings & Agreements</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Process earnest money deposits, agreement allocations, and property reservation statuses.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button variant="outline" size="sm" onClick={handleExportCSV} className="gap-1.5 text-xs">
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </Button>
          <Button size="sm" variant="emerald" onClick={() => setIsCreateOpen(true)} className="gap-1.5 text-xs shadow-sm">
            <Plus className="w-4 h-4" />
            <span>New Booking</span>
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 sm:p-5">
            <span className="text-xs text-slate-500 font-medium">Total Booked Property Value</span>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">{formatINR(totalSalesValue)}</h3>
            <p className="text-[11px] text-emerald-600 mt-0.5">{confirmedCount} active confirmed contracts</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 sm:p-5">
            <span className="text-xs text-slate-500 font-medium">Advance Token Collected</span>
            <h3 className="text-2xl font-bold text-emerald-600 mt-1">{formatINR(totalAdvanceCollected)}</h3>
            <p className="text-[11px] text-slate-500 mt-0.5">Escrow & milestone account</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 sm:p-5">
            <span className="text-xs text-slate-500 font-medium">Total Bookings Count</span>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">{bookings.length} Units</h3>
            <p className="text-[11px] text-blue-600 mt-0.5">Inventory locks synced automatically</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by customer, agreement #, or unit..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200 focus:border-blue-500 outline-none"
              />
            </div>

            <div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:border-blue-500 outline-none bg-white font-medium"
              >
                <option value="ALL">Booking Status: All</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Under Review">Under Review</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

            <div>
              <select
                value={paymentFilter}
                onChange={(e) => setPaymentFilter(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:border-blue-500 outline-none bg-white font-medium"
              >
                <option value="ALL">Payment Status: All</option>
                <option value="Completed">Payment Completed</option>
                <option value="Partial">Partial Advance</option>
                <option value="Pending">Payment Pending</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bookings Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4">Booking ID & Date</th>
                  <th className="py-3 px-3">Customer</th>
                  <th className="py-3 px-3">Property Unit</th>
                  <th className="py-3 px-3">Property Price</th>
                  <th className="py-3 px-3">Token Collected</th>
                  <th className="py-3 px-3">Payment Mode</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredBookings.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-400">
                      No booking records found.
                    </td>
                  </tr>
                ) : (
                  filteredBookings.map((b) => (
                    <tr key={b.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4">
                        <span className="font-bold text-slate-800 block">{b.id}</span>
                        <span className="text-[11px] text-slate-500">{formatDate(b.bookingDate)}</span>
                      </td>
                      <td className="py-3 px-3">
                        <p className="font-semibold text-slate-900">{b.customerName}</p>
                        <p className="text-[11px] text-slate-500">{b.customerPhone}</p>
                      </td>
                      <td className="py-3 px-3">
                        <p className="font-medium text-slate-800 truncate max-w-[180px]">{b.propertyName}</p>
                        <span className="text-[10px] text-blue-600 font-mono">
                          Agr: {b.agreementNumber}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-bold text-slate-900">{formatINR(b.propertyPrice)}</td>
                      <td className="py-3 px-3">
                        <span className="font-bold text-emerald-700 block">{formatINR(b.bookingAmount)}</span>
                        <span
                          className={`text-[10px] font-semibold px-1.5 py-0.2 rounded ${
                            b.paymentStatus === 'Completed'
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-amber-50 text-amber-700'
                          }`}
                        >
                          {b.paymentStatus}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-slate-600">{b.paymentMethod}</td>
                      <td className="py-3 px-3">
                        <select
                          value={b.status}
                          onChange={(e) => handleStatusChange(b.id, e.target.value as BookingStatus)}
                          className="px-2 py-0.5 rounded text-xs border border-slate-200 bg-white font-medium"
                        >
                          <option value="Confirmed">Confirmed</option>
                          <option value="Under Review">Under Review</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setViewingBooking(b)}
                            className="p-1 rounded text-slate-400 hover:text-blue-600"
                            title="View Agreement"
                          >
                            <FileText className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeletingBooking(b)}
                            className="p-1 rounded text-slate-400 hover:text-rose-600"
                            title="Delete Booking"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Booking Agreement View Modal */}
      {viewingBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <span className="text-[10px] font-mono text-blue-600 uppercase">Official Sale Memorandum</span>
                <h3 className="text-base font-bold text-slate-900">Agreement #{viewingBooking.agreementNumber}</h3>
              </div>
              <button onClick={() => setViewingBooking(null)} className="text-slate-400 hover:text-slate-600">
                ✕
              </button>
            </div>

            <div className="space-y-2.5">
              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <p><strong>Customer:</strong> {viewingBooking.customerName}</p>
                <p><strong>Mobile:</strong> {viewingBooking.customerPhone}</p>
                <p><strong>Email:</strong> {viewingBooking.customerEmail}</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <p><strong>Property:</strong> {viewingBooking.propertyName}</p>
                <p><strong>Agreement Value:</strong> {formatINR(viewingBooking.propertyPrice)}</p>
                <p><strong>Token / Advance:</strong> {formatINR(viewingBooking.bookingAmount)} ({viewingBooking.paymentMethod})</p>
                <p><strong>Sales Executive:</strong> {viewingBooking.agentName}</p>
              </div>

              {viewingBooking.notes && (
                <div className="p-3 bg-amber-50 rounded-xl text-amber-900">
                  <p><strong>Terms:</strong> {viewingBooking.notes}</p>
                </div>
              )}
            </div>

            <div className="pt-2 border-t flex justify-end">
              <Button size="sm" onClick={() => setViewingBooking(null)}>
                Close Memorandum
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      <CreateBookingModal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} />
      <ConfirmDialog
        isOpen={!!deletingBooking}
        onClose={() => setDeletingBooking(null)}
        onConfirm={handleDeleteConfirm}
        title="Cancel & Delete Booking?"
        message={`Are you sure you want to cancel booking "${deletingBooking?.id}" for ${deletingBooking?.propertyName}? This will mark the property back as Available.`}
        confirmText="Confirm Deletion"
      />
    </div>
  );
}
