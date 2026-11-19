'use client';

import React, { useState } from 'react';
import {
  Settings,
  Building,
  RotateCcw,
  Download,
  Upload,
  CheckCircle2,
  ShieldCheck,
  Bell,
  Cpu,
  Layers,
  Sparkles,
} from 'lucide-react';
import { useLmsStore } from '@/store/useLmsStore';
import { useToast } from '@/components/ui/toast';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';

export default function SettingsPage() {
  const { leads, properties, agents, bookings, resetDemoData } = useLmsStore();
  const { success, info } = useToast();

  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  const [companyName, setCompanyName] = useState('Kalaivani Real Estate Technologies Pvt Ltd');
  const [reraId, setReraId] = useState('PRM/KA/RERA/1251/AG/180214/00018');
  const [headquarters, setHeadquarters] = useState('Indiranagar 100 Feet Road, Bengaluru - 560038');
  const [contactEmail, setContactEmail] = useState('corporate@kalaivani.in');
  const [smsNotification, setSmsNotification] = useState(true);
  const [whatsappAlerts, setWhatsappAlerts] = useState(true);

  const handleSaveCompany = (e: React.FormEvent) => {
    e.preventDefault();
    success('Settings Saved', 'Company and brokerage profile details updated.');
  };

  const handleResetConfirm = () => {
    resetDemoData();
    success('Demo Data Reset', 'Realistic Indian real estate dataset has been refreshed to initial state.');
  };

  const handleExportJSON = () => {
    const data = {
      leads,
      properties,
      agents,
      bookings,
      exportTimestamp: new Date().toISOString(),
      platform: 'Kalaivani Real Estate LMS',
    };
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(data, null, 2))}`;
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', jsonString);
    downloadAnchor.setAttribute('download', `kalaivani-crm-backup-${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    success('Snapshot Exported', 'Full JSON database downloaded.');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Settings className="w-6 h-6 text-blue-600" />
            <span>Platform Settings & Demo Controls</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Configure brokerage information, system localization, and manage demonstration state.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Brokerage Profile & Config */}
        <div className="lg:col-span-2 space-y-6">
          {/* Company Profile */}
          <Card>
            <CardHeader>
              <CardTitle>Brokerage & Entity Information</CardTitle>
              <p className="text-xs text-slate-500 mt-0.5">Legal agency information used on buyer booking agreements</p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSaveCompany} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Company / Agency Name</label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-blue-500 outline-none text-xs"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Broker RERA Registration #</label>
                    <input
                      type="text"
                      value={reraId}
                      onChange={(e) => setReraId(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-blue-500 outline-none text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Official Contact Email</label>
                    <input
                      type="email"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-blue-500 outline-none text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Head Office Address</label>
                  <input
                    type="text"
                    value={headquarters}
                    onChange={(e) => setHeadquarters(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-blue-500 outline-none text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Currency Standard</label>
                    <input
                      type="text"
                      disabled
                      value="Indian Rupee (₹ INR) - Lakhs & Crores"
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-500 outline-none text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Timezone</label>
                    <input
                      type="text"
                      disabled
                      value="Asia/Kolkata (IST +05:30)"
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-500 outline-none text-xs"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <Button type="submit" size="sm">
                    Save Changes
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Automation & Notification Preferences */}
          <Card>
            <CardHeader>
              <CardTitle>Inquiry Dispatch & Notification Rules</CardTitle>
              <p className="text-xs text-slate-500 mt-0.5">Automated messaging and follow-up reminders</p>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50/50">
                <div>
                  <p className="font-bold text-slate-800">WhatsApp Instant Inquiry Confirmation</p>
                  <p className="text-slate-500 text-[11px]">Send automatic brochure link to buyer immediately upon submission</p>
                </div>
                <input
                  type="checkbox"
                  checked={whatsappAlerts}
                  onChange={(e) => setWhatsappAlerts(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50/50">
                <div>
                  <p className="font-bold text-slate-800">Sales Agent SMS Follow-up Alerts</p>
                  <p className="text-slate-500 text-[11px]">Alert executive 15 minutes before scheduled site visit or phone call</p>
                </div>
                <input
                  type="checkbox"
                  checked={smsNotification}
                  onChange={(e) => setSmsNotification(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right 1 Col: Demo Data Controls & Architecture */}
        <div className="space-y-6">
          {/* Demo Controls */}
          <Card className="border-blue-200 bg-blue-50/20">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-blue-600" />
                <CardTitle>Demo State Management</CardTitle>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">Manage demonstration database and persistence</p>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                <div className="flex justify-between font-medium">
                  <span className="text-slate-500">Stored Leads:</span>
                  <strong className="text-slate-800">{leads.length}</strong>
                </div>
                <div className="flex justify-between font-medium">
                  <span className="text-slate-500">Stored Properties:</span>
                  <strong className="text-slate-800">{properties.length}</strong>
                </div>
                <div className="flex justify-between font-medium">
                  <span className="text-slate-500">Stored Bookings:</span>
                  <strong className="text-slate-800">{bookings.length}</strong>
                </div>
                <div className="flex justify-between font-medium">
                  <span className="text-slate-500">Sales Agents:</span>
                  <strong className="text-slate-800">{agents.length}</strong>
                </div>
              </div>

              <div className="space-y-2 pt-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExportJSON}
                  className="w-full justify-center gap-1.5 bg-white"
                >
                  <Download className="w-4 h-4" />
                  <span>Export Database (JSON)</span>
                </Button>

                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => setIsResetConfirmOpen(true)}
                  className="w-full justify-center gap-1.5"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Reset Demo Data</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Architecture Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Cpu className="w-5 h-5 text-slate-600" />
                <CardTitle>System Specifications</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-2.5 text-xs text-slate-600">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span>Framework</span>
                <strong className="text-slate-900">Next.js 14 App Router</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span>Language</span>
                <strong className="text-slate-900">TypeScript 5.x</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span>Styling Engine</span>
                <strong className="text-slate-900">Tailwind CSS</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span>State Engine</span>
                <strong className="text-slate-900">Zustand + LocalStorage</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span>Analytics</span>
                <strong className="text-slate-900">Recharts</strong>
              </div>
              <div className="flex justify-between py-1">
                <span>Production DB Ready</span>
                <strong className="text-emerald-600">PostgreSQL / Prisma / Supabase</strong>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Reset Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isResetConfirmOpen}
        onClose={() => setIsResetConfirmOpen(false)}
        onConfirm={handleResetConfirm}
        title="Reset Demo Data to Initial State?"
        message="This will restore the 50 sample leads, 20 properties, 8 agents, 15 follow-ups, 10 site visits, and 8 bookings. Any new modifications will be overwritten."
        confirmText="Yes, Reset All Data"
      />
    </div>
  );
}
