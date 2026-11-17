'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { useLmsStore } from '@/store/useLmsStore';
import { useToast } from '@/components/ui/toast';
import { formatINR } from '@/lib/utils';
import { UserCheck } from 'lucide-react';

interface AssignLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  leadIds: string[];
}

export function AssignLeadModal({ isOpen, onClose, leadIds }: AssignLeadModalProps) {
  const { agents, assignLead, bulkAssignLeads } = useLmsStore();
  const { success, error } = useToast();
  const [selectedAgentId, setSelectedAgentId] = useState(agents[0]?.id || '');

  const selectedAgent = agents.find((a) => a.id === selectedAgentId);

  const handleAssign = () => {
    if (!selectedAgent) {
      error('Error', 'Please choose an agent');
      return;
    }

    if (leadIds.length === 1) {
      assignLead(leadIds[0], selectedAgent.id, selectedAgent.name);
      success('Lead Assigned', `Lead successfully assigned to ${selectedAgent.name}`);
    } else {
      bulkAssignLeads(leadIds, selectedAgent.id, selectedAgent.name);
      success('Bulk Assigned', `${leadIds.length} leads successfully assigned to ${selectedAgent.name}`);
    }

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={leadIds.length > 1 ? `Bulk Assign ${leadIds.length} Leads` : 'Assign Lead'}
      description="Allocate customer inquiries to sales executives based on workload and capacity"
      maxWidth="md"
    >
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-2">
            Select Sales Executive
          </label>
          <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
            {agents.map((ag) => {
              const workloadPct = Math.round((ag.activeLeadsCount / ag.maxLeadCapacity) * 100);
              const isSelected = ag.id === selectedAgentId;

              return (
                <div
                  key={ag.id}
                  onClick={() => setSelectedAgentId(ag.id)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                    isSelected
                      ? 'border-blue-500 bg-blue-50/50 ring-1 ring-blue-500'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={ag.avatar}
                      alt={ag.name}
                      className="w-9 h-9 rounded-full object-cover ring-1 ring-slate-200"
                    />
                    <div>
                      <p className="text-xs font-bold text-slate-800">{ag.name}</p>
                      <p className="text-[11px] text-slate-500">
                        {ag.role} • {ag.department}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[11px] font-semibold text-slate-700 block">
                      {ag.activeLeadsCount} / {ag.maxLeadCapacity} Active
                    </span>
                    <div className="w-20 h-1.5 bg-slate-200 rounded-full mt-1 overflow-hidden ml-auto">
                      <div
                        className={`h-full rounded-full ${
                          workloadPct > 80 ? 'bg-rose-500' : workloadPct > 50 ? 'bg-amber-500' : 'bg-emerald-500'
                        }`}
                        style={{ width: `${Math.min(100, workloadPct)}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {selectedAgent && (
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
            <span className="font-semibold text-slate-700 block">Executive Performance Summary</span>
            <div className="grid grid-cols-2 gap-2 text-slate-600 pt-1">
              <div>Converted Deals: <strong className="text-slate-800">{selectedAgent.convertedLeadsCount}</strong></div>
              <div>Sales Volume: <strong className="text-slate-800">{formatINR(selectedAgent.totalSalesValue)}</strong></div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleAssign} className="gap-1.5">
            <UserCheck className="w-4 h-4" />
            <span>Confirm Assignment</span>
          </Button>
        </div>
      </div>
    </Modal>
  );
}
