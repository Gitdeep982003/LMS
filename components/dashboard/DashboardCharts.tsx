'use client';

import React, { useState, useEffect } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useLmsStore } from '@/store/useLmsStore';
import { formatINR } from '@/lib/utils';

const COLORS = ['#2563eb', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#f97316', '#64748b'];

export function DashboardCharts() {
  const { leads, agents } = useLmsStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="h-80 flex items-center justify-center text-xs text-slate-400">Loading charts...</div>;
  }

  // 1. Monthly Leads Trend Data (Simulated across recent 6 months with real count basis)
  const monthlyData = [
    { month: 'Jun', leads: 28, converted: 5, visits: 18 },
    { month: 'Jul', leads: 35, converted: 8, visits: 24 },
    { month: 'Aug', leads: 42, converted: 11, visits: 31 },
    { month: 'Sep', leads: 38, converted: 9, visits: 28 },
    { month: 'Oct', leads: 48, converted: 14, visits: 36 },
    { month: 'Nov', leads: leads.length, converted: leads.filter(l => l.status === 'Converted' || l.status === 'Booked').length, visits: 39 },
  ];

  // 2. Lead Source Distribution
  const sourceCounts: Record<string, number> = {};
  leads.forEach((l) => {
    sourceCounts[l.leadSource] = (sourceCounts[l.leadSource] || 0) + 1;
  });

  const sourceData = Object.entries(sourceCounts).map(([name, value]) => ({
    name,
    value,
  }));

  // 3. Sales Agent Performance Data
  const agentPerformanceData = agents.slice(0, 6).map((ag) => ({
    name: ag.name.split(' ')[0], // First name for clean axis
    salesCr: parseFloat((ag.totalSalesValue / 10000000).toFixed(2)),
    deals: ag.convertedLeadsCount,
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Monthly Lead & Conversion Trends (Spans 2 cols) */}
      <Card className="lg:col-span-2">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle>Monthly Lead Inflow & Conversions</CardTitle>
            <p className="text-xs text-slate-500 mt-0.5">Track acquisition volume versus deals closed</p>
          </div>
          <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-700">
            Last 6 Months
          </span>
        </CardHeader>
        <CardContent>
          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="leadsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="convertedGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                    fontSize: '12px',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Area
                  type="monotone"
                  dataKey="leads"
                  name="Total Inflow"
                  stroke="#2563eb"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#leadsGradient)"
                />
                <Area
                  type="monotone"
                  dataKey="converted"
                  name="Deals Closed"
                  stroke="#10b981"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#convertedGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Lead Source Distribution Donut Chart */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Lead Source Distribution</CardTitle>
          <p className="text-xs text-slate-500 mt-0.5">Where your highest volume inquiries originate</p>
        </CardHeader>
        <CardContent>
          <div className="h-72 w-full flex flex-col items-center justify-center">
            <ResponsiveContainer width="100%" height={210}>
              <PieChart>
                <Pie
                  data={sourceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {sourceData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val: any, name: any) => [`${val} Leads`, name]}
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderRadius: '10px',
                    border: '1px solid #e2e8f0',
                    fontSize: '11px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>

            {/* Quick mini-legend */}
            <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 mt-2 text-[11px] text-slate-600">
              {sourceData.slice(0, 4).map((entry, index) => (
                <div key={entry.name} className="flex items-center gap-1.5">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span>
                    {entry.name} ({entry.value})
                  </span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sales Agent Closed Value Bar Chart (Full width on 3-col layout or span 3) */}
      <Card className="lg:col-span-3">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle>Top Sales Executives Performance</CardTitle>
            <p className="text-xs text-slate-500 mt-0.5">Gross property sales value closed (in ₹ Crores)</p>
          </div>
          <span className="text-[11px] text-slate-500 font-medium">Revenue metrics in ₹ Cr</span>
        </CardHeader>
        <CardContent>
          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={agentPerformanceData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} unit=" Cr" />
                <Tooltip
                  formatter={(val: any) => [`₹${val} Cr`, 'Sales Volume']}
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="salesCr" name="Sales Closed" fill="#2563eb" radius={[6, 6, 0, 0]} maxBarSize={45} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
