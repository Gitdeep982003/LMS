'use client';

import React, { useState } from 'react';
import {
  ShieldAlert,
  Plus,
  User,
  Mail,
  Phone,
  ShieldCheck,
  CheckCircle2,
  TrendingUp,
  Edit,
  Trash2,
  Building,
  Key,
  Briefcase,
} from 'lucide-react';
import { useLmsStore } from '@/store/useLmsStore';
import { useToast } from '@/components/ui/toast';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatINR } from '@/lib/utils';
import { Modal } from '@/components/ui/modal';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { SalesAgent, UserRole } from '@/types';

export default function TeamPage() {
  const { agents, addAgent, updateAgent, deleteAgent, currentUser, setCurrentUser } = useLmsStore();
  const { success, error } = useToast();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingAgent, setEditingAgent] = useState<SalesAgent | null>(null);
  const [deletingAgent, setDeletingAgent] = useState<SalesAgent | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<UserRole>('Sales Executive');
  const [department, setDepartment] = useState('Residential Sales');
  const [maxCapacity, setMaxCapacity] = useState(25);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      error('Validation', 'Name and email are required');
      return;
    }

    addAgent({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim() || '+91 98000 12345',
      role,
      department,
      maxLeadCapacity: Number(maxCapacity),
      status: 'Active',
      avatar: `https://images.unsplash.com/photo-${1534528741775 + Math.floor(Math.random() * 5000)}?w=150&auto=format&fit=crop&q=80`,
    });

    success('Agent Added', `${name} joined as ${role}.`);
    setIsAddOpen(false);
    setName('');
    setEmail('');
    setPhone('');
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAgent) return;

    updateAgent(editingAgent.id, {
      name: editingAgent.name,
      email: editingAgent.email,
      phone: editingAgent.phone,
      role: editingAgent.role,
      department: editingAgent.department,
      maxLeadCapacity: Number(editingAgent.maxLeadCapacity),
      status: editingAgent.status,
    });

    success('Updated', `Details for ${editingAgent.name} updated.`);
    setEditingAgent(null);
  };

  const handleDeleteConfirm = () => {
    if (deletingAgent) {
      deleteAgent(deletingAgent.id);
      success('Removed', `${deletingAgent.name} was removed from the team.`);
      setDeletingAgent(null);
    }
  };

  const handleQuickSwitch = (ag: SalesAgent) => {
    setCurrentUser({
      id: ag.id,
      name: ag.name,
      email: ag.email,
      role: ag.role,
      avatar: ag.avatar,
      phone: ag.phone,
    });
    success('User Session Switched', `Now operating as ${ag.name} (${ag.role})`);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-poppins font-bold text-[#0C141F] tracking-tight flex items-center gap-2.5">
            <ShieldAlert className="w-6 h-6 text-[#C59B63]" />
            <span>Sales Team & Role Permissions</span>
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
            Manage sales managers, executive assignments, quotas, and role-based access.
          </p>
        </div>

        <Button size="sm" onClick={() => setIsAddOpen(true)} className="gap-1.5 text-xs shadow-sm bg-[#0C141F] text-[#C59B63] hover:bg-[#16202E] border border-[#C59B63]/30">
          <Plus className="w-4 h-4" />
          <span>Add Team Member</span>
        </Button>
      </div>

      {/* Role Permission Matrix Card */}
      <Card className="bg-gradient-to-r from-[#0C141F] via-[#16202E] to-[#1a2536] text-white border-0 shadow-sm">
        <CardContent className="p-5 space-y-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#C59B63]" />
            <h3 className="font-poppins font-bold text-sm text-[#FAF5EC]">Role-Based Access Control (RBAC) System</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs pt-1">
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1">
              <span className="font-bold text-[#C59B63]">Admin</span>
              <p className="text-stone-300 text-[11px] leading-relaxed">
                Full administrative clearance. Access to all 12 modules, configuration settings, user management, and system database resets.
              </p>
            </div>
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1">
              <span className="font-bold text-amber-300">Sales Manager</span>
              <p className="text-stone-300 text-[11px] leading-relaxed">
                Oversees sales pipelines, reallocates unassigned leads, monitors quota fulfillment, and audits booking agreements.
              </p>
            </div>
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1">
              <span className="font-bold text-emerald-400">Sales Executive</span>
              <p className="text-stone-300 text-[11px] leading-relaxed">
                Direct customer engagement: executes scheduled calls, conducts property site visits, logs notes, and prepares deal tokens.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Team Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {agents.map((ag) => {
          const isCurrentUser = currentUser.id === ag.id;
          const workloadPct = Math.min(100, Math.round((ag.activeLeadsCount / ag.maxLeadCapacity) * 100));

          return (
            <Card
              key={ag.id}
              className={`border-[#EAE4D9] hover:border-[#C59B63]/40 bg-white transition-all flex flex-col justify-between ${isCurrentUser ? 'ring-2 ring-[#C59B63] bg-[#FAF5EC]/30 border-[#C59B63]' : ''
                }`}
            >
              <CardContent className="p-5 space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={ag.avatar}
                      alt={ag.name}
                      className="w-11 h-11 rounded-full object-cover ring-2 ring-[#EAE4D9]"
                    />
                    <div>
                      <h4 className="font-poppins font-bold text-[#0C141F] text-sm leading-tight">{ag.name}</h4>
                      <p className="text-[11px] text-[#8C6228] font-semibold">{ag.role}</p>
                      <p className="text-[10px] text-stone-400">{ag.department}</p>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${ag.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-[#FAF5EC] text-stone-600'
                      }`}
                  >
                    {ag.status}
                  </span>
                </div>

                {/* Contact */}
                <div className="space-y-1 text-xs text-stone-600 pt-1">
                  <div className="flex items-center gap-2 truncate">
                    <Mail className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                    <span className="truncate">{ag.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                    <span>{ag.phone}</span>
                  </div>
                </div>

                {/* Performance stats */}
                <div className="grid grid-cols-2 gap-2 p-2.5 bg-[#FAF8F5] rounded-xl border border-[#EAE4D9] text-xs">
                  <div>
                    <span className="text-[10px] text-stone-500 block uppercase font-medium">Deals Closed</span>
                    <strong className="text-[#0C141F] text-sm font-poppins">{ag.convertedLeadsCount}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-500 block uppercase font-medium">Sales Volume</span>
                    <strong className="text-[#8C6228] text-sm font-semibold">{formatINR(ag.totalSalesValue)}</strong>
                  </div>
                </div>

                {/* Capacity */}
                <div>
                  <div className="flex items-center justify-between text-[11px] text-stone-600 mb-1">
                    <span>Lead Capacity</span>
                    <span className="font-bold text-[#0C141F]">
                      {ag.activeLeadsCount} / {ag.maxLeadCapacity} ({workloadPct}%)
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-[#F2EDE4] rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${workloadPct > 80 ? 'bg-rose-500' : 'bg-[#C59B63]'
                        }`}
                      style={{ width: `${workloadPct}%` }}
                    />
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="pt-3 border-t border-[#EAE4D9] flex items-center justify-between gap-1 text-xs">
                  <button
                    onClick={() => handleQuickSwitch(ag)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${isCurrentUser
                      ? 'bg-[#0C141F] text-[#C59B63] border border-[#C59B63]/30 shadow-xs'
                      : 'bg-[#F2EDE4] text-stone-700 hover:bg-[#FAF5EC] hover:text-[#0C141F]'
                      }`}
                  >
                    {isCurrentUser ? 'Active Session' : 'Switch Role'}
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setEditingAgent(ag)}
                      className="p-1 rounded text-stone-400 hover:text-stone-700"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeletingAgent(ag)}
                      className="p-1 rounded text-stone-400 hover:text-rose-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Add Agent Modal */}
      <Modal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} title="Add Sales Team Member" maxWidth="md">
        <form onSubmit={handleAddSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Full Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Rahul Sharma"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-[#C59B63] focus:ring-1 focus:ring-[#C59B63] outline-none text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Work Email</label>
              <input
                type="email"
                required
                placeholder="rahul@estatify.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-[#C59B63] focus:ring-1 focus:ring-[#C59B63] outline-none text-xs"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Phone</label>
              <input
                type="tel"
                placeholder="+91 98765 43210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-[#C59B63] focus:ring-1 focus:ring-[#C59B63] outline-none text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">System Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-[#C59B63] focus:ring-1 focus:ring-[#C59B63] outline-none bg-white font-medium text-xs"
              >
                <option value="Admin">Admin</option>
                <option value="Sales Manager">Sales Manager</option>
                <option value="Sales Executive">Sales Executive</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Lead Capacity</label>
              <input
                type="number"
                value={maxCapacity}
                onChange={(e) => setMaxCapacity(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-[#C59B63] focus:ring-1 focus:ring-[#C59B63] outline-none text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Department</label>
            <input
              type="text"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-[#C59B63] focus:ring-1 focus:ring-[#C59B63] outline-none text-xs"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t">
            <Button variant="outline" size="sm" onClick={() => setIsAddOpen(false)}>
              Cancel
            </Button>
            <Button size="sm" type="submit">
              Save Member
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit Agent Modal */}
      {editingAgent && (
        <Modal
          isOpen={!!editingAgent}
          onClose={() => setEditingAgent(null)}
          title={`Edit Member: ${editingAgent.name}`}
          maxWidth="md"
        >
          <form onSubmit={handleEditSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                required
                value={editingAgent.name}
                onChange={(e) => setEditingAgent({ ...editingAgent, name: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 outline-none text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={editingAgent.email}
                  onChange={(e) => setEditingAgent({ ...editingAgent, email: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 outline-none text-xs"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Role</label>
                <select
                  value={editingAgent.role}
                  onChange={(e) => setEditingAgent({ ...editingAgent, role: e.target.value as UserRole })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white font-medium text-xs"
                >
                  <option value="Admin">Admin</option>
                  <option value="Sales Manager">Sales Manager</option>
                  <option value="Sales Executive">Sales Executive</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Max Capacity</label>
                <input
                  type="number"
                  value={editingAgent.maxLeadCapacity}
                  onChange={(e) => setEditingAgent({ ...editingAgent, maxLeadCapacity: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 outline-none text-xs"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Status</label>
                <select
                  value={editingAgent.status}
                  onChange={(e) => setEditingAgent({ ...editingAgent, status: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white font-medium text-xs"
                >
                  <option value="Active">Active</option>
                  <option value="On Leave">On Leave</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t">
              <Button variant="outline" size="sm" onClick={() => setEditingAgent(null)}>
                Cancel
              </Button>
              <Button size="sm" type="submit">
                Save Changes
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Delete Dialog */}
      <ConfirmDialog
        isOpen={!!deletingAgent}
        onClose={() => setDeletingAgent(null)}
        onConfirm={handleDeleteConfirm}
        title="Remove Sales Member?"
        message={`Are you sure you want to remove "${deletingAgent?.name}" from your sales team?`}
        confirmText="Remove"
      />
    </div>
  );
}
