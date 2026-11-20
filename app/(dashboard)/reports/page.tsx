'use client';

import React, { useState, useMemo, useEffect } from 'react';
import {
  BarChart3,
  Download,
  Calendar,
  TrendingUp,
  PieChart as PieIcon,
  Filter,
  DollarSign,
  Building,
  Users2,
  FileSpreadsheet,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { useLmsStore } from '@/store/useLmsStore';
import { useToast } from '@/components/ui/toast';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatINR } from '@/lib/utils';
import { exportDataToCSV } from '@/lib/csv';

const COLORS = ['#C59B63', '#0C141F', '#8C6228', '#10b981', '#B88A44', '#64748b', '#D4AF77', '#1E293B'];

export default function ReportsPage() {
  const { leads, bookings, siteVisits, agents, properties } = useLmsStore();
  const { success } = useToast();
  const [mounted, setMounted] = useState(false);
  const [dateRange, setDateRange] = useState<'30days' | 'quarter' | 'year' | 'all'>('all');

  useEffect(() => {
    setMounted(true);
  }, []);

  // 1. Leads by Month
  const monthlyLeadsData = [
    { month: 'Jun', totalLeads: 28, converted: 6, volumeCr: 8.5 },
    { month: 'Jul', totalLeads: 36, converted: 9, volumeCr: 14.2 },
    { month: 'Aug', totalLeads: 44, converted: 12, volumeCr: 19.8 },
    { month: 'Sep', totalLeads: 40, converted: 10, volumeCr: 15.6 },
    { month: 'Oct', totalLeads: 52, converted: 16, volumeCr: 28.4 },
    { month: 'Nov', totalLeads: leads.length, converted: bookings.length, volumeCr: parseFloat((bookings.reduce((s, b) => s + b.propertyPrice, 0) / 10000000).toFixed(1)) },
  ];

  // 2. Source Performance
  const sourceStats = useMemo(() => {
    const map: Record<string, { leads: number; converted: number }> = {};
    leads.forEach((l) => {
      if (!map[l.leadSource]) map[l.leadSource] = { leads: 0, converted: 0 };
      map[l.leadSource].leads++;
      if (l.status === 'Converted' || l.status === 'Booked') {
        map[l.leadSource].converted++;
      }
    });

    return Object.entries(map).map(([source, data]) => ({
      source,
      inquiries: data.leads,
      deals: data.converted,
      rate: data.leads > 0 ? Math.round((data.converted / data.leads) * 100) : 0,
    }));
  }, [leads]);

  // 3. Category Revenue
  const categoryRevenue = useMemo(() => {
    const catMap: Record<string, number> = {
      Apartment: 0,
      Villa: 0,
      Penthouse: 0,
      Commercial: 0,
      Plot: 0,
    };

    bookings.forEach((b) => {
      const prop = properties.find((p) => p.id === b.propertyId);
      const cat = prop?.type || 'Apartment';
      catMap[cat] = (catMap[cat] || 0) + b.propertyPrice;
    });

    return Object.entries(catMap).map(([type, val]) => ({
      name: type,
      value: val,
      displayCr: parseFloat((val / 10000000).toFixed(2)),
    }));
  }, [bookings, properties]);

  // 4. Site visit status breakdown
  const visitStatusData = useMemo(() => {
    const completed = siteVisits.filter((v) => v.status === 'Completed').length;
    const scheduled = siteVisits.filter((v) => v.status === 'Scheduled').length;
    const cancelled = siteVisits.filter((v) => v.status === 'Cancelled').length;

    return [
      { name: 'Completed Tours', count: completed, fill: '#10b981' },
      { name: 'Scheduled Tours', count: scheduled, fill: '#C59B63' },
      { name: 'Cancelled / Rescheduled', count: cancelled, fill: '#f43f5e' },
    ];
  }, [siteVisits]);

  // 5. Agent Leaderboard
  const agentRanks = useMemo(() => {
    return [...agents].sort((a, b) => b.totalSalesValue - a.totalSalesValue);
  }, [agents]);

  const handleExportReportCSV = () => {
    const headers = ['Sales Executive', 'Role', 'Department', 'Active Leads', 'Deals Closed', 'Sales Volume (INR)'];
    const rows = agentRanks.map((ag) => [
      ag.name,
      ag.role,
      ag.department,
      ag.activeLeadsCount,
      ag.convertedLeadsCount,
      ag.totalSalesValue,
    ]);
    exportDataToCSV(headers, rows, `sales-performance-report-${new Date().toISOString().split('T')[0]}.csv`);
    success('Export Complete', 'Sales performance report downloaded.');
  };

  if (!mounted) {
    return <div className="p-8 text-xs text-stone-400">Loading analytics...</div>;
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-poppins font-bold text-[#0C141F] tracking-tight flex items-center gap-2.5">
            <BarChart3 className="w-6 h-6 text-[#C59B63]" />
            <span>Reports & Analytics Dashboard</span>
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
            Enterprise analytics covering marketing channel attribution, sales quotas, and revenue realization.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Date range picker simulation */}
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value as any)}
            className="px-3 py-1.5 text-xs rounded-lg border border-[#EAE4D9] focus:border-[#C59B63] focus:ring-1 focus:ring-[#C59B63] outline-none bg-white font-medium text-[#0C141F]"
          >
            <option value="30days">Last 30 Days</option>
            <option value="quarter">Current Quarter (Q4)</option>
            <option value="year">Fiscal Year 2026-27</option>
            <option value="all">All-Time Cumulative</option>
          </select>

          <Button size="sm" variant="outline" onClick={handleExportReportCSV} className="gap-1.5 text-xs border-[#C59B63] text-[#0C141F] hover:bg-[#FAF5EC]">
            <Download className="w-3.5 h-3.5 text-[#C59B63]" />
            <span>Export Report CSV</span>
          </Button>
        </div>
      </div>

      {/* Row 1: Area Trends & Source Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Trend Area Chart */}
        <Card className="lg:col-span-2 border-[#EAE4D9] bg-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle>Lead Flow & Closed Revenue Trajectory</CardTitle>
              <p className="text-xs text-stone-500 mt-0.5">Total inquiry influx vs total property value closed</p>
            </div>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-[#FAF5EC] text-[#8C6228] border border-[#EAE4D9]">
              Positive Growth
            </span>
          </CardHeader>
          <CardContent>
            <div className="h-72 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyLeadsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="volumeGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#C59B63" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#C59B63" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EAE4D9" />
                  <XAxis dataKey="month" stroke="#78716c" fontSize={11} tickLine={false} />
                  <YAxis stroke="#78716c" fontSize={11} tickLine={false} axisLine={false} unit=" Cr" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#FAF8F5',
                      borderRadius: '12px',
                      border: '1px solid #EAE4D9',
                      fontSize: '12px',
                      color: '#0C141F',
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                  <Area
                    type="monotone"
                    dataKey="volumeCr"
                    name="Closed Volume (₹ Cr)"
                    stroke="#C59B63"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#volumeGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Property Category Booking Breakdown */}
        <Card className="border-[#EAE4D9] bg-white">
          <CardHeader className="pb-2">
            <CardTitle>Sales Volume by Property Type</CardTitle>
            <p className="text-xs text-stone-500 mt-0.5">Asset class revenue distribution</p>
          </CardHeader>
          <CardContent>
            <div className="h-72 w-full flex flex-col items-center justify-center">
              <ResponsiveContainer width="100%" height={210}>
                <PieChart>
                  <Pie
                    data={categoryRevenue}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {categoryRevenue.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val: any) => [formatINR(Number(val)), 'Total Value']}
                    contentStyle={{
                      backgroundColor: '#FAF8F5',
                      borderRadius: '10px',
                      border: '1px solid #EAE4D9',
                      fontSize: '11px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>

              <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 mt-1 text-[11px] text-stone-600">
                {categoryRevenue.map((entry, index) => (
                  <div key={entry.name} className="flex items-center gap-1.5">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span>{entry.name} ({entry.displayCr} Cr)</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Row 2: Channel Performance Table & Site Visit Outcomes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Channel Table */}
        <Card className="lg:col-span-2 border-[#EAE4D9] bg-white">
          <CardHeader className="pb-3">
            <CardTitle>Marketing Source ROI & Attribution</CardTitle>
            <p className="text-xs text-stone-500 mt-0.5">Inquiry volumes and actual closing rates per portal</p>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-y border-[#EAE4D9] bg-[#FAF5EC]/60 text-stone-600 font-poppins font-semibold uppercase tracking-wider text-[11px]">
                    <th className="py-2.5 px-4">Channel / Portal</th>
                    <th className="py-2.5 px-3">Total Inquiries</th>
                    <th className="py-2.5 px-3">Deals Booked</th>
                    <th className="py-2.5 px-3">Conversion Rate</th>
                    <th className="py-2.5 px-4 text-right">Performance Bar</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EAE4D9]/60">
                  {sourceStats.map((src) => (
                    <tr key={src.source} className="hover:bg-[#FAF8F5]">
                      <td className="py-3 px-4 font-poppins font-bold text-[#0C141F]">{src.source}</td>
                      <td className="py-3 px-3 text-stone-700">{src.inquiries}</td>
                      <td className="py-3 px-3 font-semibold text-[#8C6228]">{src.deals}</td>
                      <td className="py-3 px-3">
                        <span className="font-bold text-[#0C141F]">{src.rate}%</span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="w-28 h-2 bg-[#F2EDE4] rounded-full overflow-hidden ml-auto">
                          <div
                            className="h-full bg-[#C59B63] rounded-full"
                            style={{ width: `${Math.min(100, src.rate * 3)}%` }}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Site Visit Outcomes Bar */}
        <Card className="border-[#EAE4D9] bg-white">
          <CardHeader className="pb-3">
            <CardTitle>Site Tour Success Metrics</CardTitle>
            <p className="text-xs text-stone-500 mt-0.5">Physical property showing execution</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 pt-2 text-xs">
              {visitStatusData.map((item) => (
                <div key={item.name} className="space-y-1.5">
                  <div className="flex items-center justify-between font-medium">
                    <span className="text-stone-700">{item.name}</span>
                    <strong className="text-[#0C141F]">{item.count} Tours</strong>
                  </div>
                  <div className="w-full h-2.5 bg-[#F2EDE4] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        backgroundColor: item.fill,
                        width: `${Math.min(100, (item.count / siteVisits.length) * 100)}%`,
                      }}
                    />
                  </div>
                </div>
              ))}

              <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#EAE4D9] mt-4 text-[11px] text-stone-600 space-y-1">
                <span className="font-poppins font-bold text-[#0C141F] block">Site Visit Insights</span>
                <p>
                  Tours completed with 4+ star customer satisfaction produce a <strong className="text-[#8C6228]">42% faster booking cycle</strong> within 10 days.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Row 3: Full Sales Team Quota & Volume Table */}
      <Card className="border-[#EAE4D9] bg-white">
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <div>
            <CardTitle>Executive Quota & Revenue Realization Leaderboard</CardTitle>
            <p className="text-xs text-stone-500 mt-0.5">Comprehensive team quota metrics</p>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-y border-[#EAE4D9] bg-[#FAF5EC]/60 text-stone-600 font-poppins font-semibold uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4">Rank & Executive</th>
                  <th className="py-3 px-3">Role & Division</th>
                  <th className="py-3 px-3">Active Pipeline</th>
                  <th className="py-3 px-3">Deals Converted</th>
                  <th className="py-3 px-3">Total Sales Value</th>
                  <th className="py-3 px-4 text-right">Quota Fulfillment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EAE4D9]/60">
                {agentRanks.map((ag, index) => {
                  const quotaTarget = 500000000; // 50 Cr Target
                  const fulfillmentPct = Math.min(100, Math.round((ag.totalSalesValue / quotaTarget) * 100));

                  return (
                    <tr key={ag.id} className="hover:bg-[#FAF8F5]">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <span className="w-5 font-poppins font-bold text-[#C59B63]">#{index + 1}</span>
                          <img
                            src={ag.avatar}
                            alt={ag.name}
                            className="w-8 h-8 rounded-full object-cover ring-1 ring-[#EAE4D9]"
                          />
                          <div>
                            <p className="font-poppins font-bold text-[#0C141F]">{ag.name}</p>
                            <p className="text-[10px] text-stone-400">{ag.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-stone-700">
                        <span className="font-semibold">{ag.role}</span>
                        <span className="block text-[10px] text-stone-400">{ag.department}</span>
                      </td>
                      <td className="py-3 px-3 font-semibold text-stone-800">{ag.activeLeadsCount} Leads</td>
                      <td className="py-3 px-3 font-bold text-emerald-700">{ag.convertedLeadsCount} Units</td>
                      <td className="py-3 px-3 font-poppins font-extrabold text-[#0C141F]">{formatINR(ag.totalSalesValue)}</td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <span className="font-semibold text-stone-800 text-[11px]">{fulfillmentPct}%</span>
                          <div className="w-20 h-2 bg-[#F2EDE4] rounded-full overflow-hidden">
                            <div
                              className="h-full bg-[#C59B63] rounded-full"
                              style={{ width: `${fulfillmentPct}%` }}
                            />
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
